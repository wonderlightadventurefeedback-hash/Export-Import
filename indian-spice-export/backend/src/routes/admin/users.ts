import { Router, Request, Response } from "express";
import { z } from "zod";
import { db, AdminUser } from "../../services/supabase.js";
import { requireOwner } from "../../middleware/roles.js";

export const adminUsersRouter = Router();

const UserInviteSchema = z.object({
  full_name: z.string().min(2, "Full name is required"),
  email: z.string().email("Valid email is required"),
  role: z.enum(["Owner", "Editor", "Sales", "Viewer"]).default("Viewer"),
});

// GET /api/admin/users - List all admin staff (Owner only)
adminUsersRouter.get("/", requireOwner, (req: Request, res: Response) => {
  res.json({ success: true, data: db.adminUsers });
});

// POST /api/admin/users/invite - Invite new user (Owner only)
adminUsersRouter.post("/invite", requireOwner, (req: Request, res: Response) => {
  const result = UserInviteSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", details: result.error.flatten() } });
    return;
  }

  const { full_name, email, role } = result.data;
  if (db.adminUsers.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    res.status(409).json({ success: false, error: { code: "EMAIL_EXISTS", message: "User with this email already exists." } });
    return;
  }

  const newUser: AdminUser = {
    id: `usr-${Date.now()}`,
    auth_user_id: `auth-${Date.now()}`,
    full_name,
    email: email.toLowerCase(),
    role,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  db.adminUsers.push(newUser);
  db.log(req.user?.fullName || "Owner", "USER_INVITE", "AdminUser", newUser.id, `Invited ${newUser.full_name} (${newUser.email}) with role ${newUser.role}`);

  res.status(201).json({ success: true, data: newUser });
});

// PATCH /api/admin/users/:id/role - Change user role (Owner only)
adminUsersRouter.patch("/:id/role", requireOwner, (req: Request, res: Response) => {
  const { id } = req.params;
  const { role } = req.body;

  const validRoles = ["Owner", "Editor", "Sales", "Viewer"];
  if (!validRoles.includes(role)) {
    res.status(400).json({ success: false, error: { code: "INVALID_ROLE", message: `Role must be one of: ${validRoles.join(", ")}` } });
    return;
  }

  const user = db.adminUsers.find((u) => u.id === id);
  if (!user) {
    res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "User not found." } });
    return;
  }

  const prevRole = user.role;
  user.role = role;
  user.updated_at = new Date().toISOString();

  db.log(req.user?.fullName || "Owner", "USER_ROLE_CHANGE", "AdminUser", user.id, `Changed role of ${user.email} from ${prevRole} to ${role}`);

  res.json({ success: true, data: user });
});

// PATCH /api/admin/users/:id/toggle-status - Deactivate / Activate user (Owner only)
adminUsersRouter.patch("/:id/toggle-status", requireOwner, (req: Request, res: Response) => {
  const { id } = req.params;
  const user = db.adminUsers.find((u) => u.id === id);

  if (!user) {
    res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "User not found." } });
    return;
  }

  // Prevent deactivating own account
  if (user.id === req.user?.id) {
    res.status(400).json({ success: false, error: { code: "CANNOT_DEACTIVATE_SELF", message: "You cannot deactivate your own active session." } });
    return;
  }

  user.is_active = !user.is_active;
  user.updated_at = new Date().toISOString();

  db.log(req.user?.fullName || "Owner", "USER_STATUS_CHANGE", "AdminUser", user.id, `${user.is_active ? "Activated" : "Deactivated"} user ${user.email}`);

  res.json({ success: true, data: user });
});

// POST /api/admin/users/:id/reset-password - Force password reset (Owner only)
adminUsersRouter.post("/:id/reset-password", requireOwner, (req: Request, res: Response) => {
  const { id } = req.params;
  const user = db.adminUsers.find((u) => u.id === id);

  if (!user) {
    res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "User not found." } });
    return;
  }

  db.log(req.user?.fullName || "Owner", "USER_PASSWORD_RESET_TRIGGERED", "AdminUser", user.id, `Triggered password reset email for ${user.email}`);

  res.json({
    success: true,
    message: `Password reset instructions dispatched to ${user.email}.`,
  });
});
