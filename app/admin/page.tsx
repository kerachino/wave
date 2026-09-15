"use client";

import { useEffect, useState } from "react";
import { collection, doc, onSnapshot, setDoc } from "firebase/firestore";
import { useAuth } from "@/components/AuthProvider";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { basePlanPrice, computeAmounts, purchasableOptions, type Order, yen } from "@/lib/model";

type AdminUser = { uid: string; email?: string; displayName?: string; photoURL?: string; isAdmin?: boolean };

export default function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const [password, setPassword] = useState("");
  const [passwordVerified, setPasswordVerified] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [selectedUid, setSelectedUid] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user || !isAdmin || !passwordVerified || !db) return;
    return onSnapshot(collection(db, "users"), (snapshot) => {
      const nextUsers = snapshot.docs.map((snapshotDoc) => ({ uid: snapshotDoc.id, ...snapshotDoc.data() })) as AdminUser[];
      nextUsers.sort((a, b) => (a.displayName || a.email || a.uid).localeCompare(b.displayName || b.email || b.uid, "ja"));
      setUsers(nextUsers);
      setSelectedUid((current) => current || nextUsers[0]?.uid || "");
    });
  }, [user, isAdmin, passwordVerified]);

  useEffect(() => {
    if (!selectedUid || !db || !passwordVerified) return;
    return onSnapshot(doc(db, "orders", selectedUid), (snapshot) => {
      const nextOrder = snapshot.exists() ? snapshot.data() as Order : null;
      setOrder(nextOrder);
      setSelectedIds(nextOrder?.options.map((option) => option.id) || []);
      setNote(nextOrder?.note || "");
    });
  }, [selectedUid, passwordVerified]);

  const selectedUser = users.find((candidate) => candidate.uid === selectedUid);
  const options = purchasableOptions.filter((option) => selectedIds.includes(option.id)).map((option) => ({ ...option, price: option.defaultPrice }));
  const amounts = computeAmounts(basePlanPrice, options);

  async function verifyPassword(event: React.FormEvent) {
    event.preventDefault();
    setPasswordError("");
    const response = await fetch("/api/admin/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
    if (!response.ok) { const data = await response.json().catch(() => ({})); setPasswordError(data.error || "パスワードが正しくありません。"); return; }
    setPasswordVerified(true);
  }

  async function approve() {
    if (!selectedUid || !db || !isFirebaseConfigured) { setMessage("ユーザーを選択し、Firebase設定を確認してください。"); return; }
    setSaving(true); setMessage("");
    try {
      await setDoc(doc(db, "orders", selectedUid), { uid: selectedUid, basePrice: basePlanPrice, options, ...amounts, status: "pending_payment", paymentStatus: "unpaid", note }, { merge: true });
      setMessage("購入を許可しました。利用者のダッシュボードに反映されます。");
    } catch { setMessage("保存に失敗しました。Firestoreルールを確認してください。"); } finally { setSaving(false); }
  }

  if (loading) return <div className="mx-auto max-w-6xl px-4 py-16 text-sm text-ink-mute">認証中...</div>;
  if (!isAdmin) return <div className="mx-auto max-w-6xl px-4 py-16"><h1 className="font-maru text-2xl font-bold text-ink">管理者専用ページ</h1><p className="mt-3 text-sm text-ink-soft">管理者アカウントでログインしてください。</p></div>;
  if (!passwordVerified) return <div className="mx-auto max-w-md px-4 py-16"><section className="rounded-3xl border border-line bg-white p-8 shadow-card"><p className="text-xs font-bold tracking-[0.18em] text-brand">ADMIN</p><h1 className="mt-2 font-maru text-2xl font-bold text-ink">管理者パスワード</h1><p className="mt-3 text-sm leading-7 text-ink-soft">管理ページを開くにはパスワードが必要です。</p><form onSubmit={verifyPassword} className="mt-6 space-y-4"><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" placeholder="パスワード" className="w-full rounded-xl border border-line bg-cream px-4 py-3 text-sm" /><button type="submit" className="w-full rounded-full bg-brand px-5 py-3 text-sm font-bold text-white">管理ページを開く</button>{passwordError && <p className="text-sm text-red-600">{passwordError}</p>}</form></section></div>;

  return <div className="min-h-[calc(100vh-4rem)] bg-cream/50"><div className="mx-auto flex max-w-7xl flex-col lg:flex-row"><aside className="w-full shrink-0 border-b border-line bg-white p-5 lg:min-h-[calc(100vh-4rem)] lg:w-80 lg:border-b-0 lg:border-r lg:p-7"><div className="flex items-end justify-between gap-4"><div><p className="text-xs font-bold tracking-[0.18em] text-brand">ADMIN SPACE</p><h1 className="mt-2 font-maru text-xl font-bold text-ink">ユーザー一覧</h1></div><span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-bold text-brand">{users.length}名</span></div><div className="mt-6 max-h-[30rem] space-y-2 overflow-y-auto lg:max-h-[calc(100vh-15rem)]">{users.length === 0 ? <p className="rounded-xl bg-cream p-4 text-sm leading-6 text-ink-mute">ユーザー情報がありません。Googleログイン後にユーザードキュメントを作成してください。</p> : users.map((candidate) => <button key={candidate.uid} type="button" onClick={() => { setSelectedUid(candidate.uid); setOrder(null); setSelectedIds([]); setNote(""); setMessage(""); }} className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition ${selectedUid === candidate.uid ? "bg-brand text-white" : "hover:bg-cream"}`}><div className={`grid size-10 shrink-0 place-items-center overflow-hidden rounded-full text-sm font-bold ${selectedUid === candidate.uid ? "bg-white/20" : "bg-brand-soft text-brand"}`}>{candidate.photoURL ? <img src={candidate.photoURL} alt="" className="size-full object-cover" /> : (candidate.displayName || candidate.email || "U").slice(0, 1)}</div><span className="min-w-0"><strong className="block truncate text-sm">{candidate.displayName || "名前未設定"}</strong><span className={`block truncate text-xs ${selectedUid === candidate.uid ? "text-white/75" : "text-ink-mute"}`}>{candidate.email || candidate.uid}</span></span></button>)}</div></aside><main className="min-w-0 flex-1 px-4 py-8 sm:px-8 lg:px-12"><div className="mb-8"><p className="text-xs font-bold tracking-[0.18em] text-brand">PURCHASE CONTROL</p><h2 className="mt-2 font-maru text-3xl font-bold text-ink">購入許可の設定</h2><p className="mt-2 text-sm text-ink-soft">左のユーザーを選択し、許可するオプションを設定します。</p></div>{selectedUser ? <><section className="rounded-3xl border border-line bg-white p-6 shadow-card sm:p-8"><div className="flex flex-wrap items-center gap-4"><div className="grid size-14 place-items-center rounded-full bg-brand-soft font-maru text-xl font-bold text-brand">{(selectedUser.displayName || selectedUser.email || "U").slice(0, 1)}</div><div><h3 className="font-maru text-xl font-bold text-ink">{selectedUser.displayName || "名前未設定"}</h3><p className="mt-1 text-sm text-ink-soft">{selectedUser.email || "メールアドレス未設定"}</p><p className="mt-1 text-xs text-ink-mute">uid: {selectedUser.uid}</p></div></div>{order && <p className="mt-5 rounded-xl bg-cream px-4 py-3 text-sm text-ink-soft">現在の注文: {yen(order.totalPrice)} / 決済状態: {order.paymentStatus}</p>}</section><section className="mt-6 rounded-3xl border border-line bg-white p-6 shadow-card sm:p-8"><h3 className="font-maru text-xl font-bold text-ink">オプションと購入許可</h3><div className="mt-5 space-y-3">{purchasableOptions.map((option) => <label key={option.id} className="flex justify-between rounded-xl border border-line bg-cream px-4 py-3 text-sm"><span><input type="checkbox" checked={selectedIds.includes(option.id)} onChange={(event) => setSelectedIds((current) => event.target.checked ? [...current, option.id] : current.filter((id) => id !== option.id))} className="mr-3" />{option.name}</span><strong>{yen(option.defaultPrice)}</strong></label>)}</div><textarea value={note} onChange={(event) => setNote(event.target.value)} rows={3} placeholder="運営者メモ（任意）" className="mt-5 w-full rounded-xl border border-line bg-cream px-4 py-3 text-sm" /><div className="mt-5 rounded-2xl bg-brand px-5 py-4 text-sm text-white"><div className="flex justify-between"><span>合計</span><strong>{yen(amounts.totalPrice)}</strong></div><div className="mt-1 flex justify-between"><span>初回支払い（50%）</span><strong>{yen(amounts.firstAmount)}</strong></div></div><div className="mt-5 flex flex-wrap items-center gap-4"><button onClick={approve} disabled={saving} className="rounded-full bg-brand px-6 py-3 text-sm font-bold text-white disabled:opacity-50">{saving ? "保存中..." : "購入を許可する"}</button>{message && <p className="text-sm text-ink-soft">{message}</p>}</div></section></> : <section className="rounded-3xl border border-dashed border-line bg-white p-10 text-center"><p className="font-maru text-xl font-bold text-ink">ユーザーを選択してください</p><p className="mt-2 text-sm text-ink-soft">左側の一覧から購入許可を設定するユーザーを選択します。</p></section>}</main></div></div>;
}
