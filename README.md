# Rapid Self Storage

Website for Rapid Self Storage, 1682 N J St, Tulare, CA. Next.js 16 (App Router) + TypeScript, built for Vercel.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build check
```

## Deploy to Vercel

1. Push this folder to a GitHub repo.
2. In Vercel: **Add New → Project**, import the repo. Framework preset is detected as Next.js; no build settings to change.
3. (Optional, for the contact form) add these under **Settings → Environment Variables**, then redeploy:
   - `RESEND_API_KEY` from https://resend.com (verify `rapidselfstorage.com` as a sending domain there)
   - `CONTACT_TO_EMAIL` where messages go, comma-separate for several
   - `CONTACT_FROM_EMAIL` e.g. `Rapid Self Storage <website@rapidselfstorage.com>`

   Without them the form still works on the page but tells visitors to call (559) 688-4787.
4. Point the domain: **Settings → Domains → add `rapidselfstorage.com` and `www.rapidselfstorage.com`**, then set the DNS records Vercel shows at the registrar (an A record for the apex, a CNAME for www). Do this only when the client approves the switch from the SiteGround WordPress site.

## Editing content

All text, links, hours, unit sizes and locations are in `lib/site.ts`. Styles are in `app/globals.css`.

## What's where

| Path | What |
| --- | --- |
| `app/page.tsx` | Page assembly and LocalBusiness (SelfStorage) structured data |
| `components/` | One file per section. Client components: `UnitPicker.tsx`, `MobileMenu.tsx`, `ContactForm.tsx` and `Motion.tsx` |
| `components/Motion.tsx` | Scroll reveals (`data-reveal`), count-up numbers (`data-count`), header and mobile call-bar state, active nav link |
| `app/employee/page.tsx` | The old site's staff schedule (Google Calendar embed). Not linked anywhere and marked `noindex` |
| `app/api/contact/route.ts` | Sends contact form email through Resend, with a hidden spam trap |
| `app/sitemap.ts`, `app/robots.ts` | SEO files |
| `next.config.ts` | 308 redirects from the old WordPress URLs (`/about-us`, `/facilityfeatures`, `/contact`) |

Payments and reservations stay on the existing Storedge and Quikstor portals; the site only links to them.

## Before launch, confirm with the client

- Unit sizes: the old site only stated "5×5 to 20×20". 5×10, 10×15 and 10×20 are placeholders (`units` in `lib/site.ts`).
- Free moving truck: mentioned for the company's locations generally; confirm it applies in Tulare.
- Office hours (only gate hours are known), and whether to show prices.
- Photos and the real logo (see below).

## Photos

The four photos are placeholders from Unsplash (free for commercial use under the Unsplash License):
hero and door by Adam Winger, drive-up shot by Moj Box. They're set in `photos` in `lib/site.ts`, with a
comment naming the matching photo on the old WordPress site (`/wp-content/uploads/...`).

To swap in the real photos: download them from the old site before the domain moves (don't hotlink, the
WordPress server goes away at launch), put the files in `public/photos/`, change each `src` to
`/photos/<file>.jpg`, delete the `credit` lines, and remove the `images.remotePatterns` block from `next.config.ts`.
The real logo is `/wp-content/uploads/2020/06/RSSlogo.png`; it replaces `components/Mark.tsx` and `app/icon.svg`.

## Design

White and navy palette (`#0b1a33` navy, `#1d5bff` blue for actions, `#f4f7fb` section tint), Schibsted Grotesk
self-hosted through Fontsource. Colors, the fluid type scale, spacing, radii and shadows are CSS variables at the
top of `app/globals.css`; sizes use `clamp()` so the layout scales smoothly from phones to wide screens.

Motion: the hero animates in with plain CSS on first paint; sections below reveal as they scroll into view. An
inline script in `app/layout.tsx` adds a `js` class before paint so content is only ever hidden when the reveal
script can run (and it's un-hidden after 4s if the app bundle fails to load). Everything is static for visitors
with "reduce motion" turned on.
