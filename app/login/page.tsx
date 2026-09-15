"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GoogleLoginButton } from "@/components/GoogleLoginButton";
import { useAuth } from "@/components/AuthProvider";
export default function LoginPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [error, setError] = useState("");
  useEffect(() => {
    if (!loading && user) router.replace("/dashboard");
  }, [loading, user, router]);
  return (
    <div className="mx-auto max-w-md px-4 py-20">
      <section className="rounded-3xl border border-line bg-white p-8 shadow-card">
        <p className="text-sm font-bold text-brand">HATONO CONNECT</p>
        <h1 className="mt-3 font-maru text-3xl font-bold text-ink">ログイン</h1>
        <p className="mt-3 text-sm leading-7 text-ink-soft">
          Googleアカウントでログインすると、お申込み内容の確認、チャット、決済をご利用いただけます。
        </p>
        <div className="mt-8">
          <GoogleLoginButton
            onError={() =>
              setError("ログインに失敗しました。もう一度お試しください。")
            }
          />
        </div>
        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      </section>
    </div>
  );
}
