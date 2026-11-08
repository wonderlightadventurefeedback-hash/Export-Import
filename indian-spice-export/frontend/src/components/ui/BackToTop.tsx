import React, { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "../../utils/cn";

export const BackToTop: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;

      if (scrollY > 300) {
        setVisible(true);
        if (totalHeight > 0) {
          setScrollProgress(scrollY / totalHeight);
        }
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const circumference = 2 * Math.PI * 18;
  const strokeDashoffset = circumference - scrollProgress * circumference;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll back to top"
      className={cn(
        "fixed bottom-22 right-7 sm:bottom-24 sm:right-7 z-40 w-11 h-11 rounded-full bg-forest-900 text-gold-400 shadow-[0_4px_16px_rgba(24,61,44,0.3)] flex items-center justify-center transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 hover:scale-105 active:scale-95 border border-gold-500/30",
        visible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"
      )}
    >
      {/* Circular Progress Ring */}
      <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 44 44">
        <circle
          cx="22"
          cy="22"
          r="18"
          fill="none"
          stroke="rgba(196, 154, 69, 0.15)"
          strokeWidth="2"
        />
        <circle
          cx="22"
          cy="22"
          r="18"
          fill="none"
          stroke="#C49A45"
          strokeWidth="2"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-150 ease-out"
        />
      </svg>
      <ArrowUp className="w-4 h-4 text-gold-400" />
    </button>
  );
};
