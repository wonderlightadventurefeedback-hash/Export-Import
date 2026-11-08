import { Router, Request, Response } from "express";
import { db } from "../services/supabase.js";

export const publicDataRouter = Router();

// GET /api/public/settings - Public company details and certifications
publicDataRouter.get("/settings", (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      general: db.settings.general,
      certifications: db.settings.certifications,
      certificates: db.settings.certificates || [],
      about: db.settings.about || {},
      social: db.settings.social,
    },
  });
});

// GET /api/public/navigation
publicDataRouter.get("/navigation", (req: Request, res: Response) => {
  res.json({
    success: true,
    data: db.navigation,
  });
});

// GET /api/public/theme
publicDataRouter.get("/theme", (req: Request, res: Response) => {
  res.json({
    success: true,
    data: db.theme,
  });
});

// GET /api/public/seo
publicDataRouter.get("/seo", (req: Request, res: Response) => {
  res.json({
    success: true,
    data: db.seo,
  });
});
