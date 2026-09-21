"use client";

import { useEffect, useState } from "react";
import { collection, doc, onSnapshot, setDoc } from "firebase/firestore";
import { useAuth } from "@/components/AuthProvider";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { basePlanPrice, computeAmounts, maintenanceSubscriptionPrice, purchasableOptions, type Order, yen } from "@/lib/model";
import { AdminChat } from "@/components/admin/AdminChat";
import { EstimatePanel } from "@/components/admin/EstimatePanel";

type AdminUser = { uid: string; email?: string; displayName?: string; photoURL?: string };
type AdminTab = "chat" | "purchase" | "subscription" | "estimate" | "profile" | "system";
type CustomOption = { id: string; name: string; price: number; defaultPrice: number };

export default function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const [password, setPassword] = useState("");
  const [verified, setVerified] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [selectedUid, setSelectedUid] = useState("");
  const [activeTab, setActiveTab] = useState<AdminTab>("chat");
  const [order, setOrder] = useState<Order | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [customOptions, setCustomOptions] = useState<CustomOption[]>([]);
  const [note, setNote] = useState("");
  const [purchaseEditing, setPurchaseEditing] = useState(false);
  const [subscriptionEditing, setSubscriptionEditing] = useState(false);
  const [subscriptionPrice, setSubscriptionPrice] = useState(maintenanceSubscriptionPrice);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user || !isAdmin || !verified || !db) return;
    return onSnapshot(collection(db, "users"), (snapshot) => {
      const next = snapshot.docs.map((item) => ({ uid: item.id, ...item.data() })) as AdminUser[];
      next.sort((a, b) => (a.displayName || a.email || a.uid).localeCompare(b.displayName || b.email || b.uid, "ja"));
      setUsers(next);
      setSelectedUid((current) => current || next[0]?.uid || "");
    });
  }, [user, isAdmin, verified]);

  useEffect(() => {
    if (!selectedUid || !verified || !db) return;
    return onSnapshot(doc(db, "orders", selectedUid), (snapshot) => {
      const next = snapshot.exists() ? snapshot.data() as Order : null;
      setOrder(next);
      setSelectedIds(next?.options.filter((option) => purchasableOptions.some((preset) => preset.id === option.id)).map((option) => option.id) || []);
      setCustomOptions(next?.options.filter((option) => !purchasableOptions.some((preset) => preset.id === option.id)).map((option) => ({ id: option.id, name: option.name, price: option.price, defaultPrice: option.price })) || []);
      setNote(next?.note || "");
      setSubscriptionPrice(next?.subscriptionPrice ?? maintenanceSubscriptionPrice);
      setPurchaseEditing(!next);
      setSubscriptionEditing(!next?.subscriptionApproved);
    });
  }, [selectedUid, verified]);

  const selectedUser = users.find((item) => item.uid === selectedUid);
  const options = [...purchasableOptions.filter((option) => selectedIds.includes(option.id)).map((option) => ({ ...option, price: option.defaultPrice })), ...customOptions.filter((option) => option.name.trim() && option.price > 0).map((option) => ({ ...option, defaultPrice: option.price }))];
  const amounts = computeAmounts(basePlanPrice, options);

  async function verifyPassword(event: React.FormEvent) {
    event.preventDefault();
    const response = await fetch("/api/admin/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
    if (!response.ok) { const data = await response.json().catch(() => ({})); setPasswordError(data.error || "パスワードが正しくありません。"); return; }
    setVerified(true);
  }

  function selectUser(uid: string) { setSelectedUid(uid); setOrder(null); setSelectedIds([]); setCustomOptions([]); setNote(""); setMessage(""); setActiveTab("chat"); }
  function cancelPurchaseEdit() { setSelectedIds(order?.options.filter((option) => purchasableOptions.some((preset) => preset.id === option.id)).map((option) => option.id) || []); setCustomOptions(order?.options.filter((option) => !purchasableOptions.some((preset) => preset.id === option.id)).map((option) => ({ id: option.id, name: option.name, price: option.price, defaultPrice: option.price })) || []); setNote(order?.note || ""); setPurchaseEditing(false); }

  async function savePurchase() {
    if (!selectedUid || !db || !isFirebaseConfigured) { setMessage("ユーザーとFirebase設定を確認してください。"); return; }
    setSaving(true); setMessage("");
    try { await setDoc(doc(db, "orders", selectedUid), { uid: selectedUid, basePrice: basePlanPrice, options, ...amounts, status: "pending_payment", paymentStatus: "unpaid", note, purchaseApproved: true }, { merge: true }); setPurchaseEditing(false); setMessage("購入許可を保存しました。"); } catch { setMessage("保存に失敗しました。"); } finally { setSaving(false); }
  }

  async function saveSubscription() {
    if (!selectedUid || !db || !isFirebaseConfigured || subscriptionPrice <= 0) { setMessage("サブスク料金を確認してください。"); return; }
    setSaving(true); setMessage("");
    try { await setDoc(doc(db, "orders", selectedUid), { subscriptionApproved: true, subscriptionPrice, subscriptionStatus: "unpaid" }, { merge: true }); setSubscriptionEditing(false); setMessage("維持費サブスクを保存しました。"); } catch { setMessage("保存に失敗しました。"); } finally { setSaving(false); }
  }

  if (loading) return <div className="mx-auto max-w-6xl px-4 py-16 text-sm text-ink-mute">認証中...</div>;
  if (!isAdmin) return <div className="mx-auto max-w-6xl px-4 py-16"><h1 className="font-maru text-2xl font-bold text-ink">管理者専用ページ</h1><p className="mt-3 text-sm text-ink-soft">管理者アカウントでログインしてください。</p></div>;
  if (!verified) return <div className="mx-auto max-w-md px-4 py-16"><section className="rounded-3xl border border-line bg-white p-8 shadow-card"><p className="text-xs font-bold tracking-[0.18em] text-brand">ADMIN</p><h1 className="mt-2 font-maru text-2xl font-bold text-ink">管理者パスワード</h1><form onSubmit={verifyPassword} className="mt-6 space-y-4"><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="パスワード" className="w-full rounded-xl border border-line bg-cream px-4 py-3 text-sm" /><button className="w-full rounded-full bg-brand px-5 py-3 text-sm font-bold text-white">管理ページを開く</button>{passwordError && <p className="text-sm text-red-600">{passwordError}</p>}</form></section></div>;

  return <div className="min-h-[calc(100vh-4rem)] bg-cream/50"><div className="mx-auto flex max-w-7xl flex-col lg:flex-row"><aside className="w-full shrink-0 border-b border-line bg-white p-5 lg:min-h-[calc(100vh-4rem)] lg:w-80 lg:border-b-0 lg:border-r lg:p-7"><div className="flex items-end justify-between"><div><p className="text-xs font-bold tracking-[0.18em] text-brand">ADMIN SPACE</p><h1 className="mt-2 font-maru text-xl font-bold text-ink">ユーザー一覧</h1></div><span className="rounded-full bg-brand-soft px-3 py-1 text-xs text-brand">{users.length}名</span></div><div className="mt-6 space-y-2">{users.map((candidate) => <button key={candidate.uid} type="button" onClick={() => selectUser(candidate.uid)} className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left ${selectedUid === candidate.uid ? "bg-brand text-white" : "hover:bg-cream"}`}><div className="grid size-10 shrink-0 place-items-center rounded-full bg-brand-soft text-sm font-bold text-brand">{(candidate.displayName || candidate.email || "U").slice(0, 1)}</div><span className="min-w-0"><strong className="block truncate text-sm">{candidate.displayName || "名前未設定"}</strong><span className="block truncate text-xs opacity-70">{candidate.email || candidate.uid}</span></span></button>)}</div></aside><main className="min-w-0 flex-1 px-4 py-8 sm:px-8 lg:px-12">{selectedUser ? <><header className="mb-6"><p className="text-xs font-bold tracking-[0.18em] text-brand">ADMIN WORKSPACE</p><h2 className="mt-2 font-maru text-3xl font-bold text-ink">{selectedUser.displayName || "名前未設定"}</h2><p className="mt-2 text-sm text-ink-soft">{selectedUser.email}</p></header><nav className="flex gap-2 overflow-x-auto border-b border-line"><Tab active={activeTab === "chat"} label="チャット" onClick={() => setActiveTab("chat")} /><Tab active={activeTab === "purchase"} label="購入許可" onClick={() => setActiveTab("purchase")} /><Tab active={activeTab === "subscription"} label="維持費サブスク" onClick={() => setActiveTab("subscription")} /><Tab active={activeTab === "estimate"} label="見積もり" onClick={() => setActiveTab("estimate")} /><Tab active={activeTab === "profile"} label="ユーザー情報" onClick={() => setActiveTab("profile")} /><Tab active={activeTab === "system"} label="決済設定" onClick={() => setActiveTab("system")} /></nav>{activeTab === "chat" && <AdminChat roomId={selectedUid} />}{activeTab === "purchase" && <PurchasePanel order={order} editing={purchaseEditing} selectedIds={selectedIds} setSelectedIds={setSelectedIds} customOptions={customOptions} setCustomOptions={setCustomOptions} note={note} setNote={setNote} amounts={amounts} saving={saving} message={message} onEdit={() => setPurchaseEditing(true)} onCancel={cancelPurchaseEdit} onSave={savePurchase} />}{activeTab === "subscription" && <SubscriptionPanel order={order} editing={subscriptionEditing} price={subscriptionPrice} setPrice={setSubscriptionPrice} saving={saving} message={message} onEdit={() => setSubscriptionEditing(true)} onCancel={() => { setSubscriptionPrice(order?.subscriptionPrice ?? maintenanceSubscriptionPrice); setSubscriptionEditing(false); }} onSave={saveSubscription} />}{activeTab === "estimate" && <EstimatePanel uid={selectedUid} userName={selectedUser.displayName || selectedUser.email || "お客様"} />}{activeTab === "profile" && <ProfilePanel user={selectedUser} order={order} />}{activeTab === "system" && <SystemPanel password={password} />}</> : <p className="rounded-3xl border border-dashed border-line bg-white p-10 text-center text-sm text-ink-soft">ユーザーを選択してください。</p>}</main></div></div>;
}

function Tab({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) { return <button type="button" onClick={onClick} className={`shrink-0 px-4 py-3 text-sm font-bold ${active ? "border-b-2 border-brand text-brand" : "text-ink-mute"}`}>{label}</button>; }

function PurchasePanel({ order, editing, selectedIds, setSelectedIds, customOptions, setCustomOptions, note, setNote, amounts, saving, message, onEdit, onCancel, onSave }: { order: Order | null; editing: boolean; selectedIds: string[]; setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>; customOptions: CustomOption[]; setCustomOptions: React.Dispatch<React.SetStateAction<CustomOption[]>>; note: string; setNote: (value: string) => void; amounts: ReturnType<typeof computeAmounts>; saving: boolean; message: string; onEdit: () => void; onCancel: () => void; onSave: () => Promise<void> }) { const disabled = Boolean(order) && !editing; return <section className="mt-6 rounded-3xl border border-line bg-white p-6 shadow-card"><div className="flex items-center justify-between"><div><p className="text-xs font-bold tracking-[0.14em] text-brand">PURCHASE CONTROL</p><h3 className="mt-2 font-maru text-xl font-bold text-ink">購入許可の設定</h3></div>{order && !editing && <button onClick={onEdit} className="rounded-full border border-brand px-4 py-2 text-xs font-bold text-brand">編集</button>}</div><p className="mt-3 text-xs text-ink-mute">{disabled ? "購入許可済みです。編集する場合は編集を押してください。" : "設定内容を確認して保存します。"}</p><div className="mt-5 space-y-3">{purchasableOptions.map((option) => <label key={option.id} className="flex justify-between rounded-xl bg-cream px-4 py-3 text-sm"><span><input type="checkbox" disabled={disabled} checked={selectedIds.includes(option.id)} onChange={(event) => setSelectedIds((current) => event.target.checked ? [...current, option.id] : current.filter((id) => id !== option.id))} className="mr-3" />{option.name}</span><strong>{yen(option.defaultPrice)}</strong></label>)}</div><div className="mt-5 rounded-2xl border border-dashed border-line p-4"><div className="flex items-center justify-between"><p className="text-sm font-bold text-ink">自由追加項目</p><button disabled={disabled} onClick={() => setCustomOptions((current) => [...current, { id: `custom-${Date.now()}`, name: "", price: 0, defaultPrice: 0 }])} className="rounded-full border border-brand px-3 py-2 text-xs text-brand disabled:opacity-40">項目を追加</button></div>{customOptions.map((option) => <div key={option.id} className="mt-2 flex gap-2"><input disabled={disabled} value={option.name} onChange={(event) => setCustomOptions((current) => current.map((item) => item.id === option.id ? { ...item, name: event.target.value } : item))} placeholder="項目名" className="min-w-0 flex-1 rounded-lg border border-line bg-cream px-3 py-2 text-sm" /><input disabled={disabled} type="number" value={option.price || ""} onChange={(event) => setCustomOptions((current) => current.map((item) => item.id === option.id ? { ...item, price: Number(event.target.value), defaultPrice: Number(event.target.value) } : item))} placeholder="価格" className="w-28 rounded-lg border border-line bg-cream px-3 py-2 text-sm" /></div>)}</div><textarea disabled={disabled} value={note} onChange={(event) => setNote(event.target.value)} rows={3} placeholder="メモ" className="mt-5 w-full rounded-xl border border-line bg-cream px-4 py-3 text-sm" /><div className="mt-5 rounded-2xl bg-brand p-4 text-sm text-white">合計 {yen(amounts.totalPrice)} / 初回50% {yen(amounts.firstAmount)}</div>{(!order || editing) && <div className="mt-5 flex gap-3"><button onClick={onSave} disabled={saving} className="rounded-full bg-brand px-5 py-3 text-sm font-bold text-white">{saving ? "保存中..." : order ? "変更を保存" : "購入を許可する"}</button>{order && <button onClick={onCancel} disabled={saving} className="rounded-full border border-line px-5 py-3 text-sm font-bold text-ink-soft">キャンセル</button>}{message && <p className="self-center text-sm text-ink-soft">{message}</p>}</div>}</section>; }

function SubscriptionPanel({ order, editing, price, setPrice, saving, message, onEdit, onCancel, onSave }: { order: Order | null; editing: boolean; price: number; setPrice: (value: number) => void; saving: boolean; message: string; onEdit: () => void; onCancel: () => void; onSave: () => Promise<void> }) { const approved = Boolean(order?.subscriptionApproved); const disabled = approved && !editing; return <section className="mt-6 rounded-3xl border border-line bg-white p-6 shadow-card"><div className="flex items-center justify-between"><div><p className="text-xs font-bold tracking-[0.14em] text-brand">SUBSCRIPTION</p><h3 className="mt-2 font-maru text-xl font-bold text-ink">維持費サブスク</h3></div>{approved && !editing && <button onClick={onEdit} className="rounded-full border border-brand px-4 py-2 text-xs font-bold text-brand">編集</button>}</div><p className="mt-3 text-sm text-ink-soft">月額料金を設定してサブスクの購入許可を行います。</p><input disabled={disabled} type="number" min="1" value={price} onChange={(event) => setPrice(Number(event.target.value))} className="mt-5 w-full rounded-xl border border-line bg-cream px-4 py-3 text-lg" />{(!approved || editing) && <div className="mt-5 flex gap-3"><button onClick={onSave} disabled={saving} className="rounded-full bg-brand px-5 py-3 text-sm font-bold text-white">{saving ? "保存中..." : approved ? "変更を保存" : "サブスクを許可する"}</button>{approved && <button onClick={onCancel} className="rounded-full border border-line px-5 py-3 text-sm font-bold text-ink-soft">キャンセル</button>}{message && <p className="self-center text-sm text-ink-soft">{message}</p>}</div>}</section>; }

function ProfilePanel({ user, order }: { user: AdminUser; order: Order | null }) { return <section className="mt-6 grid gap-6 md:grid-cols-2"><div className="rounded-3xl border border-line bg-white p-6 shadow-card"><p className="text-xs text-brand">PROFILE</p><p className="mt-4 font-bold">{user.displayName || "未設定"}</p><p className="mt-2 break-all text-sm text-ink-soft">{user.email}</p><p className="mt-2 break-all font-mono text-xs text-ink-mute">{user.uid}</p></div><div className="rounded-3xl border border-line bg-white p-6 shadow-card"><p className="text-xs text-brand">ORDER STATUS</p><p className="mt-4 font-maru text-2xl font-bold">{order ? yen(order.totalPrice) : "未設定"}</p><p className="mt-2 text-sm text-ink-soft">{order?.paymentStatus || "購入許可なし"}</p><p className="mt-2 text-xs text-ink-mute">利用制限: {order?.accessUnlocked ? "解除済み" : "未解除"}／Square請求書: {order?.projectInvoice?.id || "未発行"}</p>{order?.projectInvoice?.publicUrl && <a href={order.projectInvoice.publicUrl} target="_blank" rel="noreferrer" className="mt-2 inline-block break-all text-xs font-bold text-brand hover:text-brand-deep">Squareの請求書を開く</a>}</div></section>; }

type DiagnosticsResult = {
  ok: boolean;
  ready?: boolean;
  missing?: string[];
  square?: {
    configured: boolean;
    hasAccessToken: boolean;
    hasLocationId: boolean;
    hasWebhookSignatureKey: boolean;
    environment: string;
  };
  firebaseAdmin?: {
    configured: boolean;
    hasServiceAccountKey: boolean;
    hasSplitKeys: boolean;
  };
  hint?: string;
  error?: string;
};

function SystemPanel({ password }: { password: string }) {
  const [result, setResult] = useState<DiagnosticsResult | null>(null);
  const [checking, setChecking] = useState(false);

  async function check() {
    setChecking(true);
    setResult(null);
    try {
      const response = await fetch("/api/admin/diagnostics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await response.json().catch(() => ({}))) as DiagnosticsResult;
      setResult(data);
    } catch {
      setResult({ ok: false, error: "診断APIへの接続に失敗しました。" });
    } finally {
      setChecking(false);
    }
  }

  return (
    <section className="mt-6 rounded-3xl border border-line bg-white p-6 shadow-card">
      <p className="text-xs font-bold tracking-[0.14em] text-brand">SYSTEM</p>
      <h3 className="mt-2 font-maru text-xl font-bold text-ink">決済設定の診断</h3>
      <p className="mt-3 text-sm leading-7 text-ink-soft">
        本番で「決済の準備が完了していません」が出る場合、不足しているサーバー側の環境変数をここで確認できます（秘密鍵の値は表示しません）。
      </p>
      <button
        type="button"
        onClick={check}
        disabled={checking}
        className="mt-5 rounded-full bg-brand px-5 py-3 text-sm font-bold text-white disabled:opacity-60"
      >
        {checking ? "確認中..." : "設定状況を確認する"}
      </button>
      {result && !result.ok && (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {result.error || "確認に失敗しました。"}
        </p>
      )}
      {result?.ok && (
        <div className="mt-5 space-y-3 text-sm">
          <p className={`rounded-xl px-4 py-3 font-bold ${result.ready ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
            {result.ready ? "○ 決済の発行準備は完了しています" : "× 不足している設定があります"}
          </p>
          {result.missing && result.missing.length > 0 && (
            <p className="rounded-xl bg-cream px-4 py-3 text-ink-soft">
              不足: <span className="font-mono font-bold">{result.missing.join(" / ")}</span>
            </p>
          )}
          <ul className="space-y-1 text-xs text-ink-soft">
            <li>SQUARE_ACCESS_TOKEN: {result.square?.hasAccessToken ? "○" : "×"}</li>
            <li>SQUARE_LOCATION_ID: {result.square?.hasLocationId ? "○" : "×"}</li>
            <li>SQUARE_ENVIRONMENT: {result.square?.environment}</li>
            <li>SQUARE_WEBHOOK_SIGNATURE_KEY: {result.square?.hasWebhookSignatureKey ? "○" : "×（Webhook受信不可）"}</li>
            <li>Firebase Admin: {result.firebaseAdmin?.configured ? "○" : "×"}</li>
          </ul>
          {result.hint && <p className="text-xs text-ink-mute">{result.hint}</p>}
        </div>
      )}
    </section>
  );
}
