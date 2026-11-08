import React from "react";
import { cn } from "../../utils/cn";
import { Eyebrow } from "./Eyebrow";

export interface SectionHeadingProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  eyebrow?: string;
  eyebrowTone?: "gold" | "forest" | "muted" | "light";
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: "left" | "center";
  tone?: "dark" | "light";
  size?: "display" | "h1" | "h2" | "h3";
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  className,
  eyebrow,
  eyebrowTone,
  title,
  subtitle,
  align = "center",
  tone = "dark",
  size = "h2",
  ...props
}) => {
  const isLight = tone === "light";
  const computedEyebrowTone = eyebrowTone || (isLight ? "light" : "gold");

  const titleSizeClasses = {
    display: "font-sans text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight",
    h1: "font-sans text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight",
    h2: "font-sans text-2xl sm:text-3xl font-extrabold tracking-tight",
    h3: "font-sans text-xl sm:text-2xl font-bold",
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-2.5 items-center text-center mx-auto max-w-3xl",
        className
      )}
      {...props}
    >
      {eyebrow && (
        <Eyebrow tone={computedEyebrowTone} withHairline={false}>
          {eyebrow}
        </Eyebrow>
      )}

      <h2
        className={cn(
          titleSizeClasses[size],
          isLight ? "text-ivory-100" : "text-forest-900",
          "leading-tight text-center"
        )}
      >
        {title}
      </h2>

      {subtitle && (
        <p
          className={cn(
            "text-xs sm:text-sm leading-relaxed max-w-2xl font-normal mx-auto text-center mt-1",
            isLight ? "text-ivory-300/80" : "text-charcoal-light"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};
