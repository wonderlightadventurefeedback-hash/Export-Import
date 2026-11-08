import React from "react";
import { cn } from "../../utils/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "gold" | "forest" | "terracotta" | "neutral" | "outline";
  size?: "sm" | "md";
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = "neutral",
  size = "md",
  children,
  ...props
}) => {
  const variantClasses = {
    gold: "bg-gold-500/15 text-gold-700 border border-gold-500/30",
    forest: "bg-forest-800 text-ivory-100 border border-forest-700",
    terracotta: "bg-terracotta/15 text-terracotta border border-terracotta/30",
    neutral: "bg-ivory-300 text-charcoal-light border border-ivory-400/50",
    outline: "bg-transparent text-charcoal border border-charcoal/20",
  };

  const sizeClasses = {
    sm: "text-[11px] px-2 py-0.5 font-medium tracking-wide",
    md: "text-xs px-2.5 py-1 font-medium tracking-wide",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-[2px] transition-colors",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
