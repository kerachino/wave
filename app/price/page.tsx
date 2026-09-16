import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { PriceCards } from "@/components/PriceCards";
import {
  ButtonLink,
  Card,
  Container,
  Section,
  SectionHeading,
} from "@/components/ui";
import { CardIcon, CheckIcon, ClockIcon } from "@/components/icons";
import { maintenance } from "@/lib/site";
import { basePlanPrice, yen } from "@/lib/model";

// ページ内の各セクション（冒頭のアンカーナビで使用）
const pageSections = [
  { id: "plan", label: "料金プラン" },
  { id: "conditions", label: "基本プランの条件" },
  { id: "maintenance", label: "維持費" },
  { id: "payment", label: "お支払い" },
] as const;

export const metadata = {
  title: "料金プラン",
  description: `ホームページ制作は基本プラン${yen(basePlanPrice)}（税込）＋必要な付け足しだけ。公開後の維持費は月2,000円〜（サイトの公開に必要・お支払いがない場合は公開できません）。`,
};

// 料金以外にかかる費用
const extraCosts: [string, string][] = [
  ["独自ドメイン（使う場合のみ）", "年間1,500円前後の実費"],
  ["銀行振込の手数料", "お客さま負担となります"],
];

// 基本プランの条件（モニター価格であることの説明）
const planConditions: { text: string; highlight?: boolean }[] = [
  {
    text: "制作したサイトを「制作事例」として掲載させていただきます",
    highlight: true,
  },
  {
    text: "公開後のクチコミ・アンケートへのご協力をお願いします",
    highlight: true,
  },
  { text: "お申し込み状況により、お断りする場合があります" },
  { text: "先着順の受付となります" },
];

export default function PricePage() {
  return (
    <div className="flex flex-col">
      <PageHeader
        title="料金"
        description="まずは無料相談で、作りたいサイトについてお聞かせください。"
      />

      {/* ページ内ナビ（各セクションへのショートカット） */}
      <div className="sticky top-16 z-30 border-b border-line/70 bg-white/85 backdrop-blur-xl">
        <Container>
          <nav
            aria-label="ページ内メニュー"
            className="scrollbar-thin flex items-center gap-2 overflow-x-auto py-3"
          >
            <span className="hidden shrink-0 pr-1 text-xs font-bold tracking-wider text-ink-mute sm:inline">
              このページの内容
            </span>
            {pageSections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="shrink-0 whitespace-nowrap rounded-full bg-cream px-4 py-1.5 text-xs font-bold text-ink-soft ring-1 ring-line transition-colors hover:bg-brand-soft hover:text-brand-deep sm:text-sm"
              >
                {s.label}
              </a>
            ))}
          </nav>
        </Container>
      </div>

      {/* ① 料金プラン */}
      <Section id="plan" className="scroll-mt-32 bg-paper">
        <SectionHeading
          title="料金プラン"
          description="まずは1ページの基本プランから始めて、足りない分は後から付け足せます。表示金額はすべて税込です。"
        />
        <div className="mt-12">
          <PriceCards />
        </div>
      </Section>

      {/* ② 基本プランの条件 */}
      <Section id="conditions" className="scroll-mt-32 bg-cream">
        <SectionHeading
          title={`基本${yen(basePlanPrice)}の条件`}
          description="基本プランはモニター価格です。お申し込みの前に、以下の条件をご確認ください。"
        />
        <div className="mx-auto mt-10 max-w-3xl">
          <Card className="p-6 sm:p-8">
            <ol className="space-y-3">
              {planConditions.map((condition, i) => (
                <li
                  key={condition.text}
                  className={`flex items-start gap-3.5 rounded-2xl px-4 py-3.5 text-sm leading-7 ${
                    condition.highlight
                      ? "bg-midori-soft/60 font-medium text-ink ring-1 ring-midori/40"
                      : "bg-cream text-ink-soft"
                  }`}
                >
                  <span
                    className={`mt-0.5 grid size-6 shrink-0 place-items-center rounded-full font-maru text-xs font-bold ${
                      condition.highlight
                        ? "bg-midori text-ink"
                        : "bg-brand-soft text-brand-deep"
                    }`}
                  >
                    {i + 1}
                  </span>
                  {condition.text}
                </li>
              ))}
            </ol>
            <p className="mt-5 text-xs leading-6 text-ink-mute">
              維持費の内容と、お支払いの方法・時期の詳細は、このあとの「維持費」「お支払い」でご案内します。
            </p>
          </Card>
        </div>
      </Section>

      {/* ③ 維持費（公開後に必要な重要事項のため大きく表示） */}
      <Section id="maintenance" className="scroll-mt-32 bg-paper">
        <SectionHeading
          title="公開後の維持費は月1,000円〜"
          description="サイトを公開し続けるために必要な費用です。小さな修正・更新や、困ったときの相談もサポートに含まれます。"
        />
        <div className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-3xl border-2 border-brand/60 bg-white shadow-lift">
          <div className="relative overflow-hidden bg-gradient-to-r from-brand to-sky-500 px-6 py-6 text-center sm:px-10">
            <p className="text-xs font-bold tracking-[0.2em] text-white/80">
              {maintenance.priceNote}
            </p>
            <p className="mt-1 font-maru text-2xl font-bold text-white sm:text-3xl">
              維持費（保守サポート費） {maintenance.price}
            </p>
          </div>
          <ul className="grid gap-3 p-6 sm:grid-cols-3 sm:p-8">
            {maintenance.items.map((item) => (
              <li
                key={item.title}
                className="rounded-2xl bg-cream p-5 text-left"
              >
                <p className="text-sm font-bold text-ink">{item.title}</p>
                <p className="mt-2 text-xs leading-6 text-ink-soft">
                  {item.body}
                </p>
              </li>
            ))}
          </ul>
          <div className="space-y-3 border-t border-line bg-cream/60 px-6 py-6 sm:px-8">
            <p className="flex items-start gap-2.5 text-sm leading-7 text-ink-soft">
              <span className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-brand-soft text-brand-dark">
                <CheckIcon className="size-3.5" />
              </span>
              {maintenance.hosting}
            </p>
            <p className="flex items-start gap-2.5 text-sm leading-7 text-ink-soft">
              <span className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-brand-soft text-brand-dark">
                <CheckIcon className="size-3.5" />
              </span>
              {maintenance.domain}
            </p>
            <p className="flex items-start gap-3 rounded-xl bg-midori-soft/70 px-4 py-3.5 text-xs leading-6 text-midori-dark ring-1 ring-midori/30">
              <span
                aria-hidden="true"
                className="shrink-0 text-sm font-bold leading-5"
              >
                ！
              </span>
              {maintenance.note}
            </p>
          </div>
        </div>
      </Section>

      {/* ④ お支払い */}
      <Section id="payment" className="scroll-mt-32 bg-cream">
        <SectionHeading
          title="支払い方法・時期"
          description="原則として制作開始前に全額をお支払いいただく前払いです。個別に合意した場合のみ、別の支払い条件をご案内します。"
        />
        <div className="mx-auto mt-10 grid max-w-4xl gap-6 md:grid-cols-2">
          <Card className="p-6 sm:p-7">
            <h3 className="flex items-center gap-2.5 font-maru text-lg font-bold text-ink">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand-deep">
                <CardIcon className="size-5" />
              </span>
              支払い方法
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm leading-7 text-ink-soft">
              <li className="flex items-center gap-2">
                <span className="rounded bg-midori-soft px-2 py-0.5 text-xs font-bold text-midori-dark">
                  振込
                </span>
                銀行振込（現行）
              </li>
              <li className="flex items-center gap-2">
                <span className="rounded bg-brand-soft px-2 py-0.5 text-xs font-bold text-brand-deep">
                  準備中
                </span>
                クレジットカード決済（決済代行サービス導入後に開始）
              </li>
            </ul>
          </Card>
          <Card className="p-6 sm:p-7">
            <h3 className="flex items-center gap-2.5 font-maru text-lg font-bold text-ink">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-midori-soft text-midori-dark">
                <ClockIcon className="size-5" />
              </span>
              支払い時期
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm leading-7 text-ink-soft">
              <li className="flex items-start gap-2.5">
                <span
                  aria-hidden="true"
                  className="mt-3 size-1.5 shrink-0 rounded-full bg-brand"
                />
                原則前払い：制作開始前にお見積り金額の全額
              </li>
              <li className="flex items-start gap-2.5">
                <span
                  aria-hidden="true"
                  className="mt-3 size-1.5 shrink-0 rounded-full bg-brand"
                />
                個別条件：分割払いなどは事前の合意がある場合のみ適用
              </li>
            </ul>
          </Card>
        </div>
        {/* 料金以外にかかる費用 */}
        <div className="mx-auto mt-6 max-w-4xl rounded-2xl border border-line bg-white px-6 py-5 shadow-card">
          <p className="text-sm font-bold text-ink">その他にかかる費用</p>
          <ul className="mt-3 grid gap-2 text-sm leading-7 text-ink-soft sm:grid-cols-2">
            {extraCosts.map(([label, value]) => (
              <li key={label} className="flex items-start gap-2.5">
                <span
                  aria-hidden="true"
                  className="mt-3 size-1.5 shrink-0 rounded-full bg-ink-mute"
                />
                <span>
                  {label}：<span className="font-bold text-ink">{value}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* 料金の相談CTA */}
      <Section className="bg-cream">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-brand to-brand-dark px-6 py-12 text-center shadow-lift sm:px-10">
          <div
            aria-hidden="true"
            className="aurora pointer-events-none absolute -right-20 -top-28 size-72 opacity-40"
          />
          <div
            aria-hidden="true"
            className="glow-amber pointer-events-none absolute -bottom-24 -left-12 size-56 opacity-50"
          />
          <span
            aria-hidden="true"
            className="absolute left-[14%] top-8 size-2.5 rounded-full bg-midori"
          />
          <span
            aria-hidden="true"
            className="absolute right-[18%] top-12 size-2 rounded-full bg-white/80"
          />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="font-maru text-2xl font-bold tracking-tight text-white">
              料金で迷ったら、まずはご相談を
            </h2>
            <p className="mt-3 text-sm leading-7 text-white/75">
              付け足しの組み合わせや予算のご相談は無料です。作りたいサイトをお聞かせください。必要な内容だけをご提案します。
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <ButtonLink
                href="/contact"
                variant="accent"
                size="lg"
                className="flex-1"
              >
                無料で相談する
              </ButtonLink>
              <ButtonLink
                href="/apply"
                variant="secondary"
                size="lg"
                className="flex-1"
              >
                お申し込みへ
              </ButtonLink>
            </div>
          </div>
        </div>
      </Section>

      <p className="sr-only">
        <Link href="/">ホーム</Link>
      </p>
    </div>
  );
}
