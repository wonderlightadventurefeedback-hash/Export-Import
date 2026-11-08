import React, { useState, useEffect } from "react";
import { ShieldAlert, Download, Filter, Search, AlertTriangle, ArrowUpDown } from "lucide-react";
import { adminApi } from "../../services/adminApi";
import { useAdminAuth } from "../../context/AdminAuthContext";

export const AdminAuditLog: React.FC = () => {
  const { isOwner } = useAdminAuth();
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [entityFilter, setEntityFilter] = useState("all");

  useEffect(() => {
    fetchLogs();
  }, [actionFilter, entityFilter]);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const params: Record<string, string> = {};
      if (actionFilter !== "all") params.action = actionFilter;
      if (entityFilter !== "all") params.entity = entityFilter;
      const data = await adminApi.getAuditLogs(params);
      setLogs(data || []);
    } catch (err: any) {
      console.error("Failed to load audit logs:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredLogs = logs.filter((log) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      log.actor_name?.toLowerCase().includes(q) ||
      log.action?.toLowerCase().includes(q) ||
      log.entity?.toLowerCase().includes(q) ||
      log.entity_id?.toLowerCase().includes(q)
    );
  });

  const handleExportCSV = () => {
    if (filteredLogs.length === 0) return;
    const headers = ["Timestamp", "Actor", "Role", "Action", "Entity", "Entity ID", "IP Address", "Details"];
    const rows = filteredLogs.map((l) => [
      l.created_at,
      l.actor_name,
      l.actor_role,
      l.action,
      l.entity,
      l.entity_id,
      l.ip_address || "127.0.0.1",
      JSON.stringify(l.changes || {}).replace(/"/g, '""'),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.map((val) => `"${val}"`).join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `audit-trail-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOwner) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-8 text-center max-w-lg mx-auto mt-12">
        <AlertTriangle className="w-10 h-10 text-amber-600 mx-auto mb-3" />
        <h2 className="font-serif text-lg font-bold text-amber-900 mb-1">Restricted Access</h2>
        <p className="text-sm text-amber-700">
          The System Security & Audit Log is restricted strictly to the primary Executive Owner account.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-charcoal-900 flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-forest-700" />
            Security & Compliance Audit Trail
          </h1>
          <p className="font-sans text-sm text-charcoal-500">
            Immutable log of all operational mutations, login sessions, supplier lookups, and export dispatches.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 px-4 py-2 border border-ivory-300 bg-white text-charcoal-700 font-sans text-sm font-semibold rounded-lg hover:bg-ivory-100 transition-colors shadow-sm"
        >
          <Download className="w-4 h-4 text-forest-700" />
          <span>Export Audit CSV</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-ivory-300 rounded-xl p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-charcoal-400" />
          <input
            type="text"
            placeholder="Search by actor, action, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-ivory-50 border border-ivory-300 rounded-lg text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-3 py-2 bg-ivory-50 border border-ivory-300 rounded-lg text-sm text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-forest-600"
          >
            <option value="all">All Actions</option>
            <option value="CREATE">CREATE</option>
            <option value="UPDATE">UPDATE</option>
            <option value="DELETE">DELETE</option>
            <option value="LOGIN">LOGIN</option>
            <option value="EXPORT">EXPORT</option>
          </select>

          <select
            value={entityFilter}
            onChange={(e) => setEntityFilter(e.target.value)}
            className="px-3 py-2 bg-ivory-50 border border-ivory-300 rounded-lg text-sm text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-forest-600"
          >
            <option value="all">All Entities</option>
            <option value="product">Products</option>
            <option value="quotation">Quotations</option>
            <option value="enquiry">Enquiries</option>
            <option value="supplier">Suppliers</option>
            <option value="settings">Settings</option>
            <option value="auth">Auth</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-ivory-300 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-charcoal-400">Loading audit records...</div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-8 text-center text-charcoal-400">No matching audit logs found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm font-sans">
              <thead className="bg-ivory-100/70 border-b border-ivory-200 text-charcoal-600 text-xs uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-5 py-3.5">Timestamp</th>
                  <th className="px-5 py-3.5">Actor</th>
                  <th className="px-5 py-3.5">Action</th>
                  <th className="px-5 py-3.5">Target Entity</th>
                  <th className="px-5 py-3.5">IP Address</th>
                  <th className="px-5 py-3.5">Context Summary</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ivory-200">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-ivory-50/60 transition-colors">
                    <td className="px-5 py-3 text-xs font-mono text-charcoal-500 whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="px-5 py-3">
                      <div className="font-semibold text-charcoal-900 text-xs">{log.actor_name}</div>
                      <span className="text-[10px] text-charcoal-500 uppercase">{log.actor_role}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                          log.action === "CREATE"
                            ? "bg-emerald-100 text-emerald-800"
                            : log.action === "DELETE"
                            ? "bg-rose-100 text-rose-800"
                            : log.action === "UPDATE"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs font-mono text-charcoal-700">
                      <span className="font-semibold">{log.entity}</span>
                      {log.entity_id && (
                        <span className="text-charcoal-400 ml-1">({log.entity_id.slice(0, 8)}...)</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-xs font-mono text-charcoal-500">
                      {log.ip_address || "127.0.0.1"}
                    </td>
                    <td className="px-5 py-3 text-xs text-charcoal-600 max-w-xs truncate font-mono">
                      {JSON.stringify(log.changes || {})}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
export default AdminAuditLog;