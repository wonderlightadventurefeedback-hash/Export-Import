import React, { useEffect, useState } from "react";
import { cn } from "../../utils/cn";

export const Preloader: React.FC = () => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Only show once per browser session
    const hasLoadedThisSession = sessionStorage.getItem("ise_preloader_seen");
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!hasLoadedThisSession && !prefersReducedMotion) {
      setLoading(true);
      sessionStorage.setItem("ise_preloader_seen", "true");

      const timer = setTimeout(() => {
        setLoading(false);
      }, 1100);

      return () => clearTimeout(timer);
    }
  }, []);

  if (!loading) return null;

  return (
    <div
      role="status"
      aria-label="Loading Indian Spice Export"
      className={cn(
        "fixed inset-0 z-50 flex flex-col items-center justify-center bg-forest-950 transition-opacity duration-500",
        loading ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}
    >
      <div className="flex flex-col items-center gap-5">
        {/* Brand Leaf Emblem */}
        <div className="w-14 h-14 rounded-full border border-gold-500/40 flex items-center justify-center p-3 animate-pulse">
          <svg viewBox="0 0 48 48" fill="none" className="w-full h-full text-gold-400">
            <path
              d="M24 8C24 8 13 18 13 28C13 34.0751 17.9249 39 24 39C30.0751 39 35 34.0751 35 28C35 18 24 8 24 8Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M24 14V36" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M24 22L19 26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M24 27L29 31" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>

        {/* Wordmark */}
        <div className="text-center">
          <h1 className="font-serif text-xl sm:text-2xl text-ivory-100 tracking-wider font-light">
            INDIAN SPICE EXPORT
          </h1>
          <p className="text-[10px] font-eyebrow text-gold-400 uppercase tracking-[0.25em] mt-1">
            Odisha, India
          </p>
        </div>

        {/* Thin Gold Loading Line */}
        <div className="w-48 h-[1px] bg-forest-800 overflow-hidden relative mt-2">
          <div className="absolute inset-y-0 left-0 bg-gold-400 w-full animate-[progress_1.1s_cubic-bezier(0.22,1,0.36,1)]" />
        </div>
      </div>

      <button
        type="button"
        onClick={() => setLoading(false)}
        className="absolute bottom-8 text-[11px] font-eyebrow text-ivory-400 hover:text-gold-400 tracking-widest uppercase transition-colors"
      >
        Skip [Esc]
      </button>
    </div>
  );
};
