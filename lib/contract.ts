// ============================================================
// 取引条件の明示（契約条件）と同意ログの共通定義
//
// ・購入画面（マイページのお支払い）で、業務委託の取引条件8項目を
//   明示するための文言をここで一元管理します。
// ・内容を改定したときは `contractVersion` を必ず更新してください。
//   同意ログ（いつ・誰が・何に同意したか）にバージョンを記録します。
// ・同じ関数をサーバー（Square 請求書 API）からも呼び、
//   「お客さまに明示した内容」をそのまま証跡として保存します。
// ============================================================
import { site } from "@/lib/site";
import {
  basePlanFeatures,
  basePlanName,
  maintenanceSubscriptionPrice,
  toDate,
  yen,
  type Order,
} from "@/lib/model";

/** 取引条件のバージョン（改定したら更新する。同意ログに記録されます） */
export const contractVersion = "2026-09-24";
/** 取引条件の改定日（表示用） */
export const contractRevisedAt = "2026年9月24日";
/** 画面に出すバージョン表記 */
export const contractVersionLabel = `取引条件 v${contractVersion}（${contractRevisedAt} 改定）`;

/** 給付の受領場所・方法の既定値 */
export const defaultDeliveryPlace =
  "オンライン納品（本サイトのマイページ内チャット／ご登録のメールアドレス宛）";
/** 給付を受領する期日の既定値（制作） */
export const defaultDeliveryLeadTime =
  "ご入金の確認および素材・内容の確定後、2〜3週間（付け足しがある場合は3〜6週間）";
/** 検査完了期日の既定値 */
export const defaultInspectionDeadline = "納品（公開）日から7日以内";
/** 支払期日の既定値（Square 請求書の既定の支払期限と同じ14日） */
export const defaultDueDateNote = "請求書の発行日から14日以内";
/** 修正対応の条件 */
export const revisionTerms =
  "制作期間中の修正は2回まで無料（3回目以降は1回3,000円〜）。公開後の修正・更新は維持費サポートで対応します。";

export type ContractKind = "project" | "subscription";

/** 取引条件の明示1項目（特定商取引法などで示すべき事項） */
export type ContractDisclosure = {
  /** 明示項目の番号（1〜8） */
  no: number;
  label: string;
  value: string;
  note?: string;
};

export type ContractContext = {
  kind: ContractKind;
  order: Order | null;
  /** 発注者（お客さま）の名称 */
  customerName: string;
  /** 発注者（お客さま）のメールアドレス */
  customerEmail: string;
  /** 業務委託をした日時（購入日）。未確定のときは未指定 */
  agreedAt?: unknown;
  /** Square 請求書の支払期限（YYYY-MM-DD） */
  dueDate?: string;
};

const japaneseDate = new Intl.DateTimeFormat("ja-JP", {
  timeZone: "Asia/Tokyo",
  year: "numeric",
  month: "long",
  day: "numeric",
});
const japaneseDateTime = new Intl.DateTimeFormat("ja-JP", {
  timeZone: "Asia/Tokyo",
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

/** 日時（Firestore Timestamp / Date / 文字列）を日本時間で表示します */
export function formatContractDateTime(value?: unknown): string {
  const date = toDate(value);
  return date ? japaneseDateTime.format(date) : "";
}

/** 期日（YYYY-MM-DD）を日本時間の日付表示にします */
export function formatContractYmd(value?: string | null): string {
  if (!value) return "";
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (!match) return value;
  return japaneseDate.format(
    new Date(`${match[1]}-${match[2]}-${match[3]}T00:00:00+09:00`),
  );
}


/** 契約している金額（円）を返します */
export function contractAmount(context: Pick<ContractContext, "kind" | "order">) {
  if (context.kind === "subscription") {
    return context.order?.subscriptionPrice ?? maintenanceSubscriptionPrice;
  }
  return context.order?.totalPrice ?? 0;
}

/**
 * 購入画面に明示する取引条件（8項目）を組み立てます。
 * 発注者・受注者の名称／業務委託をした日／給付の内容／給付を受領する期日／
 * 給付を受領する場所／検査完了期日／報酬の額・支払期日／支払方法
 */
export function buildContractDisclosures(
  context: ContractContext,
): ContractDisclosure[] {
  const { kind, order, customerName, customerEmail, dueDate } = context;
  const project = kind === "project";
  const agreedAt = formatContractDateTime(context.agreedAt);
  const amount = contractAmount(context);
  const options = order?.options ?? [];
  const optionsText = options
    .map((option) => `${option.name}（${yen(option.price)}）`)
    .join("／");
  const isAdditionalPurchase = project && order?.basePrice === 0;
  const dueDateText = dueDate
    ? formatContractYmd(dueDate)
    : defaultDueDateNote;

  return [
    {
      no: 1,
      label: "発注者・受注者の名称",
      value:
        `発注者（お客さま）：${customerName}${customerEmail ? `（${customerEmail}）` : ""}\n` +
        `受注者（当社）：${site.operator.tradeName}（代表 ${site.operator.representative}）`,
      note: `受注者の事業所：${site.operator.office}／ご連絡先：${site.operator.email}（または本サイトのチャット）`,
    },
    {
      no: 2,
      label: "業務委託をした日（購入日）",
      value: agreedAt
        ? agreedAt
        : "本画面の「同意して購入する」を押した日時（下の同意ログに記録します）",
      note: "日本時間（JST）で記録します。請求書の発行日ではなく、お客さまがご契約（購入）に同意した日時です。",
    },
    {
      no: 3,
      label: "給付の内容",
      value: project
        ? isAdditionalPurchase
          ? `${order?.title || "追加依頼"}${optionsText ? `\n追加購入内容：${optionsText}` : ""}`
          : `ホームページの制作一式（${basePlanName}：${basePlanFeatures.join("／")}）` +
            (optionsText ? `\n付け足し：${optionsText}` : "") +
          `\n${revisionTerms}`
        : "サイト公開後の保守・更新サポート（月額）\n・小さな修正・更新（月1回程度）\n・表示トラブルや修正方法のご相談対応\n・お知らせ・ブログなどの更新は管理ページからご自身で行えます",
      note: project
        ? isAdditionalPurchase
          ? "追加依頼の内容・納期は、マイページ内チャットで確認した内容に基づきます。"
          : "モニター条件：制作事例への掲載・クチコミへのご協力をお願いしています（ご不同意の場合はオプションが追加となります）。"
        : "維持費はサイトの公開に必要な費用です。お支払いが確認できない場合は公開を停止します。",
    },
    {
      no: 4,
      label: "給付を受領する期日",
      value: project
        ? order?.contractDeliveryDate
          ? formatContractYmd(order.contractDeliveryDate)
          : isAdditionalPurchase
            ? "追加依頼の内容に応じてチャットでご案内します"
            : defaultDeliveryLeadTime
        : "毎月1日から末日までのサポート（初回はご契約日から当月末日まで）",
      note: project
        ? order?.contractDeliveryDate
          ? "運営者が本画面に設定した期日です。進捗はチャットでご案内します。"
          : "素材のご準備や内容のご確認をお待ちする期間は含みません。個別の期日はチャットで確定し、この画面に反映します。"
        : "毎月のご請求となり、期限までにお支払いください。",
    },
    {
      no: 5,
      label: "給付を受領する場所",
      value: order?.contractDeliveryPlace || defaultDeliveryPlace,
      note: project
        ? "制作物は当社がサーバーへ公開し、公開URLをご案内します。紙の成果物のお渡しはありません。"
        : "サポートは本サイトのマイページ内チャット・メールで受けられます。",
    },
    {
      no: 6,
      label: "検査完了期日",
      value:
        project && order?.contractInspectionDeadline
          ? formatContractYmd(order.contractInspectionDeadline)
          : project
            ? defaultInspectionDeadline
            : "当月のサポートは当月末日までに確認をお願いします",
      note: project
        ? "納品（公開）後、マイページのチャットで内容をご確認ください。修正のご要望はこの期間内にお知らせください。"
        : "当月分のサポート内容は、マイページのチャットでご確認いただけます。",
    },
    {
      no: 7,
      label: "報酬の額・支払期日",
      value: project
        ? `${yen(amount)}（税込／前払い・全額）\n支払期日：${dueDateText}`
        : `${yen(amount)}（税込／月額）\n支払期日：${dueDateText}`,
      note: project
        ? "原則として制作開始前の全額前払いです。請求書（Square）に記載の期限までにお支払いください。"
        : "当月分を請求書（Square）に記載の期限までにお支払いください。",
    },
    {
      no: 8,
      label: "支払方法",
      value:
        "Square（スクエア）の請求書によるオンライン決済（クレジットカード等）\n請求書はご登録のメールアドレス宛に届きます。マイページからも決済ページを開けます。",
      note: "銀行振込をご希望の場合は、チャットまたはお問い合わせフォームよりご連絡ください（振込手数料はお客さまのご負担となります）。",
    },
  ];
}

/**
 * 契約条件・注意事項（購入画面の「詳細な条件」で表示します）
 */
export const contractTerms = [
  {
    title: "著作権について",
    body: "制作したホームページの著作権は、原則として運営（ハトノコネクト）に帰属します。お客さまは、ご契約の範囲内でサイトを業務利用いただけます。ソースコード等の譲渡は別途お見積りとなります。",
  },
  {
    title: "修正回数について",
    body: "制作期間中の修正は2回まで無料で対応します。3回目以降の修正は別途費用（1回3,000円〜）となります。公開後の修正は保守サポート費（月1,000円〜）で承ります。維持費はサイトの公開に必要な費用のため、お支払いがない場合はサイトを公開できません。",
  },
  {
    title: "お支払い条件について",
    body: "お見積り金額の全額を、制作開始前にお支払いいただきます（前払い）。マイページで発行する請求書（Square）から、クレジットカード等でお支払いいただけます。銀行振込をご希望の場合はチャットまたはお問い合わせフォームよりご連絡ください。",
  },
  {
    title: "キャンセルについて",
    body: "お支払い前であれば、キャンセルは無料です。お支払い後・制作開始後は、制作進捗に応じた実費をご請求いたします。詳細はお見積りの際にお知らせします。",
  },
  {
    title: "納期について",
    body: "納期はお見積りの時点でお約束します。お客さまのご連絡待ちの期間（素材送付・内容確認など）は、日数の計算から除外させていただきます。個別の期日は購入画面の「給付を受領する期日」「検査完了期日」に表示します。",
  },
  {
    title: "インボイス・領収書について",
    body: "適格請求書（インボイス）・領収書は、ご希望により発行いたします。お支払い時にその旨をお申し付けください。",
  },
] as const;
