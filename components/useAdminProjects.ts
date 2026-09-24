"use client";

// 運営画面用の、ご顧客ごとの依頼（プロジェクト）一覧。
// Firestore の projects を使い、旧 orders があれば読み取り用の候補として扱います。

import { useEffect, useState } from "react";
import { addDoc, collection, doc, onSnapshot, query, serverTimestamp, setDoc, where } from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { basePlanPrice, type Order } from "@/lib/model";
import { legacyProject, projectsCollection, projectWriteBase, sortProjects, type Project } from "@/lib/projects";

export function useAdminProjects(uid: string, enabled: boolean) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeId, setActiveId] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setProjects([]);
    setActiveId("");
    setReady(false);
    if (!enabled || !uid || !db || !isFirebaseConfigured) return;

    let nextProjects: Project[] = [];
    let legacy: Project | null = null;
    const publish = () => {
      const list = nextProjects.length ? nextProjects : legacy ? [legacy] : [];
      const sorted = sortProjects(list);
      setProjects(sorted);
      setActiveId((current) => sorted.some((project) => project.id === current) ? current : sorted[0]?.id ?? "");
      setReady(true);
    };
    const stopProjects = onSnapshot(
      query(collection(db, projectsCollection), where("uid", "==", uid)),
      (snapshot) => {
        nextProjects = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as Project);
        publish();
      },
      () => publish(),
    );
    const stopLegacy = onSnapshot(
      doc(db, "orders", uid),
      (snapshot) => {
        legacy = snapshot.exists() ? legacyProject(uid, snapshot.data() as Order) : null;
        publish();
      },
      () => publish(),
    );
    return () => { stopProjects(); stopLegacy(); };
  }, [uid, enabled]);

  const selectedProject = projects.find((project) => project.id === activeId) ?? null;

  async function createProject(title: string) {
    if (!db || !isFirebaseConfigured || !title.trim()) return false;
    // 旧データが残っている場合は先に移行し、既存ご依頼を失わないようにします。
    const legacy = projects.find((project) => project.legacy);
    if (legacy) {
      await setDoc(doc(db, projectsCollection, legacy.id), {
        uid,
        ...projectWriteBase(legacy),
        title: legacy.title || "既存のご依頼",
        createdAt: legacy.createdAt ?? serverTimestamp(),
        updatedAt: serverTimestamp(),
      }, { merge: true });
    }
    await addDoc(collection(db, projectsCollection), {
      uid,
      title: title.trim(),
      basePrice: basePlanPrice,
      options: [],
      totalPrice: basePlanPrice,
      firstAmount: basePlanPrice,
      remainingAmount: 0,
      status: "pending_payment",
      paymentStatus: "unpaid",
      purchaseApproved: false,
      subscriptionApproved: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return true;
  }

  return { projects, selectedProject, selectedProjectId: activeId, selectProject: setActiveId, createProject, loading: enabled && Boolean(uid) && isFirebaseConfigured && !ready };
}
