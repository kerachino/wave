// ============================================================
// Square（決済）連携 — サーバー専用
//
// 1. アプリから請求書を作成・公開（publish）すると、Square が
//    お客さまへ請求書メールを自動送信します。
// 2. お客さまがお支払いを完了すると、Square から Webhook
//    （invoice.payment_made）が `app/api/square/webhook/route.ts` に届きます。
// 3. Webhook の署名を検証したうえで、該当顧客の制限を解除します。
//
// `.env.local` に SQUARE_ACCESS_TOKEN / SQUARE_LOCATION_ID などを設定してください。
// このファイルはサーバー側（Route Handler）からのみ import してください。
// ============================================================
import { randomUUID } from "node:crypto";
import { SquareClient, SquareEnvironment, WebhooksHelper } from "square";
import { site } from "@/lib/site";
import type { SquareInvoiceInfo } from "@/lib/model";

// 本サービスは日本国内向けのため、通貨は JPY（円）に固定します。
const CURRENCY = "JPY";

const accessToken = process.env.SQUARE_ACCESS_TOKEN;
const locationId = process.env.SQUARE_LOCATION_ID;
const signatureKey = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY;

const environment =
  process.env.SQUARE_ENVIRONMENT === "production"
    ? SquareEnvironment.Production
    : SquareEnvironment.Sandbox;

/** アクセストークンとロケーションIDが揃っていれば Square を利用できます。 */
export const isSquareConfigured = Boolean(accessToken && locationId);

/**
 * 管理者用診断: どの環境変数が欠けているか（値そのものは返さない）。
 * 公開APIのエラーコード切り分けと /api/admin/diagnostics から利用します。
 */
export function squareConfigStatus() {
  return {
    configured: isSquareConfigured,
    hasAccessToken: Boolean(accessToken),
    hasLocationId: Boolean(locationId),
    hasWebhookSignatureKey: Boolean(signatureKey),
    environment:
      process.env.SQUARE_ENVIRONMENT === "production"
        ? "production"
        : "sandbox",
  };
}

/** Webhook の署名検証用キーが設定されていれば Webhook を受け付けます。 */
export const isSquareWebhookConfigured = Boolean(signatureKey);

/** Square に登録した Webhook の通知 URL（署名検証で一致が必要） */
export function squareWebhookUrl() {
  const explicit = process.env.SQUARE_WEBHOOK_NOTIFICATION_URL;
  if (explicit && explicit.trim() !== "") return explicit.trim();
  const base = (process.env.NEXT_PUBLIC_SITE_URL || site.url).replace(/\/+$/, "");
  return `${base}/api/square/webhook`;
}

let client: SquareClient | null = null;

/** Square クライアント（サーバー専用・遅延初期化） */
export function squareClient(): SquareClient {
  if (!isSquareConfigured) {
    throw new Error(
      "Square の設定が未完了です（SQUARE_ACCESS_TOKEN / SQUARE_LOCATION_ID）。",
    );
  }
  if (!client) {
    client = new SquareClient({ token: accessToken, environment });
  }
  return client;
}

/**
 * 請求書の支払期限（YYYY-MM-DD・日本時間）を返します。
 * 期限日数は `SQUARE_INVOICE_DUE_DAYS`（既定 14 日）で変更できます。
 */
export function invoiceDueDate(daysAhead?: number) {
  const configured = Number(process.env.SQUARE_INVOICE_DUE_DAYS || 14);
  const days =
    daysAhead ??
    (Number.isFinite(configured) && configured > 0 ? configured : 14);
  const due = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Tokyo" }).format(due);
}

/**
 * Webhook が本当に Square から送られたものかを検証します。
 * 失敗した場合はリクエストを破棄してください。
 */
export async function verifySquareSignature(
  requestBody: string,
  signatureHeader: string | null,
): Promise<boolean> {
  if (!signatureKey || !signatureHeader) return false;
  try {
    return await WebhooksHelper.verifySignature({
      requestBody,
      signatureHeader,
      signatureKey,
      notificationUrl: squareWebhookUrl(),
    });
  } catch (error) {
    console.error("Square Webhook の署名検証に失敗しました:", error);
    return false;
  }
}

/** Square 側の顧客プロフィールを作成（uid ごとに 1 回だけ作成します） */
export async function ensureSquareCustomer(input: {
  uid: string;
  email: string;
  givenName?: string;
  companyName?: string;
}): Promise<string> {
  const response = await squareClient().customers.create({
    // uid ごとに固定のキーを使い、二重作成を防ぎます。
    idempotencyKey: `hatono-customer-${input.uid}`,
    emailAddress: input.email,
    givenName: input.givenName?.slice(0, 300) || undefined,
    companyName: input.companyName?.slice(0, 500) || undefined,
    referenceId: input.uid.slice(0, 100),
    note: `${site.name} のご契約者（uid: ${input.uid}）`,
  });
  const customerId = response.customer?.id;
  if (!customerId) {
    throw new Error("Square の顧客作成に失敗しました。");
  }
  return customerId;
}

export type InvoiceLineItem = { name: string; amount: number };

/**
 * 注文（Order）を作成し、その注文に対する請求書を下書き作成 → 公開します。
 * 公開すると Square がお客さまへ請求書メールを送信します。
 */
export async function createAndPublishInvoice(input: {
  uid: string;
  customerId: string;
  lineItems: InvoiceLineItem[];
  title: string;
  description?: string;
  dueDate: string;
}): Promise<SquareInvoiceInfo> {
  const items = input.lineItems.filter((item) => item.amount > 0);
  if (items.length === 0) {
    throw new Error("請求金額が 0 円のため請求書を作成できません。");
  }
  const total = items.reduce((sum, item) => sum + item.amount, 0);
  const client = squareClient();

  const orderResponse = await client.orders.create({
    idempotencyKey: randomUUID(),
    order: {
      locationId: locationId as string,
      customerId: input.customerId,
      referenceId: input.uid,
      lineItems: items.map((item) => ({
        name: item.name.slice(0, 512),
        quantity: "1",
        basePriceMoney: { amount: BigInt(item.amount), currency: CURRENCY },
      })),
    },
  });
  const orderId = orderResponse.order?.id;
  if (!orderId) {
    throw new Error("Square の注文作成に失敗しました。");
  }

  const invoiceResponse = await client.invoices.create({
    idempotencyKey: randomUUID(),
    invoice: {
      locationId: locationId as string,
      orderId,
      primaryRecipient: { customerId: input.customerId },
      // EMAIL を指定すると、公開時に Square から請求書メールが送信されます。
      deliveryMethod: "EMAIL",
      title: input.title.slice(0, 512),
      description: input.description?.slice(0, 65535),
      paymentRequests: [
        {
          requestType: "BALANCE",
          dueDate: input.dueDate,
          tippingEnabled: false,
        },
      ],
      acceptedPaymentMethods: { card: true },
      storePaymentMethodEnabled: true,
    },
  });
  const draft = invoiceResponse.invoice;
  if (!draft?.id || draft.version === undefined) {
    throw new Error("Square の請求書作成に失敗しました。");
  }

  const publishedResponse = await client.invoices.publish({
    invoiceId: draft.id,
    version: draft.version,
    idempotencyKey: randomUUID(),
  });
  const published = publishedResponse.invoice ?? draft;

  return {
    id: published.id ?? draft.id,
    orderId,
    publicUrl: published.publicUrl,
    status: published.status ?? "UNPAID",
    version: published.version ?? draft.version,
    amount: total,
    dueDate: input.dueDate,
    publishedAt: new Date().toISOString(),
  };
}

/**
 * 請求書のうち支払い済みの金額（円）を合計します。
 * Webhook の請求書オブジェクトは snake_case の素の JSON です。
 */
export function completedPaymentAmount(invoice: {
  payment_requests?:
    | {
        total_completed_amount_money?: { amount?: number | string } | null;
      }[]
    | null;
}): number {
  const requests = invoice.payment_requests ?? [];
  return requests.reduce((sum, request) => {
    const amount = Number(request.total_completed_amount_money?.amount ?? 0);
    return Number.isFinite(amount) ? sum + amount : sum;
  }, 0);
}