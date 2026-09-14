import Link from "next/link";
import { ApplyForm } from "@/components/ApplyForm";
import { PageHeader } from "@/components/PageHeader";
import { ButtonLink, Section, SectionHeading } from "@/components/ui";
import { site } from "@/lib/site";

export const metadata = {
  title: "お申し込み・ご契約",
  description:
    "ホームページ制作のお申し込み・ご契約ページです。Googleログイン→申込みフォーム→契約条件→お支払いまで、このサイト内で完結します。",
};

const terms = [
  {
    title: "著作権について",
    body: "制作したホームページの著作権は、原則として運営（ハトノコネクト）に帰属します。お客さまは、ご契約の範囲内でサイトを業務利用いただけます。ソースコード等の譲渡は別途お見積りとなります。",
  },
  {
    title: "修正回数について",
    body: "各プランとも、制作期間中の修正は2回まで無料で対応します。3回目以降の修正は別途費用（1回3,000円〜）となります。公開後の修正は保守サポート費（月1,000円〜・任意）で承ります。",
  },
  {
    title: "お支払い条件について",
    body: "お見積り金額の50%を着手金として制作開始前にお支払いいただき、残り50%を公開・納品後にお支払いいただきます。お支払いは銀行振込（現行）。カード決済は決済代行サービス導入後に開始します。",
  },
  {
    title: "キャンセルについて",
    body: "着手金のお支払い前であれば、キャンセルは無料です。着手金のお支払い後・制作開始後は、制作進捗に応じた実費をご請求いたします。詳細はお見積りの際にお知らせします。",
  },
  {
    title: "納期について",
    body: "納期はお見積りの時点でお約束します。お客さまのご連絡待ちの期間（素材送付・内容確認など）は、日数の計算から除外させていただきます。",
  },
  {
    title: "インボイス・領収書について",
    body: "適格請求書（インボイス）・領収書は、ご希望により発行いたします。お支払い時にその旨をお申し付けください。",
  },
];

export default function ApplyPage() {
  return (
    <div className="flex flex-col">
      <PageHeader
        eyebrow="お申し込み・ご契約"
        title="このサイト内で、申し込みからお支払いまで"
        description="Googleログイン → 申込みフォーム → 契約条件への同意 → お支払い。お電話や郵送の手続きは不要です。"
      />

      {/* 申込みフォーム */}
      <Section className="bg-paper">
        <SectionHeading
          eyebrow="STEP 1〜4"
          title="お申し込みフォーム"
          description="ログインして、必要事項を入力してください。内容を確認して、最後に契約条件へ同意いただきます。"
        />
        <div className="mx-auto mt-8 max-w-3xl">
          <ApplyForm />
        </div>
      </Section>
      {/* 契約条件・注意事項 */}
      <Section id="terms" className="bg-cream">
        <SectionHeading
          eyebrow="ご契約にあたって"
          title="契約条件・注意事項"
          description="お申し込みの前に、以下の条件をご確認ください。フォームの同意チェックで同意いただいたものとします。"
        />
        <div className="mx-auto mt-8 max-w-3xl">
          <div className="space-y-4">
            {terms.map((term) => (
              <details
                key={term.title}
                open
                className="group rounded-2xl border border-ink/10 bg-white shadow-sm"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-3 px-5 py-4 text-left">
                  <span className="text-base font-bold text-ink">
                    {term.title}
                  </span>
                  <svg
                    viewBox="0 0 24 24"
                    className="size-5 shrink-0 text-brand transition-transform group-open:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </summary>
                <p className="border-t border-ink/5 bg-cream/50 px-5 py-4 text-sm leading-7 text-ink-soft">
                  {term.body}
                </p>
              </details>
            ))}
          </div>
          <p className="mt-6 text-sm leading-7 text-ink-soft">
            その他の条件は、お見積り書およびご契約のご案内メールにて明示します。
            ご不明な点は、お申し込み前に
            <Link href="/contact" className="font-bold text-brand hover:text-brand-deep">
              お問い合わせ
            </Link>
            ください。
          </p>
        </div>
      </Section>

      {/* お支払い・決済 */}
      <Section className="bg-paper">
        <SectionHeading
          eyebrow="お支払い・決済"
          title="お支払いのご案内"
          description="お申し込み確定後、担当者よりお支払い方法と口座情報をご案内します。"
        />
        <div className="mx-auto mt-8 grid max-w-4xl gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-brand/50 bg-white p-6 shadow-card">
            <p className="text-sm font-bold text-midori-dark">銀行振込（現行）</p>
            <p className="mt-3 text-sm leading-7 text-ink-soft">
              着手金（50%）を制作開始前に、残金（50%）を公開・納品後にお振り込みいただきます。
              振込先はご契約のご案内メールでお伝えします。
            </p>
          </div>
          <div className="rounded-3xl border border-ink/10 bg-white p-6 shadow-sm">
            <p className="rounded-full bg-brand-soft px-3 py-0.5 text-xs font-bold text-brand-deep">
              準備中
            </p>
            <p className="mt-3 text-sm font-bold text-ink">カード決済（決済代行）</p>
            <p className="mt-2 text-sm leading-7 text-ink-soft">
              決済代行サービス（Stripe など）の導入を検討中です。
              導入が決まり次第、このページでご案内します。
            </p>
          </div>
          <div className="rounded-3xl border border-ink/10 bg-white p-6 shadow-sm">
            <p className="text-sm font-bold text-ink">インボイス・領収書</p>
            <p className="mt-3 text-sm leading-7 text-ink-soft">
              適格請求書（インボイス）・領収書は、ご希望により発行いたします。
              お支払い時にお申し付けください。
            </p>
          </div>
        </div>
        <p className="mt-6 text-center text-sm text-ink-soft">
          特定商取引法に基づく表記は
          <Link href="/law" className="font-bold text-brand hover:text-brand-deep">
            こちら
          </Link>
          をご覧ください。
        </p>
      </Section>

      <Section className="bg-cream">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-brand to-brand-dark px-6 py-12 text-center shadow-lift sm:px-10">
          <div aria-hidden="true" className="aurora pointer-events-none absolute -right-20 -top-28 size-72 opacity-40" />
          <div aria-hidden="true" className="glow-amber pointer-events-none absolute -bottom-24 -left-12 size-56 opacity-50" />
          <span aria-hidden="true" className="absolute left-[14%] top-8 size-2.5 rounded-full bg-midori" />
          <span aria-hidden="true" className="absolute right-[18%] top-12 size-2 rounded-full bg-white/80" />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="font-maru text-2xl font-bold tracking-tight text-white">
              申し込む前に、まだ迷っている方へ
            </h2>
            <p className="mt-3 text-sm leading-7 text-white/75">
              無料相談で、プランの選び方や料金などをご相談いただけます。
              お申し込みの直前でも、お気軽にどうぞ。
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/contact" variant="accent" size="lg" className="flex-1">
                お問い合わせする
              </ButtonLink>
              <ButtonLink href="/price" variant="secondary" size="lg" className="flex-1">
                料金と流れを見る
              </ButtonLink>
            </div>
          </div>
        </div>
      </Section>

      <p className="sr-only">
        <Link href="/">{site.name} ホーム</Link>
      </p>
    </div>
  );
}