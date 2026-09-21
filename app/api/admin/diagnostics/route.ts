// ============================================================
// 管理者用 決済設定の診断 API（秘密鍵の値は返さない）
// POST /api/admin/diagnostics  body: { "password": "..." }
// ============================================================
import { NextResponse } from "next/server";
import { firebaseAdminConfigStatus } from "@/lib/firebase-admin";
import { squareConfigStatus } from "@/lib/square";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    password?: unknown;
  };
  const configuredPassword = process.env.ADMIN_PASSWORD;
  if (!configuredPassword) {
    return NextResponse.json(
      { ok: false, error: "ADMIN_PASSWORDが未設定です。" },
      { status: 500 },
    );
  }
  if (typeof body.password !== "string" || body.password !== configuredPassword) {
    return NextResponse.json(
      { ok: false, error: "パスワードが正しくありません。" },
      { status: 401 },
    );
  }

  const square = squareConfigStatus();
  const firebaseAdmin = firebaseAdminConfigStatus();
  const missing: string[] = [];
  if (!square.hasAccessToken) missing.push("SQUARE_ACCESS_TOKEN");
  if (!square.hasLocationId) missing.push("SQUARE_LOCATION_ID");
  if (!firebaseAdmin.configured) {
    if (!firebaseAdmin.hasServiceAccountKey && !firebaseAdmin.hasSplitKeys) {
      missing.push("FIREBASE_SERVICE_ACCOUNT_KEY（または3分割キー）");
    }
  }
  if (!configuredPassword) missing.push("ADMIN_PASSWORD");

  return NextResponse.json({
    ok: true,
    ready: square.configured && firebaseAdmin.configured,
    missing,
    square,
    firebaseAdmin,
    hint: "不足がある場合は Netlify の Environment variables に登録し、再デプロイしてください。",
  });
}
