import React from "react";
import { cn } from "../../utils/cn";

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  withOrnament?: boolean;
  tone?: "gold" | "subtle" | "dark";
}

export const Divider: React.FC<DividerProps> = ({
  className,
  withOrnament = true,
  tone = "gold",
  ...props
}) => {
  const lineClasses = {
    gold: "border-gold-500/25",
    subtle: "border-ivory-400/40",
    dark: "border-forest-700/40",
  };

  const ornamentClasses = {
    gold: "text-gold-500/80",
    subtle: "text-ivory-400",
    dark: "text-gold-400",
  };

  if (!withOrnament) {
    return <hr className={cn("w-full border-t my-8", lineClasses[tone], className)} {...props} />;
  }

  return (
    <div
      className={cn("relative flex items-center justify-center my-10 w-full select-none", className)}
      {...props}
    >
      <div className={cn("grow border-t", lineClasses[tone])} />
      <div className={cn("px-4 text-xs font-serif italic tracking-widest shrink-0 flex items-center gap-1.5", ornamentClasses[tone])}>
        <span className="w-1.5 h-1.5 rotate-45 border border-current" />
        <span className="w-2 h-2 rotate-45 bg-current" />
        <span className="w-1.5 h-1.5 rotate-45 border border-current" />
      </div>
      <div className={cn("grow border-t", lineClasses[tone])} />
    </div>
  );
};
