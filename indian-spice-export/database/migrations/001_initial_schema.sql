-- ============================================================================
-- INDIAN SPICE EXPORT - PRODUCTION DATABASE SCHEMA (POSTGRESQL / SUPABASE)
-- Initial Schema Migration: 001_initial_schema.sql
-- Conforms to Strict B2B Truthfulness, Supplier Privacy & RLS Policies
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Function for automatic updated_at timestamp maintenance
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- 1. ADMIN USERS & ACCESS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID UNIQUE, -- References supabase auth.users
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'Viewer' CHECK (role IN ('Owner', 'Editor', 'Sales', 'Viewer')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 2. PRODUCT CATEGORIES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS product_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  tagline VARCHAR(255),
  description TEXT,
  hero_image_url TEXT,
  featured_order INT DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 3. PRODUCTS (SPICE COMMODITIES)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES product_categories(id) ON DELETE SET NULL,
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  scientific_name VARCHAR(200),
  headline TEXT,
  description TEXT NOT NULL,
  detailed_description TEXT,
  available_forms TEXT[] NOT NULL DEFAULT '{"whole"}', -- 'whole', 'ground', 'crushed', 'coarse'
  origin_state VARCHAR(100) NOT NULL DEFAULT 'Odisha',
  sourcing_belt VARCHAR(255),
  harvest_season VARCHAR(100),
  specifications JSONB NOT NULL DEFAULT '{}'::jsonb,
  grades TEXT[] NOT NULL DEFAULT '{}',
  min_order_quantity VARCHAR(100) DEFAULT 'Available on request',
  is_featured BOOLEAN NOT NULL DEFAULT false,
  status VARCHAR(50) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 4. PRODUCT IMAGES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text VARCHAR(255) NOT NULL,
  caption TEXT,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 5. PRODUCT PACKAGING FORMATS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS product_packaging (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  package_type VARCHAR(150) NOT NULL, -- e.g. "Jute Bags", "Multiwall Paper Sacks"
  standard_sizes TEXT[] NOT NULL DEFAULT '{"25 kg", "50 kg"}',
  inner_liner VARCHAR(150),
  pallets_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 6. SUPPLIERS & SOURCING DATA (INTERNAL ONLY - STRICT PRIVACY)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_code VARCHAR(50) UNIQUE NOT NULL,
  supplier_type VARCHAR(50) NOT NULL CHECK (supplier_type IN ('Farmer', 'Manufacturer', 'Wholesaler', 'Other approved supplier')),
  business_or_farm_name VARCHAR(255) NOT NULL,
  contact_person VARCHAR(150),
  phone VARCHAR(50),
  email VARCHAR(255),
  state VARCHAR(100) NOT NULL DEFAULT 'Odisha',
  district VARCHAR(100),
  address TEXT,
  verification_status VARCHAR(50) NOT NULL DEFAULT 'Pending' CHECK (verification_status IN ('Pending', 'Verified', 'Suspended')),
  internal_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Many-to-Many Relationship: Products <-> Suppliers (Internal Only)
CREATE TABLE IF NOT EXISTS product_suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
  procurement_type VARCHAR(50) DEFAULT 'Direct Harvest',
  is_primary_supplier BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(product_id, supplier_id)
);

-- ----------------------------------------------------------------------------
-- 7. BUYERS (CRM-LITE)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS buyers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name VARCHAR(255) NOT NULL,
  contact_person VARCHAR(150) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone_whatsapp VARCHAR(100),
  country VARCHAR(100) NOT NULL,
  city VARCHAR(100),
  buyer_type VARCHAR(100) DEFAULT 'Importer',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 8. ENQUIRIES & SEQUENCED REFERENCE GENERATOR
-- ----------------------------------------------------------------------------
CREATE SEQUENCE IF NOT EXISTS enquiry_reference_seq START 1;

CREATE TABLE IF NOT EXISTS enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_no VARCHAR(50) UNIQUE NOT NULL, -- e.g. ISE-2026-00001
  buyer_id UUID REFERENCES buyers(id) ON DELETE SET NULL,
  representative_name VARCHAR(150) NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  business_email VARCHAR(255) NOT NULL,
  phone_whatsapp VARCHAR(100),
  country VARCHAR(100) NOT NULL,
  city VARCHAR(100),
  buyer_type VARCHAR(100) NOT NULL DEFAULT 'Importer',
  destination_port VARCHAR(150) NOT NULL,
  target_incoterm VARCHAR(50) DEFAULT 'CIF',
  estimated_shipment_schedule VARCHAR(100),
  special_requirements TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Reviewing', 'Quoted', 'Negotiating', 'Accepted', 'Rejected', 'Closed')),
  assigned_to UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  idempotency_key VARCHAR(100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Items inside each trade inquiry
CREATE TABLE IF NOT EXISTS enquiry_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enquiry_id UUID NOT NULL REFERENCES enquiries(id) ON DELETE CASCADE,
  product_name VARCHAR(200) NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  quantity NUMERIC(12, 3) NOT NULL,
  unit VARCHAR(50) NOT NULL DEFAULT 'MT (Metric Tonnes)',
  form VARCHAR(50) NOT NULL DEFAULT 'Whole',
  preferred_grade VARCHAR(100),
  packaging_preference VARCHAR(150),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 9. QUOTATIONS (PRICES EXIST ONLY HERE, ENTERED BY AUTHORIZED STAFF)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS quotations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quotation_no VARCHAR(50) UNIQUE NOT NULL, -- e.g. QTE-2026-00001
  enquiry_id UUID REFERENCES enquiries(id) ON DELETE SET NULL,
  buyer_id UUID REFERENCES buyers(id) ON DELETE SET NULL,
  currency VARCHAR(10) NOT NULL DEFAULT 'USD',
  incoterm VARCHAR(20) NOT NULL DEFAULT 'CIF',
  destination_port VARCHAR(150) NOT NULL,
  payment_terms TEXT NOT NULL DEFAULT 'Irrevocable L/C at sight or 30% advance deposit',
  valid_until DATE NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft', 'Sent', 'Accepted', 'Expired', 'Revised')),
  prepared_by UUID REFERENCES admin_users(id),
  subtotal NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
  insurance_and_freight NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
  total_amount NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
  terms_conditions TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS quotation_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quotation_id UUID NOT NULL REFERENCES quotations(id) ON DELETE CASCADE,
  product_name VARCHAR(200) NOT NULL,
  quantity NUMERIC(12, 3) NOT NULL,
  unit VARCHAR(50) NOT NULL,
  unit_price NUMERIC(14, 2) NOT NULL,
  total_price NUMERIC(14, 2) NOT NULL,
  packaging VARCHAR(150),
  specifications_summary TEXT
);

-- ----------------------------------------------------------------------------
-- 10. SERVICES & PROCESS STEPS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_number VARCHAR(10) NOT NULL,
  title VARCHAR(150) NOT NULL,
  subtitle VARCHAR(255),
  description TEXT NOT NULL,
  features TEXT[] DEFAULT '{}',
  display_order INT DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 11. COMPANY SETTINGS & TRUTHFULNESS STORAGE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS company_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(100) UNIQUE NOT NULL,
  value JSONB NOT NULL,
  is_public BOOLEAN NOT NULL DEFAULT true,
  description TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 12. WEBSITE CONTENT, BLOCKS & REVISIONS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS website_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_slug VARCHAR(100) NOT NULL,
  section_key VARCHAR(100) NOT NULL,
  block_type VARCHAR(100) NOT NULL,
  content_payload JSONB NOT NULL,
  display_order INT DEFAULT 0,
  status VARCHAR(50) NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'scheduled')),
  revision_number INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(page_slug, section_key, block_type, revision_number)
);

-- ----------------------------------------------------------------------------
-- 13. AUDIT LOGS (SECURITY & INTEGRITY)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES admin_users(id),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id UUID,
  before_state JSONB,
  after_state JSONB,
  ip_address VARCHAR(50),
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------------------------------
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_packaging ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE buyers ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiry_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Public Anonymous Reads: ONLY Published Products, Categories, Images, Services
CREATE POLICY "Public Read Published Products" ON products
  FOR SELECT USING (status = 'published');

CREATE POLICY "Public Read Published Categories" ON product_categories
  FOR SELECT USING (is_published = true);

CREATE POLICY "Public Read Product Images" ON product_images
  FOR SELECT USING (true);

CREATE POLICY "Public Read Services" ON services
  FOR SELECT USING (is_active = true);

-- Strict Access: Public cannot read suppliers or internal relationships
-- No public policies on suppliers, product_suppliers, buyers, quotations, or audit_logs!

-- ----------------------------------------------------------------------------
-- TRIGGERS FOR TIMESTAMPS
-- ----------------------------------------------------------------------------
CREATE TRIGGER trg_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_categories_updated_at BEFORE UPDATE ON product_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_suppliers_updated_at BEFORE UPDATE ON suppliers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_enquiries_updated_at BEFORE UPDATE ON enquiries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_quotations_updated_at BEFORE UPDATE ON quotations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
