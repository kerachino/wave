// ============================================================
// Square Webhook の受け口
//
// Square でお支払いが完了すると `invoice.payment_made` が届きます。
// 1. 署名（x-square-hmacsha256-signature）を検証する
// 2. 請求書に対応する顧客（orders/{uid}）を特定する
// 3. 支払い済みとして記録し、制限を解除する（accessUnlocked = true）
//
// 通知URLの例: https://hatonoconnect.jp/api/square/webhook
// Square の Webhook サブスクリプションに登録した URL と
// `SQUARE_WEBHOOK_NOTIFICATION_URL`（未設定なら NEXT_PUBLIC_SITE_URL + パス）を
// 一致させてください。一致しないと署名検証に失敗します。
// ============================================================
import { NextResponse } from "next/server";
import { FieldValue, type Firestore } from "firebase-admin/firestore";
import { adminDb, isFirebaseAdminConfigured } from "@/lib/firebase-admin";
import {
  completedPaymentAmount,
  isSquareWebhookConfigured,
  verifySquareSignature,
} from "@/lib/square";
import type { Order, SquareInvoiceInfo } from "@/lib/model";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type WebhookInvoice = {
  id?: string;
  status?: string;
  order_id?: string;
  location_id?: string;
  public_url?: string;
  payment_requests?:
    | { total_completed_amount_money?: { amount?: number | string } | null }[]
    | null;
};

type SquareWebhookEvent = {
  type?: string;
  event_id?: string;
  merchant_id?: string;
  data?: {
    type?: string;
    id?: string;
    object?: { invoice?: WebhookInvoice };
  };
};

type InvoiceTarget = {
  uid: string;
  kind: "project" | "subscription";
};

/** Webhook の請求書IDから、対象のお客さま（orders/{uid}）を特定します */
async function findInvoiceTarget(
  db: Firestore,
  invoiceId: string,
): Promise<InvoiceTarget | null> {
  // 請求書発行時に作成した対応表（square_invoices/{invoiceId}）
  const mapping = await db.collection("square_invoices").doc(invoiceId).get();
  if (mapping.exists) {
    const data = mapping.data() as { uid?: string; kind?: string };
    if (data.uid) {
      return {
        uid: data.uid,
        kind: data.kind === "subscription" ? "subscription" : "project",
      };
    }
  }

  // 対応表がない場合の保険（orders の請求書情報から探す）
  for (const [field, kind] of [
    ["projectInvoice", "project"],
    ["subscriptionInvoice", "subscription"],
  ] as const) {
    const found = await db
      .collection("orders")
      .where(`${field}.id`, "==", invoiceId)
      .limit(1)
      .get();
    if (!found.empty) {
      return { uid: found.docs[0].id, kind };
    }
  }
  return null;
}

/** 保存済みの請求書情報に、Webhook の最新ステータスを重ねます */
function mergeInvoice(
  current: SquareInvoiceInfo | undefined,
  invoiceId: string,
  invoice: WebhookInvoice,
  extra: Partial<SquareInvoiceInfo>,
): SquareInvoiceInfo {
  return {
    ...(current ?? { id: invoiceId, amount: 0 }),
    id: invoiceId,
    orderId: invoice.order_id ?? current?.orderId,
    publicUrl: invoice.public_url ?? current?.publicUrl,
    status: invoice.status ?? current?.status,
    ...extra,
  };
}

export async function POST(request: Request) {
  if (!isSquareWebhookConfigured || !isFirebaseAdminConfigured) {
    console.error(
      "Square Webhook の設定が不足しています（SQUARE_WEBHOOK_SIGNATURE_KEY / FIREBASE_SERVICE_ACCOUNT_KEY）。",
    );
    return new NextResponse("webhook not configured", { status: 503 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get("x-square-hmacsha256-signature");
  const valid = await verifySquareSignature(rawBody, signature);
  if (!valid) {
    console.error("Square Webhook の署名が不正なため破棄しました。");
    return new NextResponse("invalid signature", { status: 403 });
  }

  let event: SquareWebhookEvent;
  try {
    event = JSON.parse(rawBody) as SquareWebhookEvent;
  } catch {
    return new NextResponse("invalid payload", { status: 400 });
  }

  const invoice = event.data?.object?.invoice;
  const invoiceId = invoice?.id;
  if (!invoiceId) {
    // 請求書以外のイベントはそのまま受け付けます
    return new NextResponse("ok", { status: 200 });
  }

  const db = adminDb();
  if (!db) {
    return new NextResponse("webhook not configured", { status: 503 });
  }

  const target = await findInvoiceTarget(db, invoiceId);
  if (!target) {
    console.error("Webhook の対象顧客が見つかりませんでした:", {
      invoiceId,
      type: event.type,
    });
    // 対応表がない請求書（手動発行など）は再送しても解決しないため 200 を返します
    return new NextResponse("unknown invoice", { status: 200 });
  }

  const orderRef = db.collection("orders").doc(target.uid);
  const snapshot = await orderRef.get();
  if (!snapshot.exists) {
    console.error("Webhook の対象注文が見つかりませんでした:", {
      uid: target.uid,
      invoiceId,
    });
    return new NextResponse("unknown order", { status: 200 });
  }
  const order = snapshot.data() as Order;
  const field =
    target.kind === "subscription" ? "subscriptionInvoice" : "projectInvoice";
  const now = FieldValue.serverTimestamp();

  // ---- お支払い完了（invoice.payment_made） ----
  if (event.type === "invoice.payment_made") {
    // 同じイベントが再送されても安全（すでに解除済みなら何もしない）
    const alreadyUnlocked =
      order.accessUnlocked === true &&
      (target.kind === "subscription"
        ? order.subscriptionStatus === "paid"
        : order.paymentStatus === "paid");
    if (alreadyUnlocked) {
      return new NextResponse("ok", { status: 200 });
    }

    const paidAmount =
      completedPaymentAmount(invoice) || order[field]?.amount || 0;
    // 保存済みの請求書情報へ、Webhook の内容（支払い日時・金額）を重ねる
    const invoiceUpdate: Partial<SquareInvoiceInfo> = {
      paidAt: new Date().toISOString(),
    };
    if (paidAmount > 0) invoiceUpdate.amount = paidAmount;

    const update: Record<string, unknown> = {
      paymentProvider: "square",
      paidAt: now,
      paidAmount,
      // ---- 制限解除（チャットなどの利用制限を解除します） ----
      accessUnlocked: true,
      accessUnlockedAt: now,
      updatedAt: now,
      [field]: mergeInvoice(order[field], invoiceId, invoice, invoiceUpdate),
    };
    if (target.kind === "subscription") {
      update.subscriptionStatus = "paid";
    } else {
      update.paymentStatus = "paid";
      update.status = "contracted";
    }
    await orderRef.set(update, { merge: true });
    console.log("お支払いを確認し、制限を解除しました:", {
      uid: target.uid,
      kind: target.kind,
      paidAmount,
    });
    return new NextResponse("ok", { status: 200 });
  }

  // ---- 請求書のキャンセル・削除（再発行できるようにステータスを合わせる） ----
  if (event.type === "invoice.canceled" || event.type === "invoice.deleted") {
    await orderRef.set(
      {
        [field]: mergeInvoice(order[field], invoiceId, invoice, {
          status: invoice.status ?? "CANCELED",
        }),
        updatedAt: now,
      },
      { merge: true },
    );
    return new NextResponse("ok", { status: 200 });
  }

  console.log("未対応の Square Webhook イベントを受信しました:", event.type);
  return new NextResponse("ok", { status: 200 });
}