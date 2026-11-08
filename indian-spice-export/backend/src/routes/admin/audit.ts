import { Router, Request, Response } from "express";
import { db } from "../../services/supabase.js";
import { requireOwner } from "../../middleware/roles.js";

export const adminAuditRouter = Router();

// GET /api/admin/audit - List audit logs (Owner only)
adminAuditRouter.get("/", requireOwner, (req: Request, res: Response) => {
  const { actor, entityType, action, search, limit = "50" } = req.query;

  let items = [...db.auditLogs];

  if (actor && typeof actor === "string") {
    items = items.filter((log) => log.actor_name.toLowerCase().includes(actor.toLowerCase()));
  }

  if (entityType && typeof entityType === "string" && entityType !== "all") {
    items = items.filter((log) => log.entity_type.toLowerCase() === entityType.toLowerCase());
  }

  if (action && typeof action === "string") {
    items = items.filter((log) => log.action.toLowerCase().includes(action.toLowerCase()));
  }

  if (search && typeof search === "string") {
    const q = search.toLowerCase();
    items = items.filter(
      (log) =>
        log.action.toLowerCase().includes(q) ||
        log.actor_name.toLowerCase().includes(q) ||
        (log.details && log.details.toLowerCase().includes(q))
    );
  }

  const max = parseInt(limit as string, 10) || 50;

  res.json({
    success: true,
    data: items.slice(0, max),
  });
});

// GET /api/admin/audit/export/csv - Export audit logs (Owner only)
adminAuditRouter.get("/export/csv", requireOwner, (req: Request, res: Response) => {
  const headers = ["Timestamp", "Actor", "Action", "Entity Type", "Entity ID", "Details"];
  const rows = db.auditLogs.map((l) => [
    `"${l.created_at}"`,
    `"${l.actor_name}"`,
    `"${l.action}"`,
    `"${l.entity_type}"`,
    `"${l.entity_id || ""}"`,
    `"${(l.details || "").replace(/"/g, '""')}"`,
  ]);

  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", 'attachment; filename="indian-spice-export-audit-log.csv"');
  res.send(csv);
});
