"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { maintenanceSubscriptionPrice, type Order, yen } from "@/lib/model";

type PaymentTab = "project" | "subscription";

export default function DashboardPaymentPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [tab, setTab] = useState<PaymentTab>("project");

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
    if (!user || !db || !isFirebaseConfigured) return;
    return onSnapshot(doc(db, "orders", user.uid), (snapshot) => setOrder(snapshot.exists() ? snapshot.data() as Order : null));
  }, [loading, user, router]);

  if (loading || !user) return <p className="text-sm text-ink-mute">読み込み中...</p>;
  return <div className="mx-auto max-w-4xl space-y-6"><header><p className="text-xs font-bold tracking-[0.18em] text-brand">PAYMENT</p><h1 className="mt-2 font-maru text-3xl font-bold text-ink">お支払い</h1><p className="mt-2 text-sm text-ink-soft">本契約は原則前払いです。維持費サブスクは別途ご案内します。</p></header><nav className="flex gap-2 border-b border-line" aria-label="支払いメニュー"><button type="button" onClick={() => setTab("project")} className={`border-b-2 px-4 py-3 text-sm font-bold ${tab === "project" ? "border-brand text-brand" : "border-transparent text-ink-mute"}`}>本契約</button><button type="button" onClick={() => setTab("subscription")} className={`border-b-2 px-4 py-3 text-sm font-bold ${tab === "subscription" ? "border-brand text-brand" : "border-transparent text-ink-mute"}`}>維持費サブスク</button></nav>{!order ? <section className="rounded-3xl border border-line bg-white p-8 shadow-card"><h2 className="font-maru text-xl font-bold text-ink">購入許可をお待ちください</h2><p className="mt-3 text-sm leading-7 text-ink-soft">運営者が購入内容を設定すると、こちらに表示されます。</p></section> : tab === "project" ? <ProjectPayment order={order} /> : <SubscriptionPayment order={order} />}</div>;
}

function ProjectPayment({ order }: { order: Order }) { return <section className="rounded-3xl border border-line bg-white p-6 shadow-card sm:p-8"><div className="flex items-center justify-between gap-3"><div><p className="text-xs font-bold tracking-[0.14em] text-brand">PROJECT PAYMENT</p><h2 className="mt-2 font-maru text-xl font-bold text-ink">本契約のお支払い</h2></div><Status value={order.paymentStatus === "paid" ? "支払い済み" : "未払い"} /></div><div className="mt-6 space-y-3 text-sm"><Line label="基本プラン" value={yen(order.basePrice)} />{order.options.map((option) => <Line key={option.id} label={option.name} value={yen(option.price)} />)}<Line label="お支払い総額（前払い）" value={yen(order.totalPrice)} strong /></div>{order.paymentStatus !== "paid" && <button disabled className="mt-7 w-full rounded-full bg-brand px-5 py-3 text-sm font-bold text-white opacity-60">決済機能を設定中</button>}<p className="mt-3 text-center text-xs text-ink-mute">制作開始前に全額をお支払いいただきます。</p></section>; }

function SubscriptionPayment({ order }: { order: Order }) { const approved = Boolean(order.subscriptionApproved); return <section className="rounded-3xl border border-line bg-white p-6 shadow-card sm:p-8"><div className="flex items-center justify-between gap-3"><div><p className="text-xs font-bold tracking-[0.14em] text-brand">MONTHLY SUPPORT</p><h2 className="mt-2 font-maru text-xl font-bold text-ink">維持費サブスク</h2></div><Status value={approved ? order.subscriptionStatus === "paid" ? "支払い済み" : "許可済み・未払い" : "未許可"} /></div><p className="mt-4 text-sm leading-7 text-ink-soft">サイト公開後の維持・更新サポートに必要な月額費用です。</p>{approved ? <><div className="mt-6 rounded-2xl bg-cream p-5"><p className="text-sm text-ink-soft">月額料金</p><p className="mt-1 font-maru text-3xl font-bold text-ink">{yen(order.subscriptionPrice ?? maintenanceSubscriptionPrice)}</p></div><button disabled className="mt-6 w-full rounded-full border border-brand px-5 py-3 text-sm font-bold text-brand opacity-60">サブスク決済機能を設定中</button></> : <p className="mt-6 rounded-xl bg-cream px-4 py-3 text-sm text-ink-mute">運営者によるサブスク許可待ちです。</p>}</section>; }

function Line({ label, value, strong }: { label: string; value: string; strong?: boolean }) { return <div className={`flex justify-between gap-4 ${strong ? "border-t border-line pt-3 font-bold text-brand" : "text-ink"}`}><span className={strong ? "" : "text-ink-soft"}>{label}</span><span>{value}</span></div>; }
function Status({ value }: { value: string }) { return <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-bold text-brand-deep">{value}</span>; }
