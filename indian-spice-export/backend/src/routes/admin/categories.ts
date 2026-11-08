import { Router, Request, Response } from "express";
import { z } from "zod";
import { db, Category } from "../../services/supabase.js";
import { requireContentManagers } from "../../middleware/roles.js";

export const adminCategoriesRouter = Router();

const CategorySchema = z.object({
  name: z.string().min(2, "Name is required"),
  slug: z.string().min(2, "Slug is required"),
  tagline: z.string().optional().default(""),
  description: z.string().optional().default(""),
  hero_image_url: z.string().optional().default(""),
  featured_order: z.number().int().default(0),
  is_published: z.boolean().default(true),
});

// GET /api/admin/categories
adminCategoriesRouter.get("/", (req: Request, res: Response) => {
  res.json({
    success: true,
    data: db.categories,
  });
});

// GET /api/admin/categories/:id
adminCategoriesRouter.get("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const category = db.categories.find((c) => c.id === id || c.slug === id);
  if (!category) {
    res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Category not found." } });
    return;
  }
  res.json({ success: true, data: category });
});

// POST /api/admin/categories
adminCategoriesRouter.post("/", requireContentManagers, (req: Request, res: Response) => {
  const result = CategorySchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", details: result.error.flatten() } });
    return;
  }

  const data = result.data;
  if (db.categories.some((c) => c.slug === data.slug)) {
    res.status(409).json({ success: false, error: { code: "SLUG_EXISTS", message: "Slug already exists." } });
    return;
  }

  const newCat: Category = {
    id: `cat-${Date.now()}`,
    ...data,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  db.categories.push(newCat);
  db.log(req.user?.fullName || "Admin", "CATEGORY_CREATE", "Category", newCat.id, `Created category ${newCat.name}`);

  res.status(201).json({ success: true, data: newCat });
});

// PUT /api/admin/categories/:id
adminCategoriesRouter.put("/:id", requireContentManagers, (req: Request, res: Response) => {
  const { id } = req.params;
  const index = db.categories.findIndex((c) => c.id === id || c.slug === id);

  if (index === -1) {
    res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Category not found." } });
    return;
  }

  const result = CategorySchema.partial().safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", details: result.error.flatten() } });
    return;
  }

  const updated: Category = {
    ...db.categories[index],
    ...result.data,
    updated_at: new Date().toISOString(),
  };

  db.categories[index] = updated;
  db.log(req.user?.fullName || "Admin", "CATEGORY_UPDATE", "Category", updated.id, `Updated category ${updated.name}`);

  res.json({ success: true, data: updated });
});

// DELETE /api/admin/categories/:id
adminCategoriesRouter.delete("/:id", requireContentManagers, (req: Request, res: Response) => {
  const { id } = req.params;
  const index = db.categories.findIndex((c) => c.id === id);

  if (index === -1) {
    res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Category not found." } });
    return;
  }

  const deleted = db.categories.splice(index, 1)[0];
  db.log(req.user?.fullName || "Admin", "CATEGORY_DELETE", "Category", deleted.id, `Deleted category ${deleted.name}`);

  res.json({ success: true, message: `Category ${deleted.name} deleted successfully.` });
});
