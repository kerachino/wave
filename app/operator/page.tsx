import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { ButtonLink, Container, Section } from "@/components/ui";
import { site } from "@/lib/site";

export const metadata = {
  title: "運営者情報・プロフィール",
  description:
    "ハトノコネクトの運営者プロフィールです。渋谷区でのデジタルデバイド事業・パソコン教室、ウェブ開発などの経歴と想いをお伝えします。",
};

const infoRows = [
  ["屋号", site.name],
  ["代表", site.operator.representative],
  ["事業所", site.operator.office],
  ["事業開始", site.operator.established],
  ["対応エリア", site.operator.area],
  ["連絡先", site.operator.email],
];

/** プロフィールアイコン（public/profile.png があれば表示、なければテキストアバター） */
function ProfileAvatar() {
  return (
    <Image
      src="/profile.png"
      alt={`${site.operator.representative} プロフィール`}
      width={120}
      height={120}
      className="size-32 shrink-0 rounded-full object-cover border border-line bg-cream shadow-soft"
      sizes="(max-width: 640px) 120px, 120px"
      // 画像が未配置の場合は alt テキストが表示されます。public/profile.png を追加してください。
    />
  );
}

export default function OperatorPage() {
  return (
    <div className="flex flex-col">
      <PageHeader
        eyebrow="運営者情報・プロフィール"
        title="代表プロフィール"
        description=""
      />

      {/* プロフィール */}
      <Section className="bg-paper">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-start gap-8 lg:grid-cols-[1.1fr_1fr]">
            <div className="flex flex-col items-center lg:items-start gap-6">
              <ProfileAvatar />
              <p className="font-maru text-2xl font-bold tracking-tight text-ink">
                {site.operator.representative}
              </p>
              <p className="mt-2 text-sm font-bold text-brand tracking-[0.15em]">
                デジタルデバイド解消・パソコン教室・ウェブ制作
              </p>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-ink/10 bg-white p-6 shadow-sm">
                <h3 className="font-maru text-xl font-bold text-ink">想い</h3>
                <p className="mt-3 text-sm leading-7 text-ink-soft">
                  デジタル機器やインターネットが、誰にとっても使いやすいものであるべきだと
                  考えています。渋谷区でのデジタルデバイド事業やパソコン教室を通じて、
                  「使いたいけれど使い方がわからない」という方のお手伝いをしてきました。
                  複雑なことを難しく伝えるのではなく、相手の目線に立って、
                  分かりやすくお伝えすることを大切にしています。
                </p>
              </div>

              <div className="rounded-2xl border border-ink/10 bg-white p-6 shadow-sm">
                <h3 className="font-maru text-xl font-bold text-ink">
                  経歴・業務内容
                </h3>
                <ul className="mt-3 space-y-3 text-sm leading-7 text-ink-soft">
                  <li className="flex items-start gap-3">
                    <span className="mt-1 shrink-0 rounded-full bg-brand-soft text-brand">
                      ●
                    </span>
                    <span>渋谷区のデジタルデバイド事業にて指導・支援</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 shrink-0 rounded-full bg-brand-soft text-brand">
                      ●
                    </span>
                    <span>パソコン教室のエリアマネージャーとして勤務</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 shrink-0 rounded-full bg-brand-soft text-brand">
                      ●
                    </span>
                    <span>
                      経理・動画・画像編集・作曲など、幅広い業務・指導を経験
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* 運営者情報 */}
      <Section className="bg-cream">
        <div className="mx-auto max-w-2xl overflow-hidden rounded-3xl border border-ink/10 bg-white shadow-sm">
          <dl>
            {infoRows.map(([label, value]) => (
              <div
                key={label}
                className="flex justify-between gap-6 border-t border-ink/5 px-6 py-4 first:border-t-0"
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
