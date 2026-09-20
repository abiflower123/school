import React, { createContext, useContext, useState, useCallback } from "react";
import {
  mockParentAccounts,
  mockStudentAccounts,
  getStudentById,
  getStudentsByIds,
  getInitials,
  type Student,
  type ParentAccount,
} from "../services/mock/students";

// ============================================================
// Auth Context — provides user, selected child, multi-child switching
// ============================================================

export type UserRole = "parent" | "student";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  parentAccount?: ParentAccount;
};

export type LoginErrorCode = "invalid" | "locked" | "network";

export type LoginResult = { success: boolean; error?: string; code?: LoginErrorCode };

export type AuthContextValue = {
  user: AuthUser | null;
  selectedChild: Student | null;
  children: Student[];
  isParent: boolean;
  isStudent: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => void;
  switchChild: (studentId: string) => void;
  getInitials: (name: string) => string;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const SELECTED_CHILD_KEY = "ravion_selected_child";
const AUTH_USER_KEY = "ravion_auth_user";

// Reserved demo identifiers used only to let the prototype UI demonstrate
// account-locked and network-unavailable states without a real backend.
// Remove once a real API drives these outcomes.
const DEMO_LOCKED_EMAIL = "locked.parent@example.com";
const DEMO_NETWORK_ERROR_EMAIL = "offline.parent@example.com";

export function AuthProvider({ children: reactChildren }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = sessionStorage.getItem(AUTH_USER_KEY);
      return stored ? (JSON.parse(stored) as AuthUser) : null;
    } catch {
      return null;
    }
  });

  const [selectedChildId, setSelectedChildId] = useState<string | null>(() => {
    return sessionStorage.getItem(SELECTED_CHILD_KEY);
  });

  // Derive children list
  const childrenList: Student[] = (() => {
    if (!user) return [];
    if (user.role === "parent" && user.parentAccount) {
      return getStudentsByIds(user.parentAccount.childIds);
    }
    if (user.role === "student") {
      const acc = mockStudentAccounts.find((a) => a.email === user.email);
      if (acc) {
        const stu = getStudentById(acc.studentId);
        return stu ? [stu] : [];
      }
    }
    return [];
  })();

  const selectedChild: Student | null = (() => {
    if (!user) return null;
    if (selectedChildId) {
      const found = childrenList.find((c) => c.id === selectedChildId);
      if (found) return found;
    }
    return childrenList[0] ?? null;
  })();

  const login = useCallback(
    async (email: string, password: string): Promise<LoginResult> => {
      const normalizedEmail = email.trim().toLowerCase();

      if (normalizedEmail === DEMO_LOCKED_EMAIL) {
        return {
          success: false,
          code: "locked",
          error: "This account has been temporarily locked. Please contact the school office.",
        };
      }
      if (normalizedEmail === DEMO_NETWORK_ERROR_EMAIL) {
        return {
          success: false,
          code: "network",
          error: "We couldn't reach the school server. Check your connection and try again.",
        };
      }

      // Check parent accounts
      const parentAcc = mockParentAccounts.find(
        (a) => a.email.toLowerCase() === email.toLowerCase() && a.password === password
      );
      if (parentAcc) {
        const authUser: AuthUser = {
          id: parentAcc.id,
          name: parentAcc.name,
          email: parentAcc.email,
          role: "parent",
          parentAccount: parentAcc,
        };
        setUser(authUser);
        sessionStorage.setItem(AUTH_USER_KEY, JSON.stringify(authUser));
        // Pre-select first child
        const firstChildId = parentAcc.childIds[0];
        setSelectedChildId(firstChildId);
        sessionStorage.setItem(SELECTED_CHILD_KEY, firstChildId);
        return { success: true };
      }

      // Check student accounts
      const studentAcc = mockStudentAccounts.find(
        (a) => a.email.toLowerCase() === email.toLowerCase() && a.password === password
      );
      if (studentAcc) {
        const stu = getStudentById(studentAcc.studentId);
        const authUser: AuthUser = {
          id: studentAcc.id,
          name: stu?.name ?? "Student",
          email: studentAcc.email,
          role: "student",
        };
        setUser(authUser);
        sessionStorage.setItem(AUTH_USER_KEY, JSON.stringify(authUser));
        setSelectedChildId(studentAcc.studentId);
        sessionStorage.setItem(SELECTED_CHILD_KEY, studentAcc.studentId);
        return { success: true };
      }

      return { success: false, code: "invalid", error: "Invalid email or password." };
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);
    setSelectedChildId(null);
    sessionStorage.removeItem(AUTH_USER_KEY);
    sessionStorage.removeItem(SELECTED_CHILD_KEY);
  }, []);

  const switchChild = useCallback((studentId: string) => {
    setSelectedChildId(studentId);
    sessionStorage.setItem(SELECTED_CHILD_KEY, studentId);
  }, []);

  const value: AuthContextValue = {
    user,
    selectedChild,
    children: childrenList,
    isParent: user?.role === "parent",
    isStudent: user?.role === "student",
    isAuthenticated: !!user && !!selectedChild,
    login,
    logout,
    switchChild,
    getInitials,
  };

  return <AuthContext.Provider value={value}>{reactChildren}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
