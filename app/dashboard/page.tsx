"use client";

// ============================================================
// マイページ「概要」
//
// ・契約の金額や内容は表示せず、進行ステップと
//   「本契約・維持費が完了しているか」だけを表示します。
// ・1人のお客さまが複数のご依頼を持てるため、ProjectSwitcher で切替できます。
// ============================================================

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { ProjectSwitcher } from "@/components/ProjectSwitcher";
import { useProjects } from "@/components/useProjects";
import { isFirebaseConfigured } from "@/lib/firebase";
import {
  contractLabel,
  projectPhase,
  projectSteps,
  projectTitle,
  subscriptionLabel,
  type ProjectStep,
} from "@/lib/projects";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const {
    projects,
    selected,
    selectedId,
    select,
    loading: projectsLoading,
  } = useProjects(user?.uid);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading || !user)
    return <p className="text-sm text-ink-mute">読み込み中...</p>;

  const phase = projectPhase(selected);
  const steps = projectSteps(selected);
  const contractDone = phase.contract === "paid";
  const subscriptionDone = phase.subscription === "paid";
  const completedSteps = steps.filter((step) => step.state === "done").length;
  const progressPercent = Math.round((completedSteps / steps.length) * 100);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header>
        <p className="text-xs font-bold tracking-[0.18em] text-brand">
          OVERVIEW
        </p>
        <h1 className="mt-2 font-maru text-3xl font-bold text-ink">
          ご契約の進行状況
        </h1>
        <p className="mt-2 text-sm text-ink-soft">{user.email}</p>
      </header>

      {!isFirebaseConfigured ? (
        <Notice
          title="マイページは準備中です"
          body="Firebase の設定完了後、ご依頼の進捗と支払い状況をご覧いただけます。"
        />
      ) : projectsLoading ? (
        <p className="text-sm text-ink-mute">読み込み中...</p>
      ) : projects.length === 0 ? (
        <Notice
          title="ご依頼がまだ登録されていません"
          body="お問い合わせフォームからご相談ください。運営者がご依頼を登録すると、このページにステップと完了状況が表示されます。"
        />
      ) : (
        <>
          <ProjectSwitcher
            projects={projects}
            selectedId={selectedId}
            onSelect={select}
            className="w-full justify-between sm:w-auto"
          />

          <section className="rounded-3xl border border-line bg-white p-6 shadow-card sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold tracking-[0.14em] text-brand">
                  CURRENT PROJECT
                </p>
                <h2 className="mt-2 font-maru text-xl font-bold text-ink">
                  {projectTitle(selected)}
                </h2>
              </div>
              <span className="rounded-full bg-cream px-3 py-1 text-xs font-bold text-ink-soft">
                {projects.length > 1
                  ? `全${projects.length}件のご依頼`
                  : "1件のご依頼"}
              </span>
            </div>

            {/* 本契約・維持費の完了状況（金額は表示しません） */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <StatusCard
                title="本契約"
                done={contractDone}
                detail={contractLabel(phase)}
                description="ホームページ制作のご契約とお支払い"
              />
              <StatusCard
                title="維持費サポート"
                done={subscriptionDone}
                detail={subscriptionLabel(phase)}
                description="公開後の保守・更新サポート"
              />
            </div>
          </section>

          <section className="rounded-3xl border border-line bg-white p-6 shadow-card sm:p-8">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-bold tracking-[0.14em] text-brand">
                  PROJECT PROGRESS
                </p>
                <h2 className="mt-1 font-maru text-xl font-bold text-ink">
                  進行ステップ
                </h2>
              </div>
              <p className="text-sm font-bold text-ink-soft">
                <span className="text-lg text-brand">{completedSteps}</span>
                <span className="mx-1">/</span>
                {steps.length} ステップ完了
              </p>
            </div>
            <div
              className="mt-4 h-2 overflow-hidden rounded-full bg-cream"
              role="progressbar"
              aria-label="進行ステップ"
              aria-valuemin={0}
              aria-valuemax={steps.length}
              aria-valuenow={completedSteps}
            >
              <div
                className="h-full rounded-full bg-midori transition-[width]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <ol className="mt-5">
              {steps.map((step, index) => (
                <li key={step.no}>
                  <StepRow step={step} />
                  {index < steps.length - 1 && (
                    <div className="flex h-8 items-center pl-[1.05rem]" aria-hidden="true">
                      <span className="h-full border-l-2 border-dashed border-brand/30" />
                      <span className="-ml-[0.4rem] text-sm font-bold text-brand">
                        ↓
                      </span>
                    </div>
                  )}
                </li>
              ))}
            </ol>
            <p className="mt-5 rounded-2xl bg-cream px-4 py-3 text-xs leading-6 text-ink-soft">
              契約の金額や詳細内容はお支払い画面でご確認いただけます。切り替えている依頼以外は、この画面には表示されません。
            </p>
            <div className="mt-5 flex flex-wrap gap-3 border-t border-line pt-5">
              <Link
                href="/dashboard/chat"
                className="rounded-full bg-brand px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-dark"
              >
                チャットで担当者に相談
              </Link>
              {!contractDone && (
                <Link
                  href="/dashboard/payment"
                  className="rounded-full border border-brand px-5 py-3 text-sm font-bold text-brand transition hover:bg-brand-soft"
                >
                  お支払い内容を確認
                </Link>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}


function Notice({ title, body }: { title: string; body: string }) {
  return (
    <section className="rounded-3xl border border-line bg-white p-8 shadow-card">
      <h2 className="font-maru text-xl font-bold text-ink">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-ink-soft">{body}</p>
      <Link
        href="/contact"
        className="mt-6 inline-block rounded-full border border-brand px-5 py-3 text-sm font-bold text-brand"
      >
        お問い合わせ
      </Link>
    </section>
  );
}

/** 本契約／維持費の完了状況（金額は表示しません） */
function StatusCard({
  title,
  done,
  detail,
  description,
}: {
  title: string;
  done: boolean;
  detail: string;
  description: string;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        done ? "border-brand/40 bg-brand-soft/50" : "border-line bg-cream/40"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="font-maru text-base font-bold text-ink">{title}</p>
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${
            done
              ? "bg-brand text-white"
              : "bg-white text-ink-mute shadow-sm"
          }`}
        >
          {done ? "完了" : detail}
        </span>
      </div>
      <p className="mt-2 text-xs leading-6 text-ink-soft">{description}</p>
    </div>
  );
}

function StepRow({ step }: { step: ProjectStep }) {
  const styles = {
    done: {
      marker: "完了",
      row: "border-midori/40 bg-midori-soft/40",
      icon: "bg-midori text-ink",
      badge: "bg-white text-midori-dark",
    },
    current: {
      marker: "進行中",
      row: "border-brand/50 bg-brand-soft/40 ring-1 ring-brand/10",
      icon: "bg-brand text-white",
      badge: "bg-brand text-white",
    },
    todo: {
      marker: "これから",
      row: "border-line bg-cream/30",
      icon: "bg-white text-ink-mute shadow-sm",
      badge: "bg-white text-ink-mute",
    },
  }[step.state];
  return (
    <div className={`flex items-start gap-4 rounded-2xl border p-4 ${styles.row}`}>
      <span
        className={`grid size-9 shrink-0 place-items-center rounded-full text-xs font-bold ${styles.icon}`}
        aria-label={`${step.no}番目`}
      >
        {step.state === "done" ? "✓" : step.no}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <p className="font-bold text-ink">{step.title}</p>
          <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${styles.badge}`}>
            {styles.marker}
          </span>
        </div>
        <p className="mt-1 text-xs leading-6 text-ink-soft">
          {step.description}
        </p>
      </div>
    </div>
  );
}
