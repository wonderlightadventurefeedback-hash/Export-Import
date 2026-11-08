import { Router, Request, Response } from "express";
import multer from "multer";
import { db } from "../../services/supabase.js";
import { requireContentManagers } from "../../middleware/roles.js";

export const adminMediaRouter = Router();

// Multer in-memory storage for handling media uploads
const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/") || file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only images and PDF documents are supported"));
    }
  },
});

// GET /api/admin/media
adminMediaRouter.get("/", (req: Request, res: Response) => {
  const { tag, search } = req.query;
  let items = [...db.media];

  if (tag && typeof tag === "string" && tag !== "all") {
    items = items.filter((m) => m.tags && m.tags.includes(tag.toLowerCase()));
  }

  if (search && typeof search === "string") {
    const q = search.toLowerCase();
    items = items.filter(
      (m) => m.filename.toLowerCase().includes(q) || m.alt.toLowerCase().includes(q)
    );
  }

  res.json({ success: true, data: items });
});

// POST /api/admin/media/upload
adminMediaRouter.post("/upload", requireContentManagers, upload.single("file"), (req: Request, res: Response) => {
  const file = req.file;
  const { alt = "", tags = "" } = req.body;

  let url = "";
  let filename = file ? file.originalname : "uploaded-asset.jpg";
  let size = file ? file.size : 124000;
  let mime = file ? file.mimetype : "image/jpeg";

  // If a raw image URL is provided instead of direct binary file
  if (req.body.url) {
    url = req.body.url;
    filename = req.body.filename || "external-media.jpg";
  } else if (file) {
    // In dev/memory, create a data URL or simulated asset path
    const b64 = file.buffer.toString("base64");
    url = `data:${file.mimetype};base64,${b64}`;
  } else {
    res.status(400).json({ success: false, error: { code: "NO_FILE", message: "No file or URL provided." } });
    return;
  }

  const tagList = typeof tags === "string" ? tags.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean) : [];

  const mediaItem = {
    id: `med-${Date.now()}`,
    url,
    filename,
    alt: alt || filename,
    size,
    mime,
    uploadedAt: new Date().toISOString(),
    tags: tagList,
  };

  db.media.unshift(mediaItem);
  db.log(req.user?.fullName || "Admin", "MEDIA_UPLOAD", "Media", mediaItem.id, `Uploaded ${mediaItem.filename}`);

  res.status(201).json({ success: true, data: mediaItem });
});

// PATCH /api/admin/media/:id
adminMediaRouter.patch("/:id", requireContentManagers, (req: Request, res: Response) => {
  const { id } = req.params;
  const { alt, filename, tags } = req.body;

  const item = db.media.find((m) => m.id === id);
  if (!item) {
    res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Media item not found." } });
    return;
  }

  if (alt !== undefined) item.alt = alt;
  if (filename !== undefined) item.filename = filename;
  if (Array.isArray(tags)) item.tags = tags;

  db.log(req.user?.fullName || "Admin", "MEDIA_UPDATE", "Media", item.id, `Updated metadata for ${item.filename}`);

  res.json({ success: true, data: item });
});

// DELETE /api/admin/media/:id
adminMediaRouter.delete("/:id", requireContentManagers, (req: Request, res: Response) => {
  const { id } = req.params;
  const index = db.media.findIndex((m) => m.id === id);

  if (index === -1) {
    res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Media item not found." } });
    return;
  }

  const deleted = db.media.splice(index, 1)[0];
  db.log(req.user?.fullName || "Admin", "MEDIA_DELETE", "Media", deleted.id, `Deleted ${deleted.filename}`);

  res.json({ success: true, message: `Media item ${deleted.filename} removed.` });
});
