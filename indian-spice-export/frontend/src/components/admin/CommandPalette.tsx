import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  LayoutDashboard,
  Package,
  Inbox,
  FileText,
  Truck,
  Users,
  Settings,
  Image,
  Palette,
  ExternalLink,
  Shield,
  Layers,
  FileCheck,
  Building2,
} from "lucide-react";

interface CommandItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: any;
  path?: string;
  action?: () => void;
  category: "Navigation" | "Quick Action" | "Record";
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  const commands: CommandItem[] = [
    { id: "dash", title: "Dashboard Overview", subtitle: "Key metrics and alerts", icon: LayoutDashboard, path: "/admin", category: "Navigation" },
    { id: "enq", title: "Enquiries Inbox", subtitle: "Incoming buyer inquiries and proforma requests", icon: Inbox, path: "/admin/enquiries", category: "Navigation" },
    { id: "prod", title: "Products & Commodities", subtitle: "Manage spices, specs, and harvest lots", icon: Package, path: "/admin/products", category: "Navigation" },
    { id: "cats", title: "Spice Categories", subtitle: "Organize botanical spice groups", icon: Layers, path: "/admin/categories", category: "Navigation" },
    { id: "quote", title: "Commercial Quotations", subtitle: "Create and dispatch CIF/FOB quotes", icon: FileText, path: "/admin/quotations", category: "Navigation" },
    { id: "sup", title: "Internal Suppliers (Confidential)", subtitle: "Farmers, processors & cooperatives", icon: Truck, path: "/admin/suppliers", category: "Navigation" },
    { id: "buyers", title: "Buyers (CRM-lite)", subtitle: "Importer accounts and trade history", icon: Building2, path: "/admin/buyers", category: "Navigation" },
    { id: "builder", title: "Site Builder & Sections", subtitle: "Live page blocks and content editor", icon: FileCheck, path: "/admin/site-builder", category: "Navigation" },
    { id: "media", title: "Media Library", subtitle: "Crop photos, certificates & lab reports", icon: Image, path: "/admin/media", category: "Navigation" },
    { id: "theme", title: "Theme & Design Tokens", subtitle: "Colors, typography & animations", icon: Palette, path: "/admin/theme", category: "Navigation" },
    { id: "settings", title: "Company Settings", subtitle: "Legal details, APEDA/FSSAI certificates", icon: Settings, path: "/admin/settings", category: "Navigation" },
    { id: "users", title: "Users & Roles", subtitle: "Staff accounts & access permissions", icon: Users, path: "/admin/users", category: "Navigation" },
    { id: "audit", title: "Security Audit Log", subtitle: "System activity logs", icon: Shield, path: "/admin/audit", category: "Navigation" },
    {
      id: "public_site",
      title: "View Live Public Website",
      subtitle: "Open buyer-facing storefront in new tab",
      icon: ExternalLink,
      action: () => window.open("/", "_blank"),
      category: "Quick Action",
    },
  ];

  const filtered = commands.filter((c) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return c.title.toLowerCase().includes(q) || (c.subtitle && c.subtitle.toLowerCase().includes(q));
  });

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filtered.length - 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          executeCommand(filtered[selectedIndex]);
        }
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filtered, selectedIndex]);

  const executeCommand = (item: CommandItem) => {
    onClose();
    if (item.action) {
      item.action();
    } else if (item.path) {
      navigate(item.path);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
      <div
        className="w-full max-w-xl bg-white dark:bg-[#15231b] rounded-xl shadow-2xl border border-[#d5ded7] dark:border-[#2a4534] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center px-4 border-b border-[#e2e8e3] dark:border-[#233b2c] py-3">
          <Search className="w-5 h-5 text-[#889d8f] mr-3" />
          <input
            type="text"
            placeholder="Type a command, page, or search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-sm text-[#1c2b21] dark:text-cream focus:outline-none placeholder:text-[#889d8f]"
          />
          <kbd className="px-2 py-0.5 text-xs text-[#889d8f] bg-[#f4f6f4] dark:bg-[#1a2d22] rounded border border-[#d5ded7] dark:border-[#2a4534]">
            ESC
          </kbd>
        </div>

        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-sm text-[#889d8f]">No matching results found for "{query}".</div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => executeCommand(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-[#0d2b1d] text-white dark:bg-[#1f3b2b]"
                      : "text-[#1c2b21] dark:text-[#dce8e0] hover:bg-[#f4f6f4] dark:hover:bg-[#1b2f23]"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-2 rounded-md ${
                        isSelected ? "bg-white/10 text-[#dfb15b]" : "bg-[#f4f6f4] dark:bg-[#203628] text-[#0d2b1d] dark:text-[#dfb15b]"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">{item.title}</div>
                      {item.subtitle && (
                        <div className={`text-xs ${isSelected ? "text-white/70" : "text-[#738a7c] dark:text-[#9bb3a3]"}`}>
                          {item.subtitle}
                        </div>
                      )}
                    </div>
                  </div>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                      isSelected ? "bg-white/20 text-white" : "bg-[#ecefe9] dark:bg-[#22392b] text-[#5b7365] dark:text-[#8ea998]"
                    }`}
                  >
                    {item.category}
                  </span>
                </div>
              );
            })
          )}
        </div>

        <div className="px-4 py-2 bg-[#f9faf9] dark:bg-[#121c16] border-t border-[#e2e8e3] dark:border-[#233b2c] flex items-center justify-between text-xs text-[#738a7c] dark:text-[#8ea998]">
          <div className="flex items-center space-x-2">
            <span>&uarr;&darr; Navigate</span>
            <span>&bull;</span>
            <span>&crarr; Select</span>
            <span>&bull;</span>
            <span>Esc Close</span>
          </div>
          <span>Indian Spice Export Admin</span>
        </div>
      </div>
    </div>
  );
};
