import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { ButtonLink, Container, Section } from "@/components/ui";
import { site } from "@/lib/site";

export const metadata = {
  title: "運営者情報",
  description:
    "ハトノコネクトの運営者情報です。個人事業として、東京都渋谷区を拠点に活動しています。",
};

const infoRows = [
  ["屋号", site.name],
  ["代表", site.operator.representative],
  ["事業所", site.operator.office],
  ["事業開始", site.operator.established],
  ["対応エリア", site.operator.area],
  ["連絡先", site.operator.email],
];

export default function OperatorPage() {
  return (
    <div className="flex flex-col">
      <PageHeader
        eyebrow="運営者情報"
        title="だれが、どこで、やっているのか"
        description="はっきりお伝えできることが、何よりの安心材料だと思っています。"
      />

      <Section className="bg-paper">
        <div className="mx-auto max-w-2xl overflow-hidden rounded-3xl border border-ink/10 bg-white shadow-sm">
          <div className="flex items-center gap-4 bg-cream px-6 py-5">
            <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-midori to-brand-deep font-maru text-2xl font-bold text-white shadow-soft">
              鳩
            </span>
            <div>
              <p className="font-maru text-xl font-bold text-ink">
                {site.name}
              </p>
              <p className="mt-1 text-sm text-ink-soft">
                Web制作・Webサイト運営（個人事業）
              </p>
            </div>
          </div>
          <dl>
            {infoRows.map(([label, value]) => (
              <div
                key={label}
                className="flex justify-between gap-6 border-t border-ink/5 px-6 py-4"
              >
                <dt className="w-28 shrink-0 text-xs font-bold text-ink-mute">
                  {label}
                </dt>
                <dd className="flex-1 whitespace-pre-wrap text-sm leading-6 text-ink">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mx-auto mt-8 max-w-2xl">
          <div className="rounded-3xl border border-ink/10 bg-cream p-6 text-sm leading-7 text-ink-soft">
            <h2 className="font-maru text-lg font-bold text-ink">
              「本社」ではなく「事業所」と表記しています
            </h2>
            <p className="mt-3">
              当方は大規模な会社ではなく、個人事業として運営しております。
              そのため、所在地は「本社」でなく<span className="font-bold text-ink">「事業所」</span>として
              正確にお伝えしています。自宅住所は公表せず、お問い合わせ時に対応しております。
            </p>
            <p className="mt-3">
              対応エリアは{site.operator.area}。
              オンラインでの打ち合わせが中心のため、遠方からもご相談いただけます。
            </p>
          </div>

          <div className="mt-8 rounded-3xl border border-ink/10 bg-white p-6 text-center shadow-sm">
            <p className="text-sm font-bold text-ink">
              事業所に関するご相談はこちら
            </p>
            <a
              href={`mailto:${site.email}`}
              className="mt-1 block font-maru text-lg font-bold text-brand hover:text-brand-deep"
            >
              {site.email}
            </a>
            <p className="mt-3 text-base leading-8 text-ink-soft">
              <span className="inline-block">
                各種ご相談はメール・チャットで受け付けています。お電話での対応は行っておりません。
              </span>
              <br />
              <span className="text-xs text-ink-mute">
                返信目安：{site.replyTime}
              </span>
            </p>
          </div>
        </div>
      </Section>

      <Container className="py-12 text-center">
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/contact" variant="primary" className="flex-1">
            お問い合わせする
          </ButtonLink>
          <ButtonLink href="/law" variant="secondary" className="flex-1">
            特定商取引法に基づく表記を見る
          </ButtonLink>
        </div>
      </Container>

      <p className="sr-only">
        <Link href="/">ホーム</Link>
      </p>
    </div>
  );
}