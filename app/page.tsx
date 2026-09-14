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
import { FaqAccordion } from "@/components/FaqAccordion";
import { TrialPlan } from "@/components/TrialPlan";
import {
  ButtonLink,
  Container,
  Section,
  SectionHeading,
} from "@/components/ui";
import { capabilities, faqs, site } from "@/lib/site";

const merits = [
  {
    icon: YenIcon,
    title: "低価格",
    body: "基本プラン7,500円。コストを削減し、低価格での提供を実現。",
    href: "/price",
    chip: "bg-midori-soft text-midori-dark group-hover:bg-midori group-hover:text-ink",
  },
  {
    icon: BoltIcon,
    title: "スピード制作",
    body: "最短2週間〜の納品。お店の紹介ページを、今すぐネットに載せられます。",
    href: "/price",
    chip: "bg-pink-100 text-pink-500 group-hover:bg-pink-500 group-hover:text-white",
  },
  {
    icon: PhoneIcon,
    title: "スマホ対応",
    body: "標準でスマホ対応。どの端末でもきれいに表示。",
    href: "/price",
    chip: "bg-brand-soft text-brand group-hover:bg-brand group-hover:text-white",
  },
  {
    icon: HouseIcon,
    title: "サイト完結",
    body: "支払いからやり取りまでサイト内で完結。お支払は外部決済代行サービスと契約しており、安全にお支払いいただけます。",
    href: "/operator",
    chip: "bg-emerald-100 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* ヒーロー（明るい背景 × ポップな装飾） */}
      <section className="relative overflow-hidden bg-paper">
        {/* 装飾レイヤー */}
        <div
          aria-hidden="true"
          className="dots pointer-events-none absolute inset-0"
        />
        <div
          aria-hidden="true"
          className="glow-strong pointer-events-none absolute -top-40 left-[-8%] size-[30rem] opacity-50"
        />
        <div
          aria-hidden="true"
          className="glow-amber pointer-events-none absolute -top-24 right-[-6%] size-[24rem] opacity-60"
        />
        <div
          aria-hidden="true"
          className="glow-pink pointer-events-none absolute -bottom-32 left-[28%] size-[22rem] opacity-40"
        />
        <Container className="relative pt-16 pb-20 sm:pt-24">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
            <div>
              {/* 受付状況バッジ（シール風） */}
              <p className="inline-flex -rotate-2 items-center gap-2 rounded-full border-2 border-ink bg-midori px-4 py-1.5 text-xs font-bold text-ink shadow-pop-sm">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ink/40" />
                  <span className="relative inline-flex size-2 rounded-full bg-ink/70" />
                </span>
                新規受付中 / モニター募集あり
              </p>
              <h1 className="mt-6 font-maru text-[2rem] font-bold leading-[1.35] tracking-tight text-ink sm:text-4xl lg:text-[2.8rem]">
                会社のホームページ、
                <br className="sm:hidden" />
                <span className="text-gradient">まるごとお任せ</span>下さい
              </h1>
              <p className="mt-5 max-w-xl text-sm leading-8 text-ink-soft sm:text-base">
                ホームページ制作を、難しいことはすべておまかせ。
                <br className="hidden sm:inline" />
                相談・制作・公開・その後の更新まで、丁寧にお届けします。
                <br className="hidden sm:inline" />
                まずは無料でご相談を。お返事は{site.replyTime}となります。
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink
                  href="/contact"
                  variant="primary"
                  size="lg"
                  className="flex-1"
                >
                  無料で相談する
                </ButtonLink>
                <ButtonLink
                  href="/price"
                  variant="secondary"
                  size="lg"
                  className="flex-1"
                >
                  料金プランを見る
                </ButtonLink>
              </div>
              {/* 数字で見る安心 */}
              <dl className="mt-10 grid grid-cols-3 divide-x divide-line rounded-3xl border-2 border-line bg-white py-4 shadow-card">
                {[
                  ["基本料金", "7,500円"],
                  ["最短納期", "2週間〜"],
                  ["返信目安", "2〜3営業日"],
                ].map(([label, value]) => (
                  <div key={label} className="px-3 text-center sm:px-5">
                    <dt className="text-[10px] font-semibold tracking-wider text-ink-mute sm:text-xs">
                      {label}
                    </dt>
                    <dd className="mt-1.5 font-maru text-sm font-bold text-brand sm:text-lg">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* モックアップ */}
            <div className="relative">
              <div
                aria-hidden="true"
                className="glow-soft absolute -inset-10 opacity-90"
              />
              <div className="relative rotate-1 overflow-hidden rounded-3xl border-2 border-line bg-white shadow-lift transition-transform duration-300 hover:rotate-0">
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
                    {["ごあいさつ", "営業時間・アクセス", "お問い合わせ"].map(
                      (label) => (
                        <div
                          key={label}
                          className="rounded-xl bg-cream p-3 ring-1 ring-line"
                        >
                          <p className="text-[10px] font-bold text-ink-soft">
                            {label}
                          </p>
                          <div className="mt-2 space-y-1">
                            <div className="h-1.5 w-full rounded-full bg-line" />
                            <div className="h-1.5 w-2/3 rounded-full bg-line" />
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>
              {/* フローティングチップ（シール風） */}
              <div className="absolute -bottom-5 left-4 flex -rotate-2 items-center gap-2.5 rounded-2xl border-2 border-ink bg-white px-4 py-3 shadow-pop-sm sm:left-8">
                <span className="grid size-7 place-items-center rounded-full bg-brand text-white">
                  <CheckIcon className="size-4" />
                </span>
                <div className="leading-tight">
                  <p className="text-xs font-bold text-ink">スマホ対応</p>
                  <p className="text-[10px] text-ink-mute">
                    どの端末でもきれいに表示
                  </p>
                </div>
              </div>
              <div className="absolute -top-4 right-4 hidden rotate-2 items-center gap-2.5 rounded-2xl border-2 border-ink bg-white px-4 py-3 shadow-pop-sm sm:flex">
                <span className="grid size-7 place-items-center rounded-full bg-midori text-ink">
                  <BoltIcon className="size-4" />
                </span>
                <div className="leading-tight">
                  <p className="text-xs font-bold text-ink">最短2週間〜</p>
                  <p className="text-[10px] text-ink-mute">
                    スピード制作で納品
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
      {/* 4つの魅力 */}
      <Section className="bg-cream">
        <SectionHeading
          title="選ばれる理由"
          description="難しいことはぜんぶおまかせ。はじめやすさと、頼んで良かったと思われるものに。"
        />
        <div className="relative mt-12">
          <div
            aria-hidden="true"
            className="glow-soft pointer-events-none absolute -top-24 right-0 size-80 opacity-80"
          />
          <div className="relative grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {merits.map((merit) => (
              <div
                key={merit.title}
                className="group rounded-3xl border border-line bg-white p-6 shadow-card transition-all duration-200 hover:-translate-y-1 hover:border-brand/40 hover:shadow-soft"
              >
                <span
                  className={`grid size-12 place-items-center rounded-full transition-colors ${merit.chip}`}
                >
                  <merit.icon className="size-6" />
                </span>
                <h3 className="mt-5 font-maru text-lg font-bold text-ink">
                  {merit.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-ink-soft">
                  {merit.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* できること（説明なしの列挙） */}
      <Section className="bg-paper">
        <SectionHeading eyebrow="できること" title="こんなものが作れます" />
        <ul className="mx-auto mt-10 grid max-w-4xl gap-3 sm:grid-cols-2">
          {capabilities.map((item) => (
            <li
              key={item}
              className="flex items-center gap-3 rounded-2xl border border-line bg-white px-5 py-4 text-sm font-bold text-ink shadow-card"
            >
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-midori-soft text-midori-dark">
                <CheckIcon className="size-4" />
              </span>
              {item}
            </li>
          ))}
        </ul>
      </Section>

      {/* 基本プラン（付け足し・維持費は料金ページで案内） */}
      <Section className="bg-paper">
        <SectionHeading
          eyebrow="料金プラン"
          title="まずは、基本プラン7,500円から"
          description="いきなり大きなお願いは不安ですよね。まずは1ページの基本プランでお試し。足りない分は後から付け足せます。"
        />
        <div className="mt-12">
          <TrialPlan />
        </div>
      </Section>
      {/* 制作の流れ（4ステップ） */}
      <Section className="bg-cream">
        <SectionHeading
          eyebrow="制作の流れ"
          title="申し込みから公開までの4ステップ"
        />
        <div className="mt-12 grid gap-5 md:grid-cols-4">
          {[
            {
              title: "無料相談",
              body: "メール・チャットで、まずはお気軽に。価格や納期の相談だけでもOKです。",
              note: "費用はかかりません",
            },
            {
              title: "ヒアリング・お見積り",
              body: "作りたいサイトのお話をうかがい、ページ構成・料金・スケジュールをお見積りでご提案します。",
              note: "見積り無料",
            },
            {
              title: "ご契約・制作",
              body: "サイト内でお申し込み後、着手金（50%）のお支払い確認後に制作を開始。進み具合を共有します。",
              note: "着手金 50%",
            },
            {
              title: "確認・公開",
              body: "完成前にデザインや文章を確認。修正対応後に公開し、残金（50%）は公開後のお支払いです。サイトの公開には、公開後の維持費（月1,000円〜）のお支払いが必要です。",
              note: "残金は公開後",
            },
          ].map((step, i) => (
            <div
              key={step.title}
              className="relative rounded-2xl border border-line bg-white p-6 shadow-card"
            >
              <div className="flex items-center justify-between">
                <p className="grid size-10 place-items-center rounded-full bg-brand font-maru text-base font-bold text-white shadow-pop-sm">
                  {i + 1}
                </p>
                <span className="rounded-full bg-brand-soft px-3 py-1 text-[11px] font-bold text-brand-deep">
                  STEP{i + 1}
                </span>
              </div>
              <h3 className="mt-4 font-maru text-lg font-bold text-ink">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-7 text-ink-soft">
                {step.body}
              </p>
              <p className="mt-3 inline-block rounded-full bg-cream px-3 py-1 text-xs font-bold text-ink-soft ring-1 ring-line">
                {step.note}
              </p>
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
        <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-line bg-white p-6 text-left shadow-card sm:p-7">
          <h3 className="font-maru text-base font-bold text-ink">
            修正回数の目安（制作中の確認・公開前まで）
          </h3>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-ink-soft">
            <li className="flex items-start gap-3">
              <span className="mt-1.5 shrink-0 rounded bg-brand-soft px-2 py-0.5 text-xs font-bold text-brand-deep">
                大きな修正 2回まで無料
              </span>
              <span>レイアウト・構成の変更、文章の大幅な書き換えなど。</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 shrink-0 rounded bg-midori-soft px-2 py-0.5 text-xs font-bold text-midori-dark">
                小さな修正 数回程度は無料
              </span>
              <span>
                色や写真の差し替え・文言の微調整など。細かな手直しは気軽にお伝えください。
              </span>
            </li>
          </ul>
          <p className="mt-4 text-xs leading-6 text-ink-mute">
            あくまで目安です。修正の内容や量によっては、追加料金が発生する場合があります。
          </p>
        </div>
      </Section>

      {/* よくある質問（メインページ内のセクション） */}
      <Section id="faq" className="bg-paper scroll-mt-20">
        <SectionHeading
          eyebrow="よくあるご質問"
          title="「いくら？」「原稿がないけど大丈夫？」"
          description="申し込む前に気になることを、お答えしています。"
        />
        <div className="mx-auto mt-10 max-w-3xl">
          <FaqAccordion items={[...faqs]} />
        </div>
      </Section>

      {/* お問い合わせCTA（ポップなブルーのグラデーションカード） */}
      <Section className="bg-cream">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-brand to-brand-dark px-6 py-14 text-center shadow-lift sm:px-10 sm:py-16">
          {/* 装飾 */}
          <div
            aria-hidden="true"
            className="aurora pointer-events-none absolute -right-24 -top-28 size-80 opacity-50"
          />
          <div
            aria-hidden="true"
            className="glow-amber pointer-events-none absolute -bottom-24 -left-16 size-64 opacity-60"
          />
          <span
            aria-hidden="true"
            className="absolute left-[12%] top-10 size-2.5 rounded-full bg-midori"
          />
          <span
            aria-hidden="true"
            className="absolute right-[16%] top-16 size-2 rounded-full bg-white/80"
          />
          <span
            aria-hidden="true"
            className="absolute bottom-12 left-[22%] size-2 rounded-full bg-cyan-300"
          />
          <span
            aria-hidden="true"
            className="absolute bottom-16 right-[10%] size-3 rounded-full bg-midori/70"
          />
          <div className="relative mx-auto max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold tracking-[0.18em] text-white backdrop-blur">
              <span
                aria-hidden="true"
                className="size-1.5 rounded-full bg-midori"
              />
              まずは無料でご相談ください
            </p>
            <h2 className="mt-4 font-maru text-2xl font-bold tracking-tight text-white sm:text-3xl">
              ホームページのこと、
              <br className="sm:hidden" />
              なんでもお話しください
            </h2>
            <p className="mt-4 text-sm leading-8 text-white/70">
              作りたいイメージがなくても大丈夫。メール・チャットで、
              お気軽にご相談いただけます。お電話での対応は行っておりません。
            </p>
            <div className="mt-9 grid gap-4 sm:grid-cols-3">
              <Link
                href="/contact"
                className="rounded-3xl border border-white/15 bg-white/10 px-4 py-6 backdrop-blur transition-all hover:-translate-y-1 hover:bg-white/15"
              >
                <MailIcon className="mx-auto size-7 text-midori" />
                <span className="mt-3 block text-sm font-bold text-white">
                  メールで相談
                </span>
                <span className="mt-1 block text-[11px] text-white/50">
                  24時間受付
                </span>
              </Link>
              <Link
                href="/contact#chat"
                className="rounded-3xl border border-midori/60 bg-midori/15 px-4 py-6 backdrop-blur transition-all hover:-translate-y-1 hover:bg-midori/25"
              >
                <ChatIcon className="mx-auto size-7 text-midori" />
                <span className="mt-3 block text-sm font-bold text-white">
                  チャットで相談
                </span>
                <span className="mt-1 block text-[11px] text-white/50">
                  画面右下の吹き出しから
                </span>
              </Link>
              <Link
                href="/apply"
                className="rounded-3xl border border-white/15 bg-white/10 px-4 py-6 backdrop-blur transition-all hover:-translate-y-1 hover:bg-white/15"
              >
                <span className="mx-auto grid size-7 place-items-center rounded-full bg-midori text-sm font-bold text-ink">
                  →
                </span>
                <span className="mt-3 block text-sm font-bold text-white">
                  お申し込み
                </span>
                <span className="mt-1 block text-[11px] text-white/50">
                  サイト内で完結
                </span>
              </Link>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
