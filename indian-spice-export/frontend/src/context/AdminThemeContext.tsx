import React, { createContext, useContext, useState, useEffect } from "react";

interface AdminThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  density: "comfortable" | "compact";
  setDensity: (d: "comfortable" | "compact") => void;
}

const AdminThemeContext = createContext<AdminThemeContextType | undefined>(undefined);

export const AdminThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("ise_admin_dark_mode") === "true";
  });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    return localStorage.getItem("ise_admin_sidebar_collapsed") === "true";
  });
  const [density, setDensityState] = useState<"comfortable" | "compact">(() => {
    return (localStorage.getItem("ise_admin_density") as any) || "comfortable";
  });

  useEffect(() => {
    localStorage.setItem("ise_admin_dark_mode", String(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem("ise_admin_sidebar_collapsed", String(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);
  const toggleSidebar = () => setIsSidebarCollapsed((prev) => !prev);
  const setDensity = (d: "comfortable" | "compact") => {
    setDensityState(d);
    localStorage.setItem("ise_admin_density", d);
  };

  return (
    <AdminThemeContext.Provider
      value={{
        isDarkMode,
        toggleDarkMode,
        isSidebarCollapsed,
        toggleSidebar,
        density,
        setDensity,
      }}
    >
      {children}
    </AdminThemeContext.Provider>
  );
};

export function useAdminTheme(): AdminThemeContextType {
  const context = useContext(AdminThemeContext);
  if (!context) {
    throw new Error("useAdminTheme must be used within an AdminThemeProvider");
  }
  return context;
}
