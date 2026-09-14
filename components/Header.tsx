"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navItems, site } from "@/lib/site";
import { Logo } from "@/components/logo";

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" onClick={() => setOpen(false)} aria-label="トップページへ">
          <Logo />
        </Link>

        {/* デスクトップナビ */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="メインメニュー">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-brand-soft text-brand-deep"
                    : "text-ink-soft hover:bg-cream hover:text-ink"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/contact"
            className="brand-sheen ml-3 rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-brand-dark"
          >
            無料で相談する
          </Link>
        </nav>

        {/* モバイル開閉ボタン */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="メニューを開閉"
          className="grid size-10 place-items-center rounded-xl text-ink lg:hidden"
        >
          <svg
            viewBox="0 0 24 24"
            className="size-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            {open ? (
              <>
                <path d="M6 6l12 12" />
                <path d="M18 6L6 18" />
              </>
            ) : (
              <>
                <path d="M4 7h16" />
                <path d="M4 12h16" />
                <path d="M4 17h16" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* モバイルメニュー */}
      {open && (
        <nav
          className="border-t border-ink/10 bg-paper px-4 pb-6 pt-3 lg:hidden"
          aria-label="モバイルメニュー"
        >
          <div className="flex flex-col">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-xl px-4 py-3 text-base font-medium ${
                    active ? "bg-brand-soft text-brand-deep" : "text-ink"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="mt-3 grid gap-3">
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="brand-sheen rounded-full bg-brand px-5 py-3 text-center text-sm font-bold text-white"
              >
                無料で相談する
              </Link>
              <a
                href={`mailto:${site.email}`}
                className="rounded-full border border-ink/15 px-5 py-3 text-center text-sm font-bold text-ink"
              >
                メールで相談する
              </a>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
