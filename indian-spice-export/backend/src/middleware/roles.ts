import { Request, Response, NextFunction } from "express";

export type AdminRole = "Owner" | "Editor" | "Sales" | "Viewer";

export function requireRole(allowedRoles: AdminRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "Authentication is required before checking authorization.",
        },
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: {
          code: "FORBIDDEN",
          message: `Access denied. Requires one of [${allowedRoles.join(", ")}] roles. Your role is '${req.user.role}'.`,
        },
      });
      return;
    }

    next();
  };
}

export const requireOwner = requireRole(["Owner"]);
export const requireContentManagers = requireRole(["Owner", "Editor"]);
export const requireSalesOrOwner = requireRole(["Owner", "Sales"]);
export const requireStaff = requireRole(["Owner", "Editor", "Sales", "Viewer"]);
