import Link from "next/link";
import { ChatIcon, MailIcon } from "@/components/icons";
import { Container } from "@/components/ui";
import { maintenance, site } from "@/lib/site";

/* ============================================================
   ご依頼から公開までの流れ
   ・細かい7ステップは書かず、「大きく4つ」にまとめて短い言葉（タグ）で示す
   ・お支払いは前払い（制作開始前）のため、製作の前に「契約・お支払い」を置く
   ・「お見積り後のやり取りはアプリ内で完結」を強調し、問い合わせのハードルを下げる
   ============================================================ */

/* やり取りの手段（バッジの見た目をここでまとめて管理） */
const channels = {
  mail: {
    icon: MailIcon,
    label: "メール",
    badge: "bg-brand-soft text-brand-deep",
  },
  app: {
    icon: ChatIcon,
    label: "アプリ内で",
    badge: "bg-midori-soft text-midori-dark",
  },
} as const;

const steps = [
  {
    no: 1,
    title: "相談する",
    channel: "mail",
    accent: "bg-brand text-white",
    desc: `作りたいイメージを送るだけでOK。お返事は${site.replyTime}です。`,
    tags: ["問い合わせ受付", "ヒアリング", "お見積り・プランのご提案"],
    cta: { href: "/contact", label: "無料で相談する" },
  },
  {
    no: 2,
    title: "契約・お支払い",
    channel: "app",
    accent: "bg-midori text-white",
    desc: "ご納得いただいたら、制作開始前にお支払い",
    tags: ["取引条件の明示", "ご契約", "お支払い（前払い）"],
    cta: null,
  },
  {
    no: 3,
    title: "制作・確認",
    channel: "app",
    accent: "bg-brand-deep text-white",
    desc: "チャットで確認しながら仕上げます",
    tags: [
      "ワイヤーフレームで構成合意",
      "デザイン制作・修正",
      "チャットでのやり取り",
    ],
    cta: null,
  },
  {
    no: 4,
    title: "公開・納品",
    channel: "app",
    accent: "bg-brand-deep text-white",
    desc: "テスト画面で確認して、OKなら公開",
    tags: [
      "納品・検収",
      "サイトの公開",
      "公開後の修正・更新サポート",
      `維持費 ${maintenance.price}`,
    ],
    cta: null,
  },
] as const;

export function FlowSteps() {
  return (
    <section id="flow" className="scroll-mt-24 border-y border-line bg-cream">
      <Container className="py-14 sm:py-20">
        <p className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-bold tracking-[0.22em] text-brand-deep ring-1 ring-line">
          <span
            aria-hidden="true"
            className="size-1.5 rounded-full bg-midori"
          />
          FLOW
        </p>
        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="max-w-xl font-maru text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            まずは<span className="text-brand">気軽に相談</span>
          </h2>
          <p className="max-w-md text-sm leading-8 text-ink-soft">
            ご契約・お支払い・やり取りは、本アプリで完結します。
          </p>
        </div>

        <ol className="mx-auto mt-10 grid max-w-5xl gap-4 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => {
            const channel = channels[step.channel];
            return (
              <li
                key={step.no}
                className="flex flex-col rounded-3xl border border-line bg-white p-5 text-left shadow-card transition-all hover:-translate-y-1 hover:shadow-lift"
              >
                <div className="flex items-center justify-between gap-3">
                  <span
                    className={`grid size-8 shrink-0 place-items-center rounded-full font-maru text-sm font-bold ${step.accent}`}
                  >
                    {step.no}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${channel.badge}`}
                  >
                    <channel.icon className="size-3.5" />
                    {channel.label}
                  </span>
                </div>
                <p className="mt-4 font-maru text-lg font-bold text-ink">
                  {step.title}
                </p>
                <p className="mt-1.5 text-xs leading-6 text-ink-soft">
                  {step.desc}
                </p>
                <ul className="mt-auto flex flex-wrap gap-1.5 pt-4">
                  {step.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full bg-cream px-2.5 py-1 text-[11px] font-bold leading-5 text-ink-soft ring-1 ring-line"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>

                {/* STEP 1 だけ、相談フォームへのボタンを表示 */}
                {step.cta && (
                  <Link
                    href={step.cta.href}
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#f2688c] px-5 py-3 text-sm font-bold text-white shadow-[0_12px_26px_-10px_rgb(242_104_140_/_0.6)] transition-all hover:-translate-y-0.5 hover:brightness-105"
                  >
                    <MailIcon className="size-4" />
                    {step.cta.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
