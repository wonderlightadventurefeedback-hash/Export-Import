import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Inbox,
  FileText,
  Package,
  Truck,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Building2,
  RefreshCw,
  Plus,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { adminApi } from "../../services/adminApi";

export const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await adminApi.getDashboard();
      setData(res);
    } catch (err: any) {
      setError(err.message || "Failed to load dashboard metrics");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0d2b1d] dark:border-[#dfb15b]" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl text-red-700 dark:text-red-300">
        <div className="font-semibold text-sm mb-1">Failed to load dashboard data</div>
        <p className="text-xs mb-3">{error}</p>
        <button
          onClick={fetchDashboard}
          className="px-3 py-1.5 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-1"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry</span>
        </button>
      </div>
    );
  }

  const { stats, enquiriesByStatus, recentQuotations, recentEnquiries } = data;

  const STATUS_COLORS: Record<string, string> = {
    New: "#dfb15b",
    Reviewing: "#3b82f6",
    Quoted: "#8b5cf6",
    Negotiating: "#f97316",
    Accepted: "#10b981",
    Closed: "#6b7280",
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome & Quick Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-serif font-bold text-[#0d2b1d] dark:text-white">
            Export Operations Dashboard
          </h1>
          <p className="text-xs text-[#5c7365] dark:text-[#90a89a]">
            Direct spice export pipeline, commodity lots, and active commercial negotiations.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={fetchDashboard}
            className="p-2 text-xs border border-[#d5ded7] dark:border-[#274030] rounded-lg bg-white dark:bg-[#15231b] hover:bg-[#f2f6f3] transition-colors"
            title="Refresh metrics"
          >
            <RefreshCw className="w-4 h-4 text-[#5c7365] dark:text-[#90a89a]" />
          </button>
          <Link
            to="/admin/products?action=new"
            className="px-3 py-2 text-xs font-semibold bg-[#0d2b1d] text-white dark:bg-[#dfb15b] dark:text-[#0d2b1d] rounded-lg hover:opacity-90 transition-opacity flex items-center space-x-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Spice</span>
          </Link>
          <Link
            to="/admin/quotations?action=new"
            className="px-3 py-2 text-xs font-semibold bg-[#dfb15b] text-[#0d2b1d] rounded-lg hover:bg-[#ebd28b] transition-colors flex items-center space-x-1.5 shadow-sm"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Draft Quote</span>
          </Link>
        </div>
      </div>

      {/* Primary KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/admin/enquiries?status=new"
          className="p-4 rounded-xl bg-white dark:bg-[#15231b] border border-[#d5ded7] dark:border-[#274030] shadow-xs hover:border-[#dfb15b] transition-all relative overflow-hidden group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#657d70] dark:text-[#8ea998]">New Enquiries</span>
            <div className="p-2 rounded-lg bg-[#fbf6ea] dark:bg-[#2b2715] text-[#b88c34] dark:text-[#dfb15b]">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-bold font-serif text-[#0d2b1d] dark:text-white">
              {stats.newEnquiriesCount}
            </span>
            {stats.newEnquiriesCount > 0 && (
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 px-1.5 py-0.5 rounded">
                Action required
              </span>
            )}
          </div>
          <div className="mt-1 text-[11px] text-[#788f82] dark:text-[#7f998a]">
            {stats.totalEnquiries} total inquiries logged
          </div>
        </Link>

        <Link
          to="/admin/quotations"
          className="p-4 rounded-xl bg-white dark:bg-[#15231b] border border-[#d5ded7] dark:border-[#274030] shadow-xs hover:border-[#dfb15b] transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#657d70] dark:text-[#8ea998]">Active Quotations</span>
            <div className="p-2 rounded-lg bg-[#f0f4f1] dark:bg-[#1c2e22] text-[#0d2b1d] dark:text-[#dfb15b]">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold font-serif text-[#0d2b1d] dark:text-white">
            {stats.totalQuotations}
          </div>
          <div className="mt-1 text-[11px] text-[#788f82] dark:text-[#7f998a]">
            Formal CIF & FOB commercial proformas
          </div>
        </Link>

        <Link
          to="/admin/products"
          className="p-4 rounded-xl bg-white dark:bg-[#15231b] border border-[#d5ded7] dark:border-[#274030] shadow-xs hover:border-[#dfb15b] transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#657d70] dark:text-[#8ea998]">Spice Commodities</span>
            <div className="p-2 rounded-lg bg-[#f0f4f1] dark:bg-[#1c2e22] text-[#0d2b1d] dark:text-[#dfb15b]">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold font-serif text-[#0d2b1d] dark:text-white">
            {stats.totalProducts}
          </div>
          <div className="mt-1 text-[11px] text-[#788f82] dark:text-[#7f998a]">
            GI Kandhamal, Guntur, Malabar lots
          </div>
        </Link>

        <Link
          to="/admin/suppliers"
          className="p-4 rounded-xl bg-white dark:bg-[#15231b] border border-[#d5ded7] dark:border-[#274030] shadow-xs hover:border-[#dfb15b] transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#657d70] dark:text-[#8ea998]">Verified Suppliers</span>
            <div className="p-2 rounded-lg bg-[#f0f4f1] dark:bg-[#1c2e22] text-[#0d2b1d] dark:text-[#dfb15b]">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold font-serif text-[#0d2b1d] dark:text-white">
            {stats.totalSuppliers}
          </div>
          <div className="mt-1 text-[11px] text-[#788f82] dark:text-[#7f998a]">
            Confidential grower cooperatives
          </div>
        </Link>
      </div>

      {/* Middle Row: Chart & Enquiries Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Enquiries Pipeline Chart */}
        <div className="lg:col-span-2 p-5 bg-white dark:bg-[#15231b] rounded-xl border border-[#d5ded7] dark:border-[#274030] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-[#0d2b1d] dark:text-white">Inquiries by Commercial Status</h2>
              <p className="text-xs text-[#788f82] dark:text-[#7f998a]">Active buyer negotiations breakdown</p>
            </div>
            <Link to="/admin/enquiries" className="text-xs font-medium text-[#0d2b1d] dark:text-[#dfb15b] hover:underline flex items-center">
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={enquiriesByStatus} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="status" tick={{ fontSize: 11 }} stroke="#889d8f" />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} stroke="#889d8f" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0d2b1d",
                    color: "#ffffff",
                    borderRadius: "8px",
                    border: "none",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {enquiriesByStatus.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.status] || "#0d2b1d"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Sourcing & Compliance Digest */}
        <div className="p-5 bg-white dark:bg-[#15231b] rounded-xl border border-[#d5ded7] dark:border-[#274030] shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#0d2b1d] dark:text-white mb-1">Export Integrity Checklist</h2>
            <p className="text-xs text-[#788f82] dark:text-[#7f998a] mb-4">Regulatory & statutory standards active</p>

            <div className="space-y-3">
              <div className="flex items-start space-x-2.5 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <div className="font-semibold text-[#0d2b1d] dark:text-white">APEDA RCMC Active</div>
                  <div className="text-[11px] text-[#788f82] dark:text-[#7f998a]">Registered Exporter #APEDA/RCMC/2023/1820</div>
                </div>
              </div>

              <div className="flex items-start space-x-2.5 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <div className="font-semibold text-[#0d2b1d] dark:text-white">Spices Board India Certified</div>
                  <div className="text-[11px] text-[#788f82] dark:text-[#7f998a]">Quality Lab QEL testing protocols mapped</div>
                </div>
              </div>

              <div className="flex items-start space-x-2.5 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <div className="font-semibold text-[#0d2b1d] dark:text-white">FSSAI Central Export License</div>
                  <div className="text-[11px] text-[#788f82] dark:text-[#7f998a]">Food hygiene & moisture thresholds valid</div>
                </div>
              </div>

              <div className="flex items-start space-x-2.5 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <div className="font-semibold text-[#0d2b1d] dark:text-white">Supplier Confidentiality Enforced</div>
                  <div className="text-[11px] text-[#788f82] dark:text-[#7f998a]">Direct farmer identities protected from public API</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#e2e8e3] dark:border-[#22392b]">
            <Link
              to="/admin/settings"
              className="text-xs font-semibold text-[#0d2b1d] dark:text-[#dfb15b] hover:underline flex items-center justify-between"
            >
              <span>Manage statutory certificates</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Quotations & Recent Inquiries Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Quotations */}
        <div className="bg-white dark:bg-[#15231b] rounded-xl border border-[#d5ded7] dark:border-[#274030] overflow-hidden shadow-xs">
          <div className="p-4 border-b border-[#e2e8e3] dark:border-[#22392b] flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#0d2b1d] dark:text-white">Recent Commercial Quotations</h3>
            <Link to="/admin/quotations" className="text-xs font-medium text-[#0d2b1d] dark:text-[#dfb15b] hover:underline">
              All quotes &rarr;
            </Link>
          </div>

          {recentQuotations && recentQuotations.length > 0 ? (
            <div className="divide-y divide-[#edf1ee] dark:divide-[#1f3527]">
              {recentQuotations.map((quote: any) => (
                <div key={quote.id} className="p-3.5 hover:bg-[#f8faf8] dark:hover:bg-[#1a2d22] transition-colors flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-[#0d2b1d] dark:text-white">
                        {quote.quotation_no}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-[#f0f4f1] dark:bg-[#203628] text-[#0d2b1d] dark:text-[#dfb15b]">
                        {quote.status}
                      </span>
                    </div>
                    <div className="text-xs text-[#5c7365] dark:text-[#8ea998] mt-0.5">
                      {quote.company_name} &bull; {quote.destination_port}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-[#0d2b1d] dark:text-white font-mono">
                      ${quote.total_amount.toLocaleString()} {quote.currency}
                    </div>
                    <div className="text-[10px] text-[#788f82] dark:text-[#7f998a]">{quote.incoterm}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-[#788f82]">No quotations created yet.</div>
          )}
        </div>

        {/* Recent Trade Inquiries */}
        <div className="bg-white dark:bg-[#15231b] rounded-xl border border-[#d5ded7] dark:border-[#274030] overflow-hidden shadow-xs">
          <div className="p-4 border-b border-[#e2e8e3] dark:border-[#22392b] flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#0d2b1d] dark:text-white">Incoming Buyer Inquiries</h3>
            <Link to="/admin/enquiries" className="text-xs font-medium text-[#0d2b1d] dark:text-[#dfb15b] hover:underline">
              Inbox &rarr;
            </Link>
          </div>

          {recentEnquiries && recentEnquiries.length > 0 ? (
            <div className="divide-y divide-[#edf1ee] dark:divide-[#1f3527]">
              {recentEnquiries.map((enq: any) => (
                <div key={enq.id} className="p-3.5 hover:bg-[#f8faf8] dark:hover:bg-[#1a2d22] transition-colors flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-[#0d2b1d] dark:text-white">
                        {enq.reference_no}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-[#fbf6ea] dark:bg-[#2b2715] text-[#b88c34] dark:text-[#dfb15b]">
                        {enq.status}
                      </span>
                    </div>
                    <div className="text-xs text-[#5c7365] dark:text-[#8ea998] mt-0.5">
                      {enq.company_name} ({enq.country})
                    </div>
                  </div>
                  <Link
                    to={`/admin/enquiries?id=${enq.id}`}
                    className="p-1.5 rounded-lg border border-[#d5ded7] dark:border-[#274030] text-xs hover:bg-[#0d2b1d] hover:text-white transition-colors"
                  >
                    Open
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-[#788f82]">No incoming inquiries yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};
