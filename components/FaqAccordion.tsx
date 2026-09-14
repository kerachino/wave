"use client";

import { useState } from "react";

export type FaqItem = {
  q: string;
  a: string;
};

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white shadow-card">
      {items.map((item, i) => {
        const open = openIndex === i;
        return (
          <div key={i}>
            <button
              type="button"
              onClick={() => setOpenIndex(open ? null : i)}
              aria-expanded={open}
              className="flex w-full items-center gap-4 px-5 py-5 text-left transition-colors hover:text-brand-dark sm:px-6"
            >
              <span
                className={`flex-1 text-sm font-bold leading-7 transition-colors sm:text-[15px] ${
                  open ? "text-brand-dark" : "text-ink"
                }`}
              >
                {item.q}
              </span>
              <span
                aria-hidden="true"
                className={`grid size-6 shrink-0 place-items-center rounded-full transition-colors ${
                  open ? "bg-brand text-white" : "bg-cream-deep text-ink-soft"
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
                <p className="text-sm leading-8 text-ink-soft">{item.a}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

