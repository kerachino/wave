import Link from "next/link";
import { plans } from "@/lib/site";
import { Badge, Card } from "@/components/ui";

/** 料金プラン早見カード（トップ・料金ページで共通利用） */
export function PriceCards() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {plans.map((plan) => (
        <Card
          key={plan.id}
          className={`flex flex-col p-6 ${
            plan.featured
              ? "relative border-brand ring-2 ring-brand/30"
              : ""
          }`}
        >
          {plan.featured && (
            <Badge color="brand" className="absolute -top-3 right-4">
              おすすめ
            </Badge>
          )}
          <h3 className="font-maru text-lg font-bold text-ink">{plan.name}</h3>
          <p className="mt-1 text-sm leading-6 text-ink-soft">
            {plan.description}
          </p>
          <div className="mt-4">
            <p className="font-maru text-3xl font-bold text-ink">
              {plan.price}
            </p>
            <p className="text-xs text-ink-mute">{plan.priceNote}</p>
          </div>
          <ul className="mt-5 space-y-2">
            {plan.features.map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-2 text-sm text-ink-soft"
              >
                <span className="grid size-5 place-items-center rounded-full bg-midori-soft text-midori">
                  ✓
                </span>
                {feature}
              </li>
            ))}
          </ul>
          <div className="mt-auto pt-5">
            <Link
              href="/apply"
              className={`w-full rounded-full px-5 py-3 text-center text-sm font-bold transition-colors ${
                plan.featured
                  ? "brand-sheen bg-brand text-white shadow-md hover:bg-brand-dark"
                  : "border border-ink/15 text-brand hover:border-brand hover:bg-brand-soft"
              }`}
            >
              {plan.cta}
            </Link>
          </div>
        </Card>
      ))}
    </div>
  );
}