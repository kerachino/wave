"use client";

// 運営画面用の依頼一覧。旧 orders があれば読み取り用候補として扱います。

import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { basePlanPrice, type Order } from "@/lib/model";
import {
  legacyProject,
  projectsCollection,
  projectWriteBase,
  sortProjects,
  type Project,
} from "@/lib/projects";

type AdminProjectState = {
  uid: string;
  projects: Project[];
  activeId: string;
  ready: boolean;
};

export function useAdminProjects(uid: string, enabled: boolean) {
  const [state, setState] = useState<AdminProjectState | null>(null);

  useEffect(() => {
    if (!enabled || !uid || !db || !isFirebaseConfigured) return;

    let nextProjects: Project[] = [];
    let legacy: Project | null = null;
    const publish = () => {
      const list = nextProjects.length ? nextProjects : legacy ? [legacy] : [];
      const sorted = sortProjects(list);
      setState((current) => ({
        uid,
        projects: sorted,
        activeId:
          current?.uid === uid &&
          sorted.some((project) => project.id === current.activeId)
            ? current.activeId
            : sorted[0]?.id ?? "",
        ready: true,
      }));
    };

    const stopProjects = onSnapshot(
      query(collection(db, projectsCollection), where("uid", "==", uid)),
      (snapshot) => {
        nextProjects = snapshot.docs.map(
          (item) => ({ id: item.id, ...item.data() }) as Project,
        );
        publish();
      },
      () => publish(),
    );
    const stopLegacy = onSnapshot(
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
      stopProjects();
      stopLegacy();
    };
  }, [uid, enabled]);

  const currentState = state?.uid === uid ? state : null;
  const projects = currentState?.projects ?? [];
  const activeId = currentState?.activeId ?? "";
  const selectedProject =
    projects.find((project) => project.id === activeId) ?? null;

  function selectProject(id: string) {
    if (!uid) return;
    setState((current) =>
      current?.uid === uid ? { ...current, activeId: id } : current,
    );
  }

  async function createProject(title: string, isAdditional = false) {
    if (!db || !isFirebaseConfigured || !uid || !title.trim()) return null;
    const legacy = projects.find((project) => project.legacy);
    if (legacy) {
      await setDoc(
        doc(db, projectsCollection, legacy.id),
        {
          uid,
          ...projectWriteBase(legacy),
          title: legacy.title || "既存のご依頼",
          createdAt: legacy.createdAt ?? serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );
    }

    const basePrice = isAdditional ? 0 : basePlanPrice;
    const created = await addDoc(collection(db, projectsCollection), {
      uid,
      title: title.trim(),
      purchaseKind: isAdditional ? "additional" : "project",
      basePrice,
      options: [],
      totalPrice: basePrice,
      firstAmount: basePrice,
      remainingAmount: 0,
      status: "pending_payment",
      paymentStatus: "unpaid",
      purchaseApproved: false,
      subscriptionApproved: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    setState((current) =>
      current?.uid === uid ? { ...current, activeId: created.id } : current,
    );
    return created.id;
  }

  return {
    projects,
    selectedProject,
    selectedProjectId: activeId,
    selectProject,
    createProject,
    loading:
      enabled &&
      Boolean(uid) &&
      isFirebaseConfigured &&
      !currentState?.ready,
  };
}
