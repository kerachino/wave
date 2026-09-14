import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import {
  contactBudgetOptions,
  contactColorOptions,
  contactDeadlineOptions,
  contactIndustryOptions,
  contactInquiryTypes,
  contactNeededPagesOptions,
  contactPageCountOptions,
  contactPreparedOptions,
  contactPurposeOptions,
  contactRequestOptions,
  site,
} from "@/lib/site";

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

  const {
    inquiryType,
    company,
    name,
    email,
    phone,
    industry,
    purpose,
    target,
    neededPages,
    pageCount,
    color,
    requests,
    prepared,
    budget,
    deadline,
    referenceUrl,
    message,
    _spam,
  } = (body ?? {}) as {
    inquiryType?: unknown;
    company?: unknown;
    name?: unknown;
    email?: unknown;
    phone?: unknown;
    industry?: unknown;
    purpose?: unknown;
    target?: unknown;
    neededPages?: unknown;
    pageCount?: unknown;
    color?: unknown;
    requests?: unknown;
    prepared?: unknown;
    budget?: unknown;
    deadline?: unknown;
    referenceUrl?: unknown;
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
  const inquiryTypeIds: string[] = contactInquiryTypes.map((t) => t.id);
  if (typeof inquiryType !== "string" || !inquiryTypeIds.includes(inquiryType)) {
    errors.push("お問い合わせの種類を選択してください。");
  }
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
  // 任意項目：入力がある場合のみ形式を検証（分からない場合は空欄OK）
  function checkSingle(
    value: unknown,
    allowed: readonly string[],
    message: string,
  ) {
    if (typeof value === "string" && value !== "" && !allowed.includes(value)) {
      errors.push(message);
    }
  }
  function checkMulti(
    value: unknown,
    allowed: readonly string[],
    message: string,
  ): string[] {
    if (!Array.isArray(value) || value.length === 0) return [];
    const list = value.filter((v): v is string => typeof v === "string");
    if (list.length !== value.length || list.some((v) => !allowed.includes(v))) {
      errors.push(message);
      return [];
    }
    return list;
  }
  function checkUrl(value: unknown, message: string): string {
    if (typeof value !== "string" || value.trim() === "") return "";
    try {
      const parsed = new URL(value.trim());
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        errors.push(message);
        return "";
      }
      return value.trim();
    } catch {
      errors.push(message);
      return "";
    }
  }
  checkSingle(industry, contactIndustryOptions, "業種の選択が正しくありません。");
  checkSingle(purpose, contactPurposeOptions, "Webサイトの用途の選択が正しくありません。");
  const neededPagesList = checkMulti(
    neededPages,
    contactNeededPagesOptions,
    "必要なページの選択が正しくありません。",
  );
  checkSingle(pageCount, contactPageCountOptions, "ページ数の目安が正しくありません。");
  checkSingle(color, contactColorOptions, "色・雰囲気の選択が正しくありません。");
  const requestsList = checkMulti(
    requests,
    contactRequestOptions,
    "対応してもらいたいことの選択が正しくありません。",
  );
  const preparedList = checkMulti(
    prepared,
    contactPreparedOptions,
    "用意しているものの選択が正しくありません。",
  );
  checkSingle(budget, contactBudgetOptions, "ご予算の目安が正しくありません。");
  checkSingle(deadline, contactDeadlineOptions, "ご希望の時期が正しくありません。");
  const referenceUrlText = checkUrl(referenceUrl, "参考URLの形式が正しくありません。");

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

  const inquiryTypeLabel =
    contactInquiryTypes.find((t) => t.id === inquiryType)?.label ??
    String(inquiryType ?? "");
  const companyText = String(company).trim();
  const nameText = String(name).trim();
  const emailText = String(email).trim();
  const phoneText = typeof phone === "string" ? phone.trim() : "";
  function textOrBlank(value: unknown): string {
    return typeof value === "string" && value !== "" ? value : "（未回答）";
  }
  const industryText = textOrBlank(industry);
  const purposeText = textOrBlank(purpose);
  const targetText =
    typeof target === "string" && target.trim() !== ""
      ? target.trim().slice(0, 200)
      : "（未回答）";
  const neededPagesText =
    neededPagesList.length > 0 ? neededPagesList.join(" ／ ") : "（未回答）";
  const pageCountText = textOrBlank(pageCount);
  const colorText = textOrBlank(color);
  const requestsText =
    requestsList.length > 0 ? requestsList.join(" ／ ") : "（未回答）";
  const preparedText =
    preparedList.length > 0 ? preparedList.join(" ／ ") : "（未回答）";
  const budgetText = textOrBlank(budget);
  const deadlineText = textOrBlank(deadline);
  const referenceText = referenceUrlText !== "" ? referenceUrlText : "（未回答）";
  const messageText = String(message).trim();

  const detailLines =
    inquiryType === "consult"
      ? [
          `業種　　　　　　　：${industryText}`,
          `サイトの用途　　　：${purposeText}`,
          `ターゲット像　　　：${targetText}`,
          `必要なページ　　　：${neededPagesText}`,
          `ページ数・枚数　　：${pageCountText}`,
          `色・雰囲気　　　　：${colorText}`,
          `対応希望　　　　　：${requestsText}`,
          `用意しているもの　：${preparedText}`,
          `予算の目安　　　　：${budgetText}`,
          `希望の時期　　　　：${deadlineText}`,
          `参考URL　　　　 　：${referenceText}`,
        ]
      : [];

  const transcript =
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `【ホームページ制作 お問い合わせ】\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `お問い合わせ種別：${inquiryTypeLabel}\n` +
    `会社名・事業所名：${companyText}\n` +
    `お名前　　　　　：${nameText}\n` +
    `メールアドレス　：${emailText}\n` +
    `電話番号　　　　：${phoneText || "（未入力）"}\n` +
    (detailLines.length > 0 ? detailLines.join("\n") + "\n" : "") +
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
      subject: `【ホームページ制作】${inquiryTypeLabel}：${companyText}（${nameText} 様）`,
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
