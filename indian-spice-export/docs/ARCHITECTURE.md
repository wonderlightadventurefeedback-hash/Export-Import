# System Architecture & Monorepo Overview

**Indian Spice Export** is an enterprise-grade B2B digital export platform engineered to connect global wholesale spice importers, distributors, retail chains, and food blenders directly with certified Indian spice growers and processors.

---

## 1. Monorepo Structure

```
indian-spice-export/
├── package.json               # Root monorepo workspace configuration
├── package-lock.json
├── database/
│   └── migrations/
│       └── 001_initial_schema.sql  # Comprehensive PostgreSQL & Supabase RLS schema
├── backend/                   # Node.js + Express 5 + TypeScript API Server
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── app.ts             # Express app setup, CORS, rate limits, error handling
│       ├── server.ts          # Server entrypoint listening on port 5000
│       ├── middleware/
│       │   ├── auth.ts        # JWT verification against admin_users table
│       │   ├── roles.ts       # RBAC guards (Owner, Editor, Sales, Viewer)
│       │   ├── rateLimiter.ts # Express-rate-limit protection
│       │   └── requestLogger.ts # Structured audit & access logging
│       ├── routes/
│       │   ├── index.ts       # Main router mounting /public and /admin
│       │   ├── products.ts    # Public product catalog
│       │   ├── categories.ts  # Public categories
│       │   ├── enquiries.ts   # Public quote inquiry submission
│       │   ├── publicData.ts  # Public company profile, navigation, theme
│       │   └── admin/         # Authenticated admin routes
│       │       ├── auth.ts        # Admin login, me, session check
│       │       ├── products.ts    # Product CRUD, bulk actions, CSV export
│       │       ├── categories.ts  # Category management
│       │       ├── enquiries.ts   # Inquiry pipeline, comments, staff assign
│       │       ├── quotations.ts  # Proforma quotations, pricing, printable PDF
│       │       ├── suppliers.ts   # Confidential internal grower registry
│       │       ├── content.ts     # Site builder sections, revisions
│       │       ├── media.ts       # Multer file upload & media asset manager
│       │       ├── settings.ts    # Company settings & certifications
│       │       ├── navigation.ts  # Header & footer menus
│       │       ├── theme.ts       # Brand design tokens & motion settings
│       │       ├── seo.ts         # Meta titles, OG cards, sitemap generator
│       │       ├── templates.ts   # Email & WhatsApp templates + test send
│       │       ├── users.ts       # Admin staff accounts & roles (Owner only)
│       │       ├── audit.ts       # Security audit log & CSV export (Owner only)
│       │       └── buyers.ts      # CRM-lite importer contact records
│       └── services/
│           ├── supabase.ts    # Supabase service role client + mock in-memory DB
│           ├── email.ts       # Transactional email notification service
│           └── whatsapp.ts    # WhatsApp click-to-chat generator & templates
├── frontend/                  # React 18 + Vite + Tailwind CSS + Framer Motion
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── index.html             # HTML shell with Organization JSON-LD & OpenGraph
│   ├── public/
│   │   ├── favicon.svg        # Brand botanical leaf icon
│   │   ├── robots.txt         # Search crawler rules (admin disallowed)
│   │   └── sitemap.xml        # Static canonical sitemap
│   └── src/
│       ├── App.tsx            # Main router with lazy-loaded admin bundle
│       ├── index.css          # Tailwind theme, typography scales, kenburns keyframes
│       ├── components/
│       │   ├── layout/        # Navbar, Footer, MobileMenu, Layout, Floating CTAs
│       │   ├── ui/            # Button (magnetic), Container, Section, Preloader, Cards
│       │   └── admin/         # AdminLayout, CommandPalette (Ctrl+K), Nav items
│       ├── context/
│       │   ├── AdminAuthContext.tsx  # Admin authentication state & idle timeout
│       │   └── AdminThemeContext.tsx # Light/dark mode, table density, sidebar state
│       ├── motion/            # Editorial easing curves & Framer Motion variants
│       ├── pages/
│       │   ├── Home/          # 11-section editorial landing page
│       │   ├── About/         # Sourcing heritage & grower transparency
│       │   ├── Products/      # Filterable catalog with search, forms, pagination
│       │   ├── ProductDetail/ # Detailed product specifications, grades, packaging
│       │   ├── Services/      # Private labeling, milling, lab testing, custom packaging
│       │   ├── ExportProcess/ # 6-stage end-to-end export workflow
│       │   ├── Contact/       # Export desk direct contact form
│       │   ├── RequestQuote/  # 4-step RFQ multi-commodity submission
│       │   ├── PrivacyPolicy/ # Statutory GDPR & international privacy disclosure
│       │   ├── Terms/         # ICC Incoterms 2020 & export sales terms
│       │   ├── DesignSystem/  # Brand token visual testing showcase
│       │   ├── NotFound/      # Editorial 404 page
│       │   └── Admin/         # 18 modules inside isolated lazy-loaded chunk
│       └── services/
│           ├── api.ts         # Public storefront API client with offline fallback
│           ├── adminApi.ts    # Control Room typed API client
│           └── mock.ts        # Comprehensive mock dataset for development
└── docs/                      # Technical and operational manuals
```

---

## 2. Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | React 18, TypeScript, Vite 6 |
| **Styling & Design System** | Tailwind CSS v4, Custom CSS Variables, Lucide Icons |
| **Animation Engine** | Framer Motion, Custom CSS Keyframes (`@keyframes kenburns`), Desktop Magnetic Physics |
| **Rich Text & Editor** | `@tiptap/react`, `@tiptap/starter-kit` |
| **Drag & Drop** | `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` |
| **Data Visualization** | `recharts` (Responsive Container, BarChart, PieChart) |
| **Color Picker** | `react-colorful` (HexColorPicker) |
| **Backend Framework** | Node.js, Express 5, TypeScript |
| **Database & Identity** | PostgreSQL, Supabase Auth, Row-Level Security (RLS) |
| **Security & Auditing** | JWT verification, Rate Limiting, Idempotency Keys, Audit Trails |
| **Data Validation** | Zod v3 |

---

## 3. Architectural Highlights

1. **Decoupled Chunks & Lazy Loading**:
   - The public storefront bundle (`~480 kB`) and Admin Control Room bundle (`~658 kB`) are separated using dynamic `React.lazy()` imports.
   - Public users downloading the homepage never download admin dependencies (Tiptap, DndKit, Recharts, ReactColorful).
2. **Offline-Resilient Fallback**:
   - All public endpoints (`/api/products`, `/api/categories`, `/api/enquiries`) utilize `publicApi` which queries `VITE_API_BASE_URL` and seamlessly falls back to pre-seeded, verified GI product data if backend connectivity is interrupted.
3. **Strict Confidentiality Wall**:
   - The `suppliers` table and individual grower contacts are strictly internal and inaccessible to public endpoints. Only authenticated admin staff can view supplier details.
4. **Idempotent Inquiries**:
   - The inquiry submission engine enforces idempotency via `X-Idempotency-Key` headers, guarding against accidental double-clicks or duplicate submissions.
