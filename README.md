# Mamfe Apostolic School Complex — Website

A 7-page marketing site built in plain HTML/CSS/JS (no build step, no Node.js
required) from the `design_handoff_mamfe_website` prototype: Home, About,
Academics, Admissions, Gallery, Staff, Contact.

## Running it locally

No build step. Links are root-relative clean URLs (`/about`), so serve the
folder rather than double-clicking files:

```
npx serve .
```

(`npx wrangler dev` also works but can crash on this machine's Windows
path; use `serve` for quick local checks.)

## Before you launch

1. **Contact form delivery.** The form on `contact.html` posts to
   [Web3Forms](https://web3forms.com) — a free service that emails
   submissions straight to an inbox with no backend code.
   - Go to https://web3forms.com, enter the school's email
     (`mamfeapostolicschoolcomplex62@gmail.com`), and it emails you an
     access key — no account/password needed.
   - Open `js/main.js` and replace `YOUR_WEB3FORMS_ACCESS_KEY` with that
     key.
   - Until you do this, the form shows a friendly "not configured yet"
     message instead of silently failing.

2. **Real photos.** Most photo spots now use real Mamfe Apostolic photos
   (hero backdrop + card, mission band, gallery, About "our story", and the
   Campus Life page/teaser) in `assets/photos/`. Two spots still use
   `photo-placeholder` tiles and need real, *identified* photos:
   - **Staff portraits** (`staff.html`, 8 cards) — each is tied to a role
     (Headteacher, Daycare Lead, …), so supply a headshot per named person.
   - **Headteacher portrait** (`about.html`, headteacher message panel).
   To fill one, replace its `<div class="photo-placeholder">...</div>` with
   `<img class="photo-img" src="assets/photos/whatever.jpg" alt="...">`.

3. **Logo.** `assets/logo.png` is the official badge you provided. It's
   used in the navbar, footer, and home-page hero crest on every page.

4. **Contact details.** The school phone (`+233 59 552 4547`) is live
   site-wide as tap-to-call links, the floating WhatsApp button, and the
   home-page structured data. The number lives in one place for the
   floating buttons — `SCHOOL_PHONE` / `SCHOOL_WHATSAPP` in `js/main.js` —
   plus the footer/Contact `tel:` links. Location is Mamfe (Akuapem, Eastern
   Region, Ghana). The opening **hours** (Mon–Fri 7:30–4:00) are still a
   placeholder from the design handoff — confirm or correct them.

5. **Map embed.** `contact.html` embeds a public Google Maps iframe
   searching "Mamfe" — no API key needed, but it's not pinned to the exact
   campus. Once you have the school's exact address, update the `src` on
   the `<iframe>` in `contact.html` (search a more specific query, e.g. the
   street address, in Google Maps, then use its "Share > Embed a map" HTML).

6. **Social links.** The footer social icons (Facebook, Instagram, X,
   YouTube) are **hidden** until the school has real pages, so parents
   never hit dead links. To turn one on: set its `href` on the
   `<div class="social-row" hidden>` block in each page's footer, then
   remove the `hidden` attribute.

   Short URLs like `/about` or `/contact` redirect to the `.html` pages
   via `vercel.json`.

7. **Sports & wellness photo.** The Campus Life page and its home-page
   teaser have one remaining photo placeholder (sports/wellness) — swap in
   a real photo when available.

8. **Testimonials.** The parent quotes on the home page are clearly-marked
   placeholders (see the `NOTE` comment in `index.html`) — replace with
   real parent names and quotes.

## Structure

```
website/
  index.html        Home
  about.html
  academics.html
  admissions.html
  campus-life.html   student life / arts & culture / sports & wellness
  gallery.html       client-side category filter (js/main.js)
  staff.html
  contact.html       form validation + Web3Forms submit (js/main.js)
  css/styles.css     all shared styles + design tokens (colors, type, radii)
  js/main.js         nav active-state, mobile menu, gallery filter, contact form
  assets/            logo, photos, OG share image
  wrangler.jsonc     Cloudflare Worker config
  _headers           security/caching headers
  .assetsignore      files never published
  cloudflare/        www -> bare-domain redirect Worker
```

Each page is a real, separate HTML file (not a single-page app) — the
header/footer markup is duplicated across files, which is normal for a
build-tool-free static site. `js/main.js` figures out the active nav item
by comparing each link's `href` to the current page, so the shared header
markup lights up correctly wherever it's dropped in.

## Hosting & deploying (Cloudflare)

The site is hosted on **Cloudflare Workers static assets** at
**https://mamfeapostolicschoolcomplex.com** (domain registered with
Cloudflare Registrar).

- `wrangler.jsonc` — the `masco-website` Worker: clean URLs
  (`/about` serves `about.html`; `/about.html` redirects to `/about`),
  branded `404.html` for unknown paths, custom domain attached.
- `.assetsignore` — repo-only files that must never be published
  (README, configs, `.git`, …). Add any new private file here.
- `_headers` — security headers + 1-day image caching.
- `cloudflare/www-redirect/` — tiny separate Worker that 301-redirects
  `www.` to the bare domain (kept separate so normal page/image requests
  never run Worker code and stay free).

Deploy manually (from this folder):

```
npx wrangler deploy                       # the website
cd cloudflare/www-redirect && npx wrangler deploy   # only if the www worker changes
```

For automatic deploys on every merge to `main`, connect the GitHub repo in
the Cloudflare dashboard (Workers & Pages → masco-website → Settings →
Builds → Connect).

`vercel.json` only keeps the old `masco-eta.vercel.app` address
redirecting to the new domain, so previously shared links keep working.
