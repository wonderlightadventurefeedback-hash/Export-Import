import { Router, Request, Response } from "express";
import { db } from "../../services/supabase.js";
import { requireOwner } from "../../middleware/roles.js";

export const adminSettingsRouter = Router();

// GET /api/admin/settings
adminSettingsRouter.get("/", (req: Request, res: Response) => {
  res.json({ success: true, data: db.settings });
});

// PUT /api/admin/settings/:section
adminSettingsRouter.put("/:section", requireOwner, (req: Request, res: Response) => {
  const section = String(req.params.section);
  const payload = req.body;

  if (!payload || typeof payload !== "object") {
    res.status(400).json({ success: false, error: { code: "INVALID_PAYLOAD", message: "Payload must be a JSON object." } });
    return;
  }

  const before = db.settings[section] ? { ...db.settings[section] } : {};
  db.settings[section] = {
    ...before,
    ...payload,
  };

  db.log(req.user?.fullName || "Admin", "SETTINGS_UPDATE", "CompanySettings", section, `Updated company settings section '${section}'`, before, db.settings[section]);

  res.json({ success: true, data: db.settings[section] });
});
