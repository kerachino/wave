"use client";

import { useEffect, useState } from "react";
import { addDoc, collection, onSnapshot, query, serverTimestamp, where } from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { basePlanPrice, computeAmounts, purchasableOptions, type Quote, yen } from "@/lib/model";

type CustomQuoteOption = { id: string; name: string; price: number };
const defaultPrecautions = ["本見積書の有効期限は記載の日付までです。", "正式なご契約は、内容と金額をご確認のうえチャットでお申し込みください。", "制作開始には初回支払い（50%）の確認が必要です。"];
function dateAfter(days: number) { const date = new Date(); date.setDate(date.getDate() + days); return date.toISOString().slice(0, 10); }
function displayDate(value?: string) { return value ? new Date(`${value}T00:00:00`).toLocaleDateString("ja-JP") : "-"; }

export function EstimatePanel({ uid, userName }: { uid: string; userName: string }) {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [title, setTitle] = useState("ホームページ制作のお見積もり");
  const [recipientName, setRecipientName] = useState(userName);
  const [issueDate, setIssueDate] = useState(new Date().toISOString().slice(0, 10));
  const [validUntil, setValidUntil] = useState(dateAfter(30));
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [customOptions, setCustomOptions] = useState<CustomQuoteOption[]>([]);
  const [note, setNote] = useState("");
  const [precautions, setPrecautions] = useState(defaultPrecautions.join("\n"));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!db || !isFirebaseConfigured) return;
    return onSnapshot(query(collection(db, "quotes"), where("uid", "==", uid)), (snapshot) => {
      const next = snapshot.docs.map((item) => ({ id: item.id, ...item.data(), createdAt: item.data().createdAt?.toDate?.() }) as Quote);
      next.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
      setQuotes(next);
    });
  }, [uid]);

  const options = [...purchasableOptions.filter((option) => selectedIds.includes(option.id)).map((option) => ({ id: option.id, name: option.name, price: option.defaultPrice })), ...customOptions.filter((option) => option.name.trim() && option.price > 0)];
  const amounts = computeAmounts(basePlanPrice, options.map((option) => ({ ...option, defaultPrice: option.price })));

  async function saveQuote() {
    if (!db || !isFirebaseConfigured || !title.trim() || !recipientName.trim() || !issueDate || !validUntil) { setMessage("タイトル、宛名、作成日、有効期限を入力してください。"); return; }
    if (validUntil < issueDate) { setMessage("有効期限は作成日以降にしてください。"); return; }
    setSaving(true); setMessage("");
    try {
      await addDoc(collection(db, "quotes"), { uid, title: title.trim(), recipientName: recipientName.trim(), issueDate, validUntil, precautions: precautions.split("\n").map((item) => item.trim()).filter(Boolean), basePrice: basePlanPrice, options, ...amounts, note: note.trim(), createdAt: serverTimestamp() });
      setMessage("詳細な見積書を保存しました。");
    } catch { setMessage("見積書の保存に失敗しました。"); } finally { setSaving(false); }
  }

  async function downloadImage(quote: Quote) {
    const esc = (value: string) => value.replace(/[&<>\"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" })[character] || character);
    const rows = [{ name: "基本プラン", price: quote.basePrice }, ...quote.options.map((option) => ({ name: option.name, price: option.price }))];
    const precautionsList = quote.precautions?.length ? quote.precautions : defaultPrecautions;
    const width = 1400;
    const rowHeight = 52;
    const height = 700 + rows.length * rowHeight + precautionsList.length * 42;
    const rowSvg = rows.map((row, index) => `<text x="130" y="${390 + index * rowHeight}" font-family="sans-serif" font-size="25" fill="#20252b">${esc(row.name)}</text><text x="1270" y="${390 + index * rowHeight}" text-anchor="end" font-family="sans-serif" font-size="25" fill="#20252b">${esc(yen(row.price))}</text>`).join("");
    const precautionSvg = precautionsList.map((item, index) => `<text x="130" y="${570 + rows.length * rowHeight + index * 42}" font-family="sans-serif" font-size="20" fill="#59616b">・${esc(item)}</text>`).join("");
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="100%" height="100%" fill="#fffdf9"/><rect x="55" y="45" width="1290" height="${height - 90}" rx="24" fill="#ffffff" stroke="#d9d3c8" stroke-width="2"/><text x="130" y="125" font-family="sans-serif" font-size="42" font-weight="700" fill="#20252b">${esc(quote.title)}</text><text x="130" y="180" font-family="sans-serif" font-size="23" fill="#59616b">見積書番号: ${esc(quote.id)}</text><text x="1270" y="180" text-anchor="end" font-family="sans-serif" font-size="23" fill="#59616b">作成日: ${esc(displayDate(quote.issueDate))}</text><line x1="130" y1="215" x2="1270" y2="215" stroke="#d9d3c8"/><text x="130" y="265" font-family="sans-serif" font-size="24" fill="#59616b">宛名</text><text x="130" y="305" font-family="sans-serif" font-size="30" font-weight="700" fill="#20252b">${esc(quote.recipientName)}</text><text x="1270" y="265" text-anchor="end" font-family="sans-serif" font-size="22" fill="#59616b">有効期限: ${esc(displayDate(quote.validUntil))}</text><line x1="130" y1="335" x2="1270" y2="335" stroke="#d9d3c8"/>${rowSvg}<line x1="130" y1="${410 + rows.length * rowHeight}" x2="1270" y2="${410 + rows.length * rowHeight}" stroke="#d9d3c8"/><text x="130" y="${470 + rows.length * rowHeight}" font-family="sans-serif" font-size="27" font-weight="700" fill="#20252b">合計</text><text x="1270" y="${470 + rows.length * rowHeight}" text-anchor="end" font-family="sans-serif" font-size="30" font-weight="700" fill="#20252b">${esc(yen(quote.totalPrice))}</text><text x="130" y="${515 + rows.length * rowHeight}" font-family="sans-serif" font-size="23" fill="#59616b">初回支払い（50%） ${esc(yen(quote.firstAmount))}　残金 ${esc(yen(quote.remainingAmount))}</text><text x="130" y="${570 + rows.length * rowHeight}" font-family="sans-serif" font-size="24" font-weight="700" fill="#20252b">注意事項</text>${precautionSvg}</svg>`;
    const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }));
    const image = new Image();
    image.onload = () => { const canvas = document.createElement("canvas"); canvas.width = width; canvas.height = height; const context = canvas.getContext("2d"); if (!context) return; context.drawImage(image, 0, 0); const link = document.createElement("a"); link.download = `見積書-${quote.id}.png`; link.href = canvas.toDataURL("image/png"); link.click(); URL.revokeObjectURL(url); };
    image.src = url;
  }

  return <section className="mt-6 space-y-6"><div className="rounded-3xl border border-line bg-white p-6 shadow-card sm:p-8"><p className="text-xs font-bold tracking-[0.14em] text-brand">ESTIMATE BUILDER</p><h3 className="mt-2 font-maru text-xl font-bold text-ink">詳細な見積書を作成</h3><p className="mt-2 text-sm text-ink-soft">宛名、発行日、有効期限、注意事項を含む見積書を作成します。</p><div className="mt-5 grid gap-4 sm:grid-cols-2"><label className="text-sm font-bold text-ink">見積書タイトル<input value={title} onChange={(event) => setTitle(event.target.value)} className="mt-2 w-full rounded-xl border border-line bg-cream px-4 py-3 font-normal" /></label><label className="text-sm font-bold text-ink">宛名<input value={recipientName} onChange={(event) => setRecipientName(event.target.value)} placeholder="会社名・お名前" className="mt-2 w-full rounded-xl border border-line bg-cream px-4 py-3 font-normal" /></label><label className="text-sm font-bold text-ink">作成日<input type="date" value={issueDate} onChange={(event) => setIssueDate(event.target.value)} className="mt-2 w-full rounded-xl border border-line bg-cream px-4 py-3 font-normal" /></label><label className="text-sm font-bold text-ink">有効期限<input type="date" value={validUntil} min={issueDate} onChange={(event) => setValidUntil(event.target.value)} className="mt-2 w-full rounded-xl border border-line bg-cream px-4 py-3 font-normal" /></label></div><div className="mt-5 space-y-3">{purchasableOptions.map((option) => <label key={option.id} className="flex justify-between rounded-xl border border-line bg-cream px-4 py-3 text-sm"><span><input type="checkbox" checked={selectedIds.includes(option.id)} onChange={(event) => setSelectedIds((current) => event.target.checked ? [...current, option.id] : current.filter((id) => id !== option.id))} className="mr-3" />{option.name}</span><strong>{yen(option.defaultPrice)}</strong></label>)}</div><div className="mt-5 rounded-2xl border border-dashed border-line p-4"><div className="flex items-center justify-between"><h4 className="text-sm font-bold text-ink">自由項目</h4><button type="button" onClick={() => setCustomOptions((current) => [...current, { id: `quote-${Date.now()}`, name: "", price: 0 }])} className="rounded-full border border-brand px-3 py-2 text-xs font-bold text-brand">追加</button></div>{customOptions.map((option) => <div key={option.id} className="mt-2 flex gap-2"><input value={option.name} onChange={(event) => setCustomOptions((current) => current.map((item) => item.id === option.id ? { ...item, name: event.target.value } : item))} placeholder="項目名" className="min-w-0 flex-1 rounded-lg border border-line bg-cream px-3 py-2 text-sm" /><input type="number" min="0" value={option.price || ""} onChange={(event) => setCustomOptions((current) => current.map((item) => item.id === option.id ? { ...item, price: Number(event.target.value) } : item))} placeholder="価格" className="w-28 rounded-lg border border-line bg-cream px-3 py-2 text-sm" /></div>)}</div><textarea value={note} onChange={(event) => setNote(event.target.value)} rows={2} placeholder="見積書の補足メモ（任意）" className="mt-5 w-full rounded-xl border border-line bg-cream px-4 py-3 text-sm" /><label className="block text-sm font-bold text-ink">注意事項（1行につき1項目）<textarea value={precautions} onChange={(event) => setPrecautions(event.target.value)} rows={4} className="mt-2 w-full rounded-xl border border-line bg-cream px-4 py-3 text-sm font-normal" /></label><div className="mt-5 rounded-2xl bg-brand px-5 py-4 text-sm text-white">合計 {yen(amounts.totalPrice)} / 初回支払い（50%） {yen(amounts.firstAmount)} / 残金 {yen(amounts.remainingAmount)}</div><div className="mt-5 flex items-center gap-4"><button type="button" onClick={saveQuote} disabled={saving} className="rounded-full bg-brand px-6 py-3 text-sm font-bold text-white disabled:opacity-50">{saving ? "保存中..." : "見積書を保存"}</button>{message && <p className="text-sm text-ink-soft">{message}</p>}</div></div><div className="rounded-3xl border border-line bg-white p-6 shadow-card sm:p-8"><div className="flex items-center justify-between"><h3 className="font-maru text-xl font-bold text-ink">保存済みの見積書</h3><span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-bold text-brand">{quotes.length}件</span></div><div className="mt-5 space-y-3">{quotes.length === 0 ? <p className="text-sm text-ink-mute">保存済みの見積書はありません。</p> : quotes.map((quote) => <div key={quote.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-cream px-4 py-4"><div><p className="font-bold text-ink">{quote.title}</p><p className="mt-1 text-xs text-ink-soft">{quote.recipientName} / 作成日 {displayDate(quote.issueDate)} / 有効期限 {displayDate(quote.validUntil)}</p><p className="mt-1 text-xs text-ink-soft">合計 {yen(quote.totalPrice)} / 初回 {yen(quote.firstAmount)}</p></div><button type="button" onClick={() => downloadImage(quote)} className="rounded-full border border-brand px-4 py-2 text-xs font-bold text-brand">画像で保存</button></div>)}</div></div></section>;
}
