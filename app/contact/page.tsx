import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { PageHeader } from "@/components/PageHeader";
import { ChatIcon, ClockIcon, MailIcon } from "@/components/icons";
import { Container, Section, SectionHeading } from "@/components/ui";
import { site } from "@/lib/site";

export const metadata = {
  title: "お問い合わせ",
  description:
    "ホームページ制作のお問い合わせは、メールフォームまたはチャットで受け付けています。返信目安は2〜3営業日以内です。",
};

export default function ContactPage() {
  return (
    <div className="flex flex-col">
      <PageHeader
        eyebrow="お問い合わせ"
        title="メール・チャットにて、ご相談受付中"
        description="24時間いつでも送信できます。お電話での対応は行っておりませんので、ご了承ください。"
      />

      {/* メールフォーム */}
      <Section className="bg-paper">
        <SectionHeading
          eyebrow="メールでのお問い合わせ"
          title="お問い合わせフォーム"
        />
        <div className="mx-auto mt-8 max-w-2xl rounded-3xl border border-ink/10 bg-white p-8 shadow-sm">
          <ContactForm />
        </div>
      </Section>

      {/* チャット */}
      <Section id="chat" className="bg-cream">
        <SectionHeading
          eyebrow="チャットでのお問い合わせ"
          title="画面右下のチャットで、今すぐ相談"
          description="開いている画面に吹き出しボタンがあります。そちらからチャットをご利用ください。"
        />
        <Container>
          <div className="mx-auto mt-8 max-w-2xl rounded-3xl border border-ink/10 bg-white p-8 text-center shadow-sm">
            <ChatIcon className="mx-auto size-12 text-brand" />
            <p className="mt-4 text-sm leading-7 text-ink-soft">
              チャットでのやり取りは、Googleアカウントのログイン（匿名でもOK）で保存されます。
              担当者は営業時間内に順次お返事します。
            </p>
            <p className="mt-2 text-xs leading-6 text-ink-mute">
              ※現在チャット機能は設定準備中のため、フォームをご利用ください。
            </p>
          </div>
        </Container>
      </Section>

      <Section className="bg-paper py-12">
        <p className="text-center text-sm text-ink-soft">
          運営：{site.name}（{site.operator.office}）／
          <Link
            href="/operator"
            className="font-bold text-brand hover:text-brand-deep"
          >
            運営者情報はこちら
          </Link>
        </p>
      </Section>
    </div>
  );
}
