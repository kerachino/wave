"use client";

import { useState } from "react";
import type { IconType } from "react-icons";
import {
  FiBriefcase,
  FiCalendar,
  FiCheck,
  FiChevronDown,
  FiDollarSign,
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
import { contactInquiryTypes } from "@/lib/site";

type FormState = {
  company: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  _spam: string;
};

const initial: FormState = {
  company: "",
  name: "",
  email: "",
  phone: "",
  message: "",
  _spam: "",
};

const inputClass =
  "w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink shadow-card transition-shadow placeholder:text-ink-mute focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/10";

const labelClass = "block text-sm font-medium text-ink";

const requiredBadge =
  "ml-1 inline-block rounded-md bg-red-50 px-1.5 py-0.5 align-middle text-[11px] font-semibold leading-4 text-red-600";

const optionalBadge =
  "ml-1 inline-block rounded-md px-1.5 py-0.5 align-middle text-[11px] font-semibold leading-4 text-ink/40";

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
            {checked && (
              <FiCheck className="size-3.5 shrink-0" aria-hidden="true" />
            )}
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

      <div>
        <label htmlFor="contact-company" className={labelClass}>
          <FieldLabel icon={FiBriefcase}>
            会社名・事業所名 <span className={optionalBadge}>任意</span>
          </FieldLabel>
        </label>
        <input
          id="contact-company"
          type="text"
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
            placeholder="hatonoconnect@example.com"
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
          placeholder="000-0000-0000"
          value={form.phone}
          onChange={(e) => update("phone", e.target.value)}
        />
      </div>

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
          placeholder="お問い合わせ内容を入力してください"
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
