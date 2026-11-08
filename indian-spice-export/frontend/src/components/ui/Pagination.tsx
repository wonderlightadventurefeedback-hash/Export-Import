import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../utils/cn";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className,
}) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      aria-label="Catalogue pagination"
      className={cn("flex items-center justify-center gap-1 sm:gap-2 select-none", className)}
    >
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Go to previous page"
        className="inline-flex items-center justify-center w-10 h-10 rounded-[2px] border border-ivory-400 bg-ivory-100 text-charcoal hover:border-gold-500 hover:text-forest-800 disabled:opacity-40 disabled:pointer-events-none transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {pages.map((page) => {
        const isCurrent = page === currentPage;

        return (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            aria-current={isCurrent ? "page" : undefined}
            className={cn(
              "w-10 h-10 rounded-[2px] font-sans text-sm font-medium transition-colors border",
              isCurrent
                ? "bg-forest-800 text-ivory-100 border-forest-800 shadow-xs"
                : "bg-ivory-100 text-charcoal border-ivory-400 hover:border-gold-500 hover:text-forest-800"
            )}
          >
            {page}
          </button>
        );
      })}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Go to next page"
        className="inline-flex items-center justify-center w-10 h-10 rounded-[2px] border border-ivory-400 bg-ivory-100 text-charcoal hover:border-gold-500 hover:text-forest-800 disabled:opacity-40 disabled:pointer-events-none transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  );
};
