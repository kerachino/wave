import Link from "next/link";
import {
  AppIcon,
  BoltIcon,
  CardIcon,
  ChatIcon,
  CheckIcon,
  DocIcon,
  HouseIcon,
  MailIcon,
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
import { faqs, site } from "@/lib/site";
import { basePlanPrice, yen } from "@/lib/model";

const highlights = [
  {
    icon: YenIcon,
    badge: "魅力 01",
    title: "とにかく安い",
    catch: `基本プラン${yen(basePlanPrice)}〜`,
    body: `基本プラン${yen(basePlanPrice)}（税込）からスタート。必要なものだけ後から付け足せるので、ムダなお金がかかりません。サーバー代もかからず、維持費は月1,000円〜です。`,
    href: "/price",
    linkLabel: "料金プランを見る →",
    card: "border-amber-300 bg-gradient-to-b from-amber-50 via-white to-white hover:border-amber-400",
    badgeStyle: "bg-amber-400 text-ink",
    chip: "bg-amber-400 text-ink",
  },
  {
    icon: CardIcon,
    badge: "魅力 02",
    title: "アプリ内で決済できる",
    catch: "サイト内でお支払いまで完結",
    body: "銀行振込に加えて、Squareの請求書決済（カード・オンライン対応）を準備中。ご契約後のマイページから請求書を受け取り、そのままお支払い。郵送や来店の手続きは不要です。",
    href: "/apply",
    linkLabel: "お申し込みの流れを見る →",
    card: "border-sky-300 bg-gradient-to-b from-sky-50 via-white to-white hover:border-sky-400",
    badgeStyle: "bg-brand text-white",
    chip: "bg-brand text-white",
  },
  {
    icon: ChatIcon,
    badge: "魅力 03",
    title: "アプリ内でチャットできる",
    catch: "相談・制作のやり取りもこのサイトで",
    body: "メールだけでなく、専用のチャットでいつでも相談OK。お支払い確認後は担当者とのチャットが使えて、修正依頼や公開後の「ここを変えたい」も気軽に送れます。",
    href: "/contact",
    linkLabel: "相談方法を見る →",
    card: "border-emerald-300 bg-gradient-to-b from-emerald-50 via-white to-white hover:border-emerald-400",
    badgeStyle: "bg-emerald-500 text-white",
    chip: "bg-emerald-500 text-white",
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
              {/* 3つの魅力をひと目で */}
              <ul className="mt-6 flex flex-wrap gap-2">
                <li className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-3.5 py-1.5 text-xs font-bold text-ink">
                  <YenIcon className="size-4 text-amber-500" />
                  基本プラン{yen(basePlanPrice)}〜
                </li>
                <li className="inline-flex items-center gap-1.5 rounded-full border border-sky-300 bg-sky-50 px-3.5 py-1.5 text-xs font-bold text-ink">
                  <CardIcon className="size-4 text-brand" />
                  アプリ内で決済OK
                </li>
                <li className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-3.5 py-1.5 text-xs font-bold text-ink">
                  <ChatIcon className="size-4 text-emerald-600" />
                  アプリ内でチャットOK
                </li>
              </ul>
              {/* 数字で見る安心 */}
              {/* <dl className="mt-10 grid grid-cols-3 divide-x divide-line rounded-3xl border-2 border-line bg-white py-4 shadow-card">
                {[
                  ["基本料金", yen(basePlanPrice)],
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
              </dl> */}
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
                      〇〇商店 公式サイト
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
      {/* このサイトの魅力（できることセクションの前に配置） */}
      <Section className="bg-cream">
        <SectionHeading
          eyebrow="このサイトの魅力"
          title="安いのに、全部このサイトで完結"
          description="お申し込みからお支払い、制作のやり取りまで。面倒な手続きはできるだけなくしました。"
        />
        <div className="relative mt-12">
          <div
            aria-hidden="true"
            className="glow-soft pointer-events-none absolute -top-24 right-0 size-80 opacity-80"
          />
          <div className="relative grid gap-5 md:grid-cols-3">
            {highlights.map((highlight) => (
              <article
                key={highlight.title}
                className={`group relative overflow-hidden rounded-3xl border-2 p-6 text-left shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-soft sm:p-7 ${highlight.card}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold tracking-wider ${highlight.badgeStyle}`}
                  >
                    {highlight.badge}
                  </span>
                  <span
                    className={`grid size-14 shrink-0 place-items-center rounded-2xl shadow-card transition-transform duration-200 group-hover:-rotate-6 group-hover:scale-105 ${highlight.chip}`}
                  >
                    <highlight.icon className="size-7" />
                  </span>
                </div>
                <h3 className="mt-5 font-maru text-xl font-bold leading-snug text-ink">
                  {highlight.title}
                </h3>
                <p className="mt-1 text-[13px] font-bold text-ink-soft">
                  {highlight.catch}
                </p>
                <p className="mt-3 text-sm leading-7 text-ink-soft">
                  {highlight.body}
                </p>
                <Link
                  href={highlight.href}
                  className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-brand transition-colors hover:text-brand-dark"
                >
                  {highlight.linkLabel}
                </Link>
              </article>
            ))}
          </div>
          {/* アプリ内で完結する流れ */}
          <div className="relative mt-6 overflow-hidden rounded-3xl border-2 border-ink bg-ink px-6 py-7 shadow-pop sm:px-8">
            <div
              aria-hidden="true"
              className="glow-amber pointer-events-none absolute -right-16 -top-20 size-64 opacity-30"
            />
            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center">
              <div className="lg:max-w-xs">
                <p className="inline-flex items-center gap-2 rounded-full bg-midori px-3 py-1 text-[11px] font-bold tracking-wider text-ink">
                  <BoltIcon className="size-4" />
                  ぜんぶサイト内で完結
                </p>
                <p className="mt-3 font-maru text-lg font-bold leading-snug text-white">
                  相談 → 申し込み → 決済 → チャット
                </p>
                <p className="mt-2 text-xs leading-6 text-white/70">
                  電話・郵送・来店の手続きは不要です。
                </p>
              </div>
              <ol className="grid flex-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  {
                    icon: MailIcon,
                    step: "STEP 1",
                    title: "無料で相談",
                    body: "メール・チャットで24時間受付",
                    chip: "bg-sky-400 text-ink",
                  },
                  {
                    icon: CheckIcon,
                    step: "STEP 2",
                    title: "サイトで申し込み",
                    body: "Googleログイン→フォーム入力だけ",
                    chip: "bg-midori text-ink",
                  },
                  {
                    icon: CardIcon,
                    step: "STEP 3",
                    title: "アプリ内で決済",
                    body: "マイページで請求書を受け取り支払い",
                    chip: "bg-pink-400 text-ink",
                  },
                  {
                    icon: ChatIcon,
                    step: "STEP 4",
                    title: "チャットで制作",
                    body: "修正依頼も公開後の相談もOK",
                    chip: "bg-emerald-400 text-ink",
                  },
                ].map((flow) => (
                  <li
                    key={flow.title}
                    className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur transition-colors hover:bg-white/15"
                  >
                    <span
                      className={`grid size-10 place-items-center rounded-xl ${flow.chip}`}
                    >
                      <flow.icon className="size-5" />
                    </span>
                    <p className="mt-3 text-[10px] font-bold tracking-[0.18em] text-midori">
                      {flow.step}
                    </p>
                    <p className="mt-1 text-sm font-bold text-white">
                      {flow.title}
                    </p>
                    <p className="mt-1 text-[11px] leading-5 text-white/65">
                      {flow.body}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </Section>

      {/* できること（当サイト自体を参考例として案内） */}
      <Section className="bg-paper">
        <SectionHeading
          eyebrow="できること"
          title="こんなものが作れます"
          description="当サイト自体が制作の一例です。まずは気になるカードをのぞいてみてください。"
        />
        <div className="mx-auto mt-12 grid max-w-5xl gap-5 sm:grid-cols-2">
          {[
            {
              icon: HouseIcon,
              title: "お店・会社の紹介ページ",
              body: "営業時間・メニュー・アクセスまで。スマホでもきれいに読める1ページから。",
              chip: "bg-sky-400 text-ink",
              card: "border-sky-300 bg-gradient-to-b from-sky-50 via-white to-white hover:border-sky-400",
            },
            {
              icon: MailIcon,
              title: "お問い合わせフォームの設置",
              body: "メール通知つきで迷惑メール対策もセット。相談の取りこぼしを防ぎます。",
              chip: "bg-amber-400 text-ink",
              card: "border-amber-300 bg-gradient-to-b from-amber-50 via-white to-white hover:border-amber-400",
            },
            {
              icon: DocIcon,
              title: "ブログ・管理ページ",
              body: "お知らせや実績を自分で更新できる仕組みつき。公開後の発信もラクラク。",
              chip: "bg-emerald-400 text-ink",
              card: "border-emerald-300 bg-gradient-to-b from-emerald-50 via-white to-white hover:border-emerald-400",
            },
            {
              icon: AppIcon,
              title: "自社アプリの開発",
              body: "予約・在庫・出退勤など、業務に合わせたアプリのご相談も承ります。",
              chip: "bg-pink-400 text-ink",
              card: "border-pink-300 bg-gradient-to-b from-pink-50 via-white to-white hover:border-pink-400",
            },
          ].map((capability) => (
            <article
              key={capability.title}
              className={`group flex items-start gap-4 rounded-3xl border-2 p-6 shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-soft sm:p-7 ${capability.card}`}
            >
              <span
                className={`grid size-14 shrink-0 place-items-center rounded-2xl shadow-card transition-transform duration-200 group-hover:-rotate-6 group-hover:scale-105 ${capability.chip}`}
              >
                <capability.icon className="size-7" />
              </span>
              <div>
                <h3 className="font-maru text-lg font-bold leading-snug text-ink">
                  {capability.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-ink-soft">
                  {capability.body}
                </p>
              </div>
            </article>
          ))}
        </div>
        <div className="mx-auto mt-6 max-w-5xl overflow-hidden rounded-3xl border-2 border-ink bg-ink px-6 py-6 shadow-pop sm:px-8">
          <p className="flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-center sm:gap-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-midori px-4 py-1.5 text-xs font-bold text-ink">
              <CheckIcon className="size-4" />
              このサイト自体が制作例です
            </span>
            <span className="text-sm leading-7 text-white/75">
              フォームもチャットも決済も、このサイトで実際に動いています。
            </span>
          </p>
        </div>
      </Section>

      {/* 基本プラン（付け足し・維持費は料金ページで案内） */}
      <Section className="bg-cream">
        <SectionHeading
          eyebrow="料金プラン"
          title="まずは、基本プランから"
          description="まずは1ページの基本プランでお試し。足りない分は後から付け足すこともできます。"
        />
        <div className="mt-12">
          <TrialPlan />
        </div>
      </Section>
      {/* 制作の流れ（4ステップ） */}
      <Section className="bg-paper">
        <SectionHeading
          eyebrow="制作の流れ"
          title="申し込みから公開までの4ステップ"
          description="むずかしい手続きはありません。チャットで進捗を確認しながら進められます。"
        />
        <div className="relative mt-12">
          <div
            aria-hidden="true"
            className="glow-soft pointer-events-none absolute -left-24 top-10 size-80 opacity-70"
          />
          <div className="relative grid gap-5 md:grid-cols-4">
            {[
              {
                icon: MailIcon,
                title: "無料相談",
                body: "メール・チャットで、まずはお気軽に。価格や納期の相談だけでもOKです。",
                badge: "相談無料",
                chip: "bg-sky-400 text-ink",
                card: "border-sky-300 bg-gradient-to-b from-sky-50 via-white to-white hover:border-sky-400",
              },
              {
                icon: DocIcon,
                title: "ヒアリング・お見積り",
                body: "作りたいサイトのお話をうかがい、ページ構成・料金・スケジュールをお見積りでご提案します。",
                badge: "見積り無料",
                chip: "bg-amber-400 text-ink",
                card: "border-amber-300 bg-gradient-to-b from-amber-50 via-white to-white hover:border-amber-400",
              },
              {
                icon: CardIcon,
                title: "ご契約・制作",
                body: "サイト内でお申し込み後、お支払い確認後に制作を開始します。",
                badge: "サイト内で完結",
                chip: "bg-pink-400 text-ink",
                card: "border-pink-300 bg-gradient-to-b from-pink-50 via-white to-white hover:border-pink-400",
              },
              {
                icon: HouseIcon,
                title: "確認・公開",
                body: "修正後の最終確認をいただき、お支払い確認後に公開します。公開後も月1,000円〜でサポートします。",
                badge: "大きな修正は2回まで無料",
                chip: "bg-emerald-400 text-ink",
                card: "border-emerald-300 bg-gradient-to-b from-emerald-50 via-white to-white hover:border-emerald-400",
              },
            ].map((step, i) => (
              <div
                key={step.title}
                className={`group relative rounded-3xl border-2 p-6 shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-soft ${step.card}`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`grid size-12 place-items-center rounded-2xl shadow-card transition-transform duration-200 group-hover:-rotate-6 group-hover:scale-105 ${step.chip}`}
                  >
                    <step.icon className="size-6" />
                  </span>
                  <span className="grid size-8 place-items-center rounded-full bg-ink font-maru text-sm font-bold text-white">
                    {i + 1}
                  </span>
                </div>
                <p className="mt-4 text-[10px] font-bold tracking-[0.18em] text-ink-mute">
                  STEP {i + 1}
                </p>
                <h3 className="mt-1 font-maru text-lg font-bold text-ink">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-ink-soft">
                  {step.body}
                </p>
                <p className="mt-4 inline-block rounded-full bg-white px-3 py-1 text-xs font-bold text-ink ring-1 ring-line">
                  {step.badge}
                </p>
                {i < 3 && (
                  <span
                    aria-hidden="true"
                    className="absolute -right-3.5 top-1/2 z-10 hidden size-7 -translate-y-1/2 place-items-center rounded-full border-2 border-ink bg-midori text-ink shadow-pop-sm md:grid"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="size-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
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
        </div>
        <div className="mx-auto mt-8 grid max-w-4xl gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border-2 border-brand/30 bg-gradient-to-b from-brand-soft via-white to-white p-6 shadow-card">
            <p className="inline-flex items-center gap-2 rounded-full bg-brand px-3 py-1 text-xs font-bold text-white">
              大きな修正 2回まで無料
            </p>
            <p className="mt-3 text-sm leading-7 text-ink-soft">
              レイアウト・構成の変更、文章の大幅な書き換えなど。
            </p>
          </div>
          <div className="rounded-3xl border-2 border-amber-300 bg-gradient-to-b from-amber-50 via-white to-white p-6 shadow-card">
            <p className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-ink">
              小さな修正 数回程度は無料
            </p>
            <p className="mt-3 text-sm leading-7 text-ink-soft">
              色や写真の差し替え・文言の微調整など。細かな手直しは気軽にお伝えください。
            </p>
          </div>
        </div>
        <p className="mx-auto mt-4 max-w-4xl text-center text-xs leading-6 text-ink-mute">
          あくまで目安です。修正の内容や量によっては、追加料金が発生する場合があります。
        </p>
      </Section>

      {/* よくある質問（メインページ内のセクション） */}
      <Section id="faq" className="bg-cream scroll-mt-20">
        <SectionHeading
          eyebrow="よくあるご質問"
          title="気になることを解決！"
          description="「いくら？」「原稿がないけど大丈夫？」申し込む前に気になることを、お答えしています。"
        />
        <div className="mx-auto mt-10 max-w-3xl">
          <FaqAccordion items={[...faqs]} />
        </div>
        <p className="mx-auto mt-8 max-w-3xl text-center text-sm leading-7 text-ink-soft">
          ここにない質問は、
          <Link
            href="/contact"
            className="font-bold text-brand underline decoration-brand/30 underline-offset-4 transition-colors hover:text-brand-dark"
          >
            お問い合わせフォーム
          </Link>
          からお気軽にどうぞ。
        </p>
      </Section>

      {/* お問い合わせCTA（ポップなブルーのグラデーションカード） */}
      <Section className="bg-paper">
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
                className="group rounded-3xl border-2 border-sky-300 bg-sky-50 px-4 py-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-soft"
              >
                <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-sky-400 text-ink shadow-card transition-transform duration-200 group-hover:-rotate-6 group-hover:scale-105">
                  <MailIcon className="size-6" />
                </span>
                <span className="mt-3 block text-sm font-bold text-ink">
                  メールで相談
                </span>
                <span className="mt-1 block text-[11px] text-ink-soft">
                  24時間受付
                </span>
              </Link>
              <Link
                href="/contact#chat"
                className="group rounded-3xl border-2 border-amber-300 bg-amber-50 px-4 py-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-soft"
              >
                <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-amber-400 text-ink shadow-card transition-transform duration-200 group-hover:-rotate-6 group-hover:scale-105">
                  <ChatIcon className="size-6" />
                </span>
                <span className="mt-3 block text-sm font-bold text-ink">
                  チャットで相談
                </span>
                <span className="mt-1 block text-[11px] text-ink-soft">
                  画面右下の吹き出しから
                </span>
              </Link>
              <Link
                href="/apply"
                className="group rounded-3xl border-2 border-emerald-300 bg-emerald-50 px-4 py-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-soft"
              >
                <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-emerald-400 text-ink shadow-card transition-transform duration-200 group-hover:-rotate-6 group-hover:scale-105">
                  <span className="text-lg font-bold">→</span>
                </span>
                <span className="mt-3 block text-sm font-bold text-ink">
                  お申し込み
                </span>
                <span className="mt-1 block text-[11px] text-ink-soft">
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
