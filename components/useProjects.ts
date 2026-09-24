"use client";

// ============================================================
// ご依頼（プロジェクト）の一覧と選択を扱うフック
//
// ・projects（uid が一致するもの）を購読します。
// ・projects が1件も無く、旧 orders/{uid} がある場合はそれを
//   「ご依頼（既存）」として1件表示します（読み取り専用のフォールバック）。
// ・選択中のプロジェクトは、ページを移動しても保持されます（同一セッション内）。
// ============================================================

import { useEffect, useState } from "react";
import { collection, doc, onSnapshot, query, where } from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import type { Order } from "@/lib/model";
import {
  legacyProject,
  projectsCollection,
  sortProjects,
  type Project,
} from "@/lib/projects";

// ページを移動しても選択を覚えておくための、ご顧客ごとの記憶
const rememberedProjectIds = new Map<string, string>();

export function useProjects(uid: string | undefined) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [ready, setReady] = useState(false);
  const [chosenId, setChosenId] = useState("");
  // projectId は画面から指定できない場合があるため、
  // 選択中のIDは「明示的な選択」→「セッション内の記憶」→「先頭」の順に決めます。
  const rememberedId = uid ? rememberedProjectIds.get(uid) ?? "" : "";
  const preferredId = chosenId || rememberedId;
  const selected =
    projects.find((project) => project.id === preferredId) ?? projects[0] ?? null;
  const selectedId = selected?.id ?? "";

  useEffect(() => {
    setReady(false);
    setChosenId("");
    setProjects([]);
    if (!uid || !db || !isFirebaseConfigured) return;
    let projectList: Project[] = [];
    let legacy: Project | null = null;
    const publish = () => {
      const list = projectList.length > 0 ? projectList : legacy ? [legacy] : [];
      setProjects(sortProjects(list));
      setReady(true);
    };
    const unsubscribeProjects = onSnapshot(
      query(
        collection(db, projectsCollection),
        where("uid", "==", uid),
      ),
      (snapshot) => {
        projectList = snapshot.docs.map(
          (item) => ({ id: item.id, ...item.data() }) as Project,
        );
        publish();
      },
      () => publish(),
    );
    const unsubscribeLegacy = onSnapshot(
      doc(db, "orders", uid),
      (snapshot) => {
        legacy = snapshot.exists()
          ? legacyProject(uid, snapshot.data() as Order)
          : null;
        publish();
      },
      () => publish(),
    );
    return () => {
      unsubscribeProjects();
      unsubscribeLegacy();
    };
  }, [uid]);

  function select(id: string) {
    if (uid) rememberedProjectIds.set(uid, id);
    setChosenId(id);
  }

  return {
    projects,
    selected,
    selectedId,
    select,
    loading: Boolean(uid) && isFirebaseConfigured && !ready,
  };
}
