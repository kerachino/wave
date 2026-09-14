import Link from "next/link";
import { HouseIcon } from "@/components/icons";
import { PageHeader } from "@/components/PageHeader";
import { ButtonLink, Section, SectionHeading } from "@/components/ui";

export const metadata = {
  title: "制作事例",
  description:
    "ハトノコネクトのホームページ制作事例をご紹介します。現在はモニター事例を募集中です。",
};

export default function WorksPage() {
  return (
    <div className="flex flex-col">
      <PageHeader
        eyebrow="制作事例"
        title="はじまりの1ページ。あなたのサイトが最初の事例に"
        description="これから積み重ねていく制作事例。まだ実績が少ないからこそ、お試し価格で丁寧に仕上げます。"
      />

      {/* 現在の実績状況 */}
      <Section className="bg-paper">
        <SectionHeading
          eyebrow="現在の状況"
          title="モニター事例を募集中です"
          description="下記の「モニター事例」として公開にご協力いただけるお店・会社さまを、先着順で募集しています。"
        />
        <div className="mx-auto mt-8 grid max-w-4xl gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-brand bg-brand-soft p-8 text-center">
            <p className="font-maru text-lg font-bold text-brand-deep">
              お試しプラン 5,500円〜
            </p>
            <p className="mt-3 text-sm leading-7 text-brand-deep">
              制作事例としてサイトを掲載いただける代わりに、モニター価格で制作します。
              クチコミへのご協力もお願いします。
            </p>
            <div className="mt-5">
              <ButtonLink href="/apply" variant="primary">
                モニターに応募する
              </ButtonLink>
            </div>
          </div>
          <div className="rounded-3xl border border-ink/10 bg-white p-8 text-center shadow-sm">
            <p className="font-maru text-lg font-bold text-ink">
              事例の掲載内容
            </p>
            <p className="mt-3 text-sm leading-7 text-ink-soft">
              サイト公開後は、このページで Before／After や制作のポイント、
              お客さまの声（クチコミ）をご紹介していきます。
            </p>
          </div>
        </div>
      </Section>

      {/* これから追加される事例 */}
      <Section className="bg-cream">
        <SectionHeading
          eyebrow="COMING SOON"
          title="最初の事例ができるまで、お楽しみに"
          description="公開後はこの場所に、Before／After・制作のポイント・お客さまの声を順次追加していきます。"
        />
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[0, 1, 2].map((n) => (
            <div
              key={n}
              className="rounded-2xl border border-dashed border-ink/15 bg-cream/60 p-8 text-center"
            >
              <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-white text-ink-mute shadow-card">
                <HouseIcon className="size-7" />
              </div>
              <p className="mt-4 font-maru text-base font-bold text-ink-mute">
                あなたのお店・会社の番です
              </p>
              <p className="mt-2 text-xs leading-6 text-ink-mute">
                お試しプランで、この場所にあなたのサイトが並びます。
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="bg-paper">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-brand to-brand-dark px-6 py-12 text-center shadow-lift sm:px-10">
          <div aria-hidden="true" className="aurora pointer-events-none absolute -right-20 -top-28 size-72 opacity-40" />
          <div aria-hidden="true" className="glow-amber pointer-events-none absolute -bottom-24 -left-12 size-56 opacity-50" />
          <span aria-hidden="true" className="absolute left-[14%] top-8 size-2.5 rounded-full bg-midori" />
          <span aria-hidden="true" className="absolute right-[18%] top-12 size-2 rounded-full bg-white/80" />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="font-maru text-2xl font-bold tracking-tight text-white">
              あなたのサイトを、最初の事例にしませんか
            </h2>
            <p className="mt-3 text-sm leading-7 text-white/75">
              お試し5,500円〜で、事例掲載にご協力いただけるお店・会社さまを募集しています。
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/contact" variant="accent" size="lg" className="flex-1">
                まずは相談する
              </ButtonLink>
              <ButtonLink href="/price" variant="secondary" size="lg" className="flex-1">
                料金プランを見る
              </ButtonLink>
            </div>
          </div>
        </div>
      </Section>

      <p className="sr-only">
        <Link href="/">ホーム</Link>
      </p>
    </div>
  );
}