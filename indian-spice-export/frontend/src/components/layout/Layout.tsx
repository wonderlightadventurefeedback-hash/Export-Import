import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "./Navbar";
import { MobileMenu } from "./MobileMenu";
import { Footer } from "./Footer";
import { WhatsAppFloating } from "./WhatsAppFloating";
import { MobileQuoteBar } from "./MobileQuoteBar";
import { ScrollProgress } from "../ui/ScrollProgress";
import { BackToTop } from "../ui/BackToTop";
import { Preloader } from "../ui/Preloader";

export const Layout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Scroll handling: smooth scroll to hash if present, else scroll to top
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 150);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.hash]);

  return (
    <div className="min-h-screen flex flex-col bg-ivory-200 text-charcoal font-sans selection:bg-gold-500/25 selection:text-forest-950">
      {/* Skip to Content accessible landmark */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-forest-900 focus:text-gold-300 focus:rounded focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-gold-500 font-sans text-sm font-semibold"
      >
        Skip to main content
      </a>

      {/* Branded Preloader (runs max 1.1s once per session) */}
      <Preloader />

      {/* Gold Scroll Progress Hairline */}
      <ScrollProgress />

      {/* Navigation Header */}
      <Navbar
        isMobileMenuOpen={isMobileMenuOpen}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
      />

      {/* Full-screen Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Page Content */}
      <main className="flex-1 w-full" id="main-content">
        <Outlet />
      </main>

      {/* Comprehensive Footer */}
      <Footer />

      {/* Floating Elements */}
      <WhatsAppFloating />
      <MobileQuoteBar />
      <BackToTop />
    </div>
  );
};
