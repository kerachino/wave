import Link from "next/link";
import { plans } from "@/lib/site";
import { CheckIcon } from "@/components/icons";

/** 料金プラン早見カード（料金ページで利用） */
export function PriceCards() {
  return (
    <div className="grid items-stretch gap-6 md:grid-cols-3">
      {plans.map((plan) => (
        <div
          key={plan.id}
          className={`relative flex flex-col rounded-3xl border-2 bg-white p-7 transition-all duration-200 hover:-translate-y-1 ${
            plan.featured
              ? "border-brand/60 shadow-lift"
              : "border-line shadow-card hover:shadow-soft"
          }`}
        >
          {plan.featured && (
            <>
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-1.5 rounded-t-[1.4rem] bg-gradient-to-r from-brand via-sky-400 to-midori"
              />
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-brand to-sky-500 px-4 py-1 text-xs font-bold text-white shadow-soft">
                おすすめ
              </span>
            </>
          )}
          <h3 className="text-sm font-bold tracking-wide text-ink-soft">
            {plan.name}
          </h3>
          <p className="mt-3 font-maru text-3xl font-bold tracking-tight text-ink">
            {plan.price}
          </p>
          <p className="mt-1 text-xs text-ink-mute">{plan.priceNote}</p>
          <p className="mt-4 border-t border-line pt-4 text-sm leading-7 text-ink-soft">
            {plan.description}
          </p>
          <ul className="mt-5 space-y-2.5">
            {plan.features.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-2.5 text-sm text-ink-soft"
              >
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-brand-soft text-brand-dark">
                  <CheckIcon className="size-3.5" />
                </span>
                {feature}
              </li>
            ))}
          </ul>
          <div className="mt-auto pt-6">
            <Link
              href="/apply"
              className={`block w-full rounded-xl px-5 py-3 text-center text-sm font-bold transition-all ${
                plan.featured
                  ? "bg-brand text-white shadow-soft hover:-translate-y-0.5 hover:bg-brand-dark"
                  : "bg-white text-ink ring-1 ring-line hover:-translate-y-0.5 hover:text-brand-dark hover:ring-brand/40"
              }`}
            >
              {plan.cta}
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
