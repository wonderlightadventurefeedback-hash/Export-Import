import { MOCK_WHOLESALE_SERVICES, MOCK_FAQS } from "../services/mock";

export interface HomePageSettings {
  heroTagline: string;
  heroTitle: string;
  heroSubtitle: string;
  heroBadge: string;
  heroOverlayOpacity?: number; // 0 to 100 (decreased transparency = higher opacity)
  stat1Number: string;
  stat1Label: string;
  stat2Number: string;
  stat2Label: string;
  stat3Number: string;
  stat3Label: string;
  showServices: boolean;
  showGallery: boolean;
}

export interface CompanySettingsData {
  companyName: string;
  legalName: string;
  tagline: string;
  establishmentYear: number;
  iecCode: string;
  gstin: string;
  facilityImage: string;
  facilityBadge: string;
  heritageStory: string;
  missionQuote: string;
  registeredAddress: string;
  processingFacilityAddress: string;
  annualExportCapacity: string;
  destinationsCovered: string;
}

export interface KeyPersonItem {
  id: string;
  name: string;
  role: string;
  bio: string;
  contactEmail: string;
  phone?: string;
  image: string;
  experience?: string;
  enabled: boolean;
}

export interface WholesaleServiceItem {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  enabled: boolean;
}

export interface FAQItemData {
  id: string;
  category: "Shipping & Ports" | "Quality & Testing" | "Payments & Contracts" | "Packaging & Samples" | string;
  question: string;
  answer: string;
  enabled: boolean;
}

// ── Default Content ──────────────────────────────────────────────────────────

export const DEFAULT_HOME_SETTINGS: HomePageSettings = {
  heroTagline: "Aryavansh Global · Pure Indian Spices Direct from Source",
  heroTitle: "Premium Indian Spices, Direct from Farm to Global Seaports",
  heroSubtitle:
    "We supply certified whole and ground spices to overseas food manufacturers, wholesale distributors, and supermarket brands worldwide.",
  heroBadge: "Government Registered Spice Exporter · Odisha, India",
  heroOverlayOpacity: 35, // High transparency: vibrant spice background clearly visible
  stat1Number: "30+",
  stat1Label: "Countries Exported",
  stat2Number: "100%",
  stat2Label: "Lab Tested Batches",
  stat3Number: "5,000+",
  stat3Label: "MT Annual Capacity",
  showServices: true,
  showGallery: true,
};

export const DEFAULT_COMPANY_SETTINGS: CompanySettingsData = {
  companyName: "A.G IMPORT & EXPORT",
  legalName: "Aryavansh Global Import & Export",
  tagline: "Connecting India's Purest Spices to the World",
  establishmentYear: 2018,
  iecCode: "0819283741",
  gstin: "21AAACA1234A1Z5",
  facilityImage:
    "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=85",
  facilityBadge: "Central Processing Hub & Modern Export Warehouse · Odisha, India",
  heritageStory:
    "Founded with a commitment to uncompromised spice purity, A.G IMPORT & EXPORT bridges traditional Indian farming communities with international buyers across the globe. Headquartered in Odisha, we specialize in single-origin turmeric, aromatic ginger, Tellicherry black peppercorns, and high-altitude cardamom. Our state-of-the-art grading, optical sorting, and mechanical cleaning facility ensures that every consignment meets strict global moisture, microbial, and food safety standards.",
  missionQuote:
    "Our mission is simple: provide foreign buyers with authentic, pesticide-free Indian spices with transparent pricing, certified laboratory test reports, and reliable container shipping schedules.",
  registeredAddress:
    "Trade Office: Janpath Commercial Complex, Janpath, Bhubaneswar, Odisha - 751001, India",
  processingFacilityAddress:
    "Export Processing & Warehousing Hub: Industrial Estate, Khordha / Paradip Corridor, Odisha, India",
  annualExportCapacity: "5,000+ Metric Tonnes",
  destinationsCovered: "30+ Countries across Europe, North America, Middle East & ASEAN",
};

export const DEFAULT_KEY_PEOPLE: KeyPersonItem[] = [
  {
    id: "kp-1",
    name: "Rajesh Mohanty",
    role: "Managing Director & Head of International Trade",
    bio: "Over 18 years of experience in agricultural commodity procurement, international trade law, Incoterms, and ocean freight logistics.",
    contactEmail: "rajesh@indianspiceexport.com",
    phone: "+91 94370 00000",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    experience: "18+ Years in Spice Export",
    enabled: true,
  },
  {
    id: "kp-2",
    name: "Dr. Ananya Patnaik",
    role: "Director of Quality Assurance & Laboratory Testing",
    bio: "PhD in Food Technology. Former technical auditor for Spices Board India. Oversees moisture testing, volatile oil analysis, and Eurofins/SGS assays.",
    contactEmail: "quality@indianspiceexport.com",
    phone: "+91 674 2500001",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
    experience: "14+ Years in Food Safety & Microbiology",
    enabled: true,
  },
  {
    id: "kp-3",
    name: "Suresh Nayak",
    role: "Director of Farmer Relations & Sourcing",
    bio: "Deep agricultural roots in Kandhamal and Koraput. Manages direct farmer contracts with 1,200+ tribal growers for GI-tagged organic turmeric and ginger.",
    contactEmail: "sourcing@indianspiceexport.com",
    phone: "+91 94370 00002",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
    experience: "20+ Years in Agricultural Sourcing",
    enabled: true,
  },
];

export const DEFAULT_SERVICES_LIST: WholesaleServiceItem[] = MOCK_WHOLESALE_SERVICES.map((s) => ({
  id: s.id,
  number: s.number,
  title: s.title,
  subtitle: s.subtitle,
  description: s.description,
  features: s.features,
  enabled: true,
}));

export const DEFAULT_FAQS_LIST: FAQItemData[] = [
  {
    id: "faq-1",
    category: "Shipping & Ports",
    question: "Which Indian seaports do you ship spice containers from?",
    answer:
      "Our primary maritime dispatch gateways are Paradip Port and Kolkata Port for Odisha turmeric and ginger; Visakhapatnam and Chennai for southern and central lots; and Cochin Port for Malabar black pepper and cardamom. We support FOB, CFR, and CIF Incoterms 2020.",
    enabled: true,
  },
  {
    id: "faq-2",
    category: "Quality & Testing",
    question: "Do you provide independent laboratory test certificates with each shipment?",
    answer:
      "Yes. Every commercial batch is tested in NABL-accredited and internationally recognized laboratories (such as SGS, Eurofins, or Spices Board QEL) for moisture percentage, curcumin content, volatile essential oil, pesticide residues, and microbial counts.",
    enabled: true,
  },
  {
    id: "faq-3",
    category: "Packaging & Samples",
    question: "Can overseas buyers request commercial evaluation samples before placing an order?",
    answer:
      "Yes. We send sealed pre-shipment evaluation samples (250g to 1kg) worldwide via DHL or FedEx air courier, accompanied by an in-house Certificate of Analysis (COA) so your QA team can inspect aroma, color, and moisture.",
    enabled: true,
  },
  {
    id: "faq-4",
    category: "Packaging & Samples",
    question: "What bulk packaging options are available for wholesale orders?",
    answer:
      "We provide 25kg, 40kg, and 50kg multi-layer food-grade kraft paper bags, PP woven sacks with internal poly-liners, and traditional jute bags. We also support customized buyer private labeling and carton packaging upon agreement.",
    enabled: true,
  },
  {
    id: "faq-5",
    category: "Payments & Contracts",
    question: "What payment instruments do you accept for international spice exports?",
    answer:
      "We accept Irrevocable Letter of Credit at sight (L/C at Sight) issued by prime international banks, as well as T/T (Telegraphic Wire Transfer) with customary commercial advance and balance against shipping documents (Bill of Lading, Invoice, Packing List).",
    enabled: true,
  },
  {
    id: "faq-6",
    category: "Shipping & Ports",
    question: "What official export documents accompany each container shipment?",
    answer:
      "Every shipment includes: Commercial Invoice, Packing List, Full Set Clean on Board Ocean Bill of Lading, Certificate of Origin (COO), Government Phytosanitary Certificate, Spices Board of India Certificate, Certificate of Analysis (COA), and Fumigation Certificate.",
    enabled: true,
  },
];

// ── Storage Helpers ──────────────────────────────────────────────────────────

export function getStoredHomeSettings(): HomePageSettings {
  try {
    const raw = localStorage.getItem("site_home_settings");
    if (raw) return { ...DEFAULT_HOME_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    console.warn("Could not read home settings:", e);
  }
  return DEFAULT_HOME_SETTINGS;
}

export function saveStoredHomeSettings(data: Partial<HomePageSettings>): void {
  try {
    const current = getStoredHomeSettings();
    const updated = { ...current, ...data };
    localStorage.setItem("site_home_settings", JSON.stringify(updated));
    window.dispatchEvent(new Event("home-settings-updated"));
  } catch (e) {
    console.warn("Could not save home settings:", e);
  }
}

export function getStoredCompanySettings(): CompanySettingsData {
  try {
    const raw = localStorage.getItem("site_company_settings");
    if (raw) return { ...DEFAULT_COMPANY_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    console.warn("Could not read company settings:", e);
  }
  return DEFAULT_COMPANY_SETTINGS;
}

export function saveStoredCompanySettings(data: Partial<CompanySettingsData>): void {
  try {
    const current = getStoredCompanySettings();
    const updated = { ...current, ...data };
    localStorage.setItem("site_company_settings", JSON.stringify(updated));
    window.dispatchEvent(new Event("company-settings-updated"));
  } catch (e) {
    console.warn("Could not save company settings:", e);
  }
}

export function getStoredKeyPeople(): KeyPersonItem[] {
  try {
    const raw = localStorage.getItem("site_key_people");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn("Could not read key people:", e);
  }
  return DEFAULT_KEY_PEOPLE;
}

export function saveStoredKeyPeople(people: KeyPersonItem[]): void {
  try {
    localStorage.setItem("site_key_people", JSON.stringify(people));
    window.dispatchEvent(new Event("key-people-updated"));
  } catch (e) {
    console.warn("Could not save key people:", e);
  }
}

export function getStoredServices(): WholesaleServiceItem[] {
  try {
    const raw = localStorage.getItem("site_services_list");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn("Could not read services list:", e);
  }
  return DEFAULT_SERVICES_LIST;
}

export function saveStoredServices(services: WholesaleServiceItem[]): void {
  try {
    localStorage.setItem("site_services_list", JSON.stringify(services));
    window.dispatchEvent(new Event("services-updated"));
  } catch (e) {
    console.warn("Could not save services list:", e);
  }
}

export function getStoredFAQs(): FAQItemData[] {
  try {
    const raw = localStorage.getItem("site_faqs_list");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn("Could not read FAQs list:", e);
  }
  return DEFAULT_FAQS_LIST;
}

export function saveStoredFAQs(faqs: FAQItemData[]): void {
  try {
    localStorage.setItem("site_faqs_list", JSON.stringify(faqs));
    window.dispatchEvent(new Event("faqs-updated"));
  } catch (e) {
    console.warn("Could not save FAQs list:", e);
  }
}

