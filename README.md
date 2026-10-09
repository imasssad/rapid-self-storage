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
| `components/` | One file per section; `UnitPicker.tsx`, `MobileMenu.tsx` and `ContactForm.tsx` are the only client components |
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
hero and door by Adam Winger, drive-up shot by Moj Box. They're set in `photos` in `lib/site.ts`.

To swap in Eric's own photos: put the files in `public/photos/`, change each `src` to `/photos/<file>.jpg`,
delete the `credit` lines, and remove the `images.remotePatterns` block from `next.config.ts`.

## Design

White and navy palette (`#0f1e3a` navy, `#1d5bff` blue for actions, `#f3f6fa` section tint), Schibsted Grotesk
self-hosted through Fontsource. Colors are CSS variables at the top of `app/globals.css`.
