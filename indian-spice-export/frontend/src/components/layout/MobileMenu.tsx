import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { X, ArrowRight, Phone, MessageSquareQuote, Mail } from "lucide-react";
import { NAV_LINKS } from "./Navbar";
import { COMPANY_CONFIG, buildWhatsAppLink } from "../../config/company";
import { Button } from "../ui/Button";
import { cn } from "../../utils/cn";

export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const whatsappUrl = buildWhatsAppLink();

  // Close menu on route change
  useEffect(() => {
    onClose();
  }, [location.pathname, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Navigation Menu"
      className="fixed inset-0 z-50 bg-forest-950 text-ivory-100 flex flex-col justify-between p-6 sm:p-10 overflow-y-auto"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-forest-800 pb-6">
        <Link to="/" onClick={onClose} className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-white p-0.5 border border-amber-400 shrink-0">
            <img
              src="/logo.png"
              alt="A.G Import & Export Logo"
              className="w-full h-full object-contain rounded-full"
            />
          </div>
          <span className="font-sans font-bold text-base tracking-wider text-ivory-100">
            A.G IMPORT &amp; EXPORT
          </span>
        </Link>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="p-2 text-ivory-300 hover:text-gold-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 rounded-[2px]"
        >
          <X className="w-7 h-7" />
        </button>
      </div>

      {/* Primary Links */}
      <nav className="my-8 flex flex-col gap-5">
        {NAV_LINKS.map((link, idx) => {
          const isActive = location.pathname === link.to;
          const isAbout = link.label === "About";

          return (
            <div key={link.to} className="flex flex-col">
              <Link
                to={link.to}
                onClick={onClose}
                className={cn(
                  "group flex items-baseline justify-between py-2 border-b border-forest-900 transition-colors",
                  isActive ? "text-gold-400" : "text-ivory-200 hover:text-gold-300"
                )}
              >
                <div className="flex items-baseline gap-4">
                  <span className="font-serif text-xs text-gold-600/80">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span className="font-serif text-2xl sm:text-3xl font-normal tracking-wide">
                    {link.label}
                  </span>
                </div>
                <ArrowRight className="w-5 h-5 text-gold-500/40 group-hover:text-gold-400 group-hover:translate-x-1 transition-all" />
              </Link>

              {/* Sub-items for About in Mobile Menu */}
              {isAbout && (
                <div className="pl-10 py-2 flex flex-col gap-2">
                  <Link
                    to="/company"
                    onClick={onClose}
                    className="text-sm font-semibold text-amber-400 hover:text-amber-300 py-1"
                  >
                    ↳ Company Profile
                  </Link>
                  <Link
                    to="/key-person"
                    onClick={onClose}
                    className="text-sm font-semibold text-amber-400 hover:text-amber-300 py-1"
                  >
                    ↳ Key Person
                  </Link>
                  <Link
                    to="/certifications"
                    onClick={onClose}
                    className="text-sm font-semibold text-sky-400 hover:text-sky-300 py-1"
                  >
                    ↳ Certifications
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Bottom Actions & Contact */}
      <div className="pt-6 border-t border-forest-800 flex flex-col gap-4">
        <Button
          to="/request-quote"
          variant="gold"
          size="lg"
          className="w-full justify-center"
          leftIcon={<MessageSquareQuote className="w-5 h-5" />}
          onClick={onClose}
        >
          Request an Export Quotation
        </Button>

        {whatsappUrl && (
          <Button
            href={whatsappUrl}
            target="_blank"
            variant="whatsapp"
            size="md"
            className="w-full justify-center"
            leftIcon={<Phone className="w-4 h-4" />}
          >
            Direct WhatsApp Inquiries
          </Button>
        )}

        <div className="mt-4 flex flex-col gap-2 text-xs text-ivory-300/70">
          <div className="flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 text-gold-400" />
            <span>{COMPANY_CONFIG.contact.email}</span>
          </div>
          <div>
            <span>Location: {COMPANY_CONFIG.location.displayLocation}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
