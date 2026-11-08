import React, { useState, useEffect } from "react";
import {
  FileText,
  Plus,
  Search,
  Download,
  Printer,
  X,
  PlusCircle,
  MinusCircle,
  ExternalLink,
  Building2,
  Calendar,
} from "lucide-react";
import { adminApi } from "../../services/adminApi";
import { useAdminAuth } from "../../context/AdminAuthContext";

export const AdminQuotations: React.FC = () => {
  const { canManageSales } = useAdminAuth();
  const [quotations, setQuotations] = useState<any[]>([]);
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [activePdfQuote, setActivePdfQuote] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    enquiry_id: "",
    buyer_name: "",
    company_name: "",
    currency: "USD",
    incoterm: "CIF",
    destination_port: "",
    payment_terms: "Irrevocable Confirmed L/C at sight, or 30% advance deposit with balance upon BL copy.",
    valid_until: "2026-04-30",
    status: "Draft",
    insurance_and_freight: 3500,
    terms_conditions: "Origin: India (Odisha/Kerala/Andhra belts). Prices subject to ocean freight rates at vessel fixture. Includes phytosanitary certificates, Spices Board test results, and certificate of origin.",
    items: [
      {
        product_name: "Kandhamal Organic Turmeric Fingers (5% Curcumin)",
        quantity: 10,
        unit: "MT",
        unit_price: 2100,
        total_price: 21000,
        packaging: "25kg Food-grade Jute Bags with Poly Liner",
        specifications_summary: "Curcumin > 5.0%, Moisture < 9.5%",
      },
    ],
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [quotesRes, enqsRes] = await Promise.all([
        adminApi.getQuotations({ search }),
        adminApi.getEnquiries(),
      ]);
      setQuotations(quotesRes || []);
      setEnquiries(enqsRes.items || []);
    } catch (err) {
      console.error("Failed to load quotations:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenCreate = () => {
    setFormData({
      enquiry_id: "",
      buyer_name: "",
      company_name: "",
      currency: "USD",
      incoterm: "CIF",
      destination_port: "",
      payment_terms: "Irrevocable Confirmed L/C at sight, or 30% advance deposit with balance upon BL copy.",
      valid_until: "2026-04-30",
      status: "Draft",
      insurance_and_freight: 3500,
      terms_conditions: "Origin: India (Odisha/Kerala/Andhra belts). Prices subject to ocean freight rates at vessel fixture. Includes phytosanitary certificates, Spices Board test results, and certificate of origin.",
      items: [
        {
          product_name: "Kandhamal Organic Turmeric Fingers",
          quantity: 10,
          unit: "MT",
          unit_price: 2150,
          total_price: 21500,
          packaging: "25kg Food-grade Jute Bags",
          specifications_summary: "Curcumin > 5.0%, Moisture < 9.5%",
        },
      ],
    });
    setIsModalOpen(true);
  };

  const handleSelectEnquiry = (enquiryId: string) => {
    const enq = enquiries.find((e) => e.id === enquiryId);
    if (!enq) return;

    const mappedItems = (enq.items || []).map((it: any) => ({
      product_name: `${it.product_name} (${it.form || "Whole"})`,
      quantity: Number(it.quantity) || 1,
      unit: it.unit || "MT",
      unit_price: 2200,
      total_price: (Number(it.quantity) || 1) * 2200,
      packaging: it.packaging_preference || "25 kg Jute Bags",
      specifications_summary: `Grade: ${it.preferred_grade || "Standard"}`,
    }));

    setFormData({
      ...formData,
      enquiry_id: enq.id,
      buyer_name: enq.representative_name,
      company_name: enq.company_name,
      destination_port: enq.destination_port,
      incoterm: enq.target_incoterm || "CIF",
      items: mappedItems.length ? mappedItems : formData.items,
    });
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const updated = [...formData.items];
    (updated[index] as any)[field] = value;
    if (field === "quantity" || field === "unit_price") {
      const q = Number(updated[index].quantity) || 0;
      const p = Number(updated[index].unit_price) || 0;
      updated[index].total_price = Math.round(q * p * 100) / 100;
    }
    setFormData({ ...formData, items: updated });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminApi.createQuotation(formData);
      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      alert(err.message || "Failed to create quotation.");
    }
  };

  const handleViewPdf = (quote: any) => {
    setActivePdfQuote(quote);
    setIsPdfModalOpen(true);
  };

  const subtotal = formData.items.reduce((s, it) => s + (it.total_price || 0), 0);
  const total = subtotal + Number(formData.insurance_and_freight || 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-serif font-bold text-[#0d2b1d] dark:text-white">
            Commercial Quotations & Proforma Invoices
          </h1>
          <p className="text-xs text-[#5c7365] dark:text-[#90a89a]">
            Generate official CIF/FOB proforma quotations, calculate freight & insurance, and export PDF documents.
          </p>
        </div>

        {canManageSales && (
          <button
            onClick={handleOpenCreate}
            className="px-3.5 py-2 text-xs font-semibold bg-[#0d2b1d] text-white dark:bg-[#dfb15b] dark:text-[#0d2b1d] rounded-lg hover:opacity-90 flex items-center space-x-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Draft New Quotation</span>
          </button>
        )}
      </div>

      {/* Quotations List */}
      <div className="bg-white dark:bg-[#15231b] rounded-xl border border-[#d5ded7] dark:border-[#274030] overflow-hidden shadow-xs">
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-[#f2f6f3] dark:bg-[#111d16] text-[#4b6354] dark:text-[#8ea998] sticky top-0 z-10 border-b border-[#d5ded7] dark:border-[#274030]">
              <tr>
                <th className="p-3 font-semibold">Quote Number</th>
                <th className="p-3 font-semibold">Buyer & Company</th>
                <th className="p-3 font-semibold">Destination Port</th>
                <th className="p-3 font-semibold">Incoterm</th>
                <th className="p-3 font-semibold">Total Amount</th>
                <th className="p-3 font-semibold">Valid Until</th>
                <th className="p-3 font-semibold">Status</th>
                <th className="p-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#edf1ee] dark:divide-[#1f3527]">
              {quotations.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-xs text-[#788f82]">
                    No quotations generated yet.
                  </td>
                </tr>
              ) : (
                quotations.map((q) => (
                  <tr key={q.id} className="hover:bg-[#f8faf8] dark:hover:bg-[#18291f] transition-colors">
                    <td className="p-3 font-mono font-bold text-[#0d2b1d] dark:text-[#dfb15b]">
                      {q.quotation_no}
                    </td>
                    <td className="p-3">
                      <div className="font-semibold text-[#0d2b1d] dark:text-white">{q.company_name}</div>
                      <div className="text-[11px] text-[#788f82]">{q.buyer_name}</div>
                    </td>
                    <td className="p-3 font-medium text-[#294233] dark:text-[#c4ded0]">
                      {q.destination_port}
                    </td>
                    <td className="p-3 font-mono font-semibold text-[#0d2b1d] dark:text-white">
                      {q.incoterm}
                    </td>
                    <td className="p-3 font-mono font-bold text-sm text-[#0d2b1d] dark:text-[#dfb15b]">
                      ${q.total_amount?.toLocaleString()} {q.currency}
                    </td>
                    <td className="p-3 text-[#5c7365] dark:text-[#8ea998]">
                      {q.valid_until}
                    </td>
                    <td className="p-3">
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-[#f0f4f1] dark:bg-[#203628] text-[#0d2b1d] dark:text-[#dfb15b]">
                        {q.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleViewPdf(q)}
                        className="px-2.5 py-1 text-xs bg-[#f4f7f5] dark:bg-[#182a1f] border border-[#d5ded7] dark:border-[#274030] rounded hover:border-[#dfb15b] flex items-center space-x-1 inline-flex"
                      >
                        <Printer className="w-3.5 h-3.5 text-[#dfb15b]" />
                        <span>Print / PDF</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create Quotation */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-3xl bg-white dark:bg-[#132219] rounded-2xl shadow-2xl border border-[#d5ded7] dark:border-[#274030] overflow-hidden my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2e8e3] dark:border-[#203628] bg-[#f8faf8] dark:bg-[#101b14]">
              <div>
                <h3 className="text-base font-bold text-[#0d2b1d] dark:text-white">
                  Draft New Commercial Quotation
                </h3>
                <p className="text-xs text-[#5c7365] dark:text-[#90a89a]">
                  Auto-computes commodity line item values, freight allowances, and proforma totals.
                </p>
              </div>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5 text-[#788f82]" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs max-h-[70vh] overflow-y-auto">
              {/* Optional Link to Enquiry */}
              {enquiries.length > 0 && (
                <div className="p-3 bg-[#f8faf8] dark:bg-[#18291f] rounded-lg border border-[#d5ded7] dark:border-[#274030]">
                  <label className="block font-semibold mb-1">Prefill from Received Inquiry (Optional):</label>
                  <select
                    value={formData.enquiry_id}
                    onChange={(e) => handleSelectEnquiry(e.target.value)}
                    className="w-full bg-white dark:bg-[#132219] border border-[#d5ded7] dark:border-[#274030] rounded p-2"
                  >
                    <option value="">-- Choose an inquiry to auto-fill --</option>
                    {enquiries.map((enq) => (
                      <option key={enq.id} value={enq.id}>
                        {enq.reference_no} &bull; {enq.company_name} ({enq.country}) - {enq.destination_port}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-1">Company / Importer Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                    className="w-full bg-[#f8faf8] dark:bg-[#16271d] border border-[#d5ded7] dark:border-[#274030] rounded p-2"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Representative Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.buyer_name}
                    onChange={(e) => setFormData({ ...formData, buyer_name: e.target.value })}
                    className="w-full bg-[#f8faf8] dark:bg-[#16271d] border border-[#d5ded7] dark:border-[#274030] rounded p-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-medium mb-1">Destination Port *</label>
                  <input
                    type="text"
                    required
                    value={formData.destination_port}
                    onChange={(e) => setFormData({ ...formData, destination_port: e.target.value })}
                    className="w-full bg-[#f8faf8] dark:bg-[#16271d] border border-[#d5ded7] dark:border-[#274030] rounded p-2"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Incoterm</label>
                  <select
                    value={formData.incoterm}
                    onChange={(e) => setFormData({ ...formData, incoterm: e.target.value })}
                    className="w-full bg-[#f8faf8] dark:bg-[#16271d] border border-[#d5ded7] dark:border-[#274030] rounded p-2"
                  >
                    <option value="CIF">CIF (Cost, Insurance & Freight)</option>
                    <option value="FOB">FOB (Free on Board - Paradip / Kolkata / Cochin)</option>
                    <option value="CFR">CFR (Cost & Freight)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium mb-1">Valid Until</label>
                  <input
                    type="date"
                    value={formData.valid_until}
                    onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                    className="w-full bg-[#f8faf8] dark:bg-[#16271d] border border-[#d5ded7] dark:border-[#274030] rounded p-2"
                  />
                </div>
              </div>

              {/* Line Items */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold">Quotation Commodity Line Items</h4>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        items: [
                          ...formData.items,
                          {
                            product_name: "",
                            quantity: 1,
                            unit: "MT",
                            unit_price: 2000,
                            total_price: 2000,
                            packaging: "25kg Jute Bags",
                            specifications_summary: "",
                          },
                        ],
                      })
                    }
                    className="text-xs text-[#0d2b1d] dark:text-[#dfb15b] font-bold flex items-center space-x-1"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.items.map((item, idx) => (
                    <div key={idx} className="p-3 border border-[#d5ded7] dark:border-[#274030] rounded-lg space-y-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          placeholder="Commodity Description"
                          value={item.product_name}
                          onChange={(e) => handleItemChange(idx, "product_name", e.target.value)}
                          className="flex-1 bg-[#f8faf8] dark:bg-[#16271d] border border-[#d5ded7] dark:border-[#274030] rounded p-2"
                        />
                        <input
                          type="number"
                          placeholder="Qty"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(idx, "quantity", parseFloat(e.target.value))}
                          className="w-20 bg-[#f8faf8] dark:bg-[#16271d] border border-[#d5ded7] dark:border-[#274030] rounded p-2"
                        />
                        <select
                          value={item.unit}
                          onChange={(e) => handleItemChange(idx, "unit", e.target.value)}
                          className="w-20 bg-[#f8faf8] dark:bg-[#16271d] border border-[#d5ded7] dark:border-[#274030] rounded p-2"
                        >
                          <option value="MT">MT</option>
                          <option value="KG">KG</option>
                        </select>
                        <input
                          type="number"
                          placeholder="Unit Price ($)"
                          value={item.unit_price}
                          onChange={(e) => handleItemChange(idx, "unit_price", parseFloat(e.target.value))}
                          className="w-28 bg-[#f8faf8] dark:bg-[#16271d] border border-[#d5ded7] dark:border-[#274030] rounded p-2"
                        />
                        <span className="font-mono font-bold w-24 text-right">
                          ${item.total_price?.toLocaleString()}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              items: formData.items.filter((_, i) => i !== idx),
                            })
                          }
                          className="p-1 text-red-600"
                        >
                          <MinusCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Freight & Totals */}
              <div className="p-4 bg-[#fbfdfb] dark:bg-[#15231b] border border-[#d5ded7] dark:border-[#274030] rounded-xl flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span>Ocean Freight & Marine Cargo Insurance ($):</span>
                  <input
                    type="number"
                    value={formData.insurance_and_freight}
                    onChange={(e) => setFormData({ ...formData, insurance_and_freight: parseFloat(e.target.value) || 0 })}
                    className="w-28 bg-white dark:bg-[#132219] border border-[#d5ded7] dark:border-[#274030] rounded p-1.5 font-mono"
                  />
                </div>
                <div className="text-right">
                  <div className="text-xs text-[#788f82]">Subtotal: ${subtotal.toLocaleString()}</div>
                  <div className="text-base font-mono font-bold text-[#0d2b1d] dark:text-[#dfb15b]">
                    Total CIF: ${total.toLocaleString()} {formData.currency}
                  </div>
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
                  Save & Issue Quotation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable / PDF Preview Modal */}
      {isPdfModalOpen && activePdfQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-3xl bg-white text-[#1c2b21] rounded-2xl shadow-2xl border border-gray-300 overflow-hidden my-6 flex flex-col max-h-[90vh]">
            <div className="p-4 bg-[#0d2b1d] text-white flex items-center justify-between">
              <span className="font-bold text-sm">Commercial Proforma Document &bull; {activePdfQuote.quotation_no}</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1 bg-[#dfb15b] text-[#0d2b1d] font-bold text-xs rounded flex items-center space-x-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Document</span>
                </button>
                <button onClick={() => setIsPdfModalOpen(false)} className="p-1 text-white/80 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Document Body */}
            <div className="p-8 overflow-y-auto space-y-6 text-xs bg-white text-gray-900">
              <div className="flex justify-between border-b pb-6">
                <div>
                  <h2 className="text-xl font-serif font-black tracking-wide text-[#0d2b1d]">INDIAN SPICE EXPORT</h2>
                  <div className="text-[11px] text-gray-600 mt-1">Single-Origin Agricultural Commodities Corridor</div>
                  <div className="text-[11px] text-gray-500 mt-0.5">Janpath, Bhubaneswar, Odisha - 751001, India</div>
                  <div className="text-[11px] text-gray-500">APEDA/RCMC/2023/1820 &bull; Spices Board: SB/EXP/2024/78219</div>
                </div>
                <div className="text-right">
                  <div className="text-base font-bold font-mono text-[#0d2b1d]">{activePdfQuote.quotation_no}</div>
                  <div className="text-gray-500">Date: {new Date(activePdfQuote.created_at).toLocaleDateString()}</div>
                  <div className="text-gray-500">Valid Until: {activePdfQuote.valid_until}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg">
                <div>
                  <span className="font-bold text-gray-500 text-[10px] uppercase">Consignee / Importer:</span>
                  <div className="font-bold text-sm text-gray-900 mt-1">{activePdfQuote.company_name}</div>
                  <div className="text-gray-600">Attn: {activePdfQuote.buyer_name}</div>
                </div>
                <div>
                  <span className="font-bold text-gray-500 text-[10px] uppercase">Shipment Parameters:</span>
                  <div className="font-semibold text-gray-900 mt-1">Destination: {activePdfQuote.destination_port}</div>
                  <div className="text-gray-600 font-mono">Incoterms 2020: {activePdfQuote.incoterm}</div>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-900 text-gray-700">
                    <th className="py-2">Commodity Description</th>
                    <th className="py-2 text-right">Quantity</th>
                    <th className="py-2 text-right">Unit Price ({activePdfQuote.currency})</th>
                    <th className="py-2 text-right">Total ({activePdfQuote.currency})</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {activePdfQuote.items?.map((it: any, i: number) => (
                    <tr key={i}>
                      <td className="py-3">
                        <div className="font-bold">{it.product_name}</div>
                        {it.specifications_summary && (
                          <div className="text-[11px] text-gray-500">{it.specifications_summary}</div>
                        )}
                        {it.packaging && (
                          <div className="text-[10px] text-gray-400">Packaging: {it.packaging}</div>
                        )}
                      </td>
                      <td className="py-3 text-right font-mono">{it.quantity} {it.unit}</td>
                      <td className="py-3 text-right font-mono">${it.unit_price?.toLocaleString()}</td>
                      <td className="py-3 text-right font-mono font-bold">${it.total_price?.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div className="border-t pt-4 flex justify-end">
                <div className="w-64 space-y-1 text-right">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal:</span>
                    <span className="font-mono">${activePdfQuote.subtotal?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Ocean Freight & Marine Ins:</span>
                    <span className="font-mono">${activePdfQuote.insurance_and_freight?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-900 pt-2 font-bold text-sm text-[#0d2b1d]">
                    <span>Total CIF Amount:</span>
                    <span className="font-mono">${activePdfQuote.total_amount?.toLocaleString()} {activePdfQuote.currency}</span>
                  </div>
                </div>
              </div>

              {/* Terms */}
              <div className="p-4 bg-gray-50 rounded-lg text-[11px] text-gray-600 space-y-1">
                <div className="font-bold text-gray-800">Commercial Terms & Payment:</div>
                <p>{activePdfQuote.payment_terms}</p>
                <p>{activePdfQuote.terms_conditions}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
