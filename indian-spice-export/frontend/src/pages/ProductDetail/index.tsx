import React, { useState, useMemo, useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import {
  MessageSquareQuote,
  Phone,
  CheckCircle2,
  Package,
  Layers,
  MapPin,
  Calendar,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { Container } from "../../components/ui/Container";
import { Section } from "../../components/ui/Section";
import { Breadcrumbs } from "../../components/ui/Breadcrumbs";
import { Eyebrow } from "../../components/ui/Eyebrow";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { ProductCard } from "../../components/ui/ProductCard";
import { MOCK_PRODUCTS } from "../../services/mock";
import { publicApi } from "../../services/api";
import { buildProductWhatsAppLink } from "../../config/company";
import { Product } from "../../types";
import { cn } from "../../utils/cn";

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const fallbackProduct = useMemo(() => MOCK_PRODUCTS.find((p) => p.slug === slug), [slug]);
  const [product, setProduct] = useState<Product | undefined>(fallbackProduct);

  useEffect(() => {
    let active = true;
    if (slug) {
      publicApi.getProductBySlug(slug).then((res) => {
        if (active && res) {
          setProduct(res);
        }
      }).catch(() => { });
    }
    return () => { active = false; };
  }, [slug]);

  // If product not found, fallback to 404 or products catalog
  if (!product) {
    return (
      <div className="py-32 text-center">
        <Container>
          <h2 className="font-sans text-3xl font-bold text-forest-900">Spice Record Not Found</h2>
          <p className="mt-2 text-charcoal-light">The requested spice commodity does not exist or has been archived.</p>
          <div className="mt-6">
            <Button to="/products" variant="primary">
              Return to Spice Catalogue
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const activeImage = product.images[activeImageIndex] || product.images[0];
  const whatsappUrl = buildProductWhatsAppLink(product.name, product.grades?.[0]);

  // Related products from same category
  const relatedProducts = MOCK_PRODUCTS.filter(
    (p) => p.id !== product.id && p.categorySlug === product.categorySlug
  ).slice(0, 3);

  // Format spec labels nicely
  const formatSpecKey = (key: string): string => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .replace(/Max$/, " (Max)")
      .replace(/Min$/, " (Min)");
  };

  return (
    <div className="w-full relative pb-20">
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
      {/* Centered Breadcrumbs Strip */}
      <div className="pt-24 pb-4 sm:pt-28 sm:pb-6">
        <Container>
          <div className="flex justify-center">
            <Breadcrumbs
              items={[
                { label: "Products", to: "/products" },
                { label: product.categoryName, to: `/products?category=${product.categorySlug}` },
                { label: product.name },
              ]}
              tone="dark"
            />
          </div>
        </Container>
      </div>

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left Column: Image Gallery (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="relative aspect-[4/3] sm:aspect-square w-full rounded-[2px] overflow-hidden border border-gold-500/30 bg-ivory-300 shadow-sm">
              <img
                src={activeImage.url}
                alt={activeImage.alt || product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <Badge variant="forest" size="md">
                  {product.originState}
                </Badge>
              </div>
            </div>

            {/* Thumbnail selector if multiple images */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={cn(
                      "w-20 h-20 rounded-[2px] overflow-hidden border transition-all shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500",
                      activeImageIndex === idx
                        ? "border-gold-500 ring-1 ring-gold-500"
                        : "border-ivory-300 opacity-70 hover:opacity-100"
                    )}
                  >
                    <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Sourcing belt info box */}
            <div className="p-4 bg-ivory-100 rounded-[2px] border border-ivory-300 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-charcoal-muted">
                <MapPin className="w-4 h-4 text-gold-600 shrink-0" />
                <span>Procurement Belt:</span>
              </div>
              <span className="font-medium text-forest-900">{product.sourcingBelt}</span>
            </div>

            {product.harvestSeason && (
              <div className="p-4 bg-ivory-100 rounded-[2px] border border-ivory-300 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-charcoal-muted">
                  <Calendar className="w-4 h-4 text-gold-600 shrink-0" />
                  <span>Harvest Peak Season:</span>
                </div>
                <span className="font-medium text-forest-900">{product.harvestSeason}</span>
              </div>
            )}
          </div>

          {/* Center Column: Details & Technical Data (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            <div>
              <div className="text-xs font-eyebrow text-gold-600 uppercase tracking-widest mb-1.5">
                {product.categoryName} · Wholesale Batch
              </div>

              <h1 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-bold text-forest-950 leading-tight">
                {product.name}
              </h1>

              {product.scientificName && (
                <p className="font-sans italic text-base sm:text-lg text-charcoal-muted mt-1">
                  Botanical: {product.scientificName}
                </p>
              )}

              <p className="text-base sm:text-lg text-charcoal-light leading-relaxed mt-4">
                {product.headline || product.description}
              </p>

              {product.detailedDescription && (
                <p className="text-sm sm:text-base text-charcoal-muted leading-relaxed mt-3">
                  {product.detailedDescription}
                </p>
              )}
            </div>

            {/* Sticky Action Callout for Mobile/Desktop */}
            <div className="p-6 bg-forest-900 text-ivory-100 rounded-[2px] border border-forest-800 shadow-[0_8px_24px_rgba(24,61,44,0.15)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-[11px] font-eyebrow text-gold-400 uppercase tracking-wider">
                  B2B Trade Pricing
                </div>
                <div className="font-sans font-semibold text-xl sm:text-2xl text-ivory-100 mt-0.5">
                  Quotation on Request
                </div>
                <div className="text-xs text-ivory-300/70 mt-1">
                  MOQ: {product.minOrderQuantity}
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Button
                  to={`/request-quote?product=${encodeURIComponent(product.slug)}`}
                  variant="gold"
                  size="md"
                  leftIcon={<MessageSquareQuote className="w-4 h-4" />}
                >
                  Request Quote
                </Button>

                {whatsappUrl && (
                  <Button
                    href={whatsappUrl}
                    target="_blank"
                    variant="whatsapp"
                    size="md"
                    title="Inquire via WhatsApp"
                    aria-label={`Inquire about ${product.name} on WhatsApp`}
                  >
                    <Phone className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Available Grades & Forms */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 bg-ivory-100 border border-ivory-300 rounded-[2px]">
                <h4 className="text-xs font-eyebrow text-gold-600 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Available Forms</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {product.availableForms.map((form) => (
                    <Badge key={form} variant="forest" size="sm" className="capitalize">
                      {form}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="p-5 bg-ivory-100 border border-ivory-300 rounded-[2px]">
                <h4 className="text-xs font-eyebrow text-gold-600 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Grading Calibers</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {product.grades.map((grade) => (
                    <Badge key={grade} variant="gold" size="sm">
                      {grade}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Specification Table */}
            <div className="border border-ivory-300 rounded-[2px] overflow-hidden bg-ivory-100">
              <div className="p-4 bg-ivory-300/60 border-b border-ivory-300 flex items-center justify-between">
                <h3 className="font-sans font-semibold text-lg text-forest-900">
                  Verified Chemical & Physical Specifications
                </h3>
                <span className="text-[11px] font-eyebrow text-gold-600 uppercase tracking-wider">
                  Lab Tested
                </span>
              </div>

              <div className="divide-y divide-ivory-300 text-sm">
                {Object.entries(product.specifications).map(([key, val]) => (
                  <div
                    key={key}
                    className="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-3 hover:bg-ivory-200/50 transition-colors"
                  >
                    <span className="text-charcoal-muted text-xs uppercase tracking-wider font-medium">
                      {formatSpecKey(key)}
                    </span>
                    <span className="font-medium text-forest-900 mt-0.5 sm:mt-0">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Packaging Configurations */}
            <div className="border border-ivory-300 rounded-[2px] overflow-hidden bg-ivory-100">
              <div className="p-4 bg-ivory-300/60 border-b border-ivory-300 flex items-center gap-2">
                <Package className="w-4 h-4 text-gold-600" />
                <h3 className="font-sans font-semibold text-lg text-forest-900">
                  Export Packaging Formats
                </h3>
              </div>

              <div className="p-5 space-y-4">
                {product.packagingOptions.map((opt, idx) => (
                  <div key={idx} className="pb-4 last:pb-0 border-b last:border-0 border-ivory-300/60">
                    <div className="font-medium text-forest-900 text-sm">{opt.type}</div>
                    <div className="text-xs text-charcoal-light mt-1 flex flex-wrap gap-2">
                      <span>Standard Sizes: {opt.sizes.join(", ")}</span>
                      {opt.innerLiner && <span>· Liner: {opt.innerLiner}</span>}
                      {opt.palletsAvailable && (
                        <span className="text-forest-700 font-medium">
                          · Palletization ready
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 pt-12 border-t border-ivory-300">
            <div className="mb-8">
              <Eyebrow tone="gold">Complementary Commodities</Eyebrow>
              <h2 className="font-h2 text-forest-900 font-normal mt-2">
                Related {product.categoryName} Lots
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};
