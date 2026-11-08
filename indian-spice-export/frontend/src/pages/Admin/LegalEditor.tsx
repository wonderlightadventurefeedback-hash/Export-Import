import React, { useState, useEffect } from "react";
import { FileText, Save, CheckCircle2, History, AlertCircle, Eye } from "lucide-react";
import { adminApi } from "../../services/adminApi";
import { useAdminAuth } from "../../context/AdminAuthContext";

export const AdminLegalEditor: React.FC = () => {
  const { canEditContent } = useAdminAuth();
  const [selectedDoc, setSelectedDoc] = useState<"privacy" | "terms">("privacy");
  const [content, setContent] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [version, setVersion] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchDocument(selectedDoc);
  }, [selectedDoc]);

  const fetchDocument = async (docKey: "privacy" | "terms") => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const blockKey = docKey === "privacy" ? "legal_privacy" : "legal_terms";
      const blocks = await adminApi.getContentBlocks({ block_key: blockKey });
      const current = blocks && blocks.length > 0 ? blocks[0] : null;

      if (current) {
        setTitle(current.data?.title || (docKey === "privacy" ? "Privacy Policy & GDPR Compliance" : "Terms of International Trade & Export"));
        setContent(current.data?.body || "");
        setLastUpdated(current.updated_at || new Date().toISOString());
        setVersion(current.version || 1);
      } else {
        // Defaults
        if (docKey === "privacy") {
          setTitle("Privacy Policy & Global Data Protection");
          setContent(`# Privacy Policy\n\n**Effective Date:** 1st January 2026\n\n## 1. Information We Collect\nIndian Spice Export collects business contact credentials, inquiries, Incoterm preferences, and commercial trade communications strictly for the purpose of fulfilling international wholesale export transactions.\n\n## 2. GDPR and Cross-Border Transfers\nBuyer contact details and port delivery instructions are processed with encrypted transport under international security protocols. We never resell commercial buyer inquiries to third parties.\n\n## 3. Data Retention\nTrade records, phytosanitary certifications, and customs declarations are retained in accordance with the Foreign Trade (Development and Regulation) Act and GST regulations.`);
        } else {
          setTitle("Standard Terms of Export & International Trade");
          setContent(`# Standard Terms of Trade & Sale\n\n**Incoterms Standard:** ICC Incoterms® 2020\n\n## 1. Quotation & Pricing\nAll quotations are denominated in USD unless explicitly contracted otherwise. Pricing is valid for 14 calendar days from issuance due to seasonal commodity market index fluctuations.\n\n## 2. Quality & Certification\nEach consignment is dispatched with a Government of India Spices Board Certificate of Export, Phytosanitary Certificate issued by Directorate of Plant Protection, Quarantine & Storage, and SGS/Bureau Veritas inspection report where contracted.\n\n## 3. Payment Terms\nStandard international orders are executed against Irrevocable Confirmed Letter of Credit at Sight (L/C) or 30% Advance T/T with 70% against Scanned Bill of Lading (B/L) copy.`);
        }
        setLastUpdated(new Date().toISOString());
        setVersion(1);
      }
    } catch (err: any) {
      console.error("Failed to load legal document:", err);
      setErrorMessage("Could not load legal document.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!canEditContent) return;
    setIsSaving(true);
    setSaveSuccess(false);
    setErrorMessage(null);
    try {
      const blockKey = selectedDoc === "privacy" ? "legal_privacy" : "legal_terms";
      await adminApi.saveContentBlock({
        page_key: "legal",
        block_key: blockKey,
        data: {
          title,
          body: content,
          lastUpdated: new Date().toISOString(),
        },
        status: "published",
      });
      setVersion((prev) => prev + 1);
      setLastUpdated(new Date().toISOString());
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to save legal policy");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-charcoal-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-forest-700" />
            Legal & Trade Disclosures
          </h1>
          <p className="font-sans text-sm text-charcoal-500">
            Maintain international terms of export, Incoterms conditions, and GDPR compliance policies.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={!canEditContent || isSaving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-forest-800 text-gold-300 font-sans font-semibold text-sm rounded-lg hover:bg-forest-900 transition-colors shadow-sm disabled:opacity-50"
        >
          {isSaving ? (
            <div className="w-4 h-4 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>Publish Version v{version + 1}</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-lg flex items-center gap-2 text-sm font-sans">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Legal document updated and live version recorded.</span>
        </div>
      )}

      {errorMessage && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-lg flex items-center gap-2 text-sm font-sans">
          <AlertCircle className="w-4 h-4 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-ivory-300 gap-2">
        <button
          onClick={() => setSelectedDoc("privacy")}
          className={`px-4 py-2.5 text-sm font-sans font-medium border-b-2 transition-colors ${
            selectedDoc === "privacy"
              ? "border-forest-700 text-forest-900 bg-ivory-100/60 rounded-t-lg"
              : "border-transparent text-charcoal-500 hover:text-charcoal-800"
          }`}
        >
          Privacy Policy & GDPR
        </button>
        <button
          onClick={() => setSelectedDoc("terms")}
          className={`px-4 py-2.5 text-sm font-sans font-medium border-b-2 transition-colors ${
            selectedDoc === "terms"
              ? "border-forest-700 text-forest-900 bg-ivory-100/60 rounded-t-lg"
              : "border-transparent text-charcoal-500 hover:text-charcoal-800"
          }`}
        >
          Terms of International Trade
        </button>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-charcoal-400">Loading document...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white border border-ivory-300 rounded-xl p-5 shadow-sm space-y-4">
              <div>
                <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                  Document Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-ivory-50 border border-ivory-300 rounded-lg text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-600 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                  Content (Markdown Supported)
                </label>
                <textarea
                  rows={16}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-ivory-50 border border-ivory-300 rounded-lg text-sm font-mono text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-600 leading-relaxed"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white border border-ivory-300 rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="font-serif text-base font-bold text-charcoal-900 flex items-center gap-2">
                <History className="w-4 h-4 text-forest-700" />
                Revision Control
              </h3>

              <div className="text-xs space-y-2 text-charcoal-600 bg-ivory-50 p-3 rounded-lg border border-ivory-200">
                <div className="flex justify-between">
                  <span className="text-charcoal-400">Current Revision:</span>
                  <span className="font-mono font-bold text-forest-800">Version {version}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal-400">Last Modified:</span>
                  <span className="font-mono">{new Date(lastUpdated).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal-400">Status:</span>
                  <span className="text-emerald-700 font-semibold">Live on Storefront</span>
                </div>
              </div>

              <div className="pt-2">
                <p className="text-xs text-charcoal-500 leading-normal">
                  All updates are timestamped in accordance with statutory Spices Board and global export transparency standards.
                </p>
              </div>

              <a
                href={selectedDoc === "privacy" ? "/privacy" : "/terms"}
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 border border-ivory-300 rounded-lg text-xs font-semibold text-charcoal-700 hover:bg-ivory-100 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Public Page</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminLegalEditor;