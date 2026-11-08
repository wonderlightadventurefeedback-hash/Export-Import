import { Router, Request, Response } from "express";
import { authMiddleware } from "../../middleware/auth.js";
import { adminAuthRouter } from "./auth.js";
import { adminProductsRouter } from "./products.js";
import { adminCategoriesRouter } from "./categories.js";
import { adminEnquiriesRouter } from "./enquiries.js";
import { adminQuotationsRouter } from "./quotations.js";
import { adminSuppliersRouter } from "./suppliers.js";
import { adminContentRouter } from "./content.js";
import { adminSettingsRouter } from "./settings.js";
import { adminMediaRouter } from "./media.js";
import { adminUsersRouter } from "./users.js";
import { adminAuditRouter } from "./audit.js";
import { adminSeoRouter } from "./seo.js";
import { adminNavigationRouter } from "./navigation.js";
import { adminThemeRouter } from "./theme.js";
import { adminBuyersRouter } from "./buyers.js";
import { adminTemplatesRouter } from "./templates.js";
import { db } from "../../services/supabase.js";

export const adminRouter = Router();

// 1. Unauthenticated or internally authenticated Auth Router
adminRouter.use("/auth", adminAuthRouter);

// 2. Health / status check
adminRouter.get("/status", (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      adminSystem: "Indian Spice Export Control Room",
      status: "Operational",
      dbMode: "Active",
      totalProducts: db.products.length,
      totalEnquiries: db.enquiries.length,
    },
  });
});

// 3. Consolidated Dashboard Stats (Protected)
adminRouter.get("/dashboard", authMiddleware, (req: Request, res: Response) => {
  const enquiriesByStatus = [
    { status: "New", count: db.enquiries.filter((e) => e.status === "New").length, fill: "#dfb15b" },
    { status: "Reviewing", count: db.enquiries.filter((e) => e.status === "Reviewing").length, fill: "#3b82f6" },
    { status: "Quoted", count: db.enquiries.filter((e) => e.status === "Quoted").length, fill: "#8b5cf6" },
    { status: "Negotiating", count: db.enquiries.filter((e) => e.status === "Negotiating").length, fill: "#f97316" },
    { status: "Accepted", count: db.enquiries.filter((e) => e.status === "Accepted").length, fill: "#10b981" },
    { status: "Closed", count: db.enquiries.filter((e) => e.status === "Closed").length, fill: "#6b7280" },
  ];

  const recentQuotations = db.quotations.slice(0, 5);
  const recentEnquiries = db.enquiries.slice(0, 5);

  res.json({
    success: true,
    data: {
      stats: {
        newEnquiriesCount: db.enquiries.filter((e) => e.status === "New").length,
        totalEnquiries: db.enquiries.length,
        totalQuotations: db.quotations.length,
        totalProducts: db.products.length,
        totalSuppliers: db.suppliers.length,
        totalBuyers: db.buyers.length,
      },
      enquiriesByStatus,
      recentQuotations,
      recentEnquiries,
      recentAuditLogs: db.auditLogs.slice(0, 5),
    },
  });
});

// 4. Admin Protected Endpoints
adminRouter.use("/products", authMiddleware, adminProductsRouter);
adminRouter.use("/categories", authMiddleware, adminCategoriesRouter);
adminRouter.use("/enquiries", authMiddleware, adminEnquiriesRouter);
adminRouter.use("/quotations", authMiddleware, adminQuotationsRouter);
adminRouter.use("/suppliers", authMiddleware, adminSuppliersRouter);
adminRouter.use("/content", authMiddleware, adminContentRouter);
adminRouter.use("/settings", authMiddleware, adminSettingsRouter);
adminRouter.use("/media", authMiddleware, adminMediaRouter);
adminRouter.use("/users", authMiddleware, adminUsersRouter);
adminRouter.use("/audit", authMiddleware, adminAuditRouter);
adminRouter.use("/seo", authMiddleware, adminSeoRouter);
adminRouter.use("/navigation", authMiddleware, adminNavigationRouter);
adminRouter.use("/theme", authMiddleware, adminThemeRouter);
adminRouter.use("/buyers", authMiddleware, adminBuyersRouter);
adminRouter.use("/templates", authMiddleware, adminTemplatesRouter);
