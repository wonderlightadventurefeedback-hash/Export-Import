import { Router, Request, Response } from "express";
import { db } from "../../services/supabase.js";
import { requireContentManagers } from "../../middleware/roles.js";

export const adminThemeRouter = Router();

const DEFAULT_THEME = {
  brandForest: "#0d2b1d",
  brandGold: "#dfb15b",
  brandCream: "#fdfbf7",
  fontHeading: "Cinzel, serif",
  fontBody: "Outfit, sans-serif",
  borderRadius: "rounded-md",
  animationPreset: "Standard",
  logoUrl: "/logo.svg",
  faviconUrl: "/favicon.ico",
};

// GET /api/admin/theme
adminThemeRouter.get("/", (req: Request, res: Response) => {
  res.json({ success: true, data: db.theme });
});

// PUT /api/admin/theme
adminThemeRouter.put("/", requireContentManagers, (req: Request, res: Response) => {
  const payload = req.body;

  db.theme = {
    ...db.theme,
    ...payload,
  };

  db.log(req.user?.fullName || "Admin", "THEME_UPDATE", "Theme", undefined, "Updated brand theme tokens");

  res.json({ success: true, data: db.theme });
});

// POST /api/admin/theme/reset
adminThemeRouter.post("/reset", requireContentManagers, (req: Request, res: Response) => {
  db.theme = { ...DEFAULT_THEME };
  db.log(req.user?.fullName || "Admin", "THEME_RESET", "Theme", undefined, "Reset theme tokens to factory defaults");
  res.json({ success: true, data: db.theme });
});
