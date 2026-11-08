import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { db } from "../../services/supabase.js";
import { JWT_SECRET, authMiddleware } from "../../middleware/auth.js";

export const adminAuthRouter = Router();

const LoginSchema = z.object({
  email: z.string().email("A valid email address is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// POST /api/admin/auth/login
adminAuthRouter.post("/login", (req: Request, res: Response) => {
  const result = LoginSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: result.error.errors[0]?.message || "Invalid credentials format",
      },
    });
    return;
  }

  const { email } = result.data;
  const user = db.adminUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());

  // Demo / development login acceptance: any existing active user or default owner
  if (!user || !user.is_active) {
    res.status(401).json({
      success: false,
      error: {
        code: "INVALID_CREDENTIALS",
        message: "No active admin user registered with this email address.",
      },
    });
    return;
  }

  user.last_login_at = new Date().toISOString();
  db.log(user.full_name, "USER_LOGIN", "AdminUser", user.id, `User logged in from ${req.ip || "unknown IP"}`);

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "8h" }
  );

  res.json({
    success: true,
    data: {
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
        isActive: user.is_active,
        lastLoginAt: user.last_login_at,
      },
    },
  });
});

// GET /api/admin/auth/me
adminAuthRouter.get("/me", authMiddleware, (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      user: req.user,
    },
  });
});

// POST /api/admin/auth/logout
adminAuthRouter.post("/logout", authMiddleware, (req: Request, res: Response) => {
  if (req.user) {
    db.log(req.user.fullName, "USER_LOGOUT", "AdminUser", req.user.id);
  }
  res.json({
    success: true,
    message: "Logged out successfully.",
  });
});
