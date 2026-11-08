import React from "react";
import { cn } from "../../utils/cn";
import { Container } from "./Container";
import { Eyebrow } from "./Eyebrow";
import { Breadcrumbs, BreadcrumbItem } from "./Breadcrumbs";

export interface PageHeroProps {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  tone?: "forest" | "ivory" | "transparent";
  className?: string;
  children?: React.ReactNode;
}

export const PageHero: React.FC<PageHeroProps> = ({
  eyebrow,
  title,
  subtitle,
  breadcrumbs,
  className,
  children,
}) => {
  return (
    <div className={cn("relative pt-24 pb-4 sm:pt-28 sm:pb-6", className)}>
      <Container>
        <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
          {breadcrumbs && (
            <div className="mb-3 flex justify-center">
              <Breadcrumbs items={breadcrumbs} tone="dark" />
            </div>
          )}

          {eyebrow && (
            <div className="mb-2">
              <Eyebrow tone="gold">{eyebrow}</Eyebrow>
            </div>
          )}

          {/* Centered Clean Header Title */}
          <h1 className="font-sans font-extrabold text-2xl sm:text-3xl lg:text-4xl text-forest-900 tracking-tight leading-tight text-center">
            {title}
          </h1>

          {subtitle && (
            <p className="mt-2.5 text-xs sm:text-sm font-normal text-charcoal-light leading-relaxed max-w-2xl mx-auto text-center">
              {subtitle}
            </p>
          )}

          {children && <div className="mt-4">{children}</div>}
        </div>
      </Container>
    </div>
  );
};
