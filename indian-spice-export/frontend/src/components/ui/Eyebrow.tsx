import React from "react";
import { cn } from "../../utils/cn";

export interface EyebrowProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: "gold" | "forest" | "muted" | "light";
  withHairline?: boolean;
}

export const Eyebrow: React.FC<EyebrowProps> = ({
  className,
  tone = "gold",
  withHairline = false,
  children,
  ...props
}) => {
  const toneClasses = {
    gold: "text-gold-600 dark:text-gold-400",
    forest: "text-forest-700",
    muted: "text-charcoal-muted",
    light: "text-gold-300",
  };

  const lineToneClasses = {
    gold: "bg-gold-500/60",
    forest: "bg-forest-700/60",
    muted: "bg-charcoal-muted/40",
    light: "bg-gold-300/60",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-3 font-eyebrow uppercase select-none",
        toneClasses[tone],
        className
      )}
      {...props}
    >
      {withHairline && (
        <span
          className={cn("inline-block w-8 h-[1px] shrink-0", lineToneClasses[tone])}
          aria-hidden="true"
        />
      )}
      <span>{children}</span>
    </div>
  );
};
