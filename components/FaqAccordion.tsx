"use client";

import { useState } from "react";

export type FaqItem = {
  q: string;
  a: string;
};

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const open = openIndex === i;
        return (
          <div
            key={i}
            className="overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-sm"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(open ? null : i)}
              aria-expanded={open}
              className="flex w-full items-center gap-4 px-5 py-4 text-left"
            >
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-soft font-maru text-sm font-bold text-brand-deep">
                Q
              </span>
              <span className="flex-1 text-sm font-bold leading-6 text-ink sm:text-base">
                {item.q}
              </span>
              <svg
                viewBox="0 0 24 24"
                className={`size-5 shrink-0 text-brand transition-transform ${
                  open ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            {open && (
              <div className="border-t border-ink/5 bg-cream/50 px-5 py-4">
                <div className="flex gap-3">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-midori-soft font-maru text-sm font-bold text-midori-dark">
                    A
                  </span>
                  <p className="text-sm leading-7 text-ink-soft">{item.a}</p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
