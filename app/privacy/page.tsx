import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Container, Section } from "@/components/ui";
import { site } from "@/lib/site";

export const metadata = {
  title: "プライバシーポリシー",
  description:
    "ハトノコネクトのプライバシーポリシーです。個人情報の取得・利用目的・第三者提供・外部サービスの利用など、取り扱い方針をご説明します。",
};

const sections: [string, string][] = [
  [
    "1. 個人情報の定義",
    "本ポリシーにおいて「個人情報」とは、お名前・メールアドレス・電話番号・会社名など、お問い合わせやお申し込みの際にご利用者さまからご提供いただく情報、および Google ログイン（アカウントID・氏名・メールアドレス）により取得する、特定の個人を識別できる情報をいいます。チャットでのご相談内容もこれに含みます。",
  ],
  [
    "2. 個人情報の取得",
    "当サービスでは、以下の場面で個人情報を取得します。\n・お問い合わせフォームのご利用時\n・お申し込み・ご契約時\n・Google ログイン（アカウント認証）時\n・チャットでのご相談時\n・メールでのご連絡時",
  ],
  [
    "3. 利用目的",
    "取得した個人情報は、以下の目的のみに利用します。\n・お問い合わせ・ご相談への対応\n・見積りの作成・ご提示\n・ご契約および制作・納品・お支払いの連絡\n・保守サポートの提供\n・アカウント認証（Google ログイン）\n・関連するご案内（ご同意いただいた場合のみ）",
  ],
  [
    "4. 第三者提供",
    "ご提供いただいた個人情報は、法令に基づく場合、およびお支払い手続きに必要な範囲で決済代行会社へ提供する場合（導入後）を除き、ご利用者さまの同意なく第三者に提供・開示いたしません。",
  ],
  [
    "5. 外部サービスの利用",
    "当サービスは、メール送信（SMTP）、アカウント認証（Firebase Authentication）、チャットの保存（Firestore）、サイトのホスティング（Netlify）などの外部サービスを利用しています。これらの外部サービスには、機能の提供に必要な範囲で情報を取り扱う場合があります。各サービスでの個人情報の取り扱いは、各事業者のポリシーをご確認ください。",
  ],
  [
    "6. 情報の保管",
    "お問い合わせ・お申し込み情報は、当サービスの運営に必要な範囲で保管します。チャットのやり取りは、チャット機能の提供に必要な範囲で保存されます。保管にあたっては、外部サービスの利用を含め、適切な安全管理措置を講じます。",
  ],
  [
    "7. Cookie・ログ情報",
    "当サービスでは、サイトの利便性向上のため Cookie やアクセスログを取得する場合があります。収集を望まない場合は、ブラウザの設定で Cookie を無効化できます。",
  ],
  [
    "8. 開示・訂正・削除",
    "ご利用者さまご自身の個人情報について、開示・訂正・削除をご希望される場合は、ご本人確認のうえ合理的な範囲で対応いたします。ご希望の場合はお問い合わせフォームよりご連絡ください。",
  ],
  [
    "9. 未成年者の個人情報",
    "18歳未満の方が個人情報をご提供される場合は、保護者等の同意を得たうえでご提供ください。",
  ],
  [
    "10. お問い合わせ窓口",
    `個人情報のお取り扱いに関するお問い合わせは、${site.email}（またはお問い合わせフォーム）にて受け付けています。`,
  ],
  [
    "11. ポリシーの変更",
    "本ポリシーの内容は、法令の変更やサービスの改善に伴い、予告なく変更することがあります。変更後の内容は、本サイトに掲載した時点から適用されます。",
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
          ハトノコネクト（以下「当サービス」といいます）は、ご利用者さまから
          お預かりする個人情報を適切に取り扱うため、以下のとおりプライバシーポリシーを定めます。
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
          制定日：2026年9月16日 ／ 最終改定：2026年9月16日
        </p>
      </Section>

      <Container className="py-12">
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-8">
          <Link
            href="/terms"
            className="text-sm font-bold text-brand hover:text-brand-deep"
          >
            利用規約を見る →
          </Link>
          <Link
            href="/law"
            className="text-sm font-bold text-brand hover:text-brand-deep"
          >
            特定商取引法に基づく表記を見る →
          </Link>
        </div>
      </Container>

      <p className="sr-only">
        <Link href="/">ホーム</Link>
      </p>
    </div>
  );
}