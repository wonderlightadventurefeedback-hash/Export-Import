import React from "react";
import { Link, useLocation } from "react-router-dom";
import { MessageSquareQuote, Phone } from "lucide-react";
import { buildWhatsAppLink } from "../../config/company";

export const MobileQuoteBar: React.FC = () => {
  const location = useLocation();
  const whatsappUrl = buildWhatsAppLink();

  // Hide on quote page itself to prevent redundancy
  if (location.pathname === "/request-quote") return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-forest-950/95 backdrop-blur-md border-t border-gold-500/30 p-3 px-4 shadow-[0_-4px_16px_rgba(0,0,0,0.2)]">
      <div className="flex items-center gap-2 max-w-md mx-auto">
        <Link
          to="/request-quote"
          className="flex-1 flex items-center justify-center gap-2 bg-gold-500 text-forest-950 font-semibold py-2.5 px-4 rounded-[2px] text-xs uppercase tracking-wider shadow-sm active:bg-gold-600 transition-colors"
        >
          <MessageSquareQuote className="w-4 h-4" />
          <span>Request a Quote</span>
        </Link>

        {whatsappUrl && (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Direct WhatsApp inquiry"
            className="p-2.5 bg-[#25D366] text-white rounded-[2px] shrink-0"
          >
            <Phone className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  );
};
