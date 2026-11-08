# Indian Spice Export - Asset Catalog & Image Inventory

This document inventories every photographic asset slot across the Indian Spice Export public website and catalogue. In accordance with the company's **Strict Truthfulness Policy**, all photography utilizes free-license imagery (Unsplash Free Commercial License) and is curated for an editorial trade journal aesthetic. Real warehouse, farm, and laboratory photography may be dropped directly into these specified slot dimensions.

---

## 1. Imagery Standards & Guidelines

- **Art Direction:** "Quiet Luxury, Spice-Route Heritage" — macro spice textures, wooden scoops, jute and burlap sacks, natural light, warm grading.
- **License Compliance:** All assets are licensed under the Unsplash License (free for commercial and non-commercial use, no attribution strictly required though documented here).
- **Format Requirements:** WebP / AVIF with high-quality JPEG fallback; target resolution minimum $1200\text{px}$ width.
- **Truthfulness Rule:** Images represent typical botanical and agricultural commodities; they are not misrepresented as proprietary processing plants or owned estate farmland unless verified.

---

## 2. Hero & Global Layout Assets

| Slot Name | Target Size | Aspect Ratio | Subject Matter / Description | Unsplash Asset URL | License / Author |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero Background** | $1920 \times 1080\text{px}$ | 16:9 / 100svh | Deep showroom perspective of authentic Indian whole spices in traditional brass/earthen bowls | `https://images.unsplash.com/photo-1596040033229-a9821ebd058d` | Free Unsplash License |
| **Brand Monogram / Favicon** | $48 \times 48\text{px}$ / SVG | 1:1 | Handcrafted geometric leaf emblem in Spice Gold (`#C49A45`) on Forest Green (`#183D2C`) | Local Vector: `/public/favicon.svg` | Proprietary ISE SVG |

---

## 3. Home Page Sections

| Section / Slot | Target Size | Aspect Ratio | Subject Matter | Unsplash Asset URL | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Intro Overlapping Image** | $1000 \times 1250\text{px}$ | 4:5 | Highland organic turmeric rhizomes and pure golden powder | `https://images.unsplash.com/photo-1615485290382-441e4d049cb5` | Kandhamal sourcing highlight |
| **India Sourcing Network** | $500 \times 600\text{px}$ / SVG | 4:5 | Stylized geometric SVG map with glowing Odisha headquarters and geographic connection arcs | Local Vector: `components/ui/IndiaMap.tsx` | Handcrafted Vector Map |

---

## 4. Featured Commodity Categories (8 Bento Tiles)

| Category | Target Size | Aspect Ratio | Botanical Subject | Unsplash Asset URL |
| :--- | :--- | :--- | :--- | :--- |
| **Turmeric** | $1200 \times 900\text{px}$ | 4:3 / Vertical | *Curcuma longa* roots & powder | `https://images.unsplash.com/photo-1615485290382-441e4d049cb5` |
| **Red Chilli** | $1200 \times 900\text{px}$ | 4:3 / Vertical | *Capsicum annuum* dried whole pods | `https://images.unsplash.com/photo-1588252303782-cb80119abd6d` |
| **Black Pepper** | $1200 \times 900\text{px}$ | 4:3 / Vertical | *Piper nigrum* sundried black peppercorns | `https://images.unsplash.com/photo-1599940824399-b87987ceb72a` |
| **Green Cardamom** | $1200 \times 900\text{px}$ | 4:3 / Vertical | *Elettaria cardamomum* 8mm+ green pods | `https://images.unsplash.com/photo-1596040033229-a9821ebd058d` |
| **Cumin Seeds** | $1200 \times 900\text{px}$ | 4:3 / Vertical | *Cuminum cyminum* sortex cumin seeds | `https://images.unsplash.com/photo-1509358271058-acd22cc93898` |
| **Coriander Seeds** | $1200 \times 900\text{px}$ | 4:3 / Vertical | *Coriandrum sativum* eagle grade whole seeds | `https://images.unsplash.com/photo-1596040033282-550a1df270e5` |
| **Cinnamon / Cassia** | $1200 \times 900\text{px}$ | 4:3 / Vertical | *Cinnamomum verum* curled quills & bark rolls | `https://images.unsplash.com/photo-1514733670139-4d87a1941d55` |
| **Cloves** | $1200 \times 900\text{px}$ | 4:3 / Vertical | *Syzygium aromaticum* intact whole flower buds | `https://images.unsplash.com/photo-1608686207856-001b95cf60ca` |

---

## 5. Drop-in Replacement Procedure

When proprietary photography from company harvest fields or processing facilities in Odisha becomes available:
1. Crop images to the specified aspect ratios above.
2. Compress using modern image tools to WebP format (< 250KB per hero, < 120KB per thumbnail).
3. Place files in `frontend/public/assets/images/spices/` or upload via the Media Library in the Admin Panel.
4. Update the corresponding image reference in `frontend/src/services/mock.ts` or database `product_images` table.
