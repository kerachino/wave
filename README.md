# ハトノコネクト ホームページ制作代行サイト

地域の法人・店舗さま向けのホームページ制作代行サービスのホームページです。
「お問い合わせ〜契約〜決済」までをサイト内で完結させることを目指した構成です。

## 主な機能

- **お問い合わせフォーム** … 会社名・氏名・メール・相談内容を入力 → Gmail（SMTP）へ送信
- **チャット** … Firestore に保存されるチャット（画面右下の吹き出しから）※設定準備中
- **Google ログイン** … お申し込み時に利用（Firebase Auth）※設定準備中
- **お申し込み・ご契約** … Google ログイン → 申込みフォーム → 契約条件 → お支払い案内
- **決済代行（カード決済）** … **未定のため保留**。現在は銀行振込のみ。導入後に展開予定

## ページ構成

| ルート | 内容 |
| --- | --- |
| `/` | トップページ（キャッチコピー・4つの魅力・お試しプラン・流れ） |
| `/price` | 料金プランと制作の流れ（プラン表・お試し条件・8ステップの流れ・納期目安・維持費・支払い方法） |
| `/works` | 制作事例（実績が出るまでは「モニター募集中」表示） |
| `/faq` | よくある質問 |
| `/contact` | お問い合わせ（メールフォーム／チャット） |
| `/apply` | お申し込み・ご契約（ログイン・フォーム・契約条件・決済案内） |
| `/operator` | 運営者情報 |
| `/law` | 特定商取引法に基づく表記 |
| `/privacy` | プライバシーポリシー |

> 旧 `/service`・`/flow` は `next.config.ts` の設定で `/price` へリダイレクトされます。

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

## 保留事項（TODO）

- 決済代行サービス（Stripe 等）の選定と決済ページの実装
- Firebase プロジェクト作成と `.env.local` への設定反映
- 実績ページ（`/works`）への Before/After・お客さまの声の掲載
- 運営者氏名・詳細住所など、`lib/site.ts` 内のプレースホルダー更新
