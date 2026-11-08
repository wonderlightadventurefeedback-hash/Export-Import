import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { adminApi, AdminUser } from "../services/adminApi";

interface AdminAuthContextType {
  user: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isOwner: boolean;
  canEditContent: boolean;
  canManageSales: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const IDLE_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes auto-logout

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(() => {
    const saved = localStorage.getItem("ise_admin_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("ise_admin_token");
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const logout = useCallback(async () => {
    try {
      await adminApi.logout();
    } catch {
      // Ignore network errors on logout
    }
    setUser(null);
    setToken(null);
    localStorage.removeItem("ise_admin_token");
    localStorage.removeItem("ise_admin_user");
  }, []);

  const login = async (email: string, password: string) => {
    const res = await adminApi.login(email, password);
    setUser(res.user);
    setToken(res.token);
    localStorage.setItem("ise_admin_token", res.token);
    localStorage.setItem("ise_admin_user", JSON.stringify(res.user));
  };

  // Check auth state on mount
  useEffect(() => {
    const checkAuth = async () => {
      const savedToken = localStorage.getItem("ise_admin_token");
      if (savedToken) {
        try {
          const res = await adminApi.getMe();
          setUser(res.user);
          localStorage.setItem("ise_admin_user", JSON.stringify(res.user));
        } catch {
          // If token expired and not in dev bypass mode
          if (!savedToken.startsWith("dev-admin-token")) {
            logout();
          }
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [logout]);

  // Auto logout on idle (15 min)
  useEffect(() => {
    if (!token) return;

    let timer: any;

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        console.warn("[Admin Auth] Session closed due to 15-minute inactivity.");
        logout();
      }, IDLE_TIMEOUT_MS);
    };

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("click", resetTimer);
    window.addEventListener("scroll", resetTimer);

    resetTimer();

    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("click", resetTimer);
      window.removeEventListener("scroll", resetTimer);
    };
  }, [token, logout]);

  const role = user?.role;
  const isOwner = role === "Owner";
  const canEditContent = role === "Owner" || role === "Editor";
  const canManageSales = role === "Owner" || role === "Sales";

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(token && user),
        isLoading,
        login,
        logout,
        isOwner,
        canEditContent,
        canManageSales,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export function useAdminAuth(): AdminAuthContextType {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
}
