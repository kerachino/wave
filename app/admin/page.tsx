"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { useAuth } from "@/components/AuthProvider";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { basePlanPrice, computeAmounts, purchasableOptions, type Order, yen } from "@/lib/model";

export default function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const [uid, setUid] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVerified, setPasswordVerified] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const options = purchasableOptions.filter((option) => selectedIds.includes(option.id)).map((option) => ({ ...option, price: option.defaultPrice }));
  const amounts = computeAmounts(basePlanPrice, options);

  useEffect(() => {
    if (!user || !isAdmin || !passwordVerified || !db || !uid.trim()) return;
    return onSnapshot(doc(db, "orders", uid.trim()), (snapshot) => setOrder(snapshot.exists() ? snapshot.data() as Order : null));
  }, [user, isAdmin, passwordVerified, uid]);

  async function verifyPassword(event: React.FormEvent) {
    event.preventDefault();
    setPasswordError("");
    const response = await fetch("/api/admin/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setPasswordError(data.error || "パスワードが正しくありません。");
      return;
    }
    setPasswordVerified(true);
  }

  async function approve() {
    if (!uid.trim() || !db || !isFirebaseConfigured) { setMessage("uidとFirebase設定を確認してください。"); return; }
    setSaving(true);
    setMessage("");
    try {
      await setDoc(doc(db, "orders", uid.trim()), { uid: uid.trim(), basePrice: basePlanPrice, options, ...amounts, status: "pending_payment", paymentStatus: "unpaid", note }, { merge: true });
      setMessage("購入を許可しました。");
    } catch { setMessage("保存に失敗しました。"); } finally { setSaving(false); }
  }

  if (loading) return <div className="mx-auto max-w-4xl px-4 py-16">認証中...</div>;
  if (!isAdmin) return <div className="mx-auto max-w-4xl px-4 py-16"><h1 className="font-maru text-2xl font-bold text-ink">管理者専用ページ</h1><p className="mt-3 text-sm text-ink-soft">管理者アカウントでログインしてください。</p></div>;
  if (!passwordVerified) return <div className="mx-auto max-w-md px-4 py-16"><section className="rounded-3xl border border-line bg-white p-8 shadow-card"><p className="text-xs font-bold tracking-[0.18em] text-brand">ADMIN</p><h1 className="mt-2 font-maru text-2xl font-bold text-ink">管理者パスワード</h1><p className="mt-3 text-sm leading-7 text-ink-soft">管理ページを開くにはパスワードが必要です。</p><form onSubmit={verifyPassword} className="mt-6 space-y-4"><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" placeholder="パスワード" className="w-full rounded-xl border border-line bg-cream px-4 py-3 text-sm" /><button type="submit" className="w-full rounded-full bg-brand px-5 py-3 text-sm font-bold text-white">管理ページを開く</button>{passwordError && <p className="text-sm text-red-600">{passwordError}</p>}</form></section></div>;

  return <div className="mx-auto max-w-4xl space-y-8 px-4 py-10"><header><p className="text-xs font-bold tracking-[0.18em] text-brand">ADMIN</p><h1 className="mt-2 font-maru text-3xl font-bold text-ink">購入許可</h1><p className="mt-2 text-sm text-ink-soft">利用者のuidと許可するオプションを設定します。</p></header><section className="rounded-3xl border border-line bg-white p-6 shadow-card"><h2 className="font-maru text-xl font-bold text-ink">対象ユーザー</h2><input value={uid} onChange={(event) => { setUid(event.target.value); setOrder(null); }} placeholder="Firebaseユーザーのuid" className="mt-4 w-full rounded-xl border border-line bg-cream px-4 py-3 text-sm" />{order && <p className="mt-3 text-sm text-ink-soft">既存注文: 合計 {yen(order.totalPrice)} / 状態 {order.paymentStatus}</p>}</section><section className="rounded-3xl border border-line bg-white p-6 shadow-card"><h2 className="font-maru text-xl font-bold text-ink">オプション</h2><div className="mt-4 space-y-3">{purchasableOptions.map((option) => <label key={option.id} className="flex justify-between rounded-xl border border-line bg-cream px-4 py-3 text-sm"><span><input type="checkbox" checked={selectedIds.includes(option.id)} onChange={(event) => setSelectedIds((current) => event.target.checked ? [...current, option.id] : current.filter((id) => id !== option.id))} className="mr-3" />{option.name}</span><strong>{yen(option.defaultPrice)}</strong></label>)}</div><textarea value={note} onChange={(event) => setNote(event.target.value)} rows={3} placeholder="運営者メモ（任意）" className="mt-4 w-full rounded-xl border border-line bg-cream px-4 py-3 text-sm" /><p className="mt-4 rounded-xl bg-brand px-4 py-3 text-sm text-white">合計 {yen(amounts.totalPrice)} / 初回50% {yen(amounts.firstAmount)}</p><button onClick={approve} disabled={saving} className="mt-4 rounded-full bg-brand px-6 py-3 text-sm font-bold text-white disabled:opacity-50">{saving ? "保存中..." : "購入を許可する"}</button>{message && <p className="mt-3 text-sm text-ink-soft">{message}</p>}</section></div>;
}
