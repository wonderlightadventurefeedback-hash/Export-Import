// WhatsApp link builder and message templating for A.G Import & Export

export interface WhatsAppTemplateOptions {
  referenceNo?: string;
  companyName?: string;
  buyerName?: string;
  productName?: string;
  quotationNo?: string;
  amount?: string;
  phone?: string;
}

export const WHATSAPP_TEMPLATES = {
  ENQUIRY_FOLLOWUP: (opts: WhatsAppTemplateOptions) =>
    `Hello ${opts.buyerName || "Sir/Madam"},\n\nThank you for reaching out to A.G Import & Export (Aryavansh Global) regarding your trade inquiry ${opts.referenceNo ? `(${opts.referenceNo})` : ""}.\n\nOur export desk has reviewed your specifications and would be glad to discuss shipment schedules and pricing.\n\nBest regards,\nTrade & Export Desk\nA.G Import & Export`,

  QUOTATION_NOTIFICATION: (opts: WhatsAppTemplateOptions) =>
    `Dear ${opts.buyerName || "Partner"},\n\nYour official commercial quotation ${opts.quotationNo ? `(${opts.quotationNo})` : ""} from A.G Import & Export has been prepared for ${opts.companyName || "your company"}.\n\nTotal: ${opts.amount || "See attached"}.\n\nPlease let us know if you require any adjustments on Incoterms or packaging.\n\nBest regards,\nA.G Import & Export`,

  DIRECT_DESK_CHAT: (opts: WhatsAppTemplateOptions) =>
    `Hello A.G Import & Export Trade Desk,\n\nI am contacting you regarding bulk spice procurement${opts.productName ? ` for ${opts.productName}` : ""}. Please connect me with an export manager.`,
};

/**
 * Normalizes phone number to international format without plus or spaces (e.g., 919876543210)
 */
export function formatPhoneNumber(phone: string): string {
  return phone.replace(/[^\d]/g, "");
}

/**
 * Builds a universal WhatsApp click-to-chat URL
 */
export function buildWhatsAppLink(phoneNumber: string, message: string): string {
  const cleanNumber = formatPhoneNumber(phoneNumber);
  const encodedText = encodeURIComponent(message);
  return `https://wa.me/${cleanNumber}?text=${encodedText}`;
}

export const whatsappService = {
  buildEnquiryFollowup(phone: string, opts: WhatsAppTemplateOptions): string {
    const text = WHATSAPP_TEMPLATES.ENQUIRY_FOLLOWUP(opts);
    return buildWhatsAppLink(phone, text);
  },

  buildQuotationNotification(phone: string, opts: WhatsAppTemplateOptions): string {
    const text = WHATSAPP_TEMPLATES.QUOTATION_NOTIFICATION(opts);
    return buildWhatsAppLink(phone, text);
  },

  buildTradeDeskLink(opts: WhatsAppTemplateOptions = {}): string {
    const defaultDeskPhone = process.env.WHATSAPP_DESK_NUMBER || "919437000000";
    const text = WHATSAPP_TEMPLATES.DIRECT_DESK_CHAT(opts);
    return buildWhatsAppLink(defaultDeskPhone, text);
  },
};
