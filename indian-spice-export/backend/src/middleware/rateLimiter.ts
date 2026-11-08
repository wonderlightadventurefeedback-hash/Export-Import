import rateLimit from "express-rate-limit";

// General rate limiter for public API reads
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // 300 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: "TOO_MANY_REQUESTS",
      message: "Too many requests from this IP. Please try again after 15 minutes.",
    },
  },
});

// Stricter rate limiter for enquiry and contact form submissions
export const submissionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 15, // max 15 submissions per IP per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: "SUBMISSION_LIMIT_EXCEEDED",
      message: "Submission limit exceeded. Please contact our trade desk directly via email if you require urgent support.",
    },
  },
});
