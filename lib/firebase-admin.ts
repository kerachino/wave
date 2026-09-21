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

/** 改行コード（\n のエスケープ）を実際の改行に戻す */
function normalizePrivateKey(value: string) {
  return value.replace(/\\n/g, "\n");
}

/** 環境変数からサービスアカウント情報を読み取る（未設定なら null） */
function readServiceAccount(): ServiceAccount | null {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (raw && raw.trim() !== "") {
    try {
      const parsed = JSON.parse(raw) as {
        project_id?: string;
        client_email?: string;
        private_key?: string;
      };
      if (parsed.project_id && parsed.client_email && parsed.private_key) {
        return {
          projectId: parsed.project_id,
          clientEmail: parsed.client_email,
          privateKey: normalizePrivateKey(parsed.private_key),
        };
      }
      console.error(
        "FIREBASE_SERVICE_ACCOUNT_KEY に project_id / client_email / private_key が含まれていません。",
      );
    } catch (error) {
      console.error(
        "FIREBASE_SERVICE_ACCOUNT_KEY を JSON として解析できませんでした。サービスアカウントの JSON を改行コードごと 1 行の文字列にして設定してください（代わりに FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY でも可）。",
        error,
      );
    }
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  if (projectId && clientEmail && privateKey) {
    return {
      projectId,
      clientEmail,
      privateKey: normalizePrivateKey(privateKey),
    };
  }
  return null;
}

export const isFirebaseAdminConfigured = readServiceAccount() !== null;

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
