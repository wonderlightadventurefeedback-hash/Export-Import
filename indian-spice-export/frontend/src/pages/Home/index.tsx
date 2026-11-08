import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  MessageSquareQuote,
  ArrowRight,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Boxes,
  Truck,
  FileCheck2,
  Award,
} from "lucide-react";
import { Container } from "../../components/ui/Container";
import { Section } from "../../components/ui/Section";
import { Eyebrow } from "../../components/ui/Eyebrow";
import { SectionHeading } from "../../components/ui/SectionHeading";
import { Button } from "../../components/ui/Button";
import { CategoryTile } from "../../components/ui/CategoryTile";
import { CommercialServicesSegmented } from "../../components/ui/CommercialServicesSegmented";
import { BusinessGallery } from "../../components/ui/BusinessGallery";
import { CTABand } from "../../components/ui/CTABand";
import { MOCK_CATEGORIES } from "../../services/mock";
import { publicApi } from "../../services/api";
import { COMPANY_CONFIG } from "../../config/company";
import {
  getStoredHomeSettings,
  HomePageSettings,
} from "../../config/siteContent";

const HERO_IMAGES = [
  {
    src: "https://static.investindia.gov.in/s3fs-public/2024-12/opportunities_for_export-oriented_businesses_in_india.jpg",
    alt: "Export-oriented businesses in India — spice trade opportunities",
  },
  {
    src: "https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&w=1920&q=85",
    alt: "Vibrant Indian spices displayed in traditional bowls",
  },
  {
    src: "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=1920&q=85",
    alt: "Golden turmeric powder and whole spices for export",
  },
  {
    src: "https://www.gimbooks.com/blog/content/images/2026/02/How-to-Start-an-Export-Business-in-India.jpg",
    alt: "Spice merchant handling premium grade Indian spices",
  },
  {
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTb6K-suGbvjEQNVMEVDVZj6wG2RHBpSpyBrQVuDWnmNw&s=10",
    alt: "Assorted whole spices — cardamom, cinnamon, cloves and pepper",
  },
];

export const HomePage: React.FC = () => {
  const [categories, setCategories] = useState(MOCK_CATEGORIES);
  const [homeSettings, setHomeSettings] = useState<HomePageSettings>(getStoredHomeSettings);
  const [heroIndex, setHeroIndex] = useState(0);

  // Sync settings dynamically from Admin Panel
  useEffect(() => {
    const handleUpdate = () => {
      setHomeSettings(getStoredHomeSettings());
    };
    window.addEventListener("storage", handleUpdate);
    window.addEventListener("home-settings-updated", handleUpdate);
    return () => {
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("home-settings-updated", handleUpdate);
    };
  }, []);

  // Fetch categories from API
  useEffect(() => {
    publicApi
      .getCategories()
      .then((cats) => {
        if (cats && cats.length > 0) setCategories(cats);
      })
      .catch(() => {});
  }, []);

  // Auto-advance hero slides every 5.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full">
      {/* ──────────────────────────────────────────────────── */}
      {/* SECTION 1: HERO VIEWPORT WITH BUSINESS DETAILS */}
      {/* ──────────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] sm:min-h-screen flex items-center justify-center overflow-hidden bg-forest-950 text-ivory-100">
        {/* Fullscreen background images with fade transitions */}
        <div className="absolute inset-0">
          {HERO_IMAGES.map((img, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
                idx === heroIndex ? "opacity-100" : "opacity-0"
              }`}
              style={{ backgroundImage: `url('${img.src}')` }}
            />
          ))}
          {/* High transparency overlay — vibrant background image clearly visible */}
          <div
            className="absolute inset-0 bg-forest-950 transition-opacity duration-300"
            style={{
              opacity: ((homeSettings.heroOverlayOpacity && homeSettings.heroOverlayOpacity !== 88) ? homeSettings.heroOverlayOpacity : 35) / 100,
            }}
          />
          {/* Gentle vignette to ensure Line 1 & Line 2 are crisp against the background */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/35 pointer-events-none" />
        </div>

        {/* Carousel indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {HERO_IMAGES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setHeroIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === heroIndex ? "w-8 bg-gold-400" : "w-2 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>

        <Container className="relative z-10 pt-28 pb-20 sm:py-36">
          <div className="max-w-4xl mx-auto text-center flex flex-col items-center justify-center">
            {/* Line 1: Headline */}
            <h1 className="font-sans font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.15] drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)] text-center">
              {homeSettings.heroTitle}
            </h1>

            {/* Line 2: Subtitle */}
            <p className="mt-5 sm:mt-6 text-base sm:text-xl text-ivory-100 max-w-3xl font-medium leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)] text-center">
              {homeSettings.heroSubtitle}
            </p>
          </div>
        </Container>
      </section>

      {/* ──────────────────────────────────────────────────── */}
      {/* SECTION 2: EXPORT SPICES CATALOG SHOWCASE */}
      {/* ──────────────────────────────────────────────────── */}
      <Section tone="ivory" padding="compact" className="py-12 sm:py-16">
        <Container>
          {/* Centered Clean Header Title */}
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
            <Eyebrow tone="gold">Our Commodities</Eyebrow>
            <h2 className="font-sans text-2xl sm:text-3xl lg:text-4xl font-extrabold text-forest-900 tracking-tight leading-tight mt-1.5">
              Pure Indian Export Spices, Shipped Worldwide
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-light mt-2.5 max-w-xl mx-auto leading-relaxed">
              We source high-curcumin turmeric, Tellicherry black pepper, bold green cardamom, and dry red chillies directly from verified farms.
            </p>
          </div>

          {/* 4-column visual grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {categories.slice(0, 4).map((cat, idx) => (
              <CategoryTile key={cat.id} category={cat} index={idx} />
            ))}
          </div>

          <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-4 text-center">
            <Button
              to="/products"
              variant="primary"
              size="md"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              View Full Spice Catalog
            </Button>
            <Button to="/request-quote" variant="outline" size="md">
              Request Price Quotation
            </Button>
          </div>
        </Container>
      </Section>

      {/* ──────────────────────────────────────────────────── */}
      {/* SECTION 3: WHOLESALE SERVICES */}
      {/* ──────────────────────────────────────────────────── */}
      {homeSettings.showServices && (
        <Section tone="ivory-deep" padding="compact" className="py-12 sm:py-16">
          <Container>
            <div className="text-center mb-8 sm:mb-10 max-w-3xl mx-auto">
              <Eyebrow tone="gold">Commercial Export Capabilities</Eyebrow>
              <h2 className="font-sans text-2xl sm:text-3xl font-extrabold text-forest-900 tracking-tight mt-1.5">
                Wholesale Supply &amp; Custom Packaging for Overseas Buyers
              </h2>
              <p className="text-xs sm:text-sm text-charcoal-light mt-2 max-w-xl mx-auto leading-relaxed">
                Explore how we prepare, mechanically clean, lab-test, pack, and ship your container orders.
              </p>
              <div className="mt-4 flex justify-center">
                <Button to="/services" variant="outline" size="sm">
                  Explore All Services
                </Button>
              </div>
            </div>

            {/* Interactive Multi-Box Segmented UI */}
            <CommercialServicesSegmented />
          </Container>
        </Section>
      )}

      {/* ──────────────────────────────────────────────────── */}
      {/* SECTION 4: BUSINESS & FACILITY OPERATIONS GALLERY */}
      {/* ──────────────────────────────────────────────────── */}
      {homeSettings.showGallery && <BusinessGallery />}

      {/* ──────────────────────────────────────────────────── */}
      {/* SECTION 5: VERIFIED ACCREDITATIONS & BADGES */}
      {/* ──────────────────────────────────────────────────── */}
      <Section tone="ivory" padding="compact" className="py-10">
        <Container>
          <div className="border border-sky-200/80 bg-white p-6 sm:p-8 rounded-2xl shadow-sm text-center max-w-4xl mx-auto">
            <h3 className="font-sans text-base sm:text-lg font-bold text-forest-900 mb-2">
              Official Regulatory Accreditations
            </h3>
            <p className="text-xs text-charcoal-light max-w-xl mx-auto mb-6">
              Every shipment is backed by statutory registrations from the Ministry of Commerce &amp; Industry, APEDA, FSSAI, and global food safety standards.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-forest-900">
                <Award className="w-5 h-5 text-amber-500" />
                <span>Spices Board of India</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-forest-900">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>APEDA Registered</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-forest-900">
                <FileCheck2 className="w-5 h-5 text-sky-600" />
                <span>FSSAI Central License</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-forest-900">
                <ShieldCheck className="w-5 h-5 text-gold-600" />
                <span>ISO 22000 Certified FSMS</span>
              </div>
            </div>
            <div className="mt-6">
              <Button to="/certifications" variant="outline" size="sm">
                View All Certificate Documents
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      {/* ──────────────────────────────────────────────────── */}
      {/* SECTION 6: DIRECT EXPORT INQUIRY CTA BAND */}
      {/* ──────────────────────────────────────────────────── */}
      <CTABand
        title="Planning to import spices? Tell us what you need."
        subtitle="Send us your required spices, quantity, and destination seaport. We will send you a clear, competitive CIF price quote within 24 hours."
      />
    </div>
  );
};

export default HomePage;
