import React from "react";
import { cn } from "../../utils/cn";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  tone?: "ivory" | "ivory-deep" | "forest" | "forest-dark";
  padding?: "normal" | "compact" | "loose" | "none";
  withPaperTexture?: boolean;
}

export const Section: React.FC<SectionProps> = ({
  className,
  tone = "ivory",
  padding = "normal",
  withPaperTexture = true,
  children,
  ...props
}) => {
  const toneClasses = {
    ivory: "bg-white/85 backdrop-blur-[1px] text-charcoal",
    "ivory-deep": "bg-sky-50/80 backdrop-blur-[1px] text-charcoal border-y border-sky-100/60",
    forest: "bg-forest-800/95 backdrop-blur-[1px] text-ivory-100",
    "forest-dark": "bg-forest-950/95 backdrop-blur-[1px] text-ivory-100",
  };

  const paddingClasses = {
    none: "py-0",
    compact: "py-12 sm:py-16 lg:py-20",
    normal: "py-16 sm:py-24 lg:py-32",
    loose: "py-20 sm:py-28 lg:py-40",
  };

  const isLight = tone === "ivory" || tone === "ivory-deep";

  return (
    <section
      className={cn(
        "relative overflow-hidden w-full transition-colors duration-500",
        toneClasses[tone],
        paddingClasses[padding],
        isLight && withPaperTexture && "paper-grain",
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
};
