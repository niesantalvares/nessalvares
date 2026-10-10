# Cloudflare Pages Setup Guide

Complete guide for deploying and configuring `nessalvares` on Cloudflare Pages.

---

## 1. Architecture Overview

This is a high-performance, buildless static site:
- **Output Directory**: `dist/` (Contains all HTML, CSS, JS, favicons, redirect rules, and headers)
- **Redirects Engine**: `dist/_redirects` provides server-edge 302 redirects (e.g. `/nesssport` -> `https://www.nesssport.com`)
- **Security & Caching**: `dist/_headers` configures OWASP security headers and high-performance immutable asset caching
- **Error Handling**: `dist/404.html` automatically serves a themed 404 page for unmatched routes

---

## 2. Deployment Methods

### Option A: GitHub Integration (Recommended — Zero Maintenance)

When connected to GitHub, Cloudflare Pages will automatically deploy your site every time you push to the `main` branch.

1. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. In the sidebar, navigate to **Compute (Workers) & Pages** > **Overview** (or **Workers & Pages**).
3. Click **Create application** > **Pages** tab > **Connect to Git**.
4. Select your GitHub account and choose the repository: **`niesantalvares/nessalvares`**.
5. Set up the build configuration:
   | Setting | Value | Notes |
   | :--- | :--- | :--- |
   | **Project name** | `nessalvares` | Becomes `nessalvares.pages.dev` |
   | **Production branch** | `main` | Production deployments |
   | **Framework preset** | `None` | Static HTML/CSS/JS site |
   | **Build command** | *(leave empty)* | No build step required |
   | **Build output directory** | `dist` | Folder containing site files |
   | **Root directory** | `/` | Root of git repo |
6. Click **Save and Deploy**. Cloudflare will publish the site in ~5 seconds.

---

### Option B: Direct Deploy via Wrangler CLI

If you prefer deploying directly from your terminal:

```bash
# 1. Authenticate with Cloudflare
npx wrangler login

# 2. Deploy directly to Cloudflare Pages
npx wrangler pages deploy dist --project-name nessalvares
```

---

### Option C: Automated GitHub Actions (Optional)

If you prefer using a GitHub Actions workflow to deploy using API tokens:
You can use `cloudflare/pages-action@v1` by setting secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` in your GitHub repository settings.

---

## 3. Custom Domain Configuration

To connect your custom domain (e.g., `nessalvares.com` or `www.nessalvares.com`):

1. In the Cloudflare Dashboard, open your Pages project (**Workers & Pages** > **`nessalvares`**).
2. Go to the **Custom domains** tab.
3. Click **Set up a custom domain**.
4. Enter your domain: `nessalvares.com` (and repeat for `www.nessalvares.com` if desired).
5. **DNS Setup**:
   - If your DNS is managed in **Cloudflare**: Cloudflare will automatically create the `CNAME` or `ALIAS` record pointing to `nessalvares.pages.dev` with orange-cloud proxy enabled.
   - If your DNS is managed **externally** (GoDaddy, Namecheap, Google Domains): Add a `CNAME` record:
     - Name: `@` (or `www`)
     - Target / Value: `nessalvares.pages.dev`

---

## 4. SSL/TLS & HTTPS Configuration

In Cloudflare Dashboard for your domain:
1. Navigate to **SSL/TLS** > **Overview**.
2. Select **Full (strict)** encryption mode.
3. Navigate to **SSL/TLS** > **Edge Certificates**:
   - Enable **Always Use HTTPS** (automatically redirects HTTP to HTTPS).
   - Enable **Automatic HTTPS Rewrites**.
   - Set **Minimum TLS Version** to `TLS 1.2` or `TLS 1.3`.

---

## 5. Built-in Optimizations Already Configured

The repository already includes pre-configured Cloudflare rules:

- **`dist/_redirects`**:
  ```text
  /nesssport https://www.nesssport.com 302
  /nesssport/ https://www.nesssport.com 302
  ```
- **`dist/_headers`**:
  - `X-Frame-Options: DENY` (anti-clickjacking)
  - `X-Content-Type-Options: nosniff` (MIME-type sniffing protection)
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - 1-year immutable caching for static assets (`.css`, `.js`, `.png`)
  - Instant revalidation (`max-age=0, must-revalidate`) for `.html` files so updates are immediately visible to users.

---

## 6. Local Testing

To test the exact `dist/` bundle locally before pushing:

```bash
# Python
python -m http.server 4173 --directory dist

# Or Wrangler Pages emulator
npx wrangler pages dev dist
```
Navigate to `http://localhost:4173` or `http://localhost:8788`.
