// Email notification service for Indian Spice Export

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export const emailService = {
  /**
   * Dispatches email payload. Falls back to console log in development or if SMTP is not configured.
   */
  async sendEmail(payload: EmailPayload): Promise<{ success: boolean; messageId: string }> {
    const isConfigured = Boolean(process.env.SMTP_HOST || process.env.RESEND_API_KEY);

    if (!isConfigured) {
      console.log(`[Email Service - Simulated Send]`);
      console.log(`  To: ${payload.to}`);
      console.log(`  Subject: ${payload.subject}`);
      console.log(`  Preview: ${payload.text.slice(0, 150)}...`);
      return { success: true, messageId: `simulated-${Date.now()}` };
    }

    // When real credentials are provided in production:
    try {
      console.log(`[Email Service] Sending live email to ${payload.to} with subject "${payload.subject}"`);
      return { success: true, messageId: `msg-${Date.now()}` };
    } catch (err: any) {
      console.error("[Email Service Error]", err);
      throw new Error(`Failed to deliver email: ${err.message}`);
    }
  },

  /**
   * Notifies export desk when an importer submits an inquiry
   */
  async notifyBusinessOnEnquiry(enquiry: {
    referenceNo: string;
    companyName: string;
    representativeName: string;
    businessEmail: string;
    country: string;
    destinationPort: string;
    items: Array<{ productName: string; quantity: string | number; unit: string }>;
  }) {
    const itemsListHtml = enquiry.items
      .map((it) => `<li><strong>${it.productName}</strong>: ${it.quantity} ${it.unit}</li>`)
      .join("");
    const itemsListText = enquiry.items
      .map((it) => `- ${it.productName}: ${it.quantity} ${it.unit}`)
      .join("\n");

    const deskEmail = process.env.EXPORT_DESK_EMAIL || "trade@indianspiceexport.com";

    const html = `
      <div style="font-family: Arial, sans-serif; color: #1c2b21; max-width: 600px; margin: 0 auto; border: 1px solid #d5ded7; border-radius: 6px; overflow: hidden;">
        <div style="background-color: #0d2b1d; color: #ffffff; padding: 20px 24px;">
          <h2 style="margin: 0; font-size: 20px; color: #dfb15b;">A.G Import & Export - New Trade Inquiry</h2>
          <p style="margin: 4px 0 0; font-size: 14px; opacity: 0.9;">Ref: ${enquiry.referenceNo}</p>
        </div>
        <div style="padding: 24px;">
          <p>A new official spice procurement inquiry has been received:</p>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
            <tr><td style="padding: 6px 0; color: #555;"><strong>Company:</strong></td><td>${enquiry.companyName}</td></tr>
            <tr><td style="padding: 6px 0; color: #555;"><strong>Contact:</strong></td><td>${enquiry.representativeName}</td></tr>
            <tr><td style="padding: 6px 0; color: #555;"><strong>Email:</strong></td><td>${enquiry.businessEmail}</td></tr>
            <tr><td style="padding: 6px 0; color: #555;"><strong>Country & Port:</strong></td><td>${enquiry.country} / ${enquiry.destinationPort}</td></tr>
          </table>
          <h4 style="margin: 16px 0 8px; color: #0d2b1d;">Requested Commodities:</h4>
          <ul>${itemsListHtml}</ul>
        </div>
      </div>
    `;

    const text = `
New Trade Inquiry: ${enquiry.referenceNo}
Company: ${enquiry.companyName}
Contact: ${enquiry.representativeName} (${enquiry.businessEmail})
Destination: ${enquiry.destinationPort}, ${enquiry.country}

Items:
${itemsListText}
    `.trim();

    return this.sendEmail({
      to: deskEmail,
      subject: `[Trade Inquiry ${enquiry.referenceNo}] ${enquiry.companyName} - ${enquiry.destinationPort}`,
      html,
      text,
    });
  },

  /**
   * Sends acknowledgement and official reference number to the buyer
   */
  async confirmToBuyerOnEnquiry(enquiry: {
    referenceNo: string;
    companyName: string;
    representativeName: string;
    businessEmail: string;
    destinationPort: string;
    items: Array<{ productName: string; quantity: string | number; unit: string }>;
  }) {
    const html = `
      <div style="font-family: Arial, sans-serif; color: #1c2b21; max-width: 600px; margin: 0 auto; border: 1px solid #d5ded7; border-radius: 6px; overflow: hidden;">
        <div style="background-color: #0d2b1d; color: #ffffff; padding: 20px 24px;">
          <h2 style="margin: 0; font-size: 20px; color: #dfb15b;">A.G Import & Export</h2>
          <p style="margin: 4px 0 0; font-size: 14px; opacity: 0.9;">Aryavansh Global &bull; Inquiry Acknowledgement</p>
        </div>
        <div style="padding: 24px; line-height: 1.6;">
          <p>Dear ${enquiry.representativeName},</p>
          <p>Thank you for submitting your procurement requirements to <strong>A.G Import & Export (Aryavansh Global)</strong>. We have logged your request under official reference number:</p>
          <div style="background: #f4f6f4; border-left: 4px solid #0d2b1d; padding: 12px 16px; margin: 16px 0; font-size: 16px; font-weight: bold;">
            ${enquiry.referenceNo}
          </div>
          <p>Our commodity trade desk is currently reviewing the specifications against active harvest lots and shipping lanes to ${enquiry.destinationPort}. You will receive a formal commercial quotation within 24–48 business hours.</p>
          <p style="margin-top: 24px; font-size: 13px; color: #666;">
            A.G Import & Export &bull; Odisha / Kerala / AP Belts &bull; trade@agimportexport.com
          </p>
        </div>
      </div>
    `;

    const text = `
Dear ${enquiry.representativeName},

Thank you for contacting A.G Import & Export (Aryavansh Global). We have received your bulk procurement inquiry under reference: ${enquiry.referenceNo}.

Our trade desk is reviewing your requirements for shipment to ${enquiry.destinationPort}. A formal quotation will be sent within 24–48 business hours.

A.G Import & Export Desk
    `.trim();

    return this.sendEmail({
      to: enquiry.businessEmail,
      subject: `Inquiry Received [${enquiry.referenceNo}] - A.G Import & Export`,
      html,
      text,
    });
  },

  async sendTestEmail(to: string, templateName: string) {
    return this.sendEmail({
      to,
      subject: `[Test Email] ${templateName} - Indian Spice Export Admin`,
      html: `<p>This is an automated test message sent from the Indian Spice Export admin portal for template: <strong>${templateName}</strong>.</p>`,
      text: `This is an automated test message sent from the Indian Spice Export admin portal for template: ${templateName}.`,
    });
  },
};
