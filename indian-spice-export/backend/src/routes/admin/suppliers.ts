import { Router, Request, Response } from "express";
import { z } from "zod";
import { db, Supplier } from "../../services/supabase.js";
import { requireContentManagers } from "../../middleware/roles.js";

export const adminSuppliersRouter = Router();

const SupplierSchema = z.object({
  supplier_code: z.string().min(2, "Supplier code is required"),
  supplier_type: z.enum(["Farmer", "Manufacturer", "Wholesaler", "Other approved supplier"]),
  business_or_farm_name: z.string().min(2, "Business or farm name is required"),
  contact_person: z.string().min(2, "Contact person is required"),
  phone: z.string().optional().default(""),
  email: z.string().optional().default(""),
  state: z.string().default("Odisha"),
  district: z.string().optional().default(""),
  address: z.string().optional().default(""),
  verification_status: z.enum(["Pending", "Verified", "Suspended"]).default("Pending"),
  internal_notes: z.string().optional().default(""),
  linked_products: z.array(z.string()).default([]),
});

// GET /api/admin/suppliers - List internal suppliers
adminSuppliersRouter.get("/", (req: Request, res: Response) => {
  const { type, status, search } = req.query;
  let items = [...db.suppliers];

  if (type && typeof type === "string" && type !== "all") {
    items = items.filter((s) => s.supplier_type.toLowerCase() === type.toLowerCase());
  }

  if (status && typeof status === "string" && status !== "all") {
    items = items.filter((s) => s.verification_status.toLowerCase() === status.toLowerCase());
  }

  if (search && typeof search === "string") {
    const q = search.toLowerCase();
    items = items.filter(
      (s) =>
        s.business_or_farm_name.toLowerCase().includes(q) ||
        s.contact_person.toLowerCase().includes(q) ||
        s.supplier_code.toLowerCase().includes(q) ||
        s.district.toLowerCase().includes(q)
    );
  }

  res.json({ success: true, data: items });
});

// GET /api/admin/suppliers/:id
adminSuppliersRouter.get("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const supplier = db.suppliers.find((s) => s.id === id || s.supplier_code === id);
  if (!supplier) {
    res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Supplier record not found." } });
    return;
  }
  res.json({ success: true, data: supplier });
});

// POST /api/admin/suppliers
adminSuppliersRouter.post("/", requireContentManagers, (req: Request, res: Response) => {
  const result = SupplierSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", details: result.error.flatten() } });
    return;
  }

  const data = result.data;
  if (db.suppliers.some((s) => s.supplier_code === data.supplier_code)) {
    res.status(409).json({ success: false, error: { code: "CODE_EXISTS", message: "Supplier code already exists." } });
    return;
  }

  const newSupplier: Supplier = {
    id: `sup-${Date.now()}`,
    ...data,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  db.suppliers.unshift(newSupplier);
  db.log(req.user?.fullName || "Admin", "SUPPLIER_CREATE", "Supplier", newSupplier.id, `Registered supplier ${newSupplier.business_or_farm_name} (${newSupplier.supplier_code})`);

  res.status(201).json({ success: true, data: newSupplier });
});

// PUT /api/admin/suppliers/:id
adminSuppliersRouter.put("/:id", requireContentManagers, (req: Request, res: Response) => {
  const { id } = req.params;
  const index = db.suppliers.findIndex((s) => s.id === id || s.supplier_code === id);

  if (index === -1) {
    res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Supplier record not found." } });
    return;
  }

  const result = SupplierSchema.partial().safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", details: result.error.flatten() } });
    return;
  }

  const updated: Supplier = {
    ...db.suppliers[index],
    ...result.data,
    updated_at: new Date().toISOString(),
  };

  db.suppliers[index] = updated;
  db.log(req.user?.fullName || "Admin", "SUPPLIER_UPDATE", "Supplier", updated.id, `Updated supplier ${updated.business_or_farm_name}`);

  res.json({ success: true, data: updated });
});

// DELETE /api/admin/suppliers/:id
adminSuppliersRouter.delete("/:id", requireContentManagers, (req: Request, res: Response) => {
  const { id } = req.params;
  const index = db.suppliers.findIndex((s) => s.id === id);

  if (index === -1) {
    res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Supplier record not found." } });
    return;
  }

  const deleted = db.suppliers.splice(index, 1)[0];
  db.log(req.user?.fullName || "Admin", "SUPPLIER_DELETE", "Supplier", deleted.id, `Deleted supplier ${deleted.business_or_farm_name}`);

  res.json({ success: true, message: `Supplier ${deleted.business_or_farm_name} removed.` });
});
