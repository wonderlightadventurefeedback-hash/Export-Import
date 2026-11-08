import React from "react";
import { buildWhatsAppLink } from "../../config/company";

export const WhatsAppFloating: React.FC = () => {
  const whatsappUrl = buildWhatsAppLink();

  // Strict fallback ensuring the contact link is always valid
  const targetUrl = whatsappUrl || "https://wa.me/919876543210?text=Hello%2C%20I%20would%20like%20to%20inquire%20about%20wholesale%20spice%20export.";

  return (
    <a
      href={targetUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Direct trade inquiry on WhatsApp"
      title="Chat with our Export Trade Desk on WhatsApp"
      className="fixed bottom-6 right-6 z-50 w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#25D366] text-white shadow-[0_6px_24px_rgba(37,211,102,0.45)] hover:shadow-[0_8px_30px_rgba(37,211,102,0.6)] flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white group cursor-pointer"
    >
      {/* Subtle pulsing background ring */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-30 animate-ping pointer-events-none" />

      {/* Crisp WhatsApp Icon */}
      <svg
        className="w-7 h-7 sm:w-8 sm:h-8 fill-current relative z-10 transition-transform duration-300 group-hover:scale-105"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.978-.277-.1-.478-.15-.679.15-.201.3-.778.978-.954 1.179-.175.2-.351.226-.652.075-.301-.15-1.272-.469-2.423-1.496-.896-.799-1.501-1.786-1.677-2.087-.175-.3-.019-.462.132-.612.136-.135.301-.351.452-.527.15-.175.201-.3.301-.501.101-.2.05-.376-.025-.526-.075-.15-.679-1.636-.93-2.241-.244-.589-.493-.509-.679-.519-.176-.01-.377-.01-.578-.01-.201 0-.527.075-.803.376s-1.054 1.029-1.054 2.509c0 1.48 1.079 2.91 1.229 3.111.15.201 2.124 3.243 5.146 4.549.719.311 1.281.497 1.719.636.723.23 1.381.197 1.901.12.58-.087 1.78-.727 2.031-1.429.251-.702.251-1.304.176-1.429-.075-.126-.276-.201-.577-.351zM12.042 2C6.505 2 2 6.502 2 12.039c0 1.77.462 3.498 1.341 5.023L2 22l5.093-1.336c1.472.803 3.132 1.226 4.949 1.226 5.536 0 10.041-4.502 10.041-10.041 0-2.68-1.044-5.199-2.943-7.098C17.24 2.85 14.721 2 12.042 2zm0 18.358c-1.506 0-2.981-.405-4.271-1.171l-.307-.182-3.174.832.847-3.093-.2-.317a8.318 8.318 0 0 1-1.275-4.388c0-4.606 3.748-8.353 8.355-8.353 2.232 0 4.33.87 5.908 2.449 1.579 1.579 2.448 3.677 2.447 5.908-.001 4.607-3.749 8.356-8.355 8.356z" />
      </svg>
    </a>
  );
};
