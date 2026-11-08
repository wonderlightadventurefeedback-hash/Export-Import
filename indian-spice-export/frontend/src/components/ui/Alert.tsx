import React from "react";
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from "lucide-react";
import { cn } from "../../utils/cn";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "success" | "warning" | "error" | "info";
  title?: string;
  onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({
  variant = "info",
  title,
  children,
  onClose,
  className,
  ...props
}) => {
  const variantStyles = {
    info: {
      container: "bg-ivory-100 border-gold-500/50 text-charcoal",
      icon: <Info className="w-5 h-5 text-gold-600 shrink-0 mt-0.5" />,
      title: "text-forest-900",
    },
    success: {
      container: "bg-forest-900/10 border-forest-600/40 text-charcoal",
      icon: <CheckCircle2 className="w-5 h-5 text-forest-700 shrink-0 mt-0.5" />,
      title: "text-forest-900",
    },
    warning: {
      container: "bg-gold-500/15 border-gold-500/40 text-charcoal",
      icon: <AlertTriangle className="w-5 h-5 text-gold-600 shrink-0 mt-0.5" />,
      title: "text-gold-700",
    },
    error: {
      container: "bg-terracotta/10 border-terracotta/40 text-charcoal",
      icon: <AlertCircle className="w-5 h-5 text-terracotta shrink-0 mt-0.5" />,
      title: "text-terracotta",
    },
  };

  const style = variantStyles[variant];

  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-3.5 p-4 rounded-[2px] border transition-all text-sm leading-relaxed",
        style.container,
        className
      )}
      {...props}
    >
      {style.icon}
      <div className="flex-1">
        {title && <h5 className={cn("font-medium mb-1 font-serif text-base", style.title)}>{title}</h5>}
        <div>{children}</div>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close message"
          className="text-charcoal-muted hover:text-charcoal p-1 transition-colors rounded-[2px]"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
