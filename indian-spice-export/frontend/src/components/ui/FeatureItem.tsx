import React from "react";
import { Check } from "lucide-react";
import { cn } from "../../utils/cn";

export interface FeatureItemProps {
  number?: string;
  title: string;
  subtitle?: string;
  description: string;
  features?: string[];
  tone?: "ivory" | "forest";
  className?: string;
}

export const FeatureItem: React.FC<FeatureItemProps> = ({
  number,
  title,
  subtitle,
  description,
  features,
  tone = "ivory",
  className,
}) => {
  const isForest = tone === "forest";

  return (
    <div
      className={cn(
        "flex flex-col p-4 sm:p-5 rounded-sm border transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1",
        isForest
          ? "bg-forest-900 border-forest-700/50 text-ivory-100 hover:border-gold-500/50"
          : "bg-white border-sky-100 text-charcoal hover:border-sky-300",
        className
      )}
    >
      <div className="flex items-baseline justify-between mb-2">
        {number && (
          <span className="font-sans text-xl sm:text-2xl font-bold text-gold-500 tracking-wider">
            {number}
          </span>
        )}
        {subtitle && (
          <span
            className={cn(
              "text-[10px] font-semibold uppercase tracking-widest",
              isForest ? "text-ivory-300/70" : "text-sky-600"
            )}
          >
            {subtitle}
          </span>
        )}
      </div>

      <h3
        className={cn(
          "font-sans text-base sm:text-lg font-bold leading-snug mb-2",
          isForest ? "text-ivory-100" : "text-forest-900"
        )}
      >
        {title}
      </h3>

      <p
        className={cn(
          "text-xs sm:text-sm leading-relaxed mb-3",
          isForest ? "text-ivory-300/80" : "text-charcoal-light"
        )}
      >
        {description}
      </p>

      {features && features.length > 0 && (
        <ul className="mt-auto pt-3 border-t border-slate-100 space-y-1.5">
          {features.map((feat, idx) => (
            <li key={idx} className="flex items-start gap-2 text-xs">
              <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
              <span className={isForest ? "text-ivory-200" : "text-charcoal-light"}>
                {feat}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
