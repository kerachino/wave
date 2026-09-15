"use client";

import { useEffect, useState } from "react";
import { collection, doc, onSnapshot, setDoc } from "firebase/firestore";
import { useAuth } from "@/components/AuthProvider";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { basePlanPrice, computeAmounts, maintenanceSubscriptionPrice, purchasableOptions, type Order, yen } from "@/lib/model";
import { AdminChat } from "@/components/admin/AdminChat";

type AdminUser = { uid: string; email?: string; displayName?: string; photoURL?: string; isAdmin?: boolean };
type AdminTab = "chat" | "purchase" | "subscription" | "profile";
type CustomOption = { id: string; name: string; price: number; defaultPrice: number };

export default function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const [password, setPassword] = useState("");
  const [passwordVerified, setPasswordVerified] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [selectedUid, setSelectedUid] = useState("");
  const [activeTab, setActiveTab] = useState<AdminTab>("chat");
  const [order, setOrder] = useState<Order | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [customOptions, setCustomOptions] = useState<CustomOption[]>([]);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [purchaseEditing, setPurchaseEditing] = useState(false);
  const [subscriptionEditing, setSubscriptionEditing] = useState(false);
  const [subscriptionPrice, setSubscriptionPrice] = useState(maintenanceSubscriptionPrice);

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
      setCustomOptions(nextOrder?.options.filter((option) => !purchasableOptions.some((preset) => preset.id === option.id)).map((option) => ({ id: option.id, name: option.name, price: option.price, defaultPrice: option.price })) || []);
      setNote(nextOrder?.note || "");
      setSubscriptionPrice(nextOrder?.subscriptionPrice ?? maintenanceSubscriptionPrice);
      setPurchaseEditing(!nextOrder);
      setSubscriptionEditing(!nextOrder?.subscriptionApproved);
    });
  }, [selectedUid, passwordVerified]);

  const selectedUser = users.find((candidate) => candidate.uid === selectedUid);
  const options = [...purchasableOptions.filter((option) => selectedIds.includes(option.id)).map((option) => ({ ...option, price: option.defaultPrice })), ...customOptions.filter((option) => option.name.trim() && option.price > 0).map((option) => ({ ...option, defaultPrice: option.price }))];
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
      await setDoc(doc(db, "orders", selectedUid), { uid: selectedUid, basePrice: basePlanPrice, options, ...amounts, status: "pending_payment", paymentStatus: "unpaid", note, purchaseApproved: true }, { merge: true });
      setMessage("購入を許可しました。利用者のダッシュボードに反映されます。");
    } catch { setMessage("保存に失敗しました。Firestoreルールを確認してください。"); } finally { setSaving(false); }
  }

  async function approveSubscription() {
    if (!selectedUid || !db || !isFirebaseConfigured || subscriptionPrice <= 0) { setMessage("サブスク料金を確認してください。"); return; }
    setSaving(true); setMessage("");
    try {
      await setDoc(doc(db, "orders", selectedUid), { subscriptionApproved: true, subscriptionPrice, subscriptionStatus: "unpaid" }, { merge: true });
      setMessage("維持費サブスクを許可しました。");
    } catch { setMessage("サブスク許可の保存に失敗しました。"); } finally { setSaving(false); }
  }

  if (loading) return <div className="mx-auto max-w-6xl px-4 py-16 text-sm text-ink-mute">認証中...</div>;
  if (!isAdmin) return <div className="mx-auto max-w-6xl px-4 py-16"><h1 className="font-maru text-2xl font-bold text-ink">管理者専用ページ</h1><p className="mt-3 text-sm text-ink-soft">管理者アカウントでログインしてください。</p></div>;
  if (!passwordVerified) return <div className="mx-auto max-w-md px-4 py-16"><section className="rounded-3xl border border-line bg-white p-8 shadow-card"><p className="text-xs font-bold tracking-[0.18em] text-brand">ADMIN</p><h1 className="mt-2 font-maru text-2xl font-bold text-ink">管理者パスワード</h1><p className="mt-3 text-sm leading-7 text-ink-soft">管理ページを開くにはパスワードが必要です。</p><form onSubmit={verifyPassword} className="mt-6 space-y-4"><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" placeholder="パスワード" className="w-full rounded-xl border border-line bg-cream px-4 py-3 text-sm" /><button type="submit" className="w-full rounded-full bg-brand px-5 py-3 text-sm font-bold text-white">管理ページを開く</button>{passwordError && <p className="text-sm text-red-600">{passwordError}</p>}</form></section></div>;

  return <div className="min-h-[calc(100vh-4rem)] bg-cream/50"><div className="mx-auto flex max-w-7xl flex-col lg:flex-row"><aside className="w-full shrink-0 border-b border-line bg-white p-5 lg:min-h-[calc(100vh-4rem)] lg:w-80 lg:border-b-0 lg:border-r lg:p-7"><div className="flex items-end justify-between gap-4"><div><p className="text-xs font-bold tracking-[0.18em] text-brand">ADMIN SPACE</p><h1 className="mt-2 font-maru text-xl font-bold text-ink">ユーザー一覧</h1></div><span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-bold text-brand">{users.length}名</span></div><div className="mt-6 max-h-[30rem] space-y-2 overflow-y-auto lg:max-h-[calc(100vh-15rem)]">{users.length === 0 ? <p className="rounded-xl bg-cream p-4 text-sm leading-6 text-ink-mute">ユーザー情報がありません。Googleログイン後にユーザードキュメントを作成してください。</p> : users.map((candidate) => <button key={candidate.uid} type="button" onClick={() => { setSelectedUid(candidate.uid); setOrder(null); setSelectedIds([]); setCustomOptions([]); setNote(""); setMessage(""); setActiveTab("chat"); }} className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition ${selectedUid === candidate.uid ? "bg-brand text-white" : "hover:bg-cream"}`}><div className={`grid size-10 shrink-0 place-items-center overflow-hidden rounded-full text-sm font-bold ${selectedUid === candidate.uid ? "bg-white/20" : "bg-brand-soft text-brand"}`}>{candidate.photoURL ? <img src={candidate.photoURL} alt="" className="size-full object-cover" /> : (candidate.displayName || candidate.email || "U").slice(0, 1)}</div><span className="min-w-0"><strong className="block truncate text-sm">{candidate.displayName || "名前未設定"}</strong><span className={`block truncate text-xs ${selectedUid === candidate.uid ? "text-white/75" : "text-ink-mute"}`}>{candidate.email || candidate.uid}</span></span></button>)}</div></aside><main className="min-w-0 flex-1 px-4 py-8 sm:px-8 lg:px-12"><div className="mb-6 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold tracking-[0.18em] text-brand">ADMIN WORKSPACE</p><h2 className="mt-2 font-maru text-3xl font-bold text-ink">{selectedUser ? selectedUser.displayName || "名前未設定" : "ユーザーを選択"}</h2><p className="mt-2 text-sm text-ink-soft">{selectedUser?.email || "左の一覧からユーザーを選択してください。"}</p></div>{selectedUser && <span className="rounded-full bg-white px-3 py-2 text-xs text-ink-mute shadow-sm">{selectedUser.uid}</span>}</div>{selectedUser ? <><nav className="flex gap-2 overflow-x-auto border-b border-line" aria-label="ユーザー管理メニュー"><TabButton active={activeTab === "chat"} onClick={() => setActiveTab("chat")} label="チャット" badge="優先" /><TabButton active={activeTab === "purchase"} onClick={() => setActiveTab("purchase")} label="購入許可" /><TabButton active={activeTab === "subscription"} onClick={() => setActiveTab("subscription")} label="維持費サブスク" /><TabButton active={activeTab === "profile"} onClick={() => setActiveTab("profile")} label="ユーザー情報" /></nav>{activeTab === "chat" && <AdminChat roomId={selectedUid} />}{activeTab === "purchase" && <PurchasePanel order={order} editing={purchaseEditing} onEdit={() => setPurchaseEditing(true)} selectedIds={selectedIds} setSelectedIds={setSelectedIds} customOptions={customOptions} setCustomOptions={setCustomOptions} note={note} setNote={setNote} amounts={amounts} saving={saving} message={message} approve={approve} />}{activeTab === "subscription" && <SubscriptionPanel order={order} editing={subscriptionEditing} onEdit={() => setSubscriptionEditing(true)} price={subscriptionPrice} setPrice={setSubscriptionPrice} saving={saving} message={message} approve={approveSubscription} />}{activeTab === "profile" && <ProfilePanel user={selectedUser} order={order} />}</> : <section className="rounded-3xl border border-dashed border-line bg-white p-10 text-center"><p className="font-maru text-xl font-bold text-ink">ユーザーを選択してください</p><p className="mt-2 text-sm text-ink-soft">左側の一覧からユーザーを選択すると、チャットが開きます。</p></section>}</main></div></div>;
}

function TabButton({ active, onClick, label, badge }: { active: boolean; onClick: () => void; label: string; badge?: string }) { return <button type="button" onClick={onClick} className={`relative shrink-0 px-4 py-3 text-sm font-bold ${active ? "text-brand" : "text-ink-mute hover:text-ink"}`}>{label}{badge && <span className="ml-2 rounded-full bg-brand-soft px-2 py-0.5 text-[10px] text-brand">{badge}</span>}{active && <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-brand" />}</button>; }

function PurchasePanel({ order, editing, onEdit, selectedIds, setSelectedIds, customOptions, setCustomOptions, note, setNote, amounts, saving, message, approve }: { order: Order | null; editing: boolean; onEdit: () => void; selectedIds: string[]; setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>; customOptions: CustomOption[]; setCustomOptions: React.Dispatch<React.SetStateAction<CustomOption[]>>; note: string; setNote: (value: string) => void; amounts: ReturnType<typeof computeAmounts>; saving: boolean; message: string; approve: () => Promise<void> }) { return <section className="mt-6 rounded-3xl border border-line bg-white p-6 shadow-card sm:p-8"><div className="flex items-center justify-between gap-4"><div><p className="text-xs font-bold tracking-[0.14em] text-brand">PURCHASE CONTROL</p><h3 className="mt-2 font-maru text-xl font-bold text-ink">購入許可の設定</h3></div>{order ? <button type="button" onClick={onEdit} disabled={editing} className="rounded-full border border-brand px-4 py-2 text-xs font-bold text-brand disabled:border-line disabled:text-ink-mute">{editing ? "編集中" : "編集"}</button> : <span className="rounded-full bg-brand-soft px-3 py-1 text-xs text-brand">未許可</span>}</div><p className="mt-3 text-xs text-ink-mute">{order && !editing ? "購入許可済みです。変更する場合は編集を押してください。" : "設定内容を確認して購入を許可します。"}</p><div className="mt-5 space-y-3">{purchasableOptions.map((option) => <label key={option.id} className={`flex justify-between rounded-xl border border-line px-4 py-3 text-sm ${editing || !order ? "bg-cream" : "bg-ink/5"}`}><span><input type="checkbox" disabled={!editing && Boolean(order)} checked={selectedIds.includes(option.id)} onChange={(event) => setSelectedIds((current) => event.target.checked ? [...current, option.id] : current.filter((id) => id !== option.id))} className="mr-3" />{option.name}</span><strong>{yen(option.defaultPrice)}</strong></label>)}</div><div className={`mt-6 rounded-2xl border border-dashed border-line p-4 ${!editing && order ? "opacity-60" : ""}`}><div className="flex items-center justify-between gap-3"><div><h4 className="text-sm font-bold text-ink">自由追加項目</h4><p className="mt-1 text-xs text-ink-mute">定型外の内容も名称と価格を自由に設定できます。</p></div><button type="button" disabled={!editing && Boolean(order)} onClick={() => setCustomOptions((current) => [...current, { id: `custom-${Date.now()}`, name: "", price: 0, defaultPrice: 0 }])} className="rounded-full border border-brand px-3 py-2 text-xs font-bold text-brand disabled:border-line disabled:text-ink-mute">項目を追加</button></div><div className="mt-3 space-y-2">{customOptions.map((option) => <div key={option.id} className="flex gap-2"><input disabled={!editing && Boolean(order)} value={option.name} onChange={(event) => setCustomOptions((current) => current.map((item) => item.id === option.id ? { ...item, name: event.target.value } : item))} placeholder="項目名" className="min-w-0 flex-1 rounded-lg border border-line bg-cream px-3 py-2 text-sm" /><input disabled={!editing && Boolean(order)} type="number" min="0" value={option.price || ""} onChange={(event) => setCustomOptions((current) => current.map((item) => item.id === option.id ? { ...item, price: Number(event.target.value), defaultPrice: Number(event.target.value) } : item))} placeholder="価格" className="w-28 rounded-lg border border-line bg-cream px-3 py-2 text-sm" /><button type="button" disabled={!editing && Boolean(order)} onClick={() => setCustomOptions((current) => current.filter((item) => item.id !== option.id))} className="rounded-lg px-2 text-sm text-ink-mute hover:bg-cream disabled:opacity-40" aria-label="自由追加項目を削除">×</button></div>)}</div></div><textarea disabled={!editing && Boolean(order)} value={note} onChange={(event) => setNote(event.target.value)} rows={3} placeholder="運営者メモ（任意）" className="mt-5 w-full rounded-xl border border-line bg-cream px-4 py-3 text-sm disabled:opacity-60" /><div className="mt-5 rounded-2xl bg-brand px-5 py-4 text-sm text-white"><div className="flex justify-between"><span>合計</span><strong>{yen(amounts.totalPrice)}</strong></div><div className="mt-1 flex justify-between"><span>初回支払い（50%）</span><strong>{yen(amounts.firstAmount)}</strong></div></div>{(editing || !order) && <div className="mt-5 flex flex-wrap items-center gap-4"><button onClick={approve} disabled={saving} className="rounded-full bg-brand px-6 py-3 text-sm font-bold text-white disabled:opacity-50">{saving ? "保存中..." : order ? "変更を保存" : "購入を許可する"}</button>{message && <p className="text-sm text-ink-soft">{message}</p>}</div>}</section>; }

function SubscriptionPanel({ order, editing, onEdit, price, setPrice, saving, message, approve }: { order: Order | null; editing: boolean; onEdit: () => void; price: number; setPrice: (value: number) => void; saving: boolean; message: string; approve: () => Promise<void> }) { const approved = Boolean(order?.subscriptionApproved); return <section className="mt-6 rounded-3xl border border-line bg-white p-6 shadow-card sm:p-8"><div className="flex items-center justify-between gap-4"><div><p className="text-xs font-bold tracking-[0.14em] text-brand">SUBSCRIPTION</p><h3 className="mt-2 font-maru text-xl font-bold text-ink">維持費サブスクの許可</h3></div>{approved ? <button type="button" onClick={onEdit} disabled={editing} className="rounded-full border border-brand px-4 py-2 text-xs font-bold text-brand disabled:border-line disabled:text-ink-mute">{editing ? "編集中" : "編集"}</button> : <span className="rounded-full bg-brand-soft px-3 py-1 text-xs text-brand">未許可</span>}</div><p className="mt-3 text-sm leading-6 text-ink-soft">サイト公開後の維持費を月額サブスクリプションとして許可します。</p><label className="mt-6 block text-sm font-bold text-ink">月額料金<input disabled={approved && !editing} type="number" min="1" value={price} onChange={(event) => setPrice(Number(event.target.value))} className="mt-2 w-full rounded-xl border border-line bg-cream px-4 py-3 text-lg" /><span className="mt-1 block text-xs font-normal text-ink-mute">利用者にはこの金額で毎月の決済が表示されます。</span></label><div className="mt-5 rounded-xl bg-cream px-4 py-3 text-sm text-ink-soft">状態: <strong className="text-ink">{order?.subscriptionStatus || "未設定"}</strong></div>{(!approved || editing) && <div className="mt-5 flex flex-wrap items-center gap-4"><button onClick={approve} disabled={saving} className="rounded-full bg-brand px-6 py-3 text-sm font-bold text-white disabled:opacity-50">{saving ? "保存中..." : approved ? "変更を保存" : "サブスクを許可する"}</button>{message && <p className="text-sm text-ink-soft">{message}</p>}</div>}</section>; }

function ProfilePanel({ user, order }: { user: AdminUser; order: Order | null }) { return <section className="mt-6 grid gap-6 md:grid-cols-2"><div className="rounded-3xl border border-line bg-white p-6 shadow-card"><p className="text-xs font-bold tracking-[0.14em] text-brand">PROFILE</p><dl className="mt-5 space-y-4 text-sm"><div><dt className="text-ink-mute">表示名</dt><dd className="mt-1 font-bold text-ink">{user.displayName || "未設定"}</dd></div><div><dt className="text-ink-mute">メールアドレス</dt><dd className="mt-1 break-all font-bold text-ink">{user.email || "未設定"}</dd></div><div><dt className="text-ink-mute">ユーザーID</dt><dd className="mt-1 break-all font-mono text-xs text-ink-soft">{user.uid}</dd></div></dl></div><div className="rounded-3xl border border-line bg-white p-6 shadow-card"><p className="text-xs font-bold tracking-[0.14em] text-brand">ORDER STATUS</p><p className="mt-5 font-maru text-2xl font-bold text-ink">{order ? yen(order.totalPrice) : "未設定"}</p><p className="mt-2 text-sm text-ink-soft">{order ? `決済状態: ${order.paymentStatus}` : "購入許可はまだ設定されていません。"}</p></div></section>; }
