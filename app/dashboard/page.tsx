"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, onSnapshot } from "firebase/firestore";
import { useAuth } from "@/components/AuthProvider";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { isAccessUnlocked, yen, type Order } from "@/lib/model";
export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  useEffect(() => {
    if (!loading && !user) router.replace("/login");
    if (!user || !db || !isFirebaseConfigured) return;
    return onSnapshot(doc(db, "orders", user.uid), (snapshot) =>
      setOrder(snapshot.exists() ? (snapshot.data() as Order) : null),
    );
  }, [loading, user, router]);
  if (loading || !user)
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-sm text-ink-mute">
        読み込み中...
      </div>
    );
  const unlocked = isAccessUnlocked(order);
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <p className="text-xs font-bold tracking-[0.18em] text-brand">
          OVERVIEW
        </p>
        <h1 className="mt-2 font-maru text-3xl font-bold text-ink">
          ご契約の進行状況
        </h1>
        <p className="mt-2 text-sm text-ink-soft">{user.email}</p>
      </div>
      {!order ? (
        <section className="rounded-3xl border border-line bg-white p-8 shadow-card">
          <h2 className="font-maru text-xl font-bold text-ink">
            購入許可をお待ちください
          </h2>
          <p className="mt-3 text-sm leading-7 text-ink-soft">
            運営者が内容とオプションを確認した後、このページに料金と決済ボタンが表示されます。
          </p>
        </section>
      ) : (
        <OrderCard order={order} />
      )}
      <section className="rounded-3xl border border-line bg-white p-6 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-maru text-xl font-bold text-ink">
            担当者に相談する
          </h2>
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${unlocked ? "bg-brand-soft text-brand-deep" : "bg-cream text-ink-mute"}`}
          >
            {unlocked ? "制限解除済み" : "お支払い待ち"}
          </span>
        </div>
        <p className="mt-2 text-sm text-ink-soft">
          {unlocked
            ? "ご相談や制作のやり取りは、専用チャットで行えます。"
            : "お支払いを確認すると、専用チャットなどの機能をご利用いただけます。"}
        </p>
        <button
          onClick={() =>
            router.push(unlocked ? "/dashboard/chat" : "/dashboard/payment")
          }
          className="mt-5 rounded-full bg-brand px-5 py-3 text-sm font-bold text-white hover:bg-brand-dark"
        >
          {unlocked ? "チャットを開く" : "お支払いへ進む"}
        </button>
      </section>
    </div>
  );
}
function OrderCard({ order }: { order: Order }) {
  const router = useRouter();
  return (
    <section className="rounded-3xl border border-line bg-white p-6 shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-maru text-xl font-bold text-ink">購入内容</h2>
        <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-bold text-brand-deep">
          {order.paymentStatus === "paid" ? "契約完了" : "決済待ち"}
        </span>
      </div>
      <div className="mt-5 space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-ink-soft">基本プラン</span>
          <strong>{yen(order.basePrice)}</strong>
        </div>
        {order.options.map((option) => (
          <div className="flex justify-between" key={option.id}>
            <span className="text-ink-soft">{option.name}</span>
            <strong>{yen(option.price)}</strong>
          </div>
        ))}
        <div className="flex justify-between border-t border-line pt-3 font-bold">
          <span>合計</span>
          <span>{yen(order.totalPrice)}</span>
        </div>
        <div className="flex justify-between text-brand">
          <span>今回のお支払い（50%）</span>
          <strong>{yen(order.firstAmount)}</strong>
        </div>
      </div>
      {order.paymentStatus !== "paid" ? (
        <button
          onClick={() => router.push("/dashboard/payment")}
          className="mt-6 w-full rounded-full bg-brand px-5 py-3 text-sm font-bold text-white hover:bg-brand-dark"
        >
          Squareで請求書を受け取る
        </button>
      ) : (
        <p className="mt-6 rounded-xl bg-brand-soft px-4 py-3 text-xs text-brand-deep">
          お支払いを確認しました。利用制限は解除されています。
        </p>
      )}
    </section>
  );
}
