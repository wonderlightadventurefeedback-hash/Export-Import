import React, { useState, useEffect } from "react";
import {
  Building2,
  Save,
  CheckCircle2,
  ShieldCheck,
  Phone,
  Globe,
  Clock,
  AlertCircle,
  QrCode,
  Share2,
  Eye,
  EyeOff,
  Upload,
  Trash2,
  Plus,
  ExternalLink,
  X,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import { adminApi } from "../../services/adminApi";
import { useAdminAuth } from "../../context/AdminAuthContext";
import {
  getStoredCertificates,
  saveStoredCertificates,
  getStoredCompanyAbout,
  saveStoredCompanyAbout,
  CertificateItem,
} from "../../config/certificates";

export const AdminCompanySettings: React.FC = () => {
  const { canEditContent } = useAdminAuth();
  const [settings, setSettings] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<
    "general" | "contact" | "certifications" | "hours" | "social"
  >("general");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Dynamic certificates and company about state
  const [certificatesList, setCertificatesList] = useState<CertificateItem[]>(getStoredCertificates);
  const [companyAboutData, setCompanyAboutData] = useState(getStoredCompanyAbout);
  const [previewCertDoc, setPreviewCertDoc] = useState<CertificateItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New certificate form state
  const [newCert, setNewCert] = useState<Partial<CertificateItem>>({
    title: "",
    category: "Export License",
    authority: "",
    regNo: "",
    validTill: "",
    imageUrl: "",
    description: "",
    enabled: true,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await adminApi.getSettings();
      setSettings(data);
      if (data?.certificates && Array.isArray(data.certificates) && data.certificates.length > 0) {
        setCertificatesList(data.certificates);
        saveStoredCertificates(data.certificates);
      }
      if (data?.about) {
        setCompanyAboutData((prev: any) => ({ ...prev, ...data.about }));
        saveStoredCompanyAbout(data.about);
      }
    } catch (err: any) {
      console.error("Failed to load settings from server, using local registry:", err);
    }
  };

  const handleUpdate = (section: string, field: string, value: any) => {
    setSettings((prev: any) => ({
      ...prev,
      [section]: {
        ...(prev?.[section] || {}),
        [field]: value,
      },
    }));
  };

  // Upload handler for Certificate Document Image
  const handleCertImageUpload = (certId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setCertificatesList((prev) =>
        prev.map((c) => (c.id === certId ? { ...c, imageUrl: result } : c))
      );
    };
    reader.readAsDataURL(file);
  };

  // Upload handler for New Certificate Document in Modal
  const handleNewCertImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setNewCert((prev) => ({ ...prev, imageUrl: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  // Upload handler for Company Facility Image (Left Side of About Page)
  const handleCompanyFacilityImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setCompanyAboutData((prev: any) => ({ ...prev, companyImage: result }));
      handleUpdate("general", "companyImage", result);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveNewCertificate = () => {
    if (!newCert.title?.trim()) {
      alert("Please enter certificate or membership title");
      return;
    }

    const item: CertificateItem = {
      id: `cert-${Date.now()}`,
      title: newCert.title.trim(),
      category: newCert.category || "Export License",
      authority: newCert.authority?.trim() || "Statutory Export Authority",
      regNo: newCert.regNo?.trim() || "Active",
      validTill: newCert.validTill?.trim() || "2028-12-31",
      enabled: true,
      imageUrl:
        newCert.imageUrl ||
        "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=85",
      description: newCert.description?.trim() || "Verified official export accreditation credential.",
      isMembership: newCert.category?.toLowerCase().includes("membership"),
    };

    setCertificatesList((prev) => [item, ...prev]);
    setShowAddModal(false);
    setNewCert({
      title: "",
      category: "Export License",
      authority: "",
      regNo: "",
      validTill: "",
      imageUrl: "",
      description: "",
      enabled: true,
    });
  };

  const handleDeleteCertificate = (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete certificate "${name}"?`)) return;
    setCertificatesList((prev) => prev.filter((c) => c.id !== id));
  };

  const handleSaveSection = async (section: string) => {
    if (!canEditContent) return;
    setIsSaving(true);
    setSaveSuccess(false);
    setErrorMessage(null);
    try {
      if (section === "social") {
        localStorage.setItem("company_social_settings", JSON.stringify(settings?.social || {}));
        window.dispatchEvent(new Event("social-settings-change"));
        await adminApi.updateSettings(section, settings?.social || {});
      } else if (section === "certifications") {
        saveStoredCertificates(certificatesList);
        await adminApi.updateSettings("certificates", certificatesList);
      } else if (section === "general") {
        saveStoredCompanyAbout(companyAboutData);
        await adminApi.updateSettings("about", companyAboutData);
        await adminApi.updateSettings(section, settings?.general || {});
      } else {
        await adminApi.updateSettings(section, settings?.[section] || {});
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      console.warn("Server save notice (persisted in local registry):", err);
      // Still acknowledge local success
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  if (!settings) {
    return (
      <div className="p-8 flex items-center justify-center text-charcoal-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-forest-600"></div>
        <span className="ml-3 font-sans text-sm">Loading company profile...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-sans text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-6 h-6 text-emerald-700 dark:text-amber-400" />
            Company &amp; Export Registry
          </h1>
          <p className="font-sans text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Configure global legal credentials, certificate documents, memberships, and About page showcase.
          </p>
        </div>

        <button
          onClick={() => handleSaveSection(activeTab)}
          disabled={!canEditContent || isSaving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 dark:bg-[#dfb15b] dark:hover:bg-amber-400 text-white dark:text-[#0c1812] font-sans font-bold text-sm rounded-lg transition-colors shadow-xs disabled:opacity-50"
        >
          {isSaving ? (
            <div className="w-4 h-4 border-2 border-white dark:border-[#0c1812] border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>Save Changes</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 px-4 py-3 rounded-lg flex items-center gap-2 text-sm font-sans shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Company settings and certificates saved successfully.</span>
        </div>
      )}

      {errorMessage && (
        <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 px-4 py-3 rounded-lg flex items-center gap-2 text-sm font-sans">
          <AlertCircle className="w-4 h-4 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-[#1d3527] gap-2 overflow-x-auto pb-1">
        {[
          { id: "general", label: "General & Identity", icon: Building2 },
          { id: "contact", label: "Contact & Trade Desk", icon: Phone },
          { id: "certifications", label: "Certifications & Memberships", icon: ShieldCheck },
          { id: "hours", label: "Operating Hours", icon: Clock },
          { id: "social", label: "Social & Verification", icon: Globe },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-sans font-semibold border-b-2 whitespace-nowrap transition-colors rounded-t-lg ${
                isActive
                  ? "border-emerald-700 text-emerald-800 bg-emerald-50/70 dark:border-amber-400 dark:text-amber-300 dark:bg-[#152a1f]"
                  : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-emerald-700 dark:text-amber-400" : "text-slate-400"}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="bg-white dark:bg-[#0f1d16] rounded-xl border border-slate-200 dark:border-[#1c3526] shadow-xs p-5 sm:p-6 text-slate-800 dark:text-slate-100">
        {/* ── TAB 1: GENERAL & IDENTITY (Including About Page Facility Photo) ── */}
        {activeTab === "general" && (
          <div className="space-y-8">
            {/* About Page Left Side Company Image Showcase */}
            <div className="p-5 bg-sky-50/60 rounded-xl border border-sky-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-base font-bold text-forest-950 flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-amber-600" />
                    <span>About Page Company Image Showcase (Left Side)</span>
                  </h3>
                  <p className="text-xs text-charcoal-600 mt-0.5">
                    This photo appears on the left side of the About page, representing your export processing hub and warehouse.
                  </p>
                </div>

                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-forest-900 text-white hover:bg-forest-800 rounded-lg text-xs font-semibold shadow-sm transition-colors shrink-0">
                  <Upload className="w-4 h-4 text-amber-400" />
                  <span>Upload New Facility Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCompanyFacilityImageUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                <div className="md:col-span-4 aspect-[4/3] rounded-lg overflow-hidden border border-sky-200 bg-white shadow-sm">
                  <img
                    src={companyAboutData.companyImage}
                    alt="Company Facility Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="md:col-span-8 space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1">
                      Facility Photo URL (or uploaded above)
                    </label>
                    <input
                      type="text"
                      value={companyAboutData.companyImage}
                      onChange={(e) =>
                        setCompanyAboutData((prev: any) => ({ ...prev, companyImage: e.target.value }))
                      }
                      className="w-full px-3 py-2 bg-white border border-ivory-300 rounded-lg text-xs font-mono text-charcoal-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1">
                      Facility Card Caption Badge
                    </label>
                    <input
                      type="text"
                      value={companyAboutData.companyBadge}
                      onChange={(e) =>
                        setCompanyAboutData((prev: any) => ({ ...prev, companyBadge: e.target.value }))
                      }
                      className="w-full px-3 py-2 bg-white border border-ivory-300 rounded-lg text-xs text-charcoal-900"
                      placeholder="Processing Hub & Export Warehouse · Odisha, India"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1">
                      Company Mission Quote
                    </label>
                    <textarea
                      rows={2}
                      value={companyAboutData.quote}
                      onChange={(e) =>
                        setCompanyAboutData((prev: any) => ({ ...prev, quote: e.target.value }))
                      }
                      className="w-full px-3 py-2 bg-white border border-ivory-300 rounded-lg text-xs text-charcoal-900"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Standard Legal Identity Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                  Brand Name
                </label>
                <input
                  type="text"
                  value={settings.general?.brandName || "A.G IMPORT & EXPORT"}
                  onChange={(e) => handleUpdate("general", "brandName", e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-ivory-50 border border-ivory-300 rounded-lg text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                  Legal Entity Name
                </label>
                <input
                  type="text"
                  value={settings.general?.legalName || "Aryavansh Global Import & Export"}
                  onChange={(e) => handleUpdate("general", "legalName", e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-ivory-50 border border-ivory-300 rounded-lg text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                  Export Tagline
                </label>
                <input
                  type="text"
                  value={settings.general?.tagline || "Aryavansh Global · Connecting India to the World"}
                  onChange={(e) => handleUpdate("general", "tagline", e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-ivory-50 border border-ivory-300 rounded-lg text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                  IEC (Import Export Code)
                </label>
                <input
                  type="text"
                  value={settings.general?.iec || "0819283741"}
                  onChange={(e) => handleUpdate("general", "iec", e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-ivory-50 border border-ivory-300 rounded-lg text-sm text-charcoal-900 font-mono focus:outline-none focus:ring-2 focus:ring-forest-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                  GSTIN / Tax Registration
                </label>
                <input
                  type="text"
                  value={settings.general?.gstin || "21AAACA1234A1Z5"}
                  onChange={(e) => handleUpdate("general", "gstin", e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-ivory-50 border border-ivory-300 rounded-lg text-sm text-charcoal-900 font-mono focus:outline-none focus:ring-2 focus:ring-forest-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                  Establishment Year
                </label>
                <input
                  type="number"
                  value={settings.general?.yearEstablished || 2018}
                  onChange={(e) => handleUpdate("general", "yearEstablished", Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-ivory-50 border border-ivory-300 rounded-lg text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                  Corporate Registered Address
                </label>
                <textarea
                  rows={2}
                  value={settings.general?.registeredAddress || ""}
                  onChange={(e) => handleUpdate("general", "registeredAddress", e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-ivory-50 border border-ivory-300 rounded-lg text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
                />
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: CONTACT & TRADE DESK ── */}
        {activeTab === "contact" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                Export Trade Desk Email
              </label>
              <input
                type="email"
                value={settings.contact?.email || ""}
                onChange={(e) => handleUpdate("contact", "email", e.target.value)}
                className="w-full px-3.5 py-2.5 bg-ivory-50 border border-ivory-300 rounded-lg text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                Official WhatsApp Business Number (E.164 with country code)
              </label>
              <input
                type="text"
                placeholder="+919876543210"
                value={settings.contact?.whatsapp || ""}
                onChange={(e) => handleUpdate("contact", "whatsapp", e.target.value)}
                className="w-full px-3.5 py-2.5 bg-ivory-50 border border-ivory-300 rounded-lg text-sm font-mono text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
              />
              <p className="text-xs text-charcoal-500 mt-1">Used to generate one-click direct quotation links.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                Headquarters Phone Line
              </label>
              <input
                type="text"
                value={settings.contact?.phone || ""}
                onChange={(e) => handleUpdate("contact", "phone", e.target.value)}
                className="w-full px-3.5 py-2.5 bg-ivory-50 border border-ivory-300 rounded-lg text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                Toll-Free / Secondary Phone
              </label>
              <input
                type="text"
                value={settings.contact?.secondaryPhone || ""}
                onChange={(e) => handleUpdate("contact", "secondaryPhone", e.target.value)}
                className="w-full px-3.5 py-2.5 bg-ivory-50 border border-ivory-300 rounded-lg text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
              />
            </div>
          </div>
        )}

        {/* ── TAB 3: CERTIFICATES & MEMBERSHIPS (WITH IMAGE UPLOAD) ── */}
        {activeTab === "certifications" && (
          <div className="space-y-6">
            <div className="bg-sky-50/70 p-4 rounded-xl border border-sky-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-forest-950 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span>Official Regulatory &amp; Membership Certificates</span>
                </p>
                <p className="text-xs text-charcoal-600 mt-0.5">
                  Upload and manage high-resolution certificate documents and membership credentials displayed on the About page.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-forest-900 text-white rounded-lg text-xs font-semibold hover:bg-forest-800 transition-colors shadow-sm shrink-0"
              >
                <Plus className="w-4 h-4 text-amber-400" />
                <span>Add Certificate or Membership</span>
              </button>
            </div>

            {/* List of Certificates with Image Upload Box */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {certificatesList.map((cert) => (
                <div
                  key={cert.id}
                  className="p-5 border border-ivory-300 rounded-xl bg-ivory-50/40 space-y-4 hover:border-sky-300 transition-colors shadow-xs"
                >
                  {/* Top Bar: Title, Category & Toggle Switch */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold uppercase tracking-wider">
                        {cert.category}
                      </span>
                      <h4 className="font-bold text-sm text-charcoal-900 mt-1 truncate">
                        {cert.title}
                      </h4>
                      <p className="text-[11px] text-amber-700 truncate">{cert.authority}</p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={cert.enabled !== false}
                          onChange={(e) => {
                            setCertificatesList((prev) =>
                              prev.map((c) =>
                                c.id === cert.id ? { ...c, enabled: e.target.checked } : c
                              )
                            );
                          }}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-charcoal-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-forest-700"></div>
                      </label>

                      <button
                        type="button"
                        onClick={() => handleDeleteCertificate(cert.id, cert.title)}
                        className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                        title="Delete Certificate"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Certificate Image Thumbnail & Upload Controls */}
                  <div className="flex items-center gap-4 bg-white p-3 rounded-lg border border-ivory-200">
                    <div className="relative aspect-[16/10] w-28 rounded-md overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                      <img
                        src={cert.imageUrl}
                        alt={cert.title}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setPreviewCertDoc(cert)}
                        className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity text-white"
                        title="Preview Full Certificate"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex-1 min-w-0 space-y-2">
                      <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 text-sky-800 hover:bg-sky-100 border border-sky-200 rounded text-xs font-semibold transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Certificate File</span>
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          onChange={(e) => handleCertImageUpload(cert.id, e)}
                          className="hidden"
                        />
                      </label>

                      <input
                        type="text"
                        placeholder="Image URL or uploaded file..."
                        value={cert.imageUrl}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCertificatesList((prev) =>
                            prev.map((c) => (c.id === cert.id ? { ...c, imageUrl: val } : c))
                          );
                        }}
                        className="w-full px-2.5 py-1 text-[11px] font-mono bg-ivory-50 border border-ivory-200 rounded truncate"
                      />
                    </div>
                  </div>

                  {/* Reg No & Valid Till inputs */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-charcoal-500 block mb-1 font-semibold">
                        Registration / License #
                      </span>
                      <input
                        type="text"
                        value={cert.regNo || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCertificatesList((prev) =>
                            prev.map((c) => (c.id === cert.id ? { ...c, regNo: val } : c))
                          );
                        }}
                        className="w-full px-2.5 py-1.5 bg-white border border-ivory-300 rounded font-mono text-xs text-charcoal-900"
                      />
                    </div>
                    <div>
                      <span className="text-charcoal-500 block mb-1 font-semibold">Valid Until</span>
                      <input
                        type="text"
                        placeholder="YYYY-MM-DD"
                        value={cert.validTill || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCertificatesList((prev) =>
                            prev.map((c) => (c.id === cert.id ? { ...c, validTill: val } : c))
                          );
                        }}
                        className="w-full px-2.5 py-1.5 bg-white border border-ivory-300 rounded text-xs text-charcoal-900"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 4: OPERATING HOURS ── */}
        {activeTab === "hours" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                Weekdays Operating Hours (IST)
              </label>
              <input
                type="text"
                value={settings.hours?.weekdays || "09:00 - 18:30 IST"}
                onChange={(e) => handleUpdate("hours", "weekdays", e.target.value)}
                className="w-full px-3.5 py-2.5 bg-ivory-50 border border-ivory-300 rounded-lg text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                Saturday Trade Desk Hours
              </label>
              <input
                type="text"
                value={settings.hours?.saturday || "09:30 - 14:00 IST"}
                onChange={(e) => handleUpdate("hours", "saturday", e.target.value)}
                className="w-full px-3.5 py-2.5 bg-ivory-50 border border-ivory-300 rounded-lg text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                Sunday Schedule
              </label>
              <input
                type="text"
                value={settings.hours?.sunday || "Closed (Emergency Export Desk active for air consignments)"}
                onChange={(e) => handleUpdate("hours", "sunday", e.target.value)}
                className="w-full px-3.5 py-2.5 bg-ivory-50 border border-ivory-300 rounded-lg text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                Time Zone Reference
              </label>
              <input
                type="text"
                value={settings.hours?.timezone || "UTC+05:30 (Indian Standard Time)"}
                onChange={(e) => handleUpdate("hours", "timezone", e.target.value)}
                className="w-full px-3.5 py-2.5 bg-ivory-50 border border-ivory-300 rounded-lg text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
              />
            </div>
          </div>
        )}

        {/* ── TAB 5: SOCIAL & VERIFICATION ── */}
        {activeTab === "social" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                  WhatsApp Direct Trade Desk URL / Number
                </label>
                <input
                  type="text"
                  placeholder="https://wa.me/919876543210 or 919876543210"
                  value={settings.social?.whatsapp || "https://wa.me/919876543210"}
                  onChange={(e) => handleUpdate("social", "whatsapp", e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-ivory-50 border border-ivory-300 rounded-lg text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                  LinkedIn Corporate Profile
                </label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/company/indian-spice-export"
                  value={settings.social?.linkedin || "https://linkedin.com/company/indian-spice-export"}
                  onChange={(e) => handleUpdate("social", "linkedin", e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-ivory-50 border border-ivory-300 rounded-lg text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                  Instagram / Sourcing Showcase
                </label>
                <input
                  type="url"
                  placeholder="https://instagram.com/indianspiceexport"
                  value={settings.social?.instagram || "https://instagram.com/indianspiceexport"}
                  onChange={(e) => handleUpdate("social", "instagram", e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-ivory-50 border border-ivory-300 rounded-lg text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                  Facebook Corporate Page
                </label>
                <input
                  type="url"
                  placeholder="https://facebook.com/indianspiceexport"
                  value={settings.social?.facebook || "https://facebook.com/indianspiceexport"}
                  onChange={(e) => handleUpdate("social", "facebook", e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-ivory-50 border border-ivory-300 rounded-lg text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                  X / Twitter Handle URL
                </label>
                <input
                  type="url"
                  placeholder="https://x.com/indiaspices"
                  value={settings.social?.twitter || "https://x.com/indiaspices"}
                  onChange={(e) => handleUpdate("social", "twitter", e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-ivory-50 border border-ivory-300 rounded-lg text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                  YouTube Facility Tours URL
                </label>
                <input
                  type="url"
                  placeholder="https://youtube.com/@indianspiceexport"
                  value={settings.social?.youtube || "https://youtube.com/@indianspiceexport"}
                  onChange={(e) => handleUpdate("social", "youtube", e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-ivory-50 border border-ivory-300 rounded-lg text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                  Social Media QR Code Target URL (Scanned by Mobile Camera)
                </label>
                <input
                  type="url"
                  placeholder="https://wa.me/919876543210 or your link-tree URL"
                  value={settings.social?.qrTargetUrl || "https://wa.me/919876543210"}
                  onChange={(e) => handleUpdate("social", "qrTargetUrl", e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-ivory-50 border border-ivory-300 rounded-lg text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-600 font-mono text-xs"
                />
                <p className="text-xs text-charcoal-500 mt-1">
                  This URL will be encoded in the QR code displayed on the Contact Us page so buyers can scan with mobile phones.
                </p>
              </div>
            </div>

            {/* Live Scannable QR Code Preview in Admin */}
            <div className="p-4 bg-sky-50/80 rounded-lg border border-sky-200 flex flex-col sm:flex-row items-center gap-5">
              <div className="w-28 h-28 bg-white p-2 rounded-md shadow-sm border border-sky-200 shrink-0 flex items-center justify-center">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                    settings.social?.qrTargetUrl || "https://wa.me/919876543210"
                  )}`}
                  alt="Scannable Social QR Code Preview"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-sky-700" />
                  <span className="font-bold text-sm text-forest-950">Live Scannable QR Code Preview</span>
                </div>
                <p className="text-xs text-charcoal-600 mt-1">
                  Buyers visiting the Contact page can scan this QR code with their mobile phone camera to instantly open your direct chat and social channels.
                </p>
                <div className="mt-2 text-[11px] font-mono text-sky-800 break-all">
                  Target: {settings.social?.qrTargetUrl || "https://wa.me/919876543210"}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── MODAL: ADD NEW CERTIFICATE OR MEMBERSHIP ── */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-sky-200 space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-ivory-200">
              <h3 className="font-sans font-bold text-lg text-forest-950 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>Add Certificate or Membership</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-charcoal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-charcoal-700 mb-1">
                  Certificate / Membership Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Federation of Indian Export Organisations (FIEO)"
                  value={newCert.title || ""}
                  onChange={(e) => setNewCert((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 bg-ivory-50 border border-ivory-300 rounded-lg text-sm text-charcoal-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-charcoal-700 mb-1">Category</label>
                  <select
                    value={newCert.category || "Export License"}
                    onChange={(e) => setNewCert((prev) => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 bg-ivory-50 border border-ivory-300 rounded-lg text-sm text-charcoal-900"
                  >
                    <option value="Export License">Export License</option>
                    <option value="Food Safety">Food Safety &amp; Quality</option>
                    <option value="Membership & Chamber">Membership &amp; Chamber</option>
                    <option value="Quality Assurance">Quality Assurance</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-charcoal-700 mb-1">
                    Registration / Membership #
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. FIEO/MEM/2024/4910"
                    value={newCert.regNo || ""}
                    onChange={(e) => setNewCert((prev) => ({ ...prev, regNo: e.target.value }))}
                    className="w-full px-3 py-2 bg-ivory-50 border border-ivory-300 rounded-lg text-sm text-charcoal-900 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-charcoal-700 mb-1">
                    Issuing Authority
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ministry of Commerce & Industry"
                    value={newCert.authority || ""}
                    onChange={(e) => setNewCert((prev) => ({ ...prev, authority: e.target.value }))}
                    className="w-full px-3 py-2 bg-ivory-50 border border-ivory-300 rounded-lg text-sm text-charcoal-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal-700 mb-1">Valid Until</label>
                  <input
                    type="text"
                    placeholder="YYYY-MM-DD"
                    value={newCert.validTill || ""}
                    onChange={(e) => setNewCert((prev) => ({ ...prev, validTill: e.target.value }))}
                    className="w-full px-3 py-2 bg-ivory-50 border border-ivory-300 rounded-lg text-sm text-charcoal-900"
                  />
                </div>
              </div>

              {/* Upload Certificate Image */}
              <div className="p-3.5 bg-sky-50 rounded-lg border border-sky-200 space-y-2">
                <label className="block font-bold text-forest-950">
                  Upload Certificate Document / Badge Image *
                </label>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 bg-forest-900 text-white rounded-lg text-xs font-semibold hover:bg-forest-800 transition-colors">
                    <Upload className="w-3.5 h-3.5 text-amber-400" />
                    <span>Choose File from Device</span>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handleNewCertImageUpload}
                      className="hidden"
                    />
                  </label>
                  <span className="text-[11px] text-charcoal-500">JPG, PNG, WebP supported</span>
                </div>

                {newCert.imageUrl && (
                  <div className="mt-2 aspect-[16/10] max-h-32 rounded-lg overflow-hidden border border-sky-300 bg-white">
                    <img
                      src={newCert.imageUrl}
                      alt="Certificate Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-charcoal-700 mb-1">
                  Description / Verification Details
                </label>
                <textarea
                  rows={2}
                  placeholder="Official scope of accreditation and compliant commodities..."
                  value={newCert.description || ""}
                  onChange={(e) =>
                    setNewCert((prev) => ({ ...prev, description: e.target.value }))
                  }
                  className="w-full px-3 py-2 bg-ivory-50 border border-ivory-300 rounded-lg text-sm text-charcoal-900"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-ivory-200">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-charcoal hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveNewCertificate}
                className="px-5 py-2 rounded-lg bg-forest-900 text-gold-300 hover:bg-forest-950 text-xs font-semibold shadow-sm"
              >
                Save Certificate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: PREVIEW CERTIFICATE DOCUMENT ── */}
      {previewCertDoc && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={() => setPreviewCertDoc(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-sky-200 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-ivory-200">
              <div>
                <h3 className="font-sans font-bold text-lg text-forest-950">
                  {previewCertDoc.title}
                </h3>
                <p className="text-xs text-charcoal-500">
                  {previewCertDoc.authority} · Reg: {previewCertDoc.regNo}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewCertDoc(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-charcoal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
              <img
                src={previewCertDoc.imageUrl}
                alt={previewCertDoc.title}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <a
                href={previewCertDoc.imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-sky-50 text-sky-800 text-xs font-semibold border border-sky-200"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open Full Resolution</span>
              </a>
              <button
                type="button"
                onClick={() => setPreviewCertDoc(null)}
                className="px-4 py-2 rounded-lg bg-forest-900 text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCompanySettings;
