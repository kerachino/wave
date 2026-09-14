import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { addons, basePlan, site } from "@/lib/site";

const PLAN_NAMES: string[] = [basePlan.name];
const ADDON_NAMES: string[] = addons.map((a) => a.name);

const SMTP = {
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  user: process.env.SMTP_USER,
  pass: process.env.SMTP_PASS,
  to: process.env.CONTACT_EMAIL,
};

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * お申し込み・ご契約フォームの受け口。
 * メールで運営へ通知し、申込者本人へ自動返信します。
 * （Firestore への保存はクライアント側の ApplyForm から行います）
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "リクエストを解析できませんでした。" },
      { status: 400 },
    );
  }

  const { company, name, email, phone, plan, addons: selectedAddons, note, _spam } = (body ?? {}) as {
    company?: unknown;
    name?: unknown;
    email?: unknown;
    phone?: unknown;
    plan?: unknown;
    addons?: unknown;
    note?: unknown;
    _spam?: unknown;
  };

  if (typeof _spam === "string" && _spam !== "") {
    return NextResponse.json({
      ok: true,
      message: "お申し込みを受け付けました。担当者よりご連絡いたします。",
    });
  }

  const errors: string[] = [];
  if (typeof company !== "string" || company.trim() === "") {
    errors.push("会社名・事業所名を入力してください。");
  }
  if (typeof name !== "string" || name.trim() === "") {
    errors.push("お名前を入力してください。");
  }
  if (typeof email !== "string" || !validateEmail(email)) {
    errors.push("メールアドレスの形式が正しくありません。");
  }
  if (typeof plan !== "string" || !PLAN_NAMES.includes(plan)) {
    errors.push("基本プランを選択してください。");
  }
  const addonList = Array.isArray(selectedAddons)
    ? selectedAddons.filter((a): a is string => typeof a === "string" && ADDON_NAMES.includes(a))
    : [];

  if (errors.length > 0) {
    return NextResponse.json(
      { ok: false, error: errors.join(" ") },
      { status: 400 },
    );
  }

  if (!SMTP.host || !SMTP.user || !SMTP.pass || !SMTP.to) {
    console.error(
      "SMTP 設定が不足しています。.env.local の SMTP_* を確認してください。",
    );
    return NextResponse.json(
      { ok: false, error: "サーバーのメール送信設定が未完了です。" },
      { status: 500 },
    );
  }

  const companyText = String(company).trim();
  const nameText = String(name).trim();
  const emailText = String(email).trim();
  const phoneText = typeof phone === "string" ? phone.trim() : "";
  const planText = String(plan);
  const addonText = addonList.length > 0 ? addonList.join(" ／ ") : "なし（基本プランのみ）";
  const noteText = typeof note === "string" ? note.trim() : "";

  const transcript =
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `【ホームページ制作 お申し込み】\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `会社名・事業所名：${companyText}\n` +
    `お名前　　　　　：${nameText}\n` +
    `メールアドレス　：${emailText}\n` +
    `電話番号　　　　：${phoneText || "（未入力）"}\n` +
    `基本プラン　　　：${planText}\n` +
    `付け足し　　　　：${addonText}\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    (noteText ? `【ご要望・補足】\n${noteText}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` : "");

  const transporter = nodemailer.createTransport({
    host: SMTP.host,
    port: SMTP.port,
    secure: SMTP.port === 465,
    auth: { user: SMTP.user, pass: SMTP.pass },
  });

  try {
    await transporter.sendMail({
      from: `${site.name} お申し込みフォーム <${SMTP.user}>`,
      to: SMTP.to,
      replyTo: emailText,
      subject: `【お申し込み】${planText}：${companyText}（${nameText} 様）`,
      text: transcript,
    });

    await transporter.sendMail({
      from: `${site.name} <${SMTP.user}>`,
      to: emailText,
      subject: `【自動受付】お申し込みを受け付けました`,
      text:
        `${nameText} 様\n\n` +
        `このたびは${site.name}にお申し込みいただき、誠にありがとうございます。\n` +
        `以下の内容でお申し込みを受け付けました。\n\n` +
        `${transcript}\n` +
        `続いてご契約のご案内をお送りいたします。通常、${site.replyTime}にご連絡いたします。\n\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `${site.name}\n${site.url}\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`,
    });
  } catch (err) {
    console.error("お申し込みメールの送信に失敗しました:", err);
    return NextResponse.json(
      { ok: false, error: "メールの送信に失敗しました。時間をおいて再度お試しください。" },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    message: "お申し込みを受け付けました。担当者よりご連絡いたします。",
  });
}
