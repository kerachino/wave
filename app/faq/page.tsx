import Link from "next/link";
import { FaqAccordion } from "@/components/FaqAccordion";
import { PageHeader } from "@/components/PageHeader";
import { ButtonLink, Section } from "@/components/ui";

export const metadata = {
  title: "よくある質問",
  description:
    "ホームページ制作に関するよくあるご質問をまとめました。費用、原稿、公開後の更新、支払い方法など。",
};

const faqs = [
  {
    q: "費用はいくらかかりますか？",
    a: "基本プラン5,500円（税込）に、必要な付け足しだけを組み合わせます。例えば3ページの定番サイトなら15,500円〜、5ページ＋フォーム付きなら30,500円〜が目安です。相場は10〜30万円といわれていますが、1人制作の小回りでこの価格に抑えています。公開後の維持費は月1,000円〜（任意・いつでも解約OK）だけです。加入しなくてもサイトはそのまま使えます。",
  },
  {
    q: "付け足しオプションには何がありますか？",
    a: "ページ追加（1ページ5,000円〜）、お問い合わせフォーム設置（5,000円〜）、原稿作成サポート（1ページ3,000円〜）、写真撮影・画像調整（1回10,000円〜）、ブログ・お知らせ更新機能（10,000円〜）、修正3回目以降（1回3,000円〜）があります。詳しくは料金ページをご覧ください。",
  },
  {
    q: "維持費は必ず払わないといけませんか？",
    a: "いいえ、維持費（保守サポート費・月1,000円〜）は任意です。加入すると小さな修正・更新（月1回程度）、表示・セキュリティの見守り、困ったときの相談が受けられます。加入しない場合もサイトはそのまま使え、サーバー代は無料です。独自ドメインを使う場合のみ年間1,000円前後の実費がかかります。",
  },
  {
    q: "原稿がなくても大丈夫ですか？",
    a: "大丈夫です。ヒアリングでお店や会社のお話をうかがい、ページの構成案と文章のたたき台をご提案します。原稿の下書き作成は別途オプション（1ページ3,000円〜）でも承ります。",
  },
  {
    q: "公開後の更新や修正はどうすればいいですか？",
    a: "保守サポート費（月1,000円〜）にご加入いただくと、小さな修正・更新を月に1回程度まで対応いたします。公開後に内容を変えたいときは、メール・チャットでご依頼ください。",
  },
  {
    q: "支払い方法は？",
    a: "現在は銀行振込でのお支払いです。着手金（50%）を制作開始前に、残金（50%）を公開・納品後にお願いしています。クレジットカード決済（決済代行）は準備中のため、導入後にこのページでご案内します。",
  },
  {
    q: "電話での相談はできますか？",
    a: "申し訳ありません。電話での対応は行っておりません。メールまたはチャットで、24時間いつでもお気軽にご相談ください。お返事は2〜3営業日以内を目安としています。",
  },
  {
    q: "独自ドメインは必要ですか？",
    a: "必須ではありません。最初は無料のアドレス（例：〇〇.netlify.app）で公開し、後から独自ドメイン（例：〇〇.com）に変更することもできます。独自ドメインをご希望の場合は、取得と設定をお手伝いします（年間1,000円前後の実費のみ）。",
  },
];

export default function FaqPage() {
  return (
    <div className="flex flex-col">
      <PageHeader
        eyebrow="よくある質問"
        title="申し込む前に、知っておきたいこと"
        description="ぱっと見てわかるように、よくいただくご質問をまとめました。"
      />

      <Section className="bg-paper">
        <div className="mx-auto max-w-3xl">
          <FaqAccordion items={faqs} />
        </div>
      </Section>

      <Section className="bg-cream py-14">
        <div className="mx-auto max-w-2xl rounded-3xl border border-ink/10 bg-white p-8 text-center shadow-sm">
          <h2 className="font-maru text-xl font-bold text-ink">
            それでも気になることがあれば
          </h2>
          <p className="mt-3 text-sm leading-7 text-ink-soft">
            どんな小さな質問でも歓迎です。メール・チャットでお気軽にどうぞ。
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/contact" variant="primary" className="flex-1">
              お問い合わせする
            </ButtonLink>
            <ButtonLink href="/price" variant="secondary" className="flex-1">
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