import React from "react";
import { Link } from "react-router-dom";
import { MessageSquareQuote, Phone, ArrowRight, Sparkles } from "lucide-react";
import { cn } from "../../utils/cn";
import { Container } from "./Container";
import { buildWhatsAppLink } from "../../config/company";

export interface CTABandProps {
  eyebrow?: string;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  primaryCtaText?: string;
  primaryCtaLink?: string;
  showWhatsapp?: boolean;
  className?: string;
}

export const CTABand: React.FC<CTABandProps> = ({
  eyebrow,
  title = "Planning to import spices? Tell us what you need.",
  subtitle = "Send us your required spices, quantity, and destination port. We will send you a clear, competitive price quote within 24 hours.",
  primaryCtaText = "Request a Free Quote",
  primaryCtaLink = "/request-quote",
  showWhatsapp = true,
  className,
}) => {
  const whatsappUrl = showWhatsapp ? buildWhatsAppLink() : null;

  return (
    <section
      className={cn(
        "relative overflow-hidden py-16 sm:py-24 bg-gradient-to-b from-sky-50/90 via-white to-sky-100/70 text-slate-800 border-y border-sky-200/80 shadow-xs",
        className
      )}
    >
      {/* Soft light radial ambient highlights */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(2,132,199,0.08),transparent_55%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.08),transparent_50%)] pointer-events-none" />

      {/* Decorative subtle hairline accents */}
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-sky-300 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-sky-200 to-transparent" />

      <Container>
        <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
          {/* Eyebrow Pill Badge (only if provided and non-empty) */}
          {eyebrow && eyebrow.trim().length > 0 && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-100/90 text-sky-800 border border-sky-300/80 text-xs font-bold uppercase tracking-widest mb-5 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              <span>{eyebrow}</span>
            </div>
          )}

          {/* Heading in High-Contrast Dark Slate */}
          <h2 className="font-sans text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-forest-950 leading-tight max-w-3xl">
            {title}
          </h2>

          {/* Subtitle in Soft Muted Charcoal */}
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-normal">
            {subtitle}
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to={primaryCtaLink}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-[4px] text-sm font-bold bg-sky-600 hover:bg-sky-700 text-white shadow-[0_6px_20px_rgba(2,132,199,0.3)] hover:shadow-[0_8px_25px_rgba(2,132,199,0.4)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer"
            >
              <MessageSquareQuote className="w-5 h-5" />
              <span>{primaryCtaText}</span>
            </Link>

            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-[4px] text-sm font-bold bg-[#25D366] text-white hover:bg-[#20ba59] shadow-[0_6px_20px_rgba(37,211,102,0.3)] hover:shadow-[0_8px_25px_rgba(37,211,102,0.4)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>Inquire via WhatsApp</span>
              </a>
            )}

            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-[4px] text-sm font-semibold bg-white hover:bg-sky-50 text-slate-800 border border-sky-300 shadow-2xs hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
            >
              <span>View Spice Catalogue</span>
              <ArrowRight className="w-4 h-4 text-sky-600" />
            </Link>
          </div>

          {/* Clean Trust strip in Light Card */}
          <div className="mt-9 inline-flex flex-wrap items-center justify-center gap-2.5 px-4 py-2 rounded-full bg-white/90 border border-sky-200 text-xs text-slate-600 shadow-2xs">
            <span className="font-semibold text-slate-700">Odisha &amp; Pan-India Sourcing</span>
            <span className="text-amber-500 font-bold">·</span>
            <span className="font-semibold text-slate-700">Worldwide Maritime Dispatch</span>
            <span className="text-amber-500 font-bold">·</span>
            <span className="font-semibold text-slate-700">Standard Batch Certificates</span>
          </div>
        </div>
      </Container>
    </section>
  );
};
