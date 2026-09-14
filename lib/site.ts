// ============================================================
// サイト全体の設定をまとめたファイル
// 屋号・連絡先・料金などの情報を変更するときは、このファイルを
// 編集してください。
// ============================================================

export const site = {
  // 屋号（ブランド名）
  name: "ハトノコネクト",
  // サイトのキャッチコピー
  tagline: "会社のホームページ、まるごとお任せください",

  // お問い合わせ受付（Gmail）
  email: "hatonoconnect@outlook.com",
  // サイトURL（公開後に置き換えてください）
  url: "https://hatonoconnect.jp",
  // 返信目安
  replyTime: "2〜3営業日以内",
  // 電話対応なしの旨
  noPhone:
    "電話での対応は行っておりません。メール・チャットにてご連絡ください。",

  // ---- 運営者情報 ----
  // 「本社」ではなく「事業所」表記（個人事業のため）
  operator: {
    tradeName: "ハトノコネクト",
    // 代表者氏名（※ 実際の氏名に置き換えてください）
    representative: "※代表者名（未設定）",
    // 事業所（都道府県まで記載）
    office: "東京都渋谷区",
    // 詳細住所（※ 実際の住所に置き換えてください）
    officeDetail: "※東京都渋谷区内（詳細住所はお問い合わせ時にご案内します）",
    // 対応エリア
    area: "茨城県守谷市を中心に全国対応（オンラインでの打ち合わせ）",
    // 連絡先メール
    email: "hatonoconnect@outlook.com",
    // 事業開始時期（※ 実績に合わせて更新）
    established: "2026年",
  },
};

// ナビゲーション（ヘッダー・フッターで共通利用）
export const navItems = [
  { href: "/price", label: "料金・流れ" },
  { href: "/works", label: "制作事例" },
  { href: "/faq", label: "よくある質問" },
  { href: "/contact", label: "お問い合わせ" },
] as const;

// フッターの補助リンク
export const footerLinks = [
  { href: "/apply", label: "お申し込み・ご契約" },
  { href: "/operator", label: "運営者情報" },
  { href: "/law", label: "特定商取引法に基づく表記" },
  { href: "/privacy", label: "プライバシーポリシー" },
] as const;

// ---- 料金プラン（価格は見直しできるよう、ここで一元管理） ----
export const plans = [
  {
    id: "trial",
    name: "お試しプラン",
    price: "5,500円",
    priceNote: "税込／先着順・モニター限定",
    description: "まずは1ページ。お店の紹介ページを最短スピードで公開。",
    features: [
      "1ページ制作（LP・紹介ページ）",
      "スマホ対応",
      "モニター価格",
      "事例掲載・クチコミへの協力",
    ],
    cta: "お試しプランで申し込む",
    featured: false,
  },
  {
    id: "light",
    name: "ライトプラン",
    price: "55,000円",
    priceNote: "税込〜",
    description: "小規模な会社・店舗さま向け。3〜5ページの定番サイト。",
    features: [
      "3〜5ページ制作",
      "スマホ対応",
      "お問い合わせフォーム",
      "公開後の修正サポート（初回分）",
    ],
    cta: "ライトプランで申し込む",
    featured: true,
  },
  {
    id: "standard",
    name: "スタンダードプラン",
    price: "110,000円",
    priceNote: "税込〜",
    description: "しっかり作り込みたい方向け。6ページ以上・多機能サイト。",
    features: [
      "6ページ以上制作",
      "スマホ対応",
      "お問い合わせフォーム",
      "ブログ・実績ページなど",
      "公開後の修正サポート（初回分）",
    ],
    cta: "スタンダードプランで申し込む",
    featured: false,
  },
] as const;
