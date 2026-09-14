import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/ui";
import { site } from "@/lib/site";

export const metadata = {
  title: "プライバシーポリシー",
  description:
    "ハトノコネクト（ハトノコネクト）のプライバシーポリシーです。個人情報の取り扱いについてご説明します。",
};

const sections: [string, string][] = [
  [
    "1. 個人情報の定義",
    "本ポリシーにおいて「個人情報」とは、お名前・メールアドレス・電話番号・会社名など、お問い合わせやお申し込みの際にお客さまからご提供いただく、特定の個人を識別できる情報をいいます。",
  ],
  [
    "2. 個人情報の取得",
    "当サービスでは、以下の場面で個人情報を取得します。\n・お問い合わせフォームのご利用時\n・お申し込み・ご契約時\n・チャットでのご相談時\n・メールでのご連絡時",
  ],
  [
    "3. 利用目的",
    "取得した個人情報は、以下の目的のみに利用します。\n・お問い合わせ・ご相談への対応\n・見積りの作成・ご提示\n・ご契約および制作・納品の連絡\n・保守サポートの提供\n・関連するご案内（ご同意いただいた場合のみ）",
  ],
  [
    "4. 第三者提供",
    "ご提供いただいた個人情報は、法令に基づく場合を除き、お客さまの同意なく第三者に提供・開示いたしません。",
  ],
  [
    "5. 情報の保管",
    "お問い合わせ・お申し込み情報は、当サービスの運営に必要な範囲で保管します。保管にあたっては、外部サービスの利用を含め、適切な安全管理措置を講じます。",
  ],
  [
    "6. 開示・訂正・削除",
    "お客さまご自身の個人情報について、開示・訂正・削除をご希望される場合は、ご本人確認のうえ合理的な範囲で対応いたします。ご希望の場合はお問い合わせフォームよりご連絡ください。",
  ],
  [
    "7. お問い合わせ窓口",
    `個人情報のお取り扱いに関するお問い合わせは、${site.email}（またはお問い合わせフォーム）にて受け付けています。`,
  ],
  [
    "8. ポリシーの変更",
    "本ポリシーの内容は、法令の変更やサービスの改善に伴い、予告なく変更することがあります。",
  ],
];

export default function PrivacyPage() {
  return (
    <div className="flex flex-col">
      <PageHeader
        eyebrow="個人情報の取り扱い"
        title="プライバシーポリシー"
        description="お客さまの個人情報を、安心して預けていただけるように。取り扱い方針を以下のとおり定めます。"
      />

      <Section className="bg-paper">
        <p className="mx-auto max-w-2xl text-left text-sm leading-7 text-ink-soft">
          ハトノコネクト（以下「当サービス」）は、お客さまからお預かりする個人情報を
          適切に取り扱うため、以下のとおりプライバシーポリシーを定めます。
        </p>
        <div className="mx-auto mt-8 max-w-3xl">
          <div className="space-y-4">
            {sections.map(([title, body]) => (
              <div key={title} className="rounded-2xl border border-ink/10 bg-white p-6 shadow-sm">
                <h2 className="font-maru text-base font-bold text-ink">{title}</h2>
                <p className="mt-3 whitespace-pre-line text-sm leading-7 text-ink-soft">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
        <p className="mx-auto mt-8 max-w-2xl text-center text-xs text-ink-mute">
          制定日：2024年6月1日 ／ 最終改定：2024年6月1日
        </p>
      </Section>

      <p className="sr-only">
        <Link href="/">ホーム</Link>
      </p>
    </div>
  );
}