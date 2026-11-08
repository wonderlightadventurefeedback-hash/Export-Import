import React, { useState, useEffect } from "react";
import { Mail, MessageSquare, Send, Save, CheckCircle2, AlertCircle, Copy } from "lucide-react";
import { adminApi } from "../../services/adminApi";
import { useAdminAuth } from "../../context/AdminAuthContext";

export const AdminTemplatesManager: React.FC = () => {
  const { canEditContent } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<"email" | "whatsapp">("email");
  const [templates, setTemplates] = useState<any>(null);
  const [selectedTemplateKey, setSelectedTemplateKey] = useState<string>("enquiry_acknowledgement");
  const [testEmail, setTestEmail] = useState<string>("trade-desk@indianspiceexport.com");
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testSuccess, setTestSuccess] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const data = await adminApi.getTemplates();
      setTemplates(data);
    } catch (err: any) {
      console.error("Failed to load templates:", err);
      setErrorMessage("Could not load communication templates.");
    }
  };

  const currentTemplate = templates?.[activeTab]?.[selectedTemplateKey] || {
    subject: "",
    body: "",
    variables: ["buyerName", "referenceNumber", "items", "destinationPort"],
  };

  const handleUpdate = (field: string, val: string) => {
    setTemplates((prev: any) => ({
      ...prev,
      [activeTab]: {
        ...(prev?.[activeTab] || {}),
        [selectedTemplateKey]: {
          ...(prev?.[activeTab]?.[selectedTemplateKey] || {}),
          [field]: val,
        },
      },
    }));
  };

  const handleSave = async () => {
    if (!canEditContent) return;
    setIsSaving(true);
    setSaveSuccess(false);
    setErrorMessage(null);
    try {
      await adminApi.updateTemplate(activeTab, selectedTemplateKey, currentTemplate);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to update template");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendTest = async () => {
    if (!testEmail) return;
    setIsSendingTest(true);
    setTestSuccess(null);
    setErrorMessage(null);
    try {
      await adminApi.testSendTemplate(testEmail, selectedTemplateKey);
      setTestSuccess(`Test dispatch sent successfully to ${testEmail}`);
      setTimeout(() => setTestSuccess(null), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || "Test dispatch failed.");
    } finally {
      setIsSendingTest(false);
    }
  };

  const templateList = activeTab === "email" ? [
    { key: "enquiry_acknowledgement", name: "Buyer Inquiry Acknowledgment" },
    { key: "admin_notification", name: "Internal Trade Desk Alert" },
    { key: "quotation_dispatch", name: "Proforma Quotation Transmittal" },
  ] : [
    { key: "whatsapp_inquiry_reply", name: "Direct WhatsApp Inquiry Reply" },
    { key: "whatsapp_quote_ready", name: "Quotation Ready Notification" },
    { key: "whatsapp_desk_contact", name: "Trade Desk Direct Connect" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-charcoal-900 flex items-center gap-2">
            <Mail className="w-6 h-6 text-forest-700" />
            Communication & Notification Templates
          </h1>
          <p className="font-sans text-sm text-charcoal-500">
            Customize automated email notifications and WhatsApp message templates sent to international buyers.
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
          <span>Save Template</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-lg flex items-center gap-2 text-sm font-sans">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Template updated successfully.</span>
        </div>
      )}

      {testSuccess && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg flex items-center gap-2 text-sm font-sans">
          <CheckCircle2 className="w-4 h-4 text-blue-600" />
          <span>{testSuccess}</span>
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
          onClick={() => {
            setActiveTab("email");
            setSelectedTemplateKey("enquiry_acknowledgement");
          }}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-sans font-medium border-b-2 transition-colors ${
            activeTab === "email"
              ? "border-forest-700 text-forest-900 bg-ivory-100/60 rounded-t-lg"
              : "border-transparent text-charcoal-500 hover:text-charcoal-800"
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Email Templates</span>
        </button>
        <button
          onClick={() => {
            setActiveTab("whatsapp");
            setSelectedTemplateKey("whatsapp_inquiry_reply");
          }}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-sans font-medium border-b-2 transition-colors ${
            activeTab === "whatsapp"
              ? "border-forest-700 text-forest-900 bg-ivory-100/60 rounded-t-lg"
              : "border-transparent text-charcoal-500 hover:text-charcoal-800"
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>WhatsApp Messages</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Template Selector List */}
        <div className="lg:col-span-1 bg-white border border-ivory-300 rounded-xl p-3 shadow-sm space-y-1">
          <p className="px-3 py-2 text-xs font-bold text-charcoal-400 uppercase tracking-wider">Templates</p>
          {templateList.map((t) => (
            <button
              key={t.key}
              onClick={() => setSelectedTemplateKey(t.key)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-sans font-medium transition-colors ${
                selectedTemplateKey === t.key
                  ? "bg-forest-800 text-gold-300 font-semibold"
                  : "text-charcoal-700 hover:bg-ivory-100"
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>

        {/* Template Form */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white border border-ivory-300 rounded-xl p-6 shadow-sm space-y-5">
            {activeTab === "email" && (
              <div>
                <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                  Email Subject Line
                </label>
                <input
                  type="text"
                  value={currentTemplate.subject || ""}
                  onChange={(e) => handleUpdate("subject", e.target.value)}
                  placeholder="Indian Spice Export - Confirmation for Inquiry {{referenceNumber}}"
                  className="w-full px-3.5 py-2.5 bg-ivory-50 border border-ivory-300 rounded-lg text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
                />
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-charcoal-700 uppercase tracking-wider">
                  Template Body Text
                </label>
                <span className="text-xs text-charcoal-400">Use double braces for variables, e.g. {"{{buyerName}}"}</span>
              </div>
              <textarea
                rows={10}
                value={currentTemplate.body || ""}
                onChange={(e) => handleUpdate("body", e.target.value)}
                placeholder="Dear {{buyerName}},\n\nThank you for contacting Indian Spice Export regarding your requirement..."
                className="w-full px-3.5 py-2.5 bg-ivory-50 border border-ivory-300 rounded-lg text-sm font-mono text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-600 leading-relaxed"
              />
            </div>

            {/* Available Variables */}
            <div>
              <p className="text-xs font-bold text-charcoal-500 uppercase tracking-wider mb-2">
                Available Dynamic Variables
              </p>
              <div className="flex flex-wrap gap-2">
                {["{{buyerName}}", "{{referenceNumber}}", "{{companyName}}", "{{destinationPort}}", "{{totalAmount}}", "{{incoterm}}", "{{validityDate}}"].map((variable) => (
                  <button
                    key={variable}
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(variable);
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-ivory-100 hover:bg-ivory-200 border border-ivory-300 rounded text-xs font-mono text-charcoal-700"
                    title="Click to copy"
                  >
                    <span>{variable}</span>
                    <Copy className="w-3 h-3 text-charcoal-400" />
                  </button>
                ))}
              </div>
            </div>

            {/* Test Send Section (for Email) */}
            {activeTab === "email" && (
              <div className="pt-5 border-t border-ivory-200">
                <h4 className="text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-2">
                  Send Test Email
                </h4>
                <div className="flex items-center gap-3">
                  <input
                    type="email"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    placeholder="recipient@example.com"
                    className="flex-1 max-w-sm px-3.5 py-2 bg-ivory-50 border border-ivory-300 rounded-lg text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
                  />
                  <button
                    onClick={handleSendTest}
                    disabled={isSendingTest}
                    className="inline-flex items-center gap-1.5 px-4 py-2 border border-ivory-300 bg-white text-charcoal-700 hover:bg-ivory-100 rounded-lg text-xs font-semibold shadow-sm disabled:opacity-50"
                  >
                    <Send className={`w-3.5 h-3.5 ${isSendingTest ? "animate-spin" : ""}`} />
                    <span>Send Test</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdminTemplatesManager;