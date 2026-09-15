"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

const menuItems = [
  { href: "/dashboard", label: "概要", icon: "⌂" },
  { href: "/dashboard/chat", label: "チャット", icon: "◌" },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

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
          <div className="mt-auto border-t border-line pt-6">
            <div className="flex items-center gap-3 px-3">
              <div className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-soft text-sm font-bold text-brand">
                {user?.displayName?.slice(0, 1) ?? "U"}
              </div>
              <p className="truncate text-xs text-ink-soft">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="mt-4 w-full rounded-xl px-3 py-2 text-left text-xs font-bold text-ink-mute hover:bg-cream hover:text-ink"
            >
              ログアウト
            </button>
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
              <button
                onClick={logout}
                className="rounded-full border border-line px-3 py-2 text-xs font-bold text-ink"
              >
                ログアウト
              </button>
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
    </div>
  );
}
