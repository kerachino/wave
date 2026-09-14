import Link from "next/link";
import {
  BoltIcon,
  ChatIcon,
  CheckIcon,
  HouseIcon,
  MailIcon,
  PhoneIcon,
  YenIcon,
} from "@/components/icons";
import { PriceCards } from "@/components/PriceCards";
import { ButtonLink, Container, Section, SectionHeading } from "@/components/ui";
import { site } from "@/lib/site";

const merits = [
  {
    icon: YenIcon,
    title: "低価格",
    body: "相場は10〜30万円。個人事業の小回りで、お試し5,500円〜の驚きの価格に。",
    href: "/price",
  },
  {
    icon: BoltIcon,
    title: "スピード制作",
    body: "最短2週間〜の納品。お店の紹介ページを、今すぐネットに載せられます。",
    href: "/flow",
  },
  {
    icon: PhoneIcon,
    title: "スマホ対応",
    body: "お客さまの多くはスマホで見ています。どの端末でもきれいに表示。",
    href: "/service",
  },
  {
    icon: HouseIcon,
    title: "地域密着",
    body: "難しい専門用語は使わず、あなたの町の強い味方として最後まで伴走。",
    href: "/operator",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* ヒーロー */}
      <section className="relative overflow-hidden bg-paper">
        <div aria-hidden="true" className="grid-fade pointer-events-none absolute inset-0" />
        <div
          aria-hidden="true"
          className="glow-soft pointer-events-none absolute -top-32 right-[-8%] size-[30rem]"
        />
        <Container className="relative pt-20 pb-16 sm:pt-28 sm:pb-24">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
            <div>
              {/* 受付状況バッジ */}
              <p className="inline-flex items-center gap-2.5 rounded-full border border-line bg-white py-1.5 pl-2.5 pr-4 text-xs font-semibold text-ink-soft shadow-card">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-60" />
                  <span className="relative inline-flex size-2 rounded-full bg-brand" />
                </span>
                新規受付中 / モニター募集あり
              </p>
              <h1 className="mt-6 font-maru text-[1.9rem] font-bold leading-[1.3] tracking-tight text-ink sm:text-4xl lg:text-[2.7rem]">
                地域の会社のホームページ、
                <br className="sm:hidden" />
                <span className="text-gradient">まるごとお任せ</span>ください
              </h1>
              <p className="mt-5 max-w-xl text-sm leading-8 text-ink-soft sm:text-base">
                ホームページ制作を、難しいことはすべておまかせ。
                <br className="hidden sm:inline" />
                相談・制作・公開・その後の更新まで、1人で丁寧にお届けします。
                <br className="hidden sm:inline" />
                まずは無料でご相談を。お返事は{site.replyTime}。
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/contact" variant="primary" size="lg" className="flex-1">
                  無料で相談する
                </ButtonLink>
                <ButtonLink href="/price" variant="secondary" size="lg" className="flex-1">
                  料金プランを見る
                </ButtonLink>
              </div>
              {/* 数字で見る安心 */}
              <dl className="mt-10 grid grid-cols-3 divide-x divide-line rounded-2xl border border-line bg-white py-4 shadow-card">
                {[
                  ["お試し料金", "5,500円〜"],
                  ["最短納期", "2週間〜"],
                  ["返信目安", "2〜3営業日"],
                ].map(([label, value]) => (
                  <div key={label} className="px-3 text-center sm:px-5">
                    <dt className="text-[10px] font-semibold tracking-wider text-ink-mute sm:text-xs">
                      {label}
                    </dt>
                    <dd className="mt-1.5 font-maru text-sm font-bold text-ink sm:text-lg">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* モックアップ */}
            <div className="relative">
              <div aria-hidden="true" className="glow-soft absolute -inset-10 opacity-70" />
              <div className="relative overflow-hidden rounded-2xl border border-line bg-white shadow-lift">
                {/* ブラウザバー */}
                <div className="flex items-center gap-1.5 border-b border-line px-4 py-3">
                  <span className="size-2.5 rounded-full bg-line" />
                  <span className="size-2.5 rounded-full bg-line" />
                  <span className="size-2.5 rounded-full bg-line" />
                  <span className="mx-auto flex h-6 w-44 items-center justify-center rounded-full bg-cream text-[10px] text-ink-mute">
                    https://your-shop.jp
                  </span>
                  <span className="size-2.5" aria-hidden="true" />
                </div>
                {/* 画面 */}
                <div className="p-5 sm:p-6">
                  <div className="rounded-xl bg-gradient-to-br from-brand-soft via-white to-white p-5 ring-1 ring-line">
                    <p className="text-[10px] font-bold tracking-widest text-brand">
                      〇〇商店 様 公式サイト
                    </p>
                    <div className="mt-2.5 space-y-1.5">
                      <div className="h-2.5 w-3/4 rounded-full bg-ink/80" />
                      <div className="h-2.5 w-1/2 rounded-full bg-ink/20" />
                    </div>
                    <div className="mt-4 flex gap-2">
                      <span className="h-6 w-20 rounded-lg bg-brand" />
                      <span className="h-6 w-20 rounded-lg bg-white ring-1 ring-line" />
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-3">
                    {["ごあいさつ", "営業時間・アクセス", "お問い合わせ"].map((label) => (
                      <div key={label} className="rounded-xl bg-cream p-3 ring-1 ring-line">
                        <p className="text-[10px] font-bold text-ink-soft">{label}</p>
                        <div className="mt-2 space-y-1">
                          <div className="h-1.5 w-full rounded-full bg-line" />
                          <div className="h-1.5 w-2/3 rounded-full bg-line" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* フローティングチップ */}
              <div className="absolute -bottom-5 left-4 flex items-center gap-2.5 rounded-xl border border-line bg-white px-4 py-3 shadow-lift sm:left-8">
                <span className="grid size-7 place-items-center rounded-full bg-brand text-white">
                  <CheckIcon className="size-4" />
                </span>
                <div className="leading-tight">
                  <p className="text-xs font-bold text-ink">スマホ対応</p>
                  <p className="text-[10px] text-ink-mute">どの端末でもきれいに表示</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
      {/* 4つの魅力 */}
      <Section className="bg-cream">
        <SectionHeading
          eyebrow="はとのコネクトの4つの魅力"
          title="この町の会社の味方になる、4つの理由"
          description="難しいことはぜんぶおまかせ。はじめやすさと、あとに残る安心を大事にしています。"
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {merits.map((merit) => (
            <Link
              key={merit.title}
              href={merit.href}
              className="group rounded-2xl border border-line bg-white p-6 shadow-card transition-all duration-200 hover:-translate-y-1 hover:border-brand/40 hover:shadow-soft"
            >
              <span className="grid size-12 place-items-center rounded-xl bg-brand-soft text-brand-deep transition-colors group-hover:bg-brand group-hover:text-white">
                <merit.icon className="size-6" />
              </span>
              <h3 className="mt-5 font-maru text-lg font-bold text-ink">
                {merit.title}
              </h3>
              <p className="mt-2 text-sm leading-7 text-ink-soft">
                {merit.body}
              </p>
              <p className="mt-4 text-xs font-bold text-brand transition-colors group-hover:text-brand-dark">
                詳しく見る →
              </p>
            </Link>
          ))}
        </div>
      </Section>

      {/* 相場と価格 */}
      <Section className="bg-paper">
        <SectionHeading
          eyebrow="料金プラン"
          title="相場は10〜30万円。個人事業の小回りで、この価格に"
          description="広告費や人件費がかさむ会社まかせにはしません。1人で制作するから、リーズナブルな価格で「まるごと」お任せいただけます。"
        />
        <div className="mt-12">
          <PriceCards />
        </div>
        <p className="mt-8 text-center text-sm text-ink-soft">
          公開後の維持費は月1,000円〜（保守サポート費）。ホスティングは無料、
          独自ドメインは実費のみ。詳しくは
          <Link
            href="/price"
            className="font-bold text-brand underline decoration-brand/30 underline-offset-4 transition-colors hover:text-brand-dark"
          >
            料金プランのページ
          </Link>
          へ。
        </p>
      </Section>
      {/* 制作の流れ（4ステップ） */}
      <Section className="bg-cream">
        <SectionHeading
          eyebrow="制作の流れ"
          title="申し込んでから公開まで、シンプルに4ステップ"
          description="途中の進み具合もこまめに共有します。わからないことはいつでもメール・チャットでどうぞ。"
        />
        <div className="mt-12 grid gap-5 md:grid-cols-4">
          {[
            ["無料相談", "メール・チャットで、まずはお気軽に。価格や納期の相談だけでもOKです。"],
            ["ヒアリング・お見積り", "作りたいサイトのお話をうかがい、料金とスケジュールをご提案します。"],
            ["ご契約・制作", "サイト内でお申し込みいただき、着手金のお支払いのあと制作開始です。"],
            ["公開・納品", "ご確認をいただきながら仕上げ、サイトを公開。残金のお支払いは公開後です。"],
          ].map(([title, body], i) => (
            <div
              key={i}
              className="relative rounded-2xl border border-line bg-white p-6 shadow-card"
            >
              <p className="grid size-10 place-items-center rounded-xl bg-brand font-maru text-base font-bold text-white shadow-soft">
                {i + 1}
              </p>
              <h3 className="mt-4 font-maru text-lg font-bold text-ink">{title}</h3>
              <p className="mt-2 text-sm leading-7 text-ink-soft">{body}</p>
              {i < 3 && (
                <span
                  aria-hidden="true"
                  className="absolute -right-3.5 top-1/2 z-10 hidden size-7 -translate-y-1/2 place-items-center rounded-full border border-line bg-white text-ink-mute shadow-card md:grid"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="size-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              )}
            </div>
          ))}
        </div>
        <p className="mt-8 text-center">
          <Link
            href="/flow"
            className="font-bold text-brand underline decoration-brand/30 underline-offset-4 transition-colors hover:text-brand-dark"
          >
            詳しい流れをみる（8ステップ） →
          </Link>
        </p>
      </Section>

      {/* よくある質問へのご案内 */}
      <Section className="bg-paper">
        <SectionHeading
          eyebrow="よくあるご質問"
          title="「いくら？」「原稿がないけど大丈夫？」"
          description="申し込む前に気になることを、先にまとめてお答えしています。"
        />
        <div className="mx-auto mt-10 grid max-w-4xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            "費用はいくらかかるの？",
            "原稿がなくても大丈夫？",
            "公開後の更新はどうするの？",
            "支払い方法は？",
            "独自ドメインは必要？",
          ].map((q) => (
            <Link
              key={q}
              href="/faq"
              className="group flex items-center justify-between gap-2 rounded-xl border border-line bg-white px-5 py-4 text-sm font-medium text-ink shadow-card transition-all hover:border-brand/40 hover:shadow-soft"
            >
              {q}
              <span
                aria-hidden="true"
                className="text-ink-mute transition-all group-hover:translate-x-0.5 group-hover:text-brand"
              >
                →
              </span>
            </Link>
          ))}
        </div>
      </Section>

      {/* お問い合わせCTA */}
      <section className="relative overflow-hidden bg-ink py-20 sm:py-24">
        <div
          aria-hidden="true"
          className="glow-soft pointer-events-none absolute -top-48 left-1/2 size-[36rem] -translate-x-1/2 opacity-50"
        />
        <Container className="relative">
          <div className="mx-auto max-w-2xl text-center">
            <p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.22em] text-midori">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-midori" />
              まずは無料でご相談ください
            </p>
            <h2 className="mt-4 font-maru text-2xl font-bold tracking-tight text-white sm:text-3xl">
              ホームページのこと、
              <br className="sm:hidden" />
              なんでもお話しください
            </h2>
            <p className="mt-4 text-sm leading-8 text-white/60">
              作りたいイメージがなくても大丈夫。メール・チャットで、
              お気軽にご相談いただけます。お電話での対応は行っておりません。
            </p>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <Link
                href="/contact"
                className="group rounded-2xl border border-white/10 bg-white/5 px-4 py-6 transition-colors hover:border-white/20 hover:bg-white/10"
              >
                <MailIcon className="mx-auto size-7 text-midori" />
                <span className="mt-3 block text-sm font-bold text-white">メールで相談</span>
                <span className="mt-1 block text-[11px] text-white/40">24時間受付</span>
              </Link>
              <Link
                href="/contact#chat"
                className="rounded-2xl border border-midori/40 bg-midori/10 px-4 py-6 transition-colors hover:bg-midori/20"
              >
                <ChatIcon className="mx-auto size-7 text-midori" />
                <span className="mt-3 block text-sm font-bold text-white">チャットで相談</span>
                <span className="mt-1 block text-[11px] text-white/40">
                  画面右下の吹き出しから
                </span>
              </Link>
              <Link
                href="/apply"
                className="group rounded-2xl border border-white/10 bg-white/5 px-4 py-6 transition-colors hover:border-white/20 hover:bg-white/10"
              >
                <span className="mx-auto grid size-7 place-items-center rounded-full bg-midori text-sm font-bold text-ink">
                  →
                </span>
                <span className="mt-3 block text-sm font-bold text-white">お申し込み</span>
                <span className="mt-1 block text-[11px] text-white/40">サイト内で完結</span>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
