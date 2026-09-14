import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { site } from "@/lib/site";

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

function createTransporter() {
  return nodemailer.createTransport({
    host: SMTP.host,
    port: SMTP.port,
    // 465（SSL）の場合は secure、それ以外（587 など）は STARTTLS
    secure: SMTP.port === 465,
    auth: {
      user: SMTP.user,
      pass: SMTP.pass,
    },
  });
}

/**
 * お問い合わせフォームの受け口。
 * 検証後、nodemailer で Gmail SMTP 経由のメールを送信します。
 * 送信先: CONTACT_EMAIL / 自動返信: 入力されたメールアドレス
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

  const { company, name, email, message, _spam } = (body ?? {}) as {
    company?: unknown;
    name?: unknown;
    email?: unknown;
    message?: unknown;
    _spam?: unknown;
  };

  // スパム対策（見えないフィールドに入力されていたら破棄）
  if (typeof _spam === "string" && _spam !== "") {
    return NextResponse.json({
      ok: true,
      message: "お問い合わせを受け付けました。担当者よりご連絡いたします。",
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
  if (typeof message !== "string" || message.trim() === "") {
    errors.push("相談内容を入力してください。");
  }
  if (typeof message === "string" && message.length > 5000) {
    errors.push("相談内容は5,000文字以内で入力してください。");
  }

  if (errors.length > 0) {
    return NextResponse.json(
      { ok: false, error: errors.join(" ") },
      { status: 400 },
    );
  }

  if (!SMTP.host || !SMTP.user || !SMTP.pass || !SMTP.to) {
    console.error(
      "SMTP 設定が不足しています。.env.local の SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASS / CONTACT_EMAIL を確認してください。",
    );
    return NextResponse.json(
      {
        ok: false,
        error:
          "サーバーのメール送信設定が未完了です。管理者にお問い合わせください。",
      },
      { status: 500 },
    );
  }

  const companyText = String(company).trim();
  const nameText = String(name).trim();
  const emailText = String(email).trim();
  const messageText = String(message).trim();

  const transcript =
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `【ホームページ制作 お問い合わせ】\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `会社名・事業所名：${companyText}\n` +
    `お名前　　　　　：${nameText}\n` +
    `メールアドレス　：${emailText}\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `【相談内容】\n${messageText}\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;

  const transporter = createTransporter();

  try {
    // 運営側への通知
    await transporter.sendMail({
      from: `${site.name} お問い合わせフォーム <${SMTP.user}>`,
      to: SMTP.to,
      replyTo: emailText,
      subject: `【ホームページ制作】お問い合わせ：${companyText}（${nameText} 様）`,
      text: transcript,
    });

    // 送信者本人への自動返信
    await transporter.sendMail({
      from: `${site.name} <${SMTP.user}>`,
      to: emailText,
      subject: `【自動受付】お問い合わせを受け付けました`,
      text:
        `${nameText} 様\n\n` +
        `このたびは${site.name}にお問い合わせいただき、誠にありがとうございます。\n` +
        `以下の内容でお問い合わせを受け付けました。\n\n` +
        `${transcript}\n` +
        `担当者より順次ご連絡いたします。通常、${site.replyTime}にご返信いたします。\n` +
        `しばらくお待ちくださいますようお願いいたします。\n\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `${site.name}\n` +
        `${site.url}\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`,
    });

    console.log("お問い合わせメールを送信しました:", {
      to: SMTP.to,
      from: emailText,
      company: companyText,
    });
  } catch (err) {
    console.error("お問い合わせメールの送信に失敗しました:", err);
    return NextResponse.json(
      {
        ok: false,
        error: "メールの送信に失敗しました。時間をおいて再度お試しください。",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    message: "お問い合わせを受け付けました。担当者よりご連絡いたします。",
  });
}
