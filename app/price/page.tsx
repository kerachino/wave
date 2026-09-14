import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { PriceCards } from "@/components/PriceCards";
import { ButtonLink, Card, Section, SectionHeading } from "@/components/ui";

export const metadata = {
  title: "料金プラン",
  description:
    "ホームページ制作の料金プランをご案内します。お試し5,500円〜、ライト55,000円〜、スタンダード110,000円〜。",
};

const extraCosts = [
  ["ページ追加", "1ページ 5,000円〜（プランにより異なります）"],
  ["原稿作成", "1ページ 3,000円〜（目安）"],
  ["写真撮影", "1回 10,000円〜（出張・人数により異なります）"],
  ["修正（2回目以降）", "1回 3,000円〜（プランにより異なります）"],
];

export default function PricePage() {
  return (
    <div className="flex flex-col">
      <PageHeader
        eyebrow="料金プラン"
        title="納得してから、お申し込みいただけます"
        description="最初にかかる制作費と、公開後にかかる維持費。かかるお金を、できるだけはっきりお示しします。"
      />

      {/* プラン表 */}
      <Section className="bg-paper">
        <SectionHeading
          eyebrow="制作費"
          title="3つのプランからお選びいただけます"
          description="プランはあくまで目安です。ページ数や機能に合わせて、お見積りで柔軟に調整します。"
        />
        <div className="mt-10">
          <PriceCards />
        </div>
      </Section>

      {/* お試しプランの条件 */}
      <Section className="bg-cream">
        <SectionHeading eyebrow="お試しプランについて" title="お試し5,500円〜の条件" />
        <div className="mx-auto mt-8 max-w-3xl">
          <Card className="p-6">
            <p className="text-sm leading-7 text-ink-soft">
              お試しプランは、初めての実績づくりのための
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
      {/* 維持費 */}
      <Section className="bg-paper">
        <SectionHeading eyebrow="公開後にかかる費用" title="維持費は月1,000円〜" />
        <div className="mx-auto mt-8 grid max-w-4xl gap-6 md:grid-cols-2">
          <Card className="p-6">
            <h3 className="font-maru text-lg font-bold text-ink">保守サポート費 月1,000円〜</h3>
            <p className="mt-2 text-sm leading-7 text-ink-soft">
              サイト公開後より、以下のサポートをお受けいただけます。
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-7 text-ink-soft">
              <li>小さな修正・更新の対応（月に1回程度）</li>
              <li>セキュリティや表示の確認</li>
              <li>困ったときの相談</li>
            </ul>
          </Card>
          <Card className="p-6">
            <h3 className="font-maru text-lg font-bold text-ink">ホスティング・ドメイン</h3>
            <p className="mt-2 text-sm leading-7 text-ink-soft">
              サイトを置くサーバー（Netlify）は無料です。
              独自ドメインをお使いの場合のみ、年間費用（年1,000円前後）が実費でかかります。
            </p>
          </Card>
        </div>
      </Section>

      {/* 別途費用 */}
      <Section className="bg-cream">
        <SectionHeading eyebrow="別途費用" title="プランに含まれないもの" />
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[32rem] border-collapse rounded-2xl bg-white shadow-sm">
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

      <Section className="bg-ink py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-maru text-2xl font-bold text-white">どのプランにするか、迷ったら</h2>
          <p className="mt-3 text-sm leading-7 text-white/80">
            無料相談で、作りたいサイトと予算をお聞かせください。ぴったりのプランをご提案します。
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/contact" variant="primary" size="lg" className="flex-1">
              無料で相談する
            </ButtonLink>
            <ButtonLink href="/apply" variant="secondary" size="lg" className="flex-1">
              お申し込みへ
            </ButtonLink>
          </div>
        </div>
      </Section>

      <p className="sr-only">
        <Link href="/">ホーム</Link>
      </p>
    </div>
  );
}