export type PurchasableOption = {
  id: string;
  name: string;
  defaultPrice: number;
  description?: string;
  displayPrice?: string;
};
export type OrderOption = PurchasableOption & { price: number };

/** Square に作成・公開した請求書の情報（決済の進捗表示に使用します） */
export type SquareInvoiceInfo = {
  /** Square の請求書ID（inv:...） */
  id: string;
  /** Square の注文ID */
  orderId?: string;
  /** お客さまが支払いをする Square の決済ページURL */
  publicUrl?: string;
  /** DRAFT / UNPAID / PAID などのステータス */
  status?: string;
  version?: number;
  /** 請求金額（円） */
  amount: number;
  /** 支払期限（YYYY-MM-DD） */
  dueDate?: string;
  /** 請求書を公開（メール送信）した日時 */
  publishedAt?: Date | string;
  /** 支払いが完了した日時（Webhook で記録） */
  paidAt?: Date | string;
};

export type Order = {
  uid: string;
  basePrice: number;
  options: OrderOption[];
  totalPrice: number;
  firstAmount: number;
  remainingAmount: number;
  status: "pending_payment" | "contracted";
  paymentStatus: "unpaid" | "paid";
  note?: string;
  purchaseApproved?: boolean;
  subscriptionApproved?: boolean;
  subscriptionPrice?: number;
  subscriptionStatus?: "unpaid" | "paid" | "cancelled";
  // ---- Square 決済 ----
  /** Square 側の顧客ID（初回の請求書作成時に保存） */
  squareCustomerId?: string;
  /** 本契約の請求書 */
  projectInvoice?: SquareInvoiceInfo;
  /** 維持費サブスクの請求書 */
  subscriptionInvoice?: SquareInvoiceInfo;
  /** 決済を確認した日時（Webhook で記録） */
  paidAt?: Date | string;
  /** 決済を確認した金額（円） */
  paidAmount?: number;
  /** 決済確認後に true になる制限解除フラグ（サーバーのみ書き込み可） */
  accessUnlocked?: boolean;
  /** 制限を解除した日時（Webhook で記録） */
  accessUnlockedAt?: Date | string;
};

/** Firestore の Timestamp / Date / 文字列を Date に変換します */
export function toDate(value: unknown): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value === "string") {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  const maybe = value as { toDate?: () => Date };
  if (typeof maybe.toDate === "function") {
    try {
      return maybe.toDate();
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * お支払い確認後に利用できる機能（チャットなど）の制限が
 * 解除されているかを判定します。
 * Webhook（invoice.payment_made）で `accessUnlocked` が true になります。
 */
export function isAccessUnlocked(order: Order | null | undefined): boolean {
  if (!order) return false;
  return (
    order.accessUnlocked === true ||
    order.paymentStatus === "paid" ||
    order.subscriptionStatus === "paid"
  );
}
export type QuoteOption = { id: string; name: string; price: number };
export type Quote = {
  id: string;
  uid: string;
  title: string;
  basePrice: number;
  options: QuoteOption[];
  totalPrice: number;
  firstAmount: number;
  remainingAmount: number;
  note?: string;
  recipientName: string;
  issueDate: string;
  validUntil: string;
  precautions: string[];
  createdAt?: Date;
};
export const basePlanPrice = 9800;
export const maintenanceSubscriptionPrice = 2000;
export const basePlanName = "基本プラン";
export const basePlanDescription =
  "まずは1ページ。お店や会社の紹介ページを最短スピードで公開します。";
export const basePlanFeatures = [
  "1ページ制作（LP・紹介ページ）",
  "スマホ対応",
  "お問い合わせ先の掲載",
  "画像や文章の用意",
] as const;
export const purchasableOptions: PurchasableOption[] = [
  {
    id: "add-page",
    name: "ページ追加",
    defaultPrice: 5000,
    displayPrice: "1ページ 5,000円〜",
    description: "2ページ目から1ページごとに追加します。",
  },
  {
    id: "contact-form",
    name: "お問い合わせフォーム設置",
    defaultPrice: 3000,
    displayPrice: "3,000円",
    description: "メール通知付きのフォームを設置します。",
  },
  {
    id: "writing",
    name: "原稿作成サポート",
    defaultPrice: 3000,
    displayPrice: "3,000円〜",
    description: "ヒアリング内容から文章のたたき台を作ります。",
  },
  {
    id: "photo",
    name: "素材用意・画像調整",
    defaultPrice: 5000,
    displayPrice: "1回 5,000円〜",
    description: "数枚程度の画像素材を用意・調整します。",
  },
  {
    id: "blog",
    name: "ブログ・お知らせ更新機能",
    defaultPrice: 5000,
    displayPrice: "5,000円〜",
    description: "自分で更新できるお知らせ欄などを追加します。",
  },
  {
    id: "app-dev",
    name: "自社アプリの開発",
    defaultPrice: 5000,
    displayPrice: "要相談(5,000円～対応可能)",
    description: "自社アプリの開発・連携をご相談いただけます。",
  },
  {
    id: "mo",
    name: "モニター条件への不同意",
    defaultPrice: 5000,
    displayPrice: "5,000円",
    description: "モニター条件に同意いただけない場合の追加料金です。",
  },
];
export function yen(value: number) {
  return `${value.toLocaleString("ja-JP")}円`;
}
export function computeAmounts(basePrice: number, options: OrderOption[]) {
  const totalPrice =
    basePrice + options.reduce((sum, option) => sum + option.price, 0);
  return { totalPrice, firstAmount: totalPrice, remainingAmount: 0 };
}
