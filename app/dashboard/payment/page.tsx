"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import {
  maintenanceSubscriptionPrice,
  toDate,
  yen,
  type Order,
  type SquareInvoiceInfo,
} from "@/lib/model";

type PaymentTab = "project" | "subscription";
type InvoiceKind = "project" | "subscription";

export default function DashboardPaymentPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [tab, setTab] = useState<PaymentTab>("project");

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
    if (!user || !db || !isFirebaseConfigured) return;
    return onSnapshot(doc(db, "orders", user.uid), (snapshot) =>
      setOrder(snapshot.exists() ? (snapshot.data() as Order) : null),
    );
  }, [loading, user, router]);

  if (loading || !user)
    return <p className="text-sm text-ink-mute">読み込み中...</p>;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header>
        <p className="text-xs font-bold tracking-[0.18em] text-brand">PAYMENT</p>
        <h1 className="mt-2 font-maru text-3xl font-bold text-ink">お支払い</h1>
        <p className="mt-2 text-sm text-ink-soft">
          本契約は原則前払いです。ボタンを押すと Square
          からご請求書メールをお送りします。
        </p>
      </header>
      <nav className="flex gap-2 border-b border-line" aria-label="支払いメニュー">
        <button
          type="button"
          onClick={() => setTab("project")}
          className={`border-b-2 px-4 py-3 text-sm font-bold ${tab === "project" ? "border-brand text-brand" : "border-transparent text-ink-mute"}`}
        >
          本契約
        </button>
        <button
          type="button"
          onClick={() => setTab("subscription")}
          className={`border-b-2 px-4 py-3 text-sm font-bold ${tab === "subscription" ? "border-brand text-brand" : "border-transparent text-ink-mute"}`}
        >
          維持費サブスク
        </button>
      </nav>
      {!order ? (
        <section className="rounded-3xl border border-line bg-white p-8 shadow-card">
          <h2 className="font-maru text-xl font-bold text-ink">
            購入許可をお待ちください
          </h2>
          <p className="mt-3 text-sm leading-7 text-ink-soft">
            運営者が購入内容を設定すると、こちらに表示されます。
          </p>
        </section>
      ) : tab === "project" ? (
        <ProjectPayment order={order} />
      ) : (
        <SubscriptionPayment order={order} />
      )}
    </div>
  );
}

function ProjectPayment({ order }: { order: Order }) {
  const paid = order.paymentStatus === "paid";
  return (
    <section className="rounded-3xl border border-line bg-white p-6 shadow-card sm:p-8">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold tracking-[0.14em] text-brand">
            PROJECT PAYMENT
          </p>
          <h2 className="mt-2 font-maru text-xl font-bold text-ink">
            本契約のお支払い
          </h2>
        </div>
        <Status value={paid ? "支払い済み" : "未払い"} />
      </div>
      <div className="mt-6 space-y-3 text-sm">
        <Line label="基本プラン" value={yen(order.basePrice)} />
        {order.options.map((option) => (
          <Line key={option.id} label={option.name} value={yen(option.price)} />
        ))}
        <Line
          label="お支払い総額（前払い）"
          value={yen(order.totalPrice)}
          strong
        />
      </div>
      {paid ? (
        <PaidNotice
          paidAt={order.paidAt}
          amount={order.paidAmount ?? order.totalPrice}
        />
      ) : (
        <SquareInvoiceButton
          kind="project"
          label="Squareで請求書を受け取る"
          existing={order.projectInvoice}
        />
      )}
      <p className="mt-3 text-center text-xs text-ink-mute">
        制作開始前に全額をお支払いいただきます。お支払いの確認後、チャットなどの機能をご利用いただけます。
      </p>
    </section>
  );
}

function SubscriptionPayment({ order }: { order: Order }) {
  const approved = Boolean(order.subscriptionApproved);
  const paid = order.subscriptionStatus === "paid";
  return (
    <section className="rounded-3xl border border-line bg-white p-6 shadow-card sm:p-8">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold tracking-[0.14em] text-brand">
            MONTHLY SUPPORT
          </p>
          <h2 className="mt-2 font-maru text-xl font-bold text-ink">
            維持費サブスク
          </h2>
        </div>
        <Status
          value={approved ? (paid ? "支払い済み" : "許可済み・未払い") : "未許可"}
        />
      </div>
      <p className="mt-4 text-sm leading-7 text-ink-soft">
        サイト公開後の維持・更新サポートに必要な月額費用です。
      </p>
      {approved ? (
        <>
          <div className="mt-6 rounded-2xl bg-cream p-5">
            <p className="text-sm text-ink-soft">月額料金</p>
            <p className="mt-1 font-maru text-3xl font-bold text-ink">
              {yen(order.subscriptionPrice ?? maintenanceSubscriptionPrice)}
            </p>
          </div>
          {paid ? (
            <PaidNotice
              paidAt={order.paidAt}
              amount={
                order.paidAmount ??
                order.subscriptionPrice ??
                maintenanceSubscriptionPrice
              }
            />
          ) : (
            <SquareInvoiceButton
              kind="subscription"
              label="Squareで請求書を受け取る"
              existing={order.subscriptionInvoice}
            />
          )}
        </>
      ) : (
        <p className="mt-6 rounded-xl bg-cream px-4 py-3 text-sm text-ink-mute">
          運営者によるサブスク許可待ちです。
        </p>
      )}
    </section>
  );
}
function SquareInvoiceButton({
  kind,
  label,
  existing,
}: {
  kind: InvoiceKind;
  label: string;
  existing?: SquareInvoiceInfo;
}) {
  const { user } = useAuth();
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState<SquareInvoiceInfo | null>(null);
  // Firestore の内容（existing）を優先し、まだ反映されていない間は
  // API の応答（pending）を表示します。
  const invoice = existing ?? pending ?? undefined;

  async function requestInvoice() {
    if (!user || sending) return;
    setSending(true);
    setError("");
    setMessage("");
    try {
      const token = await user.getIdToken();
      const response = await fetch("/api/square/invoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ kind }),
      });
      const data = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        message?: string;
        invoice?: SquareInvoiceInfo;
      };
      if (!response.ok || !data.ok) {
        setError(
          data.error || "請求書の発行に失敗しました。時間をおいてお試しください。",
        );
        return;
      }
      if (data.invoice) setPending(data.invoice);
      setMessage(data.message || "請求書をメールで送信しました。");
    } catch {
      setError("通信に失敗しました。時間をおいてお試しください。");
    } finally {
      setSending(false);
    }
  }

  const unpaid =
    invoice &&
    !["PAID", "CANCELED", "FAILED", "REFUNDED"].includes(invoice.status ?? "");

  return (
    <div className="mt-7">
      <button
        type="button"
        onClick={requestInvoice}
        disabled={sending || !user}
        className="w-full rounded-full bg-brand px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-dark disabled:opacity-60"
      >
        {sending
          ? "請求書を発行しています..."
          : invoice
            ? "発行済みの請求書を確認する"
            : label}
      </button>
      {message && (
        <p className="mt-3 rounded-xl bg-brand-soft px-4 py-3 text-xs text-brand-deep">
          {message}
        </p>
      )}
      {error && (
        <p className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-xs text-red-600">
          {error}
        </p>
      )}
      {invoice && (
        <div className="mt-3 space-y-1 text-xs text-ink-soft">
          <p>
            請求書番号: <span className="font-mono">{invoice.id}</span>
          </p>
          {invoice.dueDate && <p>支払期限: {invoice.dueDate}</p>}
          <p>ステータス: {invoiceStatusLabel(invoice.status)}</p>
          {unpaid && invoice.publicUrl && (
            <a
              href={invoice.publicUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-block font-bold text-brand hover:text-brand-deep"
            >
              Squareの決済ページを開く
            </a>
          )}
        </div>
      )}
      <p className="mt-3 text-center text-xs text-ink-mute">
        請求書は Square からメールで届きます。お支払いの確認後、自動的に制限が解除されます。
      </p>
    </div>
  );
}

function invoiceStatusLabel(status?: string) {
  switch (status) {
    case "DRAFT":
      return "下書き";
    case "UNPAID":
      return "未払い";
    case "SCHEDULED":
      return "送信予約";
    case "PARTIALLY_PAID":
      return "一部入金";
    case "PAID":
      return "支払い済み";
    case "CANCELED":
      return "キャンセル";
    case "FAILED":
      return "失敗";
    case "REFUNDED":
      return "返金済み";
    default:
      return status ?? "未払い";
  }
}

function Line({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div
      className={`flex justify-between gap-4 ${strong ? "border-t border-line pt-3 font-bold text-brand" : "text-ink"}`}
    >
      <span className={strong ? "" : "text-ink-soft"}>{label}</span>
      <span>{value}</span>
    </div>
  );
}

function Status({ value }: { value: string }) {
  return (
    <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-bold text-brand-deep">
      {value}
    </span>
  );
}

function PaidNotice({ paidAt, amount }: { paidAt?: unknown; amount: number }) {
  const date = toDate(paidAt);
  return (
    <div className="mt-7 rounded-2xl bg-brand-soft px-5 py-4 text-sm text-brand-deep">
      <p className="font-bold">お支払いを確認しました（{yen(amount)}）</p>
      <p className="mt-1 text-xs">
        {date ? `${date.toLocaleString("ja-JP")} に確認` : "お支払い確認済み"}
        ／利用制限は解除されています。
      </p>
    </div>
  );
}
