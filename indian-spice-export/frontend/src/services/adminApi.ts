// Typed API client for Indian Spice Export Admin Control Room

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || "/api";

export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  role: "Owner" | "Editor" | "Sales" | "Viewer";
  isActive: boolean;
  lastLoginAt?: string;
}

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem("ise_admin_token") || "dev-admin-token";
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const message = errorData?.error?.message || `API Error: ${res.statusText}`;
    throw new Error(message);
  }
  const body = await res.json();
  return body.data !== undefined ? body.data : body;
}

export const adminApi = {
  // Auth
  async login(email: string, password: string): Promise<{ token: string; user: AdminUser }> {
    const res = await fetch(`${API_BASE}/admin/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse<{ token: string; user: AdminUser }>(res);
  },

  async getMe(): Promise<{ user: AdminUser }> {
    const res = await fetch(`${API_BASE}/admin/auth/me`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<{ user: AdminUser }>(res);
  },

  async logout(): Promise<void> {
    await fetch(`${API_BASE}/admin/auth/logout`, {
      method: "POST",
      headers: getAuthHeaders(),
    }).catch(() => {});
  },

  // Dashboard
  async getDashboard(): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/dashboard`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<any>(res);
  },

  // Products
  async getProducts(params: Record<string, string> = {}): Promise<{ items: any[]; meta: any }> {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/admin/products?${query}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<{ items: any[]; meta: any }>(res);
  },

  async getProduct(id: string): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/products/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<any>(res);
  },

  async createProduct(data: any): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/products`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<any>(res);
  },

  async updateProduct(id: string, data: any): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/products/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<any>(res);
  },

  async deleteProduct(id: string): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/products/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return handleResponse<any>(res);
  },

  async bulkProductAction(action: "publish" | "unpublish" | "delete", ids: string[]): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/products/bulk`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ action, ids }),
    });
    return handleResponse<any>(res);
  },

  // Categories
  async getCategories(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/admin/categories`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<any[]>(res);
  },

  async createCategory(data: any): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/categories`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<any>(res);
  },

  async updateCategory(id: string, data: any): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/categories/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<any>(res);
  },

  async deleteCategory(id: string): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/categories/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return handleResponse<any>(res);
  },

  // Enquiries
  async getEnquiries(params: Record<string, string> = {}): Promise<{ items: any[]; meta: any }> {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/admin/enquiries?${query}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<{ items: any[]; meta: any }>(res);
  },

  async getEnquiry(id: string): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/enquiries/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<any>(res);
  },

  async updateEnquiryStatus(id: string, status: string): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/enquiries/${id}/status`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    return handleResponse<any>(res);
  },

  async addEnquiryNote(id: string, text: string): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/enquiries/${id}/notes`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ text }),
    });
    return handleResponse<any>(res);
  },

  async assignEnquiry(id: string, userId: string): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/enquiries/${id}/assign`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify({ userId }),
    });
    return handleResponse<any>(res);
  },

  // Quotations
  async getQuotations(params: Record<string, string> = {}): Promise<any[]> {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/admin/quotations?${query}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<any[]>(res);
  },

  async getQuotation(id: string): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/quotations/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<any>(res);
  },

  async createQuotation(data: any): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/quotations`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<any>(res);
  },

  async updateQuotation(id: string, data: any): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/quotations/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<any>(res);
  },

  async getQuotationPdfData(id: string): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/quotations/${id}/pdf-data`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<any>(res);
  },

  // Suppliers (Internal Only)
  async getSuppliers(params: Record<string, string> = {}): Promise<any[]> {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/admin/suppliers?${query}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<any[]>(res);
  },

  async createSupplier(data: any): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/suppliers`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<any>(res);
  },

  async updateSupplier(id: string, data: any): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/suppliers/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<any>(res);
  },

  async deleteSupplier(id: string): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/suppliers/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return handleResponse<any>(res);
  },

  // Buyers (CRM-lite)
  async getBuyers(params: Record<string, string> = {}): Promise<any[]> {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/admin/buyers?${query}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<any[]>(res);
  },

  async getBuyer(id: string): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/buyers/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<any>(res);
  },

  async createBuyer(data: any): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/buyers`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<any>(res);
  },

  async updateBuyer(id: string, data: any): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/buyers/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<any>(res);
  },

  // Site Builder & Content
  async getContentBlocks(params: Record<string, string> = {}): Promise<any[]> {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/admin/content?${query}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<any[]>(res);
  },

  async saveContentBlock(data: any): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/content`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<any>(res);
  },

  async rollbackContentBlock(id: string): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/content/${id}/rollback`, {
      method: "POST",
      headers: getAuthHeaders(),
    });
    return handleResponse<any>(res);
  },

  // Media Library
  async getMedia(params: Record<string, string> = {}): Promise<any[]> {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/admin/media?${query}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<any[]>(res);
  },

  async uploadMedia(formData: FormData): Promise<any> {
    const token = localStorage.getItem("ise_admin_token") || "dev-admin-token";
    const res = await fetch(`${API_BASE}/admin/media/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    return handleResponse<any>(res);
  },

  async updateMedia(id: string, data: any): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/media/${id}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<any>(res);
  },

  async deleteMedia(id: string): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/media/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return handleResponse<any>(res);
  },

  // Company Settings
  async getSettings(): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/settings`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<any>(res);
  },

  async updateSettings(section: string, data: any): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/settings/${section}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<any>(res);
  },

  // Navigation
  async getNavigation(): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/navigation`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<any>(res);
  },

  async updateNavigation(data: any): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/navigation`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<any>(res);
  },

  // Theme & Design
  async getTheme(): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/theme`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<any>(res);
  },

  async updateTheme(data: any): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/theme`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<any>(res);
  },

  async resetTheme(): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/theme/reset`, {
      method: "POST",
      headers: getAuthHeaders(),
    });
    return handleResponse<any>(res);
  },

  // SEO Manager
  async getSeo(): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/seo`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<any>(res);
  },

  async updateSeo(pageKey: string, data: any): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/seo/${pageKey}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<any>(res);
  },

  async regenerateSitemap(): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/seo/regenerate-sitemap`, {
      method: "POST",
      headers: getAuthHeaders(),
    });
    return handleResponse<any>(res);
  },

  // Templates
  async getTemplates(): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/templates`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<any>(res);
  },

  async updateTemplate(type: "email" | "whatsapp", id: string, data: any): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/templates/${type}/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<any>(res);
  },

  async testSendTemplate(recipientEmail: string, templateName: string): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/templates/test-send`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ recipientEmail, templateName }),
    });
    return handleResponse<any>(res);
  },

  // Users & Roles (Owner only)
  async getUsers(): Promise<AdminUser[]> {
    const res = await fetch(`${API_BASE}/admin/users`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<AdminUser[]>(res);
  },

  async inviteUser(data: { full_name: string; email: string; role: string }): Promise<AdminUser> {
    const res = await fetch(`${API_BASE}/admin/users/invite`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<AdminUser>(res);
  },

  async updateUserRole(id: string, role: string): Promise<AdminUser> {
    const res = await fetch(`${API_BASE}/admin/users/${id}/role`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify({ role }),
    });
    return handleResponse<AdminUser>(res);
  },

  async toggleUserStatus(id: string): Promise<AdminUser> {
    const res = await fetch(`${API_BASE}/admin/users/${id}/toggle-status`, {
      method: "PATCH",
      headers: getAuthHeaders(),
    });
    return handleResponse<AdminUser>(res);
  },

  async forcePasswordReset(id: string): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/users/${id}/reset-password`, {
      method: "POST",
      headers: getAuthHeaders(),
    });
    return handleResponse<any>(res);
  },

  // Audit Logs (Owner only)
  async getAuditLogs(params: Record<string, string> = {}): Promise<any[]> {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/admin/audit?${query}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<any[]>(res);
  },
};
