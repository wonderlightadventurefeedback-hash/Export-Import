# API Reference & Endpoints

Base URL: `http://localhost:5000/api` (or environment configured `VITE_API_BASE_URL`)

---

## 1. Public Storefront Endpoints

### 1.1 List Categories
- **Method**: `GET /api/categories`
- **Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "cat-1",
      "name": "Turmeric",
      "slug": "turmeric",
      "tagline": "High-Curcumin Roots & Pure Ground Form",
      "description": "Sourced from the fertile soil of Kandhamal (Odisha)...",
      "hero_image_url": "https://images.unsplash.com/photo-1615485290382-441e4d049cb5...",
      "featured_order": 1,
      "product_count": 4
    }
  ]
}
```

### 1.2 List Products
- **Method**: `GET /api/products`
- **Query Params**: `category` (optional), `form` (optional), `search` (optional)
- **Response**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "prod-1",
        "name": "Kandhamal Organic Turmeric Finger",
        "slug": "kandhamal-turmeric-finger",
        "botanical_name": "Curcuma longa",
        "category_slug": "turmeric",
        "status": "published",
        "is_featured": true,
        "specifications": {
          "curcuminContent": "4.5% - 5.5%",
          "moistureMax": "10.0%"
        }
      }
    ],
    "meta": { "total": 12, "page": 1 }
  }
}
```

### 1.3 Submit Quotation Inquiry
- **Method**: `POST /api/enquiries`
- **Headers**: `Content-Type: application/json`, `X-Idempotency-Key: <unique-string>`
- **Request Body**:
```json
{
  "fullName": "Marcus Vance",
  "companyName": "Vance Spice Imports B.V.",
  "businessEmail": "marcus@vancespices.nl",
  "phoneWhatsapp": "+31612345678",
  "country": "Netherlands",
  "destinationPort": "Port of Rotterdam",
  "targetIncoterm": "CIF (Cost, Insurance & Freight)",
  "agreeToTruthTerms": true,
  "items": [
    {
      "productName": "Kandhamal Organic Turmeric Finger",
      "quantity": 18,
      "unit": "MT (Metric Tonnes)",
      "form": "Whole Finger",
      "preferredGrade": "Export Grade 1"
    }
  ]
}
```
- **Response (201 Created)**:
```json
{
  "success": true,
  "data": {
    "referenceNumber": "ISE-2026-89412",
    "receivedAt": "2026-11-04T05:30:00.000Z",
    "status": "New"
  }
}
```

### 1.4 Public Settings & Certifications
- **Method**: `GET /api/public/settings`
- **Response**: Returns company registered addresses, export desk email, official WhatsApp number, and verified Spices Board / APEDA badges.

---

## 2. Admin Control Room Endpoints

All admin endpoints require `Authorization: Bearer <JWT_TOKEN>`.

### 2.1 Admin Authentication
- **Login**: `POST /api/admin/auth/login`
  - Body: `{ "email": "admin@indianspiceexport.com", "password": "..." }`
  - Response: `{ "data": { "token": "...", "user": { "id": "...", "fullName": "...", "role": "Owner" } } }`
- **Current User**: `GET /api/admin/auth/me`
- **Logout**: `POST /api/admin/auth/logout`

### 2.2 Dashboard
- **GET /api/admin/dashboard**: Returns total counts, status breakdown for chart visualizations, recent inquiries, and quotation activity.

### 2.3 Products Management
- **GET /api/admin/products**: Full product table with draft/published filters.
- **POST /api/admin/products**: Create new spice product with specifications, grades, and gallery.
- **PUT /api/admin/products/:id**: Update product details.
- **DELETE /api/admin/products/:id**: Remove product.
- **POST /api/admin/products/bulk**: Bulk publish, unpublish, or delete.

### 2.4 Inquiries Pipeline
- **GET /api/admin/enquiries**: Filterable inquiry inbox by status, country, date.
- **PATCH /api/admin/enquiries/:id/status**: Update status (`New` -> `Reviewing` -> `Quoted` -> `Negotiating` -> `Accepted` / `Closed`).
- **POST /api/admin/enquiries/:id/notes**: Add internal staff notes thread.
- **PATCH /api/admin/enquiries/:id/assign**: Assign inquiry to staff user.

### 2.5 Quotations Desk
- **GET /api/admin/quotations**: All issued proforma quotations.
- **POST /api/admin/quotations**: Create proforma quotation with calculated freight, insurance, and validity.
- **GET /api/admin/quotations/:id/pdf-data**: Structured data for printable PDF invoice export.

### 2.6 Suppliers (Confidential)
- **GET /api/admin/suppliers**: List verified farmers and processing mills.
- **POST /api/admin/suppliers**: Add supplier record with contact details and capacity.
- **PUT /api/admin/suppliers/:id**: Update supplier.
- **DELETE /api/admin/suppliers/:id**: Delete supplier.

### 2.7 Users & Audit (Owner Only)
- **GET /api/admin/users**: Manage administrative accounts.
- **POST /api/admin/users/invite**: Invite team member.
- **PATCH /api/admin/users/:id/role**: Change access role.
- **GET /api/admin/audit**: Immutable security and change audit trail.
