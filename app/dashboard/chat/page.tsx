"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { doc, onSnapshot } from "firebase/firestore";
import { useAuth } from "@/components/AuthProvider";
import {
  db,
  ensureChatRoom,
  isFirebaseConfigured,
  sendChatMessage,
  subscribeChat,
  type ChatMessage,
} from "@/lib/firebase";
import { isAccessUnlocked, type Order } from "@/lib/model";

export default function DashboardChatPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [connecting, setConnecting] = useState(true);
  const [error, setError] = useState("");
  const [newMessageIds, setNewMessageIds] = useState<string[]>([]);
  const [order, setOrder] = useState<Order | null>(null);
  const [orderReady, setOrderReady] = useState(!isFirebaseConfigured);
  const scrollRef = useRef<HTMLDivElement>(null);
  const receivedMessages = useRef(false);
  const messageIds = useRef<string[]>([]);

  // お支払い状況（制限の解除状態）を購読する
  useEffect(() => {
    if (!user || !db || !isFirebaseConfigured) return;
    return onSnapshot(
      doc(db, "orders", user.uid),
      (snapshot) => {
        setOrder(snapshot.exists() ? (snapshot.data() as Order) : null);
        setOrderReady(true);
      },
      () => setOrderReady(true),
    );
  }, [user]);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
    if (!user || !db || !isFirebaseConfigured) return;
    const roomId = user.uid;
    let unsubscribe: (() => void) | null = null;
    let cancelled = false;
    async function connect() {
      try {
        await ensureChatRoom(roomId);
        if (cancelled) return;
        unsubscribe = subscribeChat(
          roomId,
          (nextMessages) => {
            if (receivedMessages.current) {
              setNewMessageIds((current) => [...current, ...nextMessages.filter((message) => message.sender === "staff" && !messageIds.current.includes(message.id)).map((message) => message.id)]);
            }
            receivedMessages.current = true;
            messageIds.current = nextMessages.map((message) => message.id);
            setMessages(nextMessages);
            setConnecting(false);
          },
          () => {
            setError("メッセージを読み込めませんでした。");
            setConnecting(false);
          },
        );
      } catch {
        setError("チャットの接続に失敗しました。");
        setConnecting(false);
      }
    }
    connect();
    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [loading, user, router]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  async function submitMessage(event: React.FormEvent) {
    event.preventDefault();
    if (!user || !text.trim()) return;
    try {
      await sendChatMessage(user.uid, text.trim());
      setText("");
    } catch {
      setError("送信に失敗しました。もう一度お試しください。");
    }
  }

  if (loading || !user || !orderReady)
    return <p className="text-sm text-ink-mute">読み込み中...</p>;
  const unlocked = isAccessUnlocked(order);
  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <p className="text-xs font-bold tracking-[0.18em] text-brand">
          DIRECT MESSAGE
        </p>
        <h1 className="mt-2 font-maru text-3xl font-bold text-ink">チャット</h1>
        <p className="mt-2 text-sm text-ink-soft">
          担当者とのやり取りをここで確認できます。
        </p>
      </div>
      {!unlocked ? (
        <LockedNotice />
      ) : (
      <section className="flex h-[min(70vh,40rem)] min-h-[34rem] flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-card">
        <header className="flex items-center gap-3 border-b border-line px-5 py-4">
          <span className="grid size-10 place-items-center rounded-full bg-brand-soft font-bold text-brand">
            H
          </span>
          <div>
            <p className="text-sm font-bold text-ink">ハトノコネクト担当者</p>
            <p className="mt-0.5 text-xs text-ink-mute">
              通常 {"2〜3営業日"} 以内に返信
            </p>
          </div>
          <span className="ml-auto size-2.5 rounded-full bg-emerald-400" />
        </header>
        <div
          ref={scrollRef}
          className="scrollbar-thin flex-1 space-y-4 overflow-y-auto bg-cream/60 px-4 py-5 sm:px-6"
        >
          {connecting && (
            <p className="text-center text-xs text-ink-mute">接続中...</p>
          )}
          {!isFirebaseConfigured && (
            <p className="rounded-2xl bg-white p-4 text-sm text-ink-soft">
              チャット機能はFirebaseの設定後に利用できます。
            </p>
          )}
          {messages.length === 0 && isFirebaseConfigured && !connecting && (
            <div className="mx-auto max-w-sm rounded-2xl bg-white p-5 text-center text-sm leading-6 text-ink-soft">
              ご契約や制作についてのご相談をお送りください。担当者が確認して返信します。
            </div>
          )}
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} isNew={newMessageIds.includes(message.id)} />
          ))}
          {error && <p className="text-center text-xs text-red-600">{error}</p>}
        </div>
        <form
          onSubmit={submitMessage}
          className="flex items-end gap-3 border-t border-line bg-white p-4"
        >
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            rows={1}
            placeholder="メッセージを入力"
            className="max-h-32 min-h-11 flex-1 resize-none rounded-2xl border border-line bg-cream px-4 py-3 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15"
          />
          <button
            type="submit"
            disabled={!text.trim() || connecting || !isFirebaseConfigured}
            className="grid size-11 shrink-0 place-items-center rounded-full bg-brand text-white transition hover:bg-brand-dark disabled:opacity-40"
            aria-label="メッセージを送信"
          >
            ↑
          </button>
        </form>
      </section>
      )}
    </div>
  );
}

/** お支払い確認前の制限表示 */
function LockedNotice() {
  return (
    <section className="rounded-3xl border border-line bg-white p-8 text-center shadow-card">
      <p className="text-xs font-bold tracking-[0.18em] text-brand">LOCKED</p>
      <h2 className="mt-3 font-maru text-xl font-bold text-ink">
        お支払いの確認後にご利用いただけます
      </h2>
      <p className="mt-3 text-sm leading-7 text-ink-soft">
        ご契約代金のお支払いを確認すると、担当者とのチャットなどの機能がご利用いただけます。
        Square から届く請求書メール、または下のボタンからお支払いをお願いします。
      </p>
      <Link
        href="/dashboard/payment"
        className="mt-6 inline-block rounded-full bg-brand px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-dark"
      >
        お支払いへ進む
      </Link>
    </section>
  );
}

function MessageBubble({ message, isNew }: { message: ChatMessage; isNew?: boolean }) {
  const staff = message.sender === "staff";
  return (
    <div className={`flex ${staff ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-6 ${staff ? "rounded-tl-sm bg-white text-ink shadow-sm" : "rounded-tr-sm bg-brand text-white"}`}
      >
        {isNew && <span className="mb-1 block text-[10px] font-bold text-brand">新着</span>}
        {message.text}
        {message.createdAt && (
          <p
            className={`mt-1 text-[10px] ${staff ? "text-ink-mute" : "text-white/70"}`}
          >
            {message.createdAt.toLocaleString("ja-JP", {
              month: "numeric",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        )}
      </div>
    </div>
  );
}
