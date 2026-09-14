"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { signInAnonymously } from "firebase/auth";
import {
  isFirebaseConfigured,
  auth,
  ensureChatRoom,
  subscribeChat,
  sendChatMessage,
  type ChatMessage,
} from "@/lib/firebase";
import { site } from "@/lib/site";

type ViewState =
  | { status: "idle" }
  | { status: "connecting" }
  | { status: "ready"; roomId: string }
  | { status: "error" };

export function ChatWidget() {
  // URL末尾が #chat の場合は最初から開いておく（初期化時に判定）
  const [open, setOpen] = useState(
    typeof window !== "undefined" && window.location.hash === "#chat",
  );
  const [view, setView] = useState<ViewState>({ status: "idle" });
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 開いたときにFirebaseへ接続（未設定の場合は「準備中」表示のみ）
  useEffect(() => {
    if (!open || !isFirebaseConfigured || !auth) return;
    const currentAuth = auth;
    let unsub: (() => void) | null = null;
    let cancelled = false;

    async function connect() {
      setView({ status: "connecting" });
      try {
        const { user } = await signInAnonymously(currentAuth);
        if (cancelled) return;
        const roomId = user.uid;
        await ensureChatRoom(roomId);
        if (cancelled) return;
        unsub = subscribeChat(
          roomId,
          (list) => {
            setMessages(list);
            setView({ status: "ready", roomId });
          },
          () => setView({ status: "error" }),
        );
      } catch {
        if (!cancelled) setView({ status: "error" });
      }
    }
    connect();

    return () => {
      cancelled = true;
      unsub?.();
    };
  }, [open]);

  // 新着メッセージで自動スクロール
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, view]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || view.status !== "ready") return;
    setSending(true);
    try {
      await sendChatMessage(view.roomId, trimmed);
      setText("");
    } catch {
      alert("送信に失敗しました。時間をおいて再度お試しください。");
    } finally {
      setSending(false);
    }
  }

  const greeting: ChatMessage = {
    id: "greeting",
    sender: "staff",
    text: "こんにちは！ハトノコネクトです。ホームページ制作のご相談、お気軽にどうぞ。営業時間外のご相談も、担当者が確認し次第お返事いたします。",
  };

  return (
    <>
      {/* フローティングボタン */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "チャットを閉じる" : "チャットを開く"}
        className="fixed bottom-5 right-5 z-50 grid size-14 place-items-center rounded-full bg-brand text-white shadow-xl transition-transform hover:scale-105 hover:bg-brand-dark"
      >
        {open ? (
          <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 6l12 12" />
            <path d="M18 6L6 18" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
        )}
      </button>
      {/* チャットパネル */}
      {open && (
        <div className="fixed bottom-24 right-5 z-50 flex h-[28rem] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-3xl border border-ink/10 bg-white shadow-2xl">
          <div className="flex items-center gap-3 bg-ink px-5 py-4 text-white">
            <span className="relative flex size-3">
              <span className="absolute inline-flex h-full w-full rounded-full bg-midori opacity-40" />
              <span className="relative inline-flex size-3 rounded-full bg-midori" />
            </span>
            <div className="flex-1">
              <p className="text-sm font-bold">チャット相談</p>
              <p className="text-[11px] text-white/70">担当者がお返事します</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="閉じる"
              className="grid size-8 place-items-center rounded-full text-white/80 hover:bg-white/10"
            >
              <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M6 6l12 12" />
                <path d="M18 6L6 18" />
              </svg>
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-cream px-4 py-4">
            {!isFirebaseConfigured ? (
              <div className="rounded-2xl bg-white p-4 text-sm leading-6 text-ink-soft shadow-sm">
                チャット機能はただいま準備中です。
                <br />
                お問い合わせフォームをご利用ください。
                <Link
                  href="/contact"
                  className="mt-2 inline-block font-bold text-brand hover:text-brand-deep"
                >
                  お問い合わせフォームへ →
                </Link>
              </div>
            ) : (
              <>
                {view.status === "connecting" && (
                  <p className="text-center text-xs text-ink-mute">接続中...</p>
                )}
                <MessageBubble message={greeting} />
                {messages.map((m) => (
                  <MessageBubble key={m.id} message={m} />
                ))}
                {view.status === "error" && (
                  <p className="text-center text-xs text-red-500">
                    接続に失敗しました。お問い合わせフォームをご利用ください。
                  </p>
                )}
              </>
            )}
          </div>

          {isFirebaseConfigured && (
            <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-ink/10 bg-white p-3">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="メッセージを入力"
                disabled={view.status !== "ready" || sending}
                className="flex-1 rounded-full border border-ink/15 bg-white px-4 py-2.5 text-sm text-ink placeholder:text-ink-mute focus:border-brand focus:outline-none"
              />
              <button
                type="submit"
                disabled={view.status !== "ready" || sending || !text.trim()}
                aria-label="送信"
                className="grid size-11 shrink-0 place-items-center rounded-full bg-brand text-white transition-colors hover:bg-brand-dark disabled:opacity-40"
              >
                <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
                  <path d="M3.4 20.4l17.5-8.4L3.4 3.6 3.3 10l12.5 2-12.5 2z" />
                </svg>
              </button>
            </form>
          )}

          <p className="border-t border-ink/5 bg-cream px-4 py-2 text-[10px] leading-4 text-ink-mute">
            {site.noPhone} 返信目安：{site.replyTime}
          </p>
        </div>
      )}

    </>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isStaff = message.sender === "staff";
  return (
    <div className={`flex ${isStaff ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-6 shadow-sm ${
          isStaff
            ? "rounded-tl-sm bg-white text-ink"
            : "rounded-tr-sm bg-brand text-white"
        }`}
      >
        {message.text}
        {message.createdAt && (
          <p
            className={`mt-1 text-[10px] ${
              isStaff ? "text-ink-mute" : "text-white/70"
            }`}
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

