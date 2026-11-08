import React from "react";
import { Container } from "../../components/ui/Container";
import { Section } from "../../components/ui/Section";
import { PageHero } from "../../components/ui/PageHero";
import { Eyebrow } from "../../components/ui/Eyebrow";
import { COMPANY_CONFIG } from "../../config/company";

export const PrivacyPolicyPage: React.FC = () => {
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
        breadcrumbs={[{ label: "Privacy Policy" }]}
        title="Privacy & Data Governance Policy"
        subtitle="This document outlines how Indian Spice Export handles commercial buyer data, inquiry correspondence, and international trade communications."
      />

      <Section tone="ivory" padding="compact" className="py-8 sm:py-12">
        <Container>
          <div className="max-w-4xl mx-auto flex flex-col gap-10">
            {/* Legal Notice Callout */}
            <div className="p-4 bg-gold-500/10 border border-gold-500/30 rounded-[2px] text-xs text-charcoal leading-relaxed">
              <strong>Template Notice:</strong> This policy serves as our initial commercial privacy framework and will be subject to periodic review by qualified legal counsel in accordance with applicable Indian and international trade laws.
            </div>

            {/* Table of Contents */}
            <div className="p-6 bg-ivory-100 rounded-[2px] border border-ivory-300">
              <h3 className="font-serif text-lg text-forest-900 font-normal mb-3">
                Table of Contents
              </h3>
              <ol className="list-decimal list-inside space-y-1.5 text-sm text-charcoal-light">
                <li><a href="#section-1" className="hover:text-gold-600 transition-colors">Information We Collect from Commercial Inquiries</a></li>
                <li><a href="#section-2" className="hover:text-gold-600 transition-colors">Purpose of Processing Commercial Data</a></li>
                <li><a href="#section-3" className="hover:text-gold-600 transition-colors">Data Retention & International Port Compliance</a></li>
                <li><a href="#section-4" className="hover:text-gold-600 transition-colors">Third-Party Logistics & Banking Disclosures</a></li>
                <li><a href="#section-5" className="hover:text-gold-600 transition-colors">Trade Desk Contact Information</a></li>
              </ol>
            </div>

            {/* Sections */}
            <div className="space-y-8 text-sm sm:text-base text-charcoal-light leading-relaxed">
              <section id="section-1" className="space-y-3">
                <h2 className="font-serif text-xl sm:text-2xl text-forest-900 font-normal">
                  1. Information We Collect from Commercial Inquiries
                </h2>
                <p>
                  When you submit an export inquiry, request commodity samples, or communicate via email or WhatsApp, we collect: representative name, corporate trading name, business email address, corporate telephone or WhatsApp number, company registered address, destination port preferences, and specific botanical commodity parameters.
                </p>
              </section>

              <section id="section-2" className="space-y-3">
                <h2 className="font-serif text-xl sm:text-2xl text-forest-900 font-normal">
                  2. Purpose of Processing Commercial Data
                </h2>
                <p>
                  Commercial details are processed solely to prepare itemized proforma quotations, verify import/export documentation, coordinate customs filings, arrange ocean freight bookings, and execute bilateral sales contracts. We do not sell or rent business contact data.
                </p>
              </section>

              <section id="section-3" className="space-y-3">
                <h2 className="font-serif text-xl sm:text-2xl text-forest-900 font-normal">
                  3. Data Retention & International Port Compliance
                </h2>
                <p>
                  Under Indian customs and Foreign Trade (Development and Regulation) guidelines, transaction paperwork (commercial invoices, shipping bills, certificates of origin) must be maintained in trade archives for statutory audit periods.
                </p>
              </section>

              <section id="section-4" className="space-y-3">
                <h2 className="font-serif text-xl sm:text-2xl text-forest-900 font-normal">
                  4. Third-Party Logistics & Banking Disclosures
                </h2>
                <p>
                  To complete export deliveries, consignment data is shared with designated shipping lines, freight forwarders, accredited testing laboratories (e.g. SGS / Eurofins), and authorized negotiating banks under Letter of Credit procedures.
                </p>
              </section>

              <section id="section-5" className="space-y-3">
                <h2 className="font-serif text-xl sm:text-2xl text-forest-900 font-normal">
                  5. Trade Desk Contact Information
                </h2>
                <p>
                  For inquiries regarding your commercial data or to update procurement representative contacts, please email: <strong>{COMPANY_CONFIG.contact.email}</strong>.
                </p>
              </section>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
};
