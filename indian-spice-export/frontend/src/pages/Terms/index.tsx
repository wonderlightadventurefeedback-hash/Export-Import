import React from "react";
import { Container } from "../../components/ui/Container";
import { Section } from "../../components/ui/Section";
import { PageHero } from "../../components/ui/PageHero";
import { Eyebrow } from "../../components/ui/Eyebrow";
import { COMPANY_CONFIG } from "../../config/company";

export const TermsPage: React.FC = () => {
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

      <PageHero
        breadcrumbs={[{ label: "Terms & Conditions" }]}
        title="Terms of Commercial Wholesale & Export"
        subtitle="General operating terms governing international trade quotations, sample evaluation, contract execution, and maritime shipping conditions."
      />

      <Section tone="ivory" padding="compact" className="py-8 sm:py-12">
        <Container>
          <div className="max-w-4xl mx-auto flex flex-col gap-10">
            {/* Legal Notice */}
            <div className="p-4 bg-gold-500/10 border border-gold-500/30 rounded-[2px] text-xs text-charcoal leading-relaxed">
              <strong>Commercial Framework Notice:</strong> Website listings represent preliminary technical specifications. Final prices, payment instruments, quality tolerances, and vessel schedules are established solely through formal signed bilateral commercial sales contracts.
            </div>

            {/* Table of Contents */}
            <div className="p-6 bg-ivory-100 rounded-[2px] border border-ivory-300">
              <h3 className="font-serif text-lg text-forest-900 font-normal mb-3">
                Table of Contents
              </h3>
              <ol className="list-decimal list-inside space-y-1.5 text-sm text-charcoal-light">
                <li><a href="#term-1" className="hover:text-gold-600 transition-colors">Quotation Validity & Market Pricing</a></li>
                <li><a href="#term-2" className="hover:text-gold-600 transition-colors">Pre-Shipment Samples & Assay Acceptance</a></li>
                <li><a href="#term-3" className="hover:text-gold-600 transition-colors">International Commercial Terms (Incoterms 2020)</a></li>
                <li><a href="#term-4" className="hover:text-gold-600 transition-colors">Inspection, Moisture & Quality Tolerances</a></li>
                <li><a href="#term-5" className="hover:text-gold-600 transition-colors">Jurisdiction & Arbitration</a></li>
              </ol>
            </div>

            {/* Terms Details */}
            <div className="space-y-8 text-sm sm:text-base text-charcoal-light leading-relaxed">
              <section id="term-1" className="space-y-3">
                <h2 className="font-serif text-xl sm:text-2xl text-forest-900 font-normal">
                  1. Quotation Validity & Market Pricing
                </h2>
                <p>
                  Because spice agricultural commodities are subject to seasonal harvest crop arrivals, international demand, and currency rates, proforma quotations issued by Indian Spice Export carry an explicit validity window (typically 3 to 7 business days unless specified otherwise in writing).
                </p>
              </section>

              <section id="term-2" className="space-y-3">
                <h2 className="font-serif text-xl sm:text-2xl text-forest-900 font-normal">
                  2. Pre-Shipment Samples & Assay Acceptance
                </h2>
                <p>
                  Representative pre-shipment samples are dispatched for verification. Approval of the reference lot sample constitutes technical acceptance of the visual, physical, and sensory standard for the subsequent bulk container load.
                </p>
              </section>

              <section id="term-3" className="space-y-3">
                <h2 className="font-serif text-xl sm:text-2xl text-forest-900 font-normal">
                  3. International Commercial Terms (Incoterms 2020)
                </h2>
                <p>
                  All shipments operate under standard ICC Incoterms 2020 definitions (FOB, CFR, CIF). Risk and marine insurance obligations transfer strictly according to the agreed Incoterm stipulated on the commercial invoice and ocean bill of lading.
                </p>
              </section>

              <section id="term-4" className="space-y-3">
                <h2 className="font-serif text-xl sm:text-2xl text-forest-900 font-normal">
                  4. Inspection, Moisture & Quality Tolerances
                </h2>
                <p>
                  Spices are natural agricultural products. Natural variances within contract tolerances (moisture, volatile oil, ASTA color value) are measured at the time of container stuffing by accredited inspection agencies. Independent survey reports issued at the port of loading are final with respect to weight and quality.
                </p>
              </section>

              <section id="term-5" className="space-y-3">
                <h2 className="font-serif text-xl sm:text-2xl text-forest-900 font-normal">
                  5. Jurisdiction & Arbitration
                </h2>
                <p>
                  Unless otherwise specified in the bilateral contract, disputes arising out of international sales contracts are subject to the commercial jurisdiction of the competent courts in Odisha, India, or resolved through international commercial arbitration under Indian Arbitration and Conciliation Act provisions.
                </p>
              </section>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
};
