import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Award,
  Eye,
  ExternalLink,
  X,
  FileText,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Container } from "../../components/ui/Container";
import { Section } from "../../components/ui/Section";
import { PageHero } from "../../components/ui/PageHero";
import { Eyebrow } from "../../components/ui/Eyebrow";
import { Button } from "../../components/ui/Button";
import { CTABand } from "../../components/ui/CTABand";
import {
  getStoredCertificates,
  CertificateItem,
} from "../../config/certificates";

export const CertificationsPage: React.FC = () => {
  const [certificates, setCertificates] = useState<CertificateItem[]>(getStoredCertificates);
  const [selectedCert, setSelectedCert] = useState<CertificateItem | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  useEffect(() => {
    const handleUpdate = () => {
      setCertificates(getStoredCertificates());
    };
    window.addEventListener("storage", handleUpdate);
    window.addEventListener("certificates-updated", handleUpdate);
    return () => {
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("certificates-updated", handleUpdate);
    };
  }, []);

  const activeCerts = certificates.filter((c) => c.enabled !== false);
  const filteredCerts =
    categoryFilter === "all"
      ? activeCerts
      : activeCerts.filter((c) =>
          c.category.toLowerCase().includes(categoryFilter.toLowerCase())
        );

  return (
    <div className="w-full relative min-h-screen">
      {/* ── Fixed background image ── */}
      <div
        className="fixed inset-0 -z-20 pointer-events-none"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&w=1920&q=85')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      {/* Light blue soft translucent wash */}
      <div className="fixed inset-0 -z-10 bg-sky-50/75 pointer-events-none" />

      {/* Page Hero */}
      <PageHero
        breadcrumbs={[{ label: "About", to: "/about" }, { label: "Certifications" }]}
        title="Official Certifications &amp; Memberships"
        subtitle="Statutory export licenses, food safety accreditations, and trade chamber memberships authorizing our global spice exports."
      />

      <Section tone="ivory" padding="compact" className="py-12 sm:py-16">
        <Container>
          <div className="max-w-6xl mx-auto">
            {/* Header + Filter Pills */}
            <div className="text-center max-w-3xl mx-auto mb-10">
              <Eyebrow tone="gold">Compliance &amp; Accreditations</Eyebrow>
              <h2 className="font-sans text-2xl sm:text-3xl font-extrabold text-forest-900 tracking-tight mt-1.5 mb-2">
                Verified Global Food Safety &amp; Export Credentials
              </h2>
              <p className="text-xs sm:text-sm text-charcoal-light leading-relaxed">
                Click any credential to inspect the verified official certificate document, registration number, and scope of compliance.
              </p>

              {/* Filter Pills */}
              <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
                {[
                  { id: "all", label: "All Credentials" },
                  { id: "license", label: "Export Licenses" },
                  { id: "safety", label: "Food Safety & Quality" },
                  { id: "membership", label: "Trade Memberships" },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setCategoryFilter(f.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      categoryFilter === f.id
                        ? "bg-forest-900 text-white shadow-sm"
                        : "bg-white text-charcoal border border-sky-100 hover:border-amber-400 hover:text-amber-700"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid of Certificates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCerts.map((cert) => (
                <div
                  key={cert.id}
                  onClick={() => setSelectedCert(cert)}
                  className="group p-5 bg-white rounded-2xl border border-sky-100 shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    {/* Category & Reg No */}
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-sky-100 text-[11px]">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold uppercase tracking-wider">
                        {cert.category}
                      </span>
                      <span className="font-mono text-amber-700 font-semibold truncate max-w-[150px]">
                        {cert.regNo || "Verified"}
                      </span>
                    </div>

                    {/* Certificate Document Thumbnail Preview */}
                    <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200 mb-3.5 group-hover:border-amber-400 transition-colors">
                      <img
                        src={cert.imageUrl}
                        alt={cert.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-forest-950/20 group-hover:bg-forest-950/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 duration-300">
                        <span className="px-3 py-1.5 rounded-full bg-white text-forest-900 text-xs font-bold shadow-lg flex items-center gap-1.5">
                          <Eye className="w-3.5 h-3.5 text-amber-600" />
                          <span>View Certificate</span>
                        </span>
                      </div>
                    </div>

                    <h3 className="font-sans text-lg font-bold text-forest-900 mb-1 group-hover:text-amber-600 transition-colors">
                      {cert.title}
                    </h3>
                    <p className="text-[11px] text-amber-700 font-medium mb-2">
                      {cert.authority}
                    </p>
                    <p className="text-xs text-charcoal-light leading-relaxed line-clamp-2">
                      {cert.description || "Official statutory compliance document authorizing bulk spice export."}
                    </p>
                  </div>

                  <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-charcoal-light">
                      Valid: <strong className="text-forest-900">{cert.validTill || "Active"}</strong>
                    </span>
                    <span className="text-amber-600 font-bold group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                      <span>Inspect Document</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Lightbox Modal */}
      {selectedCert && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={() => setSelectedCert(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-sky-200 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 sm:p-6 border-b border-sky-100 flex items-start justify-between gap-4 bg-sky-50/50">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                    {selectedCert.category}
                  </span>
                  <span className="text-xs font-mono text-amber-700 font-semibold">
                    Reg #: {selectedCert.regNo}
                  </span>
                </div>
                <h3 className="font-sans font-bold text-lg sm:text-2xl text-forest-900">
                  {selectedCert.title}
                </h3>
                <p className="text-xs text-charcoal-light mt-0.5">
                  Issued by: <strong>{selectedCert.authority}</strong> · Valid Until: <strong>{selectedCert.validTill}</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCert(null)}
                className="w-9 h-9 rounded-full bg-white hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-charcoal hover:text-forest-900 transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 bg-slate-900/5 flex flex-col items-center justify-center">
              <div className="max-w-2xl w-full rounded-xl overflow-hidden border border-slate-300 shadow-md bg-white">
                <img
                  src={selectedCert.imageUrl}
                  alt={selectedCert.title}
                  className="w-full h-auto max-h-[60vh] object-contain"
                />
              </div>
              {selectedCert.description && (
                <p className="text-xs text-charcoal-light mt-4 text-center max-w-xl leading-relaxed">
                  {selectedCert.description}
                </p>
              )}
            </div>

            <div className="p-4 sm:p-5 border-t border-sky-100 bg-white flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-emerald-700 flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Verified Legal Export Credential on file with Export Desk</span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={selectedCert.imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-sky-50 text-sky-800 hover:bg-sky-100 border border-sky-200 text-xs font-semibold transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Full Size</span>
                </a>
                <button
                  type="button"
                  onClick={() => setSelectedCert(null)}
                  className="px-4 py-2 rounded-lg bg-forest-900 text-white hover:bg-forest-800 text-xs font-semibold transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <CTABand
        title="Require specific statutory certificates for your customs?"
        subtitle="We provide Phytosanitary, Certificate of Origin, Spices Board CRES, and independent SGS assay reports with every shipment."
        primaryCtaText="Request Export Quote"
        primaryCtaLink="/request-quote"
      />
    </div>
  );
};

export default CertificationsPage;

