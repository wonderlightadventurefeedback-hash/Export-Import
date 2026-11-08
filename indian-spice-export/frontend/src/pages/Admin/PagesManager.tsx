import React, { useState, useEffect } from "react";
import {
  FileCheck,
  Save,
  CheckCircle2,
  Plus,
  Trash2,
  Edit2,
  Upload,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Building2,
  Users,
  ShieldCheck,
  HelpCircle,
  Home,
  Boxes,
  ExternalLink,
  X,
  Phone,
  Mail,
} from "lucide-react";
import { useAdminAuth } from "../../context/AdminAuthContext";
import {
  getStoredHomeSettings,
  saveStoredHomeSettings,
  HomePageSettings,
  getStoredCompanySettings,
  saveStoredCompanySettings,
  CompanySettingsData,
  getStoredKeyPeople,
  saveStoredKeyPeople,
  KeyPersonItem,
  getStoredServices,
  saveStoredServices,
  WholesaleServiceItem,
  getStoredFAQs,
  saveStoredFAQs,
  FAQItemData,
} from "../../config/siteContent";
import {
  getStoredCertificates,
  saveStoredCertificates,
  CertificateItem,
} from "../../config/certificates";

export const AdminPagesManager: React.FC = () => {
  const { canEditContent } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<
    "home" | "company" | "key-people" | "services" | "certifications" | "faqs"
  >("home");

  const [saveSuccess, setSaveSuccess] = useState(false);

  // States for all pages
  const [homeSettings, setHomeSettings] = useState<HomePageSettings>(getStoredHomeSettings);
  const [companySettings, setCompanySettings] = useState<CompanySettingsData>(getStoredCompanySettings);
  const [keyPeople, setKeyPeople] = useState<KeyPersonItem[]>(getStoredKeyPeople);
  const [services, setServices] = useState<WholesaleServiceItem[]>(getStoredServices);
  const [certifications, setCertifications] = useState<CertificateItem[]>(getStoredCertificates);
  const [faqs, setFaqs] = useState<FAQItemData[]>(getStoredFAQs);

  // Modal / Editing states
  const [editingPerson, setEditingPerson] = useState<KeyPersonItem | null>(null);
  const [editingService, setEditingService] = useState<WholesaleServiceItem | null>(null);
  const [editingFaq, setEditingFaq] = useState<FAQItemData | null>(null);
  const [editingCert, setEditingCert] = useState<CertificateItem | null>(null);

  const handleSaveAll = () => {
    if (!canEditContent) return;
    saveStoredHomeSettings(homeSettings);
    saveStoredCompanySettings(companySettings);
    saveStoredKeyPeople(keyPeople);
    saveStoredServices(services);
    saveStoredCertificates(certifications);
    saveStoredFAQs(faqs);

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Image Upload helper
  const handleFileUpload = (
    onSuccess: (dataUrl: string) => void,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      onSuccess(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-sans text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileCheck className="w-6 h-6 text-emerald-700 dark:text-amber-400" />
            Website Pages &amp; Content Control
          </h1>
          <p className="font-sans text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Control the content, images, staff, services, certificates, and FAQs across all website pages.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          disabled={!canEditContent}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 dark:bg-[#dfb15b] dark:hover:bg-amber-400 text-white dark:text-[#0c1812] font-sans font-bold text-sm rounded-lg transition-colors shadow-xs disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 px-4 py-3 rounded-lg flex items-center gap-2 text-sm font-sans shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>All page updates saved and published to the live site.</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-[#1d3527] gap-1 overflow-x-auto pb-1 text-xs sm:text-sm font-sans">
        {[
          { id: "home", label: "Home Page", icon: Home },
          { id: "company", label: "Company Profile", icon: Building2 },
          { id: "key-people", label: "Key People (Team)", icon: Users },
          { id: "services", label: "Wholesale Services", icon: Boxes },
          { id: "certifications", label: "Certifications", icon: ShieldCheck },
          { id: "faqs", label: "F & Q (FAQs)", icon: HelpCircle },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 font-semibold border-b-2 whitespace-nowrap transition-colors rounded-t-lg ${
                isActive
                  ? "border-emerald-700 text-emerald-800 bg-emerald-50/70 dark:border-amber-400 dark:text-amber-300 dark:bg-[#152a1f]"
                  : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-emerald-700 dark:text-amber-400" : "text-slate-400 dark:text-slate-500"}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="bg-white dark:bg-[#0f1d16] rounded-xl border border-slate-200 dark:border-[#1c3526] shadow-xs p-5 sm:p-6 text-slate-800 dark:text-slate-100">
        {/* ── 1. HOME PAGE CONTROL ── */}
        {activeTab === "home" && (
          <div className="space-y-6">
            <h3 className="font-sans font-bold text-base text-slate-900 dark:text-amber-300 border-b pb-2">
              Home Page Hero &amp; Trade Badges
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              <div className="md:col-span-2">
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Hero Eyebrow Badge</label>
                <input
                  type="text"
                  value={homeSettings.heroBadge}
                  onChange={(e) => setHomeSettings({ ...homeSettings, heroBadge: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#16271e] border border-slate-300 dark:border-[#274030] rounded-lg text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Hero Main Headline</label>
                <input
                  type="text"
                  value={homeSettings.heroTitle}
                  onChange={(e) => setHomeSettings({ ...homeSettings, heroTitle: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#16271e] border border-slate-300 dark:border-[#274030] rounded-lg text-sm text-slate-900 dark:text-white font-bold"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Hero Subtitle</label>
                <textarea
                  rows={2}
                  value={homeSettings.heroSubtitle}
                  onChange={(e) => setHomeSettings({ ...homeSettings, heroSubtitle: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#16271e] border border-slate-300 dark:border-[#274030] rounded-lg text-sm text-slate-900 dark:text-white"
                />
              </div>

              {/* Hero Page Transparency / Opacity Slider */}
              <div className="md:col-span-2 p-4 rounded-xl bg-slate-50 dark:bg-[#15271e] border border-slate-200 dark:border-[#243e2f]">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 text-xs block">
                      Hero Page Transparency &amp; Overlay
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Adjust transparency: Lower % increases transparency so background photos show through vibrantly.
                    </span>
                  </div>
                  <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800">
                    {homeSettings.heroOverlayOpacity ?? 35}% Overlay ({100 - (homeSettings.heroOverlayOpacity ?? 35)}% Transparent)
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="2"
                  value={homeSettings.heroOverlayOpacity ?? 35}
                  onChange={(e) =>
                    setHomeSettings({ ...homeSettings, heroOverlayOpacity: Number(e.target.value) })
                  }
                  className="w-full accent-emerald-600 dark:accent-amber-400 cursor-pointer"
                />
                <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 mt-1.5">
                  <span className="font-bold text-emerald-700 dark:text-amber-400">High Transparency (25%)</span>
                  <span className="font-bold text-emerald-700 dark:text-amber-400">Current (35%)</span>
                  <span>Balanced (60%)</span>
                  <span>Dark Solid (90%)</span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Stat 1 (e.g. 30+ Countries)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={homeSettings.stat1Number}
                    onChange={(e) => setHomeSettings({ ...homeSettings, stat1Number: e.target.value })}
                    className="w-24 px-3 py-2 bg-slate-50 dark:bg-[#16271e] border border-slate-300 dark:border-[#274030] rounded-lg text-sm font-bold text-slate-900 dark:text-amber-300"
                  />
                  <input
                    type="text"
                    value={homeSettings.stat1Label}
                    onChange={(e) => setHomeSettings({ ...homeSettings, stat1Label: e.target.value })}
                    className="flex-1 px-3 py-2 bg-slate-50 dark:bg-[#16271e] border border-slate-300 dark:border-[#274030] rounded-lg text-sm text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Stat 2 (e.g. 100% Lab Tested)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={homeSettings.stat2Number}
                    onChange={(e) => setHomeSettings({ ...homeSettings, stat2Number: e.target.value })}
                    className="w-24 px-3 py-2 bg-slate-50 dark:bg-[#16271e] border border-slate-300 dark:border-[#274030] rounded-lg text-sm font-bold text-slate-900 dark:text-amber-300"
                  />
                  <input
                    type="text"
                    value={homeSettings.stat2Label}
                    onChange={(e) => setHomeSettings({ ...homeSettings, stat2Label: e.target.value })}
                    className="flex-1 px-3 py-2 bg-slate-50 dark:bg-[#16271e] border border-slate-300 dark:border-[#274030] rounded-lg text-sm text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Stat 3 (e.g. 5,000+ MT Yearly)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={homeSettings.stat3Number}
                    onChange={(e) => setHomeSettings({ ...homeSettings, stat3Number: e.target.value })}
                    className="w-24 px-3 py-2 bg-slate-50 dark:bg-[#16271e] border border-slate-300 dark:border-[#274030] rounded-lg text-sm font-bold text-slate-900 dark:text-amber-300"
                  />
                  <input
                    type="text"
                    value={homeSettings.stat3Label}
                    onChange={(e) => setHomeSettings({ ...homeSettings, stat3Label: e.target.value })}
                    className="flex-1 px-3 py-2 bg-slate-50 dark:bg-[#16271e] border border-slate-300 dark:border-[#274030] rounded-lg text-sm text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={homeSettings.showServices}
                    onChange={(e) => setHomeSettings({ ...homeSettings, showServices: e.target.checked })}
                    className="rounded text-forest-800"
                  />
                  <span className="font-semibold text-charcoal-800">Show Services Section on Home</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={homeSettings.showGallery}
                    onChange={(e) => setHomeSettings({ ...homeSettings, showGallery: e.target.checked })}
                    className="rounded text-forest-800"
                  />
                  <span className="font-semibold text-charcoal-800">Show Business Operations Gallery on Home</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* ── 2. COMPANY PROFILE CONTROL ── */}
        {activeTab === "company" && (
          <div className="space-y-6">
            <h3 className="font-sans font-bold text-base text-slate-900 dark:text-amber-300 border-b pb-2">
              Company Profile, Facility Image &amp; Registration
            </h3>

            {/* Facility Image Box with Direct Upload */}
            <div className="p-4 bg-sky-50/70 rounded-xl border border-sky-200 flex flex-col md:flex-row items-center gap-5">
              <div className="w-40 aspect-[4/3] rounded-lg overflow-hidden border border-sky-300 shrink-0 bg-white">
                <img
                  src={companySettings.facilityImage}
                  alt="Company Facility"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 space-y-2 text-xs">
                <div className="font-bold text-forest-950">Company Export Processing &amp; Warehouse Photo</div>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-forest-900 text-white rounded-lg font-semibold hover:bg-forest-800 transition-colors">
                    <Upload className="w-3.5 h-3.5 text-amber-400" />
                    <span>Upload New Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleFileUpload(
                          (url) => setCompanySettings({ ...companySettings, facilityImage: url }),
                          e
                        )
                      }
                      className="hidden"
                    />
                  </label>
                  <span className="text-slate-500 dark:text-slate-400">Appears on Company Profile &amp; About Page</span>
                </div>
                <input
                  type="text"
                  placeholder="Image URL or uploaded file..."
                  value={companySettings.facilityImage}
                  onChange={(e) => setCompanySettings({ ...companySettings, facilityImage: e.target.value })}
                  className="w-full px-2.5 py-1 text-[11px] font-mono bg-white border border-ivory-300 rounded"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Brand Name</label>
                <input
                  type="text"
                  value={companySettings.companyName}
                  onChange={(e) => setCompanySettings({ ...companySettings, companyName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#16271e] border border-slate-300 dark:border-[#274030] rounded-lg text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Legal Entity Name</label>
                <input
                  type="text"
                  value={companySettings.legalName}
                  onChange={(e) => setCompanySettings({ ...companySettings, legalName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#16271e] border border-slate-300 dark:border-[#274030] rounded-lg text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">IEC (Import Export Code)</label>
                <input
                  type="text"
                  value={companySettings.iecCode}
                  onChange={(e) => setCompanySettings({ ...companySettings, iecCode: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#16271e] border border-slate-300 dark:border-[#274030] rounded-lg text-sm font-mono text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">GSTIN Number</label>
                <input
                  type="text"
                  value={companySettings.gstin}
                  onChange={(e) => setCompanySettings({ ...companySettings, gstin: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#16271e] border border-slate-300 dark:border-[#274030] rounded-lg text-sm font-mono text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Annual Export Capacity</label>
                <input
                  type="text"
                  value={companySettings.annualExportCapacity}
                  onChange={(e) => setCompanySettings({ ...companySettings, annualExportCapacity: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#16271e] border border-slate-300 dark:border-[#274030] rounded-lg text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Establishment Year</label>
                <input
                  type="number"
                  value={companySettings.establishmentYear}
                  onChange={(e) => setCompanySettings({ ...companySettings, establishmentYear: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#16271e] border border-slate-300 dark:border-[#274030] rounded-lg text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Company Heritage Story</label>
                <textarea
                  rows={4}
                  value={companySettings.heritageStory}
                  onChange={(e) => setCompanySettings({ ...companySettings, heritageStory: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#16271e] border border-slate-300 dark:border-[#274030] rounded-lg text-sm text-slate-900 dark:text-white leading-relaxed"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Company Mission Quote</label>
                <textarea
                  rows={2}
                  value={companySettings.missionQuote}
                  onChange={(e) => setCompanySettings({ ...companySettings, missionQuote: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#16271e] border border-slate-300 dark:border-[#274030] rounded-lg text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Registered Trade Office Address</label>
                <textarea
                  rows={2}
                  value={companySettings.registeredAddress}
                  onChange={(e) => setCompanySettings({ ...companySettings, registeredAddress: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#16271e] border border-slate-300 dark:border-[#274030] rounded-lg text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Processing &amp; Warehousing Hub Address</label>
                <textarea
                  rows={2}
                  value={companySettings.processingFacilityAddress}
                  onChange={(e) => setCompanySettings({ ...companySettings, processingFacilityAddress: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#16271e] border border-slate-300 dark:border-[#274030] rounded-lg text-sm text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* ── 3. KEY PEOPLE (DIRECTORS) CONTROL ── */}
        {activeTab === "key-people" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-sans font-bold text-base text-slate-900 dark:text-amber-300">
                  Key People &amp; Trade Directors
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Manage executive leadership profiles displayed on the Key Person page.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setEditingPerson({
                    id: `kp-${Date.now()}`,
                    name: "",
                    role: "",
                    bio: "",
                    contactEmail: "",
                    phone: "",
                    image:
                      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
                    experience: "10+ Years",
                    enabled: true,
                  })
                }
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-forest-900 text-white rounded-lg text-xs font-semibold hover:bg-forest-800 transition-colors"
              >
                <Plus className="w-4 h-4 text-amber-400" />
                <span>Add Key Person</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {keyPeople.map((person) => (
                <div
                  key={person.id}
                  className="p-4 rounded-xl border border-sky-100 bg-sky-50/30 flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          person.enabled ? "bg-emerald-100 text-emerald-800" : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {person.enabled ? "Active" : "Hidden"}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setEditingPerson(person)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                          title="Edit Person"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Delete ${person.name}?`)) {
                              setKeyPeople(keyPeople.filter((p) => p.id !== person.id));
                            }
                          }}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <img
                        src={person.image}
                        alt={person.name}
                        className="w-14 h-14 rounded-full object-cover border border-amber-400"
                      />
                      <div>
                        <div className="font-bold text-sm text-slate-900 dark:text-amber-300">{person.name}</div>
                        <div className="text-xs text-amber-700 font-semibold">{person.role}</div>
                        <div className="text-[11px] text-charcoal-400">{person.experience}</div>
                      </div>
                    </div>

                    <p className="text-xs text-charcoal-light line-clamp-3 leading-relaxed">
                      {person.bio}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 text-[11px] text-charcoal-light truncate">
                    Email: <strong>{person.contactEmail}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── 4. WHOLESALE SERVICES CONTROL ── */}
        {activeTab === "services" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-sans font-bold text-base text-slate-900 dark:text-amber-300">
                  Wholesale Services Manager
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Add and edit commercial packaging, private labeling, and export services.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setEditingService({
                    id: `serv-${Date.now()}`,
                    number: `0${services.length + 1}`,
                    title: "",
                    subtitle: "Commercial Export",
                    description: "",
                    features: ["Deliverable specification 1", "Deliverable specification 2"],
                    enabled: true,
                  })
                }
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-forest-900 text-white rounded-lg text-xs font-semibold hover:bg-forest-800 transition-colors"
              >
                <Plus className="w-4 h-4 text-amber-400" />
                <span>Add Service</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {services.map((serv) => (
                <div
                  key={serv.id}
                  className="p-5 rounded-xl border border-sky-100 bg-white shadow-xs flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b">
                      <span className="font-sans font-extrabold text-2xl text-amber-500">
                        {serv.number}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setEditingService(serv)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                          title="Edit Service"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Delete ${serv.title}?`)) {
                              setServices(services.filter((s) => s.id !== serv.id));
                            }
                          }}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <h4 className="font-bold text-base text-slate-900 dark:text-amber-300 mt-2">{serv.title}</h4>
                    <span className="text-[10px] font-bold text-sky-800 uppercase tracking-wider px-2 py-0.5 rounded bg-sky-50">
                      {serv.subtitle}
                    </span>
                    <p className="text-xs text-charcoal-light mt-2 leading-relaxed">
                      {serv.description}
                    </p>

                    <div className="mt-3 space-y-1">
                      {serv.features?.map((f, i) => (
                        <div key={i} className="text-[11px] text-slate-700 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── 5. CERTIFICATIONS CONTROL ── */}
        {activeTab === "certifications" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-sans font-bold text-base text-slate-900 dark:text-amber-300">
                  Certifications &amp; Memberships Documents
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Upload official certificate images and manage statutory export licenses.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setEditingCert({
                    id: `cert-${Date.now()}`,
                    title: "",
                    category: "Export License",
                    authority: "",
                    regNo: "",
                    validTill: "2028-12-31",
                    enabled: true,
                    imageUrl:
                      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=85",
                    description: "",
                  })
                }
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-forest-900 text-white rounded-lg text-xs font-semibold hover:bg-forest-800 transition-colors"
              >
                <Plus className="w-4 h-4 text-amber-400" />
                <span>Add Certificate</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {certifications.map((cert) => (
                <div
                  key={cert.id}
                  className="p-4 rounded-xl border border-sky-100 bg-white shadow-xs flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold uppercase">
                        {cert.category}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setEditingCert(cert)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Delete ${cert.title}?`)) {
                              setCertifications(certifications.filter((c) => c.id !== cert.id));
                            }
                          }}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="aspect-[16/10] rounded-lg overflow-hidden border border-slate-200 mt-2 mb-2 bg-slate-100">
                      <img
                        src={cert.imageUrl}
                        alt={cert.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <h4 className="font-bold text-sm text-slate-900 dark:text-amber-300 truncate">{cert.title}</h4>
                    <p className="text-[11px] text-amber-700 truncate">{cert.authority}</p>
                    <p className="text-[11px] font-mono text-charcoal-muted mt-1">
                      Reg: {cert.regNo || "Verified"} · Valid: {cert.validTill || "Active"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── 6. FAQS CONTROL ── */}
        {activeTab === "faqs" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-sans font-bold text-base text-slate-900 dark:text-amber-300">
                  Frequently Asked Questions (F &amp; Q)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Manage answers to international buyer questions regarding ports, payments, and quality.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setEditingFaq({
                    id: `faq-${Date.now()}`,
                    category: "Shipping & Ports",
                    question: "",
                    answer: "",
                    enabled: true,
                  })
                }
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-forest-900 text-white rounded-lg text-xs font-semibold hover:bg-forest-800 transition-colors"
              >
                <Plus className="w-4 h-4 text-amber-400" />
                <span>Add Question</span>
              </button>
            </div>

            <div className="space-y-3">
              {faqs.map((faq) => (
                <div
                  key={faq.id}
                  className="p-4 rounded-xl border border-sky-100 bg-white shadow-xs flex flex-col md:flex-row items-start justify-between gap-4"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-sky-50 text-sky-800 text-[10px] font-bold">
                        {faq.category}
                      </span>
                    </div>
                    <div className="font-bold text-sm text-slate-900 dark:text-amber-300">{faq.question}</div>
                    <p className="text-xs text-charcoal-light leading-relaxed">{faq.answer}</p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => setEditingFaq(faq)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                      title="Edit FAQ"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm("Delete this question?")) {
                          setFaqs(faqs.filter((f) => f.id !== faq.id));
                        }
                      }}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── MODAL: EDIT KEY PERSON ── */}
      {editingPerson && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#122119] border border-slate-200 dark:border-[#203a2b] text-slate-900 dark:text-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-[#1d3527]">
              <h3 className="font-bold text-base text-slate-900 dark:text-amber-300">
                {editingPerson.id.startsWith("kp-") && !keyPeople.some((p) => p.id === editingPerson.id)
                  ? "Add New Key Person"
                  : "Edit Key Person"}
              </h3>
              <button
                onClick={() => setEditingPerson(null)}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editingPerson.name}
                  onChange={(e) => setEditingPerson({ ...editingPerson, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-[#274030] bg-slate-50 dark:bg-[#16271e] text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:focus:ring-amber-400"
                  placeholder="e.g. Rajesh Mohanty"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Role / Designation</label>
                <input
                  type="text"
                  value={editingPerson.role}
                  onChange={(e) => setEditingPerson({ ...editingPerson, role: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-[#274030] bg-slate-50 dark:bg-[#16271e] text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:focus:ring-amber-400"
                  placeholder="e.g. Managing Director & Head of International Trade"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Direct Trade Email</label>
                  <input
                    type="email"
                    value={editingPerson.contactEmail}
                    onChange={(e) => setEditingPerson({ ...editingPerson, contactEmail: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-[#274030] bg-slate-50 dark:bg-[#16271e] text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:focus:ring-amber-400"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Direct Phone</label>
                  <input
                    type="text"
                    value={editingPerson.phone || ""}
                    onChange={(e) => setEditingPerson({ ...editingPerson, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-[#274030] bg-slate-50 dark:bg-[#16271e] text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:focus:ring-amber-400"
                  />
                </div>
              </div>

              {/* Photo Upload */}
              <div className="p-3 bg-slate-50 dark:bg-[#16271e] rounded-lg border border-slate-200 dark:border-[#274030] space-y-2">
                <label className="block font-bold text-slate-900 dark:text-amber-300">Director Photo</label>
                <div className="flex items-center gap-3">
                  <img
                    src={editingPerson.image}
                    alt={editingPerson.name}
                    className="w-12 h-12 rounded-full object-cover border border-amber-400"
                  />
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 dark:bg-[#dfb15b] dark:hover:bg-amber-400 text-white dark:text-[#0c1812] rounded text-xs font-bold transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleFileUpload((url) => setEditingPerson({ ...editingPerson, image: url }), e)
                      }
                      className="hidden"
                    />
                  </label>
                </div>
                <input
                  type="text"
                  value={editingPerson.image}
                  onChange={(e) => setEditingPerson({ ...editingPerson, image: e.target.value })}
                  className="w-full px-2.5 py-1 text-[11px] font-mono border border-slate-300 dark:border-[#274030] bg-white dark:bg-[#122119] rounded"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Professional Bio</label>
                <textarea
                  rows={3}
                  value={editingPerson.bio}
                  onChange={(e) => setEditingPerson({ ...editingPerson, bio: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-[#274030] bg-slate-50 dark:bg-[#16271e] text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Experience Badge (e.g. 18+ Years)</label>
                <input
                  type="text"
                  value={editingPerson.experience || ""}
                  onChange={(e) => setEditingPerson({ ...editingPerson, experience: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-[#274030] bg-slate-50 dark:bg-[#16271e] text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:focus:ring-amber-400"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-[#1d3527]">
              <button
                type="button"
                onClick={() => setEditingPerson(null)}
                className="px-4 py-2 border border-slate-300 dark:border-[#274030] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#172b20] rounded-lg text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!editingPerson.name.trim()) return;
                  setKeyPeople((prev) => {
                    const idx = prev.findIndex((p) => p.id === editingPerson.id);
                    if (idx >= 0) {
                      const updated = [...prev];
                      updated[idx] = editingPerson;
                      return updated;
                    }
                    return [...prev, editingPerson];
                  });
                  setEditingPerson(null);
                }}
                className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 dark:bg-[#dfb15b] dark:hover:bg-amber-400 text-white dark:text-[#0c1812] rounded-lg text-xs font-bold transition-colors shadow-xs"
              >
                Save Person
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: EDIT SERVICE ── */}
      {editingService && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#122119] border border-slate-200 dark:border-[#203a2b] text-slate-900 dark:text-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-[#1d3527]">
              <h3 className="font-bold text-base text-slate-900 dark:text-amber-300">Edit Wholesale Service</h3>
              <button
                onClick={() => setEditingService(null)}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Number</label>
                  <input
                    type="text"
                    value={editingService.number}
                    onChange={(e) => setEditingService({ ...editingService, number: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-[#274030] bg-slate-50 dark:bg-[#16271e] text-slate-900 dark:text-white rounded-lg font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:focus:ring-amber-400"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Subtitle Badge</label>
                  <input
                    type="text"
                    value={editingService.subtitle}
                    onChange={(e) => setEditingService({ ...editingService, subtitle: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-[#274030] bg-slate-50 dark:bg-[#16271e] text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:focus:ring-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Service Title</label>
                <input
                  type="text"
                  value={editingService.title}
                  onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-[#274030] bg-slate-50 dark:bg-[#16271e] text-slate-900 dark:text-white rounded-lg font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingService.description}
                  onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-[#274030] bg-slate-50 dark:bg-[#16271e] text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Key Deliverables (one per line)</label>
                <textarea
                  rows={4}
                  value={editingService.features?.join("\n") || ""}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      features: e.target.value.split("\n").filter(Boolean),
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 dark:border-[#274030] bg-slate-50 dark:bg-[#16271e] text-slate-900 dark:text-white rounded-lg font-mono text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:focus:ring-amber-400"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-[#1d3527]">
              <button
                type="button"
                onClick={() => setEditingService(null)}
                className="px-4 py-2 border border-slate-300 dark:border-[#274030] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#172b20] rounded-lg text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!editingService.title.trim()) return;
                  setServices((prev) => {
                    const idx = prev.findIndex((s) => s.id === editingService.id);
                    if (idx >= 0) {
                      const updated = [...prev];
                      updated[idx] = editingService;
                      return updated;
                    }
                    return [...prev, editingService];
                  });
                  setEditingService(null);
                }}
                className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 dark:bg-[#dfb15b] dark:hover:bg-amber-400 text-white dark:text-[#0c1812] rounded-lg text-xs font-bold transition-colors shadow-xs"
              >
                Save Service
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: EDIT CERTIFICATE ── */}
      {editingCert && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#122119] border border-slate-200 dark:border-[#203a2b] text-slate-900 dark:text-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-[#1d3527]">
              <h3 className="font-bold text-base text-slate-900 dark:text-amber-300">Edit Certificate / Membership</h3>
              <button
                onClick={() => setEditingCert(null)}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Certificate Title</label>
                <input
                  type="text"
                  value={editingCert.title}
                  onChange={(e) => setEditingCert({ ...editingCert, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-[#274030] bg-slate-50 dark:bg-[#16271e] text-slate-900 dark:text-white rounded-lg font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:focus:ring-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                  <select
                    value={editingCert.category}
                    onChange={(e) => setEditingCert({ ...editingCert, category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-[#274030] bg-slate-50 dark:bg-[#16271e] text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:focus:ring-amber-400"
                  >
                    <option value="Export License">Export License</option>
                    <option value="Food Safety">Food Safety &amp; Quality</option>
                    <option value="Membership & Chamber">Membership &amp; Chamber</option>
                    <option value="Quality Assurance">Quality Assurance</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Registration #</label>
                  <input
                    type="text"
                    value={editingCert.regNo}
                    onChange={(e) => setEditingCert({ ...editingCert, regNo: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-[#274030] bg-slate-50 dark:bg-[#16271e] text-slate-900 dark:text-white rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:focus:ring-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Issuing Authority</label>
                  <input
                    type="text"
                    value={editingCert.authority}
                    onChange={(e) => setEditingCert({ ...editingCert, authority: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-[#274030] bg-slate-50 dark:bg-[#16271e] text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:focus:ring-amber-400"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Valid Until</label>
                  <input
                    type="text"
                    value={editingCert.validTill}
                    onChange={(e) => setEditingCert({ ...editingCert, validTill: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-[#274030] bg-slate-50 dark:bg-[#16271e] text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:focus:ring-amber-400"
                  />
                </div>
              </div>

              {/* Upload Document Image */}
              <div className="p-3 bg-slate-50 dark:bg-[#16271e] rounded-lg border border-slate-200 dark:border-[#274030] space-y-2">
                <label className="block font-bold text-slate-900 dark:text-amber-300">Certificate Document Image</label>
                <div className="flex items-center gap-3">
                  <img
                    src={editingCert.imageUrl}
                    alt={editingCert.title}
                    className="w-16 aspect-[16/10] object-cover border border-slate-300 dark:border-[#2b4836] rounded"
                  />
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 dark:bg-[#dfb15b] dark:hover:bg-amber-400 text-white dark:text-[#0c1812] rounded text-xs font-bold transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Document File</span>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={(e) =>
                        handleFileUpload((url) => setEditingCert({ ...editingCert, imageUrl: url }), e)
                      }
                      className="hidden"
                    />
                  </label>
                </div>
                <input
                  type="text"
                  value={editingCert.imageUrl}
                  onChange={(e) => setEditingCert({ ...editingCert, imageUrl: e.target.value })}
                  className="w-full px-2.5 py-1 text-[11px] font-mono border border-slate-300 dark:border-[#274030] bg-white dark:bg-[#122119] rounded text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingCert.description || ""}
                  onChange={(e) => setEditingCert({ ...editingCert, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-[#274030] bg-slate-50 dark:bg-[#16271e] text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:focus:ring-amber-400"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-[#1d3527]">
              <button
                type="button"
                onClick={() => setEditingCert(null)}
                className="px-4 py-2 border border-slate-300 dark:border-[#274030] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#172b20] rounded-lg text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!editingCert.title.trim()) return;
                  setCertifications((prev) => {
                    const idx = prev.findIndex((c) => c.id === editingCert.id);
                    if (idx >= 0) {
                      const updated = [...prev];
                      updated[idx] = editingCert;
                      return updated;
                    }
                    return [...prev, editingCert];
                  });
                  setEditingCert(null);
                }}
                className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 dark:bg-[#dfb15b] dark:hover:bg-amber-400 text-white dark:text-[#0c1812] rounded-lg text-xs font-bold transition-colors shadow-xs"
              >
                Save Certificate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: EDIT FAQ ── */}
      {editingFaq && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#122119] border border-slate-200 dark:border-[#203a2b] text-slate-900 dark:text-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-[#1d3527]">
              <h3 className="font-bold text-base text-slate-900 dark:text-amber-300">Edit Question &amp; Answer</h3>
              <button
                onClick={() => setEditingFaq(null)}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                <select
                  value={editingFaq.category}
                  onChange={(e) => setEditingFaq({ ...editingFaq, category: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-[#274030] bg-slate-50 dark:bg-[#16271e] text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:focus:ring-amber-400"
                >
                  <option value="Shipping & Ports">Shipping &amp; Ports</option>
                  <option value="Quality & Testing">Quality &amp; Testing</option>
                  <option value="Packaging & Samples">Packaging &amp; Samples</option>
                  <option value="Payments & Contracts">Payments &amp; Contracts</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Question</label>
                <input
                  type="text"
                  value={editingFaq.question}
                  onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-[#274030] bg-slate-50 dark:bg-[#16271e] text-slate-900 dark:text-white rounded-lg font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Answer</label>
                <textarea
                  rows={4}
                  value={editingFaq.answer}
                  onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-[#274030] bg-slate-50 dark:bg-[#16271e] text-slate-900 dark:text-white rounded-lg leading-relaxed focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:focus:ring-amber-400"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-[#1d3527]">
              <button
                type="button"
                onClick={() => setEditingFaq(null)}
                className="px-4 py-2 border border-slate-300 dark:border-[#274030] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#172b20] rounded-lg text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!editingFaq.question.trim()) return;
                  setFaqs((prev) => {
                    const idx = prev.findIndex((f) => f.id === editingFaq.id);
                    if (idx >= 0) {
                      const updated = [...prev];
                      updated[idx] = editingFaq;
                      return updated;
                    }
                    return [...prev, editingFaq];
                  });
                  setEditingFaq(null);
                }}
                className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 dark:bg-[#dfb15b] dark:hover:bg-amber-400 text-white dark:text-[#0c1812] rounded-lg text-xs font-bold transition-colors shadow-xs"
              >
                Save FAQ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPagesManager;

