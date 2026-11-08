import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { SpiceCategory } from "../../types";
import { cn } from "../../utils/cn";

export interface CategoryTileProps {
  category: SpiceCategory;
  index: number;
  className?: string;
  isLarge?: boolean;
}

export const CategoryTile: React.FC<CategoryTileProps> = ({
  category,
  index,
  className,
  isLarge = false,
}) => {
  const formattedIndex = String(index + 1).padStart(2, "0");

  return (
    <Link
      to={`/products?category=${category.slug}`}
      className={cn(
        "group relative flex flex-col justify-end overflow-hidden rounded-sm border border-gold-500/30 p-4 sm:p-4.5 transition-all duration-500 shadow-md hover:border-gold-500 hover:shadow-xl hover:-translate-y-1",
        isLarge ? "min-h-[220px] sm:min-h-[240px]" : "min-h-[190px] sm:min-h-[210px]",
        className
      )}
    >
      {/* Background Image */}
      <img
        src={category.heroImage}
        alt={category.name}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
      />

      {/* Dark Forest Gradient Overlay for editorial readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/70 to-forest-950/20 opacity-85 group-hover:opacity-80 transition-opacity duration-300" />

      {/* Thin Gold Inner Border on Hover */}
      <div className="absolute inset-2 border border-gold-500/0 group-hover:border-gold-500/30 transition-all duration-500 pointer-events-none" />

      {/* Top Bar with Number & Icon */}
      <div className="relative z-10 flex items-center justify-between w-full mb-auto pb-2">
        <span className="font-sans text-xs tracking-widest text-gold-400 font-medium">
          No. {formattedIndex}
        </span>
        <div className="w-6 h-6 rounded-full border border-gold-500/40 flex items-center justify-center text-gold-400 group-hover:bg-gold-500 group-hover:text-forest-950 transition-all duration-300">
          <ArrowUpRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col gap-1">
        <div className="text-[10px] font-eyebrow text-gold-300 tracking-[0.18em] uppercase">
          Wholesale Export
        </div>
        <h3 className="font-sans text-base sm:text-lg font-bold text-ivory-100 group-hover:text-gold-300 transition-colors leading-tight">
          {category.name}
        </h3>
        <p className="text-[11px] sm:text-xs text-ivory-300/80 line-clamp-1 max-w-sm leading-relaxed">
          {category.tagline || category.description}
        </p>

        <div className="pt-2 mt-1 border-t border-gold-500/20 flex items-center justify-between text-[11px] text-gold-400 font-medium">
          <span>Explore specifications</span>
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            View lots &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
};
