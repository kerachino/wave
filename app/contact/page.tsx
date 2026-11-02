import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { PageHeader } from "@/components/PageHeader";
import { ArrowIcon, ChatIcon } from "@/components/icons";
import { Container, Section, SectionHeading } from "@/components/ui";
import { site } from "@/lib/site";

export const metadata = {
  title: "お問い合わせ",
  description:
    "ホームページ制作のお見積もり依頼はチャットから、その他のお問い合わせはメールフォームから受け付けています。返信目安は2〜3営業日以内です。",
};

export default function ContactPage() {
  const headerDescription =
    "お見積もり依頼等、画面右下のチャットからお気軽にお問い合わせください。";

  const chatDescription =
    "見積もり依頼や制作のご相談は、画面右下のチャットからお気軽にご相談ください。";

  const formDescription =
    "その他のお問い合わせ（資料請求・取材・パートナーシップ等）は、以下のメールフォームよりお願いいたします。";

  return (
    <div className="flex flex-col">
      <PageHeader
        eyebrow="Contact"
        title="お問い合わせ"
        description={headerDescription}
      />

      {/* チャットでのお問い合わせ */}
      <Section className="bg-cream">
        <SectionHeading
          eyebrow="チャットでのお問い合わせ"
          title="画面右下のチャットで、今すぐ相談"
          description={chatDescription}
        />
        <div className="mx-auto mt-10 max-w-2xl rounded-3xl border border-line bg-white p-8 sm:p-12 shadow-card text-center">
          <ChatIcon className="mx-auto size-12 text-brand" />
          <p className="mt-4 text-sm leading-7 text-ink-soft">
            担当者が営業時間内に順次お返事します。
          </p>
          <p className="mt-3 text-xs leading-6 text-ink-mute">
            原則ブラウザを閉じても会話履歴は保存されますが、ログインしていただくと、
            他の端末でも履歴を引き継ぐことができます。
          </p>
          <Link
            href="/login?next=/contact"
            className="mt-5 inline-flex rounded-full bg-brand px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-dark"
          >
            Googleログインして相談する
          </Link>
          <p className="mt-2 text-xs font-bold text-brand-deep">
            💡 お見積もり依頼はチャットからどうぞ
          </p>
        </div>
      </Section>

      {/* メールフォーム */}
      <Section className="bg-paper">
        <SectionHeading
          eyebrow="メールでのお問い合わせ"
          title="お問い合わせフォーム"
          description={formDescription}
        />
        <div className="mx-auto mt-10 max-w-3xl rounded-3xl border border-line bg-white p-8 sm:p-12 shadow-card">
          <ContactForm />
        </div>
      </Section>

      {/* 運営情報・返信について */}
      <Section id="contact-info" className="bg-paper py-14 sm:py-20">
        <Container>
          <div className="mx-auto max-w-2xl grid gap-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-4">
              <p className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-3.5 py-1 text-xs font-bold tracking-[0.16em] text-brand-deep ring-1 ring-inset ring-brand/20">
                <span
                  aria-hidden="true"
                  className="size-1.5 rounded-full bg-midori"
                />
                返信について
              </p>
              <h3 className="font-maru text-lg font-bold text-ink">
                通常2〜3営業日以内にご返信します
              </h3>
              <p className="text-sm leading-7 text-ink-soft">
                土日祝日を挟む場合は、翌営業日以降のご返信となる場合がございます。
                自動返信メールが届かない場合は、迷惑メールフォルダをご確認ください。
              </p>
            </div>
            <div className="rounded-3xl border border-line bg-white p-6 sm:p-8 shadow-card">
              <p className="text-xs font-bold tracking-wider text-ink-mute">
                運営
              </p>
              <p className="mt-1 font-maru text-lg font-bold text-ink">
                {site.name}
              </p>
              <p className="mt-2 text-sm leading-7 text-ink-soft">
                {site.operator.office}
              </p>
              <Link
                href="/operator"
                className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-brand px-5 py-2.5 text-xs font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-brand-dark"
              >
                運営者情報はこちら <ArrowIcon className="size-3.5" />
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
