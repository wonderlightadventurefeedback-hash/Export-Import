import React, { useState, useEffect } from "react";
import { Truck, Plus, Search, ShieldAlert, CheckCircle2, Clock, Ban, Edit2, Trash2, X, Lock } from "lucide-react";
import { adminApi } from "../../services/adminApi";
import { useAdminAuth } from "../../context/AdminAuthContext";

export const AdminSuppliers: React.FC = () => {
  const { canEditContent } = useAdminAuth();
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    supplier_code: "",
    supplier_type: "Farmer",
    business_or_farm_name: "",
    contact_person: "",
    phone: "",
    email: "",
    state: "Odisha",
    district: "",
    address: "",
    verification_status: "Verified",
    internal_notes: "",
    linked_products: [] as string[],
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [supRes, prodRes] = await Promise.all([
        adminApi.getSuppliers({ search, type: selectedType, status: selectedStatus }),
        adminApi.getProducts(),
      ]);
      setSuppliers(supRes || []);
      setProducts(prodRes.items || []);
    } catch (err) {
      console.error("Failed to load suppliers:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedType, selectedStatus]);

  const handleOpenCreate = () => {
    setEditingSupplier(null);
    const code = `SUP-${Math.floor(100 + Math.random() * 900)}`;
    setFormData({
      supplier_code: code,
      supplier_type: "Farmer",
      business_or_farm_name: "",
      contact_person: "",
      phone: "+91 ",
      email: "",
      state: "Odisha",
      district: "",
      address: "",
      verification_status: "Verified",
      internal_notes: "",
      linked_products: [],
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (sup: any) => {
    setEditingSupplier(sup);
    setFormData({
      ...sup,
      linked_products: sup.linked_products || [],
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSupplier) {
        await adminApi.updateSupplier(editingSupplier.id, formData);
      } else {
        await adminApi.createSupplier(formData);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      alert(err.message || "Failed to save supplier.");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete internal supplier record "${name}"?`)) return;
    try {
      await adminApi.deleteSupplier(id);
      fetchData();
    } catch (err: any) {
      alert(err.message || "Failed to delete supplier.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Confidentiality Warning Header */}
      <div className="p-4 rounded-xl bg-red-950/20 border border-red-800/40 text-red-800 dark:text-red-300 flex items-start space-x-3 text-xs">
        <Lock className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
        <div>
          <div className="font-bold uppercase tracking-wider text-[11px] mb-0.5">
            Strict Commercial Privacy &bull; Internal Sourcing Directory
          </div>
          <p className="leading-relaxed opacity-90">
            Grower identities, tribal cooperative contacts, and farm gate procurement pricing are strictly protected under Row Level Security (RLS). Under no circumstances are supplier names or direct contacts exposed to the public API or prospective buyers.
          </p>
        </div>
      </div>

      {/* Main Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-serif font-bold text-[#0d2b1d] dark:text-white">
            Suppliers & Farm Cooperatives Directory
          </h1>
          <p className="text-xs text-[#5c7365] dark:text-[#90a89a]">
            Manage smallholder farmer cooperatives, sorting mills, and cold storage partners.
          </p>
        </div>

        {canEditContent && (
          <button
            onClick={handleOpenCreate}
            className="px-3.5 py-2 text-xs font-semibold bg-[#0d2b1d] text-white dark:bg-[#dfb15b] dark:text-[#0d2b1d] rounded-lg hover:opacity-90 flex items-center space-x-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Register Supplier</span>
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-white dark:bg-[#15231b] rounded-xl border border-[#d5ded7] dark:border-[#274030] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="relative flex-1 max-w-sm w-full">
          <Search className="w-4 h-4 text-[#889d8f] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search farm name, contact, district..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#f8faf8] dark:bg-[#111c15] border border-[#d5ded7] dark:border-[#274030] rounded-lg pl-9 pr-3 py-2 text-xs"
          />
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-[#f8faf8] dark:bg-[#111c15] border border-[#d5ded7] dark:border-[#274030] rounded-lg px-2.5 py-2"
          >
            <option value="all">All Sourcing Types</option>
            <option value="Farmer">Farmer / Co-op</option>
            <option value="Manufacturer">Manufacturer / Mill</option>
            <option value="Wholesaler">Wholesaler</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-[#f8faf8] dark:bg-[#111c15] border border-[#d5ded7] dark:border-[#274030] rounded-lg px-2.5 py-2"
          >
            <option value="all">All Statuses</option>
            <option value="Verified">Verified</option>
            <option value="Pending">Pending Review</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Suppliers Table */}
      <div className="bg-white dark:bg-[#15231b] rounded-xl border border-[#d5ded7] dark:border-[#274030] overflow-hidden shadow-xs">
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-[#f2f6f3] dark:bg-[#111d16] text-[#4b6354] dark:text-[#8ea998] sticky top-0 z-10 border-b border-[#d5ded7] dark:border-[#274030]">
              <tr>
                <th className="p-3 font-semibold">Code & Type</th>
                <th className="p-3 font-semibold">Business / Farm Name</th>
                <th className="p-3 font-semibold">Contact Person & Phone</th>
                <th className="p-3 font-semibold">Terroir / Location</th>
                <th className="p-3 font-semibold">Verification Status</th>
                <th className="p-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#edf1ee] dark:divide-[#1f3527]">
              {suppliers.map((sup) => (
                <tr key={sup.id} className="hover:bg-[#f8faf8] dark:hover:bg-[#18291f] transition-colors">
                  <td className="p-3">
                    <div className="font-mono font-bold text-[#0d2b1d] dark:text-[#dfb15b]">
                      {sup.supplier_code}
                    </div>
                    <div className="text-[10px] text-[#788f82] uppercase">{sup.supplier_type}</div>
                  </td>
                  <td className="p-3">
                    <div className="font-bold text-[#0d2b1d] dark:text-white">
                      {sup.business_or_farm_name}
                    </div>
                    {sup.internal_notes && (
                      <div className="text-[11px] text-[#5c7365] dark:text-[#90a89a] line-clamp-1">
                        {sup.internal_notes}
                      </div>
                    )}
                  </td>
                  <td className="p-3">
                    <div className="font-medium text-[#0d2b1d] dark:text-white">{sup.contact_person}</div>
                    <div className="text-[11px] font-mono text-[#788f82]">{sup.phone || "No phone"}</div>
                  </td>
                  <td className="p-3">
                    <div className="font-medium text-[#294233] dark:text-[#c4ded0]">
                      {sup.district ? `${sup.district}, ` : ""}{sup.state}
                    </div>
                  </td>
                  <td className="p-3">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-medium inline-flex items-center space-x-1 ${
                        sup.verification_status === "Verified"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : sup.verification_status === "Pending"
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {sup.verification_status === "Verified" && <CheckCircle2 className="w-3 h-3" />}
                      <span>{sup.verification_status}</span>
                    </span>
                  </td>
                  <td className="p-3 text-right space-x-2">
                    {canEditContent && (
                      <>
                        <button
                          onClick={() => handleOpenEdit(sup)}
                          className="p-1.5 text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(sup.id, sup.business_or_farm_name)}
                          className="p-1.5 text-red-600 hover:text-red-800 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-[#132219] rounded-2xl shadow-2xl border border-[#d5ded7] dark:border-[#274030] overflow-hidden">
            <div className="p-5 border-b border-[#e2e8e3] dark:border-[#203628] flex items-center justify-between bg-[#f8faf8] dark:bg-[#101b14]">
              <h3 className="text-sm font-bold text-[#0d2b1d] dark:text-white">
                {editingSupplier ? `Edit Supplier: ${editingSupplier.supplier_code}` : "Register Internal Supplier"}
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-4 h-4 text-[#788f82]" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-1">Supplier Code *</label>
                  <input
                    type="text"
                    required
                    value={formData.supplier_code}
                    onChange={(e) => setFormData({ ...formData, supplier_code: e.target.value })}
                    className="w-full bg-[#f8faf8] dark:bg-[#16271d] border border-[#d5ded7] dark:border-[#274030] rounded p-2 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Supplier Category *</label>
                  <select
                    value={formData.supplier_type}
                    onChange={(e) => setFormData({ ...formData, supplier_type: e.target.value as any })}
                    className="w-full bg-[#f8faf8] dark:bg-[#16271d] border border-[#d5ded7] dark:border-[#274030] rounded p-2"
                  >
                    <option value="Farmer">Farmer / Co-op</option>
                    <option value="Manufacturer">Manufacturer</option>
                    <option value="Wholesaler">Wholesaler</option>
                    <option value="Other approved supplier">Other approved supplier</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1">Business / Farm Name *</label>
                <input
                  type="text"
                  required
                  value={formData.business_or_farm_name}
                  onChange={(e) => setFormData({ ...formData, business_or_farm_name: e.target.value })}
                  placeholder="e.g. Kandhamal Tribal Spice Producers Co-op"
                  className="w-full bg-[#f8faf8] dark:bg-[#16271d] border border-[#d5ded7] dark:border-[#274030] rounded p-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-1">Contact Person *</label>
                  <input
                    type="text"
                    required
                    value={formData.contact_person}
                    onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                    className="w-full bg-[#f8faf8] dark:bg-[#16271d] border border-[#d5ded7] dark:border-[#274030] rounded p-2"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Phone / WhatsApp</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#f8faf8] dark:bg-[#16271d] border border-[#d5ded7] dark:border-[#274030] rounded p-2 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-1">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full bg-[#f8faf8] dark:bg-[#16271d] border border-[#d5ded7] dark:border-[#274030] rounded p-2"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">District</label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    placeholder="e.g. Kandhamal / Idukki / Guntur"
                    className="w-full bg-[#f8faf8] dark:bg-[#16271d] border border-[#d5ded7] dark:border-[#274030] rounded p-2"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1">Verification Status</label>
                <select
                  value={formData.verification_status}
                  onChange={(e) => setFormData({ ...formData, verification_status: e.target.value as any })}
                  className="w-full bg-[#f8faf8] dark:bg-[#16271d] border border-[#d5ded7] dark:border-[#274030] rounded p-2"
                >
                  <option value="Verified">Verified (Quality Audit Passed)</option>
                  <option value="Pending">Pending Audit</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>

              <div>
                <label className="block font-medium mb-1">Confidential Internal Notes</label>
                <textarea
                  rows={3}
                  value={formData.internal_notes}
                  onChange={(e) => setFormData({ ...formData, internal_notes: e.target.value })}
                  placeholder="Acreage, organic certification records, sorting mill specifications..."
                  className="w-full bg-[#f8faf8] dark:bg-[#16271d] border border-[#d5ded7] dark:border-[#274030] rounded p-2"
                />
              </div>

              <div className="pt-4 border-t border-[#e2e8e3] dark:border-[#203628] flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-[#d5ded7] dark:border-[#274030] rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#dfb15b] text-[#0d2b1d] font-bold rounded hover:bg-[#ebd28b]"
                >
                  Save Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
