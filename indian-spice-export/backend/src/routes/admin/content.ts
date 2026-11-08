import { Router, Request, Response } from "express";
import { z } from "zod";
import { db } from "../../services/supabase.js";
import { requireContentManagers } from "../../middleware/roles.js";

export const adminContentRouter = Router();

const ContentBlockSchema = z.object({
  page: z.string().min(1, "Page slug is required"),
  section: z.string().min(1, "Section key is required"),
  type: z.string().min(1, "Block type is required"),
  content: z.record(z.any()),
  status: z.enum(["draft", "published", "scheduled"]).default("published"),
});

// GET /api/admin/content - List content blocks, optionally by page
adminContentRouter.get("/", (req: Request, res: Response) => {
  const { page, status } = req.query;
  let items = [...db.contentBlocks];

  if (page && typeof page === "string" && page !== "all") {
    items = items.filter((b) => b.page.toLowerCase() === page.toLowerCase());
  }

  if (status && typeof status === "string" && status !== "all") {
    items = items.filter((b) => b.status === status);
  }

  res.json({ success: true, data: items });
});

// POST /api/admin/content - Create or update a block with new revision
adminContentRouter.post("/", requireContentManagers, (req: Request, res: Response) => {
  const result = ContentBlockSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", details: result.error.flatten() } });
    return;
  }

  const { page, section, type, content, status } = result.data;
  const existing = db.contentBlocks.find((b) => b.page === page && b.section === section);

  if (existing) {
    existing.content = content;
    existing.status = status;
    existing.type = type;
    existing.revision += 1;
    db.log(req.user?.fullName || "Admin", "CONTENT_BLOCK_UPDATE", "WebsiteContent", existing.id, `Updated block ${page} / ${section} to rev ${existing.revision}`);
    res.json({ success: true, data: existing });
  } else {
    const newBlock = {
      id: `cb-${Date.now()}`,
      page,
      section,
      type,
      content,
      status,
      revision: 1,
    };
    db.contentBlocks.push(newBlock);
    db.log(req.user?.fullName || "Admin", "CONTENT_BLOCK_CREATE", "WebsiteContent", newBlock.id, `Created content block ${page} / ${section}`);
    res.status(201).json({ success: true, data: newBlock });
  }
});

// POST /api/admin/content/:id/rollback - Rollback block revision
adminContentRouter.post("/:id/rollback", requireContentManagers, (req: Request, res: Response) => {
  const { id } = req.params;
  const block = db.contentBlocks.find((b) => b.id === id);

  if (!block) {
    res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Content block not found." } });
    return;
  }

  block.revision = Math.max(1, block.revision - 1);
  db.log(req.user?.fullName || "Admin", "CONTENT_ROLLBACK", "WebsiteContent", block.id, `Rolled back ${block.page}/${block.section} to rev ${block.revision}`);

  res.json({ success: true, data: block });
});
