export type PurchasableOption = {
  id: string;
  name: string;
  defaultPrice: number;
};
export type OrderOption = PurchasableOption & { price: number };
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
};
export const basePlanPrice = 7500;
export const purchasableOptions: PurchasableOption[] = [
  { id: "copy", name: "文章作成サポート", defaultPrice: 3000 },
  { id: "photo", name: "写真撮影・素材サポート", defaultPrice: 5000 },
  { id: "update", name: "公開後の更新サポート", defaultPrice: 3000 },
];
export function yen(value: number) {
  return `${value.toLocaleString("ja-JP")}円`;
}
export function computeAmounts(basePrice: number, options: OrderOption[]) {
  const totalPrice =
    basePrice + options.reduce((sum, option) => sum + option.price, 0);
  const firstAmount = Math.floor(totalPrice * 0.5);
  return { totalPrice, firstAmount, remainingAmount: totalPrice - firstAmount };
}
