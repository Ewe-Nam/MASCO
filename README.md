# Mamfe Apostolic School Complex — Website

A 7-page marketing site built in plain HTML/CSS/JS (no build step, no Node.js
required) from the `design_handoff_mamfe_website` prototype: Home, About,
Academics, Admissions, Gallery, Staff, Contact.

## Running it locally

No build step — just open `index.html` in a browser, or serve the folder
with any static server, e.g.:

```
npx serve .
```

(or Python: `python -m http.server 8080`)

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

2. **Real photos.** Every photo spot is a labeled placeholder tile (dashed
   border, caption describing what belongs there) so it's obvious what to
   swap. Replace the `<div class="photo-placeholder">...</div>` block in
   each spot with a real `<img src="assets/photos/whatever.jpg" alt="...">`.
   Needed shots: home hero (pupils/campus), mission band (classroom), about
   (campus/founding photo + headteacher portrait), gallery (9 photos —
   graduation, sports, story time, art, speech & prize, playground, science
   fair, cultural day, reading corner), staff portraits (8 people).

3. **Logo.** `assets/logo.png` is the official badge you provided. It's
   used in the navbar, footer, and home-page hero crest on every page.

4. **Placeholder contact details.** The address, phone number, and hours in
   the footer and Contact page are placeholders carried over from the
   design handoff — double check the town/region (the handoff said "Mamfe,
   Ghana", but Mamfe is a town in Cameroon's Southwest Region — confirm the
   real location) and replace the phone number and hours with the real
   ones.

5. **Map embed.** `contact.html` embeds a public Google Maps iframe
   searching "Mamfe" — no API key needed, but it's not pinned to the exact
   campus. Once you have the school's exact address, update the `src` on
   the `<iframe>` in `contact.html` (search a more specific query, e.g. the
   street address, in Google Maps, then use its "Share > Embed a map" HTML).

6. **Social links.** The `f` / `X` / `◉` circles in the footer are
   placeholders — point their `href`s at the school's real social pages.

## Structure

```
website/
  index.html        Home
  about.html
  academics.html
  admissions.html
  gallery.html       client-side category filter (js/main.js)
  staff.html
  contact.html       form validation + Web3Forms submit (js/main.js)
  css/styles.css     all shared styles + design tokens (colors, type, radii)
  js/main.js         nav active-state, mobile menu, gallery filter, contact form
  assets/logo.png    official school badge
```

Each page is a real, separate HTML file (not a single-page app) — the
header/footer markup is duplicated across files, which is normal for a
build-tool-free static site. `js/main.js` figures out the active nav item
by comparing each link's `href` to the current page, so the shared header
markup lights up correctly wherever it's dropped in.

## Deploying

Since it's plain static files, it deploys anywhere: Netlify (drag-and-drop
the `website` folder), Vercel, GitHub Pages, or any regular web host —
no Node.js or build step needed on your end.
