// ============================================================
// Square 請求書の発行 API
//
// ログイン中のお客さまのリクエストで、Square の Invoices API を呼び出し
// 「請求書の作成 → 公開（publish）」を行います。公開すると Square が
// 自動的に請求書メールをお客さまへ送信します。
//
// POST /api/square/invoice
//   Authorization: Bearer <Firebase ID トークン>
//   body: { "kind": "project" | "subscription" }
// ============================================================
import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { SquareError } from "square";
import {
  adminAuth,
  adminDb,
  bearerToken,
  isFirebaseAdminConfigured,
} from "@/lib/firebase-admin";
import {
  createAndPublishInvoice,
  ensureSquareCustomer,
  invoiceDueDate,
  isSquareConfigured,
  type InvoiceLineItem,
} from "@/lib/square";
import {
  basePlanName,
  maintenanceSubscriptionPrice,
  type Order,
  type SquareInvoiceInfo,
  yen,
} from "@/lib/model";
import { site } from "@/lib/site";

export const runtime = "nodejs";

type InvoiceKind = "project" | "subscription";

/** 作り直しが必要な（再利用できない）ステータス */
const REISSUABLE_STATUSES = new Set([
  "CANCELED",
  "FAILED",
  "REFUNDED",
  "PARTIALLY_REFUNDED",
]);

function errorResponse(message: string, status: number) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

/** Square のエラーから表示用のメッセージを作ります */
function squareErrorMessage(error: unknown) {
  if (error instanceof SquareError) {
    const details = error.errors
      .map((item) => item.detail || item.code)
      .filter((detail): detail is string => Boolean(detail));
    if (details.length > 0) return details.join(" / ");
  }
  return error instanceof Error ? error.message : "不明なエラーが発生しました。";
}

export async function POST(request: Request) {
  if (!isSquareConfigured) {
    console.error(
      "Square の設定が不足しています。.env.local の SQUARE_ACCESS_TOKEN / SQUARE_LOCATION_ID を確認してください。",
    );
    return errorResponse(
      "決済の準備が完了していません。しばらくお待ちください。",
      503,
    );
  }
  if (!isFirebaseAdminConfigured) {
    console.error(
      "Firebase Admin の設定が不足しています。.env.local の FIREBASE_SERVICE_ACCOUNT_KEY などを確認してください。",
    );
    return errorResponse(
      "決済の準備が完了していません。しばらくお待ちください。",
      503,
    );
  }

  const token = bearerToken(request);
  if (!token) {
    return errorResponse("ログインが必要です。", 401);
  }
  const auth = adminAuth();
  const db = adminDb();
  if (!auth || !db) {
    return errorResponse(
      "決済の準備が完了していません。しばらくお待ちください。",
      503,
    );
  }

  let uid: string;
  let email: string;
  let displayName: string | undefined;
  try {
    const decoded = await auth.verifyIdToken(token);
    uid = decoded.uid;
    email = decoded.email ?? "";
    displayName = decoded.name;
  } catch {
    return errorResponse(
      "ログイン情報を確認できませんでした。再度ログインしてください。",
      401,
    );
  }

  const body = (await request.json().catch(() => ({}))) as { kind?: unknown };
  const kind: InvoiceKind | null =
    body.kind === "project"
      ? "project"
      : body.kind === "subscription"
        ? "subscription"
        : null;
  if (!kind) {
    return errorResponse("請求内容の指定が正しくありません。", 400);
  }

  if (!email) {
    return errorResponse(
      "請求書の送信先メールアドレスが取得できませんでした。Google アカウントでログインしてください。",
      400,
    );
  }

  const orderRef = db.collection("orders").doc(uid);
  const snapshot = await orderRef.get();
  if (!snapshot.exists) {
    return errorResponse(
      "購入内容がまだ設定されていません。運営者からのご案内をお待ちください。",
      404,
    );
  }
  const order = snapshot.data() as Order;

  const invoiceField: "projectInvoice" | "subscriptionInvoice" =
    kind === "project" ? "projectInvoice" : "subscriptionInvoice";
  const existingInvoice = order[invoiceField];

  // ---- すでに支払い済みの場合は二重請求しない ----
  if (kind === "project" && order.paymentStatus === "paid") {
    return errorResponse("本契約のお支払いは完了しています。", 409);
  }
  if (kind === "subscription" && order.subscriptionStatus === "paid") {
    return errorResponse("維持費サブスクのお支払いは完了しています。", 409);
  }

  // ---- 運営者による許可が必要 ----
  if (kind === "project" && !order.purchaseApproved) {
    return errorResponse(
      "購入許可がまだ設定されていません。運営者からのご案内をお待ちください。",
      403,
    );
  }
  if (kind === "subscription" && !order.subscriptionApproved) {
    return errorResponse(
      "維持費サブスクの許可がまだ設定されていません。",
      403,
    );
  }

  // ---- 発行済みの請求書は再利用する（二重発行の防止） ----
  if (
    existingInvoice?.id &&
    !REISSUABLE_STATUSES.has(existingInvoice.status ?? "")
  ) {
    return NextResponse.json({
      ok: true,
      reused: true,
      invoice: existingInvoice,
      message: "発行済みの請求書をご案内しています。メールをご確認ください。",
    });
  }

  // ---- 請求内容を組み立てる ----
  const lineItems: InvoiceLineItem[] =
    kind === "project"
      ? [
          { name: basePlanName, amount: order.basePrice },
          ...order.options.map((option) => ({
            name: option.name,
            amount: option.price,
          })),
        ]
      : [
          {
            name: "維持費サポート（月額）",
            amount: order.subscriptionPrice ?? maintenanceSubscriptionPrice,
          },
        ];
  const amount = lineItems.reduce((sum, item) => sum + item.amount, 0);
  if (amount <= 0) {
    return errorResponse(
      "請求金額が確定していません。運営者にお問い合わせください。",
      400,
    );
  }

  const dueDate = invoiceDueDate();
  const title =
    kind === "project"
      ? `${site.name} ホームページ制作 ご契約代金`
      : `${site.name} 維持費サポート（月額）`;
  const description =
    kind === "project"
      ? `ホームページ制作のご契約代金（前払い）です。${yen(amount)}`
      : `サイト公開後の維持・更新サポートの月額費用です。${yen(amount)}`;

  try {
    // ---- 1. Square の顧客を用意する ----
    const customerId =
      order.squareCustomerId ??
      (await ensureSquareCustomer({
        uid,
        email,
        givenName: displayName,
      }));

    // ---- 2. 請求書を作成 → 公開（Square がお客さまへメール送信） ----
    const invoice: SquareInvoiceInfo = await createAndPublishInvoice({
      uid,
      customerId,
      lineItems,
      title,
      description,
      dueDate,
    });

    // ---- 3. Firestore に記録する（クライアントからは書き込み不可） ----
    await orderRef.set(
      {
        uid,
        squareCustomerId: customerId,
        [invoiceField]: invoice,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );

    // ---- 4. Webhook から顧客を特定するための対応表 ----
    await db
      .collection("square_invoices")
      .doc(invoice.id)
      .set(
        {
          uid,
          kind,
          invoiceId: invoice.id,
          squareOrderId: invoice.orderId ?? "",
          amount,
          dueDate,
          createdAt: FieldValue.serverTimestamp(),
        },
        { merge: true },
      );

    return NextResponse.json({
      ok: true,
      reused: false,
      invoice,
      message: `請求書をメールで送信しました（${email}）。支払期限は ${dueDate} です。`,
    });
  } catch (error) {
    console.error("Square 請求書の発行に失敗しました:", error);
    return errorResponse(
      `請求書の発行に失敗しました。${squareErrorMessage(error)}`,
      502,
    );
  }
}