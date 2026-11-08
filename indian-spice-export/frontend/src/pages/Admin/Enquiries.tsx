import React, { useState, useEffect } from "react";
import {
  Inbox,
  Search,
  Filter,
  Download,
  MessageSquare,
  Send,
  UserCheck,
  CheckCircle,
  ExternalLink,
  Clock,
  Building2,
  MapPin,
  RefreshCw,
  X,
  Phone,
} from "lucide-react";
import { adminApi, AdminUser } from "../../services/adminApi";
import { useAdminAuth } from "../../context/AdminAuthContext";

export const AdminEnquiries: React.FC = () => {
  const { user } = useAdminAuth();
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [staffUsers, setStaffUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedCountry, setSelectedCountry] = useState("all");

  // Selected enquiry for detail drawer
  const [activeEnquiry, setActiveEnquiry] = useState<any | null>(null);
  const [newNoteText, setNewNoteText] = useState("");
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);

  const fetchEnquiries = async () => {
    setIsLoading(true);
    try {
      const res = await adminApi.getEnquiries({
        search,
        status: selectedStatus,
        country: selectedCountry,
      });
      setEnquiries(res.items || []);
      setMeta(res.meta || null);
    } catch (err) {
      console.error("Failed to load enquiries:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStaff = async () => {
    try {
      const users = await adminApi.getUsers();
      setStaffUsers(users || []);
    } catch {
      // Non-owners might receive 403 on users list; ignore gracefully
    }
  };

  useEffect(() => {
    fetchEnquiries();
    fetchStaff();
  }, [selectedStatus, selectedCountry]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchEnquiries();
  };

  const handleOpenDetail = async (enq: any) => {
    try {
      const full = await adminApi.getEnquiry(enq.id);
      setActiveEnquiry(full);
    } catch {
      setActiveEnquiry(enq);
    }
  };

  const handleStatusChange = async (enquiryId: string, newStatus: string) => {
    try {
      const updated = await adminApi.updateEnquiryStatus(enquiryId, newStatus);
      if (activeEnquiry && activeEnquiry.id === enquiryId) {
        setActiveEnquiry({ ...activeEnquiry, status: newStatus });
      }
      setEnquiries((prev) =>
        prev.map((e) => (e.id === enquiryId ? { ...e, status: newStatus } : e))
      );
    } catch (err: any) {
      alert(err.message || "Failed to update status.");
    }
  };

  const handleAssignStaff = async (enquiryId: string, staffId: string) => {
    try {
      const updated = await adminApi.assignEnquiry(enquiryId, staffId);
      const assigned = staffUsers.find((u) => u.id === staffId);
      if (activeEnquiry && activeEnquiry.id === enquiryId) {
        setActiveEnquiry({
          ...activeEnquiry,
          assigned_to: staffId,
          assigned_to_name: assigned?.fullName,
        });
      }
      setEnquiries((prev) =>
        prev.map((e) =>
          e.id === enquiryId
            ? { ...e, assigned_to: staffId, assigned_to_name: assigned?.fullName }
            : e
        )
      );
    } catch (err: any) {
      alert(err.message || "Failed to assign staff.");
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim() || !activeEnquiry) return;

    setIsSubmittingNote(true);
    try {
      const note = await adminApi.addEnquiryNote(activeEnquiry.id, newNoteText.trim());
      setActiveEnquiry({
        ...activeEnquiry,
        internal_notes: [note, ...(activeEnquiry.internal_notes || [])],
      });
      setNewNoteText("");
    } catch (err: any) {
      alert(err.message || "Failed to add note.");
    } finally {
      setIsSubmittingNote(false);
    }
  };

  const STATUS_WORKFLOW = ["New", "Reviewing", "Quoted", "Negotiating", "Accepted", "Rejected", "Closed"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-serif font-bold text-[#0d2b1d] dark:text-white">
            Enquiries & Trade Proforma Inbox
          </h1>
          <p className="text-xs text-[#5c7365] dark:text-[#90a89a]">
            Process international trade requirements, assign export managers, and track commercial quotations.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={fetchEnquiries}
            className="p-2 text-xs border border-[#d5ded7] dark:border-[#274030] rounded-lg bg-white dark:bg-[#15231b] hover:bg-[#f2f6f3]"
            title="Refresh"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#5c7365]" />
          </button>
          <a
            href="/api/admin/enquiries/export/csv"
            download
            className="px-3 py-2 text-xs font-medium border border-[#d5ded7] dark:border-[#274030] rounded-lg bg-white dark:bg-[#15231b] hover:bg-[#f2f6f3] flex items-center space-x-1.5"
          >
            <Download className="w-3.5 h-3.5 text-[#5c7365]" />
            <span>Export Enquiries CSV</span>
          </a>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-white dark:bg-[#15231b] rounded-xl border border-[#d5ded7] dark:border-[#274030] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
        <form onSubmit={handleSearchSubmit} className="flex items-center space-x-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#889d8f] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by Ref #, Company, Importer, Port..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#f8faf8] dark:bg-[#111c15] border border-[#d5ded7] dark:border-[#274030] rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-[#dfb15b]"
            />
          </div>
          <button type="submit" className="px-3 py-2 bg-[#0d2b1d] text-white rounded-lg">
            Search
          </button>
        </form>

        <div className="flex items-center space-x-3">
          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-[#f8faf8] dark:bg-[#111c15] border border-[#d5ded7] dark:border-[#274030] rounded-lg px-2.5 py-2"
          >
            <option value="all">All Statuses</option>
            {STATUS_WORKFLOW.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Inquiries Table */}
      <div className="bg-white dark:bg-[#15231b] rounded-xl border border-[#d5ded7] dark:border-[#274030] overflow-hidden shadow-xs">
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-[#f2f6f3] dark:bg-[#111d16] text-[#4b6354] dark:text-[#8ea998] sticky top-0 z-10 border-b border-[#d5ded7] dark:border-[#274030]">
              <tr>
                <th className="p-3 font-semibold">Reference & Date</th>
                <th className="p-3 font-semibold">Importer / Company</th>
                <th className="p-3 font-semibold">Destination Port</th>
                <th className="p-3 font-semibold">Requested Commodities</th>
                <th className="p-3 font-semibold">Assigned To</th>
                <th className="p-3 font-semibold">Status</th>
                <th className="p-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#edf1ee] dark:divide-[#1f3527]">
              {enquiries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-xs text-[#788f82]">
                    No inquiries found.
                  </td>
                </tr>
              ) : (
                enquiries.map((enq) => (
                  <tr
                    key={enq.id}
                    className={`hover:bg-[#f8faf8] dark:hover:bg-[#18291f] transition-colors cursor-pointer ${
                      activeEnquiry?.id === enq.id ? "bg-[#fbf7ee] dark:bg-[#202d1d]" : ""
                    }`}
                    onClick={() => handleOpenDetail(enq)}
                  >
                    <td className="p-3">
                      <div className="font-mono font-bold text-[#0d2b1d] dark:text-[#dfb15b]">
                        {enq.reference_no}
                      </div>
                      <div className="text-[10px] text-[#788f82] dark:text-[#7f998a]">
                        {new Date(enq.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="font-semibold text-[#0d2b1d] dark:text-white">
                        {enq.company_name}
                      </div>
                      <div className="text-[11px] text-[#788f82] dark:text-[#7f998a]">
                        {enq.representative_name} &bull; {enq.country}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="font-medium text-[#294233] dark:text-[#c4ded0]">
                        {enq.destination_port}
                      </div>
                      <div className="text-[10px] text-[#788f82] font-mono">{enq.target_incoterm}</div>
                    </td>
                    <td className="p-3">
                      <div className="space-y-0.5">
                        {enq.items?.map((it: any, i: number) => (
                          <div key={i} className="text-[11px] truncate max-w-xs">
                            <span className="font-medium text-[#0d2b1d] dark:text-white">
                              {it.product_name}
                            </span>
                            <span className="text-[#788f82] dark:text-[#8ea998] ml-1">
                              ({it.quantity} {it.unit})
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="p-3">
                      {enq.assigned_to_name ? (
                        <span className="px-2 py-0.5 rounded bg-[#f0f4f1] dark:bg-[#1c2e22] text-[#0d2b1d] dark:text-[#dfb15b] text-[11px]">
                          {enq.assigned_to_name}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic text-[11px]">Unassigned</span>
                      )}
                    </td>
                    <td className="p-3">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          enq.status === "New"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 font-bold"
                            : enq.status === "Quoted"
                            ? "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300"
                            : enq.status === "Accepted"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                        }`}
                      >
                        {enq.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDetail(enq);
                        }}
                        className="px-2.5 py-1 text-xs border border-[#d5ded7] dark:border-[#274030] rounded hover:bg-[#0d2b1d] hover:text-white transition-colors"
                      >
                        Review &rarr;
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-over Detail Drawer */}
      {activeEnquiry && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs">
          <div
            className="w-full max-w-2xl bg-white dark:bg-[#132219] h-full shadow-2xl flex flex-col border-l border-[#d5ded7] dark:border-[#274030] animate-slideInRight"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="p-5 border-b border-[#e2e8e3] dark:border-[#203628] flex items-center justify-between bg-[#f8faf8] dark:bg-[#101b14]">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-sm font-bold text-[#dfb15b]">
                    {activeEnquiry.reference_no}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#fbf6ea] dark:bg-[#2b2715] text-[#b88c34] dark:text-[#dfb15b]">
                    {activeEnquiry.status}
                  </span>
                </div>
                <h2 className="text-base font-bold text-[#0d2b1d] dark:text-white mt-0.5">
                  {activeEnquiry.company_name}
                </h2>
              </div>
              <button
                onClick={() => setActiveEnquiry(null)}
                className="p-2 text-[#788f82] hover:bg-[#e6ece8] dark:hover:bg-[#1d3023] rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
              {/* Status Workflow Selector */}
              <div className="p-4 bg-[#f8faf8] dark:bg-[#18291f] rounded-xl border border-[#d5ded7] dark:border-[#274030]">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5c7365] dark:text-[#8ea998] mb-2">
                  Inquiry Status Pipeline
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {STATUS_WORKFLOW.map((st) => (
                    <button
                      key={st}
                      onClick={() => handleStatusChange(activeEnquiry.id, st)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                        activeEnquiry.status === st
                          ? "bg-[#0d2b1d] text-white dark:bg-[#dfb15b] dark:text-[#0d2b1d] font-bold shadow-xs"
                          : "bg-white dark:bg-[#132219] border border-[#d5ded7] dark:border-[#274030] text-[#5c7365] dark:text-[#8ea998] hover:border-[#dfb15b]"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Importer Overview & Quick WhatsApp */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[#788f82]">Contact Person:</span>
                  <div className="font-semibold text-[#0d2b1d] dark:text-white mt-0.5">
                    {activeEnquiry.representative_name}
                  </div>
                </div>
                <div>
                  <span className="text-[#788f82]">Business Email:</span>
                  <div className="font-semibold text-[#0d2b1d] dark:text-white mt-0.5 font-mono">
                    <a href={`mailto:${activeEnquiry.business_email}`} className="hover:underline">
                      {activeEnquiry.business_email}
                    </a>
                  </div>
                </div>
                <div>
                  <span className="text-[#788f82]">Country & City:</span>
                  <div className="font-semibold text-[#0d2b1d] dark:text-white mt-0.5">
                    {activeEnquiry.city ? `${activeEnquiry.city}, ` : ""}
                    {activeEnquiry.country}
                  </div>
                </div>
                <div>
                  <span className="text-[#788f82]">Destination Port:</span>
                  <div className="font-semibold text-[#0d2b1d] dark:text-white mt-0.5">
                    {activeEnquiry.destination_port} ({activeEnquiry.target_incoterm})
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Response Button */}
              {activeEnquiry.phone_whatsapp && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-emerald-800 dark:text-emerald-200">
                    <Phone className="w-4 h-4 text-emerald-600" />
                    <span>WhatsApp: {activeEnquiry.phone_whatsapp}</span>
                  </div>
                  {activeEnquiry.whatsappLink && (
                    <a
                      href={activeEnquiry.whatsappLink}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center space-x-1"
                    >
                      <span>One-Click WhatsApp Reply</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              )}

              {/* Requested Commodities */}
              <div>
                <h3 className="font-bold text-sm text-[#0d2b1d] dark:text-white mb-2">
                  Requested Spice Commodities
                </h3>
                <div className="border border-[#d5ded7] dark:border-[#274030] rounded-xl overflow-hidden divide-y divide-[#edf1ee] dark:divide-[#203628]">
                  {activeEnquiry.items?.map((item: any, idx: number) => (
                    <div key={idx} className="p-3 bg-white dark:bg-[#16271d]">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm text-[#0d2b1d] dark:text-white">
                          {item.product_name}
                        </span>
                        <span className="font-bold text-xs font-mono text-[#0d2b1d] dark:text-[#dfb15b]">
                          {item.quantity} {item.unit}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mt-2 text-[11px] text-[#5c7365] dark:text-[#90a89a]">
                        <div>Form: <span className="font-medium text-black dark:text-white">{item.form}</span></div>
                        <div>Grade: <span className="font-medium text-black dark:text-white">{item.preferred_grade || "Any"}</span></div>
                        <div>Packaging: <span className="font-medium text-black dark:text-white">{item.packaging_preference || "Standard"}</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Special Requirements */}
              {activeEnquiry.special_requirements && (
                <div className="p-3 rounded-lg bg-[#f9faf9] dark:bg-[#18291f] border border-[#d5ded7] dark:border-[#274030]">
                  <span className="font-bold text-[11px] text-[#5c7365] dark:text-[#90a89a] block mb-1">
                    Special Shipping & Lab Requirements:
                  </span>
                  <p className="text-xs text-[#294233] dark:text-[#c4ded0]">{activeEnquiry.special_requirements}</p>
                </div>
              )}

              {/* Internal Notes / Comments Thread */}
              <div>
                <h3 className="font-bold text-sm text-[#0d2b1d] dark:text-white mb-2">
                  Internal Trade Notes & Audit Comments
                </h3>

                <form onSubmit={handleAddNote} className="flex space-x-2 mb-3">
                  <input
                    type="text"
                    placeholder="Log comment, lab check result, or shipment note..."
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    className="flex-1 bg-[#f8faf8] dark:bg-[#18291f] border border-[#d5ded7] dark:border-[#274030] rounded-lg p-2 text-xs"
                  />
                  <button
                    type="submit"
                    disabled={isSubmittingNote || !newNoteText.trim()}
                    className="px-3 py-2 bg-[#0d2b1d] text-white dark:bg-[#dfb15b] dark:text-[#0d2b1d] font-bold rounded-lg disabled:opacity-50"
                  >
                    Post Note
                  </button>
                </form>

                <div className="space-y-2">
                  {(activeEnquiry.internal_notes || []).map((note: any) => (
                    <div key={note.id} className="p-2.5 rounded-lg bg-[#f4f7f5] dark:bg-[#18291f] border border-[#d5ded7] dark:border-[#274030]">
                      <div className="flex items-center justify-between text-[10px] text-[#788f82] dark:text-[#7f998a] mb-1">
                        <span className="font-semibold text-[#0d2b1d] dark:text-[#dfb15b]">{note.author}</span>
                        <span>{new Date(note.date).toLocaleString()}</span>
                      </div>
                      <p className="text-xs text-[#294233] dark:text-[#c4ded0]">{note.text}</p>
                    </div>
                  ))}
                  {(!activeEnquiry.internal_notes || activeEnquiry.internal_notes.length === 0) && (
                    <div className="text-center p-3 text-gray-400 italic">No notes logged yet.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
