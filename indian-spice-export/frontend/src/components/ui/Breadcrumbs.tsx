import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "../../utils/cn";

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  tone?: "dark" | "light";
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  className,
  tone = "dark",
}) => {
  const isLight = tone === "light";

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "flex items-center text-xs tracking-wider uppercase font-eyebrow",
        className
      )}
    >
      <ol className="flex items-center flex-wrap gap-1.5 sm:gap-2">
        <li className="inline-flex items-center">
          <Link
            to="/"
            className={cn(
              "inline-flex items-center gap-1 transition-colors hover:text-gold-500",
              isLight ? "text-ivory-300/70" : "text-charcoal-muted"
            )}
            title="Home"
          >
            <Home className="w-3.5 h-3.5" />
            <span className="sr-only">Home</span>
          </Link>
        </li>

        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;

          return (
            <li key={idx} className="inline-flex items-center gap-1.5 sm:gap-2">
              <ChevronRight
                className={cn(
                  "w-3 h-3 shrink-0",
                  isLight ? "text-ivory-300/40" : "text-ivory-400"
                )}
              />
              {isLast || !item.to ? (
                <span
                  className={cn(
                    "font-semibold",
                    isLight ? "text-gold-400" : "text-forest-900"
                  )}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.to}
                  className={cn(
                    "transition-colors hover:text-gold-500",
                    isLight ? "text-ivory-300/70" : "text-charcoal-muted"
                  )}
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
