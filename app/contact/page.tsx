import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { PageHeader } from "@/components/PageHeader";
import { ArrowIcon, ChatIcon, ClockIcon, MailIcon } from "@/components/icons";
import { Section, SectionHeading } from "@/components/ui";
import { site } from "@/lib/site";

export const metadata = {
  title: "お問い合わせ",
  description:
    "ホームページ制作のご相談・お見積もりはチャットからお気軽にどうぞ。資料請求などはメールフォームでも受け付けています。",
};

export default function ContactPage() {
  return (
    <div className="flex flex-col">
      <PageHeader
        eyebrow="Contact"
        title="お問い合わせ"
        description="ホームページ制作のご相談・お見積もりは、チャットからお気軽にお問い合わせください。"
      />

      <Section className="bg-cream">
        {/* <div className="grid gap-8 lg:grid-cols-[1fr_0.85fr] lg:items-end">
          <SectionHeading
            eyebrow=""
            title="相談・お見積もりはチャットが便利です"
            description="ご希望や状況をお気軽にお聞かせください。"
            center={false}
          />
        </div> */}
        <div className="mt-0 grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="relative overflow-hidden rounded-3xl bg-brand p-7 text-white shadow-lift sm:p-10">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-10 -top-14 size-56 rounded-full border-[32px] border-white/10"
            />
            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold">
                <ChatIcon className="size-4" />
                チャット
              </span>
              <h2 className="mt-5 font-maru text-2xl font-bold leading-relaxed sm:text-3xl">
                画面右下のチャットから
                <br className="hidden sm:block" />
                いつでもご相談いただけます
              </h2>
              {/* <p className="mt-3 max-w-xl text-sm leading-7 text-white/85">
                お見積もり前のご質問だけでも大丈夫。
              </p> */}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/contact#chat"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-brand-deep shadow-card transition-all hover:-translate-y-0.5 hover:bg-brand-soft"
                >
                  <ChatIcon className="size-4" />
                  チャットで相談する
                  <ArrowIcon className="size-4" />
                </Link>
                <Link
                  href="/login?next=%2Fcontact%23chat"
                  className="inline-flex items-center justify-center rounded-full border border-white/40 px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-white/10"
                >
                  Googleログインして相談
                </Link>
              </div>
              <p className="mt-4 text-xs leading-6 text-white/75">
                ブラウザを閉じても会話履歴は保存されますが、ログインしていただくと、
                他の端末でも履歴を引き継ぐことができます。
              </p>
            </div>
          </div>

          <aside className="rounded-3xl border border-line bg-white p-6 shadow-card sm:p-8">
            <span className="grid size-11 place-items-center rounded-2xl bg-brand-soft text-brand">
              <ClockIcon className="size-5" />
            </span>
            <h3 className="mt-4 font-maru text-lg font-bold text-ink">
              お返事について
            </h3>
            <p className="mt-2 text-sm leading-7 text-ink-soft">
              担当者が営業時間内に順次確認します。通常2〜3営業日以内にご返信します。
            </p>
            <p className="mt-3 text-xs leading-6 text-ink-mute">
              土日祝日を挟む場合は、翌営業日以降となることがあります。
            </p>
          </aside>
        </div>
      </Section>

      <Section className="bg-paper">
        <div className="mx-auto max-w-3xl">
          <details className="group overflow-hidden rounded-3xl border border-line bg-white shadow-card">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-5 p-6 transition-colors hover:bg-brand-soft/40 sm:p-8 [&::-webkit-details-marker]:hidden">
              <span className="flex items-start gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-ink/5 text-ink-soft">
                  <MailIcon className="size-5" />
                </span>
                <span>
                  <span className="block font-maru text-lg font-bold text-ink sm:text-xl">
                    メールフォームで問い合わせる
                  </span>
                  <span className="mt-1 block text-sm leading-6 text-ink-soft">
                    資料請求・取材・パートナーシップなどはこちら
                  </span>
                </span>
              </span>
              <span
                aria-hidden="true"
                className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-soft text-xl font-medium text-brand transition-transform group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <div className="border-t border-line px-5 py-7 sm:px-8 sm:py-9">
              <p className="mb-6 text-sm leading-7 text-ink-soft">
                制作のご相談・お見積もりは、回答がスムーズなチャットをご利用ください。
                その他のお問い合わせは、以下のフォームからお送りいただけます。
              </p>
              <ContactForm />
            </div>
          </details>
        </div>
      </Section>

      <Section id="contact-info" className="bg-paper pt-0">
        <div className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-2">
          <div className="rounded-3xl border border-line bg-white p-6 shadow-card sm:p-8">
            <p className="text-xs font-bold tracking-wider text-ink-mute">
              運営
            </p>
            <p className="mt-2 font-maru text-lg font-bold text-ink">
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
          <div className="rounded-3xl border border-line bg-brand-soft/50 p-6 sm:p-8">
            <h2 className="font-maru text-lg font-bold text-ink">
              メールフォーム送信後
            </h2>
            <p className="mt-2 text-sm leading-7 text-ink-soft">
              自動返信メールが届かない場合は、迷惑メールフォルダをご確認ください。
              通常2〜3営業日を過ぎても返信がない場合は、再度お問い合わせください。
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
}
