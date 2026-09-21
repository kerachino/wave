# ハトノコネクト ホームページ制作代行サイト

地域の法人・店舗さま向けのホームページ制作代行サービスのホームページです。
「お問い合わせ〜契約〜決済」までをサイト内で完結させることを目指した構成です。

## 主な機能

- **お問い合わせフォーム** … 会社名・氏名・メール・相談内容を入力 → Gmail（SMTP）へ送信
- **チャット** … Firestore に保存されるチャット（画面右下の吹き出しから）※設定準備中
- **Google ログイン** … お申し込み時に利用（Firebase Auth）※設定準備中
- **お申し込み・ご契約** … Google ログイン → 申込みフォーム → 契約条件 → お支払い案内
- **オンライン決済（Square）** … マイページから Square の請求書を発行（Square がメール送信）→ お支払い完了を Webhook で受け取り、自動的に制限を解除

## ページ構成

| ルート | 内容 |
| --- | --- |
| `/` | トップページ（キャッチコピー・4つの魅力・基本プラン・流れ・よくある質問） |
| `/price` | 料金プラン（基本プラン＋付け足し・基本条件・維持費・支払い方法） |
| `/works` | 制作事例（実績が出るまでは「モニター募集中」表示） |
| `/contact` | お問い合わせ（メールフォーム／チャット） |
| `/apply` | お申し込み・ご契約（ログイン・フォーム・契約条件・決済案内） |
| `/operator` | 運営者情報 |
| `/law` | 特定商取引法に基づく表記 |
| `/privacy` | プライバシーポリシー |
| `/terms` | 利用規約 |

> 旧 `/service`・`/flow` は `next.config.ts` の設定で `/price` へリダイレクトされます。
> 旧 `/faq` はトップページ内のセクション `/#faq` へ統合しました。

## 開発セットアップ

```bash
npm install
npm run dev
# → http://localhost:3000
```

## 環境変数（.env.local）

`.env.local.example` を参考に `.env.local` を用意してください（Git にはコミットされません）。

| 変数 | 用途 |
| --- | --- |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` | Gmail SMTP によるメール送信 |
| `CONTACT_EMAIL` | お問い合わせ・申込みの送信先メール |
| `NEXT_PUBLIC_FIREBASE_*` | Firebase（チャット・Google ログイン）※未設定なら「準備中」表示 |
| `SQUARE_ACCESS_TOKEN` / `SQUARE_LOCATION_ID` | Square の請求書発行（サーバー側のみ） |
| `SQUARE_ENVIRONMENT` | `sandbox` / `production`（既定は `sandbox`） |
| `SQUARE_WEBHOOK_SIGNATURE_KEY` | Square Webhook の署名検証キー |
| `SQUARE_WEBHOOK_NOTIFICATION_URL` | Square に登録した Webhook の通知 URL（署名検証で一致が必要） |
| `FIREBASE_SERVICE_ACCOUNT_KEY` | Firebase Admin SDK（Webhook での Firestore 更新・ID トークン検証） |

### メール（Gmail）の設定

1. Google アカウントで「アプリ パスワード」を発行（2段階認証の有効化が必要）
2. `SMTP_PASS` にアプリパスワードを設定
3. `CONTACT_EMAIL` に受信先アドレスを設定

### Firebase の設定（チャット・Google ログイン）

1. [Firebase コンソール](https://console.firebase.google.com) でプロジェクト作成
2. 認証プロバイダで「Google」を有効化
3. `NEXT_PUBLIC_FIREBASE_*` を Firebase SDK の設定からコピー
4. `firestore.rules` の内容を Firestore > Rules に貼り付け
5. チャットのルームは `chat_rooms/{uid}/messages` に保存。匿名ログインで uid を発行するため、Firebase コンソールで「匿名認証」も有効化してください

### Square（オンライン決済）の設定

1. [Square Developer](https://developer.squareup.com/apps) でアプリを作成し、Sandbox のアクセストークンとロケーションIDを取得
2. `.env.local` に `SQUARE_ACCESS_TOKEN` / `SQUARE_LOCATION_ID` / `SQUARE_ENVIRONMENT="sandbox"` を設定
3. Webhooks > Subscriptions で通知URLに `https://<公開URL>/api/square/webhook` を登録し、イベント `invoice.payment_made`（あわせて `invoice.canceled`）を選択
4. 生成された Signature Key を `SQUARE_WEBHOOK_SIGNATURE_KEY` に、登録した通知URLを `SQUARE_WEBHOOK_NOTIFICATION_URL` に設定
5. 本番リリース時は `SQUARE_ENVIRONMENT="production"` と本番のトークン・署名キーへ切り替え

#### 決済の流れ

1. お客さまがマイページ（`/dashboard/payment`）で「Squareで請求書を受け取る」を押す
2. アプリが Square の Invoices API で請求書を作成 → 公開（publish）し、Square がお客さまへ請求書メールを送信
3. お客さまがお支払いを完了すると、Square から `invoice.payment_made` が `/api/square/webhook` に届く
4. アプリが署名（`x-square-hmacsha256-signature`）を検証し、`orders/{uid}` を支払い済みに更新して制限（`accessUnlocked`）を解除
5. マイページのチャットなど、制限されていた機能が利用可能になる

> 金額はサーバー側の `orders/{uid}` の内容（基本プラン＋付け足し／維持費）から組み立てます。
> 請求書の再発行は行わず、発行済みの請求書を再利用します（二重請求の防止）。
> Firestore のセキュリティルールにより、決済状況と制限解除はサーバー（Admin SDK）だけが書き込めます。

## デプロイ（Netlify）

Netlify の Git 連携でデプロイできます。

- ビルドコマンド: `npm run build`
- 公開ディレクトリ: `.next`
- Next.js プラグイン: `@netlify/plugin-nextjs`（netlify.toml に記載済み）
- Node バージョン: 20（netlify.toml に設定済み）

## 主な設定変更場所

- 屋号・連絡先・料金などの基本情報: `lib/site.ts`
- お問い合わせのメール本文・送信処理: `app/api/contact/route.ts`
- 申込みフォームの送信処理: `app/api/apply/route.ts`
- チャット・Firebase 初期化: `lib/firebase.ts`
- Square 連携（請求書の発行・署名検証）: `lib/square.ts`
- 請求書の発行 API: `app/api/square/invoice/route.ts`
- Square Webhook（支払い確認・制限解除）: `app/api/square/webhook/route.ts`
- Firebase Admin（サーバー側の Firestore 更新）: `lib/firebase-admin.ts`
- 決済データの型・制限判定: `lib/model.ts`

## 保留事項（TODO）

- Firebase プロジェクト作成と `.env.local` への設定反映
- 実績ページ（`/works`）への Before/After・お客さまの声の掲載
- 運営者氏名・詳細住所など、`lib/site.ts` 内のプレースホルダー更新
