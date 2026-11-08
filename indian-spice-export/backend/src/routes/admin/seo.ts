import { Router, Request, Response } from "express";
import { db } from "../../services/supabase.js";
import { requireContentManagers } from "../../middleware/roles.js";

export const adminSeoRouter = Router();

// GET /api/admin/seo
adminSeoRouter.get("/", (req: Request, res: Response) => {
  res.json({ success: true, data: db.seo });
});

// PUT /api/admin/seo/:pageKey
adminSeoRouter.put("/:pageKey", requireContentManagers, (req: Request, res: Response) => {
  const pageKey = String(req.params.pageKey);
  const payload = req.body;

  db.seo[pageKey] = {
    ...db.seo[pageKey],
    ...payload,
  };

  db.log(req.user?.fullName || "Admin", "SEO_SETTINGS_UPDATE", "SEO", pageKey, `Updated SEO tags for page '${pageKey}'`);

  res.json({ success: true, data: db.seo[pageKey] });
});

// POST /api/admin/seo/regenerate-sitemap
adminSeoRouter.post("/regenerate-sitemap", requireContentManagers, (req: Request, res: Response) => {
  // Generates fresh sitemap XML based on active products and pages
  const baseUrl = "https://indianspiceexport.com";
  const staticPages = ["", "products", "services", "export-process", "about", "contact", "request-quote", "privacy-policy", "terms"];

  const productUrls = db.products
    .filter((p) => p.status === "published")
    .map((p) => `  <url>\n    <loc>${baseUrl}/products/${p.slug}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`);

  const pageUrls = staticPages.map(
    (path) =>
      `  <url>\n    <loc>${baseUrl}/${path}</loc>\n    <changefreq>${path === "" ? "daily" : "weekly"}</changefreq>\n    <priority>${path === "" ? "1.0" : "0.7"}</priority>\n  </url>`
  );

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...pageUrls, ...productUrls].join("\n")}\n</urlset>`;

  db.log(req.user?.fullName || "Admin", "SITEMAP_REGENERATED", "SEO", undefined, `Regenerated sitemap with ${staticPages.length + productUrls.length} URLs`);

  res.json({
    success: true,
    data: {
      urlsCount: staticPages.length + productUrls.length,
      xml: sitemapXml,
    },
  });
});
