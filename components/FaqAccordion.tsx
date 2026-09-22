"use client";

import { useState } from "react";

export type FaqItem = {
  q: string;
  a: string;
};

/** 質問ごとに変わるアクセント（ブランドカラーに統一） */
const accentColors = [
  "bg-brand text-white",
  "bg-brand-deep text-white",
  "bg-midori text-white",
];

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="overflow-hidden rounded-3xl border-2 border-line bg-white shadow-card">
      {items.map((item, i) => {
        const open = openIndex === i;
        const accent = accentColors[i % accentColors.length];
        return (
          <div
            key={i}
            className={i > 0 ? "border-t-2 border-dashed border-line" : ""}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(open ? null : i)}
              aria-expanded={open}
              className={`flex w-full items-center gap-4 px-5 py-5 text-left transition-colors sm:px-6 ${
                open ? "bg-cream/60" : "hover:bg-cream/40"
              }`}
            >
              <span
                aria-hidden="true"
                className={`grid size-9 shrink-0 place-items-center rounded-xl font-maru text-sm font-bold shadow-card ${accent}`}
              >
                Q
              </span>
              <span
                className={`flex-1 text-sm font-bold leading-7 transition-colors sm:text-[15px] ${
                  open ? "text-brand-dark" : "text-ink"
                }`}
              >
                {item.q}
              </span>
              <span
                aria-hidden="true"
                className={`grid size-7 shrink-0 place-items-center rounded-full transition-all duration-200 ${
                  open
                    ? "rotate-45 bg-ink text-midori"
                    : "bg-cream-deep text-ink-soft"
                }`}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="size-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                >
                  <path d="M5 12h14" />
                  <path d={open ? "" : "M12 5v14"} />
                </svg>
              </span>
            </button>
            {open && (
              <div className="animate-fade-up px-5 pb-6 sm:px-6">
                <div className="flex items-start gap-4 rounded-2xl bg-cream/70 px-4 py-4">
                  <span
                    aria-hidden="true"
                    className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand font-maru text-sm font-bold text-white shadow-card"
                  >
                    A
                  </span>
                  <p className="flex-1 text-sm leading-8 text-ink-soft">
                    {item.a}
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

