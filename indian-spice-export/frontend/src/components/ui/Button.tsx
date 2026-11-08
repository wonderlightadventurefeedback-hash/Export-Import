import React, { forwardRef } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { cn } from "../../utils/cn";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "gold" | "outline" | "ghost" | "whatsapp" | "terracotta";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  to?: string;
  href?: string;
  target?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled = false,
      children,
      leftIcon,
      rightIcon,
      to,
      href,
      target,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-300 rounded-[2px] tracking-wide select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2";

    const variantStyles = {
      primary:
        "bg-forest-800 text-ivory-100 hover:bg-forest-900 active:bg-forest-950 border border-forest-700/60 shadow-sm",
      gold:
        "bg-gold-500 text-forest-950 hover:bg-gold-400 active:bg-gold-600 font-semibold shadow-sm",
      outline:
        "bg-transparent text-forest-800 hover:text-forest-900 border border-gold-500/70 hover:border-gold-500 hover:bg-gold-500/10",
      ghost:
        "bg-transparent text-charcoal hover:text-forest-800 hover:bg-ivory-300/60",
      whatsapp:
        "bg-[#25D366] text-white hover:bg-[#20ba59] active:bg-[#1da850] shadow-sm font-semibold",
      terracotta:
        "bg-terracotta text-ivory-100 hover:bg-terracotta-light active:bg-[#853924] shadow-sm",
    };

    const sizeStyles = {
      sm: "text-xs px-3.5 py-1.5 gap-1.5 uppercase tracking-wider",
      md: "text-sm px-5 py-2.5 gap-2",
      lg: "text-base px-7 py-3.5 gap-2.5",
    };

    const combinedClassName = cn(
      baseStyles,
      variantStyles[variant],
      sizeStyles[size],
      (disabled || isLoading) && "opacity-60 cursor-not-allowed pointer-events-none",
      className
    );

    const content = (
      <>
        {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
        {!isLoading && leftIcon && <span className="shrink-0">{leftIcon}</span>}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </>
    );

    // Magnetic interaction on desktop pointer devices
    const handleMagneticMove = (e: React.MouseEvent<HTMLElement>) => {
      if (window.matchMedia("(pointer: fine)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * 0.18;
        const y = (e.clientY - rect.top - rect.height / 2) * 0.18;
        e.currentTarget.style.transform = `translate(${x}px, ${y}px)`;
      }
    };

    const handleMagneticLeave = (e: React.MouseEvent<HTMLElement>) => {
      e.currentTarget.style.transform = "translate(0px, 0px)";
    };

    if (to) {
      return (
        <Link
          to={to}
          className={combinedClassName}
          onMouseMove={handleMagneticMove}
          onMouseLeave={handleMagneticLeave}
        >
          {content}
        </Link>
      );
    }

    if (href) {
      return (
        <a
          href={href}
          target={target}
          rel={target === "_blank" ? "noopener noreferrer" : undefined}
          className={combinedClassName}
          onMouseMove={handleMagneticMove}
          onMouseLeave={handleMagneticLeave}
        >
          {content}
        </a>
      );
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={combinedClassName}
        onMouseMove={handleMagneticMove}
        onMouseLeave={handleMagneticLeave}
        {...props}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = "Button";
