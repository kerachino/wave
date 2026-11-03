"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useAuth } from "@/components/AuthProvider";
import { db, isFirebaseConfigured } from "@/lib/firebase";

type ContactProfile = {
  displayName: string;
  companyName: string;
  email: string;
  phone: string;
};

const emptyProfile: ContactProfile = {
  displayName: "",
  companyName: "",
  email: "",
  phone: "",
};

export default function DashboardProfilePage() {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<ContactProfile>(emptyProfile);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (loading) return;
    if (!user || !db) return;

    let cancelled = false;
    getDoc(doc(db, "users", user.uid))
      .then((snapshot) => {
        if (cancelled) return;
        const data = snapshot.data();
        setProfile({
          displayName: data?.displayName || user.displayName || "",
          companyName: data?.companyName || "",
          email: data?.email || user.email || "",
          phone: data?.phone || "",
        });
      })
      .catch(() => {
        if (!cancelled) setError("登録情報を読み込めませんでした。再読み込みしてください。");
      })
      .finally(() => {
        if (!cancelled) setLoadingProfile(false);
      });

    return () => {
      cancelled = true;
    };
  }, [loading, user]);

  function update<K extends keyof ContactProfile>(
    key: K,
    value: ContactProfile[K],
  ) {
    setProfile((current) => ({ ...current, [key]: value }));
    setMessage("");
    setError("");
  }

  async function saveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user || !db) {
      setError("ログイン状態を確認して、もう一度お試しください。");
      return;
    }

    const savedProfile = {
      displayName: profile.displayName.trim(),
      companyName: profile.companyName.trim(),
      email: profile.email.trim(),
      phone: profile.phone.trim(),
    };
    if (!savedProfile.displayName || !savedProfile.email) {
      setError("氏名と連絡用メールアドレスを入力してください。");
      return;
    }

    setSaving(true);
    setMessage("");
    setError("");
    try {
      await setDoc(doc(db, "users", user.uid), savedProfile, { merge: true });
      setProfile(savedProfile);
      setMessage("登録情報を保存しました。");
    } catch {
      setError("保存できませんでした。時間をおいて再度お試しください。");
    } finally {
      setSaving(false);
    }
  }

  if (loading || (user && db && loadingProfile)) {
    return <p className="text-sm text-ink-mute">登録情報を読み込み中...</p>;
  }

  if (!isFirebaseConfigured || !user) {
    return (
      <section className="rounded-3xl border border-line bg-white p-8 shadow-card">
        <h1 className="font-maru text-2xl font-bold text-ink">登録情報</h1>
        <p className="mt-3 text-sm text-ink-soft">
          ログインすると登録情報を設定できます。
        </p>
      </section>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <p className="text-xs font-bold tracking-[0.18em] text-brand">
          CONTACT PROFILE
        </p>
        <h1 className="mt-2 font-maru text-3xl font-bold text-ink">
          登録情報
        </h1>
        <p className="mt-2 text-sm leading-7 text-ink-soft">
          お名前やご連絡先を登録できます。ここで設定した情報は担当者との連絡に使用します。
        </p>
      </header>

      <form
        onSubmit={saveProfile}
        className="space-y-5 rounded-3xl border border-line bg-white p-6 shadow-card sm:p-8"
      >
        <ProfileField
          id="profile-name"
          label="氏名"
          required
          maxLength={100}
          value={profile.displayName}
          onChange={(value) => update("displayName", value)}
          autoComplete="name"
        />
        <ProfileField
          id="profile-company"
          label="会社名・店舗名"
          maxLength={100}
          value={profile.companyName}
          onChange={(value) => update("companyName", value)}
          autoComplete="organization"
        />
        <ProfileField
          id="profile-email"
          label="連絡用メールアドレス"
          type="email"
          required
          maxLength={254}
          value={profile.email}
          onChange={(value) => update("email", value)}
          autoComplete="email"
        />
        <ProfileField
          id="profile-phone"
          label="電話番号"
          type="tel"
          maxLength={30}
          value={profile.phone}
          onChange={(value) => update("phone", value)}
          autoComplete="tel"
        />

        {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
        {message && <p className="text-sm text-emerald-700" role="status">{message}</p>}
        <div className="border-t border-line pt-5">
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-brand px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-dark disabled:opacity-50"
          >
            {saving ? "保存中..." : "登録情報を保存"}
          </button>
        </div>
      </form>
    </div>
  );
}

function ProfileField({
  id,
  label,
  value,
  onChange,
  type = "text",
  required = false,
  maxLength,
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "tel";
  required?: boolean;
  maxLength: number;
  autoComplete: string;
}) {
  return (
    <label htmlFor={id} className="block text-sm font-bold text-ink">
      {label}
      {required && <span className="ml-1 text-brand">必須</span>}
      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        maxLength={maxLength}
        autoComplete={autoComplete}
        className="mt-2 w-full rounded-xl border border-line bg-cream px-4 py-3 text-sm font-normal text-ink outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10"
      />
    </label>
  );
}
