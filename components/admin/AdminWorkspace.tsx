"use client";

import { useEffect, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { useAuth } from "@/components/AuthProvider";
import { AdminChat } from "@/components/admin/AdminChat";
import { ContractPanel } from "@/components/admin/ContractPanel";
import { EstimatePanel } from "@/components/admin/EstimatePanel";
import { useAdminProjects } from "@/components/useAdminProjects";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import {
  basePlanPrice,
  computeAmounts,
  maintenanceSubscriptionPrice,
  purchasableOptions,
  yen,
  type Order,
  type OrderOption,
} from "@/lib/model";
import { projectsCollection, type Project } from "@/lib/projects";

type AdminUser = {
  uid: string;
  email?: string;
  displayName?: string;
  companyName?: string;
  phone?: string;
  photoURL?: string;
};
type AdminTab =
  | "chat"
  | "purchase"
  | "subscription"
  | "estimate"
  | "contract"
  | "profile"
  | "system";
type CustomOption = { id: string; name: string; price: number; defaultPrice: number };

export function AdminWorkspace() {
  const { user, isAdmin, loading, sessionId } = useAuth();
  const [password, setPassword] = useState("");
  const [diagnosticsPassword, setDiagnosticsPassword] = useState("");
  const [verifiedSessionId, setVerifiedSessionId] = useState<number | null>(null);
  const [verifyingPassword, setVerifyingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [selectedUid, setSelectedUid] = useState("");
  const [activeTab, setActiveTab] = useState<AdminTab>("chat");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [newProjectKind, setNewProjectKind] = useState<"project" | "additional">(
    "project",
  );

  const verified = verifiedSessionId === sessionId;

  useEffect(() => {
    if (!user || !isAdmin || !verified || !db) return;
    return onSnapshot(
      collection(db, "users"),
      (snapshot) => {
        const next = snapshot.docs.map(
          (item) => ({ uid: item.id, ...item.data() }) as AdminUser,
        );
        next.sort((a, b) =>
          (a.displayName || a.email || a.uid).localeCompare(
            b.displayName || b.email || b.uid,
            "ja",
          ),
        );
        setUsers(next);
        setSelectedUid((current) =>
          next.some((item) => item.uid === current)
            ? current
            : next[0]?.uid || "",
        );
      },
      () => setMessage("ユーザー一覧を読み込めませんでした。"),
    );
  }, [user, isAdmin, verified]);

  const {
    projects,
    selectedProject,
    selectedProjectId,
    selectProject,
    createProject,
    loading: projectsLoading,
  } = useAdminProjects(selectedUid, Boolean(user && isAdmin && verified));
  const selectedUser = users.find((item) => item.uid === selectedUid);
  const order = selectedProject;
  const basePrice = order?.basePrice ?? basePlanPrice;

  async function verifyPassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setVerifyingPassword(true);
    setPasswordError("");
    try {
      const response = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as {
          error?: string;
        };
        setPasswordError(data.error || "パスワードが正しくありません。");
        return;
      }
      setVerifiedSessionId(sessionId);
      setDiagnosticsPassword(password);
      setPassword("");
    } catch {
      setPasswordError("確認に失敗しました。時間をおいて再度お試しください。");
    } finally {
      setVerifyingPassword(false);
    }
  }

  function selectUser(uid: string) {
    setSelectedUid(uid);
    setMessage("");
    setActiveTab("chat");
  }

  function projectRef(project: Project) {
    return doc(
      db!,
      project.legacy ? "orders" : projectsCollection,
      project.legacy ? project.uid : project.id,
    );
  }

  async function addProject(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedUid || !newProjectTitle.trim()) {
      setMessage("依頼名を入力してください。");
      return;
    }
    setSaving(true);
    setMessage("");
    try {
      const projectId = await createProject(
        newProjectTitle,
        newProjectKind === "additional",
      );
      if (!projectId) {
        setMessage("依頼を登録できませんでした。Firebase設定を確認してください。");
        return;
      }
      selectProject(projectId);
      setNewProjectTitle("");
      setActiveTab("purchase");
      setMessage("依頼を登録しました。購入内容を設定してください。");
    } catch {
      setMessage("依頼の登録に失敗しました。時間をおいて再度お試しください。");
    } finally {
      setSaving(false);
    }
  }

  async function savePurchase(
    purchaseOptions: OrderOption[],
    purchaseNote: string,
  ) {
    if (!selectedProject || !db || !isFirebaseConfigured) {
      setMessage("対象の依頼とFirebase設定を確認してください。");
      return;
    }
    if (
      order?.paymentStatus === "paid" ||
      hasActiveInvoice(order?.projectInvoice)
    ) {
      setMessage("請求書発行後は購入内容を変更できません。");
      return;
    }
    const amounts = computeAmounts(basePrice, purchaseOptions);
    if (amounts.totalPrice <= 0) {
      setMessage("購入項目を1つ以上設定してください。");
      return;
    }
    setSaving(true);
    setMessage("");
    try {
      await setDoc(
        projectRef(selectedProject),
        {
          uid: selectedUid,
          basePrice,
          options: purchaseOptions,
          ...amounts,
          status: "pending_payment",
          paymentStatus: "unpaid",
          note: purchaseNote,
          purchaseApproved: true,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );
      setMessage("購入内容を保存し、購入を許可しました。");
    } catch {
      setMessage("購入内容の保存に失敗しました。");
    } finally {
      setSaving(false);
    }
  }

  async function revokePurchaseApproval() {
    if (!selectedProject || !db || !order?.purchaseApproved) return;
    if (order.paymentStatus === "paid") {
      setMessage("支払い済みの購入許可は取り消せません。");
      return;
    }
    if (hasActiveInvoice(order.projectInvoice)) {
      setMessage(
        "請求書発行済みです。Square側で請求書がキャンセルされると、取り消し操作ができます。",
      );
      return;
    }
    const confirmed = window.confirm(
      `「${order.title || "この依頼"}」の購入許可を取り消しますか？お客さまは購入できなくなります。`,
    );
    if (!confirmed) return;
    setSaving(true);
    setMessage("");
    try {
      await setDoc(
        projectRef(selectedProject),
        { purchaseApproved: false, updatedAt: serverTimestamp() },
        { merge: true },
      );
      setMessage("購入許可を取り消しました。");
    } catch {
      setMessage("購入許可を取り消せませんでした。");
    } finally {
      setSaving(false);
    }
  }

  async function saveSubscription(subscriptionPrice: number) {
    if (!selectedProject || !db || !isFirebaseConfigured || subscriptionPrice <= 0) {
      setMessage("依頼とサブスク料金を確認してください。");
      return;
    }
    setSaving(true);
    setMessage("");
    try {
      await setDoc(
        projectRef(selectedProject),
        {
          subscriptionApproved: true,
          subscriptionPrice,
          subscriptionStatus: "unpaid",
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );
      setMessage("維持費サブスクを保存しました。");
    } catch {
      setMessage("維持費サブスクを保存できませんでした。");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 text-sm text-ink-mute">
        認証中...
      </div>
    );
  }
  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16">
        <h1 className="font-maru text-2xl font-bold text-ink">
          管理者専用ページ
        </h1>
        <p className="mt-3 text-sm text-ink-soft">
          管理者アカウントでログインしてください。
        </p>
      </div>
    );
  }
  if (!verified) {
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <section className="rounded-3xl border border-line bg-white p-8 shadow-card">
          <p className="text-xs font-bold tracking-[0.18em] text-brand">ADMIN</p>
          <h1 className="mt-2 font-maru text-2xl font-bold text-ink">
            管理者パスワード
          </h1>
          <form onSubmit={verifyPassword} className="mt-6 space-y-4">
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="パスワード"
              disabled={verifyingPassword}
              className="w-full rounded-xl border border-line bg-cream px-4 py-3 text-sm"
            />
            <button
              disabled={verifyingPassword}
              className="w-full rounded-full bg-brand px-5 py-3 text-sm font-bold text-white disabled:opacity-60"
            >
              {verifyingPassword ? "確認中..." : "管理ページを開く"}
            </button>
            {passwordError && (
              <p className="text-sm text-red-600">{passwordError}</p>
            )}
          </form>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-cream/50">
      <div className="mx-auto flex max-w-7xl flex-col lg:flex-row">
        <aside className="w-full shrink-0 border-b border-line bg-white p-5 lg:min-h-[calc(100vh-4rem)] lg:w-80 lg:border-b-0 lg:border-r lg:p-7">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-bold tracking-[0.18em] text-brand">
                ADMIN SPACE
              </p>
              <h1 className="mt-2 font-maru text-xl font-bold text-ink">
                ユーザー一覧
              </h1>
            </div>
            <span className="rounded-full bg-brand-soft px-3 py-1 text-xs text-brand">
              {users.length}名
            </span>
          </div>
          <div className="mt-6 space-y-2">
            {users.map((candidate) => (
              <button
                key={candidate.uid}
                type="button"
                onClick={() => selectUser(candidate.uid)}
                className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left ${
                  selectedUid === candidate.uid
                    ? "bg-brand text-white"
                    : "hover:bg-cream"
                }`}
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-brand-soft text-sm font-bold text-brand">
                  {(candidate.displayName || candidate.email || "U").slice(0, 1)}
                </span>
                <span className="min-w-0">
                  <strong className="block truncate text-sm">
                    {candidate.displayName || "名前未設定"}
                  </strong>
                  <span className="block truncate text-xs opacity-70">
                    {candidate.email || candidate.uid}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </aside>

        <main className="min-w-0 flex-1 px-4 py-8 sm:px-8 lg:px-12">
          {selectedUser ? (
            <>
              <header className="mb-6">
                <p className="text-xs font-bold tracking-[0.18em] text-brand">
                  ADMIN WORKSPACE
                </p>
                <h2 className="mt-2 font-maru text-3xl font-bold text-ink">
                  {selectedUser.displayName || "名前未設定"}
                </h2>
                <p className="mt-2 text-sm text-ink-soft">
                  {selectedUser.email}
                </p>
              </header>

              <section className="mb-6 rounded-2xl border border-line bg-white p-4 shadow-card sm:p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <label className="min-w-0 flex-1 text-xs font-bold text-ink-soft">
                    対象の依頼（{projects.length}件）
                    <select
                      value={selectedProjectId}
                      onChange={(event) => selectProject(event.target.value)}
                      disabled={projectsLoading || projects.length === 0}
                      className="mt-2 w-full rounded-xl border border-line bg-cream px-4 py-3 text-sm text-ink disabled:opacity-60"
                    >
                      {projects.length === 0 ? (
                        <option value="">依頼はまだありません</option>
                      ) : (
                        projects.map((project) => (
                          <option key={project.id} value={project.id}>
                            {project.title || project.customerName || "ホームページ制作"}
                          </option>
                        ))
                      )}
                    </select>
                  </label>
                  <p className="text-xs leading-5 text-ink-mute">
                    追加分も依頼を分けて、個別にお見積もり・購入許可できます。
                  </p>
                </div>
                <form
                  onSubmit={addProject}
                  className="mt-4 grid gap-3 border-t border-line pt-4 sm:grid-cols-[1fr_auto_auto]"
                >
                  <label className="text-xs font-bold text-ink-soft">
                    新しい依頼名
                    <input
                      value={newProjectTitle}
                      onChange={(event) => setNewProjectTitle(event.target.value)}
                      placeholder="例：追加ページ制作"
                      maxLength={100}
                      className="mt-2 w-full rounded-xl border border-line bg-cream px-4 py-3 text-sm font-normal text-ink"
                    />
                  </label>
                  <label className="text-xs font-bold text-ink-soft">
                    依頼の種類
                    <select
                      value={newProjectKind}
                      onChange={(event) =>
                        setNewProjectKind(
                          event.target.value as "project" | "additional",
                        )
                      }
                      className="mt-2 w-full rounded-xl border border-line bg-cream px-4 py-3 text-sm font-normal text-ink"
                    >
                      <option value="project">新規サイト制作</option>
                      <option value="additional">追加購入（基本料金なし）</option>
                    </select>
                  </label>
                  <button
                    type="submit"
                    disabled={saving || projectsLoading || !newProjectTitle.trim()}
                    className="self-end rounded-full bg-brand px-5 py-3 text-sm font-bold text-white disabled:opacity-50"
                  >
                    {saving
                      ? "登録中..."
                      : projectsLoading
                        ? "依頼を読み込み中..."
                        : "依頼を登録"}
                  </button>
                </form>
                {message && (
                  <p role="status" className="mt-3 text-sm text-brand-deep">
                    {message}
                  </p>
                )}
              </section>

              <nav
                className="flex gap-2 overflow-x-auto border-b border-line"
                aria-label="管理メニュー"
              >
                <Tab active={activeTab === "chat"} label="チャット" onClick={() => setActiveTab("chat")} />
                <Tab active={activeTab === "purchase"} label="購入許可" onClick={() => setActiveTab("purchase")} />
                <Tab active={activeTab === "subscription"} label="維持費サブスク" onClick={() => setActiveTab("subscription")} />
                <Tab active={activeTab === "estimate"} label="見積もり" onClick={() => setActiveTab("estimate")} />
                <Tab active={activeTab === "contract"} label="契約条件" onClick={() => setActiveTab("contract")} />
                <Tab active={activeTab === "profile"} label="ユーザー情報" onClick={() => setActiveTab("profile")} />
                <Tab active={activeTab === "system"} label="決済設定" onClick={() => setActiveTab("system")} />
              </nav>

              {activeTab === "chat" && <AdminChat roomId={selectedUid} />}
              {activeTab === "contract" && (
                <ContractPanel
                  uid={selectedUid}
                  projectId={selectedProjectId}
                  legacy={selectedProject?.legacy}
                  order={order}
                  customerEmail={selectedUser.email || ""}
                />
              )}
              {activeTab === "purchase" && (
                <PurchasePanel
                  key={`${selectedProjectId}:${order?.purchaseApproved ? "approved" : "pending"}`}
                  order={order}
                  saving={saving}
                  message={message}
                  onSave={savePurchase}
                  onRevoke={revokePurchaseApproval}
                />
              )}
              {activeTab === "subscription" && (
                <SubscriptionPanel
                  key={`${selectedProjectId}:${order?.subscriptionApproved ? "approved" : "pending"}`}
                  order={order}
                  saving={saving}
                  message={message}
                  onSave={saveSubscription}
                />
              )}
              {activeTab === "estimate" && (
                <EstimatePanel
                  uid={selectedUid}
                  userName={
                    selectedUser.displayName || selectedUser.email || "お客様"
                  }
                />
              )}
              {activeTab === "profile" && (
                <ProfilePanel user={selectedUser} order={order} />
              )}
              {activeTab === "system" && (
                <SystemPanel password={diagnosticsPassword} />
              )}
            </>
          ) : (
            <p className="rounded-3xl border border-dashed border-line bg-white p-10 text-center text-sm text-ink-soft">
              ユーザーを選択してください。
            </p>
          )}
        </main>
      </div>
    </div>
  );
}

function hasActiveInvoice(invoice: Order["projectInvoice"]) {
  return Boolean(invoice?.id && invoice.status !== "CANCELED");
}

function Tab({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 px-4 py-3 text-sm font-bold ${
        active
          ? "border-b-2 border-brand text-brand"
          : "text-ink-mute hover:text-ink"
      }`}
    >
      {label}
    </button>
  );
}

function PurchasePanel({
  order,
  saving,
  message,
  onSave,
  onRevoke,
}: {
  order: Project | null;
  saving: boolean;
  message: string;
  onSave: (options: OrderOption[], note: string) => Promise<void>;
  onRevoke: () => Promise<void>;
}) {
  const [selectedIds, setSelectedIds] = useState<string[]>(() =>
    order?.options
      ?.filter((option) =>
        purchasableOptions.some((preset) => preset.id === option.id),
      )
      .map((option) => option.id) ?? [],
  );
  const [customOptions, setCustomOptions] = useState<CustomOption[]>(() =>
    (order?.options ?? [])
      .filter(
        (option) =>
          !purchasableOptions.some((preset) => preset.id === option.id),
      )
      .map((option) => ({
        id: option.id,
        name: option.name,
        price: option.price,
        defaultPrice: option.price,
      })),
  );
  const [note, setNote] = useState(order?.note || "");
  const [editing, setEditing] = useState(!order?.purchaseApproved);
  const options: OrderOption[] = [
    ...purchasableOptions
      .filter((option) => selectedIds.includes(option.id))
      .map((option) => ({ ...option, price: option.defaultPrice })),
    ...customOptions
      .filter((option) => option.name.trim() && option.price > 0)
      .map((option) => ({ ...option, defaultPrice: option.price })),
  ];
  const amounts = computeAmounts(order?.basePrice ?? 0, options);
  const approved = Boolean(order?.purchaseApproved);
  const invoiceActive = hasActiveInvoice(order?.projectInvoice);
  const frozen = order?.paymentStatus === "paid" || invoiceActive;
  const disabled = !editing || frozen;
  const additional = order?.basePrice === 0;

  return (
    <section className="mt-6 rounded-3xl border border-line bg-white p-6 shadow-card sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold tracking-[0.14em] text-brand">
            PURCHASE CONTROL
          </p>
          <h3 className="mt-2 font-maru text-xl font-bold text-ink">
            購入内容・許可
          </h3>
        </div>
        {order && approved && !frozen && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="rounded-full border border-brand px-4 py-2 text-xs font-bold text-brand"
          >
            内容を編集
          </button>
        )}
      </div>

      {!order ? (
        <p className="mt-4 rounded-xl bg-cream px-4 py-3 text-sm text-ink-soft">
          依頼を登録すると、購入内容と許可を設定できます。
        </p>
      ) : (
        <>
          <p className="mt-3 text-sm leading-6 text-ink-soft">
            {additional
              ? "追加購入は基本料金を含めず、設定した項目だけを別請求します。"
              : "購入内容を確認して許可すると、お客さまのお支払い画面に表示されます。"}
          </p>
          {frozen && (
            <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
              {order.paymentStatus === "paid"
                ? "支払い済みのため購入内容・許可は変更できません。"
                : "Square請求書が発行済みです。購入許可を取り消すには、Square側で請求書がキャンセルされたことを確認してください。"}
            </p>
          )}

          <div className="mt-5 space-y-3">
            {!additional && (
              <div className="flex items-center justify-between rounded-xl bg-brand-soft/60 px-4 py-3 text-sm">
                <span className="font-bold text-ink">基本プラン</span>
                <strong>{yen(order.basePrice || basePlanPrice)}</strong>
              </div>
            )}
            {purchasableOptions.map((option) => (
              <label
                key={option.id}
                className="flex items-center justify-between gap-3 rounded-xl bg-cream px-4 py-3 text-sm"
              >
                <span>
                  <input
                    type="checkbox"
                    disabled={disabled}
                    checked={selectedIds.includes(option.id)}
                    onChange={(event) =>
                      setSelectedIds((current) =>
                        event.target.checked
                          ? [...current, option.id]
                          : current.filter((id) => id !== option.id),
                      )
                    }
                    className="mr-3 accent-brand"
                  />
                  {option.name}
                </span>
                <strong className="shrink-0">{yen(option.defaultPrice)}</strong>
              </label>
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-dashed border-line p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-bold text-ink">自由追加項目</p>
              <button
                type="button"
                disabled={disabled}
                onClick={() =>
                  setCustomOptions((current) => [
                    ...current,
                    {
                      id: `custom-${Date.now()}`,
                      name: "",
                      price: 0,
                      defaultPrice: 0,
                    },
                  ])
                }
                className="rounded-full border border-brand px-3 py-2 text-xs text-brand disabled:opacity-40"
              >
                項目を追加
              </button>
            </div>
            {customOptions.map((option) => (
              <div key={option.id} className="mt-2 flex gap-2">
                <input
                  disabled={disabled}
                  value={option.name}
                  onChange={(event) =>
                    setCustomOptions((current) =>
                      current.map((item) =>
                        item.id === option.id
                          ? { ...item, name: event.target.value }
                          : item,
                      ),
                    )
                  }
                  placeholder="項目名"
                  className="min-w-0 flex-1 rounded-lg border border-line bg-cream px-3 py-2 text-sm"
                />
                <input
                  disabled={disabled}
                  type="number"
                  min="1"
                  value={option.price || ""}
                  onChange={(event) =>
                    setCustomOptions((current) =>
                      current.map((item) =>
                        item.id === option.id
                          ? {
                              ...item,
                              price: Number(event.target.value),
                              defaultPrice: Number(event.target.value),
                            }
                          : item,
                      ),
                    )
                  }
                  placeholder="金額"
                  className="w-28 rounded-lg border border-line bg-cream px-3 py-2 text-sm"
                />
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() =>
                    setCustomOptions((current) =>
                      current.filter((item) => item.id !== option.id),
                    )
                  }
                  aria-label={`${option.name || "追加項目"}を削除`}
                  className="rounded-lg px-2 text-sm text-red-600 disabled:opacity-40"
                >
                  削除
                </button>
              </div>
            ))}
          </div>

          <label className="mt-5 block text-sm font-bold text-ink">
            お客さまへの補足
            <textarea
              disabled={disabled}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={3}
              className="mt-2 w-full rounded-xl border border-line bg-cream px-4 py-3 text-sm font-normal"
            />
          </label>
          <p className="mt-5 text-right font-maru text-lg font-bold text-ink">
            合計：{yen(amounts.totalPrice)}
          </p>
          {(!approved || editing) && !frozen && (
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => onSave(options, note)}
                disabled={saving || amounts.totalPrice <= 0}
                className="rounded-full bg-brand px-5 py-3 text-sm font-bold text-white disabled:opacity-50"
              >
                {saving ? "保存中..." : "内容を保存して購入を許可"}
              </button>
              {approved && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedIds(
                      (order.options ?? [])
                        .filter((option) =>
                          purchasableOptions.some(
                            (preset) => preset.id === option.id,
                          ),
                        )
                        .map((option) => option.id),
                    );
                    setCustomOptions(
                      (order.options ?? [])
                        .filter(
                          (option) =>
                            !purchasableOptions.some(
                              (preset) => preset.id === option.id,
                            ),
                        )
                        .map((option) => ({
                          id: option.id,
                          name: option.name,
                          price: option.price,
                          defaultPrice: option.price,
                        })),
                    );
                    setNote(order.note || "");
                    setEditing(false);
                  }}
                  className="rounded-full border border-line px-5 py-3 text-sm font-bold text-ink-soft"
                >
                  編集をキャンセル
                </button>
              )}
            </div>
          )}
          {approved && (
            <div className="mt-5 border-t border-line pt-4">
              <button
                type="button"
                onClick={onRevoke}
                disabled={saving || frozen}
                className="rounded-full border border-red-300 px-4 py-2.5 text-sm font-bold text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                購入許可を取り消す
              </button>
              <p className="mt-2 text-xs leading-5 text-ink-mute">
                {order.paymentStatus === "paid"
                  ? "支払い済みの許可は取り消せません。"
                  : invoiceActive
                    ? "Square請求書のキャンセル反映後に操作できます。"
                    : "許可を取り消すと、お客さまはこの依頼を購入できなくなります。"}
              </p>
            </div>
          )}
        </>
      )}
      {message && (
        <p role="status" className="mt-4 text-sm text-brand-deep">
          {message}
        </p>
      )}
    </section>
  );
}

function SubscriptionPanel({
  order,
  saving,
  message,
  onSave,
}: {
  order: Project | null;
  saving: boolean;
  message: string;
  onSave: (price: number) => Promise<void>;
}) {
  const [price, setPrice] = useState(
    order?.subscriptionPrice ?? maintenanceSubscriptionPrice,
  );
  const [editing, setEditing] = useState(!order?.subscriptionApproved);
  const approved = Boolean(order?.subscriptionApproved);
  const disabled = approved && !editing;
  return (
    <section className="mt-6 rounded-3xl border border-line bg-white p-6 shadow-card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold tracking-[0.14em] text-brand">
            SUBSCRIPTION
          </p>
          <h3 className="mt-2 font-maru text-xl font-bold text-ink">
            維持費サブスク
          </h3>
        </div>
        {approved && !editing && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="rounded-full border border-brand px-4 py-2 text-xs font-bold text-brand"
          >
            編集
          </button>
        )}
      </div>
      {!order ? (
        <p className="mt-4 text-sm text-ink-soft">先に依頼を登録してください。</p>
      ) : (
        <>
          <p className="mt-3 text-sm text-ink-soft">
            月額料金を設定してサブスクの購入許可を行います。
          </p>
          <input
            disabled={disabled}
            type="number"
            min="1"
            value={price}
            onChange={(event) => setPrice(Number(event.target.value))}
            className="mt-5 w-full rounded-xl border border-line bg-cream px-4 py-3 text-lg"
          />
          {(!approved || editing) && (
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => onSave(price)}
                disabled={saving || price <= 0}
                className="rounded-full bg-brand px-5 py-3 text-sm font-bold text-white disabled:opacity-50"
              >
                {saving ? "保存中..." : approved ? "変更を保存" : "サブスクを許可する"}
              </button>
              {approved && (
                <button
                  type="button"
                  onClick={() => {
                    setPrice(
                      order?.subscriptionPrice ?? maintenanceSubscriptionPrice,
                    );
                    setEditing(false);
                  }}
                  className="rounded-full border border-line px-5 py-3 text-sm font-bold text-ink-soft"
                >
                  キャンセル
                </button>
              )}
            </div>
          )}
          {message && <p className="mt-4 text-sm text-brand-deep">{message}</p>}
        </>
      )}
    </section>
  );
}

function ProfilePanel({
  user,
  order,
}: {
  user: AdminUser;
  order: Project | null;
}) {
  return (
    <section className="mt-6 grid gap-6 md:grid-cols-2">
      <div className="rounded-3xl border border-line bg-white p-6 shadow-card">
        <p className="text-xs text-brand">PROFILE</p>
        <dl className="mt-4 space-y-3 text-sm">
          <ProfileField label="氏名" value={user.displayName} />
          <ProfileField label="会社名・店舗名" value={user.companyName} />
          <ProfileField label="連絡用メールアドレス" value={user.email} />
          <ProfileField label="電話番号" value={user.phone} />
        </dl>
        <p className="mt-4 break-all border-t border-line pt-3 font-mono text-xs text-ink-mute">
          {user.uid}
        </p>
      </div>
      <div className="rounded-3xl border border-line bg-white p-6 shadow-card">
        <p className="text-xs text-brand">ORDER STATUS</p>
        <p className="mt-4 font-maru text-lg font-bold">
          {order?.title || "依頼未選択"}
        </p>
        <p className="mt-2 font-maru text-2xl font-bold">
          {order ? yen(order.totalPrice) : "未設定"}
        </p>
        <p className="mt-2 text-sm text-ink-soft">
          {order?.paymentStatus || "購入許可なし"}
        </p>
        <p className="mt-2 text-xs text-ink-mute">
          購入許可: {order?.purchaseApproved ? "許可済み" : "未許可"}／利用制限:{" "}
          {order?.accessUnlocked ? "解除済み" : "未解除"}
        </p>
        {order?.projectInvoice?.publicUrl && (
          <a
            href={order.projectInvoice.publicUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-block break-all text-xs font-bold text-brand hover:text-brand-deep"
          >
            Squareの請求書を開く
          </a>
        )}
      </div>
    </section>
  );
}

function ProfileField({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <dt className="text-xs text-ink-mute">{label}</dt>
      <dd className="mt-1 break-words font-bold">{value || "未設定"}</dd>
    </div>
  );
}

type DiagnosticsResult = {
  ok: boolean;
  ready?: boolean;
  missing?: string[];
  square?: {
    configured: boolean;
    hasAccessToken: boolean;
    hasLocationId: boolean;
    hasWebhookSignatureKey: boolean;
    environment: string;
  };
  firebaseAdmin?: {
    configured: boolean;
    hasServiceAccountKey: boolean;
    hasSplitKeys: boolean;
    rawJsonParseOk?: boolean;
    privateKeyValid?: boolean;
    source?: string;
  };
  hint?: string;
  error?: string;
};

function SystemPanel({ password }: { password: string }) {
  const [result, setResult] = useState<DiagnosticsResult | null>(null);
  const [checking, setChecking] = useState(false);

  async function check() {
    setChecking(true);
    setResult(null);
    try {
      const response = await fetch("/api/admin/diagnostics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await response.json().catch(() => ({}))) as DiagnosticsResult;
      setResult(data);
    } catch {
      setResult({ ok: false, error: "診断APIへの接続に失敗しました。" });
    } finally {
      setChecking(false);
    }
  }

  return (
    <section className="mt-6 rounded-3xl border border-line bg-white p-6 shadow-card">
      <p className="text-xs font-bold tracking-[0.14em] text-brand">SYSTEM</p>
      <h3 className="mt-2 font-maru text-xl font-bold text-ink">決済設定の診断</h3>
      <p className="mt-3 text-sm leading-7 text-ink-soft">
        決済設定が不足している場合、サーバー側の環境変数を確認できます（秘密鍵の値は表示しません）。
      </p>
      <button
        type="button"
        onClick={check}
        disabled={checking}
        className="mt-5 rounded-full bg-brand px-5 py-3 text-sm font-bold text-white disabled:opacity-60"
      >
        {checking ? "確認中..." : "設定状況を確認する"}
      </button>
      {result && !result.ok && (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {result.error || "確認に失敗しました。"}
        </p>
      )}
      {result?.ok && (
        <div className="mt-5 space-y-3 text-sm">
          <p
            className={`rounded-xl px-4 py-3 font-bold ${result.ready ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}
          >
            {result.ready
              ? "○ 決済の発行準備は完了しています"
              : "× 不足している設定があります"}
          </p>
          {result.missing && result.missing.length > 0 && (
            <p className="rounded-xl bg-cream px-4 py-3 text-ink-soft">
              不足:{" "}
              <span className="font-mono font-bold">
                {result.missing.join(" / ")}
              </span>
            </p>
          )}
          <ul className="space-y-1 text-xs text-ink-soft">
            <li>SQUARE_ACCESS_TOKEN: {result.square?.hasAccessToken ? "○" : "×"}</li>
            <li>SQUARE_LOCATION_ID: {result.square?.hasLocationId ? "○" : "×"}</li>
            <li>SQUARE_ENVIRONMENT: {result.square?.environment}</li>
            <li>SQUARE_WEBHOOK_SIGNATURE_KEY: {result.square?.hasWebhookSignatureKey ? "○" : "×（Webhook受信不可）"}</li>
            <li>Firebase Admin: {result.firebaseAdmin?.configured ? "○" : "×"}</li>
            {result.firebaseAdmin?.source && (
              <li>検出形式: {result.firebaseAdmin.source}</li>
            )}
            {result.hint && <li>{result.hint}</li>}
          </ul>
        </div>
      )}
    </section>
  );
}
