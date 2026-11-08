import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Award,
  Users,
  Building2,
  FileCheck2,
  Globe2,
  Mail,
  Linkedin,
  Eye,
  ExternalLink,
  X,
  FileText,
  Sparkles,
} from "lucide-react";
import { Container } from "../../components/ui/Container";
import { Section } from "../../components/ui/Section";
import { PageHero } from "../../components/ui/PageHero";
import { Eyebrow } from "../../components/ui/Eyebrow";
import { Button } from "../../components/ui/Button";
import { CTABand } from "../../components/ui/CTABand";
import { Accordion } from "../../components/ui/Accordion";
import { MOCK_FAQS } from "../../services/mock";
import { COMPANY_CONFIG } from "../../config/company";
import {
  getStoredCertificates,
  getStoredCompanyAbout,
  CertificateItem,
} from "../../config/certificates";

export const AboutPage: React.FC = () => {
  const location = useLocation();

  // Dynamic certificates and company about state from admin storage
  const [certificates, setCertificates] = useState<CertificateItem[]>(getStoredCertificates);
  const [companyAbout, setCompanyAbout] = useState(getStoredCompanyAbout);
  const [selectedCert, setSelectedCert] = useState<CertificateItem | null>(null);
  const [certFilter, setCertFilter] = useState<string>("all");

  useEffect(() => {
    const handleCertsUpdate = () => {
      setCertificates(getStoredCertificates());
    };
    const handleAboutUpdate = () => {
      setCompanyAbout(getStoredCompanyAbout());
    };

    window.addEventListener("storage", handleCertsUpdate);
    window.addEventListener("certificates-updated", handleCertsUpdate);
    window.addEventListener("company-about-updated", handleAboutUpdate);

    return () => {
      window.removeEventListener("storage", handleCertsUpdate);
      window.removeEventListener("certificates-updated", handleCertsUpdate);
      window.removeEventListener("company-about-updated", handleAboutUpdate);
    };
  }, []);

  // Smooth scroll to anchor if URL contains hash (#company, #certification, #key-person)
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 150);
    }
  }, [location.hash]);

  const activeCerts = certificates.filter((c) => c.enabled !== false);
  const filteredCerts =
    certFilter === "all"
      ? activeCerts
      : activeCerts.filter((c) => c.category.toLowerCase().includes(certFilter.toLowerCase()));

  return (
    <div className="w-full relative">
      {/* ── Fixed background image (does not scroll when user scrolls) ── */}
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
      {/* Light blue/white soft translucent wash over fixed background */}
      <div className="fixed inset-0 -z-10 bg-sky-50/75 pointer-events-none" />

      {/* Page Hero — Clean Header Without Dark Bar */}
      <PageHero
        breadcrumbs={[{ label: "About Us" }]}
        title="Rooted in Odisha. Supplying the World."
        subtitle="Connecting authentic Indian farmers and modern spice mills directly to overseas wholesale buyers."
      />

      {/* ──────────────────────────────────────────────────── */}
      {/* 1. SECTION: COMPANY (#company) — Left Side Image, Right Side About Us */}
      {/* ──────────────────────────────────────────────────── */}
      <div id="company" className="scroll-mt-28 sm:scroll-mt-32">
        <Section tone="ivory" padding="compact" className="py-12 sm:py-16">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center max-w-6xl mx-auto">
              {/* LEFT SIDE: Company Facility & Export Headquarters Image (5 cols) */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="relative rounded-2xl overflow-hidden border border-sky-100 shadow-2xl bg-white group">
                  <div className="aspect-[4/5] sm:aspect-[4/4] lg:aspect-[4/5] w-full overflow-hidden relative">
                    <img
                      src={companyAbout.companyImage}
                      alt="A.G IMPORT & EXPORT Processing Hub & Warehouse"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest-950/85 via-forest-950/20 to-transparent" />

                    {/* Top Floating Badge */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                      <span className="px-3 py-1.5 rounded-full bg-forest-900/90 backdrop-blur-md text-gold-300 border border-gold-500/40 text-[11px] font-bold tracking-wider uppercase flex items-center gap-1.5 shadow-lg">
                        <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
                        <span>Govt. Registered Exporter</span>
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-forest-900 text-[10px] font-bold tracking-wider shadow-sm">
                        ISO 22000 FSMS
                      </span>
                    </div>

                    {/* Bottom Facility Info Card */}
                    <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-forest-900/90 backdrop-blur-md border border-forest-700/80 text-white shadow-xl">
                      <div className="flex items-center gap-3">
                        <img
                          src="/logo.png"
                          alt="A.G IMPORT & EXPORT"
                          className="w-10 h-10 object-contain shrink-0 rounded-full bg-white/10 p-0.5"
                        />
                        <div className="min-w-0">
                          <div className="font-sans font-bold text-sm text-gold-300 leading-tight truncate">
                            A.G IMPORT &amp; EXPORT
                          </div>
                          <div className="text-[11px] text-ivory-300/90 mt-0.5 truncate">
                            {companyAbout.companyBadge || "Processing Hub & Export Warehouse · Odisha, India"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3 Metric Mini Cards Under Image */}
                <div className="grid grid-cols-3 gap-2.5 text-center">
                  <div className="p-3 bg-white rounded-xl border border-sky-100 shadow-xs">
                    <div className="font-sans font-extrabold text-lg sm:text-xl text-forest-900">30+</div>
                    <div className="text-[10px] font-medium text-charcoal-light uppercase tracking-wider mt-0.5">
                      Countries
                    </div>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-sky-100 shadow-xs">
                    <div className="font-sans font-extrabold text-lg sm:text-xl text-amber-500">100%</div>
                    <div className="text-[10px] font-medium text-charcoal-light uppercase tracking-wider mt-0.5">
                      Lab Tested
                    </div>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-sky-100 shadow-xs">
                    <div className="font-sans font-extrabold text-lg sm:text-xl text-forest-900">5,000+</div>
                    <div className="text-[10px] font-medium text-charcoal-light uppercase tracking-wider mt-0.5">
                      MT Yearly
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE: Company About Us Lines (7 cols) */}
              <div className="lg:col-span-7 flex flex-col gap-5">
                <div className="space-y-2">
                  <Eyebrow tone="gold">About A.G Import &amp; Export</Eyebrow>
                  <h2 className="font-sans text-2xl sm:text-3xl lg:text-4xl font-extrabold text-forest-900 tracking-tight leading-tight">
                    {companyAbout.heading || "Rooted in Odisha's Fertile Highlands, Supplying Pure Spices to the World"}
                  </h2>
                </div>

                {/* Pull Quote */}
                <div className="p-4 sm:p-5 border-l-4 border-amber-500 bg-white rounded-r-xl shadow-xs border border-sky-100/60">
                  <p className="font-sans text-sm sm:text-base text-forest-900 leading-relaxed font-medium italic">
                    "{companyAbout.quote || "India has shared its spices with the world for hundreds of years. Inspired by ancient sea traders, we bring fresh, high-quality spices from trusted local farmers directly to global markets."}"
                  </p>
                  <div className="mt-2 text-[11px] font-bold text-amber-600 uppercase tracking-widest">
                    Pure Indian Spices · Guaranteed Origin · Global Seaports
                  </div>
                </div>

                {/* Story Lines */}
                <div className="space-y-3 text-xs sm:text-sm text-charcoal-light leading-relaxed">
                  <p>
                    <strong>A.G IMPORT &amp; EXPORT (Aryavansh Global)</strong> is a premier Indian merchant and manufacturer exporter delivering authentic, single-origin whole and ground spices to overseas food manufacturers, repackers, and wholesale distributors.
                  </p>
                  <p>
                    We work directly with certified tribal grower cooperatives in the high-altitude hills of <strong>Kandhamal and Koraput, Odisha</strong>, where chemical-free turmeric and ginger have been cultivated in mineral-rich red soil for generations. Our network also stretches across Kerala's Malabar pepper coast and Andhra Pradesh's sun-dried chilli belts.
                  </p>
                  <p>
                    Every batch undergoes mechanical cleaning, destoning, sun-curing, and rigorous testing for moisture levels, curcumin content, and volatile essential oils before being packed into food-grade jute or multi-wall bags for containerized ocean shipment.
                  </p>
                </div>

                {/* Core Strengths Checklist */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                  <div className="flex items-start gap-2 text-xs text-forest-900 bg-white p-2.5 rounded-lg border border-sky-100 shadow-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Direct Farmer Sourcing:</strong> Fair trade prices &amp; zero middlemen.</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-forest-900 bg-white p-2.5 rounded-lg border border-sky-100 shadow-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Certified Lab Quality:</strong> Tested for purity, curcumin &amp; moisture.</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-forest-900 bg-white p-2.5 rounded-lg border border-sky-100 shadow-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Complete Export Papers:</strong> Phytosanitary, COO &amp; BL included.</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-forest-900 bg-white p-2.5 rounded-lg border border-sky-100 shadow-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Worldwide Shipping:</strong> FOB, CFR, CIF to 30+ destinations.</span>
                  </div>
                </div>

                {/* Direct CTA Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-3">
                  <Button to="/products" variant="primary" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Explore Products Catalog
                  </Button>
                  <Button to="/contact" variant="outline" size="sm">
                    Contact Our Trade Desk
                  </Button>
                </div>
              </div>
            </div>
          </Container>
        </Section>
      </div>

      {/* ──────────────────────────────────────────────────── */}
      {/* 2. SECTION: CERTIFICATION (#certification) — Dynamic Uploaded Certificates & Memberships */}
      {/* ──────────────────────────────────────────────────── */}
      <div id="certification" className="scroll-mt-28 sm:scroll-mt-32">
        <Section tone="ivory-deep" padding="compact" className="py-12 sm:py-16">
          <Container>
            <div className="max-w-6xl mx-auto">
              <div className="mb-8 text-center max-w-3xl mx-auto">
                <h2 className="font-sans text-2xl sm:text-3xl font-extrabold text-forest-900 tracking-tight mb-2">
                  Official Certifications, Memberships &amp; Food Safety Standards
                </h2>
                <p className="text-xs sm:text-sm text-charcoal-light mt-1.5 leading-relaxed">
                  Every spice shipment follows strict national and international food safety rules. Click any certificate to inspect the verified official document.
                </p>

                {/* Filter Pills */}
                <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
                  {[
                    { id: "all", label: "All Credentials" },
                    { id: "license", label: "Export Licenses" },
                    { id: "safety", label: "Food Safety & Quality" },
                    { id: "membership", label: "Trade Memberships" },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setCertFilter(f.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                        certFilter === f.id
                          ? "bg-forest-900 text-white shadow-sm"
                          : "bg-white text-charcoal border border-sky-100 hover:border-amber-400 hover:text-amber-700"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid of Uploaded Certificates & Memberships */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredCerts.map((cert) => (
                  <div
                    key={cert.id}
                    onClick={() => setSelectedCert(cert)}
                    className="group p-5 bg-white rounded-xl border border-sky-100 shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between cursor-pointer"
                  >
                    <div>
                      {/* Top Bar with Category & Reg No */}
                      <div className="flex items-center justify-between pb-3 mb-3 border-b border-sky-100 text-[11px]">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold uppercase tracking-wider">
                          {cert.category}
                        </span>
                        <span className="font-mono text-amber-700 font-semibold truncate max-w-[150px]">
                          {cert.regNo || "Verified"}
                        </span>
                      </div>

                      {/* Certificate Thumbnail Preview */}
                      <div className="relative aspect-[16/10] w-full rounded-lg overflow-hidden bg-slate-100 border border-slate-200 mb-3.5 group-hover:border-amber-400 transition-colors">
                        <img
                          src={cert.imageUrl}
                          alt={cert.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-forest-950/20 group-hover:bg-forest-950/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 duration-300">
                          <span className="px-3 py-1.5 rounded-full bg-white text-forest-900 text-xs font-bold shadow-lg flex items-center gap-1.5">
                            <Eye className="w-3.5 h-3.5 text-amber-600" />
                            <span>View Document</span>
                          </span>
                        </div>
                      </div>

                      {/* Title & Authority */}
                      <h3 className="font-sans text-base sm:text-lg font-bold text-forest-900 mb-1 group-hover:text-amber-600 transition-colors">
                        {cert.title}
                      </h3>
                      <p className="text-[11px] text-amber-700 font-medium mb-2">
                        {cert.authority}
                      </p>
                      <p className="text-xs text-charcoal-light leading-relaxed line-clamp-2">
                        {cert.description || "Official statutory compliance document authorizing bulk spice export."}
                      </p>
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-charcoal-light">
                        Valid: <strong className="text-forest-900">{cert.validTill || "Active"}</strong>
                      </span>
                      <span className="text-amber-600 font-bold group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                        <span>Inspect</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </Section>
      </div>

      {/* ──────────────────────────────────────────────────── */}
      {/* CERTIFICATE LIGHTBOX / DOCUMENT INSPECTION MODAL */}
      {/* ──────────────────────────────────────────────────── */}
      {selectedCert && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={() => setSelectedCert(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-sky-200 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
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

            {/* Modal Image Body */}
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

            {/* Modal Footer */}
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

      {/* ──────────────────────────────────────────────────── */}
      {/* 3. SECTION: KEY PERSON (#key-person) */}
      {/* ──────────────────────────────────────────────────── */}
      <div id="key-person" className="scroll-mt-28 sm:scroll-mt-32">
        <Section tone="ivory" padding="compact" className="py-12 sm:py-16">
          <Container>
            <div className="max-w-4xl mx-auto">
              <div className="mb-8 text-center">
                <h2 className="font-sans text-2xl sm:text-3xl font-extrabold text-forest-900 tracking-tight mb-2">
                  Key People &amp; Trade Directors
                </h2>
                <p className="text-xs sm:text-sm text-charcoal-light mt-1.5 max-w-xl mx-auto leading-relaxed">
                  Meet our experienced team handling farm sourcing, lab testing, and ocean shipments.
                </p>
              </div>

              {/* Leadership Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[
                  {
                    name: "Rajesh Mohanty",
                    role: "Managing Director & Co-Founder",
                    bio: "Over 18 years of experience in agricultural procurement, international trade law, and containerized spice logistics.",
                    contact: "rajesh@indianspiceexport.com",
                    image:
                      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
                  },
                  {
                    name: "Dr. Ananya Patnaik",
                    role: "Director of Quality & Food Safety",
                    bio: "PhD in Food Technology. Former senior consultant to regional spice boards with deep expertise in aflatoxin and moisture controls.",
                    contact: "quality@indianspiceexport.com",
                    image:
                      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
                  },
                  {
                    name: "Suresh Nayak",
                    role: "Head of Farmer Relations & Sourcing",
                    bio: "Born into an agricultural family in Kandhamal. Direct liaison with over 1,200 tribal farmers in Koraput and Kandhamal.",
                    contact: "sourcing@indianspiceexport.com",
                    image:
                      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
                  },
                ].map((person, idx) => (
                  <div
                    key={idx}
                    className="p-6 bg-white rounded-xl border border-sky-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-16 h-16 rounded-full overflow-hidden mb-4 border-2 border-amber-400 mx-auto shadow-sm">
                        <img
                          src={person.image}
                          alt={person.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="font-sans text-lg font-bold text-forest-900 text-center">
                        {person.name}
                      </h3>
                      <div className="text-xs text-amber-600 font-semibold text-center mt-0.5 mb-3">
                        {person.role}
                      </div>
                      <p className="text-xs text-charcoal-light leading-relaxed text-center">
                        {person.bio}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-center gap-3">
                      <a
                        href={`mailto:${person.contact}`}
                        className="text-xs text-forest-800 hover:text-amber-600 font-medium inline-flex items-center gap-1.5 transition-colors"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Direct Email</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </Section>
      </div>

      {/* Frequently Asked Questions */}
      <Section tone="ivory-deep" padding="compact" className="py-12 sm:py-16">
        <Container>
          <div className="max-w-3xl mx-auto">
            <div className="mb-8 text-center">
              <h2 className="font-sans text-2xl sm:text-3xl font-extrabold text-forest-900 tracking-tight mb-2">
                Frequently Asked Questions
              </h2>
              <p className="text-xs sm:text-sm text-charcoal-light mt-1.5 max-w-xl mx-auto leading-relaxed">
                Common questions from commercial importers and procurement directors.
              </p>
            </div>

            <Accordion
              items={MOCK_FAQS.map((faq, i) => ({
                id: `faq-${i}`,
                title: faq.question,
                content: faq.answer,
              }))}
            />
          </div>
        </Container>
      </Section>

      {/* Final Call to Action */}
      <CTABand
        title="Ready to source certified spices directly from India?"
        subtitle="Request crop specifications, laboratory analysis sheets, or a competitive CIF container quotation."
        primaryCtaText="Request Export Quotation"
        primaryCtaLink="/request-quote"
      />
    </div>
  );
};
