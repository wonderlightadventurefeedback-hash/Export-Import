import React, { useState, useEffect } from "react";
import { UserCheck, Plus, Search, Mail, Phone, Globe, Tag, ExternalLink, X, Building } from "lucide-react";
import { adminApi } from "../../services/adminApi";
import { useAdminAuth } from "../../context/AdminAuthContext";

export const AdminBuyers: React.FC = () => {
  const { canEditContent } = useAdminAuth();
  const [buyers, setBuyers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBuyer, setEditingBuyer] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    country: "",
    buyer_type: "Importer",
    tags: "",
    notes: "",
  });

  useEffect(() => {
    fetchBuyers();
  }, [typeFilter]);

  const fetchBuyers = async () => {
    setIsLoading(true);
    try {
      const params: Record<string, string> = {};
      if (typeFilter !== "all") params.buyer_type = typeFilter;
      const data = await adminApi.getBuyers(params);
      setBuyers(data || []);
    } catch (err: any) {
      console.error("Failed to load buyers:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingBuyer(null);
    setFormData({
      name: "",
      company: "",
      email: "",
      phone: "",
      country: "",
      buyer_type: "Importer",
      tags: "EU Standards, Organic Preferred",
      notes: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (buyer: any) => {
    setEditingBuyer(buyer);
    setFormData({
      name: buyer.name || "",
      company: buyer.company || "",
      email: buyer.email || "",
      phone: buyer.phone || "",
      country: buyer.country || "",
      buyer_type: buyer.buyer_type || "Importer",
      tags: Array.isArray(buyer.tags) ? buyer.tags.join(", ") : buyer.tags || "",
      notes: buyer.notes || "",
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
      };

      if (editingBuyer) {
        await adminApi.updateBuyer(editingBuyer.id, payload);
      } else {
        await adminApi.createBuyer(payload);
      }
      setIsModalOpen(false);
      fetchBuyers();
    } catch (err: any) {
      alert("Error saving buyer: " + err.message);
    }
  };

  const filteredBuyers = buyers.filter((b) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      b.name?.toLowerCase().includes(q) ||
      b.company?.toLowerCase().includes(q) ||
      b.email?.toLowerCase().includes(q) ||
      b.country?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-charcoal-900 flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-forest-700" />
            Buyer Accounts & CRM
          </h1>
          <p className="font-sans text-sm text-charcoal-500">
            Maintain international spice importer profiles, order history, port destinations, and compliance tags.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          disabled={!canEditContent}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-forest-800 text-gold-300 font-sans font-semibold text-sm rounded-lg hover:bg-forest-900 transition-colors shadow-sm disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          <span>Add Buyer Profile</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-ivory-300 rounded-xl p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-charcoal-400" />
          <input
            type="text"
            placeholder="Search by buyer, company, country..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-ivory-50 border border-ivory-300 rounded-lg text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 bg-ivory-50 border border-ivory-300 rounded-lg text-sm text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-forest-600"
        >
          <option value="all">All Buyer Types</option>
          <option value="Importer">Direct Importers</option>
          <option value="Distributor">Wholesale Distributors</option>
          <option value="Spice Blender">Spice Blenders & Processors</option>
          <option value="Retail Chain">Supermarket / Retail Chains</option>
        </select>
      </div>

      {/* Buyer Cards Grid */}
      {isLoading ? (
        <div className="p-12 text-center text-charcoal-400">Loading buyers...</div>
      ) : filteredBuyers.length === 0 ? (
        <div className="p-12 bg-white rounded-xl border border-ivory-300 text-center text-charcoal-400">
          No matching buyer records found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBuyers.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-xl border border-ivory-300 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-serif font-bold text-base text-charcoal-900">{b.name}</h3>
                    <p className="text-xs text-forest-800 font-semibold flex items-center gap-1 mt-0.5">
                      <Building className="w-3.5 h-3.5" />
                      {b.company}
                    </p>
                  </div>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-ivory-100 text-charcoal-700 border border-ivory-200">
                    {b.buyer_type || "Importer"}
                  </span>
                </div>

                <div className="text-xs space-y-1.5 text-charcoal-600 font-sans">
                  <div className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-charcoal-400 shrink-0" />
                    <span>{b.country || "Not specified"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-charcoal-400 shrink-0" />
                    <span className="font-mono truncate">{b.email}</span>
                  </div>
                  {b.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-charcoal-400 shrink-0" />
                      <span className="font-mono">{b.phone}</span>
                    </div>
                  )}
                </div>

                {b.tags && b.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(Array.isArray(b.tags) ? b.tags : [b.tags]).map((tag: string, i: number) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 text-[10px] font-medium bg-ivory-100 text-forest-900 px-2 py-0.5 rounded-full"
                      >
                        <Tag className="w-2.5 h-2.5" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 mt-4 border-t border-ivory-200 flex items-center justify-between">
                <span className="text-xs text-charcoal-400">
                  {b.enquiries_count || 1} Inquiries Logged
                </span>
                <button
                  onClick={() => handleOpenEdit(b)}
                  className="text-xs font-semibold text-forest-800 hover:text-forest-950 underline"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-charcoal-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-ivory-300 overflow-hidden">
            <div className="px-6 py-4 border-b border-ivory-200 flex items-center justify-between bg-ivory-50">
              <h3 className="font-serif text-lg font-bold text-charcoal-900">
                {editingBuyer ? "Edit Buyer Profile" : "Register Buyer Account"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-charcoal-400 hover:text-charcoal-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-charcoal-700 uppercase mb-1">Contact Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-ivory-50 border border-ivory-300 rounded text-sm text-charcoal-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-charcoal-700 uppercase mb-1">Company Entity</label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-3 py-2 bg-ivory-50 border border-ivory-300 rounded text-sm text-charcoal-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-charcoal-700 uppercase mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-ivory-50 border border-ivory-300 rounded text-sm text-charcoal-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-charcoal-700 uppercase mb-1">Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-ivory-50 border border-ivory-300 rounded text-sm text-charcoal-900 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-charcoal-700 uppercase mb-1">Country / Port</label>
                  <input
                    type="text"
                    required
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-3 py-2 bg-ivory-50 border border-ivory-300 rounded text-sm text-charcoal-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-charcoal-700 uppercase mb-1">Buyer Type</label>
                  <select
                    value={formData.buyer_type}
                    onChange={(e) => setFormData({ ...formData, buyer_type: e.target.value })}
                    className="w-full px-3 py-2 bg-ivory-50 border border-ivory-300 rounded text-sm text-charcoal-900"
                  >
                    <option value="Importer">Direct Importer</option>
                    <option value="Distributor">Wholesale Distributor</option>
                    <option value="Spice Blender">Spice Blender</option>
                    <option value="Retail Chain">Retail Chain</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-700 uppercase mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="EU Standards, Organic Preferred, ASTA Grade"
                  className="w-full px-3 py-2 bg-ivory-50 border border-ivory-300 rounded text-sm text-charcoal-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-700 uppercase mb-1">Internal Notes</label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Prefers FOB Cochin or CIF Rotterdam shipments..."
                  className="w-full px-3 py-2 bg-ivory-50 border border-ivory-300 rounded text-sm text-charcoal-900"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-ivory-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-ivory-300 text-charcoal-700 rounded-lg text-sm font-medium hover:bg-ivory-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-forest-800 text-gold-300 rounded-lg text-sm font-semibold hover:bg-forest-900"
                >
                  Save Buyer Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminBuyers;