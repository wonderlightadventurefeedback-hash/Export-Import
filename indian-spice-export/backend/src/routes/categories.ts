import { Router, Request, Response } from "express";
import { db } from "../services/supabase.js";

export const categoriesRouter = Router();

// GET /api/categories - Public listing of published categories
categoriesRouter.get("/", (req: Request, res: Response) => {
  const published = db.categories
    .filter((c) => c.is_published)
    .sort((a, b) => a.featured_order - b.featured_order);

  res.json({
    success: true,
    data: published,
  });
});
