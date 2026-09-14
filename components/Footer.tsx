import Link from "next/link";
import { footerLinks, navItems, site } from "@/lib/site";
import { LogoMark } from "@/components/logo";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative overflow-hidden bg-ink text-white">
      {/* グローの装飾 */}
      <div
        aria-hidden="true"
        className="glow-soft pointer-events-none absolute -top-40 right-[-10%] size-96 opacity-40"
      />
      <div className="relative mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <div className="inline-flex items-center gap-3">
              <LogoMark className="size-11" />
              <div className="flex flex-col leading-none">
                <span className="font-maru text-xl font-bold tracking-tight text-white">
                  {site.name}
                </span>
                <span className="mt-1.5 text-[10px] tracking-[0.28em] text-white/40">
                  WEB CREATION SERVICE
                </span>
              </div>
            </div>
            <p className="mt-5 max-w-xs text-sm leading-7 text-white/60">
              {site.tagline}
              地域の法人・店舗さまに向けて、ホームページ制作から公開後のお手伝いまでをワンストップでご提供します。
            </p>
            <p className="mt-4 text-xs leading-6 text-white/40">
              返信目安：{site.replyTime}
              <br />
              24時間いつでも受付中（メール・チャット）
            </p>
          </div>

          <nav aria-label="フッターメニュー" className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-xs font-bold tracking-[0.2em] text-white/40">
                サイトメニュー
              </p>
              <ul className="mt-4 space-y-2.5">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-white/70 transition-colors hover:text-white"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold tracking-[0.2em] text-white/40">
                ご契約・規約
              </p>
              <ul className="mt-4 space-y-2.5">
                {footerLinks.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-white/70 transition-colors hover:text-white"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm font-bold text-white">お問い合わせ</p>
            <p className="mt-2 text-xs leading-6 text-white/50">
              メールまたはチャットにて、お気軽にご相談ください。
            </p>
            <a
              href={`mailto:${site.email}`}
              className="mt-3 inline-block break-all text-sm font-bold text-midori transition-colors hover:text-white"
            >
              {site.email}
            </a>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href="/contact"
                className="rounded-lg bg-brand px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-brand-dark"
              >
                お問い合わせフォーム
              </Link>
              <Link
                href="/apply"
                className="rounded-lg border border-white/20 px-4 py-2 text-xs font-bold text-white transition-colors hover:border-white/50"
              >
                お申し込み
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-xs text-white/40">
            © {year} {site.name}（{site.operator.office}）
          </p>
          <div className="flex gap-5 text-xs text-white/40">
            <Link href="/law" className="transition-colors hover:text-white">
              特定商取引法に基づく表記
            </Link>
            <Link href="/privacy" className="transition-colors hover:text-white">
              プライバシーポリシー
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}


