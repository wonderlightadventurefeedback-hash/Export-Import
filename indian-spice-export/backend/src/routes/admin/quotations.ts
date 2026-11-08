import { Router, Request, Response } from "express";
import { z } from "zod";
import { db, Quotation } from "../../services/supabase.js";
import { requireStaff } from "../../middleware/roles.js";

export const adminQuotationsRouter = Router();

const QuotationItemSchema = z.object({
  id: z.string().optional(),
  product_name: z.string().min(1, "Product name is required"),
  quantity: z.number().positive("Quantity must be positive"),
  unit: z.string().default("MT"),
  unit_price: z.number().nonnegative("Unit price must be non-negative"),
  total_price: z.number().nonnegative(),
  packaging: z.string().optional(),
  specifications_summary: z.string().optional(),
});

const QuotationInputSchema = z.object({
  enquiry_id: z.string().optional(),
  buyer_id: z.string().optional(),
  buyer_name: z.string().min(1, "Buyer name is required"),
  company_name: z.string().min(1, "Company name is required"),
  currency: z.string().default("USD"),
  incoterm: z.string().default("CIF"),
  destination_port: z.string().min(1, "Destination port is required"),
  payment_terms: z.string().default("Irrevocable Confirmed L/C at sight"),
  valid_until: z.string(),
  status: z.enum(["Draft", "Sent", "Accepted", "Expired", "Revised"]).default("Draft"),
  insurance_and_freight: z.number().default(0),
  terms_conditions: z.string().optional().default(""),
  items: z.array(QuotationItemSchema).min(1, "At least one item required"),
});

// GET /api/admin/quotations
adminQuotationsRouter.get("/", (req: Request, res: Response) => {
  const { status, search } = req.query;
  let items = [...db.quotations];

  if (status && typeof status === "string" && status !== "all") {
    items = items.filter((q) => q.status.toLowerCase() === status.toLowerCase());
  }

  if (search && typeof search === "string") {
    const s = search.toLowerCase();
    items = items.filter(
      (q) =>
        q.quotation_no.toLowerCase().includes(s) ||
        q.company_name.toLowerCase().includes(s) ||
        q.buyer_name.toLowerCase().includes(s) ||
        q.destination_port.toLowerCase().includes(s)
    );
  }

  res.json({
    success: true,
    data: items,
  });
});

// GET /api/admin/quotations/:id
adminQuotationsRouter.get("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const quote = db.quotations.find((q) => q.id === id || q.quotation_no === id);

  if (!quote) {
    res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Quotation not found." } });
    return;
  }

  res.json({ success: true, data: quote });
});

// POST /api/admin/quotations
adminQuotationsRouter.post("/", requireStaff, (req: Request, res: Response) => {
  const result = QuotationInputSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      success: false,
      error: { code: "VALIDATION_ERROR", details: result.error.flatten() },
    });
    return;
  }

  const data = result.data;
  const subtotal = data.items.reduce((sum, it) => sum + it.unit_price * it.quantity, 0);
  const total = subtotal + data.insurance_and_freight;

  const count = db.quotations.length + 1;
  const quoteNo = `QTE-2026-${count.toString().padStart(5, "0")}`;

  const newQuote: Quotation = {
    id: `qte-${Date.now()}`,
    quotation_no: quoteNo,
    ...data,
    prepared_by: req.user?.fullName || "Staff",
    subtotal: Math.round(subtotal * 100) / 100,
    insurance_and_freight: data.insurance_and_freight,
    total_amount: Math.round(total * 100) / 100,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  db.quotations.unshift(newQuote);

  // If created from an enquiry, optionally update enquiry status to Quoted
  if (data.enquiry_id) {
    const enq = db.enquiries.find((e) => e.id === data.enquiry_id);
    if (enq && enq.status === "New") {
      enq.status = "Quoted";
      enq.updated_at = new Date().toISOString();
    }
  }

  db.log(
    req.user?.fullName || "Admin",
    "QUOTATION_CREATE",
    "Quotation",
    newQuote.id,
    `Created quotation ${newQuote.quotation_no} for ${newQuote.company_name} ($${newQuote.total_amount})`
  );

  res.status(201).json({ success: true, data: newQuote });
});

// PUT /api/admin/quotations/:id
adminQuotationsRouter.put("/:id", requireStaff, (req: Request, res: Response) => {
  const { id } = req.params;
  const index = db.quotations.findIndex((q) => q.id === id || q.quotation_no === id);

  if (index === -1) {
    res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Quotation not found." } });
    return;
  }

  const result = QuotationInputSchema.partial().safeParse(req.body);
  if (!result.success) {
    res.status(400).json({
      success: false,
      error: { code: "VALIDATION_ERROR", details: result.error.flatten() },
    });
    return;
  }

  const current = db.quotations[index];
  const items = result.data.items || current.items;
  const freight = result.data.insurance_and_freight ?? current.insurance_and_freight;
  const subtotal = items.reduce((sum, it) => sum + it.unit_price * it.quantity, 0);
  const total = subtotal + freight;

  const updated: Quotation = {
    ...current,
    ...result.data,
    items,
    insurance_and_freight: freight,
    subtotal: Math.round(subtotal * 100) / 100,
    total_amount: Math.round(total * 100) / 100,
    updated_at: new Date().toISOString(),
  };

  db.quotations[index] = updated;
  db.log(req.user?.fullName || "Admin", "QUOTATION_UPDATE", "Quotation", updated.id, `Updated quotation ${updated.quotation_no}`);

  res.json({ success: true, data: updated });
});

// GET /api/admin/quotations/:id/pdf-data - Returns structured print/PDF payload
adminQuotationsRouter.get("/:id/pdf-data", (req: Request, res: Response) => {
  const { id } = req.params;
  const quote = db.quotations.find((q) => q.id === id || q.quotation_no === id);

  if (!quote) {
    res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Quotation not found." } });
    return;
  }

  const company = db.settings.general || {};
  const certs = db.settings.certifications || {};

  res.json({
    success: true,
    data: {
      quotation: quote,
      company: {
        name: company.companyName || "Indian Spice Export",
        legalName: company.legalName || "Indian Spice Export Private Limited",
        registeredOffice: company.registeredOffice,
        spiceBoardRegistrationNo: certs.spiceBoardRegistrationNo,
        fssaiLicense: certs.fssaiLicense,
        iecCode: certs.iecCode,
        emails: company.emails,
        phones: company.phones,
      },
    },
  });
});
