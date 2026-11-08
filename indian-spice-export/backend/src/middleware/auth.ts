import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { db, supabase } from "../services/supabase.js";

export const JWT_SECRET = process.env.JWT_SECRET || "spice-export-dev-secret-key-2026";

export interface AuthenticatedUser {
  id: string;
  email: string;
  fullName: string;
  role: "Owner" | "Editor" | "Sales" | "Viewer";
  isActive: boolean;
}

// Extend Express Request
declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export async function authMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message: "Authentication required. Bearer token missing.",
      },
    });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    // 1. First check if it's a dev bypass / demo token
    if (token === "dev-admin-token" || token.startsWith("mock-admin-token-")) {
      const targetUser = db.adminUsers.find((u) => u.is_active) || db.adminUsers[0];
      req.user = {
        id: targetUser.id,
        email: targetUser.email,
        fullName: targetUser.full_name,
        role: targetUser.role,
        isActive: targetUser.is_active,
      };
      next();
      return;
    }

    // 2. Check if Supabase client is active and can verify the token
    if (supabase) {
      const { data: { user: sbUser }, error: sbError } = await supabase.auth.getUser(token);
      if (!sbError && sbUser && sbUser.email) {
        const found = db.adminUsers.find((u) => u.email.toLowerCase() === sbUser.email?.toLowerCase());
        if (found && found.is_active) {
          req.user = {
            id: found.id,
            email: found.email,
            fullName: found.full_name,
            role: found.role,
            isActive: found.is_active,
          };
          next();
          return;
        }
      }
    }

    // 3. Verify internal signed JWT
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      email: string;
      role: string;
    };

    const user = db.adminUsers.find((u) => u.id === decoded.id || u.email.toLowerCase() === decoded.email.toLowerCase());

    if (!user || !user.is_active) {
      res.status(401).json({
        success: false,
        error: {
          code: "ACCOUNT_INACTIVE_OR_REVOKED",
          message: "User account is suspended, deleted, or unauthorized.",
        },
      });
      return;
    }

    req.user = {
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      role: user.role,
      isActive: user.is_active,
    };

    next();
  } catch (err: any) {
    res.status(401).json({
      success: false,
      error: {
        code: "INVALID_TOKEN",
        message: "Invalid or expired access token.",
      },
    });
  }
}
