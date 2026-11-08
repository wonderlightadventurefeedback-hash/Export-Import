import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, RotateCcw, ArrowUpRight, MessageSquareQuote } from "lucide-react";
import { Container } from "../../components/ui/Container";
import { PageHero } from "../../components/ui/PageHero";
import { Pagination } from "../../components/ui/Pagination";
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from "../../services/mock";
import { publicApi } from "../../services/api";
import { SpiceForm, Product, SpiceCategory } from "../../types";
import { cn } from "../../utils/cn";
import { buildProductWhatsAppLink } from "../../config/company";

const BG_IMAGE =
  "https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&w=1920&q=85";
/* ─────────────────────────────────────────────
   Compact product card — image left, text right
───────────────────────────────────────────── */
const CompactProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const primary = product.images.find((i) => i.isPrimary) || product.images[0];
  const wa = buildProductWhatsAppLink(product.name, product.grades?.[0]);

  return (
    <article className="group flex gap-0 bg-white border border-sky-100 rounded-sm overflow-hidden shadow-sm hover:shadow-xl hover:border-sky-300 transition-all duration-300 hover:-translate-y-0.5">
      {/* Thumbnail */}
      <Link
        to={`/products/${product.slug}`}
        className="relative shrink-0 w-24 h-24 overflow-hidden bg-ivory-300"
        tabIndex={-1}
      >
        <img
          src={primary?.url || "https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&w=400&q=80"}
          alt={primary?.alt || product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&w=400&q=80";
          }}
        />
      </Link>

      {/* Info */}
      <div className="flex flex-col justify-between flex-1 px-3 py-2.5 min-w-0">
        <div>
          <p className="text-[9px] font-eyebrow uppercase tracking-[0.18em] text-gold-600 mb-0.5">
            {product.categoryName}
          </p>
          <Link to={`/products/${product.slug}`}>
            <h3 className="font-sans text-sm font-semibold text-forest-900 leading-tight group-hover:text-forest-700 transition-colors truncate">
              {product.name}
            </h3>
          </Link>
          {product.scientificName && (
            <p className="text-[10px] italic text-charcoal/50 truncate">{product.scientificName}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 mt-1.5">
          <Link
            to={`/request-quote?product=${encodeURIComponent(product.slug)}`}
            className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-medium bg-forest-800 text-ivory-100 rounded-[2px] hover:bg-forest-700 transition-colors"
          >
            <MessageSquareQuote className="w-2.5 h-2.5" />
            Quote
          </Link>
          {wa && (
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-medium border border-gold-400/60 text-forest-800 rounded-[2px] hover:bg-gold-50 transition-colors"
            >
              WhatsApp
            </a>
          )}
          <Link
            to={`/products/${product.slug}`}
            className="ml-auto text-charcoal/40 hover:text-forest-700 transition-colors"
            aria-label={`View ${product.name}`}
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
};

/* ─────────────────────────────────────────────
   Products Page
───────────────────────────────────────────── */
export const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category") || "all";
  const [searchQuery, setSearchQuery] = useState("");
  const [formFilter, setFormFilter] = useState<SpiceForm>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [categories, setCategories] = useState<SpiceCategory[]>(MOCK_CATEGORIES);

  useEffect(() => {
    let active = true;
    Promise.all([publicApi.getProducts(), publicApi.getCategories()])
      .then(([prods, cats]) => {
        if (active) {
          if (prods && prods.length > 0) setProducts(prods);
          if (cats && cats.length > 0) setCategories(cats);
        }
      })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedCategory !== "all" && p.categorySlug !== selectedCategory) return false;
      if (formFilter !== "all" && !p.availableForms.includes(formFilter as any)) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (
          !p.name.toLowerCase().includes(q) &&
          !p.categoryName.toLowerCase().includes(q) &&
          !p.scientificName.toLowerCase().includes(q) &&
          !p.description.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [selectedCategory, formFilter, searchQuery, products]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const s = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(s, s + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const handleCategoryChange = (slug: string) => {
    setCurrentPage(1);
    if (slug === "all") { searchParams.delete("category"); setSearchParams(searchParams); }
    else setSearchParams({ category: slug });
  };

  const handleReset = () => {
    setSearchQuery(""); setFormFilter("all");
    searchParams.delete("category"); setSearchParams(searchParams); setCurrentPage(1);
  };

  return (
    <div className="w-full min-h-screen">
      {/* ── Fixed parallax background ── */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage: `url('${BG_IMAGE}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      {/* Light blue / white translucent wash over the fixed image */}
      <div className="fixed inset-0 -z-10 bg-sky-50/70 backdrop-blur-[0.5px]" />

      {/* Page Hero — Clean Header Without Dark Bar, Identical to About & Contact */}
      <PageHero
        breadcrumbs={[{ label: "Products Catalog" }]}
        title="Pure Indian Export Spices"
        subtitle="Premium whole and ground spices sourced directly from Indian farms, certified and shipped in bulk worldwide."
      />

      {/* ── Filters + Grid ── */}
      <div className="relative pb-20">
        <Container>

          {/* Filter Bar — naturally positioned above products with zero scroll overlap */}
          <div className="relative z-10 bg-white/95 backdrop-blur-md px-4 py-3.5 rounded-sm border border-sky-100 shadow-sm mb-6 flex flex-wrap gap-3 items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-[180px]">
              <Search className="w-3.5 h-3.5 text-charcoal/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search spices…"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-transparent border border-ivory-300 rounded-[2px] text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:border-gold-500 transition-colors"
              />
            </div>

            {/* Form filter */}
            <div className="flex items-center gap-1.5">
              {(["all", "whole", "ground"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => { setFormFilter(f); setCurrentPage(1); }}
                  className={cn(
                    "px-2.5 py-1 text-[10px] uppercase tracking-wider rounded-[2px] border transition-colors font-medium",
                    formFilter === f
                      ? "bg-sky-500 text-white border-sky-500"
                      : "bg-white text-charcoal border-sky-100 hover:border-sky-400 hover:bg-sky-50"
                  )}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Category chips */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => handleCategoryChange("all")}
                className={cn(
                  "px-2.5 py-1 text-[10px] rounded-[2px] border transition-colors",
                  selectedCategory === "all"
                    ? "bg-sky-500 text-white border-sky-500 font-semibold"
                    : "bg-white text-charcoal border-sky-100 hover:border-sky-400 hover:bg-sky-50"
                )}
              >
                All ({products.length})
              </button>
              {categories.map((cat) => {
                const count = products.filter((p) => p.categorySlug === cat.slug).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.slug)}
                    className={cn(
                      "px-2.5 py-1 text-[10px] rounded-[2px] border transition-colors",
                      selectedCategory === cat.slug
                        ? "bg-sky-500 text-white border-sky-500 font-semibold"
                        : "bg-white text-charcoal border-sky-100 hover:border-sky-400 hover:bg-sky-50"
                    )}
                  >
                    {cat.name} {count > 0 && `(${count})`}
                  </button>
                );
              })}
            </div>

            {/* Count + Reset */}
            <div className="flex items-center gap-3 ml-auto text-[10px] text-charcoal/50 shrink-0">
              <span>{filteredProducts.length} results</span>
              {(searchQuery || selectedCategory !== "all" || formFilter !== "all") && (
                <button onClick={handleReset} className="inline-flex items-center gap-1 text-terracotta hover:underline">
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              )}
            </div>
          </div>

          {/* Grid — explicit z-0 so cards stay below the sticky filter bar */}
          <div className="relative z-0">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-sm border border-sky-100 shadow-sm">
              <p className="text-charcoal/60 text-sm">No spices match your filters.</p>
              <button onClick={handleReset} className="mt-4 text-xs text-sky-600 underline">Reset filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {paginatedProducts.map((product) => (
                <CompactProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-10 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => { setCurrentPage(page); window.scrollTo({ top: 300, behavior: "smooth" }); }}
              />
            </div>
          )}
        </Container>
      </div>
    </div>
  );
};
