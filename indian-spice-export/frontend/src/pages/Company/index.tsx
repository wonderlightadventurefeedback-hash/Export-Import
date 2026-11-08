import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  ShieldCheck,
  Award,
  Globe2,
  CheckCircle2,
  ArrowRight,
  MapPin,
  Calendar,
  FileText,
  Boxes,
  Truck,
  Ship,
} from "lucide-react";
import { Container } from "../../components/ui/Container";
import { Section } from "../../components/ui/Section";
import { PageHero } from "../../components/ui/PageHero";
import { Eyebrow } from "../../components/ui/Eyebrow";
import { Button } from "../../components/ui/Button";
import { CTABand } from "../../components/ui/CTABand";
import {
  getStoredCompanySettings,
  CompanySettingsData,
} from "../../config/siteContent";

export const CompanyPage: React.FC = () => {
  const [company, setCompany] = useState<CompanySettingsData>(getStoredCompanySettings);

  useEffect(() => {
    const handleUpdate = () => {
      setCompany(getStoredCompanySettings());
    };
    window.addEventListener("storage", handleUpdate);
    window.addEventListener("company-settings-updated", handleUpdate);
    return () => {
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("company-settings-updated", handleUpdate);
    };
  }, []);

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
        breadcrumbs={[{ label: "About", to: "/about" }, { label: "Company Profile" }]}
        title={`${company.companyName} · Company Profile`}
        subtitle="Licensed Indian merchant and manufacturer exporter supplying certified origin spices worldwide."
      />

      {/* Main Company Overview Section */}
      <Section tone="ivory" padding="compact" className="py-12 sm:py-16">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center max-w-6xl mx-auto">
            {/* Left Side: Company Facility Photo with Overlays */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="relative rounded-2xl overflow-hidden border border-sky-100 shadow-2xl bg-white group">
                <div className="aspect-[4/5] sm:aspect-square lg:aspect-[4/5] w-full overflow-hidden relative">
                  <img
                    src={company.facilityImage}
                    alt={company.companyName}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-950/85 via-forest-950/20 to-transparent" />

                  {/* Top Badge */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <span className="px-3 py-1.5 rounded-full bg-forest-900/90 backdrop-blur-md text-gold-300 border border-gold-500/40 text-[11px] font-bold tracking-wider uppercase flex items-center gap-1.5 shadow-lg">
                      <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
                      <span>Govt. Registered Exporter</span>
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-forest-900 text-[10px] font-bold tracking-wider shadow-sm">
                      Est. {company.establishmentYear}
                    </span>
                  </div>

                  {/* Bottom Info Card */}
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-forest-900/90 backdrop-blur-md border border-forest-700/80 text-white shadow-xl">
                    <div className="flex items-center gap-3">
                      <img
                        src="/logo.png"
                        alt={company.companyName}
                        className="w-10 h-10 object-contain shrink-0 rounded-full bg-white/10 p-0.5"
                      />
                      <div className="min-w-0">
                        <div className="font-sans font-bold text-sm text-gold-300 leading-tight truncate">
                          {company.companyName}
                        </div>
                        <div className="text-[11px] text-ivory-300/90 mt-0.5 truncate">
                          {company.facilityBadge}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Legal Credentials Summary Box */}
              <div className="p-4 bg-white rounded-xl border border-sky-100 shadow-sm text-xs space-y-2">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <span className="text-charcoal-muted font-medium">IEC (Import Export Code):</span>
                  <span className="font-mono font-bold text-forest-900">{company.iecCode}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <span className="text-charcoal-muted font-medium">GSTIN Registration:</span>
                  <span className="font-mono font-bold text-forest-900">{company.gstin}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-charcoal-muted font-medium">Annual Export Capacity:</span>
                  <span className="font-semibold text-amber-700">{company.annualExportCapacity}</span>
                </div>
              </div>
            </div>

            {/* Right Side: Company Details & Narrative */}
            <div className="lg:col-span-7 flex flex-col gap-5">
              <div className="space-y-2">
                <Eyebrow tone="gold">Company Heritage &amp; Operations</Eyebrow>
                <h2 className="font-sans text-2xl sm:text-3xl lg:text-4xl font-extrabold text-forest-900 tracking-tight leading-tight">
                  {company.legalName}
                </h2>
                <p className="text-xs sm:text-sm font-semibold text-amber-700">
                  {company.tagline}
                </p>
              </div>

              {/* Mission Pull Quote */}
              <div className="p-4 sm:p-5 border-l-4 border-amber-500 bg-white rounded-r-xl shadow-xs border border-sky-100/60">
                <p className="font-sans text-sm sm:text-base text-forest-900 leading-relaxed font-medium italic">
                  "{company.missionQuote}"
                </p>
              </div>

              {/* Story Narrative */}
              <div className="space-y-3 text-xs sm:text-sm text-charcoal-light leading-relaxed">
                <p>{company.heritageStory}</p>
                <p>
                  We operate complete supply chain traceability from farm gate collection in Kandhamal and Koraput through our centralized processing unit, ensuring every overseas consignment is documented with Phytosanitary Certificates, Certificates of Origin, and SGS/Eurofins assay reports.
                </p>
              </div>

              {/* Infrastructure Capabilities */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-white rounded-lg border border-sky-100 shadow-xs flex items-start gap-2.5">
                  <Boxes className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-xs text-forest-900">Modern Processing Hub</div>
                    <div className="text-[11px] text-charcoal-light mt-0.5">Destoning, magnetic separation &amp; grading.</div>
                  </div>
                </div>
                <div className="p-3 bg-white rounded-lg border border-sky-100 shadow-xs flex items-start gap-2.5">
                  <Ship className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-xs text-forest-900">Maritime Port Access</div>
                    <div className="text-[11px] text-charcoal-light mt-0.5">Paradip, Kolkata, Vizag &amp; Chennai terminals.</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button to="/certifications" variant="primary" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  View Official Certifications
                </Button>
                <Button to="/key-person" variant="outline" size="sm">
                  Meet Key People
                </Button>
                <Button to="/contact" variant="ghost" size="sm">
                  Contact Trade Office
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Corporate Locations */}
      <Section tone="ivory-deep" padding="compact" className="py-10 sm:py-14">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="font-sans text-2xl font-bold text-forest-900">
                Registered Trade Office &amp; Warehouses
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-white rounded-xl border border-sky-100 shadow-md">
                <div className="w-9 h-9 rounded-full bg-sky-50 text-sky-700 flex items-center justify-center mb-3">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-forest-900 mb-1">Registered Trade Office</h3>
                <p className="text-xs text-charcoal-light leading-relaxed mb-3">
                  {company.registeredAddress}
                </p>
                <div className="text-[11px] text-amber-700 font-semibold">
                  Commercial inquiries, banking &amp; contract execution
                </div>
              </div>

              <div className="p-6 bg-white rounded-xl border border-sky-100 shadow-md">
                <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
                  <Truck className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-forest-900 mb-1">Export Warehousing Hub</h3>
                <p className="text-xs text-charcoal-light leading-relaxed mb-3">
                  {company.processingFacilityAddress}
                </p>
                <div className="text-[11px] text-emerald-700 font-semibold">
                  Bulk sorting, fumigation, packaging &amp; container loading
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <CTABand
        title="Looking for verified Indian spice supplies?"
        subtitle="Contact our export desk to receive complete product sheets, laboratory assays, or a formal CIF container quotation."
      />
    </div>
  );
};

export default CompanyPage;

