import React, { useState, useEffect } from "react";
import { Users, UserPlus, Shield, CheckCircle, XCircle, KeyRound, AlertTriangle, X } from "lucide-react";
import { adminApi, AdminUser } from "../../services/adminApi";
import { useAdminAuth } from "../../context/AdminAuthContext";

export const AdminUsersRoles: React.FC = () => {
  const { isOwner, user: currentUser } = useAdminAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteData, setInviteData] = useState({
    full_name: "",
    email: "",
    role: "Sales",
  });
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await adminApi.getUsers();
      setUsers(data || []);
    } catch (err: any) {
      console.error("Failed to load admin users:", err);
      showNotification("error", "Failed to load admin users");
    } finally {
      setIsLoading(false);
    }
  };

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminApi.inviteUser(inviteData);
      showNotification("success", `Invitation sent to ${inviteData.email}`);
      setIsInviteModalOpen(false);
      setInviteData({ full_name: "", email: "", role: "Sales" });
      fetchUsers();
    } catch (err: any) {
      showNotification("error", err.message || "Failed to invite user");
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await adminApi.updateUserRole(userId, newRole);
      showNotification("success", "User role updated successfully");
      fetchUsers();
    } catch (err: any) {
      showNotification("error", err.message || "Failed to update role");
    }
  };

  const handleToggleStatus = async (userId: string) => {
    try {
      await adminApi.toggleUserStatus(userId);
      showNotification("success", "User access status toggled");
      fetchUsers();
    } catch (err: any) {
      showNotification("error", err.message || "Failed to toggle user status");
    }
  };

  const handlePasswordReset = async (userId: string) => {
    try {
      await adminApi.forcePasswordReset(userId);
      showNotification("success", "Password reset instructions dispatched to user email");
    } catch (err: any) {
      showNotification("error", err.message || "Failed to initiate password reset");
    }
  };

  if (!isOwner) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-8 text-center max-w-lg mx-auto mt-12">
        <AlertTriangle className="w-10 h-10 text-amber-600 mx-auto mb-3" />
        <h2 className="font-serif text-lg font-bold text-amber-900 mb-1">Restricted Access</h2>
        <p className="text-sm text-amber-700">
          User & Role Administration is restricted strictly to the primary Executive Owner account.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-charcoal-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-forest-700" />
            Admin Staff & Access Control
          </h1>
          <p className="font-sans text-sm text-charcoal-500">
            Control room authorization, role privileges (Owner, Editor, Sales, Viewer), and credentials.
          </p>
        </div>

        <button
          onClick={() => setIsInviteModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-forest-800 text-gold-300 font-sans font-semibold text-sm rounded-lg hover:bg-forest-900 transition-colors shadow-sm"
        >
          <UserPlus className="w-4 h-4" />
          <span>Invite Team Member</span>
        </button>
      </div>

      {notification && (
        <div
          className={`px-4 py-3 rounded-lg text-sm font-sans flex items-center gap-2 ${
            notification.type === "success"
              ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
              : "bg-rose-50 border border-rose-200 text-rose-800"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-ivory-300 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-charcoal-400">Loading users...</div>
        ) : (
          <table className="w-full text-left text-sm font-sans">
            <thead className="bg-ivory-100/70 border-b border-ivory-200 text-charcoal-600 text-xs uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-6 py-3.5">User</th>
                <th className="px-6 py-3.5">Role</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Last Login</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ivory-200">
              {users.map((u) => {
                const isSelf = u.id === currentUser?.id;
                return (
                  <tr key={u.id} className="hover:bg-ivory-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-charcoal-900">{u.fullName}</div>
                      <div className="text-xs text-charcoal-500 font-mono">{u.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={u.role}
                        disabled={isSelf}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="px-2.5 py-1 text-xs font-semibold rounded bg-ivory-100 border border-ivory-300 text-charcoal-800 focus:outline-none focus:ring-1 focus:ring-forest-600 disabled:opacity-60"
                      >
                        <option value="Owner">Owner</option>
                        <option value="Editor">Editor</option>
                        <option value="Sales">Sales</option>
                        <option value="Viewer">Viewer</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          u.isActive
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : "bg-rose-50 text-rose-800 border border-rose-200"
                        }`}
                      >
                        {u.isActive ? (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                            Active
                          </>
                        ) : (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                            Deactivated
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-charcoal-500 font-mono">
                      {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : "Never"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {!isSelf && (
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => handlePasswordReset(u.id)}
                            title="Force Password Reset"
                            className="p-1.5 text-charcoal-400 hover:text-charcoal-700 hover:bg-ivory-100 rounded transition-colors"
                          >
                            <KeyRound className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(u.id)}
                            title={u.isActive ? "Deactivate User" : "Activate User"}
                            className={`p-1.5 rounded transition-colors ${
                              u.isActive
                                ? "text-rose-500 hover:bg-rose-50"
                                : "text-emerald-600 hover:bg-emerald-50"
                            }`}
                          >
                            {u.isActive ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                          </button>
                        </div>
                      )}
                      {isSelf && <span className="text-xs text-charcoal-400 italic">Current Session</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Invite Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 bg-charcoal-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-ivory-300 overflow-hidden">
            <div className="px-6 py-4 border-b border-ivory-200 flex items-center justify-between bg-ivory-50">
              <h3 className="font-serif text-lg font-bold text-charcoal-900 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-forest-700" />
                Invite Team Member
              </h3>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="text-charcoal-400 hover:text-charcoal-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInvite} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={inviteData.full_name}
                  onChange={(e) => setInviteData({ ...inviteData, full_name: e.target.value })}
                  placeholder="Rahul Sharma"
                  className="w-full px-3.5 py-2.5 bg-ivory-50 border border-ivory-300 rounded-lg text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1">
                  Corporate Email
                </label>
                <input
                  type="email"
                  required
                  value={inviteData.email}
                  onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
                  placeholder="rahul@indianspiceexport.com"
                  className="w-full px-3.5 py-2.5 bg-ivory-50 border border-ivory-300 rounded-lg text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1">
                  Access Role
                </label>
                <select
                  value={inviteData.role}
                  onChange={(e) => setInviteData({ ...inviteData, role: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-ivory-50 border border-ivory-300 rounded-lg text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
                >
                  <option value="Sales">Sales (Inquiries & Quotations desk)</option>
                  <option value="Editor">Editor (Product catalog & site builder)</option>
                  <option value="Viewer">Viewer (Read-only observation)</option>
                  <option value="Owner">Owner (Executive admin)</option>
                </select>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-ivory-200">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-4 py-2 border border-ivory-300 text-charcoal-700 rounded-lg text-sm font-medium hover:bg-ivory-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-forest-800 text-gold-300 rounded-lg text-sm font-semibold hover:bg-forest-900"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminUsersRoles;