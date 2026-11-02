"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onIdTokenChanged, signOut, type User } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, isFirebaseConfigured } from "@/lib/firebase";
import { db } from "@/lib/firebase";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  sessionId: number;
  logout: () => Promise<void>;
};
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(isFirebaseConfigured && Boolean(auth));
  const [isAdmin, setIsAdmin] = useState(false);
  const [sessionId, setSessionId] = useState(0);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) return;
    let authChangeId = 0;
    const unsubscribe = onIdTokenChanged(auth, (nextUser) => {
      const currentChangeId = ++authChangeId;
      setSessionId((current) => current + 1);
      setUser(nextUser);
      setIsAdmin(false);
      setLoading(true);
      if (!nextUser || !db) {
        setLoading(false);
        return;
      }
      const userDoc = doc(db, "users", nextUser.uid);
      getDoc(userDoc)
        .then(async (snapshot) => {
          if (currentChangeId !== authChangeId) return;
          const profile = {
            email: nextUser.email ?? "",
            displayName: nextUser.displayName ?? "",
            photoURL: nextUser.photoURL ?? "",
          };
          if (!snapshot.exists()) {
            await setDoc(userDoc, {
              uid: nextUser.uid,
              ...profile,
              isAdmin: false,
              createdAt: serverTimestamp(),
            });
          } else if (
            snapshot.data()?.email !== profile.email ||
            snapshot.data()?.displayName !== profile.displayName ||
            snapshot.data()?.photoURL !== profile.photoURL
          ) {
            await setDoc(userDoc, profile, { merge: true });
          }
          if (currentChangeId === authChangeId) {
            setIsAdmin(snapshot.data()?.isAdmin === true);
          }
        })
        .catch(() => {
          if (currentChangeId === authChangeId) setIsAdmin(false);
        })
        .finally(() => {
          if (currentChangeId === authChangeId) setLoading(false);
        });
    });
    return () => {
      authChangeId++;
      unsubscribe();
    };
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAdmin,
      sessionId,
      logout: async () => {
        if (auth) await signOut(auth);
      },
    }),
    [user, loading, isAdmin, sessionId],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("AuthProvider is missing");
  return context;
}
