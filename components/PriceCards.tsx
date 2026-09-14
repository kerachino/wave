import Link from "next/link";
import { addons, basePlan, planExamples } from "@/lib/site";
import { CheckIcon } from "@/components/icons";

/** 料金：基本プラン＋付け足し形式のカード */
export function PriceCards() {
  return (
    <div className="flex flex-col gap-8">
      {/* 基本プラン */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-brand/60 bg-white p-7 text-center shadow-lift sm:p-9">
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-1.5 rounded-t-3xl bg-gradient-to-r from-brand via-sky-400 to-midori"
        />
        <span className="inline-block rounded-full bg-gradient-to-r from-brand to-sky-500 px-4 py-1 text-xs font-bold text-white shadow-soft">
          まずはここから
        </span>
        <h3 className="mt-3 font-maru text-2xl font-bold text-ink sm:text-3xl">
          {basePlan.name} {basePlan.price}
          <span className="text-base font-bold text-ink-soft">（税込）</span>
        </h3>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-ink-soft">
          {basePlan.description}
        </p>
        <ul className="mx-auto mt-6 grid max-w-3xl gap-2.5 text-left sm:grid-cols-2">
          {basePlan.features.map((feature) => (
            <li
              key={feature}
              className="flex items-start gap-2.5 rounded-xl bg-cream/60 px-4 py-3 text-sm text-ink"
            >
              <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-brand-soft text-brand-dark">
                <CheckIcon className="size-3.5" />
              </span>
              {feature}
            </li>
          ))}
        </ul>
        <Link
          href="/apply"
          className="mx-auto mt-6 block w-full max-w-md rounded-xl bg-brand px-5 py-3.5 text-center text-sm font-bold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:bg-brand-dark"
        >
          {basePlan.cta}
        </Link>
      </div>

      {/* 付け足しオプション */}
      <div>
        <h3 className="text-center font-maru text-xl font-bold text-ink">
          必要なものだけ付け足し
        </h3>
        <p className="mt-2 text-center text-sm leading-7 text-ink-soft">
          基本プラン7,500円に、以下を組み合わせます。金額はお見積りで確定します。
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {addons.map((addon) => (
            <div
              key={addon.id}
              className="flex flex-col rounded-2xl border border-line bg-white p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-soft"
            >
              <p className="text-sm font-bold text-ink">{addon.name}</p>
              <p className="mt-1 font-maru text-lg font-bold text-brand-deep">
                {addon.price}
              </p>
              <p className="mt-2 flex-1 text-xs leading-6 text-ink-soft">
                {addon.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 合計の目安 */}
      <div className="rounded-3xl border border-line bg-cream p-6 sm:p-8">
        <h3 className="text-center font-maru text-lg font-bold text-ink">
          合計の目安（例）
        </h3>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {planExamples.map((ex) => (
            <div
              key={ex.name}
              className="rounded-2xl border border-ink/10 bg-white p-5 text-center shadow-sm"
            >
              <p className="text-sm font-bold text-ink">{ex.name}</p>
              <p className="mt-2 font-maru text-2xl font-bold text-ink">
                {ex.total}
              </p>
              <p className="mt-2 text-xs leading-6 text-ink-soft">
                {ex.breakdown}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-center text-xs leading-6 text-ink-soft">
          いずれも税込・目安です。正式な金額はヒアリング後のお見積りでお伝えします。
        </p>
      </div>
    </div>
  );
}
