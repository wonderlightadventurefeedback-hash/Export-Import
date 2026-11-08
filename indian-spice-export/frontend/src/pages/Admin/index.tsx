import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AdminAuthProvider, useAdminAuth } from "../../context/AdminAuthContext";
import { AdminThemeProvider } from "../../context/AdminThemeContext";
import { AdminLayout } from "../../components/admin/AdminLayout";

import { AdminLogin } from "./Login";
import { AdminDashboard } from "./Dashboard";
import { AdminProducts } from "./Products";
import { AdminCategories } from "./Categories";
import { AdminEnquiries } from "./Enquiries";
import { AdminQuotations } from "./Quotations";
import { AdminSuppliers } from "./Suppliers";
import { AdminSiteBuilder } from "./SiteBuilder";
import { AdminPagesManager } from "./PagesManager";
import { AdminMediaLibrary } from "./MediaLibrary";
import { AdminNavigationManager } from "./NavigationManager";
import { AdminThemeDesign } from "./ThemeDesign";
import { AdminCompanySettings } from "./CompanySettings";
import { AdminSEOManager } from "./SEOManager";
import { AdminLegalEditor } from "./LegalEditor";
import { AdminTemplatesManager } from "./TemplatesManager";
import { AdminUsersRoles } from "./UsersRoles";
import { AdminAuditLog } from "./AuditLog";
import { AdminBuyers } from "./Buyers";
import { AdminPreferences } from "./AdminPreferences";

const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAdminAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ivory-50 flex items-center justify-center">
        <div className="flex items-center gap-3 font-sans text-sm text-charcoal-500">
          <div className="w-5 h-5 border-2 border-forest-700 border-t-transparent rounded-full animate-spin" />
          <span>Authenticating Admin Session...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export const AdminApp: React.FC = () => {
  return (
    <AdminAuthProvider>
      <AdminThemeProvider>
        <Routes>
          <Route path="login" element={<AdminLogin />} />
          <Route
            path="*"
            element={
              <ProtectedAdminRoute>
                <AdminLayout>
                  <Routes>
                    <Route index element={<AdminDashboard />} />
                    <Route path="products" element={<AdminProducts />} />
                    <Route path="categories" element={<AdminCategories />} />
                    <Route path="enquiries" element={<AdminEnquiries />} />
                    <Route path="quotations" element={<AdminQuotations />} />
                    <Route path="suppliers" element={<AdminSuppliers />} />
                    <Route path="pages" element={<AdminPagesManager />} />
                    <Route path="site-builder" element={<AdminSiteBuilder />} />
                    <Route path="media" element={<AdminMediaLibrary />} />
                    <Route path="navigation" element={<AdminNavigationManager />} />
                    <Route path="theme" element={<AdminThemeDesign />} />
                    <Route path="settings" element={<AdminCompanySettings />} />
                    <Route path="seo" element={<AdminSEOManager />} />
                    <Route path="legal" element={<AdminLegalEditor />} />
                    <Route path="templates" element={<AdminTemplatesManager />} />
                    <Route path="users" element={<AdminUsersRoles />} />
                    <Route path="audit" element={<AdminAuditLog />} />
                    <Route path="buyers" element={<AdminBuyers />} />
                    <Route path="preferences" element={<AdminPreferences />} />
                    <Route path="*" element={<Navigate to="/admin" replace />} />
                  </Routes>
                </AdminLayout>
              </ProtectedAdminRoute>
            }
          />
        </Routes>
      </AdminThemeProvider>
    </AdminAuthProvider>
  );
};

export default AdminApp;