import Image from "next/image";
import Link from "next/link";
import {
  ArrowIcon,
  CardIcon,
  ChatIcon,
  CheckIcon,
  ClockIcon,
  DocIcon,
  HouseIcon,
  MailIcon,
  YenIcon,
} from "@/components/icons";
import { FaqAccordion } from "@/components/FaqAccordion";
import { FlowSteps } from "@/components/FlowSteps";
import { Container } from "@/components/ui";
import { faqs, maintenance } from "@/lib/site";
import {
  basePlanDescription,
  basePlanFeatures,
  basePlanPrice,
  purchasableOptions,
  yen,
} from "@/lib/model";

const heroPoints = [
  {
    icon: YenIcon,
    top: "低価格",
    bottom: `${yen(basePlanPrice)}〜`,
    text: "基本の1ページに必要な機能だけをプラス。",
  },
  {
    icon: HouseIcon,
    top: "すべて",
    bottom: "ウェブ完結",
    text: "契約・お支払い、やり取りは当アプリ上で行います。",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col bg-white text-ink">
      {/* ヒーロー */}
      <section id="top" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#e8f3fb] via-[#f4f9fd] to-white" />
        <div
          aria-hidden="true"
          className="dots pointer-events-none absolute inset-0 opacity-70"
        />
        <div
          aria-hidden="true"
          className="glow-strong pointer-events-none absolute -top-32 left-[-6%] size-[26rem] opacity-40"
        />
        <div
          aria-hidden="true"
          className="glow-pink pointer-events-none absolute -bottom-24 right-[8%] size-[22rem] opacity-50"
        />
        <Container className="relative pb-12 pt-10 sm:pt-14">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.05fr]">
            <div>
              <p className="inline-block -rotate-2 font-maru text-sm font-bold text-ink-soft underline decoration-[#f2688c]/50 decoration-wavy underline-offset-8">
                はじめてのWebサイトでも安心
              </p>
              <h1 className="mt-4 font-maru font-bold leading-[1.25] tracking-tight">
                <span className="block text-[1.9rem] sm:text-4xl">
                  <span className="text-[#f2688c]">低価格</span>
                  <span className="mx-2 text-ink-soft">×</span>
                  <span className="text-gradient-blue">ウェブ完結</span>
                </span>
                <span className="mt-1 block text-[1.7rem] text-brand-deep sm:text-4xl">
                  Web制作サービス
                </span>
              </h1>
              <p className="mt-5 max-w-xl text-sm leading-8 text-ink-soft">
                個人事業主・小規模事業者のための、
                問い合わせから支払い・やり取り・納品まで
                すべてウェブ上で完結するWebサイト制作サービスです。
              </p>
              <ul className="mt-6 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-2">
                {heroPoints.map((p) => (
                  <li
                    key={p.bottom}
                    className="flex items-center gap-3 rounded-2xl border border-line bg-white/80 p-4 shadow-card"
                  >
                    <span className="grid size-12 shrink-0 place-items-center rounded-full bg-brand-soft text-brand">
                      <p.icon className="size-5" />
                    </span>
                    <span>
                      <span className="block font-maru text-base font-bold leading-6 text-ink">
                        {p.top}
                        <span className="ml-1 text-[#f2688c]">{p.bottom}</span>
                      </span>
                      <span className="mt-0.5 block text-[11px] leading-5 text-ink-soft">
                        {p.text}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/contact"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#f2688c] px-7 py-3.5 text-[15px] font-bold text-white shadow-[0_12px_26px_-10px_rgb(242_104_140_/_0.6)] transition-all hover:-translate-y-0.5 hover:brightness-105"
                >
                  <MailIcon className="size-5" />
                  無料で相談する
                </Link>
                <Link
                  href="/price"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-bold text-ink shadow-card ring-1 ring-line transition-all hover:-translate-y-0.5 hover:text-brand-dark"
                >
                  料金プランを見る
                </Link>
              </div>
            </div>
            <div className="relative">
              <p className="absolute -top-7 right-2 z-10 hidden rotate-3 text-right font-maru text-xs font-bold leading-6 text-ink-soft sm:block">
                小さなお店・個人の想いを
                <br />
                Webで応援します！
              </p>
              <div aria-hidden="true" className="glow-soft absolute -inset-8" />
              <div className="relative flex items-end justify-center gap-3">
                <div className="relative w-[78%] overflow-hidden rounded-2xl border-[6px] border-ink bg-white shadow-lift">
                  <Image
                    src="/header.png"
                    alt="制作したカフェサイトのイメージ"
                    width={1000}
                    height={640}
                    priority
                    className="h-auto w-full object-cover"
                  />
                </div>
                <div className="relative w-[22%] overflow-hidden rounded-2xl border-4 border-ink bg-white shadow-lift">
                  <Image
                    src="/header.png"
                    alt="スマートフォン表示のイメージ"
                    width={300}
                    height={620}
                    className="h-44 w-full object-cover object-top sm:h-56"
                  />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
      {/* 選ばれる理由（ナビ：サービスの特徴） */}
      <section id="features" className="scroll-mt-24 bg-white">
        <Container className="py-14 sm:py-20">
          <p className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-4 py-1.5 text-xs font-bold tracking-[0.22em] text-brand-deep">
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-midori"
            />
            FEATURES
          </p>
          <h2 className="mt-4 max-w-2xl font-maru text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            選ばれる<span className="text-brand">3つの理由</span>
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-8 text-ink-soft">
            小さなお店や個人事業主の方でも、無理なくホームページが持てます。
          </p>
          <div className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-3">
            <div className="relative overflow-hidden rounded-3xl border border-line bg-white p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-lift">
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-1.5 bg-brand"
              />
              <div className="flex items-start justify-between">
                <span className="grid size-14 place-items-center rounded-2xl bg-brand-soft text-brand">
                  <YenIcon className="size-7" />
                </span>
                <span
                  aria-hidden="true"
                  className="font-maru text-3xl font-bold text-cream-deep"
                >
                  01
                </span>
              </div>
              <p className="mt-4 font-maru text-lg font-bold text-ink">
                安心の低価格
              </p>
              <p className="mt-2 text-[13px] leading-7 text-ink-soft">
                ホームページ制作の相場は10〜30万円。小回りと低コストで、低価格を実現しています。
              </p>
              {/* <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-brand-soft/60 px-3 py-1 text-[11px] font-bold text-brand-deep">
                お見積もり無料
              </p> */}
            </div>
            <div className="relative overflow-hidden rounded-3xl border border-line bg-white p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-lift">
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-1.5 bg-midori"
              />
              <div className="flex items-start justify-between">
                <span className="grid size-14 place-items-center rounded-2xl bg-midori-soft text-midori-dark">
                  <HouseIcon className="size-7" />
                </span>
                <span
                  aria-hidden="true"
                  className="font-maru text-3xl font-bold text-midori-soft"
                >
                  02
                </span>
              </div>
              <p className="mt-4 font-maru text-lg font-bold text-ink">
                すべてウェブで完結
              </p>
              <p className="mt-2 text-[13px] leading-7 text-ink-soft">
                契約・お支払い、やり取りは当アプリ上で行います。
              </p>
              {/* <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-midori-soft/70 px-3 py-1 text-[11px] font-bold text-midori-dark">
                来店・対面の打ち合わせ不要
              </p> */}
            </div>
            <div className="relative overflow-hidden rounded-3xl border border-line bg-white p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-lift">
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-1.5 bg-brand-deep"
              />
              <div className="flex items-start justify-between">
                <span className="grid size-14 place-items-center rounded-2xl bg-cream-deep text-brand-deep">
                  <ChatIcon className="size-7" />
                </span>
                <span
                  aria-hidden="true"
                  className="font-maru text-3xl font-bold text-cream-deep"
                >
                  03
                </span>
              </div>
              <p className="mt-4 font-maru text-lg font-bold text-ink">
                公開後もサポート
              </p>
              <p className="mt-2 text-[13px] leading-7 text-ink-soft">
                維持費プラン（{maintenance.price}
                ）で修正・更新に対応。「困った」をそのままにしません。
              </p>
              {/* <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-cream px-3 py-1 text-[11px] font-bold text-brand-deep ring-1 ring-line">
                月1回程度の修正・相談つき
              </p> */}
            </div>
          </div>
          <div className="mx-auto mt-6 grid max-w-5xl gap-4 lg:grid-cols-2">
            <div className="relative overflow-hidden rounded-3xl bg-brand-deep p-6 text-white shadow-lift sm:p-7">
              <div
                aria-hidden="true"
                className="aurora pointer-events-none absolute -right-20 -top-28 size-72 opacity-30"
              />
              <div className="relative">
                <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold tracking-wider ring-1 ring-white/20">
                  <span
                    aria-hidden="true"
                    className="size-1.5 rounded-full bg-midori"
                  />
                  こんなサイトが作れます
                </p>
                <p className="mt-3 font-maru text-xl font-bold leading-9">
                  このサイト自体が制作例です
                </p>
                <p className="mt-2 text-[13px] leading-7 text-white/75">
                  お店・会社の紹介ページ、お問い合わせフォーム、ブログ・お知らせ更新など、基本的な機能はこのサイトと同じように作れます。
                </p>
                <Link
                  href="/works"
                  className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-white px-6 py-3 text-sm font-bold text-brand-deep transition-all hover:-translate-y-0.5"
                >
                  制作例を見る <ArrowIcon className="size-4" />
                </Link>
              </div>
            </div>
            <div className="rounded-3xl border border-line bg-cream p-6 sm:p-7">
              <p className="font-maru text-base font-bold text-ink">
                こんなお悩み、ありませんか？
              </p>
              <ul className="mt-4 space-y-2.5 text-[13px] font-bold leading-6 text-ink">
                <li className="flex items-start gap-2.5 rounded-2xl bg-white px-4 py-3 shadow-card ring-1 ring-line/60">
                  <CheckIcon className="mt-1 size-4 shrink-0 text-midori" />
                  業者に頼むと高そうで一歩踏み出せない
                </li>
                <li className="flex items-start gap-2.5 rounded-2xl bg-white px-4 py-3 shadow-card ring-1 ring-line/60">
                  <CheckIcon className="mt-1 size-4 shrink-0 text-midori" />
                  パソコンが苦手で何を用意すればいいか分からない
                </li>
                <li className="flex items-start gap-2.5 rounded-2xl bg-white px-4 py-3 shadow-card ring-1 ring-line/60">
                  <CheckIcon className="mt-1 size-4 shrink-0 text-midori" />
                  作った後に放置してしまいそうで不安
                </li>
              </ul>
              <p className="mt-4 text-xs leading-6 text-ink-soft">
                丁寧にサポートいたします。
              </p>
            </div>
          </div>
        </Container>
      </section>
      {/* 料金プラン */}
      <section id="plan" className="scroll-mt-24 border-y border-line bg-cream">
        <Container className="py-14 sm:py-20">
          <p className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-bold tracking-[0.22em] text-brand-deep ring-1 ring-line">
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-midori"
            />
            PLAN
          </p>
          <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <h2 className="max-w-xl font-maru text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              {/* まずは{yen(basePlanPrice)}から。 */}
              <span className="text-brand">必要な分だけ</span>
            </h2>
            <p className="max-w-md text-sm leading-8 text-ink-soft">
              基本の1ページに必要な機能だけをプラス。
            </p>
          </div>
          <div className="mx-auto mt-10 grid max-w-5xl gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="relative overflow-hidden rounded-3xl bg-brand-deep p-6 text-white shadow-lift sm:p-8">
              <div
                aria-hidden="true"
                className="aurora pointer-events-none absolute -right-20 -top-28 size-72 opacity-30"
              />
              <div className="relative">
                <div className="flex items-center justify-between gap-3">
                  <p className="inline-block rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold tracking-wider ring-1 ring-white/20">
                    基本プラン
                  </p>
                  <p className="rounded-full bg-midori px-3 py-1 text-[11px] font-bold text-white">
                    一番人気
                  </p>
                </div>
                <p className="mt-4 font-maru text-4xl font-bold tracking-tight sm:text-5xl">
                  {yen(basePlanPrice)}
                  <span className="ml-1 align-middle text-sm font-bold text-white/70">
                    （税込）
                  </span>
                </p>
                <p className="mt-2 text-sm leading-7 text-white/75">
                  {basePlanDescription}
                </p>
                <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                  {basePlanFeatures.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2 rounded-xl bg-white px-3 py-2.5 text-[13px] font-bold leading-6 text-brand-deep"
                    >
                      <CheckIcon className="mt-1 size-4 shrink-0 text-midori-dark" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
                  <Link
                    href="/apply"
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-midori px-6 py-3 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:brightness-105"
                  >
                    このプランで申し込む <ArrowIcon className="size-4" />
                  </Link>
                  <Link
                    href="/price"
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-white/10 px-6 py-3 text-sm font-bold text-white ring-1 ring-white/25 transition-all hover:-translate-y-0.5 hover:bg-white/15"
                  >
                    料金の詳細を見る
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="rounded-3xl border border-line bg-white p-6 shadow-card">
                <h3 className="flex items-center gap-2 font-maru text-base font-bold text-ink">
                  <span className="grid size-8 place-items-center rounded-xl bg-brand-soft text-brand">
                    <DocIcon className="size-4" />
                  </span>
                  よく選ばれる付け足し
                </h3>
                <ul className="mt-4 space-y-2 text-sm">
                  {purchasableOptions.slice(0, 4).map((o) => (
                    <li
                      key={o.id}
                      className="flex items-center justify-between gap-3 rounded-2xl bg-cream px-4 py-3"
                    >
                      <span className="text-[13px] font-bold text-ink">
                        {o.name}
                      </span>
                      <span className="whitespace-nowrap rounded-full bg-white px-2.5 py-1 text-[12px] font-bold text-brand-deep ring-1 ring-line">
                        {o.displayPrice ?? `${yen(o.defaultPrice)}〜`}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/price"
                  className="mt-4 inline-flex w-full items-center justify-center gap-1 rounded-full bg-brand-soft px-4 py-2.5 text-xs font-bold text-brand-deep transition-all hover:-translate-y-0.5 hover:bg-cream-deep"
                >
                  すべての料金を見る <ArrowIcon className="size-4" />
                </Link>
              </div>
              <div className="rounded-3xl border border-line bg-white p-6 shadow-card">
                <h3 className="flex items-center gap-2 font-maru text-base font-bold text-ink">
                  <span className="grid size-8 place-items-center rounded-xl bg-midori-soft text-midori-dark">
                    <ClockIcon className="size-4" />
                  </span>
                  公開後の維持費
                </h3>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="font-maru text-2xl font-bold text-ink">
                    {maintenance.price}
                  </span>
                  <span className="rounded-full bg-cream px-2.5 py-0.5 text-[11px] font-bold text-ink-soft ring-1 ring-line">
                    公開に必要
                  </span>
                </div>
                <p className="mt-1 text-xs leading-6 text-ink-soft">
                  {maintenance.priceNote}
                  。小さな修正・更新と困ったときの相談が含まれます。
                </p>
                <Link
                  href="/price#maintenance"
                  className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-brand hover:text-brand-deep"
                >
                  維持費の内容を見る <ArrowIcon className="size-4" />
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
      {/* ご依頼から公開までの流れ */}
      <FlowSteps />
      {/* お支払いについて */}
      <section id="payment" className="scroll-mt-24 bg-white">
        <Container className="py-14 sm:py-20">
          <p className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-4 py-1.5 text-xs font-bold tracking-[0.22em] text-brand-deep">
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-midori"
            />
            PAYMENT
          </p>
          <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <h2 className="max-w-xl font-maru text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              お支払いは<span className="text-brand">シンプル＆安心</span>
            </h2>
            <p className="max-w-md text-sm leading-8 text-ink-soft">
              銀行振込とクレジットカードから選べます。
            </p>
          </div>
          <div className="relative mx-auto mt-10 flex max-w-5xl flex-col gap-5 overflow-hidden rounded-3xl bg-brand-deep p-6 text-white shadow-lift sm:p-8 lg:flex-row lg:items-center">
            <div
              aria-hidden="true"
              className="aurora pointer-events-none absolute -right-20 -top-28 size-72 opacity-30"
            />
            <div className="relative flex-1">
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-xs font-bold text-brand-deep">
                  <YenIcon className="size-4" />
                  銀行振込
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-xs font-bold text-brand-deep">
                  <CardIcon className="size-4" />
                  クレジットカード
                </span>
              </div>
              <p className="mt-4 font-maru text-xl font-bold leading-9">
                お好きな方法でお支払いいただけます
              </p>
              <p className="mt-2 text-[13px] leading-7 text-white/75">
                決済にはSquare（スクエア）の請求書サービスを利用しています。当店がカード番号をお預かりすることはありません。
              </p>
            </div>
            <div className="relative flex w-full flex-col gap-2.5 lg:max-w-xs">
              <Link
                href="/price#payment"
                className="inline-flex items-center justify-center gap-1 rounded-full bg-white px-5 py-3 text-sm font-bold text-brand-deep transition-all hover:-translate-y-0.5"
              >
                料金ページで詳しく見る <ArrowIcon className="size-4" />
              </Link>
              <p className="text-center text-[11px] leading-5 text-white/60">
                ご契約の条件・注意事項は
                <Link
                  href="/terms"
                  className="ml-1 font-bold text-white underline underline-offset-4"
                >
                  利用規約
                </Link>
                でご確認いただけます。
              </p>
            </div>
          </div>
        </Container>
      </section>
      {/* よくある質問 */}
      <section id="faq" className="scroll-mt-24 border-y border-line bg-cream">
        <Container className="py-14 sm:py-20">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div className="lg:sticky lg:top-24">
              <p className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-bold tracking-[0.22em] text-brand-deep ring-1 ring-line">
                <span
                  aria-hidden="true"
                  className="size-1.5 rounded-full bg-midori"
                />
                FAQ
              </p>
              <h2 className="mt-4 font-maru text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                不安はここで<span className="text-brand">すっきり解消</span>
              </h2>
              <p className="mt-3 max-w-md text-sm leading-8 text-ink-soft">
                気になることをまとめました。ここにない質問はお問い合わせフォームからお気軽にどうぞ。
              </p>
              <Link
                href="/contact"
                className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-brand px-6 py-3 text-sm font-bold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:bg-brand-dark"
              >
                質問を送ってみる <ArrowIcon className="size-4" />
              </Link>
            </div>
            <div>
              <FaqAccordion items={[...faqs]} />
            </div>
          </div>
        </Container>
      </section>
      {/* 下部CTA */}
      <section className="relative overflow-hidden bg-white">
        <Container className="py-14 sm:py-20">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-brand-deep px-6 py-12 text-center shadow-lift sm:px-10">
            <div
              aria-hidden="true"
              className="aurora pointer-events-none absolute -right-20 -top-28 size-72 opacity-30"
            />
            <div
              aria-hidden="true"
              className="glow-pink pointer-events-none absolute -bottom-24 -left-12 size-56 opacity-60"
            />
            <div className="relative mx-auto max-w-2xl">
              <p className="font-maru text-sm font-bold tracking-wider text-white/70">
                まずは無料相談から
              </p>
              <h2 className="mt-2 font-maru text-2xl font-bold tracking-tight text-white sm:text-3xl">
                あなたの想いを、Webでカタチに
              </h2>
              <p className="mt-3 text-sm leading-7 text-white/75">
                作りたいサイトの内容・予算・納期をお聞かせください。お見積もりだけでも大歓迎。
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/contact"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-bold text-brand-deep transition-all hover:-translate-y-0.5"
                >
                  <MailIcon className="size-5" />
                  無料で相談する
                </Link>
                <Link
                  href="/apply"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-white/10 px-7 py-3.5 text-[15px] font-bold text-white ring-1 ring-white/30 transition-all hover:-translate-y-0.5 hover:bg-white/15"
                >
                  お申し込みへ進む <ArrowIcon className="size-4" />
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
