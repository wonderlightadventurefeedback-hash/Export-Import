import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, MessageSquareQuote, ChevronDown } from "lucide-react";
import { COMPANY_CONFIG } from "../../config/company";
import { Button } from "../ui/Button";
import { cn } from "../../utils/cn";

export interface NavbarProps {
  onOpenMobileMenu: () => void;
  isMobileMenuOpen: boolean;
}

export const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Products", to: "/products" },
  { label: "Services", to: "/services" },
  { label: "Certificates", to: "/certifications" },
  { label: "F & Q", to: "/faqs" },
  { label: "Contact", to: "/contact" },
];

export const Navbar: React.FC<NavbarProps> = ({ onOpenMobileMenu, isMobileMenuOpen }) => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isAboutDropdownOpen, setIsAboutDropdownOpen] = useState(false);
  const dropdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnterAbout = () => {
    if (dropdownTimerRef.current) clearTimeout(dropdownTimerRef.current);
    setIsAboutDropdownOpen(true);
  };

  const handleMouseLeaveAbout = () => {
    dropdownTimerRef.current = setTimeout(() => {
      setIsAboutDropdownOpen(false);
    }, 150);
  };

  const handleDropdownClick = (id: string) => {
    setIsAboutDropdownOpen(false);
    if (location.pathname === "/about") {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Scrolled state (40px threshold)
      if (currentScrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Hide on scroll down, show on scroll up (with a 80px buffer)
      if (currentScrollY > 150) {
        if (currentScrollY > lastScrollY && currentScrollY - lastScrollY > 6) {
          setHidden(true);
        } else if (lastScrollY - currentScrollY > 6) {
          setHidden(false);
        }
      } else {
        setHidden(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // If on hero (transparent) vs scrolled
  const isTransparent = isHome && !scrolled;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-400 ease-out",
        hidden ? "-translate-y-full" : "translate-y-0",
        isTransparent
          ? "bg-transparent text-ivory-100 py-6"
          : "bg-white/95 backdrop-blur-md text-charcoal py-4 border-b border-sky-100 shadow-sm"
      )}
    >
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-10 flex items-center justify-between">
        {/* Wordmark with Official A.G Import & Export Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 rounded-[2px]"
          aria-label="A.G Import & Export - Home"
        >
          {/* Logo Badge */}
          <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-white p-0.5 border border-amber-400 shadow-sm shrink-0 transition-transform group-hover:scale-105">
            <img
              src="/logo.png"
              alt="A.G Import & Export Official Logo"
              className="w-full h-full object-contain rounded-full"
            />
          </div>

          <div className="flex flex-col">
            <span
              className={cn(
                "font-sans font-extrabold text-base sm:text-lg tracking-wider leading-none transition-colors",
                isTransparent ? "text-ivory-100 group-hover:text-gold-300" : "text-forest-950 group-hover:text-forest-800"
              )}
            >
              A.G IMPORT &amp; EXPORT
            </span>
            <span
              className={cn(
                "text-[9px] font-eyebrow uppercase tracking-[0.2em] mt-1 transition-colors",
                isTransparent ? "text-gold-400" : "text-amber-700 font-semibold"
              )}
            >
              Aryavansh Global · India
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-eyebrow uppercase tracking-[0.18em]">
          {NAV_LINKS.map((link) => {
            const isAboutLink = link.label === "About";
            const isActive = location.pathname === link.to;

            if (isAboutLink) {
              return (
                <div
                  key={link.to}
                  className="relative py-1"
                  onMouseEnter={handleMouseEnterAbout}
                  onMouseLeave={handleMouseLeaveAbout}
                >
                  <Link
                    to={link.to}
                    onClick={() => setIsAboutDropdownOpen(false)}
                    className={cn(
                      "inline-flex items-center gap-1 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 rounded-[2px]",
                      isActive || isAboutDropdownOpen
                        ? isTransparent
                          ? "text-gold-400 font-semibold"
                          : "text-forest-800 font-semibold"
                        : isTransparent
                        ? "text-ivory-200/90 hover:text-gold-300"
                        : "text-charcoal hover:text-forest-800"
                    )}
                  >
                    <span>{link.label}</span>
                    <ChevronDown
                      className={cn(
                        "w-3 h-3 transition-transform duration-200",
                        isAboutDropdownOpen && "rotate-180"
                      )}
                    />
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gold-500 rounded-full" />
                    )}
                  </Link>

                  {/* Dropdown Menu (Matching User Reference Image) */}
                  {isAboutDropdownOpen && (
                    <div className="absolute top-full left-0 mt-2 w-52 bg-white rounded-md shadow-2xl border border-sky-100 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150 normal-case tracking-normal">
                      <Link
                        to="/about"
                        onClick={() => setIsAboutDropdownOpen(false)}
                        className="block px-4 py-2 text-sm font-semibold text-forest-900 hover:text-forest-800 hover:bg-sky-50/80 transition-colors"
                      >
                        About Us
                      </Link>
                      <Link
                        to="/company"
                        onClick={() => setIsAboutDropdownOpen(false)}
                        className="block px-4 py-2 text-sm font-semibold text-amber-600 hover:text-amber-700 hover:bg-amber-50/80 transition-colors"
                      >
                        Company Profile
                      </Link>
                      <Link
                        to="/key-person"
                        onClick={() => setIsAboutDropdownOpen(false)}
                        className="block px-4 py-2 text-sm font-semibold text-amber-600 hover:text-amber-700 hover:bg-amber-50/80 transition-colors"
                      >
                        Key Person
                      </Link>
                      <Link
                        to="/certifications"
                        onClick={() => setIsAboutDropdownOpen(false)}
                        className="block px-4 py-2 text-sm font-semibold text-sky-600 hover:text-sky-700 hover:bg-sky-50/80 transition-colors"
                      >
                        Certifications
                      </Link>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "relative py-1 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 rounded-[2px]",
                  isActive
                    ? isTransparent
                      ? "text-gold-400 font-semibold"
                      : "text-forest-800 font-semibold"
                    : isTransparent
                    ? "text-ivory-200/90 hover:text-gold-300"
                    : "text-charcoal hover:text-forest-800"
                )}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gold-500 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Button & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <Button
            to="/request-quote"
            variant={isTransparent ? "gold" : "primary"}
            size="sm"
            className="hidden sm:inline-flex"
            leftIcon={<MessageSquareQuote className="w-3.5 h-3.5" />}
          >
            Request a Quote
          </Button>

          {/* Mobile menu trigger */}
          <button
            type="button"
            onClick={onOpenMobileMenu}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open navigation menu"}
            aria-expanded={isMobileMenuOpen}
            className={cn(
              "p-2 rounded-[2px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 lg:hidden",
              isTransparent
                ? "text-ivory-100 hover:bg-forest-900/50"
                : "text-forest-950 hover:bg-ivory-300"
            )}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
    </header>
  );
};
