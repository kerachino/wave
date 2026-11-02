"use client";

import { useEffect, useRef, useState } from "react";
import { CHAT_MESSAGE_MAX_LENGTH, ensureChatRoom, sendStaffChatMessage, subscribeChat, type ChatMessage } from "@/lib/firebase";

export function AdminChat({ roomId }: { roomId: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [newMessageIds, setNewMessageIds] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const receivedMessages = useRef(false);
  const messageIds = useRef<string[]>([]);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    let cancelled = false;
    async function connect() {
      try {
        await ensureChatRoom(roomId);
        if (cancelled) return;
        unsubscribe = subscribeChat(roomId, (nextMessages) => {
          if (receivedMessages.current) setNewMessageIds((current) => [...current, ...nextMessages.filter((message) => message.sender === "user" && !messageIds.current.includes(message.id)).map((message) => message.id)]);
          receivedMessages.current = true;
          messageIds.current = nextMessages.map((message) => message.id);
          setMessages(nextMessages);
        }, () => setError("メッセージを読み込めませんでした。"));
      } catch { setError("チャットに接続できませんでした。"); }
    }
    connect();
    return () => { cancelled = true; unsubscribe?.(); };
  }, [roomId]);

  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }); }, [messages]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    setSending(true);
    setError("");
    try {
      await sendStaffChatMessage(roomId, trimmed);
      setText("");
    } catch {
      setError("送信に失敗しました。");
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="mt-6 overflow-hidden rounded-3xl border border-line bg-white shadow-card">
      <header className="border-b border-line px-6 py-4">
        <h3 className="font-maru text-xl font-bold text-ink">ユーザーとのチャット</h3>
        <p className="mt-1 text-xs text-ink-mute">このユーザーのDMに運営者として返信します。</p>
      </header>
      <div ref={scrollRef} className="flex max-h-[26rem] min-h-[16rem] flex-col gap-3 overflow-y-auto bg-cream/60 px-5 py-4">
        {messages.length === 0 && <p className="m-auto text-center text-sm text-ink-mute">まだメッセージはありません。</p>}
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === "staff" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-6 ${message.sender === "staff" ? "rounded-tr-sm bg-brand text-white" : "rounded-tl-sm bg-white text-ink shadow-sm"}`}>
              {newMessageIds.includes(message.id) && <span className="mb-1 block text-[10px] font-bold text-brand">新着</span>}
              {message.text}
            </div>
          </div>
        ))}
        {error && <p className="text-center text-xs text-red-600">{error}</p>}
      </div>
      <form onSubmit={submit} className="flex items-center gap-3 border-t border-line p-4">
        <div className="min-w-0 flex-1">
          <input
            value={text}
            onChange={(event) => setText(Array.from(event.target.value).slice(0, CHAT_MESSAGE_MAX_LENGTH).join(""))}
            maxLength={CHAT_MESSAGE_MAX_LENGTH * 2}
            placeholder="返信を入力"
            aria-label="返信を入力（100文字以内）"
            className="w-full rounded-full border border-line bg-cream px-4 py-3 text-sm outline-none focus:border-brand"
          />
          <p className="mt-1 px-3 text-[10px] text-ink-mute">{Array.from(text).length}/{CHAT_MESSAGE_MAX_LENGTH}</p>
        </div>
        <button type="submit" disabled={!text.trim() || sending} className="rounded-full bg-brand px-5 py-3 text-sm font-bold text-white disabled:opacity-40">
          {sending ? "送信中..." : "送信"}
        </button>
      </form>
    </section>
  );
}
