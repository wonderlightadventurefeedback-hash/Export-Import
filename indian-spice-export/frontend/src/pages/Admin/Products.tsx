import React, { useState, useEffect } from "react";
import {
  Package,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Edit2,
  Trash2,
  CheckSquare,
  Square,
  X,
  PlusCircle,
  MinusCircle,
  ExternalLink,
  Layers,
} from "lucide-react";
import { adminApi } from "../../services/adminApi";
import { useAdminAuth } from "../../context/AdminAuthContext";

export const AdminProducts: React.FC = () => {
  const { canEditContent } = useAdminAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [modalTab, setModalTab] = useState<"general" | "specs" | "grades" | "packaging" | "images">("general");

  // Form State
  const [formData, setFormData] = useState<any>({
    name: "",
    slug: "",
    category_id: "",
    category_slug: "",
    category_name: "",
    scientific_name: "",
    headline: "",
    description: "",
    detailed_description: "",
    available_forms: ["whole"],
    origin_state: "Odisha",
    sourcing_belt: "",
    harvest_season: "",
    min_order_quantity: "1 Metric Tonne",
    is_featured: false,
    status: "published",
    specifications: [
      { key: "Moisture", value: "Max 10.0%" },
      { key: "Extraneous Matter", value: "Max 0.5%" },
    ],
    grades: ["Standard Export Grade"],
    packaging: [
      { package_type: "Food-grade double-layered Jute Bags", standard_sizes: "25 kg, 50 kg" },
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1000&q=80",
        alt_text: "Spice photo",
        is_primary: true,
      },
    ],
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [prodsRes, catsRes] = await Promise.all([
        adminApi.getProducts({
          search,
          category: selectedCategory,
          status: selectedStatus,
        }),
        adminApi.getCategories(),
      ]);
      setProducts(prodsRes.items || []);
      setCategories(catsRes || []);
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedCategory, selectedStatus]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData();
  };

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      slug: "",
      category_id: categories[0]?.id || "",
      category_slug: categories[0]?.slug || "",
      category_name: categories[0]?.name || "",
      scientific_name: "",
      headline: "",
      description: "",
      detailed_description: "",
      available_forms: ["whole"],
      origin_state: "Odisha",
      sourcing_belt: "",
      harvest_season: "",
      min_order_quantity: "1 Metric Tonne",
      is_featured: false,
      status: "published",
      specifications: [
        { key: "Moisture", value: "Max 10.0%" },
        { key: "Extraneous Matter", value: "Max 0.5%" },
      ],
      grades: ["Standard Export Grade"],
      packaging: [
        { package_type: "Food-grade double-layered Jute Bags", standard_sizes: "25 kg, 50 kg" },
      ],
      images: [
        {
          url: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1000&q=80",
          alt_text: "Spice photo",
          is_primary: true,
        },
      ],
    });
    setModalTab("general");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prod: any) => {
    setEditingProduct(prod);
    // Convert specs object to key-value array
    const specsArray = prod.specifications
      ? Object.entries(prod.specifications).map(([key, value]) => ({ key, value: String(value) }))
      : [];

    const packagingArray = prod.packaging
      ? prod.packaging.map((p: any) => ({
          package_type: p.package_type,
          standard_sizes: Array.isArray(p.standard_sizes) ? p.standard_sizes.join(", ") : p.standard_sizes,
        }))
      : [];

    setFormData({
      ...prod,
      specifications: specsArray.length ? specsArray : [{ key: "Moisture", value: "Max 10.0%" }],
      packaging: packagingArray.length ? packagingArray : [{ package_type: "Jute Bags", standard_sizes: "25 kg" }],
      grades: prod.grades || [],
      images: prod.images || [],
    });
    setModalTab("general");
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reconstruct specs object
    const specsObj: Record<string, string> = {};
    formData.specifications.forEach((s: any) => {
      if (s.key && s.key.trim()) {
        specsObj[s.key.trim()] = s.value;
      }
    });

    const packagingFormatted = formData.packaging.map((p: any) => ({
      package_type: p.package_type,
      standard_sizes: typeof p.standard_sizes === "string" ? p.standard_sizes.split(",").map((s: string) => s.trim()) : p.standard_sizes,
    }));

    const catObj = categories.find((c) => c.id === formData.category_id || c.slug === formData.category_slug);

    const payload = {
      ...formData,
      category_id: catObj?.id || formData.category_id,
      category_slug: catObj?.slug || formData.category_slug,
      category_name: catObj?.name || formData.category_name,
      specifications: specsObj,
      packaging: packagingFormatted,
    };

    try {
      if (editingProduct) {
        await adminApi.updateProduct(editingProduct.id, payload);
      } else {
        await adminApi.createProduct(payload);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      alert(err.message || "Failed to save product.");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete spice commodity "${name}"?`)) return;
    try {
      await adminApi.deleteProduct(id);
      fetchData();
    } catch (err: any) {
      alert(err.message || "Failed to delete product.");
    }
  };

  const handleBulkAction = async (action: "publish" | "unpublish" | "delete") => {
    if (selectedIds.length === 0) return;
    if (action === "delete" && !window.confirm(`Delete ${selectedIds.length} selected products?`)) return;

    try {
      await adminApi.bulkProductAction(action, selectedIds);
      setSelectedIds([]);
      fetchData();
    } catch (err: any) {
      alert(err.message || "Bulk action failed.");
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === products.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(products.map((p) => p.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  return (
    <div className="space-y-6">
      {/* Header & Main Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-serif font-bold text-[#0d2b1d] dark:text-white">
            Spice Commodities & Products
          </h1>
          <p className="text-xs text-[#5c7365] dark:text-[#90a89a]">
            Manage single-origin export grades, lab-certified chemical specifications, and packaging.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <a
            href="/api/admin/products/export/csv"
            download
            className="px-3 py-2 text-xs font-medium border border-[#d5ded7] dark:border-[#274030] rounded-lg bg-white dark:bg-[#15231b] hover:bg-[#f2f6f3] transition-colors flex items-center space-x-1.5"
          >
            <Download className="w-3.5 h-3.5 text-[#5c7365]" />
            <span>Export CSV</span>
          </a>

          {canEditContent && (
            <button
              onClick={handleOpenCreate}
              className="px-3.5 py-2 text-xs font-semibold bg-[#0d2b1d] text-white dark:bg-[#dfb15b] dark:text-[#0d2b1d] rounded-lg hover:opacity-90 transition-opacity flex items-center space-x-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Spice</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Bulk Action Bar */}
      <div className="p-4 bg-white dark:bg-[#15231b] rounded-xl border border-[#d5ded7] dark:border-[#274030] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="flex items-center space-x-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#889d8f] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by commodity name, belt, origin..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#f8faf8] dark:bg-[#111c15] border border-[#d5ded7] dark:border-[#274030] rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-[#dfb15b]"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-2 bg-[#0d2b1d] text-white text-xs rounded-lg hover:bg-[#163e2c]"
          >
            Search
          </button>
        </form>

        <div className="flex items-center space-x-3 text-xs">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#f8faf8] dark:bg-[#111c15] border border-[#d5ded7] dark:border-[#274030] rounded-lg px-2.5 py-2"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-[#f8faf8] dark:bg-[#111c15] border border-[#d5ded7] dark:border-[#274030] rounded-lg px-2.5 py-2"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>

          {/* Bulk Action Controls */}
          {selectedIds.length > 0 && canEditContent && (
            <div className="flex items-center space-x-1.5 pl-3 border-l border-[#d5ded7] dark:border-[#274030]">
              <span className="text-[11px] font-semibold text-[#0d2b1d] dark:text-[#dfb15b]">
                {selectedIds.length} selected:
              </span>
              <button
                onClick={() => handleBulkAction("publish")}
                className="px-2 py-1 bg-emerald-600 text-white rounded text-[11px] hover:bg-emerald-700"
              >
                Publish
              </button>
              <button
                onClick={() => handleBulkAction("unpublish")}
                className="px-2 py-1 bg-amber-600 text-white rounded text-[11px] hover:bg-amber-700"
              >
                Draft
              </button>
              <button
                onClick={() => handleBulkAction("delete")}
                className="px-2 py-1 bg-red-600 text-white rounded text-[11px] hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Products Table with Sticky Header */}
      <div className="bg-white dark:bg-[#15231b] rounded-xl border border-[#d5ded7] dark:border-[#274030] overflow-hidden shadow-xs">
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-[#f2f6f3] dark:bg-[#111d16] text-[#4b6354] dark:text-[#8ea998] sticky top-0 z-10 border-b border-[#d5ded7] dark:border-[#274030]">
              <tr>
                <th className="p-3 w-10">
                  <button onClick={toggleSelectAll} className="flex items-center">
                    {selectedIds.length > 0 && selectedIds.length === products.length ? (
                      <CheckSquare className="w-4 h-4 text-[#dfb15b]" />
                    ) : (
                      <Square className="w-4 h-4 text-[#889d8f]" />
                    )}
                  </button>
                </th>
                <th className="p-3 font-semibold">Commodity & Origin</th>
                <th className="p-3 font-semibold">Category</th>
                <th className="p-3 font-semibold">Scientific Name</th>
                <th className="p-3 font-semibold">Forms</th>
                <th className="p-3 font-semibold">Min Order Qty</th>
                <th className="p-3 font-semibold">Status</th>
                <th className="p-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#edf1ee] dark:divide-[#1f3527]">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-xs text-[#788f82]">
                    No spice products found matching criteria.
                  </td>
                </tr>
              ) : (
                products.map((prod) => {
                  const isSelected = selectedIds.includes(prod.id);
                  return (
                    <tr
                      key={prod.id}
                      className={`hover:bg-[#f8faf8] dark:hover:bg-[#18291f] transition-colors ${
                        isSelected ? "bg-[#fbf7ee] dark:bg-[#212c1b]" : ""
                      }`}
                    >
                      <td className="p-3">
                        <button onClick={() => toggleSelectOne(prod.id)}>
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-[#dfb15b]" />
                          ) : (
                            <Square className="w-4 h-4 text-[#889d8f]" />
                          )}
                        </button>
                      </td>
                      <td className="p-3">
                        <div className="font-semibold text-[#0d2b1d] dark:text-white flex items-center space-x-1.5">
                          <span>{prod.name}</span>
                          {prod.is_featured && (
                            <span className="text-[9px] bg-[#dfb15b] text-[#0d2b1d] font-bold px-1 rounded">
                              Featured
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-[#788f82] dark:text-[#7f998a]">
                          {prod.sourcing_belt || prod.origin_state} &bull; /products/{prod.slug}
                        </div>
                      </td>
                      <td className="p-3 text-[#384d40] dark:text-[#a1bcaa]">
                        {prod.category_name || prod.category_slug}
                      </td>
                      <td className="p-3 italic text-[#5c7365] dark:text-[#8ea998]">
                        {prod.scientific_name || "—"}
                      </td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-1">
                          {(prod.available_forms || []).map((f: string) => (
                            <span
                              key={f}
                              className="text-[10px] bg-[#eef3f0] dark:bg-[#1e3427] text-[#294233] dark:text-[#c4ded0] px-1.5 py-0.5 rounded capitalize"
                            >
                              {f}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-3 text-[#384d40] dark:text-[#a1bcaa]">
                        {prod.min_order_quantity}
                      </td>
                      <td className="p-3">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                            prod.status === "published"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                              : prod.status === "draft"
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                          }`}
                        >
                          {prod.status}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-2">
                        <a
                          href={`/products/${prod.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 inline-block text-[#5c7365] hover:text-[#0d2b1d] dark:hover:text-white"
                          title="View on site"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        {canEditContent && (
                          <>
                            <button
                              onClick={() => handleOpenEdit(prod)}
                              className="p-1.5 text-blue-600 hover:text-blue-800 transition-colors"
                              title="Edit product"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(prod.id, prod.name)}
                              className="p-1.5 text-red-600 hover:text-red-800 transition-colors"
                              title="Delete product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-4xl bg-white dark:bg-[#132219] rounded-2xl shadow-2xl border border-[#d5ded7] dark:border-[#274030] overflow-hidden my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2e8e3] dark:border-[#203628] bg-[#f8faf8] dark:bg-[#101b14]">
              <div>
                <h3 className="text-base font-bold text-[#0d2b1d] dark:text-white">
                  {editingProduct ? `Edit Spice: ${editingProduct.name}` : "Add New Spice Commodity"}
                </h3>
                <p className="text-xs text-[#5c7365] dark:text-[#90a89a]">
                  Configure commercial parameters, grades, and laboratory specification thresholds.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-[#788f82] hover:bg-[#eaeaea] dark:hover:bg-[#1d3023]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-[#e2e8e3] dark:border-[#203628] px-6 text-xs bg-[#fbfdfb] dark:bg-[#121e16]">
              {(["general", "specs", "grades", "packaging", "images"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setModalTab(tab)}
                  className={`py-3 px-4 font-medium capitalize border-b-2 transition-colors ${
                    modalTab === tab
                      ? "border-[#dfb15b] text-[#0d2b1d] dark:text-[#dfb15b] font-bold"
                      : "border-transparent text-[#788f82] hover:text-[#0d2b1d]"
                  }`}
                >
                  {tab === "specs" ? "Chemical Specs" : tab}
                </button>
              ))}
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* TAB 1: General Info */}
              {modalTab === "general" && (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-medium mb-1">Product Commercial Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => {
                          const name = e.target.value;
                          const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
                          setFormData({ ...formData, name, slug: formData.slug || slug });
                        }}
                        placeholder="e.g. Kandhamal Organic Turmeric Fingers"
                        className="w-full bg-[#f8faf8] dark:bg-[#16271d] border border-[#d5ded7] dark:border-[#274030] rounded-lg p-2.5"
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-1">URL Slug *</label>
                      <input
                        type="text"
                        required
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        className="w-full bg-[#f8faf8] dark:bg-[#16271d] border border-[#d5ded7] dark:border-[#274030] rounded-lg p-2.5 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-medium mb-1">Category</label>
                      <select
                        value={formData.category_slug}
                        onChange={(e) => {
                          const cat = categories.find((c) => c.slug === e.target.value);
                          setFormData({
                            ...formData,
                            category_id: cat?.id || "",
                            category_slug: cat?.slug || "",
                            category_name: cat?.name || "",
                          });
                        }}
                        className="w-full bg-[#f8faf8] dark:bg-[#16271d] border border-[#d5ded7] dark:border-[#274030] rounded-lg p-2.5"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.slug}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-medium mb-1">Scientific Botanical Name</label>
                      <input
                        type="text"
                        value={formData.scientific_name}
                        onChange={(e) => setFormData({ ...formData, scientific_name: e.target.value })}
                        placeholder="e.g. Curcuma longa"
                        className="w-full bg-[#f8faf8] dark:bg-[#16271d] border border-[#d5ded7] dark:border-[#274030] rounded-lg p-2.5 italic"
                      />
                    </div>

                    <div>
                      <label className="block font-medium mb-1">Status</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full bg-[#f8faf8] dark:bg-[#16271d] border border-[#d5ded7] dark:border-[#274030] rounded-lg p-2.5"
                      >
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-medium mb-1">Origin State</label>
                      <input
                        type="text"
                        value={formData.origin_state}
                        onChange={(e) => setFormData({ ...formData, origin_state: e.target.value })}
                        placeholder="e.g. Odisha"
                        className="w-full bg-[#f8faf8] dark:bg-[#16271d] border border-[#d5ded7] dark:border-[#274030] rounded-lg p-2.5"
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-1">Sourcing Belt / Terroir</label>
                      <input
                        type="text"
                        value={formData.sourcing_belt}
                        onChange={(e) => setFormData({ ...formData, sourcing_belt: e.target.value })}
                        placeholder="e.g. Kandhamal Tribal Belt"
                        className="w-full bg-[#f8faf8] dark:bg-[#16271d] border border-[#d5ded7] dark:border-[#274030] rounded-lg p-2.5"
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-1">Min Order Qty (MOQ)</label>
                      <input
                        type="text"
                        value={formData.min_order_quantity}
                        onChange={(e) => setFormData({ ...formData, min_order_quantity: e.target.value })}
                        placeholder="e.g. 1 Metric Tonne"
                        className="w-full bg-[#f8faf8] dark:bg-[#16271d] border border-[#d5ded7] dark:border-[#274030] rounded-lg p-2.5"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium mb-1">Commercial Headline</label>
                    <input
                      type="text"
                      value={formData.headline}
                      onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                      placeholder="e.g. GI-tagged organically grown turmeric with naturally elevated curcumin levels."
                      className="w-full bg-[#f8faf8] dark:bg-[#16271d] border border-[#d5ded7] dark:border-[#274030] rounded-lg p-2.5"
                    />
                  </div>

                  <div>
                    <label className="block font-medium mb-1">Overview Description *</label>
                    <textarea
                      required
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Full summary of processing, harvest, and cleanliness standards..."
                      className="w-full bg-[#f8faf8] dark:bg-[#16271d] border border-[#d5ded7] dark:border-[#274030] rounded-lg p-2.5"
                    />
                  </div>

                  <div className="flex items-center space-x-2 pt-2">
                    <input
                      type="checkbox"
                      id="feat"
                      checked={formData.is_featured}
                      onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                      className="rounded text-[#dfb15b] focus:ring-0"
                    />
                    <label htmlFor="feat" className="font-medium cursor-pointer">
                      Feature on Home Storefront
                    </label>
                  </div>
                </div>
              )}

              {/* TAB 2: Dynamic Chemical Specs Rows */}
              {modalTab === "specs" && (
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[#5c7365] dark:text-[#90a89a]">
                      Define certified chemical limits (Curcumin, Piperine, SHU, Moisture, Volatile Oil).
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          specifications: [...formData.specifications, { key: "", value: "" }],
                        })
                      }
                      className="px-2.5 py-1 text-xs bg-[#0d2b1d] text-white dark:bg-[#dfb15b] dark:text-[#0d2b1d] rounded flex items-center space-x-1"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Add Row</span>
                    </button>
                  </div>

                  {formData.specifications.map((spec: any, idx: number) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <input
                        type="text"
                        placeholder="Parameter (e.g. Curcumin Content)"
                        value={spec.key}
                        onChange={(e) => {
                          const updated = [...formData.specifications];
                          updated[idx].key = e.target.value;
                          setFormData({ ...formData, specifications: updated });
                        }}
                        className="flex-1 bg-[#f8faf8] dark:bg-[#16271d] border border-[#d5ded7] dark:border-[#274030] rounded-lg p-2 text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Value (e.g. 4.5% - 5.5%)"
                        value={spec.value}
                        onChange={(e) => {
                          const updated = [...formData.specifications];
                          updated[idx].value = e.target.value;
                          setFormData({ ...formData, specifications: updated });
                        }}
                        className="flex-1 bg-[#f8faf8] dark:bg-[#16271d] border border-[#d5ded7] dark:border-[#274030] rounded-lg p-2 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = formData.specifications.filter((_: any, i: number) => i !== idx);
                          setFormData({ ...formData, specifications: updated });
                        }}
                        className="p-1.5 text-red-600 hover:text-red-800"
                      >
                        <MinusCircle className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 3: Grades */}
              {modalTab === "grades" && (
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[#5c7365] dark:text-[#90a89a]">
                      Export sorting grades (e.g. Single Polished, Double Polished, Stemless).
                    </span>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, grades: [...formData.grades, ""] })}
                      className="px-2.5 py-1 text-xs bg-[#0d2b1d] text-white dark:bg-[#dfb15b] dark:text-[#0d2b1d] rounded flex items-center space-x-1"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Add Grade</span>
                    </button>
                  </div>

                  {formData.grades.map((grade: string, idx: number) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <input
                        type="text"
                        placeholder="Grade specification..."
                        value={grade}
                        onChange={(e) => {
                          const updated = [...formData.grades];
                          updated[idx] = e.target.value;
                          setFormData({ ...formData, grades: updated });
                        }}
                        className="flex-1 bg-[#f8faf8] dark:bg-[#16271d] border border-[#d5ded7] dark:border-[#274030] rounded-lg p-2 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = formData.grades.filter((_: any, i: number) => i !== idx);
                          setFormData({ ...formData, grades: updated });
                        }}
                        className="p-1.5 text-red-600 hover:text-red-800"
                      >
                        <MinusCircle className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 4: Packaging Formats */}
              {modalTab === "packaging" && (
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[#5c7365] dark:text-[#90a89a]">
                      Approved export packaging formats and weight sizes.
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          packaging: [...formData.packaging, { package_type: "", standard_sizes: "" }],
                        })
                      }
                      className="px-2.5 py-1 text-xs bg-[#0d2b1d] text-white dark:bg-[#dfb15b] dark:text-[#0d2b1d] rounded flex items-center space-x-1"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Add Format</span>
                    </button>
                  </div>

                  {formData.packaging.map((pack: any, idx: number) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <input
                        type="text"
                        placeholder="Package Type (e.g. Jute Bags with Poly Liner)"
                        value={pack.package_type}
                        onChange={(e) => {
                          const updated = [...formData.packaging];
                          updated[idx].package_type = e.target.value;
                          setFormData({ ...formData, packaging: updated });
                        }}
                        className="flex-1 bg-[#f8faf8] dark:bg-[#16271d] border border-[#d5ded7] dark:border-[#274030] rounded-lg p-2 text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Sizes (e.g. 25 kg, 50 kg)"
                        value={pack.standard_sizes}
                        onChange={(e) => {
                          const updated = [...formData.packaging];
                          updated[idx].standard_sizes = e.target.value;
                          setFormData({ ...formData, packaging: updated });
                        }}
                        className="flex-1 bg-[#f8faf8] dark:bg-[#16271d] border border-[#d5ded7] dark:border-[#274030] rounded-lg p-2 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = formData.packaging.filter((_: any, i: number) => i !== idx);
                          setFormData({ ...formData, packaging: updated });
                        }}
                        className="p-1.5 text-red-600 hover:text-red-800"
                      >
                        <MinusCircle className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 5: Images */}
              {modalTab === "images" && (
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[#5c7365] dark:text-[#90a89a]">
                      Product gallery images with descriptive alt-texts.
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          images: [...formData.images, { url: "", alt_text: "", is_primary: false }],
                        })
                      }
                      className="px-2.5 py-1 text-xs bg-[#0d2b1d] text-white dark:bg-[#dfb15b] dark:text-[#0d2b1d] rounded flex items-center space-x-1"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Add Image</span>
                    </button>
                  </div>

                  {formData.images.map((img: any, idx: number) => (
                    <div key={idx} className="flex items-center space-x-2 border border-[#d5ded7] dark:border-[#274030] p-2 rounded-lg">
                      {img.url ? (
                        <img src={img.url} alt="preview" className="w-10 h-10 object-cover rounded" />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded flex items-center justify-center text-[10px]">
                          IMG
                        </div>
                      )}
                      <input
                        type="text"
                        placeholder="Image URL"
                        value={img.url}
                        onChange={(e) => {
                          const updated = [...formData.images];
                          updated[idx].url = e.target.value;
                          setFormData({ ...formData, images: updated });
                        }}
                        className="flex-1 bg-[#f8faf8] dark:bg-[#16271d] border border-[#d5ded7] dark:border-[#274030] rounded p-1.5 text-xs font-mono"
                      />
                      <input
                        type="text"
                        placeholder="Alt text"
                        value={img.alt_text}
                        onChange={(e) => {
                          const updated = [...formData.images];
                          updated[idx].alt_text = e.target.value;
                          setFormData({ ...formData, images: updated });
                        }}
                        className="flex-1 bg-[#f8faf8] dark:bg-[#16271d] border border-[#d5ded7] dark:border-[#274030] rounded p-1.5 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = formData.images.filter((_: any, i: number) => i !== idx);
                          setFormData({ ...formData, images: updated });
                        }}
                        className="p-1.5 text-red-600 hover:text-red-800"
                      >
                        <MinusCircle className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Modal Footer Controls */}
              <div className="pt-4 border-t border-[#e2e8e3] dark:border-[#203628] flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-[#d5ded7] dark:border-[#274030] rounded-lg text-xs font-medium hover:bg-[#f2f6f3]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#dfb15b] text-[#0d2b1d] font-bold text-xs rounded-lg hover:bg-[#ebd28b] shadow-sm"
                >
                  Save Commodity Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
