/**
 * Indian Spice Export - Core TypeScript Definitions
 */

export type SpiceForm = "whole" | "ground" | "crushed" | "oil" | "oleoresin" | "all";

export interface SpiceCategory {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  heroImage: string;
  itemCount?: number;
  featuredOrder?: number;
}

export interface ProductSpecification {
  moistureMax?: string;
  volatileOilMin?: string;
  curcuminContent?: string;
  piperineContent?: string;
  capsaicinSHU?: string;
  extraneousMatterMax?: string;
  totalAshMax?: string;
  acidInsolubleAshMax?: string;
  bulkDensity?: string;
  appearance?: string;
  aroma?: string;
  [key: string]: string | undefined;
}

export interface ProductPackagingOption {
  type: string; // e.g. "Jute Bags", "HDPE Bags", "Multiwall Paper Sacks", "Vacuum Pouches"
  sizes: string[]; // e.g. ["25 kg", "50 kg"]
  innerLiner?: string;
  palletsAvailable?: boolean;
}

export interface Product {
  id: string;
  name: string;
  scientificName: string;
  slug: string;
  categorySlug: string;
  categoryName: string;
  headline: string;
  description: string;
  detailedDescription?: string;
  availableForms: ("whole" | "ground" | "crushed" | "coarse")[];
  originState: string;
  sourcingBelt: string;
  harvestSeason?: string;
  specifications: ProductSpecification;
  grades: string[];
  packagingOptions: ProductPackagingOption[];
  minOrderQuantity: string; // e.g. "Available on request" or "500 kg"
  images: {
    url: string;
    alt: string;
    caption?: string;
    isPrimary?: boolean;
  }[];
  isFeatured?: boolean;
  status: "published" | "draft";
}

export interface WholesaleService {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  iconName: string;
}

export interface ExportProcessStep {
  stepNumber: number;
  title: string;
  duration: string;
  description: string;
  deliverable: string;
  actionRequired: string;
  iconName: string;
}

export interface QuoteItem {
  id: string;
  productName: string;
  quantity: string;
  unit: "MT (Metric Tonnes)" | "KG (Kilograms)" | "20ft FCL Container" | "40ft FCL Container";
  form: "Whole" | "Powder / Ground" | "Crushed / Split" | "Either / Discuss";
  preferredGrade?: string;
  packagingPreference?: string;
}

export interface QuoteRequestForm {
  // Step 1: Buyer Details
  fullName: string;
  companyName: string;
  businessEmail: string;
  phoneWhatsapp: string;
  country: string;
  city: string;
  buyerType: "Importer" | "Distributor" | "Wholesaler" | "Supermarket Chain" | "Food Manufacturer" | "Other";

  // Step 2: Products
  items: QuoteItem[];

  // Step 3: Logistics & Destination
  destinationPort: string;
  targetIncoterm: "FOB (Free On Board)" | "CIF (Cost, Insurance & Freight)" | "CFR (Cost & Freight)" | "EXW (Ex Works)";
  estimatedShipmentMonth?: string;

  // Step 4: Notes
  specialRequirements?: string;
  agreeToTruthTerms: boolean;
}

export interface ContactFormSubmission {
  fullName: string;
  companyName: string;
  email: string;
  phoneWhatsapp: string;
  country: string;
  inquiryType: "Export Quotation" | "Product Catalog" | "Sample Request" | "General Inquiry";
  message: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category?: "orders" | "shipping" | "quality" | "payment";
}
