import React from "react";
import { cn } from "../../utils/cn";

export interface StatProps {
  label: string;
  value?: string | number | null;
  suffix?: string;
  subtext?: string;
  verified?: boolean;
  className?: string;
}

export const Stat: React.FC<StatProps> = ({
  label,
  value,
  suffix,
  subtext,
  verified = false,
  className,
}) => {
  // Strict truthfulness guard: if value is absent or explicitly unverified placeholder, do not invent
  if (value === undefined || value === null || value === "") {
    return null;
  }

  return (
    <div
      className={cn(
        "flex flex-col p-6 bg-ivory-100 rounded-[2px] border border-ivory-300 relative",
        className
      )}
    >
      <div className="font-sans font-bold text-3xl sm:text-4xl lg:text-5xl text-forest-900 tracking-tight flex items-baseline gap-1">
        <span>{value}</span>
        {suffix && <span className="text-xl sm:text-2xl text-gold-600 font-sans">{suffix}</span>}
      </div>

      <div className="text-xs font-eyebrow text-charcoal-light uppercase tracking-wider mt-2">
        {label}
      </div>

      {subtext && (
        <p className="text-xs text-charcoal-muted mt-1 leading-normal">
          {subtext}
        </p>
      )}

      {verified && (
        <div className="mt-2 text-[10px] text-forest-700 font-medium">
          Verified Certificate
        </div>
      )}
    </div>
  );
};
