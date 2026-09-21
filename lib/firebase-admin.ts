// ============================================================
// Firebase Admin SDK（サーバー専用）
// Webhook の署名検証後の Firestore 更新や、API の ID トークン検証に使用します。
//
// `.env.local` に以下のどちらかを設定してください。
//   1) FIREBASE_SERVICE_ACCOUNT_KEY … サービスアカウント JSON を 1 行にした文字列
//   2) FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY
//
// このファイルはサーバー側（Route Handler）からのみ import してください。
// ============================================================
import {
  cert,
  getApps,
  initializeApp,
  type App,
} from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

type ServiceAccount = {
  projectId: string;
  clientEmail: string;
  privateKey: string;
};

/** 改行コード（\n のエスケープ）を実際の改行に戻す。Netlify等での登録ミス（前後の引用符・空白）も吸収する */
function normalizePrivateKey(value: string) {
  let key = value.trim();
  // NetlifyのUIで "-----BEGIN..." と引用符付きで貼られた場合を吸収
  if (
    (key.startsWith('"') && key.endsWith('"')) ||
    (key.startsWith("'") && key.endsWith("'"))
  ) {
    key = key.slice(1, -1).trim();
  }
  // JSON内に二重エスケープ(\\n)で入っている場合と、素の \n 文字列の場合の両方を戻す
  // ※二重→単一の順で置換しないと、残ったバックスラッシュで cert() が失敗する
  key = key.replace(/\\\\n/g, "\n").replace(/\\n/g, "\n");
  return key;
}

/** PEM形式として最低限の形をしているか（詳細な検証は cert() 側で行う） */
function looksLikePem(key: string) {
  return (
    key.includes("-----BEGIN PRIVATE KEY-----") &&
    key.includes("-----END PRIVATE KEY-----")
  );
}

/** 環境変数からサービスアカウント情報を読み取る（未設定なら null） */
export function readServiceAccountDebug(): {
  serviceAccount: ServiceAccount | null;
  privateKeyValid: boolean;
  rawJsonParseOk: boolean;
} {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (raw && raw.trim() !== "") {
    try {
      const parsed = JSON.parse(raw) as {
        project_id?: string;
        client_email?: string;
        private_key?: string;
      };
      if (parsed.project_id && parsed.client_email && parsed.private_key) {
        const privateKey = normalizePrivateKey(parsed.private_key);
        return {
          serviceAccount: {
            projectId: parsed.project_id,
            clientEmail: parsed.client_email,
            privateKey,
          },
          privateKeyValid: looksLikePem(privateKey),
          rawJsonParseOk: true,
        };
      }
      console.error(
        "FIREBASE_SERVICE_ACCOUNT_KEY に project_id / client_email / private_key が含まれていません。",
      );
      return { serviceAccount: null, privateKeyValid: false, rawJsonParseOk: true };
    } catch (error) {
      console.error(
        "FIREBASE_SERVICE_ACCOUNT_KEY を JSON として解析できませんでした。サービスアカウントの JSON を改行コードごと 1 行の文字列にして設定してください（代わりに FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY でも可）。",
        error,
      );
      return { serviceAccount: null, privateKeyValid: false, rawJsonParseOk: false };
    }
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY;
  if (projectId && clientEmail && privateKeyRaw) {
    const privateKey = normalizePrivateKey(privateKeyRaw);
    return {
      serviceAccount: { projectId, clientEmail, privateKey },
      privateKeyValid: looksLikePem(privateKey),
      rawJsonParseOk: true,
    };
  }
  return { serviceAccount: null, privateKeyValid: false, rawJsonParseOk: true };
}

function readServiceAccount(): ServiceAccount | null {
  const { serviceAccount, privateKeyValid } = readServiceAccountDebug();
  if (!serviceAccount) return null;
  if (!privateKeyValid) {
    console.error(
      "Firebase Admin の秘密鍵がPEM形式ではありません。FIREBASE_PRIVATE_KEY の \\n が正しく改行に戻っているか、前後に引用符が付いていないか確認してください。",
    );
    return null;
  }
  return serviceAccount;
}

export const isFirebaseAdminConfigured = readServiceAccount() !== null;

/** 管理者用診断: どちらの経路で設定されているか（秘密鍵の値は返さない）。 */
export function firebaseAdminConfigStatus() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  return {
    configured: isFirebaseAdminConfigured,
    hasServiceAccountKey: Boolean(raw && raw.trim() !== ""),
    hasSplitKeys: Boolean(
      process.env.FIREBASE_PROJECT_ID &&
        process.env.FIREBASE_CLIENT_EMAIL &&
        process.env.FIREBASE_PRIVATE_KEY,
    ),
  };
}

let adminApp: App | null = null;

function initAdminApp(): App | null {
  if (adminApp) return adminApp;
  const serviceAccount = readServiceAccount();
  if (!serviceAccount) return null;
  if (getApps().length > 0) {
    adminApp = getApps()[0];
    return adminApp;
  }
  try {
    adminApp = initializeApp({
      credential: cert({
        projectId: serviceAccount.projectId,
        clientEmail: serviceAccount.clientEmail,
        privateKey: serviceAccount.privateKey,
      }),
      projectId: serviceAccount.projectId,
    });
  } catch (error) {
    console.error("Firebase Admin SDK の初期化に失敗しました:", error);
    return null;
  }
  return adminApp;
}

/** Firestore（Admin）。未設定の場合は null を返します。 */
export function adminDb(): Firestore | null {
  const app = initAdminApp();
  return app ? getFirestore(app) : null;
}

/** Firebase Auth（Admin）。未設定の場合は null を返します。 */
export function adminAuth(): Auth | null {
  const app = initAdminApp();
  return app ? getAuth(app) : null;
}

/** `Authorization: Bearer xxx` ヘッダーから ID トークンを取り出す */
export function bearerToken(request: Request): string | null {
  const header = request.headers.get("authorization");
  if (!header) return null;
  const match = /^Bearer\s+(.+)$/i.exec(header.trim());
  return match ? match[1].trim() : null;
}
