"use client";

import { useState } from "react";
import { CheckIcon } from "@/components/icons";

type FormState = {
  company: string;
  name: string;
  email: string;
  message: string;
  _spam: string;
};

const initial: FormState = {
  company: "",
  name: "",
  email: "",
  message: "",
  _spam: "",
};

const inputClass =
  "w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink shadow-card transition-shadow placeholder:text-ink-mute focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/10";

const labelClass = "block text-sm font-medium text-ink";

const requiredBadge =
  "ml-1 inline-block rounded-md bg-brand-soft px-1.5 py-0.5 align-middle text-[11px] font-semibold leading-4 text-brand-deep";

/** お問い合わせフォーム（メール送信 /api/contact） */
export function ContactForm() {
  const [form, setForm] = useState<FormState>(initial);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState("");

  function update<K extends keyof FormState>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
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
      setErrorMessage("通信エラーが発生しました。時間をおいて再度お試しください。");
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
          会社名・事業所名 <span className={requiredBadge}>必須</span>
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
            お名前 <span className={requiredBadge}>必須</span>
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
            メールアドレス <span className={requiredBadge}>必須</span>
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
        <label htmlFor="contact-message" className={labelClass}>
          ご相談内容 <span className={requiredBadge}>必須</span>
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
        className="w-full rounded-xl bg-brand px-6 py-3.5 text-sm font-bold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {status === "sending" ? "送信中..." : "送信する"}
      </button>

      <p className="text-xs leading-6 text-ink-mute">
        送信いただいた内容は、お問い合わせへの対応目的のみに利用します。
        24時間いつでも送信できます。
      </p>
    </form>
  );
}

