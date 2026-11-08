export interface CertificateItem {
  id: string;
  title: string;
  category: "Export License" | "Food Safety" | "Membership & Chamber" | "Quality Assurance" | string;
  authority: string;
  regNo: string;
  validTill: string;
  enabled: boolean;
  imageUrl: string;
  description?: string;
  isMembership?: boolean;
}

export const DEFAULT_CERTIFICATES: CertificateItem[] = [
  {
    id: "cert-spices-board",
    title: "Spices Board of India (CRES)",
    category: "Export License",
    authority: "Ministry of Commerce & Industry, Govt of India",
    regNo: "SB/EXP/2024/78219",
    validTill: "2028-12-31",
    enabled: true,
    imageUrl: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=85",
    description: "Official Certificate of Registration as an Exporter of Spices (CRES) covering whole and ground spice commodities.",
  },
  {
    id: "cert-apeda",
    title: "APEDA Registration & RCMC",
    category: "Export License",
    authority: "Agricultural & Processed Food Products Export Development Authority",
    regNo: "APEDA/RCMC/2023/1820",
    validTill: "2027-06-30",
    enabled: true,
    imageUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=85",
    description: "Registration-cum-Membership Certificate authorizing primary agricultural and processed food export compliance.",
  },
  {
    id: "cert-fssai",
    title: "FSSAI Central Food Safety License",
    category: "Food Safety",
    authority: "Food Safety and Standards Authority of India",
    regNo: "10020031002341",
    validTill: "2029-03-31",
    enabled: true,
    imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=85",
    description: "Central statutory license for hygienic handling, mechanized grading, warehouse storage, and overseas dispatch.",
  },
  {
    id: "cert-fieo",
    title: "FIEO Premier Export Membership",
    category: "Membership & Chamber",
    authority: "Federation of Indian Export Organisations (Govt. of India)",
    regNo: "FIEO/MEM/2024/4910",
    validTill: "2027-12-31",
    enabled: true,
    imageUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=85",
    description: "Apex government-recognized trade membership credential certifying legitimate international merchant standing.",
    isMembership: true,
  },
  {
    id: "cert-iso",
    title: "ISO 22000:2018 Certified FSMS",
    category: "Quality Assurance",
    authority: "International Organization for Standardization",
    regNo: "ISO-FSMS-IN-9082",
    validTill: "2027-09-30",
    enabled: true,
    imageUrl: "https://images.unsplash.com/photo-1589330694653-dad6d3240a2b?auto=format&fit=crop&w=1200&q=85",
    description: "Global Food Safety Management System covering microbial testing, moisture controls, and fumigation standards.",
  },
  {
    id: "cert-us-fda",
    title: "US FDA Food Facility Registration",
    category: "Export License",
    authority: "U.S. Food & Drug Administration (FDA)",
    regNo: "FDA-REG-19840291",
    validTill: "2026-12-31",
    enabled: true,
    imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=85",
    description: "Foreign Food Facility Registration compliant with U.S. FSMA (Food Safety Modernization Act) rules.",
  },
  {
    id: "cert-chamber",
    title: "Chamber of Commerce & Industry Membership",
    category: "Membership & Chamber",
    authority: "Utkal Chamber of Commerce & Industry (UCCI)",
    regNo: "UCCI/MEM/2023/1104",
    validTill: "2028-03-31",
    enabled: true,
    imageUrl: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=85",
    description: "Active corporate membership validating regional industrial trade representation in Eastern India.",
    isMembership: true,
  },
  {
    id: "cert-halal",
    title: "Halal India Export Certification",
    category: "Food Safety",
    authority: "Halal India Shariah Quality Board",
    regNo: "HI-EXP-88912",
    validTill: "2026-11-30",
    enabled: true,
    imageUrl: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=1200&q=85",
    description: "Certified pure vegetarian and 100% Halal-compliant processing protocols for Middle East & ASEAN export.",
  },
];

export const DEFAULT_COMPANY_ABOUT = {
  companyImage: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=85",
  companyBadge: "A.G IMPORT & EXPORT · Processing Hub & Export Warehouse",
  locationBadge: "Odisha, India",
  tagline: "Aryavansh Global · Connecting India's Purest Spices to the World",
  heading: "Rooted in Odisha's Fertile Highlands, Supplying Pure Spices to the World",
  quote: "India has traded spices across ancient oceans for centuries. We honor this heritage with modern lab testing, transparent pricing, and direct farmer partnerships.",
};

export function getStoredCertificates(): CertificateItem[] {
  try {
    const raw = localStorage.getItem("company_certificates_list");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Could not read stored certificates:", e);
  }
  return DEFAULT_CERTIFICATES;
}

export function saveStoredCertificates(certs: CertificateItem[]): void {
  try {
    localStorage.setItem("company_certificates_list", JSON.stringify(certs));
    window.dispatchEvent(new Event("certificates-updated"));
  } catch (e) {
    console.warn("Could not save certificates:", e);
  }
}

export function getStoredCompanyAbout() {
  try {
    const raw = localStorage.getItem("company_about_settings");
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_COMPANY_ABOUT, ...parsed };
    }
  } catch (e) {
    console.warn("Could not read stored company about:", e);
  }
  return DEFAULT_COMPANY_ABOUT;
}

export function saveStoredCompanyAbout(data: Partial<typeof DEFAULT_COMPANY_ABOUT>): void {
  try {
    const current = getStoredCompanyAbout();
    const updated = { ...current, ...data };
    localStorage.setItem("company_about_settings", JSON.stringify(updated));
    window.dispatchEvent(new Event("company-about-updated"));
  } catch (e) {
    console.warn("Could not save company about:", e);
  }
}

