# Admin Control Room User Guide

A comprehensive, non-technical operational manual for the business owner, sales desk, and export operations team.

---

## 1. Accessing the Control Room

1. Navigate to `/admin` in your web browser.
2. If you are not currently signed in, you will be redirected to the secure login portal at `/admin/login`.
3. Enter your administrative email and password.
4. **Security Notice**: Your session will automatically lock after 15 minutes of inactivity to protect sensitive commercial pricing and supplier intelligence.

---

## 2. Managing Products & Specifications (`/admin/products`)

### Adding a New Spice Product
1. Click the **"Add New Product"** button in the top right.
2. Fill in the **Product Identity**:
   - **Name**: e.g., *Kandhamal Organic Turmeric Finger*
   - **Botanical / Scientific Name**: e.g., *Curcuma longa*
   - **HS Code**: e.g., *0910.30.20*
   - **Origin State / Belt**: e.g., *Odisha, Eastern Ghats*
3. **Dynamic Chemical Specifications**:
   - Add or remove key-value rows (e.g., Curcumin Content: `4.5% - 5.5%`, Moisture: `Max 10%`, Piperine: `6.0%`).
4. **Grades & Packaging**:
   - Enter comma-separated grades (e.g., *Double Polished, Single Polished, Unpolished*).
   - Enter standard export packaging formats (e.g., *25kg Vacuum Bags, 50kg Jute Sacks*).
5. **Publishing Status**:
   - Toggle status between **Draft** (hidden from public) and **Published** (live on website).
   - Set **Featured Flag** if you want the product highlighted on the homepage.

---

## 3. Managing Inquiries (`/admin/enquiries`)

The inquiries inbox collects all RFQs submitted from the public request-a-quote form.

### Processing an Inquiry
1. Click on any inquiry row to expand the detail drawer.
2. Review the requested **commodities, tonnage, target destination port**, and **preferred Incoterms** (FOB, CIF, CFR).
3. **Internal Notes**: Add private comments visible only to your sales team (e.g., *"Contacted buyer via phone; requested 30% advance T/T"*).
4. **Change Status**: Advance the status as the deal progresses:
   - `New` ➔ `Reviewing` ➔ `Quoted` ➔ `Negotiating` ➔ `Accepted` or `Closed`.
5. **One-Click WhatsApp Reply**: Click the green **WhatsApp** button to open a pre-formatted chat with the buyer referencing their specific inquiry number.

---

## 4. Issuing Proforma Quotations (`/admin/quotations`)

1. Click **"New Proforma Quotation"**.
2. Select an existing inquiry from the dropdown to automatically populate the buyer's details.
3. Configure the line items with **unit prices (USD/kg)**, **quantities (Metric Tonnes)**, and **packaging options**.
4. Set the **Incoterm** (FOB Cochin, CIF Rotterdam, etc.), **freight estimate**, and **quotation validity date** (typically 14 days).
5. Click **"Save Quotation"**.
6. Use the **"Printable Commercial PDF"** preview to export or print the quotation directly on corporate letterhead.

---

## 5. Confidential Supplier Registry (`/admin/suppliers`)

> [!IMPORTANT]
> **Confidentiality Notice**: All information in this module is strictly private and is never exposed on the public storefront.

- Maintain verified contacts for spice farming collectives, tribal societies in Kandhamal, and steam-sterilization processing facilities in Guntur and Cochin.
- Record verification status, laboratory assay history, and annual supply capacities.

---

## 6. Site Builder & Section Customization (`/admin/site-builder`)

1. Select the page you wish to modify (Home, About, Services, Export Process).
2. Use the **drag handle (grip icon)** to reorder sections up or down.
3. Use the **eye icon** to temporarily show or hide a section.
4. Edit headlines, sub-copy, and bullet points directly in the visual editor.
5. Toggle between **Desktop, Tablet, and Mobile** views to preview your changes before publishing.
6. Click **"Publish Live Changes"** to push updates to the live website.

---

## 7. Company Settings & Certifications (`/admin/settings`)

- **Company Identity**: Update official legal entity names, GSTIN, and Import Export Code (IEC).
- **Communication Lines**: Configure the official WhatsApp Business number and trade desk email.
- **Certifications**: Toggle visibility of regulatory credentials:
  - Spices Board of India (CRES)
  - APEDA Export Registration
  - FSSAI Central License
  - US FDA Food Facility Registration
  - ISO 22000 / HACCP / Halal / Kosher
  *(Badges appear publicly only when enabled with valid registration numbers)*.

---

## 8. Keyboard Shortcuts & Tips

- **Ctrl + K** (or **Cmd + K** on Mac): Open the Global Command Palette to jump to any product, inquiry, or module instantly.
- **Ctrl + S**: Quick-save changes on any admin form.
