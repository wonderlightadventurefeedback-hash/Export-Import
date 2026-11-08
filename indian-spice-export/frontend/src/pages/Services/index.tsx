import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Boxes,
  PackageCheck,
  Tags,
  FileCheck2,
  ShieldCheck,
  ArrowRight,
  Check,
} from "lucide-react";
import { Container } from "../../components/ui/Container";
import { Section } from "../../components/ui/Section";
import { PageHero } from "../../components/ui/PageHero";
import { Eyebrow } from "../../components/ui/Eyebrow";
import { Button } from "../../components/ui/Button";
import { CTABand } from "../../components/ui/CTABand";
import { getStoredServices, WholesaleServiceItem } from "../../config/siteContent";

export const ServicesPage: React.FC = () => {
  const [services, setServices] = useState<WholesaleServiceItem[]>(getStoredServices);

  useEffect(() => {
    const handleUpdate = () => {
      setServices(getStoredServices());
    };
    window.addEventListener("storage", handleUpdate);
    window.addEventListener("services-updated", handleUpdate);
    return () => {
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("services-updated", handleUpdate);
    };
  }, []);

  const activeServices = services.filter((s) => s.enabled !== false);

  return (
    <div className="w-full relative min-h-screen">
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
        breadcrumbs={[{ label: "Wholesale Services" }]}
        title="Wholesale Supply &amp; Custom Packaging Services"
        subtitle="Full container export and custom packaging for food brands, supermarket chains, and wholesale distributors worldwide."
      />

      {/* 2-Column Grid: One Row Two Boxes */}
      <Section tone="ivory" padding="compact" className="py-8 sm:py-12">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {activeServices.map((serv) => (
              <div
                key={serv.id}
                className="p-6 sm:p-8 lg:p-9 bg-white rounded-xl border border-sky-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar with Number & Badge */}
                  <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-sky-100">
                    <span className="font-sans font-bold text-3xl sm:text-4xl text-amber-500">
                      {serv.number}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-sky-50 text-sky-800 border border-sky-200 text-[10px] font-bold uppercase tracking-wider">
                      {serv.subtitle}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-sans text-xl sm:text-2xl text-forest-900 font-bold mb-2">
                    {serv.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-charcoal-light leading-relaxed mb-5">
                    {serv.description}
                  </p>

                  {/* Key Deliverables List */}
                  {serv.features && serv.features.length > 0 && (
                    <div className="pt-4 border-t border-slate-100">
                      <div className="text-[11px] font-bold text-forest-800 uppercase tracking-wider mb-2.5">
                        Key Deliverables
                      </div>
                      <ul className="space-y-2">
                        {serv.features.map((f, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                            <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Bottom Action Button */}
                <div className="pt-5 mt-6 border-t border-slate-100">
                  <Button
                    to={`/request-quote?service=${encodeURIComponent(serv.title)}`}
                    variant="primary"
                    size="sm"
                    className="w-full justify-center"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Enquire About This Service
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Global Shipping Assurance Strip */}
      <Section tone="ivory-deep" padding="compact" className="py-10">
        <Container>
          <div className="p-8 bg-white rounded-xl border border-sky-100 shadow-sm max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <span className="text-xs font-eyebrow uppercase tracking-widest text-gold-600 font-bold">
                Export Grade Assurance
              </span>
              <h3 className="font-sans text-xl sm:text-2xl font-bold text-forest-900">
                Need Custom Private Labeling or Bulk Sacks?
              </h3>
              <p className="text-xs sm:text-sm text-charcoal-light max-w-xl">
                We accommodate buyer-specified branding, multi-wall kraft bags, vacuum foil pouches, and barcoding for supermarket distribution.
              </p>
            </div>
            <div className="shrink-0 flex flex-wrap gap-3">
              <Button to="/request-quote" variant="primary" size="md">
                Request Service Quote
              </Button>
              <Button to="/contact" variant="outline" size="md">
                Speak with Trade Desk
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      <CTABand
        title="Looking for verified Indian spice wholesale supply?"
        subtitle="Contact our export desk to receive complete product sheets, laboratory assays, or a formal CIF container quotation."
        primaryCtaText="Request Commercial Quote"
        primaryCtaLink="/request-quote"
      />
    </div>
  );
};

export default ServicesPage;
