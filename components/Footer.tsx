import Link from "next/link";
import { footerLinks, navItems, site } from "@/lib/site";
import { LogoMark } from "@/components/logo";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-ink/10 bg-cream">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="inline-flex items-center gap-2.5">
              <LogoMark className="size-10" />
              <span className="font-maru text-lg font-bold text-ink">
                {site.name}
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-7 text-ink-soft">
              {site.tagline}
              地域の法人・店舗さまに向けて、ホームページ制作から公開後のお手伝いまでをワンストップでご提供します。
            </p>
            <p className="mt-4 text-xs leading-6 text-ink-mute">
              返信目安：{site.replyTime}
              <br />
              24時間いつでも受付中（メール・チャット）
            </p>
          </div>

          <nav aria-label="フッターメニュー" className="grid grid-cols-2 gap-6 sm:grid-cols-2">
            <div>
              <p className="text-xs font-bold tracking-widest text-ink-mute">
                サイトメニュー
              </p>
              <ul className="mt-3 space-y-2">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-ink-soft transition-colors hover:text-brand"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold tracking-widest text-ink-mute">
                ご契約・規約
              </p>
              <ul className="mt-3 space-y-2">
                {footerLinks.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-ink-soft transition-colors hover:text-brand"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          <div className="rounded-3xl border border-ink/10 bg-white p-5">
            <p className="text-sm font-bold text-ink">お問い合わせ</p>
            <p className="mt-2 text-xs leading-6 text-ink-soft">
              メールまたはチャットにて、お気軽にご相談ください。
            </p>
            <a
              href={`mailto:${site.email}`}
              className="mt-3 inline-block text-sm font-bold text-brand hover:text-brand-deep"
            >
              {site.email}
            </a>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href="/contact"
                className="rounded-full bg-brand px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-brand-dark"
              >
                お問い合わせフォーム
              </Link>
              <Link
                href="/apply"
                className="rounded-full border border-ink/15 px-4 py-2 text-xs font-bold text-ink transition-colors hover:border-brand hover:text-brand"
              >
                お申し込み
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-ink/10 pt-6 sm:flex-row">
          <p className="text-xs text-ink-mute">
            © {year} {site.name}（{site.operator.office}）
          </p>
          <div className="flex gap-5 text-xs text-ink-mute">
            <Link href="/law" className="hover:text-brand">
              特定商取引法に基づく表記
            </Link>
            <Link href="/privacy" className="hover:text-brand">
              プライバシーポリシー
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
