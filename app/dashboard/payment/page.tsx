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
import { useEffect, useId, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { ProjectSwitcher } from "@/components/ProjectSwitcher";
import { useProjects } from "@/components/useProjects";
import { isFirebaseConfigured } from "@/lib/firebase";
import {
  maintenanceSubscriptionPrice,
  yen,
  type PurchaseConsent,
  type SquareInvoiceInfo,
} from "@/lib/model";
import { projectTitle, type Project } from "@/lib/projects";
import {
  buildContractDisclosures,
  contractTerms,
  contractVersion,
  contractVersionLabel,
  formatContractDateTime,
  type ContractDisclosure,
} from "@/lib/contract";

type InvoiceKind = "project" | "subscription";

export default function DashboardPaymentPage() {
  const { user, loading } = useAuth();
  const {
    projects,
    selected: order,
    selectedId,
    select,
    loading: projectsLoading,
  } = useProjects(user?.uid);

  if (loading || !user)
    return <p className="text-sm text-ink-mute">読み込み中...</p>;

  // 発注者（お客さま）の名称は、運営者が設定した値 → Google アカウントの順に使います。
  const customerName =
    order?.customerName || user.displayName || user.email || "お客さま";
  const customerEmail = user.email ?? "";

  return (
    <div className="mx-auto max-w-5xl space-y-7">
      <header className="rounded-3xl bg-brand-deep px-6 py-7 text-white shadow-lift sm:px-8">
        <p className="text-xs font-bold tracking-[0.18em] text-white/65">
          PAYMENT
        </p>
        <h1 className="mt-2 font-maru text-3xl font-bold">お支払い</h1>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-white/80">
          ご依頼ごとのお支払い状況を確認できます。ブロックを選ぶと内容が開きます。
        </p>
      </header>

      {!isFirebaseConfigured ? null : projectsLoading ? (
        <p className="text-sm text-ink-mute">ご依頼を読み込んでいます...</p>
      ) : projects.length > 1 ? (
        <section className="rounded-2xl border border-line bg-white p-4 shadow-card sm:p-5">
          <p className="mb-2 text-xs font-bold tracking-wide text-ink-mute">
            表示するご依頼
          </p>
          <ProjectSwitcher
            projects={projects}
            selectedId={selectedId}
            onSelect={select}
            className="w-full"
          />
        </section>
      ) : null}
      {!order ? (
        <section className="rounded-3xl border border-line bg-white p-8 shadow-card">
          <h2 className="font-maru text-xl font-bold text-ink">
            購入許可をお待ちください
          </h2>
          <p className="mt-3 text-sm leading-7 text-ink-soft">
            運営者が購入内容と取引条件を設定すると、こちらに表示されます。
          </p>
        </section>
      ) : (
        <>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-bold tracking-[0.14em] text-brand">
                SELECTED PROJECT
              </p>
              <h2 className="mt-1 font-maru text-xl font-bold text-ink">
                {projectTitle(order)}
              </h2>
            </div>
            <p className="text-xs text-ink-mute">
              {projects.length > 1
                ? `${projects.length}件のご依頼から表示中`
                : "ご依頼のお支払い状況"}
            </p>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <ProjectPayment
              order={order}
              customerName={customerName}
              customerEmail={customerEmail}
            />
            <SubscriptionPayment
              order={order}
              customerName={customerName}
              customerEmail={customerEmail}
            />
          </div>
          <p className="text-center text-xs leading-6 text-ink-mute">
            チャット相談はお支払い前でもご利用いただけます。
          </p>
        </>
      )}
    </div>
  );
}

function ProjectPayment({
  order,
  customerName,
  customerEmail,
}: {
  order: Project;
  customerName: string;
  customerEmail: string;
}) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const invoice = order.projectInvoice;
  const paid =
    order.paymentStatus === "paid" || invoice?.status === "PAID";
  const approved = Boolean(order.purchaseApproved || order.legacy || paid);
  const consent = order.projectConsent;
  const [agreed, setAgreed] = useState(false);
  const invoiceAlreadyIssued = Boolean(
    invoice?.id &&
      !["CANCELED", "FAILED", "REFUNDED", "PARTIALLY_REFUNDED"].includes(
        invoice.status ?? "",
      ),
  );
  const disclosures = buildContractDisclosures({
    kind: "project",
    order,
    customerName,
    customerEmail,
    agreedAt: consent?.agreedAt,
    dueDate: order.projectInvoice?.dueDate,
  });

  return (
    <section className="overflow-hidden rounded-3xl border border-line bg-white shadow-card">
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={() => setDetailsOpen(true)}
        className="flex min-h-36 w-full flex-col items-start justify-between gap-4 p-5 text-left transition hover:bg-cream/50 focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-brand sm:p-6"
      >
        <div className="flex w-full items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold tracking-[0.14em] text-brand">
              本契約
            </p>
            <h3 className="mt-2 font-maru text-lg font-bold text-ink">
              {projectTitle(order)}
            </h3>
          </div>
          <Status
            value={
              paid
                ? "購入済み"
                : approved
                  ? "お支払い待ち"
                  : "内容確認中"
            }
          />
        </div>
        <div className="flex w-full items-end justify-between gap-3">
          <p className="text-sm text-ink-soft">
            {order.basePrice > 0
              ? `基本プラン${order.options?.length ? `・${order.options.map((option) => option.name).join("・")}` : ""}`
              : order.options?.map((option) => option.name).join("・") ||
                "追加依頼"}
          </p>
          <div className="flex shrink-0 flex-col items-end gap-1">
            {!paid && approved && (
              <span className="text-sm font-bold text-ink">
                {yen(order.totalPrice)}
              </span>
            )}
            <span className="text-xs font-bold text-brand">
              内容を確認する →
            </span>
          </div>
        </div>
      </button>
      {detailsOpen && (
        <DetailDialog
          title={`本契約：${projectTitle(order)}`}
          onClose={() => setDetailsOpen(false)}
        >
          {paid ? (
            <PurchasedInvoice invoice={invoice} />
          ) : approved ? (
            <>
              <div className="space-y-3 rounded-2xl border border-line bg-white p-4 text-sm">
                {order.basePrice > 0 && (
                  <Line label="基本プラン" value={yen(order.basePrice)} />
                )}
                {(order.options ?? []).map((option) => (
                  <Line
                    key={option.id}
                    label={option.name}
                    value={yen(option.price)}
                  />
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
                consentRequired={!invoiceAlreadyIssued}
                kind="project"
              >
                <SquareInvoiceButton
                  kind="project"
                  projectId={order.id}
                  legacy={order.legacy}
                  label="取引条件に同意して請求書を発行"
                  existing={invoice}
                  agreed={agreed}
                />
              </ContractTermsBlock>
            </>
          ) : (
            <p className="rounded-2xl bg-white px-4 py-4 text-sm leading-7 text-ink-soft">
              運営者が購入内容と金額を確認中です。準備ができると、お支払い内容が表示されます。
            </p>
          )}
        </DetailDialog>
      )}
    </section>
  );
}

function SubscriptionPayment({
  order,
  customerName,
  customerEmail,
}: {
  order: Project;
  customerName: string;
  customerEmail: string;
}) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const approved = Boolean(order.subscriptionApproved);
  const invoice = order.subscriptionInvoice;
  const paid =
    order.subscriptionStatus === "paid" || invoice?.status === "PAID";
  const consent = order.subscriptionConsent;
  const [agreed, setAgreed] = useState(false);
  const invoiceAlreadyIssued = Boolean(
    invoice?.id &&
      !["CANCELED", "FAILED", "REFUNDED", "PARTIALLY_REFUNDED"].includes(
        invoice.status ?? "",
      ),
  );
  const disclosures = buildContractDisclosures({
    kind: "subscription",
    order,
    customerName,
    customerEmail,
    agreedAt: consent?.agreedAt,
    dueDate: order.subscriptionInvoice?.dueDate,
  });

  return (
    <section className="overflow-hidden rounded-3xl border border-line bg-white shadow-card">
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={() => setDetailsOpen(true)}
        className="flex min-h-36 w-full flex-col items-start justify-between gap-4 p-5 text-left transition hover:bg-cream/50 focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-brand sm:p-6"
      >
        <div className="flex w-full items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold tracking-[0.14em] text-brand">
              維持費サポート
            </p>
            <h3 className="mt-2 font-maru text-lg font-bold text-ink">
              {projectTitle(order)}
            </h3>
          </div>
          <Status
            value={
              paid
                ? "購入済み"
                : approved
                  ? "お支払い待ち"
                  : "未許可"
            }
          />
        </div>
        <div className="flex w-full items-end justify-between gap-3">
          <p className="text-sm text-ink-soft">
            公開後の維持・更新サポート（月額）
          </p>
          <div className="flex shrink-0 flex-col items-end gap-1">
            {!paid && approved && (
              <span className="text-sm font-bold text-ink">
                {yen(order.subscriptionPrice ?? maintenanceSubscriptionPrice)}
                /月
              </span>
            )}
            <span className="text-xs font-bold text-brand">
              内容を確認する →
            </span>
          </div>
        </div>
      </button>
      {detailsOpen && (
        <DetailDialog
          title={`維持費サポート：${projectTitle(order)}`}
          onClose={() => setDetailsOpen(false)}
        >
          {paid ? (
            <PurchasedInvoice invoice={invoice} />
          ) : approved ? (
            <>
              <div className="rounded-2xl border border-line bg-white p-4">
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
                consentRequired={!invoiceAlreadyIssued}
                kind="subscription"
              >
                <SquareInvoiceButton
                  kind="subscription"
                  projectId={order.id}
                  legacy={order.legacy}
                  label="取引条件に同意して請求書を発行"
                  existing={invoice}
                  agreed={agreed}
                />
              </ContractTermsBlock>
            </>
          ) : (
            <p className="rounded-2xl bg-white px-4 py-4 text-sm leading-7 text-ink-soft">
              運営者による維持費サポートの許可待ちです。
            </p>
          )}
        </DetailDialog>
      )}
    </section>
  );
}

function DetailDialog({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const titleId = useId();

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <div
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          onClose();
        }
      }}
      className="fixed inset-0 z-[100] grid place-items-center bg-ink/50 p-4"
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="flex max-h-[90dvh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-lift"
      >
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-line bg-cream/60 px-5 py-4 sm:px-7">
          <h2
            id={titleId}
            className="font-maru text-lg font-bold text-ink"
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="詳細を閉じる"
            autoFocus
            className="grid size-9 shrink-0 place-items-center rounded-full border border-line bg-white text-xl text-ink-soft transition hover:bg-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            ×
          </button>
        </header>
        <div className="overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
          {children}
        </div>
      </section>
    </div>
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
  consentRequired,
  kind,
  children,
}: {
  disclosures: ContractDisclosure[];
  consent?: PurchaseConsent;
  agreed: boolean;
  onAgreedChange: (value: boolean) => void;
  consentRequired: boolean;
  kind: InvoiceKind;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-8 space-y-5">
      <section aria-labelledby="contract-disclosure-heading">
        <h3
          id={`contract-disclosure-heading-${kind}`}
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

      {consentRequired ? (
        <div className="rounded-2xl border-2 border-brand/40 bg-brand-soft/40 p-4 sm:p-5">
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(event) => onAgreedChange(event.target.checked)}
              aria-describedby={`contract-consent-note-${kind}`}
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
            id={`contract-consent-note-${kind}`}
            className="mt-2 text-xs leading-6 text-ink-mute"
          >
            同意すると請求書を発行できます。同意日時・条件は記録されます。
          </p>
        </div>
      ) : (
        <p className="rounded-2xl bg-brand-soft/50 px-4 py-3 text-xs leading-6 text-brand-deep">
          請求書は発行済みです。下のボタンからSquareのお支払い画面を開けます。
        </p>
      )}
        {children}

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
  projectId,
  legacy,
  label,
  existing,
  agreed,
}: {
  kind: InvoiceKind;
  projectId: string;
  /** 旧 orders/{uid} から読み込んだ依頼（移行までは従来どおり扱う） */
  legacy?: boolean;
  label: string;
  existing?: SquareInvoiceInfo;
  agreed: boolean;
}) {
  const { user } = useAuth();
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState<SquareInvoiceInfo | null>(null);
  // API応答を先に使い、Firestoreへの反映待ちでも新しい請求書を表示します。
  const invoice = pending ?? existing;
  const invoiceAlreadyIssued = Boolean(
    invoice?.id &&
      !["CANCELED", "FAILED", "REFUNDED", "PARTIALLY_REFUNDED"].includes(
        invoice.status ?? "",
      ),
  );

  async function requestInvoice() {
    // 契約条件に同意していない場合は送信しません（ボタンも押せません）。
    if (!user || sending || !agreed || invoiceAlreadyIssued) return;
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
        // projectId で対象のご依頼を特定します。
        // 旧依頼（orders/{uid}）には付けず、従来どおりのキーで処理します。
        // agreed / version はサーバー側の同意チェックに使われます。
        body: JSON.stringify({
          kind,
          agreed,
          version: contractVersion,
          ...(legacy ? {} : { projectId }),
        }),
      });
      const data = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        message?: string;
        invoice?: SquareInvoiceInfo;
      };
      if (!response.ok || !data.ok) {
        setError(
          data.error ||
            "請求書の発行に失敗しました。時間をおいてお試しください。",
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

  return (
    <div className="mt-5">
      {invoiceAlreadyIssued ? (
        invoice?.publicUrl ? (
          <a
            href={invoice.publicUrl}
            target="_blank"
            rel="noreferrer"
            className="block rounded-full bg-brand px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-brand-dark"
          >
            Squareのお支払い画面を開く
          </a>
        ) : (
          <p className="rounded-xl bg-cream px-4 py-3 text-sm text-ink-soft">
            請求書は発行済みです。お支払いページが表示されない場合は、チャットからお問い合わせください。
          </p>
        )
      ) : (
        <>
          <button
            type="button"
            onClick={requestInvoice}
            disabled={sending || !user || !agreed}
            title={agreed ? undefined : "契約条件への同意が必要です"}
            className="w-full rounded-full bg-brand px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {sending ? "請求書を発行しています..." : label}
          </button>
          {!agreed && (
            <p className="mt-2 text-center text-xs text-ink-mute">
              上記の条件に同意すると請求書を発行できます。
            </p>
          )}
        </>
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
        </div>
      )}
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

function PurchasedInvoice({ invoice }: { invoice?: SquareInvoiceInfo }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-brand-soft px-4 py-4 text-sm text-brand-deep">
      {invoice?.id && (
        <p className="font-medium">
          請求書番号: <span className="font-mono">{invoice.id}</span>
        </p>
      )}
      <p className="rounded-full bg-white px-3 py-1 font-bold">購入済み</p>
    </div>
  );
}
