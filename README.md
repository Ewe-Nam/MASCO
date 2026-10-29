# Mamfe Apostolic School Complex — Website

Official website of **Mamfe Apostolic School Complex (MASCO)**, a Daycare,
Nursery, Kindergarten, Primary (Basic 1–6) and JHS school in
**Mamfe-Akuapem, Eastern Region, Ghana**. Motto: *Studious & Diligence*.

**Live site: https://mamfeapostolicschoolcomplex.com**

Plain HTML/CSS/JS, no build step. Pages: Home, About, Academics,
Admissions, Campus Life, Events, Gallery, Staff, Contact, plus a branded
404 page.

## Running it locally

No build step. Links are root-relative clean URLs (`/about`), so serve the
folder rather than double-clicking files:

```
npx serve .
```

(`npx wrangler dev` can crash on this machine's Windows path; use `serve`
for quick local checks.)

## Contact details & email

- **Phone / WhatsApp:** `+233 59 552 4547`, shown site-wide as tap-to-call
  links, the floating WhatsApp button and the home-page structured data.
  For the floating buttons the number lives in one place:
  `SCHOOL_PHONE` / `SCHOOL_WHATSAPP` in `js/main.js`.
- **Email:** the site shows `info@mamfeapostolicschoolcomplex.com`
  (clickable `mailto:` links). Cloudflare Email Routing forwards it to the
  school Gmail, `mamfeapostolicschoolcomplex62@gmail.com`.
- **Contact form:** posts to [Web3Forms](https://web3forms.com), which
  emails each message straight to the school Gmail (it doesn't go
  through info@, so the form keeps working even if forwarding changes). It has a hidden honeypot field
  for spam.
- **Map:** `contact.html` embeds a Google Maps search for
  "Mamfe, Akuapem, Eastern Region, Ghana". To pin the exact campus,
  replace the iframe `src` with Google Maps' *Share → Embed a map* code.

## Still needed from the school

Placeholders are clearly marked and never invented:

- **Staff portraits** (`staff.html`) and the **headteacher portrait**
  (`about.html`): replace each `<div class="photo-placeholder">…</div>`
  with `<img class="photo-img" src="/assets/photos/….jpg" alt="…">`.
- **Sports & wellness photo** on Campus Life and its home-page teaser.
- **Parent testimonials** on the home page (see the `NOTE` comment in
  `index.html`).
- **Opening hours** (currently Mon–Fri 7:30–4:00, from the design).
- **Social links:** the footer icons stay `hidden` until real pages exist.
  Set each `href` in the footer `social-row`, then remove `hidden`.

## Search engines

- Each page has a title and description naming the school, its levels and
  Mamfe-Akuapem, plus Open Graph/Twitter tags for link previews.
- The home page carries `School` structured data (JSON-LD) with the
  address, phone and email.
- `sitemap.xml` and `robots.txt` are at the site root. Submit the sitemap
  in Google Search Console and Bing Webmaster Tools.
- Branding: `assets/logo.png` is the 3D school crest. The favicon set
  (`favicon.ico`, `assets/icon-192.png`, `assets/icon-512.png`,
  `site.webmanifest`, `assets/apple-touch-icon.png`) uses its shield emblem.

## Structure

```
index.html … staff.html   one HTML file per page (shared header/footer)
404.html                  branded "page not found"
css/styles.css            all styles + design tokens (colours, type, radii)
js/main.js                nav state, mobile menu, gallery filter + lightbox,
                          contact form, WhatsApp/call buttons, loading
                          indicators (page progress bar, photo shimmer)
assets/                   logo, icons, photos, social share image
sitemap.xml, robots.txt   for search engines
wrangler.jsonc            Cloudflare Worker config
_headers                  security + caching headers
.assetsignore             repo files that are never published
cloudflare/www-redirect/  www → bare-domain redirect Worker
vercel.json               keeps the old masco-eta.vercel.app links redirecting
```

Each page is a real, separate HTML file (not a single-page app). The
header/footer markup is duplicated across files, which is normal for a
build-tool-free static site. `js/main.js` works out the active nav item
from the current URL.

## Hosting & deploying (Cloudflare)

The site runs on **Cloudflare Workers static assets** at
**https://mamfeapostolicschoolcomplex.com** (domain registered with
Cloudflare Registrar).

- `wrangler.jsonc`: the `masco-website` Worker. Clean URLs (`/about`
  serves `about.html`; `/about.html` redirects to `/about`), branded
  `404.html` for unknown paths, custom domain attached.
- `.assetsignore`: repo-only files that must never be published (README,
  configs, `.git`, …). Add any new private file here.
- `_headers`: security headers + 1-day image caching.
- `cloudflare/www-redirect/`: a tiny separate Worker that 301-redirects
  `www.` to the bare domain. It's kept separate so normal page and image
  requests never run Worker code and stay free.

Every change goes on its own branch and is merged to `main` by pull
request. **Merging does not deploy by itself**, so deploy from this folder
afterwards:

```
npx wrangler deploy                                  # the website
cd cloudflare/www-redirect && npx wrangler deploy    # only if the www worker changes
```

For automatic deploys on every merge to `main`, connect the GitHub repo in
the Cloudflare dashboard (Workers & Pages → masco-website → Settings →
Builds → Connect).

---

Developed by **EwenamTech**.
