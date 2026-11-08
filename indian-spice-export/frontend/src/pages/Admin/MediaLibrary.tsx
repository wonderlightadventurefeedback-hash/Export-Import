import React, { useState, useEffect } from "react";
import { Image, Upload, Search, Trash2, Edit2, Tag, Check, X, FileText, Download } from "lucide-react";
import { adminApi } from "../../services/adminApi";
import { useAdminAuth } from "../../context/AdminAuthContext";

export const AdminMediaLibrary: React.FC = () => {
  const { canEditContent } = useAdminAuth();
  const [media, setMedia] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("all");
  const [isUploading, setIsUploading] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  const fetchMedia = async () => {
    setIsLoading(true);
    try {
      const items = await adminApi.getMedia({ search, tag: selectedTag });
      setMedia(items || []);
    } catch (err) {
      console.error("Failed to load media:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [selectedTag]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", files[0]);
      formData.append("alt", files[0].name.replace(/\.[^/.]+$/, ""));
      formData.append("tags", "spices, harvest");

      await adminApi.uploadMedia(formData);
      fetchMedia();
    } catch (err: any) {
      alert(err.message || "Failed to upload file.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveMetadata = async () => {
    if (!editingItem) return;
    try {
      await adminApi.updateMedia(editingItem.id, {
        filename: editingItem.filename,
        alt: editingItem.alt,
        tags: editingItem.tags,
      });
      setEditingItem(null);
      fetchMedia();
    } catch (err: any) {
      alert(err.message || "Failed to update media.");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete media asset "${name}"?`)) return;
    try {
      await adminApi.deleteMedia(id);
      fetchMedia();
    } catch (err: any) {
      alert(err.message || "Failed to delete media.");
    }
  };

  const allTags = Array.from(new Set(media.flatMap((m) => m.tags || [])));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-serif font-bold text-[#0d2b1d] dark:text-white">
            Media & Commodity Asset Library
          </h1>
          <p className="text-xs text-[#5c7365] dark:text-[#90a89a]">
            Manage single-origin crop imagery, laboratory test certificates, and botanical documentation.
          </p>
        </div>

        {canEditContent && (
          <label className="cursor-pointer px-3.5 py-2 text-xs font-semibold bg-[#0d2b1d] text-white dark:bg-[#dfb15b] dark:text-[#0d2b1d] rounded-lg hover:opacity-90 flex items-center space-x-1.5 shadow-sm">
            <Upload className="w-4 h-4" />
            <span>{isUploading ? "Uploading..." : "Upload Asset"}</span>
            <input type="file" onChange={handleFileUpload} className="hidden" accept="image/*,application/pdf" />
          </label>
        )}
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-white dark:bg-[#15231b] rounded-xl border border-[#d5ded7] dark:border-[#274030] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="relative flex-1 max-w-sm w-full">
          <Search className="w-4 h-4 text-[#889d8f] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search filenames, alt text..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#f8faf8] dark:bg-[#111c15] border border-[#d5ded7] dark:border-[#274030] rounded-lg pl-9 pr-3 py-2 text-xs"
          />
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-[#788f82]">Tag Filter:</span>
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="bg-[#f8faf8] dark:bg-[#111c15] border border-[#d5ded7] dark:border-[#274030] rounded-lg px-2.5 py-2 text-xs"
          >
            <option value="all">All Tags</option>
            {allTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Media Gallery Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {media.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-[#15231b] rounded-xl border border-[#d5ded7] dark:border-[#274030] overflow-hidden shadow-xs group flex flex-col"
          >
            <div className="aspect-square bg-gray-100 dark:bg-[#1c2e22] relative overflow-hidden flex items-center justify-center">
              {item.mime?.startsWith("image/") || item.url?.startsWith("http") ? (
                <img
                  src={item.url}
                  alt={item.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <FileText className="w-10 h-10 text-gray-400" />
              )}
            </div>

            <div className="p-3 flex-1 flex flex-col justify-between text-xs">
              <div>
                <div className="font-semibold text-xs text-[#0d2b1d] dark:text-white truncate" title={item.filename}>
                  {item.filename}
                </div>
                <div className="text-[10px] text-[#788f82] truncate mt-0.5" title={item.alt}>
                  Alt: {item.alt}
                </div>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {(item.tags || []).map((t: string) => (
                    <span key={t} className="text-[9px] bg-[#f0f4f1] dark:bg-[#1e3427] px-1 rounded text-[#5c7365] dark:text-[#a1bcaa]">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {canEditContent && (
                <div className="mt-3 pt-2 border-t border-[#edf1ee] dark:border-[#22392b] flex items-center justify-between text-xs">
                  <button
                    onClick={() => setEditingItem(item)}
                    className="text-blue-600 hover:text-blue-800 text-[11px] flex items-center space-x-1"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, item.filename)}
                    className="text-red-600 hover:text-red-800 text-[11px]"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Edit Metadata Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-[#132219] rounded-2xl shadow-2xl border border-[#d5ded7] dark:border-[#274030] overflow-hidden p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#e2e8e3] dark:border-[#203628]">
              <h3 className="font-bold text-sm text-[#0d2b1d] dark:text-white">Edit Asset Metadata</h3>
              <button onClick={() => setEditingItem(null)}>
                <X className="w-4 h-4 text-[#788f82]" />
              </button>
            </div>

            <div>
              <label className="block font-medium mb-1">Filename</label>
              <input
                type="text"
                value={editingItem.filename}
                onChange={(e) => setEditingItem({ ...editingItem, filename: e.target.value })}
                className="w-full bg-[#f8faf8] dark:bg-[#16271d] border border-[#d5ded7] dark:border-[#274030] rounded p-2 font-mono"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Alt Text (Crucial for B2B SEO & Accessibility)</label>
              <input
                type="text"
                value={editingItem.alt}
                onChange={(e) => setEditingItem({ ...editingItem, alt: e.target.value })}
                className="w-full bg-[#f8faf8] dark:bg-[#16271d] border border-[#d5ded7] dark:border-[#274030] rounded p-2"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Tags (Comma separated)</label>
              <input
                type="text"
                value={Array.isArray(editingItem.tags) ? editingItem.tags.join(", ") : ""}
                onChange={(e) =>
                  setEditingItem({
                    ...editingItem,
                    tags: e.target.value.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean),
                  })
                }
                className="w-full bg-[#f8faf8] dark:bg-[#16271d] border border-[#d5ded7] dark:border-[#274030] rounded p-2"
              />
            </div>

            <div className="pt-3 border-t border-[#e2e8e3] dark:border-[#203628] flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 border border-[#d5ded7] dark:border-[#274030] rounded"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveMetadata}
                className="px-4 py-2 bg-[#dfb15b] text-[#0d2b1d] font-bold rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
