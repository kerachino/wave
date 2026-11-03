import Image from "next/image";
import Link from "next/link";
import {
  ArrowIcon,
  CardIcon,
  ChatIcon,
  CheckIcon,
  HouseIcon,
  MailIcon,
  YenIcon,
} from "@/components/icons";
import { FaqAccordion } from "@/components/FaqAccordion";
import { FlowSteps } from "@/components/FlowSteps";
import { Card, Container, SectionHeading } from "@/components/ui";
import { basePlan, faqs, maintenance } from "@/lib/site";
import { basePlanFeatures, basePlanPrice, yen } from "@/lib/model";

const heroPoints = [
  {
    icon: YenIcon,
    top: "低価格",
    bottom: `${yen(basePlanPrice)}〜`,
    text: "基本の1ページ+必要な機能をプラス。",
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
              {/* <p className="mt-5 max-w-xl text-sm leading-8 text-ink-soft">
                個人事業主・小規模事業者のための、
                問い合わせから支払い・やり取り・納品まで
                すべてウェブ上で完結するWebサイト制作サービスです。
              </p> */}
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
                  href="/contact#chat"
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
              <p className="absolute -top-12 right-2 z-10 hidden rotate-3 text-right font-maru text-xs font-bold leading-6 text-ink-soft sm:block">
                小さなお店・個人の想いを
                <br />
                Webで応援します！
              </p>
              <div aria-hidden="true" className="glow-soft absolute -inset-8" />
              <div className="relative flex items-end justify-center gap-3">
                <div className="relative w-[78%] overflow-hidden rounded-2xl border-[6px] border-ink bg-white shadow-lift">
                  <Image
                    src="/header.jpg"
                    alt="制作したカフェサイトのイメージ"
                    width={1000}
                    height={640}
                    priority
                    className="h-auto w-full object-cover"
                  />
                </div>
                <div className="relative w-[22%] overflow-hidden rounded-2xl border-4 border-ink bg-white shadow-lift">
                  <Image
                    src="/header2.jpg"
                    alt="スマートフォン表示のイメージ"
                    width={300}
                    height={620}
                    className="h-44 w-full object-cover object-top sm:h-52"
                  />
                </div>
              </div>
            </div>
          </div>
        </Container>

        {/* 料金プラン（ヒーロー背景の続き） */}
        <div id="plan" className="relative mt-2 scroll-mt-24">
          <Container className="py-8 sm:py-12">
            <Card className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-white/80 bg-white shadow-lift">
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#f2688c] via-brand to-midori"
              />
              <div className="grid lg:grid-cols-[0.85fr_1.15fr]">
                <div className="flex flex-col bg-gradient-to-br from-brand-soft via-white to-[#fff3f6] p-6 sm:p-9 lg:p-10">
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-xs font-bold text-brand-deep shadow-sm ring-1 ring-brand/10">
                      <span
                        aria-hidden="true"
                        className="size-2 rounded-full bg-[#f2688c]"
                      />
                      基本プラン
                    </span>
                  </div>

                  <p className="mt-7 font-maru text-sm font-bold text-ink-soft">
                    まずは1ページから
                  </p>
                  <div className="mt-1 flex flex-wrap items-baseline gap-x-2">
                    <p className="font-maru text-5xl font-bold tracking-tight text-brand-deep sm:text-6xl">
                      {yen(basePlanPrice)}
                    </p>
                    <span className="text-sm font-bold text-ink-mute">
                      （税込）
                    </span>
                  </div>
                  <p className="mt-3 max-w-sm text-sm leading-7 text-ink-soft">
                    {basePlan.description}
                  </p>

                  <div className="mt-7 flex flex-col gap-3 sm:flex-row lg:flex-col">
                    <Link
                      href="/contact#chat"
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f2688c] px-5 py-3.5 text-sm font-bold text-white shadow-[0_12px_26px_-10px_rgb(242_104_140_/_0.6)] transition-all hover:-translate-y-0.5 hover:brightness-105"
                    >
                      <ChatIcon className="size-4" />
                      このプランで相談する
                    </Link>
                    <Link
                      href="/price"
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3.5 text-sm font-bold text-ink ring-1 ring-line transition-colors hover:text-brand-deep hover:ring-brand/40"
                    >
                      料金の内訳を見る
                      <ArrowIcon className="size-4" />
                    </Link>
                  </div>
                </div>

                <div className="flex flex-col justify-center p-6 sm:p-9 lg:p-10">
                  <div className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold tracking-[0.16em] text-brand">
                        INCLUDED
                      </p>
                      <h2 className="mt-1 font-maru text-xl font-bold text-ink">
                        基本プランに含まれるもの
                      </h2>
                    </div>
                    <span className="rounded-full bg-midori-soft px-3 py-1 text-xs font-bold text-midori-dark">
                      必要な機能は後から追加
                    </span>
                  </div>
                  <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                    {basePlanFeatures.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-3 rounded-2xl bg-cream/70 px-4 py-3.5"
                      >
                        <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-white text-midori-dark shadow-sm">
                          <CheckIcon className="size-3.5" />
                        </span>
                        <span className="text-sm leading-6 text-ink">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 flex flex-col gap-2 border-t border-line pt-4 text-xs leading-6 text-ink-soft sm:flex-row sm:justify-between sm:gap-5">
                    <p>
                      ※モニター価格。サイト公開後は月1,000円程度の維持費が必要です。
                      <Link
                        href="/price#maintenance"
                        className="ml-1 whitespace-nowrap font-bold text-brand-deep underline underline-offset-2 hover:text-brand"
                      >
                        詳しくはこちら
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </Container>
        </div>
      </section>
      <section
        id="features"
        className="scroll-mt-24 border-y border-line bg-white"
      >
        <Container className="py-14 sm:py-20">
          <SectionHeading
            eyebrow="FEATURES"
            title="はじめてでも安心の3つのポイント"
            description="小さなお店や個人事業主の方が、相談から公開後まで安心して進められるサービスを目指しています。"
            center={false}
          />

          <div className="mt-9 grid gap-4 md:grid-cols-3">
            <article className="group relative overflow-hidden rounded-3xl border border-line bg-cream p-6 transition-all hover:-translate-y-1 hover:shadow-lift sm:p-7">
              <span
                aria-hidden="true"
                className="absolute -right-8 -top-8 size-28 rounded-full bg-brand-soft"
              />
              <div className="relative">
                <span className="grid size-12 place-items-center rounded-2xl bg-white text-brand shadow-card">
                  <YenIcon className="size-6" />
                </span>
                <p className="mt-5 text-xs font-bold tracking-widest text-brand">
                  PRICE
                </p>
                <h3 className="mt-1 font-maru text-lg font-bold text-ink">
                  明確で始めやすい料金
                </h3>
                <p className="mt-2 text-sm leading-7 text-ink-soft">
                  基本プランは
                  <span className="font-bold text-ink">
                    {yen(basePlanPrice)}（税込）から
                  </span>
                  。必要な内容を確認してからお見積もりします。
                </p>
                <Link
                  href="/price"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-brand-deep hover:text-brand"
                >
                  料金の詳細 <ArrowIcon className="size-4" />
                </Link>
              </div>
            </article>

            <article className="group relative overflow-hidden rounded-3xl border border-line bg-[#f2f8f5] p-6 transition-all hover:-translate-y-1 hover:shadow-lift sm:p-7">
              <span
                aria-hidden="true"
                className="absolute -right-8 -top-8 size-28 rounded-full bg-midori-soft/70"
              />
              <div className="relative">
                <span className="grid size-12 place-items-center rounded-2xl bg-white text-midori-dark shadow-card">
                  <HouseIcon className="size-6" />
                </span>
                <p className="mt-5 text-xs font-bold tracking-widest text-midori-dark">
                  ONLINE
                </p>
                <h3 className="mt-1 font-maru text-lg font-bold text-ink">
                  手続きもやり取りもオンライン
                </h3>
                <p className="mt-2 text-sm leading-7 text-ink-soft">
                  ご相談から契約・お支払い、制作中の確認まで、マイページとチャットで進められます。
                </p>
                <Link
                  href="/contact#chat"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-brand-deep hover:text-brand"
                >
                  チャットで相談する <ArrowIcon className="size-4" />
                </Link>
              </div>
            </article>

            <article className="group relative overflow-hidden rounded-3xl border border-line bg-[#f5f4fb] p-6 transition-all hover:-translate-y-1 hover:shadow-lift sm:p-7">
              <span
                aria-hidden="true"
                className="absolute -right-8 -top-8 size-28 rounded-full bg-[#e8e4f8]"
              />
              <div className="relative">
                <span className="grid size-12 place-items-center rounded-2xl bg-white text-brand-deep shadow-card">
                  <ChatIcon className="size-6" />
                </span>
                <p className="mt-5 text-xs font-bold tracking-widest text-brand-deep">
                  SUPPORT
                </p>
                <h3 className="mt-1 font-maru text-lg font-bold text-ink">
                  公開後も相談できる
                </h3>
                <p className="mt-2 text-sm leading-7 text-ink-soft">
                  公開後の修正・更新をサポートする維持費プランもご用意しています。
                  {maintenance.price}
                </p>
                <Link
                  href="/price#maintenance"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-brand-deep hover:text-brand"
                >
                  サポート内容を見る <ArrowIcon className="size-4" />
                </Link>
              </div>
            </article>
          </div>

          <div className="mt-5 flex flex-col gap-5 rounded-3xl bg-brand-deep p-6 text-white shadow-lift sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <p className="text-xs font-bold tracking-widest text-white/65">
                WORKS
              </p>
              <h3 className="mt-1 font-maru text-lg font-bold">
                制作例を見て仕上がりをイメージ
              </h3>
              <p className="mt-1 text-sm leading-7 text-white/75">
                お店やサービスの魅力が伝わるサイトをご紹介しています。
              </p>
            </div>
            <Link
              href="/works"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-brand-deep transition-all hover:-translate-y-0.5 hover:bg-brand-soft"
            >
              制作例を見る <ArrowIcon className="size-4" />
            </Link>
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
                気になることをまとめました。ここにない質問はチャットからお気軽にどうぞ。
              </p>
              <Link
                href="/contact#chat"
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
                  href="/contact#chat"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-bold text-brand-deep transition-all hover:-translate-y-0.5"
                >
                  <MailIcon className="size-5" />
                  無料で相談する
                </Link>
                <Link
                  href="/login"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-white/10 px-7 py-3.5 text-[15px] font-bold text-white ring-1 ring-white/30 transition-all hover:-translate-y-0.5 hover:bg-white/15"
                >
                  マイページで契約する <ArrowIcon className="size-4" />
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
