import { Router, Request, Response } from "express";
import { z } from "zod";
import { submissionLimiter } from "../middleware/rateLimiter.js";
import { db, Enquiry } from "../services/supabase.js";
import { emailService } from "../services/email.js";

export const enquiriesRouter = Router();

// In-memory idempotency cache to prevent accidental double-clicks / duplicate submissions
const processedKeys = new Set<string>();

// Zod Validation Schema for Quote Inquiry
const EnquiryItemSchema = z.object({
  id: z.string().optional(),
  productName: z.string().min(1, "Product name is required"),
  productId: z.string().optional(),
  quantity: z.union([z.string(), z.number()]),
  unit: z.string().default("MT (Metric Tonnes)"),
  form: z.string().default("Whole"),
  preferredGrade: z.string().optional(),
  packagingPreference: z.string().optional(),
});

const EnquirySubmissionSchema = z.object({
  fullName: z.string().min(2, "Representative name must be at least 2 characters"),
  companyName: z.string().min(2, "Company name is required"),
  businessEmail: z.string().email("Valid business email is required"),
  phoneWhatsapp: z.string().optional(),
  country: z.string().min(2, "Country is required"),
  city: z.string().optional(),
  buyerType: z.string().default("Importer"),
  destinationPort: z.string().min(2, "Destination port is required"),
  targetIncoterm: z.string().default("CIF (Cost, Insurance & Freight)"),
  estimatedShipmentMonth: z.string().optional(),
  specialRequirements: z.string().optional(),
  agreeToTruthTerms: z.boolean().refine((val) => val === true, {
    message: "Must accept commercial trade terms",
  }),
  items: z.array(EnquiryItemSchema).min(1, "At least one spice commodity must be specified"),
});

// POST /api/enquiries - Public Inquiry Submission
enquiriesRouter.post("/", submissionLimiter, async (req: Request, res: Response) => {
  const idempotencyKey = req.headers["x-idempotency-key"] as string | undefined;

  // Duplicate submission guard
  if (idempotencyKey && processedKeys.has(idempotencyKey)) {
    res.status(409).json({
      success: false,
      error: {
        code: "DUPLICATE_SUBMISSION",
        message: "This inquiry has already been submitted and is currently being processed.",
      },
    });
    return;
  }

  const parseResult = EnquirySubmissionSchema.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: parseResult.error.errors.map((e) => e.message).join(", "),
      },
    });
    return;
  }

  if (idempotencyKey) {
    processedKeys.add(idempotencyKey);
  }

  const payload = parseResult.data;

  // Generate official reference: ISE-YYYY-00001
  const currentYear = new Date().getFullYear();
  const sequenceStr = String(db.enquiries.length + 1).padStart(5, "0");
  const referenceNo = `ISE-${currentYear}-${sequenceStr}`;

  const items = payload.items.map((it) => ({
    id: `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    product_name: it.productName,
    product_id: it.productId,
    quantity: it.quantity,
    unit: it.unit,
    form: it.form,
    preferred_grade: it.preferredGrade,
    packaging_preference: it.packagingPreference,
  }));

  const newEnquiry: Enquiry = {
    id: `enq-${Date.now()}`,
    reference_no: referenceNo,
    representative_name: payload.fullName,
    company_name: payload.companyName,
    business_email: payload.businessEmail,
    phone_whatsapp: payload.phoneWhatsapp,
    country: payload.country,
    city: payload.city,
    buyer_type: payload.buyerType,
    destination_port: payload.destinationPort,
    target_incoterm: payload.targetIncoterm,
    estimated_shipment_schedule: payload.estimatedShipmentMonth,
    special_requirements: payload.specialRequirements,
    status: "New",
    items,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  db.enquiries.unshift(newEnquiry);
  db.log("Website Visitor", "ENQUIRY_SUBMITTED", "Enquiry", newEnquiry.id, `Inquiry ${referenceNo} received from ${newEnquiry.company_name} (${newEnquiry.country})`);

  // Dispatches email notifications in background
  try {
    await emailService.notifyBusinessOnEnquiry({
      referenceNo,
      companyName: payload.companyName,
      representativeName: payload.fullName,
      businessEmail: payload.businessEmail,
      country: payload.country,
      destinationPort: payload.destinationPort,
      items: payload.items.map((it) => ({
        productName: it.productName,
        quantity: it.quantity,
        unit: it.unit,
      })),
    });

    await emailService.confirmToBuyerOnEnquiry({
      referenceNo,
      companyName: payload.companyName,
      representativeName: payload.fullName,
      businessEmail: payload.businessEmail,
      destinationPort: payload.destinationPort,
      items: payload.items.map((it) => ({
        productName: it.productName,
        quantity: it.quantity,
        unit: it.unit,
      })),
    });
  } catch (emailErr) {
    console.error("[Email Notification Warning]", emailErr);
  }

  res.status(201).json({
    success: true,
    data: {
      reference: referenceNo,
      referenceNo,
      status: "New",
      createdAt: newEnquiry.created_at,
      message: "Enquiry registered successfully. A commercial proforma will follow via email.",
    },
  });
});
