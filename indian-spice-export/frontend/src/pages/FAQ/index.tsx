import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  HelpCircle,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { Container } from "../../components/ui/Container";
import { Section } from "../../components/ui/Section";
import { PageHero } from "../../components/ui/PageHero";
import { Eyebrow } from "../../components/ui/Eyebrow";
import { Accordion } from "../../components/ui/Accordion";
import { Button } from "../../components/ui/Button";
import { CTABand } from "../../components/ui/CTABand";
import { getStoredFAQs, FAQItemData } from "../../config/siteContent";
import { buildWhatsAppLink } from "../../config/company";

export const FAQPage: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQItemData[]>(getStoredFAQs);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    const handleUpdate = () => {
      setFaqs(getStoredFAQs());
    };
    window.addEventListener("storage", handleUpdate);
    window.addEventListener("faqs-updated", handleUpdate);
    return () => {
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("faqs-updated", handleUpdate);
    };
  }, []);

  const activeFaqs = faqs.filter((f) => f.enabled !== false);

  const categories = useMemo(() => {
    const set = new Set(activeFaqs.map((f) => f.category));
    return ["all", ...Array.from(set)];
  }, [activeFaqs]);

  const filteredFaqs = useMemo(() => {
    return activeFaqs.filter((f) => {
      const matchCat =
        selectedCategory === "all" ||
        f.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchSearch =
        !searchQuery.trim() ||
        f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [activeFaqs, selectedCategory, searchQuery]);

  const whatsappUrl = buildWhatsAppLink("Hello, I have an export inquiry regarding spice shipping & terms.");

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
        breadcrumbs={[{ label: "Support" }, { label: "Frequently Asked Questions" }]}
        title="Frequently Asked Questions (F &amp; Q)"
        subtitle="Clear answers on international maritime shipping, laboratory assays, Incoterms, and bulk packaging specifications."
      />

      <Section tone="ivory" padding="compact" className="py-12 sm:py-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            {/* Search & Filter Bar */}
            <div className="bg-white p-4 sm:p-6 rounded-2xl border border-sky-100 shadow-md mb-8">
              <div className="relative mb-4">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search questions by topic (e.g., ports, moisture, samples, payment)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                />
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap items-center gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                      selectedCategory === cat
                        ? "bg-forest-900 text-white shadow-xs"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {cat === "all" ? "All Questions" : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Questions Count Indicator */}
            <div className="flex items-center justify-between mb-4 px-1 text-xs text-charcoal-light">
              <span>Showing {filteredFaqs.length} answered questions</span>
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700 hover:text-emerald-800 font-semibold inline-flex items-center gap-1 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Ask Instant Question on WhatsApp</span>
                </a>
              )}
            </div>

            {/* Accordion List */}
            {filteredFaqs.length > 0 ? (
              <Accordion
                items={filteredFaqs.map((faq) => ({
                  id: faq.id,
                  title: faq.question,
                  content: faq.answer,
                }))}
              />
            ) : (
              <div className="p-12 bg-white rounded-xl border border-slate-200 text-center">
                <HelpCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                <h3 className="font-sans font-bold text-base text-forest-900">No matching questions found</h3>
                <p className="text-xs text-charcoal-light mt-1 mb-4">
                  Have a specific technical question regarding spice grades, customs, or container volumes?
                </p>
                <Button to="/contact" variant="primary" size="sm">
                  Contact Our Export Desk
                </Button>
              </div>
            )}
          </div>
        </Container>
      </Section>

      <CTABand
        title="Still have questions regarding your spice consignment?"
        subtitle="Speak directly with our trade team for instant clarity on CIF pricing, lead times, and crop samples."
        primaryCtaText="Contact Export Desk"
        primaryCtaLink="/contact"
      />
    </div>
  );
};

export default FAQPage;

