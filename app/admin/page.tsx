"use client";
}
  const [message, setMessage] = useState<string | null>(null);
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import {
  purchasableOptions,
  basePlanPrice,
  yen,
  type Order,
} from "@/lib/model";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";

type OrderPreview = Order | null;

export default function AdminPage() {

  const { user, isAdmin, loading: authLoading } = useAuth();
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-8">
        <h1 className="font-maru text-3xl font-bold text-ink sm:text-4xl">
          邂｡逅・・繝ｼ繧ｸ・・dmin・・
        </h1>
        <p className="mt-2 text-sm leading-6 text-ink-soft">
          蛻ｩ逕ｨ閠・＃縺ｨ縺ｮ雉ｼ蜈･繧定ｨｱ蜿ｯ縺励√が繝励す繝ｧ繝ｳ繧定ｨｭ螳壹＠縺ｾ縺吶りｳｼ蜈･險ｱ蜿ｯ蠕後↓繝繝・す繝･繝懊・繝峨〒
          驥鷹｡阪′陦ｨ遉ｺ縺輔ｌ縲∝茜逕ｨ閠・・謾ｯ謇輔＞繝壹・繧ｸ縺ｸ騾ｲ繧√∪縺吶・
        </p>
      </div>

      {authLoading ? (
        <p className="text-sm text-ink-mute">隱崎ｨｼ荳ｭ窶ｦ</p>
      ) : !isAdmin ? (
        <section className="rounded-3xl border border-line bg-white p-6 shadow-card sm:p-8">
          <h2 className="font-maru text-xl font-bold text-ink">
            邂｡逅・・い繧ｯ繧ｻ繧ｹ縺ｧ縺ｯ縺ゅｊ縺ｾ縺帙ｓ
          </h2>
          <p className="mt-2 text-sm leading-6 text-ink-soft">
            縺薙・繝壹・繧ｸ縺ｯ驕句霧閠・ｼ・dmin・牙ｰら畑縺ｧ縺吶る°蝟ｶ閠・Γ繝ｼ繝ｫ繧｢繝峨Ξ繧ｹ縺ｧ繝ｭ繧ｰ繧､繝ｳ縺励※縺上□縺輔＞縲・
          </p>

          <section className="rounded-3xl border border-line bg-white p-6 shadow-card sm:p-8">
            <h2 className="font-maru text-xl font-bold text-ink">
              繧ｪ繝励す繝ｧ繝ｳ縺ｮ驕ｸ謚槭→雉ｼ蜈･險ｱ蜿ｯ
            </h2>
            <p className="mt-2 text-sm leading-6 text-ink-soft">
              險ｱ蜿ｯ縺吶ｋ繧ｪ繝励す繝ｧ繝ｳ縺ｫ繝√ぉ繝・け繧貞・繧後∪縺吶りｨｱ蜿ｯ譎ゅ↓縺薙％繧帝∈繧薙□蜀・ｮｹ縺悟渚譏縺輔ｌ縺ｾ縺吶・
            </p>

            <div className="mt-6 space-y-3">
              {purchasableOptions.map((opt) => (
                <label
                  key={opt.id}
                  className="flex items-center gap-3 rounded-xl border border-line bg-cream px-4 py-3 transition hover:border-brand/40"
                >
                  <input
                    type="checkbox"
                    checked={selectedOptionIds.includes(opt.id)}
                    onChange={(e) => {
                      const next = e.target
                        .checked
                        ? [...selectedOptionIds, opt.id]
                        : selectedOptionIds.filter((id) => id !== opt.id);
                      setSelectedOptionIds(next);
                    }}
                    className="h-4 w-4 rounded border-line text-brand focus:ring-brand"
                  />
                  <span className="flex flex-1 items-center justify-between text-sm">
                  </span>
                </label>
              ))}
            </div>

            <div className="mt-6 space-y-3">
              <label className="rounded-xl border border-line bg-cream px-4 py-3">
                <span className="block text-sm font-semibold text-ink">
                  繝｡繝｢・井ｻｻ諢擾ｼ・
                </span>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink ring-1 ring-inset focus:outline-none focus:ring-2 focus:ring-brand"
                  rows={3}
                />
              </label>
            </div>

            <div className="mt-6 flex flex-wrap gap-4">
              <div className="rounded-xl bg-cream px-4 py-3 text-sm">
                <span className="text-ink-soft">蝓ｺ譛ｬ繝励Λ繝ｳ</span>
                <span className="block font-maru font-bold text-ink">
                  {yen(basePlanPrice)}
                </span>
              </div>
              <div className="rounded-xl bg-brand px-4 py-3 text-sm">
                <span className="text-white">驕ｸ謚樔ｸｭ縺ｮ蜷郁ｨ・/span>
                <span className="block font-maru text-lg font-bold text-white">
                  {yen(
                    basePlanPrice +
                      selectedOptionIds.length
                        ? purchasableOptions
                            .filter((o) => selectedOptionIds.includes(o.id))
                            .reduce((s, o) => s + (o.defaultPrice || 0), 0)
                        : 0,
                  )}
                </span>
                <span className="block text-white/80">
                  莉雁屓縺ｮ謾ｯ謇輔＞・・0%・閲" "}
                  {yen(
                    Math.floor(
                      (
                        basePlanPrice +
                          selectedOptionIds.length
                            ? purchasableOptions
                                .filter((o) =>

        </div>
      )}
    </div>
  );
}

const Previews: React.FC<{ order: Order }> = ({ order }) => {
  return (
    <div className="rounded-2xl border border-line bg-white p-4 text-sm">
      <div className="flex justify-between gap-4">
        <span className="text-ink-soft">蝓ｺ譛ｬ繝励Λ繝ｳ</span>
        <span className="font-maru font-bold text-ink">{yen(order.basePrice)}</span>
      </div>
      <ul className="mt-3 space-y-2">
        {(order.options ?? []).length > 0 ? (
          (order.options ?? []).map((opt) => (
            <li key={opt.id} className="flex justify-between gap-4">
              <span className="text-ink-soft">{opt.name}</span>
              <span className="font-maru text-ink">{yen(opt.price)}</span>
            </li>
          ))
        ) : (
          <li className="text-ink-mute">繧ｪ繝励す繝ｧ繝ｳ縺ｪ縺・/li>
        )}
      </ul>
      <div className="mt-3 flex justify-between gap-4">
        <span className="font-maru font-bold text-ink">蜷郁ｨ・/span>
        <span className="font-maru font-bold text-ink">{yen(order.totalPrice)}</span>
      </div>
      <div className="flex justify-between gap-4">
        <span className="text-ink-soft">逹謇矩≡・・0%・・/span>
        <span className="font-maru font-bold text-ink">{yen(order.firstAmount)}</span>
      </div>
      <div className="flex justify-between gap-4">
        <span className="text-ink-soft">谿矩≡</span>
        <span className="font-maru text-ink">{yen(order.remainingAmount)}</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        <span className="rounded-full bg-brand-soft px-2 py-1 text-brand-deep">
          迥ｶ諷・ {order.status}
        </span>
        <span className="rounded-full bg-cream px-2 py-1 text-ink-soft">
          謾ｯ謇輔＞迥ｶ諷・ {order.paymentStatus}
        </span>
      </div>
      {order.note && (
        <div className="mt-3 rounded-xl bg-cream p-3 text-xs text-ink-soft">
          <span className="block font-semibold text-ink">繝｡繝｢</span>
          <p className="mt-1 whitespace-pre-wrap">{order.note}</p>
        </div>
      )}
    </div>
  );
}

                                  selectedOptionIds.includes(o.id)
                                )
                                .reduce((s, o) => s + (o.defaultPrice || 0), 0)
                            ) *
                            0.5,
                      ),
                    ),
                  }
                </span>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                disabled={!searchUid || approving}
                className="rounded-full bg-brand px-6 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-brand-deep focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 disabled:opacity-60"
                onClick={async () => {
                  if (!searchUid) return;
                  setApproving(true);
                  setMessage(null);
                  try {
                    const res = await fetch("/api/admin/approve", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        uid: searchUid,
                        options: purchasableOptions.filter((o) =>
                          selectedOptionIds.includes(o.id),
                        ),
                        note: note || undefined,
                      }),
                    });
                    if (!res.ok) {
                      const data = await res.json().catch(() => ({}));
                      throw new Error(data.error || "險ｱ蜿ｯ縺ｫ螟ｱ謨励＠縺ｾ縺励◆");
                    }
                    setMessage("雉ｼ蜈･繧定ｨｱ蜿ｯ縺励∪縺励◆縲ゅが繝励す繝ｧ繝ｳ縺悟渚譏縺輔ｌ縺ｾ縺吶・);
                    setSelectedOptionIds([]);
                    setNote("");
                  } catch (err) {
                    setMessage(
                      `雉ｼ蜈･縺ｮ險ｱ蜿ｯ縺ｫ螟ｱ謨励＠縺ｾ縺励◆: ${
                        err instanceof Error ? err.message : "荳肴・縺ｪ繧ｨ繝ｩ繝ｼ"
                      }`,
                    );
                  } finally {
                    setApproving(false);
                  }
                }}
              >
                {approving ? "險ｱ蜿ｯ荳ｭ窶ｦ" : "雉ｼ蜈･繧定ｨｱ蜿ｯ縺吶ｋ"}
              </button>
              {message && (
                <p className="text-sm text-ink-soft">{message}</p>
              )}
            </div>
          </section>

<div className="space-y-8">

          <section className="rounded-3xl border border-line bg-white p-6 shadow-card sm:p-8">
            <h2 className="font-maru text-xl font-bold text-ink">
              蟇ｾ雎｡繝ｦ繝ｼ繧ｶ繝ｼ縺ｮ驕ｸ謚・
            </h2>
            <p className="mt-2 text-sm leading-6 text-ink-soft">
              雉ｼ蜈･繧定ｨｱ蜿ｯ縺励◆縺・Θ繝ｼ繧ｶ繝ｼ縺ｮ uid 繧貞・蜉帙＠縺ｾ縺吶・irebase 縺ｮ繝ｦ繝ｼ繧ｶ繝ｼ繝ｦ繝九・繧ｯID縺ｧ縺吶・
            </p>
            <div className="mt-4 flex gap-3">
              <input
                value={searchUid}
                onChange={(e) => setSearchUid(e.target.value)}
                className="flex-1 rounded-xl border border-line bg-cream px-4 py-3 text-sm text-ink ring-1 ring-inset focus:outline-none focus:ring-2 focus:ring-brand"
                placeholder="繝ｦ繝ｼ繧ｶ繝ｼ縺ｮ uid"
              />
              <button
                className="rounded-full bg-brand px-5 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-brand-deep focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
                type="button"
              >
                遒ｺ隱・
              </button>
            </div>

            {loadingPreview ? (
              <p className="mt-4 text-sm text-ink-mute">隱ｭ縺ｿ霎ｼ縺ｿ荳ｭ窶ｦ</p>
            ) : preview ? (
              <div className="mt-4 space-y-3">
                <div className="flex flex-wrap items-center gap-3 rounded-xl bg-ink/5 px-4 py-3">
                  <span className="text-sm font-bold text-ink">迴ｾ蝨ｨ縺ｮ繧ｪ繝ｼ繝繝ｼ</span>
                  <span className="text-xs text-ink-mute">
                    {preview.email ?? "窶・}
                  </span>
                </div>
                <Previews order={preview} />
              </div>
            ) : searchUid ? (
              <p className="mt-4 text-sm text-ink-mute">
                縺昴・ uid 縺ｮ繧ｪ繝ｼ繝繝ｼ縺ｯ縺ｾ縺縺ゅｊ縺ｾ縺帙ｓ縲・
              </p>
            ) : null}
          </section>

  const { user, isAdmin, loading: authLoading } = useAuth();
  const [searchUid, setSearchUid] = useState("");
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [preview, setPreview] = useState<OrderPreview>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [approving, setApproving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
}

/* placeholder to ensure file is not empty */
