import React, { useState, useEffect } from "react";
import { Compass, Plus, Trash2, Save, GripVertical, ExternalLink } from "lucide-react";
import { adminApi } from "../../services/adminApi";
import { useAdminAuth } from "../../context/AdminAuthContext";

export const AdminNavigationManager: React.FC = () => {
  const { canEditContent } = useAdminAuth();
  const [navData, setNavData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(true);

  const fetchNav = async () => {
    setIsLoading(true);
    try {
      const data = await adminApi.getNavigation();
      setNavData(data);
    } catch (err) {
      console.error("Failed to load navigation:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNav();
  }, []);

  const handleHeaderLinkChange = (index: number, field: string, value: string) => {
    const updated = [...navData.headerLinks];
    updated[index][field] = value;
    setNavData({ ...navData, headerLinks: updated });
    setIsSaved(false);
  };

  const handleAddHeaderLink = () => {
    const updated = [...(navData.headerLinks || []), { label: "New Page", path: "/new-page" }];
    setNavData({ ...navData, headerLinks: updated });
    setIsSaved(false);
  };

  const handleRemoveHeaderLink = (index: number) => {
    const updated = navData.headerLinks.filter((_: any, i: number) => i !== index);
    setNavData({ ...navData, headerLinks: updated });
    setIsSaved(false);
  };

  const handleSave = async () => {
    try {
      await adminApi.updateNavigation(navData);
      setIsSaved(true);
      alert("Navigation updated successfully!");
    } catch (err: any) {
      alert(err.message || "Failed to update navigation.");
    }
  };

  if (isLoading || !navData) {
    return <div className="p-8 text-center text-xs text-[#788f82]">Loading navigation structure...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-serif font-bold text-[#0d2b1d] dark:text-white">
            Navigation & Menus Manager
          </h1>
          <p className="text-xs text-[#5c7365] dark:text-[#90a89a]">
            Control main desktop header navigation, mobile dropdown, and footer link groupings.
          </p>
        </div>

        {canEditContent && (
          <button
            onClick={handleSave}
            className="px-4 py-2 text-xs font-bold bg-[#dfb15b] text-[#0d2b1d] rounded-lg hover:bg-[#ebd28b] flex items-center space-x-1.5 shadow-sm"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaved ? "Saved" : "Save Changes"}</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
        {/* Header Navigation */}
        <div className="p-5 bg-white dark:bg-[#15231b] rounded-xl border border-[#d5ded7] dark:border-[#274030] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-sm text-[#0d2b1d] dark:text-white">Main Header Navigation</h2>
              <p className="text-[11px] text-[#788f82]">Primary horizontal navigation links</p>
            </div>
            <button
              onClick={handleAddHeaderLink}
              className="text-xs font-bold text-[#dfb15b] flex items-center space-x-1 hover:underline"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Item</span>
            </button>
          </div>

          <div className="space-y-2">
            {navData.headerLinks?.map((item: any, idx: number) => (
              <div key={idx} className="flex items-center space-x-2 p-2 border border-[#d5ded7] dark:border-[#274030] rounded-lg bg-[#fbfdfb] dark:bg-[#101b14]">
                <GripVertical className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Label"
                  value={item.label}
                  onChange={(e) => handleHeaderLinkChange(idx, "label", e.target.value)}
                  className="w-36 bg-white dark:bg-[#18291f] border border-[#d5ded7] dark:border-[#274030] rounded p-1.5"
                />
                <input
                  type="text"
                  placeholder="URL Path"
                  value={item.path}
                  onChange={(e) => handleHeaderLinkChange(idx, "path", e.target.value)}
                  className="flex-1 bg-white dark:bg-[#18291f] border border-[#d5ded7] dark:border-[#274030] rounded p-1.5 font-mono"
                />
                <button
                  onClick={() => handleRemoveHeaderLink(idx)}
                  className="p-1.5 text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Navigation Columns Preview */}
        <div className="p-5 bg-white dark:bg-[#15231b] rounded-xl border border-[#d5ded7] dark:border-[#274030] shadow-xs space-y-4">
          <div>
            <h2 className="font-bold text-sm text-[#0d2b1d] dark:text-white">Footer Link Groupings</h2>
            <p className="text-[11px] text-[#788f82]">Columns displayed across all page footers</p>
          </div>

          <div className="space-y-4">
            {Object.entries(navData.footerLinks || {}).map(([key, links]: [string, any]) => (
              <div key={key} className="p-3 rounded-lg border border-[#d5ded7] dark:border-[#274030] bg-[#fbfdfb] dark:bg-[#101b14]">
                <div className="font-bold uppercase tracking-wider text-[10px] text-[#dfb15b] mb-2">{key}</div>
                <div className="space-y-1">
                  {links.map((link: any, i: number) => (
                    <div key={i} className="flex justify-between text-[11px]">
                      <span className="font-medium text-[#0d2b1d] dark:text-white">{link.label}</span>
                      <span className="font-mono text-[#788f82]">{link.path}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
