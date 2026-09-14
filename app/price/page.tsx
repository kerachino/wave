import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { PriceCards } from "@/components/PriceCards";
import { ButtonLink, Card, Section, SectionHeading } from "@/components/ui";
import { maintenance } from "@/lib/site";

export const metadata = {
  title: "料金プラン・制作の流れ",
  description:
    "ホームページ制作は基本プラン5,500円（税込）＋必要な付け足しだけ。公開後の維持費は月1,000円〜（任意）。申し込みから公開までの流れもご案内します。",
};

// 制作の流れ（8ステップ）
const steps = [
  {
    title: "無料相談",
    body: "メールまたはチャットで、まずはお気軽にご相談ください。作りたいものや予算のお話だけでも大丈夫です。お返事は2〜3営業日以内。",
    note: "費用はかかりません",
  },
  {
    title: "ヒアリング・お見積り",
    body: "作りたいサイトのお話をうかがい、ページ構成・料金・スケジュールをまとめたお見積りをご提案します。ご納得いただけるまで何度でも調整OKです。",
    note: "見積り無料",
  },
  {
    title: "ご契約・お申し込み",
    body: "サイト内のお申し込みフォームから、Googleアカウントでログインのうえ必要事項を入力していただき、契約条件に同意してお申し込みいただきます。",
    note: "このサイトで完結",
  },
  {
    title: "着手金のお支払い",
    body: "お見積り金額の50%を着手金として銀行振込でお支払いいただきます。振込確認後、制作を開始します。（カード決済は準備中です）",
    note: "着手金 50%",
  },
  {
    title: "制作（途中確認）",
    body: "完成前にデザインや文章の確認をお願いします。進み具合も共有しながら、2回までは無料で修正対応いたします。",
    note: "こまめに共有",
  },
  {
    title: "公開・納品",
    body: "ご確認いただいた内容でサイトを公開し、管理に必要な資料をお渡しします。お客さまの手続きが必要な独自ドメインは、実費のみでお手伝いします。",
    note: "Netlify で公開",
  },
  {
    title: "残金のお支払い",
    body: "サイト公開・納品後に、残り50%をお支払いいただきます。安心してご確認いただけるよう、全額前払いはお願いしていません。",
    note: "残金 50%",
  },
  {
    title: "アフターサポート",
    body: "公開後も保守サポート費（月1,000円〜）で、小さな修正や更新、困ったときの相談を受け付けます。必要なければ任意です。",
    note: "月1,000円〜",
  },
];

const extraCosts: [string, string][] = [
  ["独自ドメイン（使う場合のみ）", "年間1,000円前後の実費"],
];

export default function PricePage() {
  return (
    <div className="flex flex-col">
      <PageHeader
        eyebrow="料金・制作の流れ"
        title="納得してから、お申し込みいただけます"
        description="最初にかかる制作費と、公開後にかかる維持費。申し込みから公開までの流れも、あわせてご案内します。"
      />

      {/* プラン表 */}
      <Section className="bg-paper">
        <SectionHeading
          eyebrow="制作費"
          title="基本プラン5,500円＋付け足し形式"
          description="まずは基本プラン5,500円（税込）。足りない分だけ、必要なものを付け足せます。合計はお見積りで確定します。"
        />
        <div className="mt-10">
          <PriceCards />
        </div>
      </Section>

      {/* 基本プランの条件 */}
      <Section className="bg-cream">
        <SectionHeading eyebrow="基本プランについて" title="基本5,500円の条件" />
        <div className="mx-auto mt-8 max-w-3xl">
          <Card className="p-6">
            <p className="text-sm leading-7 text-ink-soft">
              基本プランは、初めての実績づくりのための
              <span className="font-bold text-ink">モニター価格</span>です。
              以下の条件をご了承のうえお申し込みください。
            </p>
            <ul className="mt-4 space-y-2.5">
              {[
                "モニター期間中は、制作したサイトを「制作事例」として掲載させていただきます",
                "公開後のクチコミ・口コミへのご協力をお願いします",
                "お申し込み状況により、お断りする場合があります",
                "先着順の受付となります",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm leading-6 text-ink-soft">
                  <span className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-brand-soft text-xs text-brand-deep">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </Section>
      {/* 制作の流れ（8ステップ） */}
      <Section id="flow" className="bg-paper">
        <SectionHeading
          eyebrow="制作の流れ"
          title="申し込みから公開まで、8つのステップ"
          description="「どこまで進んでいるのか」がいつも分かるように、各ステップでこまめにご連絡します。"
        />
        <ol className="mx-auto mt-12 max-w-3xl">
          {steps.map((step, i) => (
            <li key={step.title} className="relative flex gap-5 pb-10 last:pb-0">
              {/* 縦線 */}
              {i < steps.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute left-[1.35rem] top-14 h-[calc(100%-2rem)] w-px bg-brand/30"
                />
              )}
              <span className="relative z-10 grid size-11 shrink-0 place-items-center rounded-xl bg-brand font-maru text-lg font-bold text-white shadow-soft">
                {i + 1}
              </span>
              <div className="flex-1 rounded-3xl border border-ink/10 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-maru text-lg font-bold text-ink">
                    {step.title}
                  </h3>
                  <span className="rounded-full bg-cream-deep px-3 py-0.5 text-xs font-bold text-brand-deep">
                    {step.note}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-7 text-ink-soft">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {/* かかる期間の目安 */}
      <Section className="bg-cream">
        <SectionHeading
          eyebrow="かかる期間の目安"
          title="最短2週間〜の制作"
        />
        <div className="mx-auto mt-8 grid max-w-4xl gap-6 md:grid-cols-3">
          {[
            ["基本プラン（1ページ）", "約2〜3週間", "まずは1ページを公開"],
            ["3〜5ページ", "約3〜4週間", "ページ追加を組み合わせた定番サイト"],
            ["6ページ以上・機能追加", "約4〜6週間", "フォーム・ブログなどを付け足した場合"],
          ].map(([name, time, body]) => (
            <div key={name} className="rounded-3xl border border-ink/10 bg-white p-6 text-center shadow-sm">
              <p className="text-sm font-bold text-brand-deep">{name}</p>
              <p className="mt-2 font-maru text-2xl font-bold text-ink">{time}</p>
              <p className="mt-2 text-sm leading-6 text-ink-soft">{body}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-sm text-ink-soft">
          内容やご連絡のタイミングによって前後します。納期はお見積りの時点でお約束します。
        </p>
      </Section>

      {/* 維持費：重要事項のため分かりやすく大きく */}
      <Section className="bg-paper">
        <SectionHeading
          eyebrow="★ 公開後にかかる費用（重要）"
          title={`維持費は${maintenance.price}だけ`}
        />
        <p className="mx-auto mt-4 max-w-3xl text-center text-sm leading-8 text-ink-soft">
          {maintenance.lead}
        </p>
        <div className="mx-auto mt-8 max-w-3xl overflow-hidden rounded-3xl border-2 border-brand/60 bg-white shadow-lift">
          <div className="bg-gradient-to-r from-brand to-sky-500 px-6 py-6 text-center sm:px-10">
            <p className="text-xs font-bold tracking-[0.2em] text-white/80">
              {maintenance.priceNote}
            </p>
            <p className="mt-1 font-maru text-3xl font-bold text-white sm:text-4xl">
              保守サポート費 {maintenance.price}
            </p>
            <p className="mt-2 text-xs leading-6 text-white/80">
              加入しなくてもサイトはそのまま使えます
            </p>
          </div>
          <ul className="grid gap-3 p-6 sm:grid-cols-3 sm:p-8">
            {maintenance.items.map((item) => (
              <li
                key={item.title}
                className="rounded-2xl bg-cream p-5 text-left"
              >
                <p className="text-sm font-bold text-ink">{item.title}</p>
                <p className="mt-2 text-xs leading-6 text-ink-soft">{item.body}</p>
              </li>
            ))}
          </ul>
          <div className="space-y-3 border-t border-line bg-cream/60 px-6 py-6 sm:px-8">
            <p className="flex items-start gap-2 text-sm leading-7 text-ink-soft">
              <span aria-hidden="true" className="mt-1 text-midori-dark">✓</span>
              {maintenance.hosting}
            </p>
            <p className="flex items-start gap-2 text-sm leading-7 text-ink-soft">
              <span aria-hidden="true" className="mt-1 text-midori-dark">✓</span>
              {maintenance.domain}
            </p>
            <p className="rounded-xl bg-white px-4 py-3 text-xs leading-6 text-ink-soft ring-1 ring-line">
              {maintenance.note}
            </p>
          </div>
        </div>
      </Section>

      {/* 別途費用 */}
      <Section className="bg-cream">
        <SectionHeading eyebrow="別途費用" title="プランに含まれないもの" />
        <div className="mt-8 overflow-x-auto rounded-2xl border border-line bg-white shadow-card">
          <table className="w-full min-w-[32rem] border-collapse">
            <thead>
              <tr className="border-b border-ink/10 text-left">
                <th className="px-5 py-4 text-sm font-bold text-ink">項目</th>
                <th className="px-5 py-4 text-sm font-bold text-ink">費用の目安</th>
              </tr>
            </thead>
            <tbody>
              {extraCosts.map(([name, price]) => (
                <tr key={name} className="border-b border-ink/5 last:border-0">
                  <td className="px-5 py-4 text-sm font-medium text-ink">{name}</td>
                  <td className="px-5 py-4 text-sm text-ink-soft">{price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-center text-sm text-ink-soft">
          いずれもお見積りの時点で、金額を明確にお伝えします。
        </p>
      </Section>

      {/* お支払い */}
      <Section className="bg-paper">
        <SectionHeading eyebrow="お支払い" title="支払い方法・時期" />
        <div className="mx-auto mt-8 grid max-w-4xl gap-6 md:grid-cols-2">
          <Card className="p-6">
            <h3 className="font-maru text-lg font-bold text-ink">支払い方法</h3>
            <ul className="mt-3 space-y-2 text-sm leading-7 text-ink-soft">
              <li className="flex items-center gap-2">
                <span className="rounded bg-midori-soft px-2 py-0.5 text-xs font-bold text-midori-dark">振込</span>
                銀行振込（現行）
              </li>
              <li className="flex items-center gap-2">
                <span className="rounded bg-brand-soft px-2 py-0.5 text-xs font-bold text-brand-deep">準備中</span>
                クレジットカード決済（決済代行サービス導入後に開始）
              </li>
            </ul>
          </Card>
          <Card className="p-6">
            <h3 className="font-maru text-lg font-bold text-ink">支払い時期</h3>
            <ul className="mt-3 space-y-2 text-sm leading-7 text-ink-soft">
              <li>着手金：制作開始前にお見積り金額の50%</li>
              <li>残金：サイト公開・納品後に残り50%</li>
              <li>振込手数料はお客さま負担となります</li>
            </ul>
          </Card>
        </div>
      </Section>

      <Section className="bg-cream">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-brand to-brand-dark px-6 py-12 text-center shadow-lift sm:px-10">
          <div aria-hidden="true" className="aurora pointer-events-none absolute -right-20 -top-28 size-72 opacity-40" />
          <div aria-hidden="true" className="glow-amber pointer-events-none absolute -bottom-24 -left-12 size-56 opacity-50" />
          <span aria-hidden="true" className="absolute left-[14%] top-8 size-2.5 rounded-full bg-midori" />
          <span aria-hidden="true" className="absolute right-[18%] top-12 size-2 rounded-full bg-white/80" />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="font-maru text-2xl font-bold tracking-tight text-white">付け足し内容で迷ったら</h2>
            <p className="mt-3 text-sm leading-7 text-white/75">
              無料相談で、作りたいサイトと予算をお聞かせください。必要な付け足しだけをご提案します。
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/contact" variant="accent" size="lg" className="flex-1">
                無料で相談する
              </ButtonLink>
              <ButtonLink href="/apply" variant="secondary" size="lg" className="flex-1">
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