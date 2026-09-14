import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { ButtonLink, Card, Section, SectionHeading } from "@/components/ui";

export const metadata = {
  title: "サービス内容",
  description:
    "LP・コーポレートサイト・店舗サイトなど、ホームページ制作の対応内容をご紹介します。標準でスマホ対応。",
};

const targetTypes = [
  {
    title: "LP（ランディングページ）",
    body: "商品・キャンペーンを1枚のページでしっかり伝えたい方に。お申し込みや問い合わせまでの導線を整理します。",
  },
  {
    title: "コーポレートサイト",
    body: "会社の顔となるサイト。実績・採用・事業内容など、企業としての信頼を1つのサイトにまとめます。",
  },
  {
    title: "店舗サイト",
    body: "営業時間・アクセス・メニュー・写真など、お客さまが知りたい情報を分かりやすく。スマホで見るお客さまを意識します。",
  },
];

export default function ServicePage() {
  return (
    <div className="flex flex-col">
      <PageHeader
        eyebrow="サービス内容"
        title="何をどこまでやるか、をはっきりと"
        description="「どこまでお願いできるの？」を不安に思う方へ。対応できること・できないことを、正直にご案内します。"
      />

      {/* 対応できるサイト */}
      <Section className="bg-paper">
        <SectionHeading
          eyebrow="対応できるサイト"
          title="こんなホームページが作れます"
        />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {targetTypes.map((t) => (
            <Card key={t.title} className="p-6">
              <h3 className="font-maru text-lg font-bold text-ink">{t.title}</h3>
              <p className="mt-3 text-sm leading-7 text-ink-soft">{t.body}</p>
            </Card>
          ))}
        </div>
        <div className="mt-8 rounded-3xl border border-midori/30 bg-midori-soft p-6">
          <p className="text-sm font-bold text-midori-dark">標準で対応すること</p>
          <p className="mt-2 text-sm leading-7 text-midori-dark">
            どのサイトも「スマホ対応」が標準です。スマホ・タブレット・パソコンの
            どれで見ても、読みやすくきれいに表示されます。
          </p>
        </div>
      </Section>

      {/* 含まれないもの */}
      <Section className="bg-cream">
        <SectionHeading
          eyebrow="含まれないもの"
          title="基本料金に含まれないもの"
          description="あらかじめ知っておくことで「あれも入ってると思った」がなくなります。"
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["原稿作成", "サイトに載せる文章の作成は含まれません。ヒアリングをもとに構成案はご提案します。"],
            ["写真撮影", "お店や商品の写真撮影は含まれません。ご用意いただくか、別途オプションで承ります。"],
            ["独自ドメイン", "「〇〇.com」のような独自ドメインは実費（年1,000円前後）で取得をお手伝いします。"],
            ["デザインの大幅変更", "公開後の大幅なレイアウト変更は別途お見積り。小さな修正は保守サポートで対応します。"],
          ].map(([title, body]) => (
            <Card key={title} className="p-5">
              <h3 className="text-base font-bold text-ink">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-ink-soft">{body}</p>
            </Card>
          ))}
        </div>

        <div className="mt-10 rounded-3xl border border-ink/10 bg-white p-8">
          <h2 className="font-maru text-xl font-bold text-ink">
            場合によっては対応します（ご相談ください）
          </h2>
          <p className="mt-3 text-sm leading-7 text-ink-soft">
            原稿の下書き作成や、素材の準備（ロゴ・写真の整理）など、
            できる範囲で柔軟に対応いたします。「これはやってもらえるの？」と
            思ったことは、遠慮なくご相談ください。
          </p>
          <p className="mt-3 text-sm leading-7 text-ink-soft">
            対応の可否と追加料金は、お見積りの時点で明確にお伝えします。
          </p>
        </div>
      </Section>

      {/* 公開方法 */}
      <Section className="bg-paper">
        <SectionHeading
          eyebrow="公開方法"
          title="公開・ホスティングは無料のサービスを利用"
        />
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Card className="p-6">
            <h3 className="font-maru text-lg font-bold text-ink">
              Netlify（無料ホスティング）
            </h3>
            <p className="mt-3 text-sm leading-7 text-ink-soft">
              サイトを公開するためのサーバーには、無料で利用できる
              Netlify（ネットリファイ）を使います。公開後の維持費は、
              保守サポート費の月1,000円〜のみです。
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="font-maru text-lg font-bold text-ink">
              独自ドメインは実費
            </h3>
            <p className="mt-3 text-sm leading-7 text-ink-soft">
              「〇〇.com」のような独自ドメインは、お客さま名義で取得し、
              年間費用（年1,000円前後）は実費をご負担いただきます。
              取得のお手伝いもいたします。
            </p>
          </Card>
        </div>
      </Section>

      <Section className="bg-ink py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-maru text-2xl font-bold text-white">
            まずは気になることをお聞かせください
          </h2>
          <p className="mt-3 text-sm leading-7 text-white/80">
            「うちのサイトは作れますか？」も大歓迎です。お返事は2〜3営業日以内。
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/contact" variant="primary" size="lg" className="flex-1">
              お問い合わせする
            </ButtonLink>
            <ButtonLink href="/price" variant="secondary" size="lg" className="flex-1">
              料金プランを見る
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