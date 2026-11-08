import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export let supabase: SupabaseClient | null = null;

if (supabaseUrl && supabaseServiceKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
    console.log("[Supabase] Successfully connected to live Supabase instance.");
  } catch (err) {
    console.warn("[Supabase] Failed to initialize client, using fallback in-memory store:", err);
  }
} else {
  console.log("[Supabase] No live credentials configured. Initializing local database store.");
}

// ---------------------------------------------------------------------------
// High-Fidelity In-Memory Database Store (Used for Dev / Offline / Testing)
// ---------------------------------------------------------------------------

export interface AdminUser {
  id: string;
  auth_user_id?: string;
  full_name: string;
  email: string;
  role: "Owner" | "Editor" | "Sales" | "Viewer";
  is_active: boolean;
  last_login_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  hero_image_url: string;
  featured_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  category_id?: string;
  category_slug?: string;
  category_name?: string;
  name: string;
  slug: string;
  scientific_name?: string;
  headline?: string;
  description: string;
  detailed_description?: string;
  available_forms: string[];
  origin_state: string;
  sourcing_belt?: string;
  harvest_season?: string;
  specifications: Record<string, string>;
  grades: string[];
  min_order_quantity: string;
  is_featured: boolean;
  status: "draft" | "published" | "archived";
  images: Array<{ url: string; alt_text: string; is_primary: boolean }>;
  packaging: Array<{ package_type: string; standard_sizes: string[] }>;
  created_at: string;
  updated_at: string;
}

export interface Supplier {
  id: string;
  supplier_code: string;
  supplier_type: "Farmer" | "Manufacturer" | "Wholesaler" | "Other approved supplier";
  business_or_farm_name: string;
  contact_person: string;
  phone: string;
  email: string;
  state: string;
  district: string;
  address: string;
  verification_status: "Pending" | "Verified" | "Suspended";
  internal_notes: string;
  linked_products: string[];
  created_at: string;
  updated_at: string;
}

export interface Buyer {
  id: string;
  company_name: string;
  contact_person: string;
  email: string;
  phone_whatsapp?: string;
  country: string;
  city?: string;
  buyer_type: string;
  notes?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export interface EnquiryItem {
  id?: string;
  product_name: string;
  product_id?: string;
  quantity: string | number;
  unit: string;
  form: string;
  preferred_grade?: string;
  packaging_preference?: string;
}

export interface Enquiry {
  id: string;
  reference_no: string;
  buyer_id?: string;
  representative_name: string;
  company_name: string;
  business_email: string;
  phone_whatsapp?: string;
  country: string;
  city?: string;
  buyer_type: string;
  destination_port: string;
  target_incoterm: string;
  estimated_shipment_schedule?: string;
  special_requirements?: string;
  status: "New" | "Reviewing" | "Quoted" | "Negotiating" | "Accepted" | "Rejected" | "Closed";
  assigned_to?: string;
  assigned_to_name?: string;
  internal_notes?: Array<{ id: string; author: string; text: string; date: string }>;
  items: EnquiryItem[];
  created_at: string;
  updated_at: string;
}

export interface QuotationItem {
  id?: string;
  product_name: string;
  quantity: number;
  unit: string;
  unit_price: number;
  total_price: number;
  packaging?: string;
  specifications_summary?: string;
}

export interface Quotation {
  id: string;
  quotation_no: string;
  enquiry_id?: string;
  buyer_id?: string;
  buyer_name: string;
  company_name: string;
  currency: string;
  incoterm: string;
  destination_port: string;
  payment_terms: string;
  valid_until: string;
  status: "Draft" | "Sent" | "Accepted" | "Expired" | "Revised";
  prepared_by?: string;
  subtotal: number;
  insurance_and_freight: number;
  total_amount: number;
  terms_conditions: string;
  items: QuotationItem[];
  created_at: string;
  updated_at: string;
}

export interface AuditLogEntry {
  id: string;
  actor_id?: string;
  actor_name: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  details?: string;
  before_state?: any;
  after_state?: any;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Seed Data Initialization
// ---------------------------------------------------------------------------

const INITIAL_ADMIN_USERS: AdminUser[] = [
  {
    id: "usr-1",
    auth_user_id: "auth-1",
    full_name: "Export Director",
    email: "admin@indianspiceexport.com",
    role: "Owner",
    is_active: true,
    last_login_at: new Date().toISOString(),
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "usr-2",
    auth_user_id: "auth-2",
    full_name: "Rajesh Mohanty",
    email: "rajesh.trade@indianspiceexport.com",
    role: "Sales",
    is_active: true,
    last_login_at: new Date().toISOString(),
    created_at: "2026-01-15T00:00:00Z",
    updated_at: "2026-01-15T00:00:00Z",
  },
  {
    id: "usr-3",
    auth_user_id: "auth-3",
    full_name: "Pooja Sharma",
    email: "content@indianspiceexport.com",
    role: "Editor",
    is_active: true,
    created_at: "2026-02-01T00:00:00Z",
    updated_at: "2026-02-01T00:00:00Z",
  },
];

const INITIAL_CATEGORIES: Category[] = [
  {
    id: "cat-1",
    name: "Turmeric",
    slug: "turmeric",
    tagline: "High-Curcumin Roots & Pure Ground Form",
    description: "Sourced from the fertile, bio-rich soil of Kandhamal (Odisha) and renowned Indian turmeric belts, noted for intense natural aroma and high curcumin levels.",
    hero_image_url: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1200&q=80",
    featured_order: 1,
    is_published: true,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "cat-2",
    name: "Red Chilli",
    slug: "red-chilli",
    tagline: "Vibrant Colour & Controlled Pungency Grades",
    description: "Selected whole dried chillies and fine powders ranging from high-pungency Teja to deep-red low-heat Byadgi and Kashmiri varieties.",
    hero_image_url: "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=1200&q=80",
    featured_order: 2,
    is_published: true,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "cat-3",
    name: "Black Pepper",
    slug: "black-pepper",
    tagline: "The King of Spices from the Malabar Coast & Eastern Ghats",
    description: "Bold, sun-dried black peppercorns offering high piperine density, robust essential oils, and clean garbled grades.",
    hero_image_url: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=1200&q=80",
    featured_order: 3,
    is_published: true,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "cat-4",
    name: "Green Cardamom",
    slug: "green-cardamom",
    tagline: "Fragrant Queen of Spices, Hand-Sorted Pods",
    description: "Extra bold 8mm+ and bold 7-8mm deep green pods harvested from misty hill plantations with sealed aroma and high oil retention.",
    hero_image_url: "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=1200&q=80",
    featured_order: 4,
    is_published: true,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "cat-5",
    name: "Cumin Seeds",
    slug: "cumin-seeds",
    tagline: "Earthy, Warm & High Essential Oil Content",
    description: "Machine-cleaned and sortex-sorted cumin seeds with high volatile oil value, machine cleaned 99% and 99.5% purity.",
    hero_image_url: "https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=1200&q=80",
    featured_order: 5,
    is_published: true,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
];

const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    category_id: "cat-1",
    category_slug: "turmeric",
    category_name: "Turmeric",
    name: "Kandhamal Organic Turmeric Fingers",
    slug: "kandhamal-turmeric-fingers",
    scientific_name: "Curcuma longa",
    headline: "GI-tagged organically grown turmeric with naturally elevated curcumin levels (4.5%–5.5%).",
    description: "Hand-harvested in the pristine highlands of Kandhamal, Odisha, free from synthetic pesticides and artificial polish.",
    detailed_description: "Our Kandhamal turmeric fingers are cured and sun-dried according to age-old tribal cooperative practices, producing a dense rhizome with a deep golden-yellow core.",
    available_forms: ["whole", "ground"],
    origin_state: "Odisha",
    sourcing_belt: "Kandhamal Highlands (GI-Protected Belt)",
    harvest_season: "January to March",
    specifications: {
      "Curcumin Content": "4.5% - 5.5%",
      "Moisture": "Max 10.0%",
      "Total Ash": "Max 7.0%",
      "Acid Insoluble Ash": "Max 1.0%",
      "Extraneous Matter": "Max 0.5%",
      "Volatile Oil": "Min 3.5%",
    },
    grades: ["Single Polished", "Double Polished", "Unpolished / Raw Tribal Grade"],
    min_order_quantity: "1 Metric Tonne (FCL or LCL consolidated)",
    is_featured: true,
    status: "published",
    images: [
      {
        url: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1000&q=80",
        alt_text: "Golden whole Kandhamal turmeric fingers",
        is_primary: true,
      },
    ],
    packaging: [
      { package_type: "Food-grade double-layered Jute Bags", standard_sizes: ["25 kg", "50 kg"] },
      { package_type: "HDPE Bags with Inner Polyethylene Liner", standard_sizes: ["25 kg"] },
    ],
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "prod-2",
    category_id: "cat-3",
    category_slug: "black-pepper",
    category_name: "Black Pepper",
    name: "Tellicherry / Malabar Garbled Black Pepper",
    slug: "malabar-garbled-black-pepper",
    scientific_name: "Piper nigrum",
    headline: "Sun-dried whole black peppercorns with intense pungent piperine and aromatic essential oils.",
    description: "Heavy berries from mature vines across Malabar and Koraput, machine garbled, sortex cleaned, and moisture-controlled.",
    detailed_description: "Rigorous density testing ensures bold corns exceeding 550 g/l to 570 g/l (TGSEB/TGEB specs).",
    available_forms: ["whole", "ground", "crushed"],
    origin_state: "Kerala / Odisha",
    sourcing_belt: "Malabar & Eastern Ghats",
    harvest_season: "December to February",
    specifications: {
      "Piperine Content": "4.5% - 6.0%",
      "Moisture": "Max 11.5%",
      "Bulk Density": "550 g/l - 580 g/l",
      "Non-Volatile Ether Extract": "Min 6.5%",
      "Volatile Oil": "Min 2.0%",
    },
    grades: ["TGSEB (Tellicherry Garbled Special Extra Bold)", "TGEB", "MG-1 (Malabar Garbled)"],
    min_order_quantity: "1 Metric Tonne",
    is_featured: true,
    status: "published",
    images: [
      {
        url: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=1000&q=80",
        alt_text: "Tellicherry bold black peppercorns",
        is_primary: true,
      },
    ],
    packaging: [
      { package_type: "Multiwall Kraft Paper Sacks with PP liner", standard_sizes: ["25 kg"] },
      { package_type: "Gunny / Jute Bags", standard_sizes: ["50 kg"] },
    ],
    created_at: "2026-01-05T00:00:00Z",
    updated_at: "2026-01-05T00:00:00Z",
  },
  {
    id: "prod-3",
    category_id: "cat-2",
    category_slug: "red-chilli",
    category_name: "Red Chilli",
    name: "Guntur Sannam S4 Red Chilli",
    slug: "guntur-sannam-s4-red-chilli",
    scientific_name: "Capsicum annuum",
    headline: "Renowned Indian dried chilli with medium-high heat and brilliant red oil extraction index.",
    description: "The global benchmark for culinary sauces and curry bases. Clean, stemless or stem-cut options with minimal loose seeds.",
    detailed_description: "Processed through mechanical de-stoners, air separators, and Sortex optical sorters.",
    available_forms: ["whole", "ground", "crushed"],
    origin_state: "Andhra Pradesh",
    sourcing_belt: "Guntur Chilli Belt",
    harvest_season: "February to April",
    specifications: {
      "Capsaicin (SHU)": "35,000 - 45,000 SHU",
      "Colour Value (ASTA)": "50 - 65 ASTA",
      "Moisture": "Max 10.0%",
      "Loose Seeds": "Max 2.0%",
      "Foreign Matter": "Max 0.5%",
    },
    grades: ["Stemless", "With Stem", "Crushed Flakes (10-30 mesh)", "Powder (60-80 mesh)"],
    min_order_quantity: "3 Metric Tonnes",
    is_featured: true,
    status: "published",
    images: [
      {
        url: "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=1000&q=80",
        alt_text: "Whole dried red chillies",
        is_primary: true,
      },
    ],
    packaging: [
      { package_type: "Compressed Bales in Jute", standard_sizes: ["25 kg", "50 kg"] },
      { package_type: "Carton Boxes with Polybag", standard_sizes: ["10 kg", "20 kg"] },
    ],
    created_at: "2026-01-10T00:00:00Z",
    updated_at: "2026-01-10T00:00:00Z",
  },
  {
    id: "prod-4",
    category_id: "cat-4",
    category_slug: "green-cardamom",
    category_name: "Green Cardamom",
    name: "Alleppey Green Cardamom (8mm+ Extra Bold)",
    slug: "alleppey-green-cardamom-extra-bold",
    scientific_name: "Elettaria cardamomum",
    headline: "Lush green pods sorted by mechanical sieve sizes with pristine seed count and sweet camphor note.",
    description: "Sun & dryer-cured to lock in intense volatile aromas. Available in sealed food-grade cartons.",
    detailed_description: "Extra bold whole pods offering supreme volatile oil retention for bakery, confectionery and luxury tea blends.",
    available_forms: ["whole", "ground"],
    origin_state: "Kerala",
    sourcing_belt: "Idukki Plantation Belt",
    harvest_season: "September to January",
    specifications: {
      "Volatile Oil": "7.0% - 9.0%",
      "Moisture": "Max 10.0%",
      "Size Diameter": "8mm and above (Extra Bold)",
      "Immature/Empty Pods": "Max 1.0%",
      "Foreign Matter": "Max 0.2%",
    },
    grades: ["AGEB (Alleppey Green Extra Bold - 8mm+)", "AGB (Alleppey Green Bold - 7-8mm)", "AGS (Alleppey Green Superior - 6-7mm)"],
    min_order_quantity: "500 Kilograms",
    is_featured: true,
    status: "published",
    images: [
      {
        url: "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=1000&q=80",
        alt_text: "Vibrant green cardamom pods",
        is_primary: true,
      },
    ],
    packaging: [
      { package_type: "Vacuum Sealed Master Cartons", standard_sizes: ["5 kg", "10 kg", "25 kg"] },
    ],
    created_at: "2026-01-12T00:00:00Z",
    updated_at: "2026-01-12T00:00:00Z",
  },
];

const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: "sup-1",
    supplier_code: "SUP-KDM-001",
    supplier_type: "Farmer",
    business_or_farm_name: "Kandhamal Tribal Spice Producers Co-op",
    contact_person: "Bikash Pradhan",
    phone: "+91 94371 12345",
    email: "kandhamal.spices.coop@internal.local",
    state: "Odisha",
    district: "Kandhamal",
    address: "Phulbani Cluster, Kandhamal, Odisha - 762001",
    verification_status: "Verified",
    internal_notes: "Organic cooperative spanning 350 smallholder tribal farms. GI certified source.",
    linked_products: ["prod-1"],
    created_at: "2026-01-05T00:00:00Z",
    updated_at: "2026-01-05T00:00:00Z",
  },
  {
    id: "sup-2",
    supplier_code: "SUP-GNT-002",
    supplier_type: "Manufacturer",
    business_or_farm_name: "Krishna Valley Dryers & Cold Storage",
    contact_person: "V. Rama Rao",
    phone: "+91 98480 54321",
    email: "ramarao.guntur@internal.local",
    state: "Andhra Pradesh",
    district: "Guntur",
    address: "Industrial Area, Auto Nagar, Guntur, AP - 522001",
    verification_status: "Verified",
    internal_notes: "Modern Sortex color-sorting facility with stem-cutting lines. Handles S4 and Teja chillies.",
    linked_products: ["prod-3"],
    created_at: "2026-01-08T00:00:00Z",
    updated_at: "2026-01-08T00:00:00Z",
  },
  {
    id: "sup-3",
    supplier_code: "SUP-IDK-003",
    supplier_type: "Wholesaler",
    business_or_farm_name: "Highland Planters Consortium",
    contact_person: "Mathew Thomas",
    phone: "+91 94470 99887",
    email: "m.thomas@highlandplanters.local",
    state: "Kerala",
    district: "Idukki",
    address: "Vandanmedu, Idukki District, Kerala - 685551",
    verification_status: "Verified",
    internal_notes: "Specialized in 8mm+ Extra Bold green cardamom and Malabar peppercorns.",
    linked_products: ["prod-2", "prod-4"],
    created_at: "2026-01-10T00:00:00Z",
    updated_at: "2026-01-10T00:00:00Z",
  },
];

const INITIAL_BUYERS: Buyer[] = [
  {
    id: "buy-1",
    company_name: "Nordic Spice Import AS",
    contact_person: "Erik Lindqvist",
    email: "e.lindqvist@nordicspice.no",
    phone_whatsapp: "+47 22 123 456",
    country: "Norway",
    city: "Oslo",
    buyer_type: "Importer / Wholesaler",
    notes: "Requires EU pesticide compliance certificate for all shipments.",
    tags: ["High Volume", "EU Certified", "Organic"],
    created_at: "2026-01-15T00:00:00Z",
    updated_at: "2026-01-15T00:00:00Z",
  },
  {
    id: "buy-2",
    company_name: "Gulf Premium Foods LLC",
    contact_person: "Tariq Al-Mansoor",
    email: "procurement@gulfpremiumfoods.ae",
    phone_whatsapp: "+971 4 888 9900",
    country: "United Arab Emirates",
    city: "Dubai",
    buyer_type: "Food Manufacturer",
    notes: "Regular importer of 8mm Cardamom and Malabar Garbled Pepper via Jebel Ali Port.",
    tags: ["Repeat Buyer", "Jebel Ali"],
    created_at: "2026-01-20T00:00:00Z",
    updated_at: "2026-01-20T00:00:00Z",
  },
];

const INITIAL_ENQUIRIES: Enquiry[] = [
  {
    id: "enq-1",
    reference_no: "ISE-2026-00001",
    buyer_id: "buy-1",
    representative_name: "Erik Lindqvist",
    company_name: "Nordic Spice Import AS",
    business_email: "e.lindqvist@nordicspice.no",
    phone_whatsapp: "+47 22 123 456",
    country: "Norway",
    city: "Oslo",
    buyer_type: "Importer",
    destination_port: "Port of Oslo",
    target_incoterm: "CIF (Cost, Insurance & Freight)",
    estimated_shipment_schedule: "Q2 2026",
    special_requirements: "Full EU compliant third-party SGS laboratory analysis for pesticide residues and heavy metals.",
    status: "Quoted",
    assigned_to: "usr-2",
    assigned_to_name: "Rajesh Mohanty",
    internal_notes: [
      { id: "note-1", author: "Rajesh Mohanty", text: "Drafted formal CIF Oslo quote based on lot #KDM-26A.", date: "2026-02-01T10:30:00Z" },
    ],
    items: [
      {
        id: "item-1",
        product_name: "Kandhamal Organic Turmeric Fingers",
        product_id: "prod-1",
        quantity: 14,
        unit: "MT (Metric Tonnes)",
        form: "Whole",
        preferred_grade: "Double Polished",
        packaging_preference: "25 kg Food-Grade Jute Bags with Poly Liner",
      },
      {
        id: "item-2",
        product_name: "Tellicherry Garbled Black Pepper",
        product_id: "prod-2",
        quantity: 6,
        unit: "MT (Metric Tonnes)",
        form: "Whole",
        preferred_grade: "TGSEB 570 g/l",
        packaging_preference: "25 kg Kraft Paper Sacks",
      },
    ],
    created_at: "2026-01-28T09:15:00Z",
    updated_at: "2026-02-01T10:30:00Z",
  },
  {
    id: "enq-2",
    reference_no: "ISE-2026-00002",
    buyer_id: "buy-2",
    representative_name: "Tariq Al-Mansoor",
    company_name: "Gulf Premium Foods LLC",
    business_email: "procurement@gulfpremiumfoods.ae",
    phone_whatsapp: "+971 4 888 9900",
    country: "United Arab Emirates",
    city: "Dubai",
    buyer_type: "Food Manufacturer",
    destination_port: "Jebel Ali Port",
    target_incoterm: "CIF",
    estimated_shipment_schedule: "Immediate",
    special_requirements: "Air-conditioned container stuffing; Phytosanitary certificate authenticated for GCC.",
    status: "Reviewing",
    assigned_to: "usr-2",
    assigned_to_name: "Rajesh Mohanty",
    internal_notes: [],
    items: [
      {
        id: "item-3",
        product_name: "Alleppey Green Cardamom (8mm+ Extra Bold)",
        product_id: "prod-4",
        quantity: 2.5,
        unit: "MT (Metric Tonnes)",
        form: "Whole",
        preferred_grade: "AGEB",
        packaging_preference: "10 kg Vacuum Sealed Cartons",
      },
    ],
    created_at: "2026-02-02T14:40:00Z",
    updated_at: "2026-02-02T14:40:00Z",
  },
];

const INITIAL_QUOTATIONS: Quotation[] = [
  {
    id: "qte-1",
    quotation_no: "QTE-2026-00001",
    enquiry_id: "enq-1",
    buyer_id: "buy-1",
    buyer_name: "Erik Lindqvist",
    company_name: "Nordic Spice Import AS",
    currency: "USD",
    incoterm: "CIF",
    destination_port: "Port of Oslo, Norway",
    payment_terms: "Irrevocable Confirmed L/C at sight, or 30% TT advance deposit with balance upon BL copy.",
    valid_until: "2026-03-31",
    status: "Sent",
    prepared_by: "Rajesh Mohanty",
    subtotal: 54600.00,
    insurance_and_freight: 4200.00,
    total_amount: 58800.00,
    terms_conditions: "Prices subject to prevailing ocean freight index at time of vessel fixture. Origin India, ports of Paradip/Kolkata/Cochin. Standard SGS inspection certificates included.",
    items: [
      {
        id: "qi-1",
        product_name: "Kandhamal Organic Turmeric Fingers (Double Polished, 5% Curcumin)",
        quantity: 14,
        unit: "MT",
        unit_price: 2150.00,
        total_price: 30100.00,
        packaging: "25kg Food-grade Jute Bags",
        specifications_summary: "Curcumin > 5.0%, Moisture < 9.5%, ETO Free",
      },
      {
        id: "qi-2",
        product_name: "Tellicherry Garbled Black Pepper (TGSEB 570 g/l)",
        quantity: 6,
        unit: "MT",
        unit_price: 4083.33,
        total_price: 24500.00,
        packaging: "25kg Multiwall Kraft Paper Sacks",
        specifications_summary: "Density 570 g/l, Piperine 5.2%, Clean Garbled",
      },
    ],
    created_at: "2026-02-01T10:30:00Z",
    updated_at: "2026-02-01T10:30:00Z",
  },
];

const INITIAL_COMPANY_SETTINGS: Record<string, any> = {
  general: {
    companyName: "A.G Import & Export",
    legalName: "Aryavansh Global Import & Export",
    tagline: "Connecting India to the World",
    description: "Licensed Indian merchant and manufacturer exporter delivering verified origin spices to commercial food manufacturers, extractors, and wholesale distributors worldwide.",
    foundedYear: "2018",
    registeredOffice: "Ground & 1st Floor, Trade Corridor Towers, Janpath, Bhubaneswar, Odisha - 751001, India",
    operationalHubs: [
      "Bhubaneswar, Odisha (HQ & Eastern Ghats Sourcing)",
      "Kochi, Kerala (Malabar Coast Logistics & Quality Hub)",
      "Guntur, Andhra Pradesh (Chilli Procurement Terminal)",
    ],
    phones: ["+91 94370 00000", "+91 674 2500000"],
    primaryPhone: "+91 94370 00000",
    whatsappNumber: "+91 94370 00000",
    emails: {
      tradeDesk: "trade@indianspiceexport.com",
      compliance: "compliance@indianspiceexport.com",
      general: "info@indianspiceexport.com",
    },
    businessHours: "Monday to Saturday: 09:00 - 18:30 IST (Export Desk active 24/7 for overseas time zones)",
  },
  certifications: {
    spiceBoardRegistrationNo: "SB/EXP/2024/78219",
    fssaiLicense: "10020031002341",
    apedaRegistration: "APEDA/RCMC/2023/1820",
    iecCode: "0819283741",
    qualityPartnerships: ["SGS India", "Bureau Veritas", "Spices Board Quality Lab QEL"],
  },
  certificates: [
    {
      id: "cert-spices-board",
      title: "Spices Board of India (CRES)",
      category: "Export License",
      authority: "Ministry of Commerce & Industry, Govt of India",
      regNo: "SB/EXP/2024/78219",
      validTill: "2028-12-31",
      enabled: true,
      imageUrl: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80",
      description: "Certificate of Registration as an Exporter of Spices (CRES) covering whole and ground spice commodities.",
    },
    {
      id: "cert-apeda",
      title: "APEDA Registration & RCMC",
      category: "Export License",
      authority: "Agricultural & Processed Food Products Export Development Authority",
      regNo: "APEDA/RCMC/2023/1820",
      validTill: "2027-06-30",
      enabled: true,
      imageUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80",
      description: "Official Registration-cum-Membership Certificate for agricultural exports and quality compliance.",
    },
    {
      id: "cert-fssai",
      title: "FSSAI Central Food Safety License",
      category: "Food Safety",
      authority: "Food Safety and Standards Authority of India",
      regNo: "10020031002341",
      validTill: "2029-03-31",
      enabled: true,
      imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80",
      description: "Central Licensing authority authorization for hygienic processing, storage, and overseas dispatch.",
    },
    {
      id: "cert-fieo",
      title: "FIEO Membership Certificate",
      category: "Membership & Chamber",
      authority: "Federation of Indian Export Organisations (Govt. of India)",
      regNo: "FIEO/MEM/2024/4910",
      validTill: "2027-12-31",
      enabled: true,
      imageUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80",
      description: "Apex body membership credential representing recognized Premier Export Houses of India.",
    },
    {
      id: "cert-iso",
      title: "ISO 22000:2018 FSMS Certified",
      category: "Quality Assurance",
      authority: "International Organization for Standardization",
      regNo: "ISO-FSMS-IN-9082",
      validTill: "2027-09-30",
      enabled: true,
      imageUrl: "https://images.unsplash.com/photo-1589330694653-dad6d3240a2b?auto=format&fit=crop&w=800&q=80",
      description: "Food Safety Management System covering sorting, grading, milling, packaging, and cold warehousing.",
    },
    {
      id: "cert-us-fda",
      title: "US FDA Food Facility Registration",
      category: "Export Compliance",
      authority: "U.S. Food & Drug Administration (FDA)",
      regNo: "FDA-REG-19840291",
      validTill: "2026-12-31",
      enabled: true,
      imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
      description: "Foreign Food Facility Registration compliant with U.S. Bioterrorism Act and FSMA standards.",
    },
  ],
  social: {
    linkedin: "https://linkedin.com/company/indianspiceexport",
    twitter: "https://x.com/indianspicesexp",
  },
};

const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: "log-1",
    actor_id: "usr-1",
    actor_name: "Export Director",
    action: "SYSTEM_INITIALIZE",
    entity_type: "System",
    details: "Production database schema and initial spice catalog initialized.",
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "log-2",
    actor_id: "usr-2",
    actor_name: "Rajesh Mohanty",
    action: "QUOTATION_ISSUED",
    entity_type: "Quotation",
    entity_id: "qte-1",
    details: "Quotation QTE-2026-00001 dispatched to Nordic Spice Import AS ($58,800 CIF Oslo).",
    created_at: "2026-02-01T10:30:00Z",
  },
];

// ---------------------------------------------------------------------------
// In-Memory Repository
// ---------------------------------------------------------------------------

class InMemoryDatabase {
  adminUsers: AdminUser[] = [...INITIAL_ADMIN_USERS];
  categories: Category[] = [...INITIAL_CATEGORIES];
  products: Product[] = [...INITIAL_PRODUCTS];
  suppliers: Supplier[] = [...INITIAL_SUPPLIERS];
  buyers: Buyer[] = [...INITIAL_BUYERS];
  enquiries: Enquiry[] = [...INITIAL_ENQUIRIES];
  quotations: Quotation[] = [...INITIAL_QUOTATIONS];
  settings: Record<string, any> = { ...INITIAL_COMPANY_SETTINGS };
  auditLogs: AuditLogEntry[] = [...INITIAL_AUDIT_LOGS];
  media: Array<{ id: string; url: string; filename: string; alt: string; size: number; mime: string; uploadedAt: string; tags: string[] }> = [
    {
      id: "med-1",
      url: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1200&q=80",
      filename: "kandhamal-turmeric-harvest.jpg",
      alt: "Kandhamal organic turmeric fingers on sorting canvas",
      size: 450200,
      mime: "image/jpeg",
      uploadedAt: "2026-01-02T10:00:00Z",
      tags: ["turmeric", "harvest", "organic"],
    },
    {
      id: "med-2",
      url: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=1200&q=80",
      filename: "tellicherry-peppercorn-garbled.jpg",
      alt: "Garbled black pepper bold berries",
      size: 380120,
      mime: "image/jpeg",
      uploadedAt: "2026-01-03T11:20:00Z",
      tags: ["black-pepper", "peppercorns", "malabar"],
    },
  ];
  theme: Record<string, any> = {
    brandForest: "#0d2b1d",
    brandGold: "#dfb15b",
    brandCream: "#fdfbf7",
    fontHeading: "Cinzel, serif",
    fontBody: "Outfit, sans-serif",
    borderRadius: "rounded-md",
    animationPreset: "Standard",
  };
  navigation: Record<string, any> = {
    headerLinks: [
      { label: "Home", path: "/" },
      { label: "Products", path: "/products" },
      { label: "Services", path: "/services" },
      { label: "Export Process", path: "/export-process" },
      { label: "About", path: "/about" },
      { label: "Contact", path: "/contact" },
    ],
    footerLinks: {
      commodities: [
        { label: "Kandhamal Turmeric", path: "/products/kandhamal-turmeric-fingers" },
        { label: "Malabar Black Pepper", path: "/products/malabar-garbled-black-pepper" },
        { label: "Guntur Sannam Chilli", path: "/products/guntur-sannam-s4-red-chilli" },
        { label: "Alleppey Cardamom", path: "/products/alleppey-green-cardamom-extra-bold" },
      ],
      company: [
        { label: "About Us", path: "/about" },
        { label: "Export Process", path: "/export-process" },
        { label: "Quality & Testing", path: "/services" },
        { label: "Request a Quote", path: "/request-quote" },
        { label: "Contact Trade Desk", path: "/contact" },
      ],
      legal: [
        { label: "Privacy Policy", path: "/privacy-policy" },
        { label: "Terms of Export", path: "/terms" },
      ],
    },
  };
  seo: Record<string, any> = {
    home: {
      title: "Indian Spice Export | Direct Single-Origin B2B Commodities",
      description: "Direct-from-source Indian spice exporter specializing in GI Kandhamal Turmeric, Guntur Chillies, and Malabar Pepper for worldwide importers and food manufacturers.",
      canonical: "https://indianspiceexport.com/",
    },
    products: {
      title: "Bulk Indian Spices Catalog | Indian Spice Export",
      description: "Explore export-grade whole, crushed, and powdered Indian spices with lab-certified curcumin, piperine, and capsaicin specifications.",
      canonical: "https://indianspiceexport.com/products",
    },
  };
  contentBlocks: Array<{ id: string; page: string; section: string; type: string; content: any; status: string; revision: number }> = [
    {
      id: "cb-1",
      page: "home",
      section: "hero",
      type: "hero-banner",
      content: {
        headline: "India's Direct Spice Export Corridor",
        subheadline: "Single-origin commodities sourced from verified farming cooperatives in Kandhamal, Guntur, and Malabar.",
        badge: "APEDA & Spices Board Registered Exporter",
      },
      status: "published",
      revision: 1,
    },
  ];

  log(actorName: string, action: string, entityType: string, entityId?: string, details?: string, beforeState?: any, afterState?: any) {
    const entry: AuditLogEntry = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      actor_name: actorName,
      action,
      entity_type: entityType,
      entity_id: entityId,
      details,
      before_state: beforeState,
      after_state: afterState,
      created_at: new Date().toISOString(),
    };
    this.auditLogs.unshift(entry);
    return entry;
  }
}

export const db = new InMemoryDatabase();
