"use client";

import { useEffect, useState } from "react";
import { addDoc, collection, onSnapshot, query, serverTimestamp, where } from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { basePlanPrice, computeAmounts, purchasableOptions, type Quote, yen } from "@/lib/model";

type CustomQuoteOption = { id: string; name: string; price: number };

export function EstimatePanel({ uid, userName }: { uid: string; userName: string }) {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [title, setTitle] = useState("ホームページ制作のお見積もり");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [customOptions, setCustomOptions] = useState<CustomQuoteOption[]>([]);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!db || !isFirebaseConfigured) return;
    const quotesQuery = query(collection(db, "quotes"), where("uid", "==", uid));
    return onSnapshot(quotesQuery, (snapshot) => {
      const next = snapshot.docs.map((item) => {
        const data = item.data();
        return { id: item.id, ...data, createdAt: data.createdAt?.toDate?.() } as Quote;
      });
      next.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
      setQuotes(next);
    });
  }, [uid]);

  const options = [
    ...purchasableOptions.filter((option) => selectedIds.includes(option.id)).map((option) => ({ id: option.id, name: option.name, price: option.defaultPrice })),
    ...customOptions.filter((option) => option.name.trim() && option.price > 0),
  ];
  const amounts = computeAmounts(basePlanPrice, options.map((option) => ({ ...option, defaultPrice: option.price })));

  async function saveQuote() {
    if (!db || !isFirebaseConfigured || !title.trim()) { setMessage("見積もりタイトルを入力してください。"); return; }
    setSaving(true);
    setMessage("");
    try {
      await addDoc(collection(db, "quotes"), { uid, title: title.trim(), basePrice: basePlanPrice, options, ...amounts, note: note.trim(), createdAt: serverTimestamp() });
      setMessage("見積書を保存しました。");
    } catch { setMessage("見積書の保存に失敗しました。"); } finally { setSaving(false); }
  }

  async function downloadImage(quote: Quote) {
    const esc = (value: string) => value.replace(/[&<>\"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" })[character] || character);
    const lines = [
      quote.title,
      `宛名: ${userName || "お客様"}`,
      "",
      `基本プラン  ${yen(quote.basePrice)}`,
      ...quote.options.map((option) => `${option.name}  ${yen(option.price)}`),
      "",
      `合計  ${yen(quote.totalPrice)}`,
      `初回支払い（50%）  ${yen(quote.firstAmount)}`,
      `残金  ${yen(quote.remainingAmount)}`,
      quote.note ? `メモ: ${quote.note}` : "",
    ].filter(Boolean);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="${Math.max(560, 180 + lines.length * 48)}"><rect width="100%" height="100%" fill="#fffdf9"/><rect x="40" y="40" width="1120" height="${Math.max(480, 100 + lines.length * 48)}" rx="28" fill="#ffffff" stroke="#d9d3c8"/><text x="90" y="115" font-family="sans-serif" font-size="30" font-weight="700" fill="#20252b">${lines.map((line, index) => `<tspan x="90" dy="${index === 0 ? 0 : 48}" font-size="${index === 0 ? 34 : 24}" font-weight="${index === 0 ? 700 : 400}">${esc(line)}</tspan>`).join("")}</text></svg>`;
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 1200;
      canvas.height = Math.max(560, 180 + lines.length * 48);
      const context = canvas.getContext("2d");
      if (!context) return;
      context.drawImage(image, 0, 0);
      const link = document.createElement("a");
      link.download = `見積書-${quote.id}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      URL.revokeObjectURL(url);
    };
    image.src = url;
  }

  return <section className="mt-6 space-y-6"><div className="rounded-3xl border border-line bg-white p-6 shadow-card sm:p-8"><div><p className="text-xs font-bold tracking-[0.14em] text-brand">ESTIMATE BUILDER</p><h3 className="mt-2 font-maru text-xl font-bold text-ink">見積書を作成</h3><p className="mt-2 text-sm text-ink-soft">定型オプションと自由項目を組み合わせて、複数の見積書を保存できます。</p></div><input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="見積もりタイトル" className="mt-5 w-full rounded-xl border border-line bg-cream px-4 py-3 text-sm" /><div className="mt-5 space-y-3">{purchasableOptions.map((option) => <label key={option.id} className="flex justify-between rounded-xl border border-line bg-cream px-4 py-3 text-sm"><span><input type="checkbox" checked={selectedIds.includes(option.id)} onChange={(event) => setSelectedIds((current) => event.target.checked ? [...current, option.id] : current.filter((id) => id !== option.id))} className="mr-3" />{option.name}</span><strong>{yen(option.defaultPrice)}</strong></label>)}</div><div className="mt-5 rounded-2xl border border-dashed border-line p-4"><div className="flex items-center justify-between"><div><h4 className="text-sm font-bold text-ink">自由項目</h4><p className="mt-1 text-xs text-ink-mute">この見積書だけの名称と価格を追加できます。</p></div><button type="button" onClick={() => setCustomOptions((current) => [...current, { id: `quote-${Date.now()}`, name: "", price: 0 }])} className="rounded-full border border-brand px-3 py-2 text-xs font-bold text-brand">追加</button></div><div className="mt-3 space-y-2">{customOptions.map((option) => <div key={option.id} className="flex gap-2"><input value={option.name} onChange={(event) => setCustomOptions((current) => current.map((item) => item.id === option.id ? { ...item, name: event.target.value } : item))} placeholder="項目名" className="min-w-0 flex-1 rounded-lg border border-line bg-cream px-3 py-2 text-sm" /><input type="number" min="0" value={option.price || ""} onChange={(event) => setCustomOptions((current) => current.map((item) => item.id === option.id ? { ...item, price: Number(event.target.value) } : item))} placeholder="価格" className="w-28 rounded-lg border border-line bg-cream px-3 py-2 text-sm" /></div>)}</div></div><textarea value={note} onChange={(event) => setNote(event.target.value)} rows={3} placeholder="見積書メモ（任意）" className="mt-5 w-full rounded-xl border border-line bg-cream px-4 py-3 text-sm" /><div className="mt-5 rounded-2xl bg-brand px-5 py-4 text-sm text-white"><div className="flex justify-between"><span>合計</span><strong>{yen(amounts.totalPrice)}</strong></div><div className="mt-1 flex justify-between"><span>初回支払い（50%）</span><strong>{yen(amounts.firstAmount)}</strong></div></div><div className="mt-5 flex items-center gap-4"><button type="button" onClick={saveQuote} disabled={saving} className="rounded-full bg-brand px-6 py-3 text-sm font-bold text-white disabled:opacity-50">{saving ? "保存中..." : "見積書を保存"}</button>{message && <p className="text-sm text-ink-soft">{message}</p>}</div></div><div className="rounded-3xl border border-line bg-white p-6 shadow-card sm:p-8"><div className="flex items-center justify-between"><h3 className="font-maru text-xl font-bold text-ink">保存済みの見積書</h3><span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-bold text-brand">{quotes.length}件</span></div><div className="mt-5 space-y-3">{quotes.length === 0 ? <p className="text-sm text-ink-mute">保存済みの見積書はありません。</p> : quotes.map((quote) => <div key={quote.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-cream px-4 py-4"><div><p className="font-bold text-ink">{quote.title}</p><p className="mt-1 text-xs text-ink-soft">合計 {yen(quote.totalPrice)} / 初回 {yen(quote.firstAmount)}</p></div><button type="button" onClick={() => downloadImage(quote)} className="rounded-full border border-brand px-4 py-2 text-xs font-bold text-brand">画像で保存</button></div>)}</div></div></section>;
}
