import Link from "next/link";
import {
  BoltIcon,
  ChatIcon,
  HouseIcon,
  MailIcon,
  PhoneIcon,
  YenIcon,
} from "@/components/icons";
import { PriceCards } from "@/components/PriceCards";
import { Badge, ButtonLink, Container, Section, SectionHeading } from "@/components/ui";
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
        <Container className="pt-20 pb-16 sm:pt-28">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <Badge color="brand" className="mb-4">
                新規受付中 / モニター募集あり
              </Badge>
              <h1 className="font-maru text-3xl font-bold leading-tight text-ink sm:text-4xl">
                地域の会社のホームページ、
                <br className="sm:hidden" />
                <span className="text-brand-deep">まるごとお任せ</span>ください
              </h1>
              <p className="mt-5 text-base leading-8 text-ink-soft sm:text-lg">
                ホームページ制作を、難しいことはすべておまかせ。
                <br className="hidden sm:inline" />
                相談・制作・公開・その後の更新まで、1人で丁寧にお届けします。
                <br className="hidden sm:inline" />
                まずは無料でご相談を。お返事は{site.replyTime}。
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/contact" variant="primary" size="lg" className="flex-1">
                  無料で相談する（メール・チャット）
                </ButtonLink>
                <ButtonLink href="/price" variant="secondary" size="lg" className="flex-1">
                  料金プランを見る
                </ButtonLink>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                <Badge>お試し 5,500円〜</Badge>
                <Badge color="midori">スマホ対応</Badge>
                <Badge color="ink">返信 {site.replyTime}</Badge>
              </div>
            </div>

            {/* イメージカード */}
            <div className="rounded-3xl border border-ink/10 bg-cream p-6 shadow-lg sm:p-8">
              <div className="flex items-center gap-3">
                <span className="grid size-4 rounded-md bg-brand" />
                <span className="grid size-4 rounded-md bg-midori" />
                <span className="grid size-4 rounded-md bg-brand-soft border border-ink/10" />
                <span className="ml-auto h-2 w-16 rounded-full bg-ink/15" />
              </div>
              <div className="mx-auto mt-6 max-w-sm rounded-2xl bg-white p-5 shadow-md">
                <p className="text-xs text-ink-mute">〇〇商店 様のホームページ</p>
                <h2 className="mt-2 font-maru text-lg font-bold text-ink">
                  お店の紹介ページ
                </h2>
                <div className="mt-3 space-y-2.5">
                  <div className="rounded-xl bg-paper px-3 py-2.5">
                    <p className="text-[11px] font-bold text-ink-soft">ごあいさつ</p>
                    <p className="mt-1 h-2 w-full rounded-full bg-ink/10" />
                    <p className="h-2 w-4/5 rounded-full bg-ink/10" />
                  </div>
                  <div className="rounded-xl bg-paper px-3 py-2.5">
                    <p className="text-[11px] font-bold text-ink-soft">営業時間・アクセス</p>
                    <p className="mt-1 h-2 w-3/4 rounded-full bg-ink/10" />
                  </div>
                  <div className="rounded-xl bg-paper px-3 py-2.5">
                    <p className="text-[11px] font-bold text-ink-soft">お問い合わせ</p>
                    <div className="mt-1 inline-flex items-center gap-1.5">
                      <span className="grid size-5 place-items-center rounded-md bg-brand" />
                      <span className="h-2 w-20 rounded-full bg-ink/10" />
                    </div>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-center text-xs text-ink-mute">
                「スマホで見てもきれい」をお約束します
              </p>
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
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {merits.map((merit) => (
            <Link
              key={merit.title}
              href={merit.href}
              className="group rounded-3xl border border-ink/10 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-brand hover:shadow-md"
            >
              <span className="grid size-14 place-items-center rounded-2xl bg-brand-soft text-brand-deep">
                <merit.icon className="size-8" />
              </span>
              <h3 className="mt-4 font-maru text-lg font-bold text-ink">
                {merit.title}
              </h3>
              <p className="mt-2 text-sm leading-7 text-ink-soft">
                {merit.body}
              </p>
              <p className="mt-3 text-xs font-bold text-brand group-hover:text-brand-deep">
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
        <div className="mt-10">
          <PriceCards />
        </div>
        <p className="mt-6 text-center text-sm text-ink-soft">
          公開後の維持費は月1,000円〜（保守サポート費）。ホスティングは無料、
          独自ドメインは実費のみ。詳しくは
          <Link href="/price" className="font-bold text-brand hover:text-brand-deep">
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
        <div className="mt-10 grid gap-8 md:grid-cols-4">
          {[
            ["無料相談", "メール・チャットで、まずはお気軽に。価格や納期の相談だけでもOKです。"],
            ["ヒアリング・お見積り", "作りたいサイトのお話をうかがい、料金とスケジュールをご提案します。"],
            ["ご契約・制作", "サイト内でお申し込みいただき、着手金のお支払いのあと制作開始です。"],
            ["公開・納品", "ご確認をいただきながら仕上げ、サイトを公開。残金のお支払いは公開後です。"],
          ].map(([title, body], i) => (
            <div key={i} className="rounded-3xl border border-ink/10 bg-white p-6 shadow-sm">
              <p className="grid size-10 place-items-center rounded-full bg-brand font-maru text-lg font-bold text-white">
                {i + 1}
              </p>
              <h3 className="mt-4 font-maru text-lg font-bold text-ink">{title}</h3>
              <p className="mt-2 text-sm leading-7 text-ink-soft">{body}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center">
          <Link href="/flow" className="text-sm font-bold text-brand hover:text-brand-deep">
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
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
              className="rounded-2xl border border-ink/10 bg-white px-4 py-3.5 text-sm font-bold text-ink shadow-sm transition-colors hover:border-brand hover:text-brand"
            >
              {q}
            </Link>
          ))}
        </div>
      </Section>

      {/* お問い合わせCTA */}
      <Section className="bg-ink py-20">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold tracking-widest text-white/60">
              まずは無料でご相談ください
            </p>
            <h2 className="mt-3 font-maru text-2xl font-bold text-white sm:text-3xl">
              ホームページのこと、
              <br className="sm:hidden" />
              なんでもお話しください
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/80">
              作りたいイメージがなくても大丈夫。メール・チャットで、
              お気軽にご相談いただけます。お電話での対応は行っておりません。
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <Link
                href="/contact"
                className="rounded-2xl border border-white/15 bg-white/5 px-4 py-5 text-center transition-colors hover:bg-white/10"
              >
                <MailIcon className="mx-auto size-8 text-white/80" />
                <span className="mt-2 block text-sm font-bold text-white">メールで相談</span>
                <span className="mt-1 block text-[11px] text-white/60">24時間受付</span>
              </Link>
              <Link
                href="/contact#chat"
                className="rounded-2xl border border-brand bg-brand-soft px-4 py-5 text-center transition-colors hover:bg-brand"
              >
                <ChatIcon className="mx-auto size-8 text-brand-deep" />
                <span className="mt-2 block text-sm font-bold text-brand-deep">チャットで相談</span>
                <span className="mt-1 block text-[11px] text-brand-deep/70">
                  画面右下の吹き出しから
                </span>
              </Link>
              <Link
                href="/apply"
                className="rounded-2xl border border-white/15 bg-white/5 px-4 py-5 text-center transition-colors hover:bg-white/10"
              >
                <span className="mx-auto grid size-8 place-items-center rounded-full bg-brand text-white text-lg">
                  →
                </span>
                <span className="mt-2 block text-sm font-bold text-white">お申し込み</span>
                <span className="mt-1 block text-[11px] text-white/60">サイト内で完結</span>
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
