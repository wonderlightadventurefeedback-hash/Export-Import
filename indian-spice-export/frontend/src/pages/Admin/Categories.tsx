import React, { useState, useEffect } from "react";
import { Layers, Plus, Edit2, Trash2, X, ExternalLink } from "lucide-react";
import { adminApi } from "../../services/adminApi";
import { useAdminAuth } from "../../context/AdminAuthContext";

export const AdminCategories: React.FC = () => {
  const { canEditContent } = useAdminAuth();
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    tagline: "",
    description: "",
    hero_image_url: "",
    featured_order: 1,
    is_published: true,
  });

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const data = await adminApi.getCategories();
      setCategories(data || []);
    } catch (err) {
      console.error("Failed to load categories:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setFormData({
      name: "",
      slug: "",
      tagline: "",
      description: "",
      hero_image_url: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1200&q=80",
      featured_order: categories.length + 1,
      is_published: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: any) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      tagline: cat.tagline || "",
      description: cat.description || "",
      hero_image_url: cat.hero_image_url || "",
      featured_order: cat.featured_order || 1,
      is_published: cat.is_published ?? true,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await adminApi.updateCategory(editingCategory.id, formData);
      } else {
        await adminApi.createCategory(formData);
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err: any) {
      alert(err.message || "Failed to save category.");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete category "${name}"?`)) return;
    try {
      await adminApi.deleteCategory(id);
      fetchCategories();
    } catch (err: any) {
      alert(err.message || "Failed to delete category.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-serif font-bold text-[#0d2b1d] dark:text-white">
            Spice Categories
          </h1>
          <p className="text-xs text-[#5c7365] dark:text-[#90a89a]">
            Organize botanical spice groups, harvest belts, and storefront category landing cards.
          </p>
        </div>

        {canEditContent && (
          <button
            onClick={handleOpenCreate}
            className="px-3.5 py-2 text-xs font-semibold bg-[#0d2b1d] text-white dark:bg-[#dfb15b] dark:text-[#0d2b1d] rounded-lg hover:opacity-90 transition-opacity flex items-center space-x-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
        )}
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white dark:bg-[#15231b] rounded-xl border border-[#d5ded7] dark:border-[#274030] overflow-hidden shadow-xs hover:border-[#dfb15b] transition-all flex flex-col"
          >
            {/* Hero Image Preview */}
            <div className="h-32 w-full bg-[#1e3427] relative overflow-hidden">
              {cat.hero_image_url ? (
                <img
                  src={cat.hero_image_url}
                  alt={cat.name}
                  className="w-full h-full object-cover opacity-90"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-white/50">
                  No image
                </div>
              )}
              <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-xs text-[10px] text-white px-2 py-0.5 rounded font-mono">
                Order: #{cat.featured_order}
              </div>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-[#0d2b1d] dark:text-white">{cat.name}</h3>
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded font-medium ${
                      cat.is_published
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {cat.is_published ? "Published" : "Hidden"}
                  </span>
                </div>
                <div className="text-[11px] font-mono text-[#889d8f] mb-1">/products?category={cat.slug}</div>
                {cat.tagline && (
                  <div className="text-xs text-[#dfb15b] font-medium mb-1.5">{cat.tagline}</div>
                )}
                <p className="text-xs text-[#5c7365] dark:text-[#90a89a] line-clamp-2">
                  {cat.description || "No description provided."}
                </p>
              </div>

              {canEditContent && (
                <div className="mt-4 pt-3 border-t border-[#edf1ee] dark:border-[#22392b] flex items-center justify-end space-x-2">
                  <button
                    onClick={() => handleOpenEdit(cat)}
                    className="p-1.5 text-xs text-blue-600 hover:text-blue-800 transition-colors flex items-center space-x-1"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id, cat.name)}
                    className="p-1.5 text-xs text-red-600 hover:text-red-800 transition-colors flex items-center space-x-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-[#132219] rounded-2xl shadow-2xl border border-[#d5ded7] dark:border-[#274030] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2e8e3] dark:border-[#203628] bg-[#f8faf8] dark:bg-[#101b14]">
              <h3 className="text-sm font-bold text-[#0d2b1d] dark:text-white">
                {editingCategory ? `Edit Category: ${editingCategory.name}` : "Create Category"}
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-4 h-4 text-[#788f82]" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-1">Category Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
                      setFormData({ ...formData, name, slug: formData.slug || slug });
                    }}
                    placeholder="e.g. Black Pepper"
                    className="w-full bg-[#f8faf8] dark:bg-[#16271d] border border-[#d5ded7] dark:border-[#274030] rounded-lg p-2.5"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Slug *</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full bg-[#f8faf8] dark:bg-[#16271d] border border-[#d5ded7] dark:border-[#274030] rounded-lg p-2.5 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1">Tagline</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="e.g. The King of Spices from the Malabar Coast"
                  className="w-full bg-[#f8faf8] dark:bg-[#16271d] border border-[#d5ded7] dark:border-[#274030] rounded-lg p-2.5"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Summary of botanical origins and harvest attributes..."
                  className="w-full bg-[#f8faf8] dark:bg-[#16271d] border border-[#d5ded7] dark:border-[#274030] rounded-lg p-2.5"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Hero Image URL</label>
                <input
                  type="text"
                  value={formData.hero_image_url}
                  onChange={(e) => setFormData({ ...formData, hero_image_url: e.target.value })}
                  className="w-full bg-[#f8faf8] dark:bg-[#16271d] border border-[#d5ded7] dark:border-[#274030] rounded-lg p-2.5 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-1">Featured Order</label>
                  <input
                    type="number"
                    value={formData.featured_order}
                    onChange={(e) => setFormData({ ...formData, featured_order: parseInt(e.target.value, 10) || 1 })}
                    className="w-full bg-[#f8faf8] dark:bg-[#16271d] border border-[#d5ded7] dark:border-[#274030] rounded-lg p-2.5"
                  />
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <input
                    type="checkbox"
                    id="pub"
                    checked={formData.is_published}
                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                    className="rounded text-[#dfb15b]"
                  />
                  <label htmlFor="pub" className="font-medium cursor-pointer">
                    Publish Category Live
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-[#e2e8e3] dark:border-[#203628] flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-[#d5ded7] dark:border-[#274030] rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#dfb15b] text-[#0d2b1d] font-bold rounded-lg hover:bg-[#ebd28b]"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
