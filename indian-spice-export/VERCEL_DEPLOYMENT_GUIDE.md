# Vercel Deployment Guide — A.G IMPORT & EXPORT

Your project is fully configured and ready to be deployed to **Vercel** with zero-configuration!

---

## What Has Been Prepared

1. **Vercel Serverless Function** (`api/index.ts`):
   - Automatically handles all `/api/*` backend requests (products, categories, enquiries, auth) directly on Vercel without needing a separate backend server.

2. **Client-Side SPA Routing** (`vercel.json` & `frontend/vercel.json`):
   - Configured with rewrite rules so that refreshing on any page (`/about`, `/company`, `/key-person`, `/products`, `/services`, `/certifications`, `/faqs`, `/contact`, `/admin/*`) will **never** throw a 404 error.

3. **Vercel Web Analytics** (`@vercel/analytics`):
   - Added to the React application root for automatic visitor tracking and speed metrics when deployed on Vercel.

4. **Vercel Serverless Runtime** (`@vercel/node`):
   - Installed and tested for fast Node.js execution.

---

## How to Deploy (Choose Option 1 or Option 2)

### Option 1: Deploy with Git & GitHub (Recommended)

1. Push your code to your GitHub repository:
   ```bash
   git add .
   git commit -m "Prepare website for Vercel deployment"
   git push origin main
   ```
2. Go to **[vercel.com/new](https://vercel.com/new)** and log in.
3. Select your repository: **indian-spice-export**.
4. Keep the default settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./` (or leave default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `frontend/dist`
5. Click **Deploy**!
   - In less than 60 seconds, your site will be live at `https://your-project.vercel.app`!

---

### Option 2: Deploy Instantly with Vercel CLI

If you have the Vercel CLI installed on your machine:
```powershell
# In d:\export\indian-spice-export
npx vercel
```
1. Follow the interactive prompts (press Enter to accept defaults).
2. For production deployment:
   ```powershell
   npx vercel --prod
   ```

---

## Verified Configuration Summary

| Feature | Status | Details |
|---|---|---|
| **Build Command** | `npm run build` | Builds both frontend Vite dist & backend TypeScript |
| **Output Directory** | `frontend/dist` | Serves optimized static assets & HTML |
| **API Endpoints** | `/api/*` | Handled by Serverless Function at `api/index.ts` |
| **SPA Fallback** | `/(.*) -> index.html` | Prevents 404 on page refresh |
| **Analytics** | Active | `@vercel/analytics` embedded in root layout |
| **Offline / Fallback** | Active | Graceful mock fallbacks & local registry storage |

