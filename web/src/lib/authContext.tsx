"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, Role } from "./types";
import { api } from "./api";

interface AuthContextType {
  user: User | null;
  role: Role;
  isLoading: boolean;
  loginAsRole: (role: Role) => Promise<void>;
  resetDemoData: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role>("creator");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loginAsRole = async (targetRole: Role) => {
    setIsLoading(true);
    try {
      const res = await api.auth.demoLogin(targetRole);
      localStorage.setItem("verity_token", res.access_token);
      localStorage.setItem("verity_role", targetRole);
      setUser(res.user);
      setRole(targetRole);
    } catch (err) {
      console.error("Failed to login as role:", targetRole, err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetDemoData = async () => {
    setIsLoading(true);
    try {
      await api.auth.resetDemo();
      await loginAsRole(role || "creator");
    } catch (err) {
      console.error("Failed to reset demo:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("verity_token");
    localStorage.removeItem("verity_role");
    setUser(null);
  };

  useEffect(() => {
    const savedRole = (localStorage.getItem("verity_role") as Role) || "creator";
    loginAsRole(savedRole);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isLoading,
        loginAsRole,
        resetDemoData,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
