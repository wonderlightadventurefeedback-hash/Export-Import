import React, { useState, useEffect } from "react";
import { Search, Save, CheckCircle2, RefreshCw, AlertCircle, ExternalLink, Globe } from "lucide-react";
import { adminApi } from "../../services/adminApi";
import { useAdminAuth } from "../../context/AdminAuthContext";

export const AdminSEOManager: React.FC = () => {
  const { canEditContent } = useAdminAuth();
  const [seoData, setSeoData] = useState<Record<string, any>>({});
  const [selectedPage, setSelectedPage] = useState<string>("home");
  const [isSaving, setIsSaving] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [sitemapSuccess, setSitemapSuccess] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const pages = [
    { key: "home", label: "Home Page (/)", path: "/" },
    { key: "about", label: "About Us (/about)", path: "/about" },
    { key: "products", label: "Spice Catalog (/products)", path: "/products" },
    { key: "services", label: "Export Solutions (/services)", path: "/services" },
    { key: "exportProcess", label: "Export Process (/export-process)", path: "/export-process" },
    { key: "contact", label: "Contact Us (/contact)", path: "/contact" },
    { key: "quote", label: "Request a Quote (/quote)", path: "/quote" },
  ];

  useEffect(() => {
    fetchSeoData();
  }, []);

  const fetchSeoData = async () => {
    try {
      const data = await adminApi.getSeo();
      setSeoData(data || {});
    } catch (err: any) {
      console.error("Failed to load SEO data:", err);
      setErrorMessage("Could not load SEO configurations.");
    }
  };

  const currentPageData = seoData[selectedPage] || {
    title: "",
    meta_description: "",
    canonical_url: "",
    og_image_url: "",
    robots: "index, follow",
    keywords: [],
    structured_data_type: "Organization",
  };

  const handleFieldChange = (field: string, value: any) => {
    setSeoData((prev) => ({
      ...prev,
      [selectedPage]: {
        ...(prev[selectedPage] || {}),
        [field]: value,
      },
    }));
  };

  const handleSavePage = async () => {
    if (!canEditContent) return;
    setIsSaving(true);
    setSaveSuccess(false);
    setErrorMessage(null);
    try {
      await adminApi.updateSeo(selectedPage, seoData[selectedPage]);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to update page SEO");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRegenerateSitemap = async () => {
    setIsRegenerating(true);
    setSitemapSuccess(null);
    setErrorMessage(null);
    try {
      const res = await adminApi.regenerateSitemap();
      setSitemapSuccess(`Sitemap generated successfully (${res?.urlsCount || 24} URLs indexed). Available at /sitemap.xml`);
      setTimeout(() => setSitemapSuccess(null), 5000);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to regenerate sitemap");
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-charcoal-900 flex items-center gap-2">
            <Search className="w-6 h-6 text-forest-700" />
            Search Engine Optimization (SEO)
          </h1>
          <p className="font-sans text-sm text-charcoal-500">
            Fine-tune global Google indexing, OpenGraph preview cards, canonical tags, and sitemap.xml.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRegenerateSitemap}
            disabled={isRegenerating}
            className="inline-flex items-center gap-2 px-4 py-2 border border-ivory-300 bg-white text-charcoal-700 font-sans text-sm font-medium rounded-lg hover:bg-ivory-100 transition-colors shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRegenerating ? "animate-spin text-forest-600" : ""}`} />
            <span>Regenerate Sitemap</span>
          </button>

          <button
            onClick={handleSavePage}
            disabled={!canEditContent || isSaving}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-forest-800 text-gold-300 font-sans font-semibold text-sm rounded-lg hover:bg-forest-900 transition-colors shadow-sm disabled:opacity-50"
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>Save SEO</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-lg flex items-center gap-2 text-sm font-sans">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>SEO settings updated for selected page.</span>
        </div>
      )}

      {sitemapSuccess && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg flex items-center gap-2 text-sm font-sans">
          <CheckCircle2 className="w-4 h-4 text-blue-600" />
          <span>{sitemapSuccess}</span>
        </div>
      )}

      {errorMessage && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-lg flex items-center gap-2 text-sm font-sans">
          <AlertCircle className="w-4 h-4 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Page Selector Sidebar + Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 bg-white border border-ivory-300 rounded-xl p-3 shadow-sm space-y-1">
          <p className="px-3 py-2 text-xs font-bold text-charcoal-400 uppercase tracking-wider">Public Pages</p>
          {pages.map((p) => (
            <button
              key={p.key}
              onClick={() => setSelectedPage(p.key)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-sans font-medium transition-colors flex items-center justify-between ${
                selectedPage === p.key
                  ? "bg-forest-800 text-gold-300 font-semibold"
                  : "text-charcoal-700 hover:bg-ivory-100"
              }`}
            >
              <span>{p.label}</span>
            </button>
          ))}
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white border border-ivory-300 rounded-xl p-6 shadow-sm space-y-5">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-charcoal-700 uppercase tracking-wider">
                  Page Meta Title
                </label>
                <span className={`text-xs ${currentPageData.title?.length > 60 ? "text-amber-600 font-bold" : "text-charcoal-400"}`}>
                  {currentPageData.title?.length || 0} / 60 chars recommended
                </span>
              </div>
              <input
                type="text"
                value={currentPageData.title || ""}
                onChange={(e) => handleFieldChange("title", e.target.value)}
                placeholder="Indian Spices Export - Kandhamal Turmeric & Malabar Black Pepper Exporter"
                className="w-full px-3.5 py-2.5 bg-ivory-50 border border-ivory-300 rounded-lg text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-charcoal-700 uppercase tracking-wider">
                  Meta Description
                </label>
                <span className={`text-xs ${currentPageData.meta_description?.length > 160 ? "text-amber-600 font-bold" : "text-charcoal-400"}`}>
                  {currentPageData.meta_description?.length || 0} / 160 chars recommended
                </span>
              </div>
              <textarea
                rows={3}
                value={currentPageData.meta_description || ""}
                onChange={(e) => handleFieldChange("meta_description", e.target.value)}
                placeholder="Certified wholesale bulk exporter of GI-tagged Kandhamal turmeric, Tellicherry black pepper, and Guntur chillies with phytosanitary compliance."
                className="w-full px-3.5 py-2.5 bg-ivory-50 border border-ivory-300 rounded-lg text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                  Canonical URL
                </label>
                <input
                  type="text"
                  value={currentPageData.canonical_url || ""}
                  onChange={(e) => handleFieldChange("canonical_url", e.target.value)}
                  placeholder="https://indianspiceexport.com/products"
                  className="w-full px-3.5 py-2.5 bg-ivory-50 border border-ivory-300 rounded-lg text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                  Robots Indexing Directive
                </label>
                <select
                  value={currentPageData.robots || "index, follow"}
                  onChange={(e) => handleFieldChange("robots", e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-ivory-50 border border-ivory-300 rounded-lg text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
                >
                  <option value="index, follow">index, follow (Standard Public)</option>
                  <option value="noindex, follow">noindex, follow</option>
                  <option value="noindex, nofollow">noindex, nofollow (Private/Disallow)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                OpenGraph Share Image URL (1200x630)
              </label>
              <input
                type="text"
                value={currentPageData.og_image_url || ""}
                onChange={(e) => handleFieldChange("og_image_url", e.target.value)}
                placeholder="https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&w=1200&q=80"
                className="w-full px-3.5 py-2.5 bg-ivory-50 border border-ivory-300 rounded-lg text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
              />
              {currentPageData.og_image_url && (
                <div className="mt-2 w-48 h-24 rounded border border-ivory-300 overflow-hidden bg-ivory-100">
                  <img src={currentPageData.og_image_url} alt="OG Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            {/* Google Search Live Preview */}
            <div className="pt-4 border-t border-ivory-200">
              <p className="text-xs font-bold text-charcoal-500 uppercase tracking-wider mb-2">
                Google SERP Snippet Preview
              </p>
              <div className="p-4 bg-white border border-ivory-300 rounded-lg max-w-xl font-sans">
                <div className="flex items-center gap-1.5 text-xs text-charcoal-600 mb-1">
                  <Globe className="w-3.5 h-3.5 text-emerald-700" />
                  <span>https://indianspiceexport.com{pages.find((p) => p.key === selectedPage)?.path}</span>
                </div>
                <h3 className="text-blue-800 hover:underline text-base font-medium truncate cursor-pointer">
                  {currentPageData.title || "Indian Spice Export | Premium B2B Wholesale Exporter"}
                </h3>
                <p className="text-xs text-charcoal-600 line-clamp-2 mt-1 leading-relaxed">
                  {currentPageData.meta_description || "Add a meta description to see how this page will display on search engines."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdminSEOManager;