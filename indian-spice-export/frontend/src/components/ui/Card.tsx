import React from "react";
import { cn } from "../../utils/cn";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: "ivory" | "forest" | "bordered";
  interactive?: boolean;
}

export const Card: React.FC<CardProps> = ({
  className,
  tone = "ivory",
  interactive = false,
  children,
  ...props
}) => {
  const toneClasses = {
    ivory:
      "bg-white text-charcoal border border-sky-100 shadow-md hover:shadow-xl",
    forest:
      "bg-forest-900 text-ivory-100 border border-forest-700/50 shadow-md hover:shadow-2xl",
    bordered:
      "bg-white/80 backdrop-blur-sm text-charcoal border border-sky-200 shadow-sm hover:shadow-md",
  };

  return (
    <div
      className={cn(
        "rounded-sm transition-all duration-300 relative overflow-hidden",
        toneClasses[tone],
        interactive &&
        "hover:-translate-y-1 hover:border-sky-300 hover:shadow-xl cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
