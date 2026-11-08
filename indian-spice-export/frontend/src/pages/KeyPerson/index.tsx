import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Mail,
  Phone,
  ShieldCheck,
  Award,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { Container } from "../../components/ui/Container";
import { Section } from "../../components/ui/Section";
import { PageHero } from "../../components/ui/PageHero";
import { Eyebrow } from "../../components/ui/Eyebrow";
import { Button } from "../../components/ui/Button";
import { CTABand } from "../../components/ui/CTABand";
import {
  getStoredKeyPeople,
  KeyPersonItem,
} from "../../config/siteContent";

export const KeyPersonPage: React.FC = () => {
  const [people, setPeople] = useState<KeyPersonItem[]>(getStoredKeyPeople);

  useEffect(() => {
    const handleUpdate = () => {
      setPeople(getStoredKeyPeople());
    };
    window.addEventListener("storage", handleUpdate);
    window.addEventListener("key-people-updated", handleUpdate);
    return () => {
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("key-people-updated", handleUpdate);
    };
  }, []);

  const activePeople = people.filter((p) => p.enabled !== false);

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
        breadcrumbs={[{ label: "About", to: "/about" }, { label: "Key People" }]}
        title="Key People &amp; Trade Directors"
        subtitle="Meet our experienced leadership overseeing farm sourcing, laboratory assays, and global maritime shipments."
      />

      <Section tone="ivory" padding="compact" className="py-12 sm:py-16">
        <Container>
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <Eyebrow tone="gold">Leadership &amp; Governance</Eyebrow>
              <h2 className="font-sans text-2xl sm:text-3xl font-extrabold text-forest-900 tracking-tight mt-1.5">
                Executive Leadership &amp; Operational Directors
              </h2>
              <p className="text-xs sm:text-sm text-charcoal-light mt-2 leading-relaxed">
                Direct points of contact for institutional importers, private label partners, and commercial trade contracts.
              </p>
            </div>

            {/* Grid of Key People */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activePeople.map((person) => (
                <div
                  key={person.id}
                  className="bg-white rounded-2xl border border-sky-100 shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {/* Person Photo Box */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                      <img
                        src={person.image}
                        alt={person.name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                      {person.experience && (
                        <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-forest-900/90 backdrop-blur-md text-gold-300 text-[10px] font-bold border border-gold-500/30">
                          {person.experience}
                        </div>
                      )}
                    </div>

                    {/* Person Details */}
                    <div className="p-6">
                      <h3 className="font-sans text-xl font-bold text-forest-900">
                        {person.name}
                      </h3>
                      <div className="text-xs font-semibold text-amber-700 mt-0.5 mb-3">
                        {person.role}
                      </div>
                      <p className="text-xs text-charcoal-light leading-relaxed">
                        {person.bio}
                      </p>
                    </div>
                  </div>

                  {/* Direct Contact Bar */}
                  <div className="px-6 py-4 bg-sky-50/50 border-t border-sky-100 flex flex-col gap-2 text-xs">
                    <a
                      href={`mailto:${person.contactEmail}`}
                      className="inline-flex items-center gap-2 text-forest-900 hover:text-amber-600 transition-colors truncate font-medium"
                    >
                      <Mail className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span className="truncate">{person.contactEmail}</span>
                    </a>
                    {person.phone && (
                      <a
                        href={`tel:${person.phone.replace(/\s+/g, "")}`}
                        className="inline-flex items-center gap-2 text-charcoal-light hover:text-forest-900 transition-colors font-mono text-[11px]"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{person.phone}</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <CTABand
        title="Speak directly with our trade directors"
        subtitle="Need custom crop grading, special moisture parameters, or institutional tenders? Connect with our trade desk."
        primaryCtaText="Contact Trade Desk"
        primaryCtaLink="/contact"
      />
    </div>
  );
};

export default KeyPersonPage;

