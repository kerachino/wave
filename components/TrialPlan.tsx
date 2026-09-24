import Link from "next/link";
import { CheckIcon } from "@/components/icons";
import { basePlan } from "@/lib/site";

/** 基本プランを紹介するカード（トップページ専用。付け足しは料金ページで案内） */
export function TrialPlan() {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="relative overflow-hidden rounded-3xl border-2 border-amber-300 bg-gradient-to-b from-amber-50 via-white to-white p-7 text-center shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-soft sm:p-9">
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-midori via-amber-400 to-brand"
        />
        <p className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full bg-amber-400 px-4 py-1.5 text-xs font-bold text-ink shadow-card">
          <span aria-hidden="true" className="size-2 rounded-full bg-ink" />
          はじめての方におすすめ
        </p>
        <h3 className="mt-4 font-maru text-2xl font-bold text-ink sm:text-3xl">
          {basePlan.name}
        </h3>
        <p className="mt-3 font-maru text-4xl font-bold tracking-tight text-ink sm:text-5xl">
          <span className="text-gradient">{basePlan.price}</span>
          <span className="text-base font-bold text-ink-soft">（税込）</span>
        </p>
        <p className="mt-4 border-t border-line pt-4 text-sm leading-7 text-ink-soft">
          {basePlan.description}
        </p>
        <ul className="mx-auto mt-5 grid max-w-md gap-2.5 text-left sm:grid-cols-2">
          {basePlan.features.map((feature) => (
            <li
              key={feature}
              className="flex items-center gap-2.5 rounded-2xl border border-line bg-cream px-3.5 py-2.5 text-sm font-bold text-ink"
            >
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-emerald-400 text-ink">
                <CheckIcon className="size-3.5" />
              </span>
              {feature}
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/contact"
            className="flex-1 rounded-full bg-brand px-5 py-3.5 text-center text-sm font-bold text-white shadow-[0_12px_26px_-10px_rgb(37_99_235_/_0.55)] transition-all hover:-translate-y-0.5 hover:bg-brand-dark"
          >
            {basePlan.cta}
          </Link>
          <Link
            href="/price"
            className="flex-1 rounded-full bg-white px-5 py-3.5 text-center text-sm font-bold text-ink shadow-card ring-1 ring-line transition-all hover:-translate-y-0.5 hover:text-brand-dark hover:ring-brand/40"
          >
            料金プランをくわしく見る
          </Link>
        </div>
      </div>
      <p className="mt-6 text-center text-sm text-ink-soft">
        ページ追加や自社アプリの開発などの付け足しオプションと、公開後の維持費（月1,000円〜／お支払いがない場合はサイトを公開できません）は、
        <Link
          href="/price"
          className="font-bold text-brand underline decoration-brand/30 underline-offset-4 transition-colors hover:text-brand-dark"
        >
          料金プランのページ
        </Link>
        でご案内しています。
      </p>
    </div>
  );
}