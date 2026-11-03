"use client";

// ============================================================
// 契約条件（取引条件の明示）の設定パネル
//
// 購入画面（/dashboard/payment）に表示する次の項目を運営者が設定します。
// ・発注者（お客さま）の名称
// ・給付を受領する期日
// ・検査完了期日
// ・給付を受領する場所
//
// 未入力の項目は lib/contract.ts の標準条件が表示されます。
// 保存先は orders/{uid}（クライアントからは運営のみ書き込み可）。
// 同意ログはお客さまが購入ボタンを押したときにサーバーが記録します。
// ============================================================

import { useState } from "react";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { yen, type Order } from "@/lib/model";
import { projectsCollection } from "@/lib/projects";
import {
  buildContractDisclosures,
  contractVersionLabel,
  defaultDeliveryLeadTime,
  defaultDeliveryPlace,
  defaultInspectionDeadline,
  formatContractDateTime,
} from "@/lib/contract";

const fieldClass =
  "mt-2 w-full rounded-xl border border-line bg-cream px-4 py-3 text-sm font-normal text-ink";
const labelClass = "text-sm font-bold text-ink";

/** 入力中（未保存）の値。未入力の項目は保存済みの値 → 標準条件の順に表示します */
type ContractDraft = {
  customerName: string;
  deliveryDate: string;
  inspectionDeadline: string;
  deliveryPlace: string;
};

export function ContractPanel({
  uid,
  projectId,
  legacy,
  order,
  customerEmail,
}: {
  uid: string;
  projectId: string;
  legacy?: boolean;
  order: Order | null;
  customerEmail: string;
}) {
  // 保存済みの値をそのまま表示し、入力があった項目だけ下書きとして持ちます。
  const [draft, setDraft] = useState<Partial<ContractDraft>>({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const values: ContractDraft = {
    customerName: draft.customerName ?? order?.customerName ?? "",
    deliveryDate: draft.deliveryDate ?? order?.contractDeliveryDate ?? "",
    inspectionDeadline:
      draft.inspectionDeadline ?? order?.contractInspectionDeadline ?? "",
    deliveryPlace: draft.deliveryPlace ?? order?.contractDeliveryPlace ?? "",
  };
  const update = (key: keyof ContractDraft, value: string) =>
    setDraft((current) => ({ ...current, [key]: value }));

  async function save() {
    if (!db || !isFirebaseConfigured) {
      setMessage("Firebase の設定を確認してください。");
      return;
    }
    setSaving(true);
    setMessage("");
    try {
      await setDoc(
        doc(db, legacy ? "orders" : projectsCollection, legacy ? uid : projectId),
        {
          uid,
          customerName: values.customerName.trim(),
          contractDeliveryDate: values.deliveryDate,
          contractInspectionDeadline: values.inspectionDeadline,
          contractDeliveryPlace: values.deliveryPlace.trim(),
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );
      setDraft({});
      setMessage("取引条件を保存しました。お客さまの購入画面に反映されます。");
    } catch {
      setMessage("保存に失敗しました。");
    } finally {
      setSaving(false);
    }
  }

  if (!order) {
    return (
      <section className="mt-6 rounded-3xl border border-line bg-white p-6 shadow-card">
        <p className="text-xs font-bold tracking-[0.14em] text-brand">
          CONTRACT
        </p>
        <h3 className="mt-2 font-maru text-xl font-bold text-ink">
          取引条件の設定
        </h3>
        <p className="mt-3 text-sm leading-7 text-ink-soft">
          先に「購入許可」タブで購入内容を保存してください。購入内容が決まると、
          取引条件（発注者名・期日など）を設定できます。
        </p>
      </section>
    );
  }

  // 入力中の内容をそのまま、お客さまの購入画面と同じ形でプレビューします。
  const previewOrder: Order = {
    ...order,
    customerName: values.customerName.trim() || order.customerName,
    contractDeliveryDate: values.deliveryDate,
    contractInspectionDeadline: values.inspectionDeadline,
    contractDeliveryPlace: values.deliveryPlace.trim(),
  };
  const disclosures = buildContractDisclosures({
    kind: "project",
    order: previewOrder,
    customerName: values.customerName.trim() || customerEmail || "発注者名未設定",
    customerEmail,
    agreedAt: order.projectConsent?.agreedAt,
    dueDate: order.projectInvoice?.dueDate,
  });
  const consent = order.projectConsent;

  return (
    <section className="mt-6 space-y-6">
      <div className="rounded-3xl border border-line bg-white p-6 shadow-card sm:p-8">
        <p className="text-xs font-bold tracking-[0.14em] text-brand">
          CONTRACT
        </p>
        <h3 className="mt-2 font-maru text-xl font-bold text-ink">
          取引条件の設定（お支払い画面に表示）
        </h3>
        <p className="mt-2 text-sm leading-7 text-ink-soft">
          業務委託の取引条件として、お客さまの購入画面に明示する内容を設定します。
          未入力の項目は標準条件（{defaultDeliveryLeadTime}／
          {defaultInspectionDeadline}／オンライン納品）が表示されます。
        </p>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <label className={labelClass}>
            発注者（お客さま）の名称
            <input
              value={values.customerName}
              onChange={(event) => update("customerName", event.target.value)}
              placeholder="会社名・店舗名・お名前"
              className={fieldClass}
            />
          </label>
          <label className={labelClass}>
            給付を受領する期日（納期）
            <input
              type="date"
              value={values.deliveryDate}
              onChange={(event) => update("deliveryDate", event.target.value)}
              className={fieldClass}
            />
          </label>
          <label className={labelClass}>
            検査完了期日
            <input
              type="date"
              value={values.inspectionDeadline}
              onChange={(event) =>
                update("inspectionDeadline", event.target.value)
              }
              className={fieldClass}
            />
          </label>
          <label className={labelClass}>
            給付を受領する場所・方法
            <input
              value={values.deliveryPlace}
              onChange={(event) => update("deliveryPlace", event.target.value)}
              placeholder={defaultDeliveryPlace}
              className={fieldClass}
            />
          </label>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="rounded-full bg-brand px-5 py-3 text-sm font-bold text-white disabled:opacity-60"
          >
            {saving ? "保存中..." : "取引条件を保存"}
          </button>
          {message && <p className="text-sm text-ink-soft">{message}</p>}
        </div>
      </div>


      <div className="rounded-3xl border border-line bg-white p-6 shadow-card sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-maru text-lg font-bold text-ink">
            お客さまの画面プレビュー（取引条件の明示）
          </h3>
          <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-bold text-brand-deep">
            {contractVersionLabel}
          </span>
        </div>
        <dl className="mt-4 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-cream/40">
          {disclosures.map((item) => (
            <div key={item.no} className="px-4 py-3">
              <dt className="text-xs font-bold text-ink-mute">
                {item.no}. {item.label}
              </dt>
              <dd className="mt-1 whitespace-pre-line text-sm leading-7 text-ink">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="rounded-3xl border border-line bg-white p-6 shadow-card">
        <h3 className="font-maru text-lg font-bold text-ink">同意ログ</h3>
        {consent ? (
          <dl className="mt-3 grid gap-x-3 gap-y-1 text-sm sm:grid-cols-[10rem_1fr]">
            <dt className="text-ink-mute">同意日時</dt>
            <dd className="font-bold text-ink">
              {formatContractDateTime(consent.agreedAt) || consent.agreedAtIso}
              （JST）
            </dd>
            <dt className="text-ink-mute">同意者</dt>
            <dd>{consent.email}</dd>
            <dt className="text-ink-mute">同意した条件</dt>
            <dd>{`取引条件 v${consent.version}`}</dd>
            <dt className="text-ink-mute">同意した金額</dt>
            <dd>
              {typeof consent.amount === "number" ? yen(consent.amount) : "-"}
            </dd>
            <dt className="text-ink-mute">IP</dt>
            <dd className="text-xs">{consent.ip || "-"}</dd>
            <dt className="text-ink-mute">ブラウザ</dt>
            <dd className="break-all text-xs">{consent.userAgent || "-"}</dd>
          </dl>
        ) : (
          <p className="mt-3 text-sm leading-7 text-ink-soft">
            まだ同意はありません。お客さまが購入画面で契約条件に同意して購入すると、
            日時・同意者・バージョン・明示した内容が記録されます。
          </p>
        )}
      </div>
    </section>
  );
}
