"use client";

import { useState } from "react";
import type { IconType } from "react-icons";
import {
  FiBriefcase,
  FiCalendar,
  FiCheck,
  FiChevronDown,
  FiDollarSign,
  FiHelpCircle,
  FiImage,
  FiLayers,
  FiLink,
  FiMail,
  FiMessageSquare,
  FiMonitor,
  FiPackage,
  FiPenTool,
  FiPhone,
  FiSend,
  FiTarget,
  FiTool,
  FiUser,
  FiUsers,
} from "react-icons/fi";
import { CheckIcon } from "@/components/icons";
import {
  contactBudgetOptions,
  contactColorOptions,
  contactDeadlineOptions,
  contactIndustryOptions,
  contactInquiryTypes,
  type ContactInquiryTypeId,
  contactNeededPagesOptions,
  contactPageCountOptions,
  contactPreparedOptions,
  contactPurposeOptions,
  contactRequestOptions,
} from "@/lib/site";

type FormState = {
  inquiryType: ContactInquiryTypeId | "";
  company: string;
  name: string;
  email: string;
  phone: string;
  industry: string;
  purpose: string;
  target: string;
  neededPages: string[];
  pageCount: string;
  color: string;
  requests: string[];
  prepared: string[];
  budget: string;
  deadline: string;
  referenceUrl: string;
  message: string;
  _spam: string;
};

const initial: FormState = {
  inquiryType: "",
  company: "",
  name: "",
  email: "",
  phone: "",
  industry: "",
  purpose: "",
  target: "",
  neededPages: [],
  pageCount: "",
  color: "",
  requests: [],
  prepared: [],
  budget: "",
  deadline: "",
  referenceUrl: "",
  message: "",
  _spam: "",
};

const inputClass =
  "w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink shadow-card transition-shadow placeholder:text-ink-mute focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/10";

const labelClass = "block text-sm font-medium text-ink";

const requiredBadge =
  "ml-1 inline-block rounded-md bg-brand-soft px-1.5 py-0.5 align-middle text-[11px] font-semibold leading-4 text-brand-deep";

const optionalBadge =
  "ml-1 inline-block rounded-md bg-ink/5 px-1.5 py-0.5 align-middle text-[11px] font-semibold leading-4 text-ink-soft";

const iconChip =
  "grid size-6 shrink-0 place-items-center rounded-full bg-brand-soft text-brand-deep";

const sectionTitleClass =
  "mt-6 flex items-center gap-2 border-b border-line pb-2 text-xs font-bold tracking-wider text-brand-deep";

/** ラベル行（アイコン＋見出し） */
function FieldLabel({
  icon: Icon,
  children,
}: {
  icon: IconType;
  children: React.ReactNode;
}) {
  return (
    <span className="flex items-center gap-2 text-sm font-medium text-ink">
      <span className={iconChip}>
        <Icon className="size-3.5" />
      </span>
      {children}
    </span>
  );
}

/** ピル型の単一選択（ラジオ） */
function PillRadio({
  name,
  options,
  value,
  onChange,
}: {
  name: string;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {options.map((option) => (
        <label
          key={option}
          className={`cursor-pointer rounded-full border px-4 py-2 text-xs font-bold transition-colors ${
            value === option
              ? "border-brand bg-brand-soft text-brand-deep"
              : "border-line bg-white text-ink-soft hover:border-brand/40"
          }`}
        >
          <input
            type="radio"
            name={name}
            value={option}
            checked={value === option}
            onChange={(e) => onChange(e.target.value)}
            className="sr-only"
          />
          {option}
        </label>
      ))}
    </div>
  );
}

/** ピル型の複数選択（チェックボックス） */
function PillCheckbox({
  name,
  options,
  values,
  onToggle,
}: {
  name: string;
  options: readonly string[];
  values: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {options.map((option) => {
        const checked = values.includes(option);
        return (
          <label
            key={option}
            className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-bold transition-colors ${
              checked
                ? "border-brand bg-brand-soft text-brand-deep"
                : "border-line bg-white text-ink-soft hover:border-brand/40"
            }`}
          >
            <input
              type="checkbox"
              name={name}
              value={option}
              checked={checked}
              onChange={() => onToggle(option)}
              className="sr-only"
            />
            {checked && <FiCheck className="size-3.5 shrink-0" aria-hidden="true" />}
            {option}
          </label>
        );
      })}
    </div>
  );
}

/** お問い合わせフォーム（メール送信 /api/contact）。種別ごとに項目を切り替える */
export function ContactForm() {
  const [form, setForm] = useState<FormState>(initial);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState("");

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function toggleInList(
    key: "neededPages" | "requests" | "prepared",
    option: string,
  ) {
    setForm((f) => ({
      ...f,
      [key]: f[key].includes(option)
        ? f[key].filter((v) => v !== option)
        : [...f[key], option],
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setStatus("error");
        setErrorMessage(
          data.error ?? "送信に失敗しました。時間をおいて再度お試しください。",
        );
        return;
      }
      setStatus("done");
      setForm(initial);
    } catch {
      setStatus("error");
      setErrorMessage(
        "通信エラーが発生しました。時間をおいて再度お試しください。",
      );
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-2xl bg-brand-soft p-10 text-center ring-1 ring-brand/20">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-brand text-white shadow-soft">
          <CheckIcon className="size-7" />
        </span>
        <h2 className="mt-4 font-maru text-xl font-bold text-brand-deep">
          お問い合わせを受け付けました
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-ink-soft">
          担当者より順次ご連絡いたします。通常、2〜3営業日以内にご返信いたします。
          <br />
          自動返信メールが届かない場合は、メールアドレスをご確認ください。
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm font-bold text-brand-dark hover:underline"
        >
          別のお問い合わせを送る
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* スパム対策（見えないフィールド） */}
      <input
        type="text"
        value={form._spam}
        onChange={(e) => update("_spam", e.target.value)}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      {/* STEP 1：何の問い合わせか（必須） */}
      <div>
        <FieldLabel icon={FiHelpCircle}>
          何についてのお問い合わせですか{" "}
          <span className={requiredBadge}>必須</span>
        </FieldLabel>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {contactInquiryTypes.map((type) => {
            const selected = form.inquiryType === type.id;
            return (
              <label
                key={type.id}
                className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                  selected
                    ? "border-brand bg-brand-soft/50 shadow-card ring-2 ring-brand/20"
                    : "border-line bg-white hover:border-brand/40"
                }`}
              >
                <input
                  type="radio"
                  name="contact-inquiry-type"
                  value={type.id}
                  checked={selected}
                  onChange={(e) =>
                    update(
                      "inquiryType",
                      e.target.value as ContactInquiryTypeId,
                    )
                  }
                  className="sr-only"
                />
                <span className="flex items-center gap-2 text-sm font-bold text-ink">
                  <span
                    className={`grid size-5 shrink-0 place-items-center rounded-full border-2 ${
                      selected
                        ? "border-brand bg-brand text-white"
                        : "border-line"
                    }`}
                  >
                    {selected && <CheckIcon className="size-3" />}
                  </span>
                  {type.label}
                </span>
                <span className="mt-1 block pl-7 text-xs leading-5 text-ink-soft">
                  {type.description}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      <div>
        <label htmlFor="contact-company" className={labelClass}>
          <FieldLabel icon={FiBriefcase}>
            会社名・事業所名 <span className={requiredBadge}>必須</span>
          </FieldLabel>
        </label>
        <input
          id="contact-company"
          type="text"
          required
          autoComplete="organization"
          className={`mt-2 ${inputClass}`}
          placeholder="例）株式会社〇〇 / 〇〇商店"
          value={form.company}
          onChange={(e) => update("company", e.target.value)}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className={labelClass}>
            <FieldLabel icon={FiUser}>
              お名前 <span className={requiredBadge}>必須</span>
            </FieldLabel>
          </label>
          <input
            id="contact-name"
            type="text"
            required
            autoComplete="name"
            className={`mt-2 ${inputClass}`}
            placeholder="山田 太郎"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="contact-email" className={labelClass}>
            <FieldLabel icon={FiMail}>
              メールアドレス <span className={requiredBadge}>必須</span>
            </FieldLabel>
          </label>
          <input
            id="contact-email"
            type="email"
            required
            autoComplete="email"
            className={`mt-2 ${inputClass}`}
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
          />
        </div>
      </div>

      <div>
        <label htmlFor="contact-phone" className={labelClass}>
          <FieldLabel icon={FiPhone}>
            電話番号 <span className={optionalBadge}>任意</span>
          </FieldLabel>
        </label>
        <input
          id="contact-phone"
          type="tel"
          autoComplete="tel"
          className={`mt-2 ${inputClass}`}
          placeholder="例）090-0000-0000（連絡が取りやすい場合のみ）"
          value={form.phone}
          onChange={(e) => update("phone", e.target.value)}
        />
      </div>

      {/* ご希望の内容：制作の相談・見積もり依頼（任意） */}
      {form.inquiryType === "consult" && (
        <fieldset className="rounded-2xl border border-line bg-cream/50 p-5 sm:p-6">
          <legend className="px-2 text-sm font-bold text-ink">
            作りたい内容について <span className={optionalBadge}>任意</span>
          </legend>
          <p className="text-xs leading-6 text-ink-soft">
            分かる範囲でお選びください。分からない場合は空欄のままで大丈夫です。
          </p>

          {/* 1. お店・会社について */}
          <p className={sectionTitleClass}>
            <FiBriefcase className="size-4" aria-hidden="true" />
            1. お店・会社について
          </p>
          <div className="mt-4">
            <label htmlFor="contact-industry" className={labelClass}>
              <FieldLabel icon={FiBriefcase}>業種</FieldLabel>
            </label>
            <div className="relative mt-2">
              <select
                id="contact-industry"
                className={`${inputClass} appearance-none pr-10`}
                value={form.industry}
                onChange={(e) => update("industry", e.target.value)}
              >
                <option value="">選択してください（任意）</option>
                {contactIndustryOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <FiChevronDown
                className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-ink-mute"
                aria-hidden="true"
              />
            </div>
          </div>

          {/* 2. サイトの目的 */}
          <p className={sectionTitleClass}>
            <FiTarget className="size-4" aria-hidden="true" />
            2. サイトの目的
          </p>
          <div className="mt-4">
            <FieldLabel icon={FiMonitor}>Webサイトの用途</FieldLabel>
            <PillRadio
              name="contact-purpose"
              options={contactPurposeOptions}
              value={form.purpose}
              onChange={(v) => update("purpose", v)}
              fallbackIcon={FiMonitor}
            />
          </div>
          <div className="mt-4">
            <label htmlFor="contact-target" className={labelClass}>
              <FieldLabel icon={FiUsers}>
                ターゲット像（来てほしいお客さま）
              </FieldLabel>
            </label>
            <input
              id="contact-target"
              type="text"
              className={`mt-2 ${inputClass}`}
              placeholder="例）近所の子育て世代、30代の女性など"
              value={form.target}
              onChange={(e) => update("target", e.target.value)}
            />
          </div>

          {/* 3. ページ構成 */}
          <p className={sectionTitleClass}>
            <FiLayers className="size-4" aria-hidden="true" />
            3. ページ構成
          </p>
          <div className="mt-4">
            <FieldLabel icon={FiLayers}>
              必要なページ（複数選択できます）
            </FieldLabel>
            <PillCheckbox
              name="contact-needed-pages"
              options={contactNeededPagesOptions}
              values={form.neededPages}
              onToggle={(v) => toggleInList("neededPages", v)}
              fallbackIcon={FiLayers}
            />
          </div>
          <div className="mt-4">
            <FieldLabel icon={FiPackage}>ページ数・枚数の目安</FieldLabel>
            <PillRadio
              name="contact-page-count"
              options={contactPageCountOptions}
              value={form.pageCount}
              onChange={(v) => update("pageCount", v)}
              fallbackIcon={FiPackage}
            />
          </div>

          {/* 4. デザイン */}
          <p className={sectionTitleClass}>
            <FiPenTool className="size-4" aria-hidden="true" />
            4. デザイン
          </p>
          <div className="mt-4">
            <FieldLabel icon={FiPenTool}>サイトの色・雰囲気</FieldLabel>
            <PillRadio
              name="contact-color"
              options={contactColorOptions}
              value={form.color}
              onChange={(v) => update("color", v)}
              fallbackIcon={FiPenTool}
            />
          </div>
          <div className="mt-4">
            <label htmlFor="contact-reference-url" className={labelClass}>
              <FieldLabel icon={FiLink}>
                参考にしたいサイトのURL
              </FieldLabel>
            </label>
            <input
              id="contact-reference-url"
              type="url"
              inputMode="url"
              className={`mt-2 ${inputClass}`}
              placeholder="例）https://example.com（あれば）"
              value={form.referenceUrl}
              onChange={(e) => update("referenceUrl", e.target.value)}
            />
          </div>

          {/* 5. 素材・作業分担 */}
          <p className={sectionTitleClass}>
            <FiImage className="size-4" aria-hidden="true" />
            5. 素材・作業分担
          </p>
          <div className="mt-4">
            <FieldLabel icon={FiTool}>
              対応してもらいたいこと（複数選択できます）
            </FieldLabel>
            <PillCheckbox
              name="contact-requests"
              options={contactRequestOptions}
              values={form.requests}
              onToggle={(v) => toggleInList("requests", v)}
              fallbackIcon={FiTool}
            />
          </div>
          <div className="mt-4">
            <FieldLabel icon={FiPackage}>
              用意しているもの（複数選択できます）
            </FieldLabel>
            <PillCheckbox
              name="contact-prepared"
              options={contactPreparedOptions}
              values={form.prepared}
              onToggle={(v) => toggleInList("prepared", v)}
              fallbackIcon={FiPackage}
            />
          </div>

          {/* 6. 予算・時期 */}
          <p className={sectionTitleClass}>
            <FiDollarSign className="size-4" aria-hidden="true" />
            6. 予算・時期
          </p>
          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            <div>
              <FieldLabel icon={FiDollarSign}>ご予算の目安</FieldLabel>
              <PillRadio
                name="contact-budget"
                options={contactBudgetOptions}
                value={form.budget}
                onChange={(v) => update("budget", v)}
                fallbackIcon={FiDollarSign}
              />
            </div>
            <div>
              <FieldLabel icon={FiCalendar}>ご希望の時期</FieldLabel>
              <PillRadio
                name="contact-deadline"
                options={contactDeadlineOptions}
                value={form.deadline}
                onChange={(v) => update("deadline", v)}
                fallbackIcon={FiCalendar}
              />
            </div>
          </div>
        </fieldset>
      )}

      <div>
        <label htmlFor="contact-message" className={labelClass}>
          <FieldLabel icon={FiMessageSquare}>
            ご相談内容 <span className={requiredBadge}>必須</span>
          </FieldLabel>
        </label>
        <textarea
          id="contact-message"
          required
          rows={8}
          maxLength={5000}
          className={`mt-2 ${inputClass} resize-y`}
          placeholder="例）店舗のホームページが欲しい。写真やお店の紹介を載せたい。予算は〇〇万円ほど。"
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
        />
      </div>

      {status === "error" && (
        <p
          className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
          role="alert"
        >
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-3.5 text-sm font-bold text-white shadow-[0_12px_26px_-10px_rgb(37_99_235_/_0.55)] transition-all hover:-translate-y-0.5 hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        <FiSend className="size-4" aria-hidden="true" />
        {status === "sending" ? "送信中..." : "送信する"}
      </button>

      <p className="text-xs leading-6 text-ink-mute">
        送信いただいた内容は、お問い合わせへの対応目的のみに利用します。
        24時間いつでも送信できます。
      </p>
    </form>
  );
}
