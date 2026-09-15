"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, isFirebaseConfigured } from "@/lib/firebase";
import { db } from "@/lib/firebase";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  logout: () => Promise<void>;
};
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(isFirebaseConfigured && Boolean(auth));
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) return;
    return onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      if (!nextUser || !db) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }
      getDoc(doc(db, "users", nextUser.uid))
        .then((snapshot) => setIsAdmin(snapshot.data()?.isAdmin === true))
        .catch(() => setIsAdmin(false))
        .finally(() => setLoading(false));
    });
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAdmin,
      logout: async () => {
        if (auth) await signOut(auth);
      },
    }),
    [user, loading, isAdmin],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("AuthProvider is missing");
  return context;
}
