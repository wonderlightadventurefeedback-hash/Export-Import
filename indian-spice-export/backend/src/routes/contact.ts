import { Router, Request, Response } from "express";
import { z } from "zod";
import { submissionLimiter } from "../middleware/rateLimiter.js";

export const contactRouter = Router();

const ContactSubmissionSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  companyName: z.string().min(2, "Company name is required"),
  email: z.string().email("Valid business email is required"),
  phoneWhatsapp: z.string().optional(),
  country: z.string().min(2, "Country is required"),
  inquiryType: z.string().default("Export Quotation"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

// POST /api/contact
contactRouter.post("/", submissionLimiter, (req: Request, res: Response) => {
  const parseResult = ContactSubmissionSchema.safeParse(req.body);
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

  console.log(`[Contact Desk] Message received from ${parseResult.data.fullName} (${parseResult.data.companyName})`);

  res.status(200).json({
    success: true,
    data: {
      received: true,
      timestamp: new Date().toISOString(),
      message: "Message acknowledged. Our export desk will reply within 24 hours.",
    },
  });
});
