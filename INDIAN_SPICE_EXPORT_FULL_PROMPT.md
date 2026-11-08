# INDIAN SPICE EXPORT
## COMPLETE BUILD PROMPT: PREMIUM B2B WEBSITE + SUPABASE BACKEND + FULL-CONTROL ADMIN PANEL + CINEMATIC MOTION

Act as a senior full-stack engineer, database architect, art director and conversion-focused B2B web designer. Your standard is the website of a world-class international trading house: calm, confident, editorial and trustworthy. It is not a template and not a generic startup landing page.

**Project setup rule:** First inspect the current folder. If an Indian Spice Export project already exists, continue it: inspect the whole repository, installed packages, components, backend routes and database files, understand them, and never delete working code. If the folder is empty, create a new project called `indian-spice-export` as described below. Build incrementally, verify each step, and never claim completion without running real tests.

---

# 1. BUSINESS CONTEXT

- Company: Indian Spice Export
- Tagline: The Essence of India. Delivered Worldwide.
- Location: Odisha, India
- Type: B2B spice export and import, wholesale and bulk, quotation-based pricing
- Sourcing: direct Indian farmers, spice manufacturers, verified wholesale suppliers
- Target customers: international importers, distributors, wholesalers, supermarkets, restaurants, food manufacturing companies
- Target markets: worldwide
- Channels: website enquiries, WhatsApp, business email

## Truthfulness rules (strict)
Never invent: address, phone, email, registrations (IEC, FSSAI, GST, Spice Board), certifications, export history, customers, testimonials, statistics ("500+ clients", "20 years"), prices, grades, MOQ, capacity, origin claims or awards.
- Unknown facts are editable placeholders (e.g. `[BUSINESS EMAIL]`) stored in company settings (database) with a code fallback in `frontend/src/config/company.ts`.
- Trust sections (numbers, badges, certifications) are data-driven and hidden or shown as "To be confirmed" until real data is entered. Never fill them with fake proof.
- Marketing copy describes the business model and process, not unverifiable achievements.
- Never display invented prices, grades, certifications or MOQ values. Show only available, verified product information; otherwise "Available on request".

---

# 2. TECHNOLOGY

Monorepo:
- `frontend/`: React 19, Vite, TypeScript (strict), Tailwind CSS v4, React Router, Lucide React, Motion
- `backend/`: Node.js, Express.js, TypeScript
- `database/migrations/`: SQL migrations
- `docs/`: ARCHITECTURE.md, DATABASE.md, API.md, ASSETS.md, DESIGN.md, ADMIN_GUIDE.md, TESTING.md

Database: Supabase PostgreSQL, Supabase Storage, Supabase Auth (admin authentication). Do not introduce another database.

---

# 3. ART DIRECTION: "QUIET LUXURY, SPICE-ROUTE HERITAGE"

**Concept:** an editorial trade journal meets a private importer's showroom. Warm, tactile, unhurried, like opening a hand-stitched sack of premium golden turmeric in a quiet, well-lit warehouse.

**Do:** large confident serif typography, asymmetric editorial layouts, generous whitespace, thin gold hairlines, deep forest-green sections alternating with warm ivory, subtle paper/grain texture, full-bleed photography, small-caps eyebrow labels, numbered sections.
**Don't:** purple/blue gradients, glassmorphism, emoji icons, repetitive 3-column icon grids, cluttered badges, bouncing animations, centred-everything layouts, fake metrics.

## 3.1 Colour tokens (Tailwind v4 `@theme`, also overridable from admin)
- Forest Green #183D2C (primary) with tints forest-800/700/600 and a deeper forest-950 for footers
- Spice Gold #C49A45 (accent) with gold-300/400/600
- Warm Ivory #F6F1E7 (base background) with a slightly deeper ivory-200
- Terracotta #9B452E (rare accent, about 3% of any screen)
- Charcoal #292B25 (body text)

Rules: ivory is the default page background; forest for hero overlays, feature bands and footer; gold only for accents (hairlines, eyebrow text, outlines, icons), never large flat fills behind text. All text meets WCAG AA (use darker gold-600 for small gold text).

## 3.2 Typography
- Headings: **Playfair Display** (400/500/600, italic for emphasis words). Body/UI: **Inter**.
- Fluid scale with `clamp()`: Display clamp(2.75rem, 6vw + 1rem, 5.5rem) line-height 1.02 tracking -0.02em; H1 clamp(2.25rem, 4vw + 1rem, 4rem); H2 clamp(1.875rem, 2.5vw + 1rem, 3rem); H3 1.5rem; body 1.0625rem/1.7; small 0.875rem.
- Eyebrow: Inter 0.75rem uppercase, letter-spacing 0.22em, gold-600, preceded by a 32px gold hairline.
- Max text measure 65ch. One italic Playfair emphasis word per hero/section heading (e.g. "Delivered *Worldwide*.").
- Preload fonts, `font-display: swap`.

## 3.3 Layout and shape
- 12-column grid, container max 1280px, gutters 20px mobile / 40px desktop; 8px spacing system; section padding py-20 mobile / py-32 desktop.
- Small radius (2-4px) for an architectural look; borderless cards with 1px hairlines and soft shadows only on hover.
- Subtle SVG noise/paper texture on ivory sections (<4% opacity); thin gold dividers with a small leaf/diamond ornament between major sections.

## 3.4 Imagery
- Direction: macro spice textures, hands scooping spices, sacks and burlap, wooden bowls, warm natural light, green foliage, consistent warm grade.
- Never hotlink or scrape copyrighted images. Use free-licence (Unsplash/Pexels/CC0) images downloaded locally with attribution recorded in `docs/ASSETS.md`, or tasteful gradient/SVG placeholders with alt text. `ASSETS.md` lists every image slot with target size, aspect ratio and subject so real photography can be dropped in.
- Every image: explicit width/height, lazy loading (except hero), WebP/AVIF-ready, descriptive alt text.
- Do not present AI-generated or stock images as the company's own facilities or stock.

---

# 4. DESIGN SYSTEM COMPONENTS

Reusable kit in `frontend/src/components/ui/` with a dev-only `/design` route (excluded from production):
Button (primary forest, gold-outline, ghost, WhatsApp variant; sizes; loading/disabled), Container, Section (tone: ivory | forest | ivory-deep), Eyebrow, SectionHeading, Card, ProductCard, CategoryTile, ProcessStep, FeatureItem, Stat (data-driven, hidden if no data), Accordion, Breadcrumbs, PageHero, CTABand, form fields (Input, Select, Textarea, Checkbox with label, hint, error), Badge, Divider, Toast/Alert, Skeleton, Pagination.
All keyboard accessible, visible 2px gold focus ring, correct ARIA, responsive.

---

# 5. PUBLIC WEBSITE

Routes: `/` Home, `/about`, `/products`, `/products/:slug`, `/services`, `/export-process`, `/contact`, `/request-quote`, `/privacy-policy`, `/terms`, 404.

## 5.1 Global
- **Navigation:** transparent over hero, becomes ivory with hairline and slight blur after 40px scroll; hides on scroll down, reappears on scroll up. Wordmark "INDIAN SPICE EXPORT" in Playfair with an original SVG leaf/spice-route mark. Links: Home, About, Products, Services, Export Process, Contact; primary button "Request a Quote". Mobile: full-screen forest menu with large serif links and staggered reveal. Menu items editable from admin.
- **Floating WhatsApp button** (hidden if number not configured) and a mobile sticky "Request a Quote" bar.
- **Footer:** forest-950, four columns (brand and tagline, company links, product categories, contact from settings), gold hairline, legal links, "Odisha, India", current-year copyright. Contact values appear only if configured.

## 5.2 Home (this order)
1. **Hero:** 100svh full-bleed spice photography with forest gradient overlay. Eyebrow "Odisha, India · B2B Spice Export". H1 "The Essence of India. Delivered *Worldwide*." Supporting text: "Connecting authentic Indian spices with international wholesale markets through trusted sourcing and quality-focused supply." CTAs: "Request a Quote" (primary), "Explore Spices" (outline). Slim strip: Importers · Distributors · Wholesalers · Supermarkets · Restaurants · Food Manufacturers.
2. **Company introduction:** asymmetric editorial two-column, large serif pull-statement, offset overlapping image, "About us" link.
3. **Featured spice categories:** 8 tall image tiles in an asymmetric/bento grid (Turmeric, Red Chilli, Black Pepper, Green Cardamom, Cumin Seeds, Coriander Seeds, Cinnamon, Cloves), loaded from the database.
4. **Indian sourcing network:** forest section with a simple stylised SVG map of India, Odisha subtly marked, abstract connection lines. No claims about specific sourcing regions unless configured.
5. **Farmer and manufacturer sourcing:** split layout, three pillars (Direct from farmers, Manufacturers, Verified wholesale suppliers) described as sourcing channels, not achievements.
6. **Wholesale services:** numbered list (Bulk supply, Custom packaging enquiries, Private-label enquiries, Export documentation support), phrased as "enquire about".
7. **Export process:** Enquiry, Requirement review, Quotation, Sample and confirmation, Order and packing, Shipment and documentation, Delivery.
8. **Why choose us:** editorial 2x2 with large numerals; claims limited to process promises (quotation-based pricing, direct communication via WhatsApp and email, quality-focused sourcing).
9. **Trust/credentials slot:** data-driven; renders nothing until populated.
10. **International enquiry CTA:** forest band, "Planning an import? Tell us what you need.", Request a Quote + WhatsApp buttons.
11. Footer.

## 5.3 Products (database-driven)
- PageHero with breadcrumbs; sticky filter bar (search, category chips, whole/powder form filter), result count, pagination.
- ProductCard: image, category eyebrow, name, one-line description, "Request Quote" and WhatsApp buttons. Skeleton loading, empty and error states.
- Product data: name, slug, description, category, origin, state and district, whole/powdered form, available grades, specifications, packaging options, minimum order quantity, photographs, publication status. Initial categories: Turmeric, Red Chilli, Black Pepper, Green Cardamom, Cumin Seeds, Coriander Seeds, Cinnamon, Cloves.
- Sample products are clearly labelled sample data, kept separate from real records. Supplier information is never exposed through public APIs.

## 5.4 Product detail `/products/:slug`
Gallery, H1 name, category, description, specification table (rows only if data exists, else "Available on request"), packaging options (same rule), sticky panel with "Request a Quote for this product" (pre-fills the quote form) and a product-specific WhatsApp button, related products.

## 5.5 About, Services, Export Process
Editorial long-form: pull quotes, numbered sections, process diagrams, FAQ accordion. Honest generic copy, all editable from admin.

## 5.6 Contact
Form (name, company, email, phone/WhatsApp, country, message) posting to `POST /api/contact`, plus a contact details block from settings and a WhatsApp button.

## 5.7 Request a Quote
Multi-step form with progress indicator: 1 Your details, 2 Products (add multiple rows: product, quantity, unit [kg, MT, other], preferred grade, packaging), 3 Shipping (country, city, destination port), 4 Message and review. Fields: full name, company name, business email, phone/WhatsApp, country, city, buyer type, selected products, required quantities, unit, preferred grade, packaging requirements, destination port, message. Multiple products per enquiry; client and server validation; duplicate-submission prevention (disable button, idempotency key); the success screen shows the real enquiry reference only after the backend confirms insertion. No frontend-only fake success.

## 5.8 Legal pages
Privacy Policy and Terms & Conditions with table of contents, editable in admin, clearly marked as templates needing review by a qualified legal professional.

---

# 6. SUPPLIER AND SOURCING DATA (internal only)

Supplier types: Farmer, Manufacturer, Wholesaler, Other approved supplier.
Fields: unique supplier ID, supplier type, business/farm name, contact person, phone, email, state, district, address, verification status, internal notes.
`product_suppliers` relationship table: one product has many suppliers, one supplier supplies many products. Never exposed through public APIs or public RLS.

---

# 7. SUPABASE DATABASE

SQL migrations in `database/migrations/`, safe to apply to an existing database (use `IF NOT EXISTS`, additive changes, never silently reset or drop production data). Tables:
1 admin_users, 2 product_categories, 3 products, 4 product_images, 5 product_variants, 6 product_packaging, 7 suppliers, 8 product_suppliers, 9 buyers, 10 enquiries, 11 enquiry_items, 12 quotations, 13 quotation_items, 14 services, 15 website_content, 16 company_settings, 17 audit_logs,
plus for the admin panel: content_revisions, media_assets, navigation_items, theme_settings, redirects, email_templates, roles/permissions, enquiry_notes.

Use UUID primary keys, foreign keys, indexes, unique slugs, check constraints, valid status constraints, created_at/updated_at (with trigger), referential integrity, soft-delete columns where needed.
Enquiry references: `ISE-YYYY-00001` (sequence-based, unique, generated server-side, concurrency-safe).
Enquiry statuses: New, Reviewing, Quoted, Negotiating, Accepted, Rejected, Closed.
Seed data only for clearly labelled sample categories/products, kept in a separate seed file. Never create fake customers or suppliers.

---

# 8. SECURITY

- Row Level Security on every applicable table.
- Public: read published products, published categories, active services, public website content. No access to buyers, suppliers, enquiries, quotations, audit logs, settings marked private.
- Admin: manage products, categories, suppliers, enquiries, quotations, website content, settings; view audit logs, subject to role.
- Supabase Auth for admin login (optional TOTP 2FA). No public sign-up; admin users provisioned through a secure invite flow or owner-run CLI seed script.
- Service-role key only in backend environment variables; never in frontend code or any `VITE_` variable.
- Express middleware on every privileged endpoint: verify JWT, confirm user exists and is active in `admin_users`, check role permission.
- Public enquiry/contact submission goes only through the backend, with zod validation, rate limiting, honeypot field and length limits.
- helmet, CORS limited to `FRONTEND_URL`, login rate limiting, auto logout on idle, no internal DB errors leaked, sanitised rich text (prevent XSS), safe file uploads.
- Audit log for every admin create/update/delete (who, what, before/after, time, IP).

---

# 9. BACKEND API

Public:
- `GET /api/products` (search, category, form filters, pagination), `GET /api/products/:slug`
- `GET /api/categories`, `GET /api/services`
- `GET /api/content/:page` (published website content, navigation, theme, public company settings)
- `POST /api/enquiries`, `POST /api/contact`
- `GET /api/health`

Admin (`/api/admin/...`, authenticated and authorised): full CRUD for products, categories, product images, variants, packaging, suppliers, product_suppliers, buyers, enquiries (status, assignment, notes), quotations and items, services, website content and revisions (draft/publish/schedule/rollback), navigation, theme, media, company settings, redirects, email/WhatsApp templates, users and roles, audit logs, exports (CSV/JSON).

Consistent JSON envelope `{ success, data?, error?: { code, message }, meta?: { page, pageSize, total } }`; validation, central error handler, request logging, rate limiting, pagination.

---

# 10. STORAGE

Public buckets: `product-images`, `website-assets`. Private buckets: `company-documents`, `private-business-files` (signed URLs only, never public).
Upload validation for file type (allow-list by MIME and magic bytes) and size; image optimisation (WebP/AVIF thumbnails); storage access policies per bucket; no confidential documents publicly accessible.

---

# 11. COMMUNICATION

- **WhatsApp:** configurable number in company settings; helper builds `https://wa.me/<digits>?text=<encodeURIComponent>` for general and product-specific messages (templates with variables editable in admin); returns null and hides buttons when no number is configured. Unit tested.
- **Email:** backend email service via environment variables (provider API key); notify the business on every new enquiry; send a buyer confirmation when an email is provided; templates editable in admin. Never expose credentials.
- **Website:** show enquiry success/error messages and the real reference. Never claim an email or WhatsApp message was delivered unless that operation actually succeeded; if email fails, the enquiry is still stored and the user is told honestly.
- Placeholders for unknown business contact info.

---

# 12. ADMIN PANEL ("CONTROL ROOM") WITH FULL CONTROL

The owner must be able to change **everything** on the public site and in the admin panel without touching code. Nothing meant to be editable may be hard-coded.

## 12.1 Access and roles
Route `/admin` (separate lazy-loaded bundle, `noindex`, not linked publicly), login at `/admin/login`.
Roles: **Owner** (everything incl. users, settings, audit logs, backups), **Editor** (content, products, media), **Sales** (enquiries, quotations, buyers), **Viewer** (read-only). Permission matrix in the database and documented. Deletes are soft with Trash/Restore; destructive actions need confirmation. Content supports **Draft, Published, Scheduled** with **version history and one-click rollback**.

## 12.2 Modules (full create, read, update, delete)
1. **Dashboard:** new enquiries, enquiries by status, recent quotations, product count, quick actions. Real data only; empty states otherwise.
2. **Site Builder:** edit every section of every public page: text (rich text), images, buttons/links, show/hide, drag-and-drop reorder, duplicate, and add blocks from a library (text, image+text, gallery, FAQ, steps, CTA, stats, video).
3. **Live visual preview:** split-screen editor with desktop/tablet/mobile toggles showing draft content; Publish pushes live.
4. **Products and Categories:** all product fields, dynamic specification rows, multiple images (reorder, cover, alt text), SEO fields, featured flag, status, display order, bulk actions, CSV import/export.
5. **Services and Export Process:** edit steps, icons, order.
6. **Suppliers (internal only):** supplier CRUD, verification status, notes, product links.
7. **Enquiries inbox:** search, filters (status, country, date, buyer type), pagination, detail view with items, internal comments, assignment, status workflow, one-click WhatsApp/email reply, CSV export, realtime new-enquiry indicator.
8. **Quotations:** create from enquiry, line items, validity, terms, PDF export, status. Prices exist only here, entered by staff.
9. **Buyers (CRM-lite):** records, tags, notes, history.
10. **Media Library:** upload, rename, tag, replace, delete, folders, usage tracking, alt-text editor, validation, public/private separation.
11. **Navigation and Footer Manager.**
12. **Theme and Design Controls:** colours, fonts (Google Fonts picker), logo, favicon, radius, spacing, button style, and animation controls (global Off/Reduced/Standard/Cinematic, speed, intensity, per-section effect). Saved as CSS-variable design tokens with preview, reset and history.
13. **Company Settings:** name, tagline, address, phones, WhatsApp, business email, hours, social links, certifications/registrations (shown publicly only when filled and enabled), default units.
14. **SEO Manager:** per-page title, description, OG image, canonical, robots, structured data, sitemap regeneration, redirects.
15. **Legal Pages editor** with revision history and last-updated date.
16. **Email and WhatsApp Templates** with variables and a test-send button.
17. **Users and Roles (Owner):** invite, deactivate, change role, force password reset.
18. **Audit Log (Owner):** filterable, exportable, read-only.
19. **Backups and Export (Owner):** JSON/CSV export; documented restore procedure.
20. **Admin Preferences:** light/dark mode, sidebar layout, density, accent colour, dashboard widget order.

## 12.3 Admin UX
Same brand family as a calm tool UI: ivory/charcoal, forest sidebar, gold active state, dense readable tables, sticky headers, command palette (Cmd/Ctrl+K), Cmd/Ctrl+S save, unsaved-changes guard, inline validation, toasts, skeletons, optimistic updates with rollback. Responsive (enquiry handling must work on tablet and phone) and accessible.

## 12.4 Content model
Typed, versioned schema (`website_content`: page, section, block type, JSON payload, status, order, revision). The public site reads published content from the API; empty fields fall back to neutral defaults or hide the block.

---

# 13. CINEMATIC MOTION AND SCROLL SYSTEM

Use Motion (and native CSS scroll-driven animations where supported, with fallbacks). Build a central `motion/` module (variants, easing, hooks, presets) so effects are consistent and admin-tunable. Animate only `transform` and `opacity`, target 60fps. Honour `prefers-reduced-motion` and the admin global motion setting.

## 13.1 Foundations
- Easing `cubic-bezier(0.22, 1, 0.36, 1)` and `cubic-bezier(0.65, 0, 0.35, 1)`; durations 400-900ms; stagger 60-90ms.
- Optional inertial smooth scroll (admin toggle; off on touch and reduced-motion; must not break anchors or keyboard scrolling).
- Thin gold scroll-progress bar under the navbar.
- Route transitions: soft fade/slide with a forest-green curtain wipe (<600ms).
- Branded preloader (logo + gold line draw) once per session, skippable, never longer than ~1.2s.

## 13.2 Hero
Ken-Burns scale on background; headline reveals word by word with masks; eyebrow and CTAs stagger; mouse-parallax on layers (desktop); soft drifting spice-particle/grain layer (low density, paused offscreen); pulsing scroll cue; hero fades/darkens as you scroll away.

## 13.3 Scroll effects
- Reveal-on-scroll for every section (fade + rise, staggered), line-masked headings, gold hairlines drawing to full width.
- Parallax images at different speeds (intro, categories, CTA).
- Pinned sticky storytelling for the sourcing network (map lines draw, steps change with scroll).
- Horizontal scroll-driven export process on desktop (native swipe carousel on mobile), with a gold timeline line that fills on scroll.
- Number counters (only when real data exists).
- Clip-path image reveals on product and category images.
- Slow pause-on-hover marquee of buyer types/spice names.
- Smooth background colour transitions between ivory and forest sections.
- Back-to-top button with progress ring.

## 13.4 Interactions
Magnetic buttons (desktop), gold border sweep, animated link underlines, subtle 3D tilt (max 6deg) on product cards, optional custom cursor (admin toggle, native cursor kept), animated filter/search/pagination layout transitions (`AnimatePresence`, `layout`), floating labels, focus glow, small inline error shake, animated quote-form steps, success check only after a real confirmed submission, smooth accordion height, toast slide/fade, modal scale-fade, gallery crossfade/swipe/zoom.

## 13.5 Guard-rails
Lazy-load heavy effects; pause offscreen animation; at most one pinned effect visible at a time; content readable if animation fails; CLS near 0; auto performance mode on low-end devices (`hardwareConcurrency`, `deviceMemory`, `saveData`); global motion setting Off/Reduced/Standard/Cinematic stored in settings.

## 13.6 Admin motion
Subtle and fast (150-300ms): sidebar collapse, page fade, table row stagger, drawer/modal transitions, spring drag-and-drop reorder, save micro-feedback, skeletons, preview crossfade, animated charts from real data only.

---

# 14. SEO, PERFORMANCE, ACCESSIBILITY

- Per-page title, meta description, canonical, Open Graph and Twitter tags, `Organization` JSON-LD using only configured facts, sitemap.xml, robots.txt, favicon set (all editable in admin).
- Mobile Lighthouse targets: Performance 90+, Accessibility 100, Best Practices 95+, SEO 100. Route code-splitting, lazy images, preconnected/self-hosted fonts, no layout shift.
- Semantic landmarks, skip link, correct heading hierarchy, focus management on route change, labelled inputs, reduced-motion support.
- Responsive at 375, 768, 1024, 1280, 1536px with no horizontal scroll.

---

# 15. ENVIRONMENT VARIABLES

Frontend `.env.example`: `VITE_API_BASE_URL=`
Backend `.env.example`: `PORT=`, `NODE_ENV=`, `FRONTEND_URL=`, `SUPABASE_URL=`, `SUPABASE_ANON_KEY=`, `SUPABASE_SERVICE_ROLE_KEY=`, `SUPABASE_JWT_SECRET=`, `EMAIL_PROVIDER_API_KEY=`, `BUSINESS_EMAIL=`, `BUSINESS_WHATSAPP=`
Configure only variables actually needed. Never commit real credentials. Never put service-role keys or secrets in `VITE_` variables. Add `.gitignore`.

---

# 16. TESTING (real results only)

Test and report: all public routes; product search, filters and pagination; product detail pages and images; single and multi-product enquiries; required-field validation; country and quantity fields; WhatsApp links; contact form; API error handling (no DB errors leaked); database insertion (**verify submitted enquiries actually appear in Supabase**); duplicate-submission prevention; public access restrictions (anonymous cannot read private tables, supplier data never in public APIs); admin authentication; role enforcement (Viewer/Editor/Sales cannot reach Owner endpoints); CRUD for every admin module; content version rollback; storage permissions and upload validation; mobile responsiveness (screenshots at 375 and 1280px); reduced-motion behaviour; Lighthouse and axe results.
Tooling: strict TypeScript, ESLint, Prettier, Vitest (unit), API integration tests, Playwright (end-to-end). `dev`, `build`, `lint`, `test` scripts in both apps and at root. Do not use frontend-only fake success messages. Do not claim completion without running build, lint and tests.

---

# 17. BUILD ORDER (incremental, verify each step)

1. Inspect the folder/repository; decide how to proceed per the setup rule.
2. Monorepo scaffold, tokens, layout shell, design system, `/design` route.
3. Public pages with static content and mock data behind service modules.
4. Database migrations, RLS policies, storage buckets, sample seed data.
5. Backend: health, auth and admin middleware, roles, public API, enquiry and contact endpoints, validation, rate limiting, logging, error handling.
6. Connect the public site to the API (products, categories, services, content); real enquiry flow with reference, email and WhatsApp.
7. Admin shell, login, dashboard; then modules in order: Company Settings, Products and Categories, Media Library, Enquiries and Quotations, Site Builder with live preview, Navigation, Theme and Animation controls, SEO, Legal, Templates, Users and Roles, Audit Log, Backups.
8. Motion system across public site and admin.
9. SEO, accessibility and performance pass.
10. Full testing, fixes, documentation.

---

# 18. DELIVERABLES AND FINAL REPORT

Deliver: fully responsive premium public website, brand assets, database migrations, Supabase configuration, database-driven catalogue, supplier architecture, enquiry system, working Express API, WhatsApp and email integration, storage configuration, full-control admin panel, motion system, README, `docs/ARCHITECTURE.md`, `docs/DATABASE.md`, `docs/API.md`, `docs/ASSETS.md`, `docs/DESIGN.md`, `docs/ADMIN_GUIDE.md` (non-technical owner guide), `docs/TESTING.md` (testing report).

At completion report honestly:
- Features completed
- Features not completed
- Database migrations applied vs pending
- Environment variables still required
- Tests passed and failed (with real output)
- Known security issues
- Manual configuration required (create the first Owner, set Supabase keys, email provider, WhatsApp number, replace placeholders and sample data, supply real photography, legal review of policies)

Begin now by inspecting the current folder, then implement step by step.
