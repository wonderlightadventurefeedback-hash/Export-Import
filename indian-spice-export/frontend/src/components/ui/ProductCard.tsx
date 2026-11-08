import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MessageSquareQuote, Phone } from "lucide-react";
import { Product } from "../../types";
import { cn } from "../../utils/cn";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { buildProductWhatsAppLink } from "../../config/company";

export interface ProductCardProps {
  product: Product;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, className }) => {
  const primaryImage = product.images.find((img) => img.isPrimary) || product.images[0];
  const whatsappUrl = buildProductWhatsAppLink(product.name, product.grades?.[0]);

  return (
    <article
      className={cn(
        "group relative flex flex-col bg-white rounded-sm border border-sky-100 overflow-hidden shadow-md transition-all duration-400 hover:-translate-y-1 hover:border-sky-300 hover:shadow-2xl",
        className
      )}
    >
      {/* Image container with subtle zoom */}
      <Link
        to={`/products/${product.slug}`}
        className="relative block aspect-[4/3] w-full overflow-hidden bg-ivory-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
        tabIndex={-1}
      >
        <img
          src={primaryImage.url}
          alt={primaryImage.alt || product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950/60 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity duration-300" />

        {/* Origin Badge */}
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge variant="forest" size="sm">
            {product.originState}
          </Badge>
          {product.availableForms?.length > 0 && (
            <Badge variant="neutral" size="sm" className="bg-ivory-100/90 text-charcoal backdrop-blur-xs">
              {product.availableForms.join(" · ")}
            </Badge>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 sm:p-6 justify-between">
        <div>
          {/* Eyebrow */}
          <div className="text-[11px] font-eyebrow text-gold-600 mb-1.5 uppercase tracking-[0.2em]">
            {product.categoryName}
          </div>

          {/* Title */}
          <h3 className="font-sans font-semibold text-xl sm:text-2xl text-forest-900 leading-snug group-hover:text-forest-700 transition-colors">
            <Link
              to={`/products/${product.slug}`}
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 rounded-[2px]"
            >
              {product.name}
            </Link>
          </h3>

          {/* Scientific name */}
          {product.scientificName && (
            <p className="text-xs font-sans italic text-charcoal-muted mt-0.5">
              {product.scientificName}
            </p>
          )}

          {/* Short description */}
          <p className="text-sm text-charcoal-light leading-relaxed mt-3 line-clamp-2">
            {product.headline || product.description}
          </p>
        </div>

        {/* Key Specification Preview */}
        <div className="mt-4 pt-4 border-t border-ivory-300/80 flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs text-charcoal-muted">
            <span>Sourcing Belt</span>
            <span className="font-medium text-charcoal text-right">{product.sourcingBelt}</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-1">
            <Button
              to={`/request-quote?product=${encodeURIComponent(product.slug)}`}
              variant="primary"
              size="sm"
              className="flex-1 justify-center text-xs py-2"
              leftIcon={<MessageSquareQuote className="w-3.5 h-3.5" />}
            >
              Request Quote
            </Button>

            {whatsappUrl && (
              <Button
                href={whatsappUrl}
                target="_blank"
                variant="outline"
                size="sm"
                className="px-2.5 py-2 text-forest-800 hover:text-forest-900 border-gold-500/50"
                title="Inquire via WhatsApp"
                aria-label={`Inquire about ${product.name} on WhatsApp`}
              >
                <Phone className="w-3.5 h-3.5" />
              </Button>
            )}

            <Button
              to={`/products/${product.slug}`}
              variant="ghost"
              size="sm"
              className="px-2 py-2 text-forest-800"
              title="View Product Details"
              aria-label={`View details for ${product.name}`}
            >
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
};
