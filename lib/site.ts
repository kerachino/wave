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

// ナビゲーション（メインページのみ。契約・規約系はフッターに分離）
export const navItems = [
  { href: "/", label: "ホーム" },
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

// ---- 料金（基本プラン＋付け足し形式で一元管理） ----
export const basePlan = {
  id: "basic",
  name: "基本プラン",
  price: "5,500円",
  priceNote: "税込／モニター限定・先着順",
  description:
    "まずは1ページ。お店や会社の紹介ページを最短スピードで公開します。足りない分は、必要なものだけ付け足せます。",
  features: [
    "1ページ制作（LP・紹介ページ）",
    "スマホ対応",
    "お問い合わせ先の掲載（電話・メール・SNSへのリンク）",
    "お手持ち写真の明るさ・サイズ調整",
    "公開後の表示確認",
  ],
  monitorNote: "モニター条件：制作事例への掲載・クチコミへのご協力",
  cta: "基本プランで申し込む",
  featured: true,
} as const;

export const addons = [
  {
    id: "add-page",
    name: "ページ追加",
    price: "1ページ 5,000円〜",
    description:
      "2ページ目からは1ページごとに追加します。3〜5ページの定番サイトもこの追加で対応できます。",
  },
  {
    id: "contact-form",
    name: "お問い合わせフォーム設置",
    price: "5,000円〜",
    description:
      "メール通知付きのフォームを設置します。迷惑メール対策も含みます。",
  },
  {
    id: "writing",
    name: "原稿作成サポート",
    price: "1ページ 3,000円〜",
    description:
      "ヒアリング内容から文章のたたき台を作ります。原稿がなくても大丈夫です。",
  },
  {
    id: "photo",
    name: "写真撮影・画像調整",
    price: "1回 10,000円〜",
    description:
      "出張・人数により変動します。お手持ち写真の補正は基本プラン内で対応します。",
  },
  {
    id: "blog",
    name: "ブログ・お知らせ更新機能",
    price: "10,000円〜",
    description:
      "自分で更新できるお知らせ欄・ブログ・実績ページなどを追加します。",
  },
  {
    id: "revision",
    name: "修正3回目以降",
    price: "1回 3,000円〜",
    description:
      "制作中の修正は2回まで無料。3回目以降はこちらで対応します。",
  },
] as const;

export const planExamples = [
  {
    name: "1ページのみ",
    total: "5,500円",
    breakdown: "基本プランのみ",
  },
  {
    name: "3ページの定番サイト",
    total: "15,500円〜",
    breakdown: "基本5,500円 ＋ ページ追加2ページ分",
  },
  {
    name: "5ページ＋フォーム付き",
    total: "30,500円〜",
    breakdown: "基本5,500円 ＋ ページ追加4ページ分 ＋ フォーム設置",
  },
] as const;

// ---- 維持費（重要事項のため分かりやすく・1つに集約） ----
export const maintenance = {
  price: "月1,000円〜",
  priceNote: "税込／任意加入・いつでも解約OK",
  lead: "ホームページは作って終わりではありません。公開後も安心して使い続けられるよう、維持費はシンプルに1つだけです。加入しない場合もサイトはそのまま使えます。",
  items: [
    {
      title: "小さな修正・更新（月1回程度）",
      body: "営業時間・メニュー・写真差し替えなどの小さな変更に対応します。",
    },
    {
      title: "表示・セキュリティの見守り",
      body: "サイトが正しく表示されているか定期確認します。異常があればご連絡します。",
    },
    {
      title: "困ったときの相談",
      body: "「ここを変えたい」「表示がおかしい」など、メール・チャットで相談できます。",
    },
  ],
  hosting: "サイトを置くサーバー（Netlify）は無料のため、サーバー代はかかりません。",
  domain:
    "独自ドメインを使う場合のみ、年間1,000円前後の実費がかかります。使わない場合（無料アドレス）は0円です。",
  note: "保守サポートは任意です。単発で直したいときはスポット修正（1回3,000円〜）も可能です。",
} as const;

// 後方互換（旧3プラン参照が残っていても壊れないように）
export const plans = [
  {
    id: basePlan.id,
    name: basePlan.name,
    price: basePlan.price,
    priceNote: basePlan.priceNote,
    description: basePlan.description,
    features: [...basePlan.features, basePlan.monitorNote],
    cta: basePlan.cta,
    featured: true,
  },
] as const;
