import { Router, Request, Response } from "express";
import { z } from "zod";
import { db, Enquiry } from "../../services/supabase.js";
import { whatsappService } from "../../services/whatsapp.js";
import { requireStaff } from "../../middleware/roles.js";

export const adminEnquiriesRouter = Router();

// GET /api/admin/enquiries - Filtered & paginated list
adminEnquiriesRouter.get("/", (req: Request, res: Response) => {
  const { status, country, buyerType, search, page = "1", pageSize = "20" } = req.query;

  let items = [...db.enquiries];

  if (status && typeof status === "string" && status !== "all") {
    items = items.filter((e) => e.status.toLowerCase() === status.toLowerCase());
  }

  if (country && typeof country === "string" && country !== "all") {
    items = items.filter((e) => e.country.toLowerCase().includes(country.toLowerCase()));
  }

  if (buyerType && typeof buyerType === "string" && buyerType !== "all") {
    items = items.filter((e) => e.buyer_type.toLowerCase() === buyerType.toLowerCase());
  }

  if (search && typeof search === "string") {
    const q = search.toLowerCase();
    items = items.filter(
      (e) =>
        e.reference_no.toLowerCase().includes(q) ||
        e.company_name.toLowerCase().includes(q) ||
        e.representative_name.toLowerCase().includes(q) ||
        e.business_email.toLowerCase().includes(q) ||
        e.destination_port.toLowerCase().includes(q)
    );
  }

  // Sort latest first
  items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

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
        statusCounts: {
          all: db.enquiries.length,
          new: db.enquiries.filter((e) => e.status === "New").length,
          reviewing: db.enquiries.filter((e) => e.status === "Reviewing").length,
          quoted: db.enquiries.filter((e) => e.status === "Quoted").length,
          negotiating: db.enquiries.filter((e) => e.status === "Negotiating").length,
          accepted: db.enquiries.filter((e) => e.status === "Accepted").length,
          closed: db.enquiries.filter((e) => e.status === "Closed").length,
        },
      },
    },
  });
});

// GET /api/admin/enquiries/export/csv
adminEnquiriesRouter.get("/export/csv", (req: Request, res: Response) => {
  const headers = ["Reference No", "Date", "Company", "Contact Person", "Email", "Country", "Port", "Incoterm", "Status", "Items"];
  const rows = db.enquiries.map((e) => [
    `"${e.reference_no}"`,
    `"${e.created_at}"`,
    `"${e.company_name.replace(/"/g, '""')}"`,
    `"${e.representative_name.replace(/"/g, '""')}"`,
    `"${e.business_email}"`,
    `"${e.country}"`,
    `"${e.destination_port}"`,
    `"${e.target_incoterm}"`,
    `"${e.status}"`,
    `"${e.items.map((it) => `${it.product_name} (${it.quantity} ${it.unit})`).join("; ").replace(/"/g, '""')}"`,
  ]);

  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", 'attachment; filename="indian-spice-export-enquiries.csv"');
  res.send(csv);
});

// GET /api/admin/enquiries/:id
adminEnquiriesRouter.get("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const enquiry = db.enquiries.find((e) => e.id === id || e.reference_no === id);

  if (!enquiry) {
    res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Inquiry not found." } });
    return;
  }

  // Pre-generate WhatsApp direct link if phone exists
  let whatsappLink = "";
  if (enquiry.phone_whatsapp) {
    whatsappLink = whatsappService.buildEnquiryFollowup(enquiry.phone_whatsapp, {
      referenceNo: enquiry.reference_no,
      buyerName: enquiry.representative_name,
      companyName: enquiry.company_name,
    });
  }

  res.json({
    success: true,
    data: {
      ...enquiry,
      whatsappLink,
    },
  });
});

// PATCH /api/admin/enquiries/:id/status
adminEnquiriesRouter.patch("/:id/status", requireStaff, (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ["New", "Reviewing", "Quoted", "Negotiating", "Accepted", "Rejected", "Closed"];
  if (!validStatuses.includes(status)) {
    res.status(400).json({
      success: false,
      error: { code: "INVALID_STATUS", message: `Status must be one of: ${validStatuses.join(", ")}` },
    });
    return;
  }

  const enquiry = db.enquiries.find((e) => e.id === id || e.reference_no === id);
  if (!enquiry) {
    res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Inquiry not found." } });
    return;
  }

  const prev = enquiry.status;
  enquiry.status = status;
  enquiry.updated_at = new Date().toISOString();

  db.log(
    req.user?.fullName || "Admin",
    "ENQUIRY_STATUS_CHANGE",
    "Enquiry",
    enquiry.id,
    `Updated status from ${prev} to ${status} for ${enquiry.reference_no}`
  );

  res.json({ success: true, data: enquiry });
});

// POST /api/admin/enquiries/:id/notes
adminEnquiriesRouter.post("/:id/notes", requireStaff, (req: Request, res: Response) => {
  const { id } = req.params;
  const { text } = req.body;

  if (!text || typeof text !== "string" || text.trim().length === 0) {
    res.status(400).json({
      success: false,
      error: { code: "INVALID_NOTE", message: "Note text is required." },
    });
    return;
  }

  const enquiry = db.enquiries.find((e) => e.id === id || e.reference_no === id);
  if (!enquiry) {
    res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Inquiry not found." } });
    return;
  }

  if (!enquiry.internal_notes) enquiry.internal_notes = [];
  const note = {
    id: `note-${Date.now()}`,
    author: req.user?.fullName || "Admin User",
    text: text.trim(),
    date: new Date().toISOString(),
  };

  enquiry.internal_notes.unshift(note);
  enquiry.updated_at = new Date().toISOString();

  db.log(req.user?.fullName || "Admin", "ENQUIRY_NOTE_ADDED", "Enquiry", enquiry.id, `Added internal note to ${enquiry.reference_no}`);

  res.status(201).json({ success: true, data: note });
});

// PATCH /api/admin/enquiries/:id/assign
adminEnquiriesRouter.patch("/:id/assign", requireStaff, (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId } = req.body;

  const enquiry = db.enquiries.find((e) => e.id === id || e.reference_no === id);
  if (!enquiry) {
    res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Inquiry not found." } });
    return;
  }

  const user = db.adminUsers.find((u) => u.id === userId);
  if (!user) {
    res.status(400).json({ success: false, error: { code: "USER_NOT_FOUND", message: "Admin user not found." } });
    return;
  }

  enquiry.assigned_to = user.id;
  enquiry.assigned_to_name = user.full_name;
  enquiry.updated_at = new Date().toISOString();

  db.log(req.user?.fullName || "Admin", "ENQUIRY_ASSIGNED", "Enquiry", enquiry.id, `Assigned ${enquiry.reference_no} to ${user.full_name}`);

  res.json({ success: true, data: enquiry });
});
