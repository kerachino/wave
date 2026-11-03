"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import {
  db,
  ensureChatRoom,
  isFirebaseConfigured,
  CHAT_MESSAGE_COOLDOWN_MS,
  CHAT_MESSAGE_MAX_LENGTH,
  ChatRateLimitError,
  sendChatMessage,
  subscribeChat,
  type ChatMessage,
} from "@/lib/firebase";

export default function DashboardChatPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [connecting, setConnecting] = useState(isFirebaseConfigured);
  const [error, setError] = useState("");
  const [newMessageIds, setNewMessageIds] = useState<string[]>([]);
  const [sending, setSending] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const receivedMessages = useRef(false);
  const messageIds = useRef<string[]>([]);

  useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const timer = window.setTimeout(
      () => setCooldownSeconds((seconds) => Math.max(0, seconds - 1)),
      1_000,
    );
    return () => window.clearTimeout(timer);
  }, [cooldownSeconds]);

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
              setNewMessageIds((current) => [
                ...current,
                ...nextMessages
                  .filter(
                    (message) =>
                      message.sender === "staff" &&
                      !messageIds.current.includes(message.id),
                  )
                  .map((message) => message.id),
              ]);
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
    const trimmed = text.trim();
    if (!user || !trimmed || sending || cooldownSeconds > 0) return;
    setError("");
    setSending(true);
    try {
      await sendChatMessage(user.uid, trimmed);
      setText("");
      setCooldownSeconds(Math.ceil(CHAT_MESSAGE_COOLDOWN_MS / 1_000));
    } catch (caught) {
      if (caught instanceof ChatRateLimitError) {
        setCooldownSeconds(caught.retryAfterSeconds);
        setError(
          `連続送信防止のため、あと${caught.retryAfterSeconds}秒お待ちください。`,
        );
      } else {
        setError("送信に失敗しました。もう一度お試しください。");
      }
    } finally {
      setSending(false);
    }
  }

  if (loading || !user)
    return <p className="text-sm text-ink-mute">読み込み中...</p>;
  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <p className="text-xs font-bold tracking-[0.18em] text-brand">
          DIRECT MESSAGE
        </p>
        <h1 className="mt-2 font-maru text-3xl font-bold text-ink">チャット</h1>
        {/* <p className="mt-2 text-sm text-ink-soft">
          お支払い前でもご利用いただけます。1回100文字まで、送信は5秒に1回です。
        </p> */}
      </div>
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
            <MessageBubble
              key={message.id}
              message={message}
              isNew={newMessageIds.includes(message.id)}
            />
          ))}
          {error && <p className="text-center text-xs text-red-600">{error}</p>}
        </div>
        <form
          onSubmit={submitMessage}
          className="flex items-end gap-3 border-t border-line bg-white p-4"
        >
          <textarea
            value={text}
            onChange={(event) =>
              setText(
                Array.from(event.target.value)
                  .slice(0, CHAT_MESSAGE_MAX_LENGTH)
                  .join(""),
              )
            }
            maxLength={CHAT_MESSAGE_MAX_LENGTH * 2}
            rows={1}
            placeholder="メッセージを入力"
            disabled={connecting || !isFirebaseConfigured || sending}
            aria-label="メッセージを入力（100文字以内）"
            className="max-h-32 min-h-11 flex-1 resize-none rounded-2xl border border-line bg-cream px-4 py-3 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15"
          />
          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] text-ink-mute">
              {Array.from(text).length}/{CHAT_MESSAGE_MAX_LENGTH}
            </span>
            <button
              type="submit"
              disabled={
                !text.trim() ||
                connecting ||
                sending ||
                cooldownSeconds > 0 ||
                !isFirebaseConfigured
              }
              className="grid size-11 shrink-0 place-items-center rounded-full bg-brand text-white transition hover:bg-brand-dark disabled:opacity-40"
              aria-label="メッセージを送信"
            >
              {cooldownSeconds > 0 ? cooldownSeconds : "↑"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function MessageBubble({
  message,
  isNew,
}: {
  message: ChatMessage;
  isNew?: boolean;
}) {
  const staff = message.sender === "staff";
  return (
    <div className={`flex ${staff ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-6 ${staff ? "rounded-tl-sm bg-white text-ink shadow-sm" : "rounded-tr-sm bg-brand text-white"}`}
      >
        {isNew && (
          <span className="mb-1 block text-[10px] font-bold text-brand">
            新着
          </span>
        )}
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
