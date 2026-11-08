import { Router, Request, Response } from "express";
import { db } from "../../services/supabase.js";
import { emailService } from "../../services/email.js";
import { requireContentManagers } from "../../middleware/roles.js";

export const adminTemplatesRouter = Router();

const DEFAULT_TEMPLATES = {
  email: [
    {
      id: "tmpl-enq-ack",
      name: "Enquiry Acknowledgement (To Buyer)",
      subject: "Inquiry Received [{{referenceNo}}] - Indian Spice Export",
      bodyHtml: "<p>Dear {{buyerName}},</p><p>Thank you for submitting your procurement requirements to Indian Spice Export. We have logged your request under official reference number <strong>{{referenceNo}}</strong>.</p><p>Our commodity trade desk will review your specifications and reply within 24–48 hours.</p>",
      variables: ["buyerName", "companyName", "referenceNo", "destinationPort"],
    },
    {
      id: "tmpl-quote-sent",
      name: "Formal Quotation Dispatch",
      subject: "Commercial Quotation [{{quotationNo}}] - Indian Spice Export",
      bodyHtml: "<p>Dear {{buyerName}},</p><p>Please find attached our official commercial quotation <strong>{{quotationNo}}</strong> for your requested shipment to {{destinationPort}}.</p><p>Total: {{currency}} {{totalAmount}}</p>",
      variables: ["buyerName", "companyName", "quotationNo", "destinationPort", "totalAmount", "currency"],
    },
  ],
  whatsapp: [
    {
      id: "wa-followup",
      name: "Trade Desk Follow-up",
      body: "Hello {{buyerName}}, thank you for reaching out to Indian Spice Export regarding inquiry {{referenceNo}}. Our export desk would like to discuss shipment schedules and pricing.",
      variables: ["buyerName", "referenceNo", "companyName"],
    },
    {
      id: "wa-quote-ready",
      name: "Quotation Ready Alert",
      body: "Dear {{buyerName}}, your commercial quotation {{quotationNo}} is ready. Total: {{totalAmount}}. Let us know if you need CIF adjustments.",
      variables: ["buyerName", "quotationNo", "totalAmount"],
    },
  ],
};

let templateStore = { ...DEFAULT_TEMPLATES };

// GET /api/admin/templates
adminTemplatesRouter.get("/", (req: Request, res: Response) => {
  res.json({ success: true, data: templateStore });
});

// PUT /api/admin/templates/:type/:id
adminTemplatesRouter.put("/:type/:id", requireContentManagers, (req: Request, res: Response) => {
  const type = String(req.params.type);
  const id = String(req.params.id);
  const payload = req.body;

  if (type === "email") {
    const idx = templateStore.email.findIndex((t) => t.id === id);
    if (idx !== -1) {
      templateStore.email[idx] = { ...templateStore.email[idx], ...payload };
    }
  } else if (type === "whatsapp") {
    const idx = templateStore.whatsapp.findIndex((t) => t.id === id);
    if (idx !== -1) {
      templateStore.whatsapp[idx] = { ...templateStore.whatsapp[idx], ...payload };
    }
  }

  db.log(req.user?.fullName || "Admin", "TEMPLATE_UPDATE", "Template", id, `Updated ${type} template ${id}`);

  res.json({ success: true, data: templateStore });
});

// POST /api/admin/templates/test-send
adminTemplatesRouter.post("/test-send", requireContentManagers, async (req: Request, res: Response) => {
  const { recipientEmail, templateName } = req.body;

  if (!recipientEmail || typeof recipientEmail !== "string") {
    res.status(400).json({ success: false, error: { code: "INVALID_EMAIL", message: "Recipient email is required." } });
    return;
  }

  try {
    const result = await emailService.sendTestEmail(recipientEmail, templateName || "General Notification");
    db.log(req.user?.fullName || "Admin", "TEMPLATE_TEST_SENT", "Template", undefined, `Dispatched test email to ${recipientEmail}`);
    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: "DELIVERY_ERROR", message: err.message } });
  }
});
