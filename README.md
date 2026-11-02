# ハトノコネクト ホームページ制作代行サイト

地域の法人・店舗さま向けのホームページ制作代行サービスのホームページです。
「お問い合わせ〜契約〜決済」までをサイト内で完結させることを目指した構成です。

## 主な機能

- **お問い合わせフォーム** … 会社名・氏名・メール・相談内容を入力 → Gmail（SMTP）へ送信
- **チャット** … Firestore に保存されるチャット（画面右下の吹き出しから）※設定準備中
- **Google ログイン** … お申し込み・マイページの利用時に使用（Firebase Auth）※設定準備中
- 1人のお客さまが複数のご依頼を持てるよう、ご依頼を `projects/{projectId}` で管理します。概要画面では金額等内容を表示せず、ステップと本契約・維持費の完了状況、切替先を表示します。
- **概要** … 進行ステップ・本契約／維持費の完了状況・ご依頼の切り替え（契約金額や内容は非表示）
- **マイページ（購入・契約）** … 運営者が依頼ごとの購入内容と取引条件を設定 → お客さまが取引条件8項目を確認・同意して購入
- **オンライン決済（Square）** … マイページから Square の請求書を発行（Square がメール送信）→ お支払い完了を Webhook で受け取り、自動的に制限を解除
- **同意ログ** … 購入ボタン押下時に「いつ・誰が・何に同意したか」（日時・バージョン・同意者・明示内容の写し）をサーバーで記録

## ページ構成

| ルート              | 内容                                                                      |
| ------------------- | ------------------------------------------------------------------------- |
| `/`                 | トップページ（キャッチコピー・4つの魅力・基本プラン・流れ・よくある質問） |
| `/price`            | 料金プラン（基本プラン＋付け足し・基本条件・維持費・支払い方法）          |
| `/works`            | 制作事例（実績が出るまでは「モニター募集中」表示）                        |
| `/contact`          | お問い合わせ（メールフォーム／チャット）＝お申し込みの入口                |
| `/login`            | Google ログイン                                                           |
| `/dashboard`        | マイページ（進行ステップ・本契約／維持費の完了状況・複数依頼の切替）    |
| `/dashboard/payment`| お支払い・購入（取引条件の明示・同意チェック・同意ログ・Square 請求書）    |
| `/dashboard/chat`   | 担当者とのチャット                                                        |
| `/admin`            | 運営者用（購入許可・契約条件・見積書・チャット・決済設定）                |
| `/operator`         | 運営者情報                                                                |
| `/law`              | 特定商取引法に基づく表記                                                  |
| `/privacy`          | プライバシーポリシー                                                      |
| `/terms`            | 利用規約                                                                  |

> 旧 `/service`・`/flow` は `next.config.ts` の設定で `/price` へリダイレクトされます。
> 旧 `/apply`（お申し込みフォーム）は廃止し、`/price` へリダイレクトされます。購入はマイページ（`/dashboard/payment`）に統合しました。
> 旧 `/faq` はトップページ内のセクション `/#faq` へ統合しました。

## 開発セットアップ

```bash
npm install
npm run dev
# → http://localhost:3000
```

## 環境変数（.env.local）

`.env.local.example` を参考に `.env.local` を用意してください（Git にはコミットされません）。

| 変数                                                  | 用途                                                               |
| ----------------------------------------------------- | ------------------------------------------------------------------ |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` | Gmail SMTP によるメール送信                                        |
| `CONTACT_EMAIL`                                       | お問い合わせの送信先メール                                         |
| `NEXT_PUBLIC_FIREBASE_*`                              | Firebase（チャット・Google ログイン）※未設定なら「準備中」表示     |
| `SQUARE_ACCESS_TOKEN` / `SQUARE_LOCATION_ID`          | Square の請求書発行（サーバー側のみ）                              |
| `SQUARE_ENVIRONMENT`                                  | `sandbox` / `production`（既定は `sandbox`）                       |
| `SQUARE_WEBHOOK_SIGNATURE_KEY`                        | Square Webhook の署名検証キー                                      |
| `SQUARE_WEBHOOK_NOTIFICATION_URL`                     | Square に登録した Webhook の通知 URL（署名検証で一致が必要）       |
| `FIREBASE_SERVICE_ACCOUNT_KEY`                        | Firebase Admin SDK（Webhook での Firestore 更新・ID トークン検証） |

### メール（Gmail）の設定

1. Google アカウントで「アプリ パスワード」を発行（2段階認証の有効化が必要）
2. `SMTP_PASS` にアプリパスワードを設定
3. `CONTACT_EMAIL` に受信先アドレスを設定

### Firebase の設定（チャット・Google ログイン）

1. [Firebase コンソール](https://console.firebase.google.com) でプロジェクト作成
2. 認証プロバイダで「Google」を有効化
3. `NEXT_PUBLIC_FIREBASE_*` を Firebase SDK の設定からコピー
4. 最新の `firestore.rules` の内容を Firestore > Rules に貼り付けて公開
5. Firebase コンソールで「匿名認証」も有効化してください。チャット開始時に匿名ユーザーを作成し、ログイン画面でGoogleログインすると同じFirebase UIDのままGoogleアカウントへリンクします。チャット履歴とユーザー情報はそのUIDに紐づくため、管理画面でも別ユーザーにはなりません
6. Googleリンクできない場合（Googleアカウントがすでに別UIDに紐づいている等）は、別アカウントでログインする必要があります
7. チャットのメッセージは100文字以内、ユーザーからの送信は5秒に1回までです。この制限は画面側に加えてFirestoreルールでも検証するため、ルールを変更した場合は必ず最新の `firestore.rules` をFirebaseコンソールへ再適用してください

### Square（オンライン決済）の設定

1. [Square Developer](https://developer.squareup.com/apps) でアプリを作成し、Sandbox のアクセストークンとロケーションIDを取得
2. `.env.local` に `SQUARE_ACCESS_TOKEN` / `SQUARE_LOCATION_ID` / `SQUARE_ENVIRONMENT="sandbox"` を設定
3. Webhooks > Subscriptions で通知URLに `https://<公開URL>/api/square/webhook` を登録し、イベント `invoice.payment_made`（あわせて `invoice.canceled`）を選択
4. 生成された Signature Key を `SQUARE_WEBHOOK_SIGNATURE_KEY` に、登録した通知URLを `SQUARE_WEBHOOK_NOTIFICATION_URL` に設定
5. 本番リリース時は `SQUARE_ENVIRONMENT="production"` と本番のトークン・署名キーへ切り替え

#### 決済の流れ

1. 運営者が `/admin` の「購入許可」で金額を、「契約条件」で発注者名・納期・検査完了期日・受領場所を設定
2. お客さまがマイページ（`/dashboard/payment`）で取引条件8項目と契約条件を確認し、同意チェックを入れる（チェックがないと購入ボタンは押せません）
3. 購入ボタン（「同意して購入する」）を押すと `/api/square/invoice` が同意を検証し、同意ログを記録してから Square の Invoices API で請求書を作成 → 公開（publish）し、Square がお客さまへ請求書メールを送信
4. お客さまがお支払いを完了すると、Square から `invoice.payment_made` が `/api/square/webhook` に届く
5. アプリが署名（`x-square-hmacsha256-signature`）を検証し、`orders/{uid}` を支払い済みに更新して制限（`accessUnlocked`）を解除
6. お支払い確認後、制作開始など次の手続きへ進めます（チャットはお支払い前から利用できます）

> 金額はサーバー側の `projects/{projectId}` の内容（基本プラン＋付け足し／維持費）から組み立てます。旧 `orders/{uid}` からの移行データも対象です。
> 請求書の再発行は行わず、発行済みの請求書を再利用します（二重請求の防止）。
> Firestore のセキュリティルールにより、決済状況・制限解除・同意ログはサーバー（Admin SDK）と運営（isAdmin）だけが書き込めます。

#### 取引条件の明示と同意ログ

- 明示する項目は `lib/contract.ts` の `buildContractDisclosures()` が一元生成します（発注者・受注者の名称／業務委託をした日／給付の内容／給付を受領する期日／給付を受領する場所／検査完了期日／報酬の額・支払期日／支払方法の8項目）。
- 内容を改定したときは `contractVersion` を更新してください。古いバージョンで同意しようとしたリクエストは `409` で拒否され、再読み込みを促します。
- 同意ログは、購入ボタン押下時にサーバーが次の内容を保存します（クライアントからは書き込み不可のため改ざんできません）。
  - `projects/{projectId}.projectConsent` / `projects/{projectId}.subscriptionConsent`
    … 同意日時（サーバー時刻）・同意したバージョン・uid・メールアドレス・金額・IP・ブラウザ・明示内容の写し
  - `purchase_consents/{id}`
    … 上書きされない追記専用の監査アーカイブ
- 保存された同意ログは、お客さまの購入画面と `/admin` の「契約条件」タブで確認できます。

## デプロイ（Netlify）

Netlify の Git 連携でデプロイできます。

- ビルドコマンド: `npm run build`
- 公開ディレクトリ: `.next`
- Next.js プラグイン: `@netlify/plugin-nextjs`（netlify.toml に記載済み）
- Node バージョン: 20（netlify.toml に設定済み）

## 主な設定変更場所

- 屋号・連絡先・料金などの基本情報: `lib/site.ts`
- お問い合わせのメール本文・送信処理: `app/api/contact/route.ts`
- 取引条件（明示8項目・契約条件・バージョン）: `lib/contract.ts`
- 購入（お支払い）画面: `app/dashboard/payment/page.tsx`
- 運営者の契約条件設定: `components/admin/ContractPanel.tsx`
- チャット・Firebase 初期化: `lib/firebase.ts`
- Square 連携（請求書の発行・署名検証）: `lib/square.ts`
- 請求書の発行 API（同意の検証・同意ログの記録）: `app/api/square/invoice/route.ts`
- Square Webhook（支払い確認・制限解除）: `app/api/square/webhook/route.ts`
- Firebase Admin（サーバー側の Firestore 更新）: `lib/firebase-admin.ts`
- 複数ご依頼の共通定義: `lib/projects.ts`
- 概要・進行ステップ: `app/dashboard/page.tsx`
- 決済データの型・制限判定: `lib/model.ts`

## 保留事項（TODO）

- Firebase プロジェクト作成と `.env.local` への設定反映
- 実績ページ（`/works`）への Before/After・お客さまの声の掲載
- 運営者氏名・詳細住所など、`lib/site.ts` 内のプレースホルダー更新
- 取引条件（`lib/contract.ts`）を改定したときは `contractVersion` の更新と、`/law`・`/terms` の記載との整合を確認
