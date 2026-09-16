import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Container, Section } from "@/components/ui";
import { site } from "@/lib/site";
import { basePlanPrice, yen } from "@/lib/model";

export const metadata = {
  title: "特定商取引法に基づく表記",
  description:
    "特定商取引法に基づく表記です。事業者名、所在地、連絡先、販売価格、支払い方法・時期、引渡し時期、返品・キャンセル条件。",
};

const rows: [string, string][] = [
  ["販売業者", `${site.name}（${site.operator.representative}）`],
  ["所在地", site.operator.office],
  ["電話番号", site.operator.tel],
  ["メールアドレス", site.operator.email],
  [
    "販売価格",
    `基本プラン${yen(basePlanPrice)}（税込）＋付け足しオプション（お見積りで確定）。維持費（保守サポート費）は月1,000円〜（サイトの公開に必要）`,
  ],
  ["代金の支払い方法", "銀行振込"],
  [
    "代金の支払い時期",
    "原則として制作開始前の全額前払い。個別に合意した場合は別途ご案内",
  ],
  [
    "サービスの引渡し時期",
    "ご契約・着手金確認後、基本プランは約2〜3週間、付け足し内容により3〜6週間",
  ],
  [
    "返品・キャンセル条件",
    "着手金支払い前は無料キャンセル。着手金支払い後・制作開始後は、制作進捗に応じた実費をご請求します。",
  ],
  [
    "追加費用",
    "付け足しオプション（ページ追加・お問い合わせフォーム・原稿作成・写真撮影・ブログ機能・修正3回目以降、お見積りで確定）、独自ドメイン（年1,500円前後・実費・使う場合のみ）、維持費（保守サポート費・月1,000円〜・サイトの公開に必要）",
  ],
];

export default function LawPage() {
  return (
    <div className="flex flex-col">
      <PageHeader
        eyebrow="法規に基づくご案内"
        title="特定商取引法に基づく表記"
        description="電子契約・決済を行っているサービスとして、特定商取引法に基づく情報を掲載しています。"
      />

      <Section className="bg-paper">
        <div className="mx-auto max-w-3xl overflow-hidden rounded-3xl border border-ink/10 bg-white shadow-sm">
          <dl>
            {rows.map(([label, value], i) => (
              <div
                key={label}
                className={`flex justify-between gap-5 px-6 py-4 ${
                  i > 0 ? "border-t border-ink/5" : ""
                }`}
              >
                <dt className="w-44 shrink-0 text-xs font-bold leading-6 text-ink-mute">
                  {label}
                </dt>
                <dd className="flex-1 whitespace-pre-wrap text-sm leading-7 text-ink">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-ink/10 bg-cream p-5 text-sm leading-7 text-ink-soft">
          <p>
            電話番号は、電話での営業・問い合わせ対応を行っていないため非公開としています。
            ご連絡は
            <Link
              href="/contact"
              className="font-bold text-brand hover:text-brand-deep"
            >
              お問い合わせフォーム
            </Link>
            またはメール（{site.email}）にてお願いします。
          </p>
        </div>
      </Section>

      <Container className="py-12">
        <p className="text-center">
          <Link
            href="/privacy"
            className="text-sm font-bold text-brand hover:text-brand-deep"
          >
            プライバシーポリシーを見る →
          </Link>
        </p>
      </Container>
    </div>
  );
}
