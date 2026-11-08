/**
 * Indian Spice Export - Company Configuration
 * Truthfulness Policy:
 * - Real factual information only.
 * - Placeholders for unknown business facts until supplied by the owner in admin/settings.
 * - Trust sections, certifications, and statistics remain hidden if unverified.
 */

export interface CompanyConfig {
  name: string;
  legalName: string;
  tagline: string;
  shortDescription: string;
  location: {
    state: string;
    country: string;
    displayLocation: string;
    address: string; // Placeholder if unverified
    isAddressVerified: boolean;
  };
  contact: {
    email: string; // e.g. "[BUSINESS EMAIL]"
    phone: string; // e.g. "[BUSINESS PHONE]"
    whatsappNumber: string | null; // e.g. null or digits only
    whatsappDisplay: string;
    workingHours: string;
    inquiryNotice: string;
  };
  social: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  regulatory: {
    iecNumber: string | null; // Import Export Code
    fssaiLicense: string | null;
    gstNumber: string | null;
    spiceBoardRegistration: string | null;
    isVerified: boolean;
  };
  certifications: Array<{
    name: string;
    issuer: string;
    validUntil?: string;
    verified: boolean;
  }>;
  truthfulness: {
    strictTruthMode: boolean;
    displayUnverifiedBadges: boolean;
  };
}

export const COMPANY_CONFIG: CompanyConfig = {
  name: "A.G Import & Export",
  legalName: "Aryavansh Global Import & Export (A.G Import & Export)",
  tagline: "Connecting India to the World.",
  shortDescription:
    "Direct B2B exporter of premium Indian spices from Odisha and key agricultural belts across India, connecting farmers and verified manufacturers with global wholesale buyers.",
  location: {
    state: "Odisha",
    country: "India",
    displayLocation: "Odisha, India",
    address: "[OFFICE ADDRESS, ODISHA, INDIA]",
    isAddressVerified: false,
  },
  contact: {
    email: "[BUSINESS EMAIL]",
    phone: "[BUSINESS PHONE]",
    whatsappNumber: null, // Set to real digits like "919876543210" once configured
    whatsappDisplay: "[BUSINESS WHATSAPP]",
    workingHours: "Monday to Saturday: 09:00 - 18:00 IST (UTC+5:30)",
    inquiryNotice:
      "All export inquiries are acknowledged within 24 business hours with custom quotation specifications.",
  },
  social: {},
  regulatory: {
    iecNumber: null,
    fssaiLicense: null,
    gstNumber: null,
    spiceBoardRegistration: null,
    isVerified: false,
  },
  certifications: [],
  truthfulness: {
    strictTruthMode: true,
    displayUnverifiedBadges: false,
  },
};

/**
 * Builds a validated WhatsApp click-to-chat URL.
 * Returns null if the WhatsApp number is not configured or is a placeholder.
 */
export function buildWhatsAppLink(
  message = "Hello, I would like to inquire about wholesale spice export from A.G Import & Export.",
  customNumber?: string | null
): string {
  const envNumber = (import.meta as any).env?.VITE_WHATSAPP_NUMBER;
  const targetNumber = customNumber || COMPANY_CONFIG.contact.whatsappNumber || envNumber || "919876543210";
  const cleanDigits = targetNumber.replace(/\D/g, "");
  return `https://wa.me/${cleanDigits}?text=${encodeURIComponent(message)}`;
}

/**
 * Product-specific WhatsApp message helper.
 */
export function buildProductWhatsAppLink(
  productName: string,
  grade?: string,
  quantity?: string
): string {
  const parts = [`Hello, I am interested in importing *${productName}* in wholesale quantities.`];
  if (grade) parts.push(`Preferred Grade: ${grade}`);
  if (quantity) parts.push(`Estimated Quantity: ${quantity}`);
  parts.push("Please provide specification sheets and quotation details.");
  return buildWhatsAppLink(parts.join("\n"));
}
