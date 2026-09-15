// ============================================================
// Firebase 初期化（チャット・Googleログイン用）
// .env.local に NEXT_PUBLIC_FIREBASE_* が設定されている場合のみ有効化。
// 未設定の場合は isFirebaseConfigured = false となり、
// チャットは「準備中」表示、Googleログインは利用不可になります。
// ============================================================
import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  type Auth,
  type User,
} from "firebase/auth";
import {
  getFirestore,
  getDoc,
  collection,
  doc,
  addDoc,
  setDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  type Firestore,
  type DocumentData,
  type QuerySnapshot,
} from "firebase/firestore";
import { initializeFirestore, persistentLocalCache } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId,
);

let app: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;

function init() {
  if (!isFirebaseConfigured) return;
  if (!app) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  }
  if (!authInstance) authInstance = getAuth(app);
  if (!dbInstance) {
    try {
      dbInstance = initializeFirestore(app, { localCache: persistentLocalCache() });
    } catch {
      dbInstance = getFirestore(app);
    }
  }
}

init();

export const auth: Auth | null = isFirebaseConfigured ? authInstance : null;
export const db: Firestore | null = isFirebaseConfigured ? dbInstance : null;

export const googleProvider = isFirebaseConfigured
  ? new GoogleAuthProvider()
  : null;

// ---- チャット用の便利関数（未設定時は null を返す） ----

export type ChatMessage = {
  id: string;
  sender: "user" | "staff";
  text: string;
  createdAt?: Date;
};

/** 指定ルームのメッセージをリアルタイム購読する */
export function subscribeChat(
  roomId: string,
  onUpdate: (messages: ChatMessage[]) => void,
  onError: (error: unknown) => void,
): (() => void) | null {
  if (!db) return null;
  const cacheKey = `hatono-chat:${roomId}`;
  if (typeof window !== "undefined") {
    try {
      const cached = JSON.parse(localStorage.getItem(cacheKey) || "null") as ChatMessage[] | null;
      if (cached?.length) onUpdate(cached.map((message) => ({ ...message, createdAt: message.createdAt ? new Date(message.createdAt) : undefined })));
    } catch {
      localStorage.removeItem(cacheKey);
    }
  }
  const roomDoc = doc(db, "chat_rooms", roomId);
  const q = query(
    collection(roomDoc, "messages"),
    orderBy("createdAt", "asc"),
    limit(200),
  );
  return onSnapshot(
    q,
    (snap: QuerySnapshot<DocumentData>) => {
      const list: ChatMessage[] = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          sender: data.sender === "staff" ? "staff" : "user",
          text: typeof data.text === "string" ? data.text : "",
          createdAt: data.createdAt?.toDate?.() ?? undefined,
        };
      });
      if (typeof window !== "undefined") {
        try { localStorage.setItem(cacheKey, JSON.stringify(list)); } catch { /* キャッシュ不可の環境では購読を継続 */ }
      }
      onUpdate(list);
    },
    onError,
  );
}

/** ルームを作成（すでにあればスキップ） */
export async function ensureChatRoom(roomId: string): Promise<void> {
  if (!db) return;
  const roomDoc = doc(db, "chat_rooms", roomId);
  const existing = await getDoc(roomDoc);
  if (existing.exists()) return;
  await setDoc(
    roomDoc,
    { uid: roomId, createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
    { merge: true },
  );
}

/** メッセージを送信する */
export async function sendChatMessage(
  roomId: string,
  text: string,
): Promise<void> {
  if (!db) return;
  const roomDoc = doc(db, "chat_rooms", roomId);
  await addDoc(collection(roomDoc, "messages"), {
    uid: roomId,
    sender: "user",
    text,
    createdAt: serverTimestamp(),
  });
}

/** 管理者から指定ユーザーのルームへ返信する */
export async function sendStaffChatMessage(
  roomId: string,
  text: string,
): Promise<void> {
  if (!db) return;
  await addDoc(collection(doc(db, "chat_rooms", roomId), "messages"), {
    uid: roomId,
    sender: "staff",
    text,
    createdAt: serverTimestamp(),
  });
}

// 型の再エクスポート（利用側で import しやすいように）
export type { Auth, User, Firestore, DocumentData, QuerySnapshot };
