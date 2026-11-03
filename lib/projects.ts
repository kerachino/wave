// ============================================================
// プロジェクト（ご依頼）の共通定義
//
// お客さま1人で複数のご依頼（サイト制作）をいただく場合があるため、
// 1件のご依頼 = projects/{projectId} の1ドキュメントとして管理します。
//
// ・旧 orders/{uid} は、projects がまだ無いお客さまの読み取り専用の
//   フォールバック（legacy）として扱い、運営者が保存した時点で
//   projects/{uid} に引き継ぎます（projectWriteBase）。
// ・お支払い・契約・同意ログ・請求書は、すべてプロジェクト単位です。
// ============================================================
import type { Order } from "@/lib/model";

/** Firestore のコレクション名 */
export const projectsCollection = "projects";

/** 1件のご依頼（プロジェクト）。契約・決済の情報は Order と同じ持ち方をします */
export type Project = Order & {
  /** ドキュメントID（Firestore の doc id） */
  id: string;
  /** プロジェクト名（例：コーポレートサイト制作） */
  title?: string;
  /** 公開URL（納品後に入力） */
  siteUrl?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  /** 旧 orders/{uid} から読み込んだ既存データかどうか */
  legacy?: boolean;
};

/** 表示用のプロジェクト名 */
export function projectTitle(project: Project | null | undefined): string {
  if (!project) return "ご依頼";
  return project.title?.trim() || project.customerName?.trim() || "ホームページ制作";
}

/** 旧 orders/{uid} の内容を、プロジェクトとして表示するための変換 */
export function legacyProject(uid: string, order: Order): Project {
  const stamp = (order as { updatedAt?: Date | string; createdAt?: Date | string });
  return {
    ...order,
    id: uid,
    uid,
    title: "お支払い",
    legacy: true,
    createdAt: stamp.updatedAt ?? stamp.createdAt,
  };
}

function toMillis(value: Date | string | undefined) {
  if (!value) return 0;
  if (value instanceof Date) return value.getTime();
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime();
}

/** 古い順（作成順）に並べます */
export function sortProjects(projects: Project[]): Project[] {
  return [...projects].sort((a, b) => {
    const left = toMillis(a.createdAt);
    const right = toMillis(b.createdAt);
    if (left !== right) return left - right;
    return projectTitle(a).localeCompare(projectTitle(b), "ja");
  });
}

/**
 * 旧 orders/{uid} の内容を projects/{id} へ引き継ぐときの土台。
 * 引き継ぎ先で上書きする購入内容・契約条件と、決済の確定情報を含みます
 * （legacy のときだけ値を返します）。
 */
export function projectWriteBase(
  project: Project | null | undefined,
): Record<string, unknown> {
  if (!project?.legacy) return {};
  return {
    title: project.title,
    purchaseKind: project.purchaseKind,
    basePrice: project.basePrice,
    options: project.options ?? [],
    totalPrice: project.totalPrice,
    firstAmount: project.firstAmount,
    remainingAmount: project.remainingAmount,
    status: project.status,
    paymentStatus: project.paymentStatus,
    note: project.note,
    purchaseApproved: project.purchaseApproved,
    subscriptionApproved: project.subscriptionApproved,
    subscriptionPrice: project.subscriptionPrice,
    subscriptionStatus: project.subscriptionStatus,
    customerName: project.customerName,
    contractDeliveryDate: project.contractDeliveryDate,
    contractInspectionDeadline: project.contractInspectionDeadline,
    contractDeliveryPlace: project.contractDeliveryPlace,
    projectConsent: project.projectConsent,
    subscriptionConsent: project.subscriptionConsent,
    squareCustomerId: project.squareCustomerId,
    projectInvoice: project.projectInvoice,
    subscriptionInvoice: project.subscriptionInvoice,
    paidAt: project.paidAt,
    paidAmount: project.paidAmount,
    accessUnlocked: project.accessUnlocked,
    accessUnlockedAt: project.accessUnlockedAt,
    migratedFrom: `orders/${project.uid}`,
  };
}

/** 契約・維持費・制限の状態（金額は含めません） */
export type ProjectPhase = {
  /** 本契約：未設定（購入内容の設定待ち）／お支払い待ち／完了 */
  contract: "unset" | "unpaid" | "paid";
  /** 維持費サブスク：未許可／お支払い待ち／完了 */
  subscription: "unapproved" | "unpaid" | "paid";
  /** 決済後に利用可能となる機能 */
  unlocked: boolean;
  /** サイトの公開（公開URLが設定されているか） */
  published: boolean;
};

export function projectPhase(project: Project | null | undefined): ProjectPhase {
  if (!project) {
    return {
      contract: "unset",
      subscription: "unapproved",
      unlocked: false,
      published: false,
    };
  }
  const purchased = Boolean(
    project?.purchaseApproved ||
      project?.paymentStatus === "paid" ||
      project?.legacy,
  );
  return {
    contract: project?.paymentStatus === "paid" ? "paid" : purchased ? "unpaid" : "unset",
    subscription:
      project.subscriptionStatus === "paid"
        ? "paid"
        : project.subscriptionApproved
          ? "unpaid"
          : "unapproved",
    unlocked:
      project.accessUnlocked === true ||
      project.paymentStatus === "paid" ||
      project.subscriptionStatus === "paid",
    published: Boolean(project.siteUrl),
  };
}

export function contractLabel(phase: ProjectPhase) {
  switch (phase.contract) {
    case "paid":
      return "完了";
    case "unpaid":
      return "お支払い待ち";
    default:
      return "購入内容の設定待ち";
  }
}

export function subscriptionLabel(phase: ProjectPhase) {
  switch (phase.subscription) {
    case "paid":
      return "完了";
    case "unpaid":
      return "お支払い待ち";
    default:
      return "受付前";
  }
}


/** 進行ステップ（ご相談 → 契約・お支払い → 制作・確認 → 公開・維持費） */
export type ProjectStep = {
  no: number;
  title: string;
  description: string;
  state: "done" | "current" | "todo";
};

export function projectSteps(project: Project | null | undefined): ProjectStep[] {
  const phase = projectPhase(project);
  const requested = Boolean(
    project?.purchaseApproved ||
      project?.paymentStatus === "paid" ||
      project?.legacy,
  );
  const contracted = phase.contract === "paid";
  const subscriptionPaid = phase.subscription === "paid";

  return [
    {
      no: 1,
      title: "ご相談・お見積り",
      description: "お見積りと購入内容のご確認",
      state: requested ? "done" : "current",
    },
    {
      no: 2,
      title: "契約・お支払い",
      description: "取引条件に同意して、本契約代金をお支払い",
      state: contracted ? "done" : requested ? "current" : "todo",
    },
    {
      no: 3,
      title: "制作・確認",
      description: "チャットで確認しながら制作を進めます",
      state: phase.published ? "done" : contracted ? "current" : "todo",
    },
    {
      no: 4,
      title: "公開・維持費サポート",
      description: "サイトを公開し、維持費サポートを開始",
      state:
        phase.published && subscriptionPaid
          ? "done"
          : phase.published || subscriptionPaid
            ? "current"
            : "todo",
    },
  ];
}
