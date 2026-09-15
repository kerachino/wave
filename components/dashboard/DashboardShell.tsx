"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";

const menuItems = [
  { href: "/dashboard", label: "概要", icon: "⌂" },
  { href: "/dashboard/payment", label: "お支払い", icon: "¥" },
  { href: "/dashboard/chat", label: "チャット", icon: "◌" },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  function openLogoutModal() {
    setAccountMenuOpen(false);
    setLogoutModalOpen(true);
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-cream/50">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl">
        <aside className="hidden w-64 shrink-0 border-r border-line bg-white px-5 py-8 lg:block">
          <div className="px-3">
            <p className="text-xs font-bold tracking-[0.18em] text-brand">
              MY SPACE
            </p>
            <p className="mt-2 font-maru text-lg font-bold text-ink">
              マイページ
            </p>
          </div>
          <nav className="mt-10 space-y-2" aria-label="マイページメニュー">
            {menuItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold transition-colors ${active ? "bg-brand text-white" : "text-ink-soft hover:bg-cream hover:text-ink"}`}
                >
                  <span className="grid size-7 place-items-center rounded-lg bg-current/10 text-base">
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="relative mt-auto border-t border-line pt-6">
            <button
              type="button"
              aria-expanded={accountMenuOpen}
              onClick={() => setAccountMenuOpen((open) => !open)}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left hover:bg-cream"
            >
              <div className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-soft text-sm font-bold text-brand">
                {user?.displayName?.slice(0, 1) ?? "U"}
              </div>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-xs text-ink-soft">{user?.email}</span>
                <span className="mt-1 block text-[10px] text-ink-mute">アカウントメニュー</span>
              </span>
              <span className="text-xs text-ink-mute">⌄</span>
            </button>
            {accountMenuOpen && (
              <div className="absolute bottom-16 left-0 right-0 rounded-xl border border-line bg-white p-2 shadow-lift">
                <button
                  type="button"
                  onClick={openLogoutModal}
                  className="w-full rounded-lg px-3 py-2 text-left text-xs font-bold text-ink-soft hover:bg-cream hover:text-ink"
                >
                  ログアウト
                </button>
              </div>
            )}
          </div>
        </aside>
        <div className="min-w-0 flex-1">
          <div className="border-b border-line bg-white px-4 py-4 lg:hidden">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold tracking-[0.18em] text-brand">
                  MY SPACE
                </p>
                <p className="mt-1 font-maru font-bold text-ink">マイページ</p>
              </div>
              <div className="relative">
                <button
                  type="button"
                  aria-label="アカウントメニューを開く"
                  aria-expanded={accountMenuOpen}
                  onClick={() => setAccountMenuOpen((open) => !open)}
                  className="grid size-10 place-items-center rounded-full bg-brand-soft text-sm font-bold text-brand"
                >
                  {user?.displayName?.slice(0, 1) ?? "U"}
                </button>
                {accountMenuOpen && (
                  <div className="absolute right-0 top-12 z-10 w-40 rounded-xl border border-line bg-white p-2 shadow-lift">
                    <p className="truncate px-3 py-2 text-[10px] text-ink-mute">{user?.email}</p>
                    <button
                      type="button"
                      onClick={openLogoutModal}
                      className="w-full rounded-lg px-3 py-2 text-left text-xs font-bold text-ink-soft hover:bg-cream hover:text-ink"
                    >
                      ログアウト
                    </button>
                  </div>
                )}
              </div>
            </div>
            <nav
              className="mt-4 flex gap-2 overflow-x-auto"
              aria-label="マイページメニュー"
            >
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold ${pathname === item.href ? "bg-brand text-white" : "bg-cream text-ink-soft"}`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <main className="px-4 py-6 sm:px-8 sm:py-10">{children}</main>
        </div>
      </div>
      {logoutModalOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink/35 px-4" role="presentation">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-dialog-title"
            className="w-full max-w-sm rounded-2xl border border-line bg-white p-6 shadow-lift"
          >
            <h2 id="logout-dialog-title" className="font-maru text-xl font-bold text-ink">
              ログアウトしますか？
            </h2>
            <p className="mt-3 text-sm leading-6 text-ink-soft">
              dashboardからログアウトします。よろしければログアウトを実行してください。
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setLogoutModalOpen(false)}
                className="rounded-full border border-line px-4 py-2 text-sm font-bold text-ink-soft hover:bg-cream"
              >
                キャンセル
              </button>
              <button
                type="button"
                onClick={logout}
                className="rounded-full bg-brand px-4 py-2 text-sm font-bold text-white hover:bg-brand-dark"
              >
                ログアウト
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
