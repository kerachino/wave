"use client";

// ============================================================
// お支払い（購入）画面
//
// ・購入前に「業務委託の取引条件」8項目を明示します（lib/contract.ts）。
// ・同意チェックが入っていないと購入ボタンは押せません。
// ・購入時はサーバー（/api/square/invoice）が同意ログ
//   （いつ・誰が・何に同意したか）を記録します。
// ============================================================

import Link from "next/link";
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
  type PurchaseConsent,
  type SquareInvoiceInfo,
} from "@/lib/model";
import {
  buildContractDisclosures,
  contractTerms,
  contractVersion,
  contractVersionLabel,
  formatContractDateTime,
  type ContractDisclosure,
} from "@/lib/contract";

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

  // 発注者（お客さま）の名称は、運営者が設定した値 → Google アカウントの順に使います。
  const customerName =
    order?.customerName || user.displayName || user.email || "お客さま";
  const customerEmail = user.email ?? "";

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header>
        <p className="text-xs font-bold tracking-[0.18em] text-brand">PAYMENT</p>
        <h1 className="mt-2 font-maru text-3xl font-bold text-ink">お支払い</h1>
        <p className="mt-2 text-sm text-ink-soft">
          本契約は原則前払いです。下記の取引条件をご確認のうえ、
          <span className="font-bold text-ink">同意して購入</span>
          してください。ボタンを押すと Square からご請求書メールをお送りします。
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
            運営者が購入内容と取引条件を設定すると、こちらに表示されます。
          </p>
        </section>
      ) : tab === "project" ? (
        <ProjectPayment
          order={order}
          customerName={customerName}
          customerEmail={customerEmail}
        />
      ) : (
        <SubscriptionPayment
          order={order}
          customerName={customerName}
          customerEmail={customerEmail}
        />
      )}
    </div>
  );
}

function ProjectPayment({
  order,
  customerName,
  customerEmail,
}: {
  order: Order;
  customerName: string;
  customerEmail: string;
}) {
  const paid = order.paymentStatus === "paid";
  const consent = order.projectConsent;
  const [agreed, setAgreed] = useState(false);
  const disclosures = buildContractDisclosures({
    kind: "project",
    order,
    customerName,
    customerEmail,
    agreedAt: consent?.agreedAt,
    dueDate: order.projectInvoice?.dueDate,
  });

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
        {(order.options ?? []).map((option) => (
          <Line key={option.id} label={option.name} value={yen(option.price)} />
        ))}
        <Line
          label="お支払い総額（前払い）"
          value={yen(order.totalPrice)}
          strong
        />
      </div>
      <ContractTermsBlock
        disclosures={disclosures}
        consent={consent}
        agreed={agreed}
        onAgreedChange={setAgreed}
      >
        {paid ? (
          <PaidNotice
            paidAt={order.paidAt}
            amount={order.paidAmount ?? order.totalPrice}
          />
        ) : (
          <SquareInvoiceButton
            kind="project"
            label="同意して購入する"
            existing={order.projectInvoice}
            agreed={agreed}
          />
        )}
      </ContractTermsBlock>
      <p className="mt-3 text-center text-xs text-ink-mute">
        制作開始前に全額をお支払いいただきます。お支払いの確認後、チャットなどの機能をご利用いただけます。
      </p>
    </section>
  );
}

function SubscriptionPayment({
  order,
  customerName,
  customerEmail,
}: {
  order: Order;
  customerName: string;
  customerEmail: string;
}) {
  const approved = Boolean(order.subscriptionApproved);
  const paid = order.subscriptionStatus === "paid";
  const consent = order.subscriptionConsent;
  const [agreed, setAgreed] = useState(false);
  const disclosures = buildContractDisclosures({
    kind: "subscription",
    order,
    customerName,
    customerEmail,
    agreedAt: consent?.agreedAt,
    dueDate: order.subscriptionInvoice?.dueDate,
  });

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
          <ContractTermsBlock
            disclosures={disclosures}
            consent={consent}
            agreed={agreed}
            onAgreedChange={setAgreed}
          >
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
                label="同意して申し込む"
                existing={order.subscriptionInvoice}
                agreed={agreed}
              />
            )}
          </ContractTermsBlock>
        </>
      ) : (
        <p className="mt-6 rounded-xl bg-cream px-4 py-3 text-sm text-ink-mute">
          運営者によるサブスク許可待ちです。
        </p>
      )}
    </section>
  );
}



/**
 * 取引条件の明示（8項目）＋契約条件・注意事項＋同意チェック＋同意ログ。
 * 購入ボタンは children として受け取ります（同意チェックがないと押せません）。
 */
function ContractTermsBlock({
  disclosures,
  consent,
  agreed,
  onAgreedChange,
  children,
}: {
  disclosures: ContractDisclosure[];
  consent?: PurchaseConsent;
  agreed: boolean;
  onAgreedChange: (value: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-8 space-y-5">
      <section aria-labelledby="contract-disclosure-heading">
        <h3
          id="contract-disclosure-heading"
          className="font-maru text-base font-bold text-ink"
        >
          取引条件の明示（全8項目）
        </h3>
        <p className="mt-1 text-xs leading-6 text-ink-mute">
          業務委託の取引条件として、以下を明示します。
          <span className="font-bold text-brand-deep">
            {contractVersionLabel}
          </span>
        </p>
        <dl className="mt-4 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-cream/40">
          {disclosures.map((item) => (
            <div
              key={item.no}
              className="grid gap-1.5 px-4 py-3.5 sm:grid-cols-[11rem_1fr] sm:gap-4"
            >
              <dt className="flex items-start gap-2 text-xs font-bold leading-6 text-ink-mute">
                <span
                  aria-hidden="true"
                  className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-brand-soft text-[10px] font-bold text-brand-deep"
                >
                  {item.no}
                </span>
                {item.label}
              </dt>
              <dd className="text-sm leading-7 text-ink">
                <p className="whitespace-pre-line">{item.value}</p>
                {item.note && (
                  <p className="mt-1 text-xs leading-6 text-ink-mute">
                    {item.note}
                  </p>
                )}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <details className="group rounded-2xl border border-line bg-white">
        <summary className="flex cursor-pointer items-center justify-between gap-3 px-4 py-3.5 text-left text-sm font-bold text-ink">
          契約条件・注意事項（詳細）
          <svg
            viewBox="0 0 24 24"
            className="size-5 shrink-0 text-brand transition-transform group-open:rotate-180"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </summary>
        <div className="space-y-4 border-t border-line px-4 py-4">
          {contractTerms.map((term) => (
            <div key={term.title}>
              <p className="text-xs font-bold text-ink">{term.title}</p>
              <p className="mt-1 text-xs leading-6 text-ink-soft">
                {term.body}
              </p>
            </div>
          ))}
          <p className="border-t border-line pt-3 text-xs leading-6 text-ink-mute">
            詳しくは
            <Link
              href="/terms"
              className="font-bold text-brand hover:text-brand-deep"
            >
              利用規約
            </Link>
            ・
            <Link
              href="/law"
              className="font-bold text-brand hover:text-brand-deep"
            >
              特定商取引法に基づく表記
            </Link>
            ・
            <Link
              href="/privacy"
              className="font-bold text-brand hover:text-brand-deep"
            >
              プライバシーポリシー
            </Link>
            をご覧ください。
          </p>
        </div>
      </details>

      <div className="rounded-2xl border-2 border-brand/40 bg-brand-soft/40 p-4 sm:p-5">
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(event) => onAgreedChange(event.target.checked)}
            aria-describedby="contract-consent-note"
            className="mt-1 size-5 shrink-0 accent-brand"
          />
          <span className="text-sm leading-7 text-ink">
            上記の取引条件（全8項目）と契約条件・注意事項、
            <Link
              href="/terms"
              className="font-bold text-brand hover:text-brand-deep"
            >
              利用規約
            </Link>
            ・
            <Link
              href="/law"
              className="font-bold text-brand hover:text-brand-deep"
            >
              特定商取引法に基づく表記
            </Link>
            ・
            <Link
              href="/privacy"
              className="font-bold text-brand hover:text-brand-deep"
            >
              プライバシーポリシー
            </Link>
            に同意します。
          </span>
        </label>
        <p
          id="contract-consent-note"
          className="mt-2 text-xs leading-6 text-ink-mute"
        >
          同意すると購入ボタンが押せるようになります。同意した日時・バージョン・お客さまの識別情報・明示した内容は、同意ログとしてサーバーに記録します。
        </p>
        {children}
      </div>

      <ConsentLog consent={consent} />
    </div>
  );
}

/** 同意ログ（いつ・誰が・何に同意したか）の表示 */
function ConsentLog({ consent }: { consent?: PurchaseConsent }) {
  if (!consent) return null;
  const agreedAt =
    formatContractDateTime(consent.agreedAt) || consent.agreedAtIso || "";
  const amount =
    typeof consent.amount === "number" ? yen(consent.amount) : "未確定";
  return (
    <div className="rounded-2xl border border-line bg-cream px-4 py-3.5 text-xs leading-6 text-ink-soft">
      <p className="font-bold text-ink">同意ログを記録しました</p>
      <dl className="mt-2 grid gap-x-3 gap-y-1 sm:grid-cols-[8rem_1fr]">
        <dt>同意日時</dt>
        <dd className="font-bold text-ink">
          {agreedAt ? `${agreedAt}（JST）` : "記録中"}
        </dd>
        <dt>同意者</dt>
        <dd>
          {consent.email}
          {consent.uid ? `（UID: ${consent.uid}）` : ""}
        </dd>
        <dt>同意した条件</dt>
        <dd>{`取引条件 v${consent.version}`}</dd>
        <dt>同意した金額</dt>
        <dd>{amount}</dd>
      </dl>
      <p className="mt-2 text-[11px] leading-5 text-ink-mute">
        同意日時はサーバー時刻で保存され、お客さまは変更できません。
      </p>
    </div>
  );
}

function SquareInvoiceButton({
  kind,
  label,
  existing,
  agreed,
}: {
  kind: InvoiceKind;
  label: string;
  existing?: SquareInvoiceInfo;
  agreed: boolean;
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
    // 契約条件に同意していない場合は送信しません（ボタンも押せません）。
    if (!user || sending || !agreed) return;
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
        // agreed / version はサーバー側の同意チェックに使われます。
        body: JSON.stringify({ kind, agreed, version: contractVersion }),
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
    <div className="mt-5">
      <button
        type="button"
        onClick={requestInvoice}
        disabled={sending || !user || !agreed}
        title={agreed ? undefined : "契約条件への同意が必要です"}
        className="w-full rounded-full bg-brand px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {sending
          ? "請求書を発行しています..."
          : invoice
            ? "発行済みの請求書を確認する"
            : label}
      </button>
      {!agreed && (
        <p className="mt-2 text-center text-xs text-ink-mute">
          上のチェックボックスで契約条件に同意すると押せるようになります。
        </p>
      )}
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
    <div className="mt-5 rounded-2xl bg-brand-soft px-5 py-4 text-sm text-brand-deep">
      <p className="font-bold">お支払いを確認しました（{yen(amount)}）</p>
      <p className="mt-1 text-xs">
        {date ? `${date.toLocaleString("ja-JP")} に確認` : "お支払い確認済み"}
        ／利用制限は解除されています。
      </p>
    </div>
  );
}

