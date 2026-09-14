import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { ButtonLink, Section, SectionHeading } from "@/components/ui";

export const metadata = {
  title: "制作の流れ",
  description:
    "ホームページ制作を申し込んでから公開するまでの流れを、8つのステップでご案内します。",
};

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

export default function FlowPage() {
  return (
    <div className="flex flex-col">
      <PageHeader
        eyebrow="制作の流れ"
        title="申し込みから公開まで、8つのステップ"
        description="「どこまで進んでいるのか」がいつも分かるように、各ステップでこまめにご連絡します。"
      />

      <Section className="bg-paper">
        <ol className="mx-auto max-w-3xl">
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

      <Section className="bg-cream">
        <SectionHeading
          eyebrow="かかる期間の目安"
          title="最短2週間〜の制作"
        />
        <div className="mx-auto mt-8 grid max-w-4xl gap-6 md:grid-cols-3">
          {[
            ["お試しプラン", "約2〜3週間", "1ページのシンプルなサイト"],
            ["ライトプラン", "約3〜4週間", "3〜5ページの定番サイト"],
            ["スタンダード", "約4〜6週間", "6ページ以上の多機能サイト"],
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

      <Section className="bg-paper">
        <div className="mx-auto max-w-2xl rounded-3xl border border-ink/10 bg-white p-8 text-center shadow-sm">
          <h2 className="font-maru text-xl font-bold text-ink">
            気になることがあれば、お気軽にどうぞ
          </h2>
          <p className="mt-3 text-sm leading-7 text-ink-soft">
            各ステップでの不安や質問を、メール・チャットでいつでも受け付けています。
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/contact" variant="primary" className="flex-1">
              お問い合わせ
            </ButtonLink>
            <ButtonLink href="/apply" variant="secondary" className="flex-1">
              お申し込みページへ
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