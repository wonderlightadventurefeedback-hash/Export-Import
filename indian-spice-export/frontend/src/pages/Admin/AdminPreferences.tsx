import React, { useState } from "react";
import { Sliders, Sun, Moon, Layout, Eye, CheckCircle2 } from "lucide-react";
import { useAdminTheme } from "../../context/AdminThemeContext";

export const AdminPreferences: React.FC = () => {
  const { isDarkMode, toggleDarkMode, density, setDensity, isSidebarCollapsed, toggleSidebar } = useAdminTheme();
  const [savedNotification, setSavedNotification] = useState(false);

  const handleApply = () => {
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-serif text-2xl font-bold text-charcoal-900 flex items-center gap-2">
          <Sliders className="w-6 h-6 text-forest-700" />
          Control Room Interface Preferences
        </h1>
        <p className="font-sans text-sm text-charcoal-500">
          Personalize table row density, color mode, and navigation layout for your trade desk station.
        </p>
      </div>

      {savedNotification && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-lg flex items-center gap-2 text-sm font-sans">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Interface preferences applied immediately.</span>
        </div>
      )}

      <div className="bg-white rounded-xl border border-ivory-300 shadow-sm divide-y divide-ivory-200">
        {/* Appearance Mode */}
        <div className="p-6 flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-base text-charcoal-900 flex items-center gap-2">
              {isDarkMode ? <Moon className="w-4 h-4 text-forest-700" /> : <Sun className="w-4 h-4 text-forest-700" />}
              Appearance Theme
            </h3>
            <p className="text-xs text-charcoal-500">
              Switch between High-Contrast Ivory & Forest (Day) and Deep Obsidian (Night).
            </p>
          </div>
          <div className="flex items-center gap-2 bg-ivory-100 p-1 rounded-lg border border-ivory-300">
            <button
              onClick={() => {
                if (isDarkMode) toggleDarkMode();
              }}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                !isDarkMode ? "bg-white shadow-sm text-charcoal-900" : "text-charcoal-500 hover:text-charcoal-900"
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>Light (Ivory)</span>
            </button>
            <button
              onClick={() => {
                if (!isDarkMode) toggleDarkMode();
              }}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                isDarkMode ? "bg-forest-900 text-gold-300 shadow-sm" : "text-charcoal-500 hover:text-charcoal-900"
              }`}
            >
              <Moon className="w-3.5 h-3.5 text-gold-400" />
              <span>Dark (Obsidian)</span>
            </button>
          </div>
        </div>

        {/* Sidebar Default */}
        <div className="p-6 flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-base text-charcoal-900 flex items-center gap-2">
              <Layout className="w-4 h-4 text-forest-700" />
              Sidebar Layout
            </h3>
            <p className="text-xs text-charcoal-500">
              Toggle navigation width between full expanded and compact icon-only mode.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-ivory-100 p-1 rounded-lg border border-ivory-300">
            <button
              onClick={() => {
                if (isSidebarCollapsed) toggleSidebar();
              }}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                !isSidebarCollapsed ? "bg-white shadow-sm text-charcoal-900" : "text-charcoal-500 hover:text-charcoal-900"
              }`}
            >
              Expanded (260px)
            </button>
            <button
              onClick={() => {
                if (!isSidebarCollapsed) toggleSidebar();
              }}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                isSidebarCollapsed ? "bg-white shadow-sm text-charcoal-900" : "text-charcoal-500 hover:text-charcoal-900"
              }`}
            >
              Collapsed (72px)
            </button>
          </div>
        </div>

        {/* Table Density */}
        <div className="p-6 flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-base text-charcoal-900 flex items-center gap-2">
              <Eye className="w-4 h-4 text-forest-700" />
              Data Density
            </h3>
            <p className="text-xs text-charcoal-500">
              Adjust spacing in products, quotations, and enquiry tables.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-ivory-100 p-1 rounded-lg border border-ivory-300">
            <button
              onClick={() => setDensity("comfortable")}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                density === "comfortable" ? "bg-white shadow-sm text-charcoal-900" : "text-charcoal-500 hover:text-charcoal-900"
              }`}
            >
              Comfortable
            </button>
            <button
              onClick={() => setDensity("compact")}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                density === "compact" ? "bg-white shadow-sm text-charcoal-900" : "text-charcoal-500 hover:text-charcoal-900"
              }`}
            >
              Compact (Dense)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdminPreferences;