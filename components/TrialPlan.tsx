import Link from "next/link";
import { CheckIcon } from "@/components/icons";
import { basePlan } from "@/lib/site";

/** 基本プランを紹介するカード（トップページ専用。付け足しは料金ページで案内） */
export function TrialPlan() {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="relative overflow-hidden rounded-3xl border-2 border-line bg-white p-7 text-center shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-soft sm:p-9">
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-midori via-sky-400 to-brand"
        />
        <span className="inline-flex items-center gap-1.5 rounded-full bg-midori-soft px-3.5 py-1 text-xs font-bold text-midori-dark">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-midori" />
          {basePlan.priceNote}
        </span>
        <h3 className="mt-4 font-maru text-2xl font-bold text-ink sm:text-3xl">
          {basePlan.name}
        </h3>
        <p className="mt-3 font-maru text-4xl font-bold tracking-tight text-ink sm:text-5xl">
          {basePlan.price}
          <span className="text-base font-bold text-ink-soft">（税込）</span>
        </p>
        <p className="mt-4 border-t border-line pt-4 text-sm leading-7 text-ink-soft">
          {basePlan.description}
        </p>
        <ul className="mx-auto mt-5 grid max-w-md gap-2.5 text-left sm:grid-cols-2">
          {basePlan.features.map((feature) => (
            <li
              key={feature}
              className="flex items-start gap-2.5 text-sm text-ink-soft"
            >
              <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-midori-soft text-midori-dark">
                <CheckIcon className="size-3.5" />
              </span>
              {feature}
            </li>
          ))}
        </ul>
        <Link
          href="/apply"
          className="mt-7 block w-full rounded-xl bg-midori px-5 py-3.5 text-center text-sm font-bold text-ink shadow-soft transition-all hover:-translate-y-0.5 hover:brightness-105"
        >
          {basePlan.cta}
        </Link>
      </div>
      <p className="mt-6 text-center text-sm text-ink-soft">
        ページ追加などの付け足しオプションと、公開後の維持費は、
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