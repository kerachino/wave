"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { type Order, yen } from "@/lib/model";

export default function DashboardPaymentPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
    if (!user || !db || !isFirebaseConfigured) return;
    return onSnapshot(doc(db, "orders", user.uid), (snapshot) => setOrder(snapshot.exists() ? snapshot.data() as Order : null));
  }, [loading, user, router]);

  if (loading || !user) return <p className="text-sm text-ink-mute">読み込み中...</p>;
  return <div className="mx-auto max-w-4xl space-y-6"><div><p className="text-xs font-bold tracking-[0.18em] text-brand">PAYMENT</p><h1 className="mt-2 font-maru text-3xl font-bold text-ink">お支払い</h1><p className="mt-2 text-sm text-ink-soft">運営者が設定した購入内容とお支払い状況を確認できます。</p></div>{!order ? <section className="rounded-3xl border border-line bg-white p-8 shadow-card"><h2 className="font-maru text-xl font-bold text-ink">購入許可をお待ちください</h2><p className="mt-3 text-sm leading-7 text-ink-soft">購入内容が確定すると、こちらにお支払い金額と決済ボタンが表示されます。</p></section> : <section className="rounded-3xl border border-line bg-white p-6 shadow-card sm:p-8"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="font-maru text-xl font-bold text-ink">今回のお支払い</h2><span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-bold text-brand-deep">{order.paymentStatus === "paid" ? "支払い済み" : "未払い"}</span></div><div className="mt-6 space-y-3 text-sm"><div className="flex justify-between"><span className="text-ink-soft">基本プラン</span><strong>{yen(order.basePrice)}</strong></div>{order.options.map((option) => <div key={option.id} className="flex justify-between"><span className="text-ink-soft">{option.name}</span><strong>{yen(option.price)}</strong></div>)}<div className="flex justify-between border-t border-line pt-3 font-bold"><span>契約総額</span><span>{yen(order.totalPrice)}</span></div><div className="flex justify-between text-brand"><span>今回の支払い（50%）</span><strong>{yen(order.firstAmount)}</strong></div><div className="flex justify-between text-ink-soft"><span>残金</span><strong>{yen(order.remainingAmount)}</strong></div></div>{order.paymentStatus !== "paid" && <button disabled className="mt-7 w-full rounded-full bg-brand px-5 py-3 text-sm font-bold text-white opacity-60">決済機能を設定中</button>}{order.paymentStatus !== "paid" && <p className="mt-3 text-center text-xs text-ink-mute">決済準備が整い次第、このボタンからお支払いいただけます。</p>}</section>}</div>;
}