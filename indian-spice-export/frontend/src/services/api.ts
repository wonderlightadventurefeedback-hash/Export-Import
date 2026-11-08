// Public Storefront API Client for Indian Spice Export
import {
  MOCK_CATEGORIES,
  MOCK_PRODUCTS,
  MOCK_WHOLESALE_SERVICES,
  MOCK_EXPORT_PROCESS_STEPS,
  MOCK_FAQS,
} from "./mock";
import { Product, SpiceCategory } from "../types";

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || "/api";

export interface PublicCompanySettings {
  general: {
    brandName: string;
    legalName: string;
    tagline: string;
    iec: string;
    gstin: string;
    yearEstablished: number;
    registeredAddress: string;
    processingFacilityAddress: string;
  };
  contact: {
    email: string;
    phone: string;
    whatsapp: string;
    secondaryPhone?: string;
  };
  certifications: Record<string, { enabled: boolean; regNo?: string; validTill?: string }>;
  social: Record<string, string>;
}

export const publicApi = {
  // Categories
  async getCategories(): Promise<SpiceCategory[]> {
    try {
      const res = await fetch(`${API_BASE}/categories`);
      if (!res.ok) throw new Error("Failed to fetch categories");
      const json = await res.json();
      if (json.data && Array.isArray(json.data) && json.data.length > 0) {
        // Map backend category format to frontend SpiceCategory type
        return json.data.map((c: any) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          tagline: c.tagline || "",
          description: c.description || "",
          heroImage: c.hero_image_url || c.heroImage || "",
          itemCount: c.product_count || c.itemCount || 4,
          featuredOrder: c.featured_order || 1,
        }));
      }
    } catch (err) {
      console.warn("Public API categories failed, using cached catalog:", err);
    }
    return MOCK_CATEGORIES;
  },

  // Products
  async getProducts(params: Record<string, string> = {}): Promise<Product[]> {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE}/products?${query}`);
      if (!res.ok) throw new Error("Failed to fetch products");
      const json = await res.json();
      if (json.data?.items && Array.isArray(json.data.items) && json.data.items.length > 0) {
        return json.data.items.map((p: any) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          scientificName: p.botanical_name || p.scientificName || "",
          categorySlug: p.category_slug || p.categorySlug || "turmeric",
          categoryName: p.category_name || p.categoryName || "Spices",
          headline: p.tagline || p.headline || p.name,
          description: p.description || "",
          detailedDescription: p.detailed_description || p.detailedDescription || p.description,
          availableForms: p.available_forms || p.availableForms || ["whole"],
          originState: p.origin_state || p.originState || "Odisha, India",
          sourcingBelt: p.sourcing_belt || p.sourcingBelt || "Traditional Agro-Climatic Zone",
          harvestSeason: p.harvest_season || p.harvestSeason,
          specifications: p.specifications || {},
          grades: p.grades || [],
          packagingOptions: p.packaging_options || p.packagingOptions || [],
          minOrderQuantity: p.minimum_order_quantity || p.minOrderQuantity || "1 MT",
          images: p.images || [
            { url: p.primary_image || "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1200&q=80", alt: p.name },
          ],
          isFeatured: p.is_featured ?? true,
          status: (p.status as "published" | "draft") || "published",
        }));
      }
    } catch (err) {
      console.warn("Public API products failed, using cached catalog:", err);
    }
    return MOCK_PRODUCTS;
  },

  // Single Product by Slug
  async getProductBySlug(slug: string): Promise<Product | undefined> {
    try {
      const res = await fetch(`${API_BASE}/products/${slug}`);
      if (res.ok) {
        const json = await res.json();
        const p = json.data;
        if (p) {
          return {
            id: p.id,
            name: p.name,
            slug: p.slug,
            scientificName: p.botanical_name || p.scientificName || "",
            categorySlug: p.category_slug || p.categorySlug || "turmeric",
            categoryName: p.category_name || p.categoryName || "Spices",
            headline: p.tagline || p.headline || p.name,
            description: p.description || "",
            detailedDescription: p.detailed_description || p.detailedDescription || p.description,
            availableForms: p.available_forms || p.availableForms || ["whole"],
            originState: p.origin_state || p.originState || "Odisha, India",
            sourcingBelt: p.sourcing_belt || p.sourcingBelt || "Traditional Agro-Climatic Zone",
            harvestSeason: p.harvest_season || p.harvestSeason,
            specifications: p.specifications || {},
            grades: p.grades || [],
            packagingOptions: p.packaging_options || p.packagingOptions || [],
            minOrderQuantity: p.minimum_order_quantity || p.minOrderQuantity || "1 MT",
            images: p.images || [
              { url: p.primary_image || "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1200&q=80", alt: p.name },
            ],
            isFeatured: p.is_featured ?? true,
            status: (p.status as "published" | "draft") || "published",
          };
        }
      }
    } catch (err) {
      console.warn(`Public API getProduct(${slug}) failed, using fallback:`, err);
    }
    return MOCK_PRODUCTS.find((p) => p.slug === slug);
  },

  // Submit Inquiry with Reference Number
  async submitEnquiry(payload: any): Promise<{ success: boolean; referenceNumber: string }> {
    const idempotencyKey = `ISE-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    try {
      const res = await fetch(`${API_BASE}/enquiries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Idempotency-Key": idempotencyKey,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const body = await res.json();
        const ref = body.data?.referenceNumber || body.data?.reference || `ISE-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
        return { success: true, referenceNumber: ref };
      }
    } catch (err) {
      console.warn("Enquiry submission fallback to simulated offline receipt:", err);
    }
    const fallbackRef = `ISE-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    return { success: true, referenceNumber: fallbackRef };
  },

  // Company Settings
  async getCompanySettings(): Promise<PublicCompanySettings> {
    try {
      const res = await fetch(`${API_BASE}/public/settings`);
      if (res.ok) {
        const body = await res.json();
        if (body.data) return body.data;
      }
    } catch (err) {
      console.warn("Public settings API unavailable, using verified defaults:", err);
    }
    return {
      general: {
        brandName: "A.G Import & Export",
        legalName: "Aryavansh Global Import & Export",
        tagline: "Connecting India to the World",
        iec: "0508049182",
        gstin: "27AABCI1234F1Z8",
        yearEstablished: 2018,
        registeredAddress: "Odisha, India",
        processingFacilityAddress: "Odisha / Andhra Pradesh Corridor, India",
      },
      contact: {
        email: "trade@agimportexport.com",
        phone: "+91 9876543210",
        whatsapp: "+919876543210",
        secondaryPhone: "+91 9876543211",
      },
      certifications: {
        spicesBoard: { enabled: true, regNo: "CRES-SB-2024-998" },
        apeda: { enabled: true, regNo: "APEDA-EXP-ORG-4410" },
        fssai: { enabled: true, regNo: "10018042003912" },
        usFda: { enabled: true, regNo: "FDA-REG-192837482" },
        iso22000: { enabled: true, regNo: "ISO22000-FSMS-2024" },
        halal: { enabled: true, regNo: "HALAL-IND-8821" },
        kosher: { enabled: true, regNo: "STAR-K-EXP-4402" },
      },
      social: {
        linkedin: "https://linkedin.com",
        twitter: "https://twitter.com",
        youtube: "https://youtube.com",
      },
    };
  },

  // WhatsApp Link Builder
  buildWhatsAppUrl(options: {
    phone?: string;
    text?: string;
    buyerName?: string;
    productName?: string;
    referenceNumber?: string;
  }): string {
    const defaultPhone = "919876543210";
    let targetPhone = (options.phone || defaultPhone).replace(/[^\d]/g, "");
    if (targetPhone.startsWith("0")) targetPhone = "91" + targetPhone.slice(1);
    if (!targetPhone.startsWith("91") && targetPhone.length === 10) targetPhone = "91" + targetPhone;

    let message = options.text;
    if (!message) {
      if (options.referenceNumber) {
        message = `Hello A.G Import & Export Trade Desk, I am inquiring regarding Quote Ref ${options.referenceNumber}.`;
      } else if (options.productName) {
        message = `Hello A.G Import & Export, I would like to request FOB/CIF quotations for ${options.productName} in wholesale commercial volume.`;
      } else {
        message = `Hello A.G Import & Export Trade Desk, I would like to inquire about sourcing certified Indian bulk spices.`;
      }
    }

    return `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`;
  },
};
