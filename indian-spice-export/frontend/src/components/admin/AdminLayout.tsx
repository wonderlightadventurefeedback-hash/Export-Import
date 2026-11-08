import React, { useState, useEffect } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Inbox,
  Package,
  Layers,
  FileText,
  Truck,
  Building2,
  FileCheck,
  Image,
  Palette,
  Search,
  Globe,
  Settings,
  Mail,
  Users,
  Shield,
  Sliders,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  ExternalLink,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { useAdminTheme } from "../../context/AdminThemeContext";
import { CommandPalette } from "./CommandPalette";

interface NavGroup {
  label: string;
  items: Array<{
    name: string;
    path: string;
    icon: any;
    badge?: string;
    ownerOnly?: boolean;
    confidential?: boolean;
  }>;
}

export const AdminLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { user, logout, isOwner } = useAdminAuth();
  const { isDarkMode, toggleDarkMode, isSidebarCollapsed, toggleSidebar, density } = useAdminTheme();
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Listen for Ctrl+K (Command Palette) and Ctrl+S (Save)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent("admin:shortcut-save"));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Simplified and clean navigation groups
  const navGroups: NavGroup[] = [
    {
      label: "Main Menu",
      items: [
        { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
        { name: "Pages & Content", path: "/admin/pages", icon: FileCheck, badge: "Editor" },
        { name: "Spice Products", path: "/admin/products", icon: Package },
        { name: "Enquiries & Quotes", path: "/admin/enquiries", icon: Inbox },
        { name: "Company Profile", path: "/admin/settings", icon: Building2 },
      ],
    },
    {
      label: "Commercial & Trade",
      items: [
        { name: "Quotations", path: "/admin/quotations", icon: FileText },
        { name: "Buyers (CRM)", path: "/admin/buyers", icon: Users },
        { name: "Suppliers", path: "/admin/suppliers", icon: Truck, confidential: true },
      ],
    },
    {
      label: "System & Tools",
      items: [
        { name: "Categories", path: "/admin/categories", icon: Layers },
        { name: "Media Library", path: "/admin/media", icon: Image },
        { name: "SEO & Meta", path: "/admin/seo", icon: Globe },
        { name: "Users & Roles", path: "/admin/users", icon: Shield, ownerOnly: true },
        { name: "Preferences", path: "/admin/preferences", icon: Sliders },
      ],
    },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  return (
    <div
      className={`min-h-screen flex bg-slate-50 dark:bg-[#08100b] text-slate-900 dark:text-slate-100 transition-colors duration-200 ${
        density === "compact" ? "text-xs" : "text-sm"
      }`}
    >
      {/* ── Desktop Sidebar: Dual Theme (White & Dark) ── */}
      <aside
        className={`hidden md:flex flex-col border-r transition-all duration-300 relative z-30 select-none ${
          isSidebarCollapsed ? "w-20" : "w-64"
        } bg-white dark:bg-[#0c1812] border-slate-200 dark:border-[#182f22] text-slate-800 dark:text-slate-200 shadow-xs`}
      >
        {/* Sidebar Brand Header */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-slate-200 dark:border-[#1b3827] bg-slate-50/60 dark:bg-[#09160f]">
          {!isSidebarCollapsed ? (
            <Link to="/admin" className="flex items-center space-x-2.5 overflow-hidden group">
              <img
                src="/logo.png"
                alt="A.G Import & Export"
                className="w-8 h-8 rounded-full object-contain bg-white dark:bg-white/10 p-0.5 border border-amber-400 shadow-xs shrink-0"
              />
              <div className="truncate">
                <div className="font-sans font-bold tracking-tight text-slate-900 dark:text-white text-xs leading-tight">
                  A.G IMPORT &amp; EXPORT
                </div>
                <div className="text-[10px] tracking-wider uppercase text-amber-600 dark:text-amber-400 font-semibold">
                  Admin Control Room
                </div>
              </div>
            </Link>
          ) : (
            <Link to="/admin" className="mx-auto">
              <img
                src="/logo.png"
                alt="A.G Import & Export"
                className="w-8 h-8 rounded-full object-contain bg-white dark:bg-white/10 p-0.5 border border-amber-400"
              />
            </Link>
          )}

          <button
            onClick={toggleSidebar}
            className="p-1 rounded-md text-slate-400 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#142e20] transition-colors"
            title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Groups */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {navGroups.map((group) => {
            const visibleItems = group.items.filter((item) => !item.ownerOnly || isOwner);
            if (visibleItems.length === 0) return null;

            return (
              <div key={group.label} className="space-y-1">
                {!isSidebarCollapsed && (
                  <div className="px-3 text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                    {group.label}
                  </div>
                )}
                {visibleItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.path === "/admin"}
                      className={({ isActive }) =>
                        `flex items-center px-3 py-2 rounded-lg transition-all text-xs font-medium ${
                          isActive
                            ? "bg-emerald-700 text-white font-semibold shadow-xs dark:bg-[#dfb15b] dark:text-[#0c1812] dark:font-bold"
                            : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#152a1e] hover:text-slate-900 dark:hover:text-white"
                        } ${isSidebarCollapsed ? "justify-center" : "justify-between"}`
                      }
                      title={isSidebarCollapsed ? item.name : undefined}
                    >
                      <div className="flex items-center space-x-2.5">
                        <Icon className="w-4 h-4 shrink-0" />
                        {!isSidebarCollapsed && <span>{item.name}</span>}
                      </div>

                      {!isSidebarCollapsed && item.badge && (
                        <span className="text-[9px] bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200 px-1.5 py-0.5 rounded font-bold uppercase">
                          {item.badge}
                        </span>
                      )}

                      {!isSidebarCollapsed && item.confidential && (
                        <span className="text-[9px] bg-red-100 text-red-700 dark:bg-red-900/60 dark:text-red-200 px-1.5 py-0.5 rounded font-mono">
                          Private
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* User Card & Logout at Sidebar Bottom */}
        <div className="p-3 border-t border-slate-200 dark:border-[#1b3827] bg-slate-50/80 dark:bg-[#08150f]">
          {!isSidebarCollapsed ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-[#183a28] border border-emerald-300 dark:border-amber-400/40 flex items-center justify-center font-bold text-xs text-emerald-800 dark:text-amber-400">
                  {user?.fullName?.charAt(0) || "A"}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-slate-800 dark:text-white truncate">
                    {user?.fullName || "Admin"}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate capitalize">
                    {user?.role}
                  </div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="p-1.5 rounded text-slate-400 hover:text-red-600 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex justify-center">
              <button
                onClick={handleLogout}
                className="p-2 rounded text-slate-400 hover:text-red-600 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ── Main Content Area ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Sticky Header */}
        <header className="h-16 bg-white dark:bg-[#101e17] border-b border-slate-200 dark:border-[#1b3425] flex items-center justify-between px-4 sm:px-6 z-20 sticky top-0 shadow-xs">
          {/* Mobile menu trigger & Command Palette search pill */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#16291e]"
            >
              <Menu className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsCommandPaletteOpen(true)}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-[#16271e] border border-slate-200 dark:border-[#243c2d] text-xs text-slate-600 dark:text-slate-300 hover:border-amber-500 transition-all"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Search or run command...</span>
              <span className="sm:hidden">Search...</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] bg-white dark:bg-[#1f3629] rounded border border-slate-200 dark:border-[#2b4836] font-mono">
                Ctrl K
              </kbd>
            </button>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Quick Link: Edit Website Pages */}
            <Link
              to="/admin/pages"
              className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors"
            >
              <FileCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Website Editor</span>
            </Link>

            {/* View Live Storefront */}
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-amber-300 bg-slate-100 dark:bg-[#182c20] hover:bg-slate-200 dark:hover:bg-[#1f3a2a] transition-colors"
            >
              <span>View Site</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            {/* ── THEME SWITCHER: WHITE & DARK THEME ── */}
            <div className="flex items-center p-0.5 rounded-lg bg-slate-100 dark:bg-[#16271e] border border-slate-200 dark:border-[#263e2f]">
              <button
                type="button"
                onClick={() => isDarkMode && toggleDarkMode()}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                  !isDarkMode
                    ? "bg-white text-slate-900 shadow-xs border border-slate-200 font-bold"
                    : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
                title="Switch to White (Light) Theme"
              >
                <Sun className={`w-3.5 h-3.5 ${!isDarkMode ? "text-amber-500" : "text-slate-400"}`} />
                <span className="hidden sm:inline">White</span>
              </button>
              <button
                type="button"
                onClick={() => !isDarkMode && toggleDarkMode()}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                  isDarkMode
                    ? "bg-[#1f382a] text-amber-300 shadow-xs border border-amber-500/30 font-bold"
                    : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
                title="Switch to Dark Theme"
              >
                <Moon className={`w-3.5 h-3.5 ${isDarkMode ? "text-amber-400" : "text-slate-400"}`} />
                <span className="hidden sm:inline">Dark</span>
              </button>
            </div>

            {/* Role indicator pill */}
            <div className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-[#182e21] text-slate-700 dark:text-amber-300 border border-slate-200 dark:border-[#254230]">
              {user?.role}
            </div>
          </div>
        </header>

        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden bg-black/60 backdrop-blur-xs">
            <div className="w-72 bg-white dark:bg-[#0c1812] text-slate-800 dark:text-white flex flex-col h-full shadow-2xl">
              <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-[#1b3827]">
                <div className="flex items-center space-x-2">
                  <img
                    src="/logo.png"
                    alt="A.G Import & Export"
                    className="w-7 h-7 rounded-full object-contain border border-amber-400"
                  />
                  <span className="font-sans font-bold text-xs tracking-tight text-slate-900 dark:text-white">
                    A.G IMPORT &amp; EXPORT
                  </span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Theme Toggle */}
              <div className="p-3 border-b border-slate-200 dark:border-[#1b3827] bg-slate-50 dark:bg-[#09160f] flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Theme:</span>
                <div className="flex items-center p-0.5 rounded-lg bg-slate-200/80 dark:bg-[#16271e] border border-slate-300/80 dark:border-[#263e2f]">
                  <button
                    type="button"
                    onClick={() => {
                      if (isDarkMode) toggleDarkMode();
                    }}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold ${
                      !isDarkMode ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    <span>White</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!isDarkMode) toggleDarkMode();
                    }}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold ${
                      isDarkMode ? "bg-[#1f382a] text-amber-300 shadow-xs" : "text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5 text-amber-400" />
                    <span>Dark</span>
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-4">
                {navGroups.map((group) => (
                  <div key={group.label} className="space-y-1">
                    <div className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 px-2">
                      {group.label}
                    </div>
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <NavLink
                          key={item.path}
                          to={item.path}
                          end={item.path === "/admin"}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-medium ${
                              isActive
                                ? "bg-emerald-700 text-white font-semibold dark:bg-[#dfb15b] dark:text-[#0c1812]"
                                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#152a1e]"
                            }`
                          }
                        >
                          <Icon className="w-4 h-4" />
                          <span>{item.name}</span>
                        </NavLink>
                      );
                    })}
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-slate-200 dark:border-[#1b3827]">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-2 py-2 text-xs text-red-600 dark:text-red-300 bg-red-50 dark:bg-red-900/30 rounded-lg font-semibold"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Workspace */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children || <Outlet />}
        </main>
      </div>

      {/* Global Command Palette */}
      <CommandPalette isOpen={isCommandPaletteOpen} onClose={() => setIsCommandPaletteOpen(false)} />
    </div>
  );
};
