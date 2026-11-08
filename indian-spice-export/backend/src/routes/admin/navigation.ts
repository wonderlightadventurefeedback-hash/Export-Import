import { Router, Request, Response } from "express";
import { db } from "../../services/supabase.js";
import { requireContentManagers } from "../../middleware/roles.js";

export const adminNavigationRouter = Router();

// GET /api/admin/navigation
adminNavigationRouter.get("/", (req: Request, res: Response) => {
  res.json({ success: true, data: db.navigation });
});

// PUT /api/admin/navigation
adminNavigationRouter.put("/", requireContentManagers, (req: Request, res: Response) => {
  const { headerLinks, footerLinks } = req.body;

  if (headerLinks) db.navigation.headerLinks = headerLinks;
  if (footerLinks) db.navigation.footerLinks = footerLinks;

  db.log(req.user?.fullName || "Admin", "NAVIGATION_UPDATE", "Navigation", undefined, "Updated site navigation links");

  res.json({ success: true, data: db.navigation });
});
