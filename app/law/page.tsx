import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Container, Section } from "@/components/ui";
import { site } from "@/lib/site";
import { basePlanPrice, yen } from "@/lib/model";

export const metadata = {
  title: "特定商取引法に基づく表記",
  description:
    "特定商取引法に基づく表記です。事業者名、所在地、連絡先、販売価格、支払い方法・時期、引渡し時期、申込みの有効期限、返品・キャンセル条件などを掲載しています。",
};

const rows: [string, string][] = [
  ["販売業者", `${site.name}（${site.operator.representative}）`],
  ["所在地", site.operator.office],
  ["電話番号", site.operator.tel],
  ["メールアドレス", site.operator.email],
  [
    "連絡先の受付時間",
    "お問い合わせフォーム・メールは24時間受付。返信は2〜3営業日以内を目安としています（電話での対応は行っておりません）",
  ],
  [
    "提供するサービスの内容",
    "ホームページ・Webページの制作、公開後の保守・更新サポート（維持費ご加入時）",
  ],
  [
    "販売価格",
    `基本プラン${yen(basePlanPrice)}（税込）＋付け足しオプション（お見積りで確定）。維持費（保守サポート費）は月1,000円〜（サイトの公開に必要）`,
  ],
  [
    "代金の支払い方法",
    "銀行振込（現行）。カード決済は準備中のため、導入後にご案内します",
  ],
  [
    "代金の支払い時期",
    "原則として制作開始前の全額前払い。事前に合意した場合のみ、着手金（50%）＋公開・納品後の残金（50%）の分割払いをご案内します",
  ],
  [
    "サービスの引渡し時期",
    "ご契約・支払い確認後、基本プランは約2〜3週間、付け足し内容により3〜6週間",
  ],
  [
    "申込みの有効期限",
    "お見積り書に有効期限の記載がある場合はその日付まで。記載がない場合は、お見積り日の翌日から2週間以内",
  ],
  [
    "返品・キャンセル条件",
    "着手金支払い前は無料キャンセル。着手金支払い後・制作開始後は、制作進捗に応じた実費をご請求します。制作物はデジタルコンテンツのため、納品・公開後の返品・返金には応じられません（契約どおりの内容でない場合は修正で対応します）",
  ],
  [
    "追加費用",
    "付け足しオプション（ページ追加・お問い合わせフォーム・原稿作成・写真撮影・ブログ機能・自社アプリ開発・修正3回目以降、お見積りで確定）、独自ドメイン（年1,500円前後・実費・使う場合のみ）、維持費（保守サポート費・月1,000円〜・サイトの公開に必要）",
  ],
  [
    "特定商取引に関する制限",
    "18歳未満の方のお申し込みには、保護者等の同意が必要です",
  ],
  [
    "その他特記事項",
    "【表示環境】Google Chrome・Safari・Microsoft Edge の最新版、および Android・iOS の標準ブラウザでの表示を想定しています。\n【修正】制作中の確認・公開前までの大きな修正は2回まで無料、3回目以降は1回3,000円〜。公開後の修正・更新は維持費（保守サポート費）で承ります。\n【モニター条件】モニター価格のご契約では、制作実績の掲載やアンケートへのご協力をお願いしています。同意いただけない場合はオプション（＋5,000円）が追加となります。\n【維持費】サイトの公開には維持費が必要です。お支払いが確認できない場合は、サイトの公開・表示を停止します。\n【著作権】制作したホームページの著作権は、原則として当サービスに帰属します。ソースコード等の譲渡は別途お見積りとなります。",
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
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-8">
          <Link
            href="/terms"
            className="text-sm font-bold text-brand hover:text-brand-deep"
          >
            利用規約を見る →
          </Link>
          <Link
            href="/privacy"
            className="text-sm font-bold text-brand hover:text-brand-deep"
          >
            プライバシーポリシーを見る →
          </Link>
        </div>
      </Container>
    </div>
  );
}
