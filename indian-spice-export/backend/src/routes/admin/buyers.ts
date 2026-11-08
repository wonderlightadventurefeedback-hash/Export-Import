import { Router, Request, Response } from "express";
import { z } from "zod";
import { db, Buyer } from "../../services/supabase.js";
import { requireStaff } from "../../middleware/roles.js";

export const adminBuyersRouter = Router();

const BuyerSchema = z.object({
  company_name: z.string().min(2, "Company name is required"),
  contact_person: z.string().min(2, "Contact person is required"),
  email: z.string().email("Valid email is required"),
  phone_whatsapp: z.string().optional().default(""),
  country: z.string().min(2, "Country is required"),
  city: z.string().optional().default(""),
  buyer_type: z.string().default("Importer"),
  notes: z.string().optional().default(""),
  tags: z.array(z.string()).default([]),
});

// GET /api/admin/buyers
adminBuyersRouter.get("/", (req: Request, res: Response) => {
  const { search, country } = req.query;
  let items = [...db.buyers];

  if (country && typeof country === "string" && country !== "all") {
    items = items.filter((b) => b.country.toLowerCase() === country.toLowerCase());
  }

  if (search && typeof search === "string") {
    const q = search.toLowerCase();
    items = items.filter(
      (b) =>
        b.company_name.toLowerCase().includes(q) ||
        b.contact_person.toLowerCase().includes(q) ||
        b.email.toLowerCase().includes(q) ||
        b.country.toLowerCase().includes(q)
    );
  }

  // Attach enquiry count to each buyer
  const enriched = items.map((b) => ({
    ...b,
    enquiriesCount: db.enquiries.filter((e) => e.buyer_id === b.id || e.business_email.toLowerCase() === b.email.toLowerCase()).length,
  }));

  res.json({ success: true, data: enriched });
});

// GET /api/admin/buyers/:id
adminBuyersRouter.get("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const buyer = db.buyers.find((b) => b.id === id);

  if (!buyer) {
    res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Buyer not found." } });
    return;
  }

  const relatedEnquiries = db.enquiries.filter((e) => e.buyer_id === buyer.id || e.business_email.toLowerCase() === buyer.email.toLowerCase());
  const relatedQuotations = db.quotations.filter((q) => q.buyer_id === buyer.id || q.company_name.toLowerCase() === buyer.company_name.toLowerCase());

  res.json({
    success: true,
    data: {
      ...buyer,
      enquiries: relatedEnquiries,
      quotations: relatedQuotations,
    },
  });
});

// POST /api/admin/buyers
adminBuyersRouter.post("/", requireStaff, (req: Request, res: Response) => {
  const result = BuyerSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", details: result.error.flatten() } });
    return;
  }

  const newBuyer: Buyer = {
    id: `buy-${Date.now()}`,
    ...result.data,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  db.buyers.unshift(newBuyer);
  db.log(req.user?.fullName || "Staff", "BUYER_CREATE", "Buyer", newBuyer.id, `Created buyer account for ${newBuyer.company_name}`);

  res.status(201).json({ success: true, data: newBuyer });
});

// PUT /api/admin/buyers/:id
adminBuyersRouter.put("/:id", requireStaff, (req: Request, res: Response) => {
  const { id } = req.params;
  const index = db.buyers.findIndex((b) => b.id === id);

  if (index === -1) {
    res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Buyer not found." } });
    return;
  }

  const result = BuyerSchema.partial().safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", details: result.error.flatten() } });
    return;
  }

  const updated: Buyer = {
    ...db.buyers[index],
    ...result.data,
    updated_at: new Date().toISOString(),
  };

  db.buyers[index] = updated;
  db.log(req.user?.fullName || "Staff", "BUYER_UPDATE", "Buyer", updated.id, `Updated buyer details for ${updated.company_name}`);

  res.json({ success: true, data: updated });
});
