import React from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Search,
  Calculator,
  Sparkles,
  Boxes,
  Ship,
  CheckCircle2,
  Anchor,
  FileCheck,
  Compass,
  ArrowRight,
} from "lucide-react";
import { Container } from "../../components/ui/Container";
import { Section } from "../../components/ui/Section";
import { PageHero } from "../../components/ui/PageHero";
import { Eyebrow } from "../../components/ui/Eyebrow";
import { Accordion } from "../../components/ui/Accordion";
import { CTABand } from "../../components/ui/CTABand";
import { MOCK_EXPORT_PROCESS_STEPS, MOCK_FAQS } from "../../services/mock";

export const ExportProcessPage: React.FC = () => {
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
        breadcrumbs={[{ label: "Export Process" }]}
        title="The 7 Steps to Export Spices"
        subtitle="From sample approval to your seaport, every step is clear, simple, and fully tracked."
      />

      {/* 7-Step Sequence: 3 Boxes per Row Grid */}
      <Section tone="ivory" padding="compact" className="py-8 sm:py-12">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {MOCK_EXPORT_PROCESS_STEPS.map((step) => (
              <div
                key={step.stepNumber}
                className="p-6 sm:p-7 bg-white rounded-xl border border-sky-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar: Step Number & Duration Badge */}
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-sky-100">
                    <span className="font-sans font-extrabold text-3xl sm:text-4xl text-amber-500">
                      {String(step.stepNumber).padStart(2, "0")}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-sky-50 text-sky-800 border border-sky-200 text-[10px] font-bold uppercase tracking-wider">
                      {step.duration}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="text-[10px] font-eyebrow text-gold-600 uppercase tracking-widest font-bold">
                    Stage {step.stepNumber} Milestone
                  </div>
                  <h3 className="font-sans text-lg sm:text-xl font-bold text-forest-900 mt-1 mb-2 leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-charcoal-light leading-relaxed mb-4">
                    {step.description}
                  </p>
                </div>

                {/* Deliverables & Actions */}
                <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
                  <div className="p-2.5 bg-sky-50/70 rounded-md border border-sky-200/80">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-sky-800 block mb-0.5">
                      Deliverable Provided:
                    </span>
                    <span className="text-slate-700 leading-snug block">
                      {step.deliverable}
                    </span>
                  </div>

                  <div className="p-2.5 bg-amber-50/70 rounded-md border border-amber-200/80">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block mb-0.5">
                      Action from Buyer:
                    </span>
                    <span className="text-slate-700 leading-snug block">
                      {step.actionRequired}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Support CTA Card (Span 2 columns on lg to complete the 3-column row) */}
            <div className="md:col-span-2 lg:col-span-2 bg-gradient-to-br from-forest-900 via-forest-900 to-forest-950 text-white p-6 sm:p-7 rounded-xl border border-forest-800 shadow-md flex flex-col justify-between">
              <div>
                <span className="px-2.5 py-1 rounded-full bg-gold-400/20 text-gold-300 border border-gold-400/30 text-[10px] font-bold uppercase tracking-wider inline-block mb-3">
                  Direct Trade Support
                </span>
                <h3 className="font-sans text-xl sm:text-2xl font-bold text-white mb-2">
                  Ready to Start Your Export Order?
                </h3>
                <p className="text-xs sm:text-sm text-ivory-300/80 leading-relaxed max-w-xl">
                  Our trade directors oversee every step of this 7-stage pipeline personally, from laboratory compliance in Odisha to container sealing at the ocean port.
                </p>
              </div>

              <div className="pt-4 mt-5 border-t border-forest-800/80 flex flex-wrap items-center gap-3">
                <Link
                  to="/request-quote"
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-forest-950 text-xs font-bold rounded-sm inline-flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <span>Request a Free Price Quote</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to="/contact"
                  className="px-5 py-2.5 border border-ivory-200/40 hover:border-ivory-200 text-ivory-100 text-xs font-semibold rounded-sm inline-flex items-center gap-1.5 transition-colors"
                >
                  <span>Speak to Export Desk</span>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Export Documentation & Shipping Ports */}
      <Section tone="ivory-deep" padding="normal">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Documentation Suite */}
            <div className="p-8 bg-ivory-100 rounded-[2px] border border-ivory-300">
              <div className="flex items-center gap-3 mb-4">
                <FileCheck className="w-6 h-6 text-gold-600" />
                <h3 className="font-serif text-2xl text-forest-900 font-normal">
                  Standard Documentation Suite
                </h3>
              </div>
              <p className="text-sm text-charcoal-light leading-relaxed mb-6">
                All consignments leave Indian territorial ports with verified statutory and trade paperwork:
              </p>
              <ul className="space-y-3 text-sm text-charcoal">
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-500 shrink-0 mt-2" />
                  <span><strong>Clean On Board Ocean Bill of Lading</strong> (Original 3/3 set)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-500 shrink-0 mt-2" />
                  <span><strong>Certificate of Origin</strong> issued by authorized Chamber of Commerce</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-500 shrink-0 mt-2" />
                  <span><strong>Phytosanitary Certificate</strong> issued by Directorate of Plant Protection</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-500 shrink-0 mt-2" />
                  <span><strong>Fumigation & Pest Free Certificate</strong> (Methyl Bromide / Aluminium Phosphide)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-500 shrink-0 mt-2" />
                  <span><strong>Independent Laboratory Assay Report</strong> (Eurofins / SGS upon contract)</span>
                </li>
              </ul>
            </div>

            {/* Maritime Ports & Logistics */}
            <div className="p-8 bg-ivory-100 rounded-[2px] border border-ivory-300">
              <div className="flex items-center gap-3 mb-4">
                <Anchor className="w-6 h-6 text-gold-600" />
                <h3 className="font-serif text-2xl text-forest-900 font-normal">
                  Indian Exit Ports & Incoterms
                </h3>
              </div>
              <p className="text-sm text-charcoal-light leading-relaxed mb-6">
                Cargo routing is optimized depending on origin belt and sea-transit velocity:
              </p>
              <ul className="space-y-3 text-sm text-charcoal">
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-forest-800 shrink-0 mt-2" />
                  <span><strong>Paradip & Kolkata Ports:</strong> Primary maritime gateways for Odisha turmeric & ginger.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-forest-800 shrink-0 mt-2" />
                  <span><strong>Visakhapatnam & Chennai:</strong> Deep-draft container terminals for southern and central lots.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-forest-800 shrink-0 mt-2" />
                  <span><strong>Cochin Port:</strong> Western corridor hub for Malabar black pepper and cardamom.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-forest-800 shrink-0 mt-2" />
                  <span><strong>Supported Incoterms:</strong> FOB (Free On Board), CFR (Cost & Freight), and CIF (Cost, Insurance & Freight).</span>
                </li>
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      {/* FAQ Accordion */}
      <Section tone="ivory" padding="normal">
        <Container>
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="font-sans text-2xl sm:text-3xl font-extrabold text-forest-900 tracking-tight">
                Shipping &amp; Export FAQs
              </h2>
            </div>
            <Accordion
              items={MOCK_FAQS.map((faq, i) => ({
                id: `faq-exp-${i}`,
                title: faq.question,
                content: faq.answer,
              }))}
            />
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <CTABand
        title="Submit your preliminary requirement"
        subtitle="Stage 1 begins with a straightforward technical review of your spice grades and port requirements."
      />
    </div>
  );
};
