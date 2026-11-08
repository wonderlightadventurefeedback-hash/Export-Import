# Indian Spice Export (B2B Trading Platform)

> "The Essence of India. Delivered Worldwide."

Premium B2B Indian spice export platform connecting authentic farmer collectives and verified processing manufacturers in Odisha and across India with international wholesale importers, distributors, supermarket chains, and food manufacturing enterprises.

---

## Architecture & Monorepo Structure

```
d:\export\indian-spice-export\
├── frontend/                     # React 19, Vite, TypeScript Strict, Tailwind CSS v4, Motion
│   ├── src/
│   │   ├── config/company.ts     # Central truthfulness rules & contact placeholders
│   │   ├── types/                # Core domain TypeScript definitions
│   │   ├── motion/               # Editorial motion curves, variants, & hooks
│   │   ├── services/mock.ts      # Comprehensive B2B spice catalogue & process data
│   │   ├── components/
│   │   │   ├── ui/               # 20+ accessible design system components
│   │   │   └── layout/           # Navbar, Mobile Menu, Footer, WhatsApp, Quote Bar
│   │   └── pages/                # Home (11 sections), About, Products, Detail, Services, etc.
│   └── public/                   # Favicon SVG, robots.txt
├── backend/                      # Node.js, Express, TypeScript Strict
│   ├── src/
│   │   ├── routes/               # Public API (health, products, categories, enquiries, contact)
│   │   ├── middleware/           # Rate limiting, security headers (Helmet), error handling
│   │   └── app.ts                # Express application configuration
├── database/migrations/          # Safe PostgreSQL / Supabase SQL schema migrations
├── docs/                         # Architecture, Asset inventory (ASSETS.md), guides
└── package.json                  # Root npm workspace configuration
```

---

## Design System Tokens

- **Forest Green (`#183D2C`):** Primary brand authority, with deep `#0A1B13` for footers.
- **Spice Gold (`#C49A45`):** Subtle accents, thin hairlines, and eyebrow labels.
- **Warm Ivory (`#F6F1E7`):** Natural editorial canvas with subtle paper grain texture.
- **Terracotta (`#9B452E`):** Rare (~3%) botanical accent.
- **Charcoal (`#292B25`):** Body typography with WCAG AA compliance.
- **Typography:** *Playfair Display* (Headings with italic emphasis) & *Inter* (Body/UI).

---

## Available Commands

From the root directory:

```bash
# Install all dependencies across workspaces
npm install

# Run frontend development server (http://localhost:5173)
npm run dev:frontend

# Run backend development server (http://localhost:5000)
npm run dev:backend

# Production build across both frontend and backend
npm run build
```

---

## Strict Truthfulness Standards

- Never displays invented pricing, unverified certifications, or fake testimonials.
- Unknown business credentials use structured editable placeholders (`[BUSINESS EMAIL]`, `[BUSINESS PHONE]`).
- Trust and certification badges remain strictly hidden until backed by verified database records.
