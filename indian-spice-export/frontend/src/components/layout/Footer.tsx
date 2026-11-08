import React from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Clock, ArrowUpRight } from "lucide-react";
import { COMPANY_CONFIG } from "../../config/company";
import { MOCK_CATEGORIES } from "../../services/mock";
import { Container } from "../ui/Container";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-forest-950 text-ivory-100 border-t border-forest-900 pt-16 sm:pt-20 pb-12 select-none">
      {/* Top Gold Hairline Divider */}
      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-gold-500/30 to-transparent mb-12 sm:mb-16" />

      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-16 border-b border-forest-900/80">
          {/* Column 1: Brand & Editorial Statement */}
          <div className="flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-white p-0.5 border border-amber-400 shrink-0">
                <img
                  src="/logo.png"
                  alt="A.G Import & Export Logo"
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
              <span className="font-sans font-bold text-lg tracking-wider text-ivory-100">
                A.G IMPORT &amp; EXPORT
              </span>
            </Link>

            <p className="font-serif italic text-gold-400 text-sm">
              "{COMPANY_CONFIG.tagline}"
            </p>

            <p className="text-xs sm:text-sm text-ivory-300/80 leading-relaxed">
              {COMPANY_CONFIG.shortDescription}
            </p>

            <div className="mt-2 text-xs font-eyebrow text-gold-500 uppercase tracking-widest">
              Origin: {COMPANY_CONFIG.location.displayLocation}
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-eyebrow text-gold-400 uppercase tracking-[0.2em] mb-2">
              Trading House
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm text-ivory-300/80">
              <li>
                <Link to="/about" className="hover:text-gold-400 transition-colors">
                  About Our Sourcing
                </Link>
              </li>
              <li>
                <Link to="/company" className="hover:text-gold-400 transition-colors">
                  Company Profile
                </Link>
              </li>
              <li>
                <Link to="/key-person" className="hover:text-gold-400 transition-colors">
                  Key Persons &amp; Directors
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-gold-400 transition-colors">
                  Spice Catalogue &amp; Lots
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-gold-400 transition-colors">
                  Wholesale &amp; OEM Services
                </Link>
              </li>
              <li>
                <Link to="/certifications" className="hover:text-gold-400 transition-colors">
                  Official Certifications
                </Link>
              </li>
              <li>
                <Link to="/faqs" className="hover:text-gold-400 transition-colors">
                  Frequently Asked Questions (F &amp; Q)
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-gold-400 transition-colors">
                  Contact Trade Desk
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Featured Spice Categories */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-eyebrow text-gold-400 uppercase tracking-[0.2em] mb-2">
              Primary Commodities
            </h4>
            <ul className="grid grid-cols-1 gap-2 text-sm text-ivory-300/80">
              {MOCK_CATEGORIES.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/products?category=${cat.slug}`}
                    className="hover:text-gold-400 transition-colors inline-flex items-center gap-1 group"
                  >
                    <span>{cat.name}</span>
                    <ArrowUpRight className="w-3 h-3 text-gold-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact & Trade Inquiry */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-eyebrow text-gold-400 uppercase tracking-[0.2em] mb-2">
              Export Desk
            </h4>
            <div className="flex flex-col gap-3 text-xs sm:text-sm text-ivory-300/80">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <span>{COMPANY_CONFIG.location.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-gold-400 shrink-0" />
                <span>{COMPANY_CONFIG.contact.email}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gold-400 shrink-0" />
                <span>{COMPANY_CONFIG.contact.phone}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <span className="text-xs">{COMPANY_CONFIG.contact.workingHours}</span>
              </div>
            </div>

            <div className="mt-2 text-[11px] text-ivory-400 bg-forest-900/60 p-2.5 rounded-[2px] border border-forest-800">
              {COMPANY_CONFIG.contact.inquiryNotice}
            </div>
          </div>
        </div>

        {/* Bottom Bar: Legal & Attribution */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ivory-400">
          <div>
            &copy; {currentYear} {COMPANY_CONFIG.name}. Sourced in Odisha & pan-India. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <Link to="/privacy-policy" className="hover:text-gold-400 transition-colors">
              Privacy Policy
            </Link>
            <span className="text-forest-800">·</span>
            <Link to="/terms" className="hover:text-gold-400 transition-colors">
              Terms & Conditions
            </Link>
            <span className="text-forest-800">·</span>
            <Link to="/design" className="hover:text-gold-400 transition-colors">
              Design System
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
};
