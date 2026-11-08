import { Router, Request, Response } from "express";
import { db } from "../services/supabase.js";

export const productsRouter = Router();

// GET /api/products - Public listing of published spice commodities
productsRouter.get("/", (req: Request, res: Response) => {
  const { category, search, form, page = "1", pageSize = "10" } = req.query;

  // Only published products on public routes
  let filtered = db.products.filter((p) => p.status === "published");

  if (category && typeof category === "string" && category !== "all") {
    filtered = filtered.filter((p) => p.category_slug === category || p.category_id === category);
  }

  if (form && typeof form === "string" && form !== "all") {
    filtered = filtered.filter((p) => p.available_forms.includes(form));
  }

  if (search && typeof search === "string") {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.category_name && p.category_name.toLowerCase().includes(q)) ||
        (p.scientific_name && p.scientific_name.toLowerCase().includes(q)) ||
        (p.sourcing_belt && p.sourcing_belt.toLowerCase().includes(q))
    );
  }

  const p = parseInt(page as string, 10) || 1;
  const ps = parseInt(pageSize as string, 10) || 10;
  const total = filtered.length;
  const paginated = filtered.slice((p - 1) * ps, p * ps);

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

// GET /api/products/:slug - Public single product detail
productsRouter.get("/:slug", (req: Request, res: Response) => {
  const { slug } = req.params;
  const product = db.products.find(
    (p) => (p.slug === slug || p.id === slug) && p.status === "published"
  );

  if (!product) {
    res.status(404).json({
      success: false,
      error: {
        code: "PRODUCT_NOT_FOUND",
        message: `Spice commodity '${slug}' is not currently available or published.`,
      },
    });
    return;
  }

  res.json({
    success: true,
    data: product,
  });
});
