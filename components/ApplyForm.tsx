"use client";

import Link from "next/link";
import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { type User } from "firebase/auth";
import { isFirebaseConfigured, db } from "@/lib/firebase";
import { addons, basePlan, site } from "@/lib/site";
import { GoogleLoginButton } from "@/components/GoogleLoginButton";

type FormState = {
  company: string;
  name: string;
  email: string;
  phone: string;
  plan: string;
  addons: string[];
  note: string;
  agree: boolean;
  _spam: string;
};

const initial: FormState = {
  company: "",
  name: "",
  email: "",
  phone: "",
  plan: basePlan.name,
  addons: [],
  note: "",
  agree: false,
  _spam: "",
};

const steps = ["ログイン", "申込み情報", "内容確認", "完了・お支払い"];

const inputClass =
  "w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink shadow-card transition-shadow placeholder:text-ink-mute focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/10";
const labelClass = "block text-sm font-medium text-ink";

export function ApplyForm() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initial);
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [sendStatus, setSendStatus] = useState<"idle" | "sending" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState("");

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function toggleAddon(name: string) {
    setForm((f) => ({
      ...f,
      addons: f.addons.includes(name)
        ? f.addons.filter((a) => a !== name)
        : [...f.addons, name],
    }));
  }

  function handleLoginSuccess(loginUser: User) {
    setLoggedIn(true);
    setUser(loginUser);
    setForm((f) => ({
      ...f,
      name: f.name || loginUser.displayName || "",
      email: f.email || loginUser.email || "",
    }));
  }

  async function submit() {
    setSendStatus("sending");
    setErrorMessage("");
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setSendStatus("error");
        setErrorMessage(
          data.error ?? "送信に失敗しました。時間をおいて再度お試しください。",
        );
        return;
      }
      // Firebase 設定済みかつ Google ログイン済みの場合は申込み内容も Firestore に記録
      if (isFirebaseConfigured && db && user) {
        try {
          await addDoc(collection(db, "applications"), {
            uid: user.uid,
            company: form.company,
            name: form.name,
            email: form.email,
            phone: form.phone,
            plan: form.plan,
            addons: form.addons,
            note: form.note,
            createdAt: serverTimestamp(),
          });
        } catch (err) {
          console.error("申込みの Firestore 保存に失敗:", err);
        }
      }
      setStep(3);
    } catch {
      setSendStatus("error");
      setErrorMessage("通信エラーが発生しました。時間をおいて再度お試しください。");
    } finally {
      setSendStatus("idle");
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-soft">
      {/* ステップ表示 */}
      <div className="flex items-center gap-2 border-b border-ink/10 bg-cream px-5 py-4">
        {steps.map((label, i) => (
          <div key={label} className="flex items-center gap-2 last:mr-0">
            <span
              className={`grid size-8 shrink-0 place-items-center rounded-full text-sm font-bold transition-colors ${
                i < step
                  ? "bg-brand-soft text-brand-dark ring-1 ring-brand/30"
                  : i === step
                    ? "bg-brand text-white shadow-card"
                    : "bg-cream-deep text-ink-mute"
              }`}
            >
              {i + 1}
            </span>
            <span
              className={`hidden text-xs font-bold sm:inline ${
                i <= step ? "text-ink" : "text-ink-mute"
              }`}
            >
              {label}
            </span>
            {i < steps.length - 1 && (
              <svg viewBox="0 0 24 24" className="size-3.5 text-ink-mute" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M5 12l14 0" />
              </svg>
            )}
          </div>
        ))}
      </div>

      {step === 0 && (
        <div className="px-6 py-8 sm:px-8">
          <h2 className="font-maru text-xl font-bold text-ink">
            ステップ1：Googleでログイン
          </h2>
          <p className="mt-2 text-sm leading-7 text-ink-soft">
            お申し込み状況の確認と、チャットでのやり取りに利用します。
            ログインすると、お名前とメールアドレスが自動で入力されます。
          </p>
          <div className="mt-6">
            <GoogleLoginButton onSuccess={handleLoginSuccess} />
          </div>
          {loggedIn && (
            <p className="mt-3 flex items-center gap-2 rounded-xl bg-midori-soft px-4 py-3 text-sm font-bold text-midori-dark">
              <span className="grid size-5 place-items-center rounded-full bg-midori text-[10px] text-ink">
                ✓
              </span>
              Googleでログイン済み（{user?.email ?? "メールアドレス取得済み"}）
            </p>
          )}
          {!isFirebaseConfigured && (
            <p className="mt-3 rounded-xl bg-cream-deep px-4 py-3 text-xs leading-6 text-ink-mute">
              （現在は Google ログイン設定前のため、ログインなしでお進みいただけます）
            </p>
          )}
          <button
            type="button"
            onClick={() => setStep(1)}
            className="mt-6 text-sm font-bold text-brand hover:text-brand-deep"
          >
            {loggedIn ? "申込み情報の入力へ →" : "ログインせずに申込みを続ける →"}
          </button>
        </div>
      )}
      {/* ステップ2：入力 */}
      {step === 1 && (
        <div className="px-6 py-8 sm:px-8">
          <h2 className="font-maru text-xl font-bold text-ink">
            ステップ2：申込み情報
          </h2>
          <p className="mt-2 text-sm leading-7 text-ink-soft">
            契約に必要な情報を入力してください。入力内容はお支払い・納品のご案内に利用します。
          </p>

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

          <div className="mt-6 space-y-5">
            <div>
              <label htmlFor="apply-company" className={labelClass}>
                会社名・事業所名{" "}
                <span className="ml-1 rounded bg-brand-soft px-1.5 py-0.5 text-xs text-brand-deep">必須</span>
              </label>
              <input
                id="apply-company"
                type="text"
                required
                autoComplete="organization"
                className={`mt-2 ${inputClass}`}
                placeholder="例）株式会社〇〇"
                value={form.company}
                onChange={(e) => update("company", e.target.value)}
              />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="apply-name" className={labelClass}>
                  お名前{" "}
                  <span className="ml-1 rounded bg-brand-soft px-1.5 py-0.5 text-xs text-brand-deep">必須</span>
                </label>
                <input
                  id="apply-name"
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
                <label htmlFor="apply-email" className={labelClass}>
                  メールアドレス{" "}
                  <span className="ml-1 rounded bg-brand-soft px-1.5 py-0.5 text-xs text-brand-deep">必須</span>
                </label>
                <input
                  id="apply-email"
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
              <label htmlFor="apply-phone" className={labelClass}>
                電話番号{" "}
                <span className="ml-1 rounded bg-midori-soft px-1.5 py-0.5 text-xs text-midori-dark">任意</span>
              </label>
              <input
                id="apply-phone"
                type="tel"
                autoComplete="tel"
                className={`mt-2 ${inputClass}`}
                placeholder="090-0000-0000"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
              />
            </div>
            <div>
              <p id="apply-plan" className={labelClass}>
                基本プラン{" "}
                <span className="ml-1 rounded bg-brand-soft px-1.5 py-0.5 text-xs text-brand-deep">必須</span>
              </p>
              <div className="mt-2 rounded-xl border border-brand bg-brand-soft/50 px-4 py-3">
                <p className="text-sm font-bold text-ink">
                  {basePlan.name} {basePlan.price}
                  <span className="ml-1 text-xs font-normal text-ink-soft">（税込）</span>
                </p>
                <p className="mt-1 text-xs leading-6 text-ink-soft">
                  すべてのお申し込みに含まれます。1ページ制作・スマホ対応付き。
                </p>
              </div>
            </div>
            <div>
              <p className={labelClass}>
                付け足しオプション{" "}
                <span className="ml-1 rounded bg-midori-soft px-1.5 py-0.5 text-xs text-midori-dark">任意・複数選択OK</span>
              </p>
              <div className="mt-2 grid gap-3 sm:grid-cols-2">
                {addons.map((addon) => {
                  const selected = form.addons.includes(addon.name);
                  return (
                    <button
                      key={addon.id}
                      type="button"
                      onClick={() => toggleAddon(addon.name)}
                      aria-pressed={selected}
                      className={`rounded-xl border px-3 py-3 text-left transition-all ${
                        selected
                          ? "border-brand bg-brand-soft ring-2 ring-brand/40"
                          : "border-line bg-white hover:border-brand/40"
                      }`}
                    >
                      <span className="flex items-center gap-2 text-xs font-bold text-ink">
                        <span
                          aria-hidden="true"
                          className={`grid size-4 shrink-0 place-items-center rounded border text-[10px] ${
                            selected
                              ? "border-brand bg-brand text-white"
                              : "border-line bg-white text-transparent"
                          }`}
                        >
                          ✓
                        </span>
                        {addon.name}
                      </span>
                      <span className="mt-1 block text-sm font-bold text-brand-deep">{addon.price}</span>
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 text-xs leading-6 text-ink-mute">
                正式な合計金額はヒアリング後のお見積りで確定します。
              </p>
            </div>
            <div>
              <label htmlFor="apply-note" className={labelClass}>
                ご要望・補足{" "}
                <span className="ml-1 rounded bg-midori-soft px-1.5 py-0.5 text-xs text-midori-dark">任意</span>
              </label>
              <textarea
                id="apply-note"
                rows={4}
                maxLength={3000}
                className={`mt-2 ${inputClass} resize-y`}
                placeholder="例）既存サイトからの移行希望 ／ 写真はこちらで用意します"
                value={form.note}
                onChange={(e) => update("note", e.target.value)}
              />
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <button
              type="button"
              onClick={() => setStep(2)}
              disabled={!form.company.trim() || !form.name.trim() || !form.email.trim() || !form.plan}
              className="w-full rounded-full bg-brand px-6 py-3.5 text-sm font-bold text-white shadow-[0_12px_26px_-10px_rgb(37_99_235_/_0.55)] transition-all hover:-translate-y-0.5 hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              内容の確認へ →
            </button>
            <button type="button" onClick={() => setStep(0)} className="text-sm font-bold text-ink-mute hover:text-ink">
              ← ログイン画面に戻る
            </button>
          </div>
        </div>
      )}
      {/* ステップ3：確認 */}
      {step === 2 && (
        <div className="px-6 py-8 sm:px-8">
          <h2 className="font-maru text-xl font-bold text-ink">ステップ3：内容の確認</h2>
          <p className="mt-2 text-sm leading-7 text-ink-soft">
            以下の内容でお申し込みを確定してよろしいですか？
          </p>

          <dl className="mt-6 space-y-3">
            {[
              ["会社名・事業所名", form.company],
              ["お名前", form.name],
              ["メールアドレス", form.email],
              ["電話番号", form.phone || "（未入力）"],
              ["基本プラン", form.plan],
              ["付け足しオプション", form.addons.length > 0 ? form.addons.join(" ／ ") : "なし（基本プランのみ）"],
              ["ご要望・補足", form.note || "（なし）"],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4 border-b border-ink/10 py-3">
                <dt className="w-32 shrink-0 text-xs font-bold text-ink-mute">{label}</dt>
                <dd className="flex-1 whitespace-pre-wrap text-sm leading-6 text-ink">{value}</dd>
              </div>
            ))}
          </dl>

          <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-2xl bg-cream p-4">
            <input
              type="checkbox"
              checked={form.agree}
              onChange={(e) => update("agree", e.target.checked)}
              className="mt-1 size-5 accent-brand"
            />
            <span className="text-xs leading-6 text-ink-soft">
              契約条件・注意事項（<Link href="/apply#terms">お申し込みページ内</Link>）および
              <Link href="/privacy">プライバシーポリシー</Link>に同意します。
            </span>
          </label>

          {sendStatus === "error" && (
            <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600" role="alert">
              {errorMessage}
            </p>
          )}

          <div className="mt-6 flex flex-col gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full rounded-xl border border-line bg-white px-6 py-3.5 text-sm font-bold text-ink transition-colors hover:border-brand/40 hover:text-brand-dark sm:w-auto"
            >
              ← 入力に戻る
            </button>
            <button
              type="button"
              onClick={submit}
              disabled={!form.agree || sendStatus === "sending"}
              className="w-full rounded-full bg-brand px-6 py-3.5 text-sm font-bold text-white shadow-[0_12px_26px_-10px_rgb(37_99_235_/_0.55)] transition-all hover:-translate-y-0.5 hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
            >
              {sendStatus === "sending" ? "申し込んでいます..." : "この内容で申し込む"}
            </button>
          </div>
        </div>
      )}
      {/* ステップ4：完了・お支払い */}
      {step === 3 && (
        <div className="px-6 py-10 sm:px-8">
          <p className="mx-auto grid size-16 place-items-center rounded-full bg-brand text-2xl text-white shadow-soft">✓</p>
          <h2 className="mt-6 text-center font-maru text-2xl font-bold text-ink">
            お申し込みを受け付けました
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-center text-sm leading-7 text-ink-soft">
            担当者より、ご契約のご案内とお見積りをお送りいたします。通常、{site.replyTime}にご連絡いたします。
            <br />
            自動返信メールが届かない場合は、メールアドレスをご確認ください。
          </p>

          <div className="mt-8 rounded-3xl border border-ink/10 bg-cream p-6">
            <p className="text-sm font-bold text-ink">お支払いについて</p>
            <div className="mt-3 space-y-4 text-sm leading-7 text-ink-soft">
              <p>
                <span className="font-bold text-midori-dark">銀行振込：</span>
                ご契約時に、以下のスケジュールでお支払いいただきます。
              </p>
              <ul className="list-disc space-y-1 pl-5">
                <li>着手金：制作開始前にお見積り金額の50%</li>
                <li>残金 ：サイト公開・納品後に残り50%</li>
              </ul>
              <p>
                振込先の口座情報は、ご契約のご案内メールにてお伝えします。
                振込手数料はお客さまのご負担となります。
              </p>
              <p className="rounded-xl bg-midori-soft px-4 py-3 text-sm text-midori-dark">
                <span className="font-bold">カード決済（決済代行）：</span>
                現在、カード決済のご利用は準備中です。
                導入が決まり次第、このページにてご案内します。
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 text-center">
            <Link
              href="/contact"
              className="w-full rounded-full bg-brand px-6 py-3.5 text-center text-sm font-bold text-white shadow-[0_12px_26px_-10px_rgb(37_99_235_/_0.55)] transition-all hover:-translate-y-0.5 hover:bg-brand-dark"
            >
              ご質問はお問い合わせへ
            </Link>
            <Link href="/" className="text-sm font-bold text-ink-mute hover:text-ink">
              ← トップページに戻る
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}