import { Router, Request, Response } from "express";
import { z } from "zod";
import { db, Product } from "../../services/supabase.js";
import { requireContentManagers } from "../../middleware/roles.js";

export const adminProductsRouter = Router();

const ProductInputSchema = z.object({
  name: z.string().min(2, "Product name is required"),
  slug: z.string().min(2, "Slug is required"),
  category_id: z.string().optional(),
  category_slug: z.string().optional(),
  category_name: z.string().optional(),
  scientific_name: z.string().optional(),
  headline: z.string().optional(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  detailed_description: z.string().optional(),
  available_forms: z.array(z.string()).default(["whole"]),
  origin_state: z.string().default("Odisha"),
  sourcing_belt: z.string().optional(),
  harvest_season: z.string().optional(),
  specifications: z.record(z.string()).default({}),
  grades: z.array(z.string()).default([]),
  min_order_quantity: z.string().default("1 Metric Tonne"),
  is_featured: z.boolean().default(false),
  status: z.enum(["draft", "published", "archived"]).default("published"),
  images: z
    .array(
      z.object({
        url: z.string(),
        alt_text: z.string(),
        is_primary: z.boolean().default(false),
      })
    )
    .default([]),
  packaging: z
    .array(
      z.object({
        package_type: z.string(),
        standard_sizes: z.array(z.string()),
      })
    )
    .default([]),
});

// GET /api/admin/products - List with filters & pagination
adminProductsRouter.get("/", (req: Request, res: Response) => {
  const { category, status, search, page = "1", pageSize = "20" } = req.query;

  let items = [...db.products];

  if (category && typeof category === "string" && category !== "all") {
    items = items.filter((p) => p.category_slug === category || p.category_id === category);
  }

  if (status && typeof status === "string" && status !== "all") {
    items = items.filter((p) => p.status === status);
  }

  if (search && typeof search === "string") {
    const q = search.toLowerCase();
    items = items.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        (p.category_name && p.category_name.toLowerCase().includes(q)) ||
        (p.sourcing_belt && p.sourcing_belt.toLowerCase().includes(q))
    );
  }

  const p = parseInt(page as string, 10) || 1;
  const ps = parseInt(pageSize as string, 10) || 20;
  const total = items.length;
  const paginated = items.slice((p - 1) * ps, p * ps);

  res.json({
    success: true,
    data: {
      items: paginated,
      meta: {
        total,
        page: p,
        pageSize: ps,
        totalPages: Math.ceil(total / ps),
      },
    },
  });
});

// GET /api/admin/products/export/csv
adminProductsRouter.get("/export/csv", (req: Request, res: Response) => {
  const headers = ["ID", "Name", "Slug", "Category", "Origin State", "Status", "Min Order Qty", "Grades"];
  const rows = db.products.map((p) => [
    `"${p.id}"`,
    `"${p.name.replace(/"/g, '""')}"`,
    `"${p.slug}"`,
    `"${p.category_name || ""}"`,
    `"${p.origin_state}"`,
    `"${p.status}"`,
    `"${p.min_order_quantity}"`,
    `"${(p.grades || []).join("; ")}"`,
  ]);

  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", 'attachment; filename="indian-spice-export-products.csv"');
  res.send(csv);
});

// GET /api/admin/products/:id
adminProductsRouter.get("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const product = db.products.find((p) => p.id === id || p.slug === id);

  if (!product) {
    res.status(404).json({
      success: false,
      error: { code: "NOT_FOUND", message: `Product ${id} not found.` },
    });
    return;
  }

  res.json({ success: true, data: product });
});

// POST /api/admin/products - Create new product
adminProductsRouter.post("/", requireContentManagers, (req: Request, res: Response) => {
  const parseResult = ProductInputSchema.safeParse(req.body);

  if (!parseResult.success) {
    res.status(400).json({
      success: false,
      error: { code: "VALIDATION_ERROR", details: parseResult.error.flatten() },
    });
    return;
  }

  const data = parseResult.data;

  // Slug uniqueness check
  if (db.products.some((p) => p.slug === data.slug)) {
    res.status(409).json({
      success: false,
      error: { code: "SLUG_EXISTS", message: `A product with slug '${data.slug}' already exists.` },
    });
    return;
  }

  const category = db.categories.find((c) => c.id === data.category_id || c.slug === data.category_slug);

  const newProduct: Product = {
    id: `prod-${Date.now()}`,
    ...data,
    category_id: category?.id || data.category_id,
    category_slug: category?.slug || data.category_slug,
    category_name: category?.name || data.category_name,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  db.products.unshift(newProduct);
  db.log(req.user?.fullName || "Admin", "PRODUCT_CREATE", "Product", newProduct.id, `Created spice commodity ${newProduct.name}`, null, newProduct);

  res.status(201).json({ success: true, data: newProduct });
});

// PUT /api/admin/products/:id - Update product
adminProductsRouter.put("/:id", requireContentManagers, (req: Request, res: Response) => {
  const { id } = req.params;
  const index = db.products.findIndex((p) => p.id === id || p.slug === id);

  if (index === -1) {
    res.status(404).json({
      success: false,
      error: { code: "NOT_FOUND", message: `Product ${id} not found.` },
    });
    return;
  }

  const parseResult = ProductInputSchema.partial().safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({
      success: false,
      error: { code: "VALIDATION_ERROR", details: parseResult.error.flatten() },
    });
    return;
  }

  const before = { ...db.products[index] };
  const updated: Product = {
    ...before,
    ...parseResult.data,
    updated_at: new Date().toISOString(),
  };

  db.products[index] = updated;
  db.log(req.user?.fullName || "Admin", "PRODUCT_UPDATE", "Product", updated.id, `Updated spice commodity ${updated.name}`, before, updated);

  res.json({ success: true, data: updated });
});

// DELETE /api/admin/products/:id - Delete product
adminProductsRouter.delete("/:id", requireContentManagers, (req: Request, res: Response) => {
  const { id } = req.params;
  const index = db.products.findIndex((p) => p.id === id);

  if (index === -1) {
    res.status(404).json({
      success: false,
      error: { code: "NOT_FOUND", message: `Product ${id} not found.` },
    });
    return;
  }

  const deleted = db.products.splice(index, 1)[0];
  db.log(req.user?.fullName || "Admin", "PRODUCT_DELETE", "Product", deleted.id, `Deleted commodity ${deleted.name}`, deleted, null);

  res.json({ success: true, message: `Product ${deleted.name} successfully deleted.` });
});

// POST /api/admin/products/bulk - Bulk actions
adminProductsRouter.post("/bulk", requireContentManagers, (req: Request, res: Response) => {
  const { action, ids } = req.body;

  if (!action || !Array.isArray(ids) || ids.length === 0) {
    res.status(400).json({
      success: false,
      error: { code: "INVALID_REQUEST", message: "Action and list of product IDs are required." },
    });
    return;
  }

  if (action === "publish") {
    db.products.forEach((p) => {
      if (ids.includes(p.id)) p.status = "published";
    });
  } else if (action === "unpublish") {
    db.products.forEach((p) => {
      if (ids.includes(p.id)) p.status = "draft";
    });
  } else if (action === "delete") {
    db.products = db.products.filter((p) => !ids.includes(p.id));
  }

  db.log(req.user?.fullName || "Admin", `PRODUCT_BULK_${action.toUpperCase()}`, "Product", undefined, `Bulk ${action} on ${ids.length} products`);

  res.json({ success: true, message: `Successfully performed ${action} on ${ids.length} products.` });
});
