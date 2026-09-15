import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { password?: unknown };
  const configuredPassword = process.env.ADMIN_PASSWORD;
  if (!configuredPassword) {
    return NextResponse.json({ ok: false, error: "ADMIN_PASSWORDが未設定です。" }, { status: 500 });
  }
  if (typeof body.password !== "string" || body.password !== configuredPassword) {
    return NextResponse.json({ ok: false, error: "パスワードが正しくありません。" }, { status: 401 });
  }
  return NextResponse.json({ ok: true });
}