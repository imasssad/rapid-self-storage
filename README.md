# Rapid Self Storage

Website for Rapid Self Storage, 1682 N J St, Tulare, CA. Next.js 16 (App Router, Cache Components) + TypeScript,
deployed on Vercel. The owner edits the content themselves in a password-protected admin panel at `/admin`; content,
admin users and uploaded photos live in a private Vercel Blob store.

- **For the owner:** [ADMIN-GUIDE.md](ADMIN-GUIDE.md), how to use the admin panel.
- **For a new developer:** [HANDOVER.md](HANDOVER.md), where everything lives and how to get access.

## Run locally

```bash
npm install
cp .env.example .env.local   # then fill in SESSION_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
npm run dev                  # http://localhost:3000, admin at http://localhost:3000/admin
npm run build                # production build + type check
```

Without `BLOB_READ_WRITE_TOKEN`, everything the Blob store would hold is read from and written to the git-ignored
`.data/` folder (same paths). Delete `.data/` to start over: the site falls back to the defaults in `lib/site.ts`, and
the next admin login with `ADMIN_EMAIL` / `ADMIN_PASSWORD` creates the owner again. To work against the real store,
run `vercel env pull .env.local` (this brings down `BLOB_READ_WRITE_TOKEN`); be careful, saves then change the live site.

## Deploy to Vercel

1. Import the GitHub repo in Vercel (**Add New → Project**). The Next.js preset needs no build settings and there is no `vercel.json`.
2. Create the Blob store: **Storage → Create → Blob**, choose **Private**, and connect it to this project
   (all environments). That adds `BLOB_READ_WRITE_TOKEN`.
3. Under **Settings → Environment Variables** add `SESSION_SECRET` (32+ random characters), `ADMIN_EMAIL` and
   `ADMIN_PASSWORD` (10+ characters), and optionally `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL`. Redeploy.
4. The owner signs in at `/admin` with `ADMIN_EMAIL` / `ADMIN_PASSWORD`. That creates the owner account; then
   **delete `ADMIN_PASSWORD` from Vercel** (it's ignored from then on, but shouldn't sit there).
   If sign-in can't work yet, the login page says exactly what's missing (no Blob store, no `SESSION_SECRET`, no
   first-login variables). Variables only reach the environments they're ticked for (Production, Preview), and only
   after a redeploy. The underlying error is also in Vercel's **Logs** for `/admin/login`.
5. Point the domain: **Settings → Domains**, add `rapidselfstorage.com` and `www.rapidselfstorage.com`, and set the
   DNS records Vercel shows at the registrar. Only when the client approves the switch from the SiteGround WordPress site.

Every push to `main` (including a merged pull request) deploys to production; every other branch gets a preview.
If a merge doesn't start a production deployment, open **Deployments → Create Deployment**, pick the `main` branch
and create it. Use that rather than promoting a preview, because previews are built with the Preview environment
variables (`SESSION_SECRET` and the `ADMIN_*` variables may be set for Production only). If it keeps happening,
check **Settings → Git**: the production branch is `main` and **Ignored Build Step** is **Automatic**.

| Variable | Purpose |
| --- | --- |
| `BLOB_READ_WRITE_TOKEN` or `BLOB_STORE_ID` | Added automatically when the Blob store is connected: the token, or (newer Vercel) `BLOB_STORE_ID` with Vercel OIDC. Either works for everything, photo uploads included. |
| `SESSION_SECRET` | Random string, 32+ characters. Signs the admin login cookie; changing it signs everyone out. |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | First owner login only. Delete the password after the first sign-in. |
| `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL` | Contact form email. Recipients set in the admin panel (Contact form emails) take priority over `CONTACT_TO_EMAIL`. |

## Architecture (developer notes)

Everything runs serverless: Server Components, Server Actions and route handlers on Vercel Functions (Node.js
runtime). No database, no custom server, no cron jobs; all state lives in the Blob store.

**Storage** (`lib/storage.ts`). The only module that knows about the backend. Private Vercel Blob when
`BLOB_READ_WRITE_TOKEN` (or `BLOB_STORE_ID`) is set, otherwise `.data/`. On Vercel without a store, writes fail
loudly instead of silently. What's stored:

| Path | What |
| --- | --- |
| `content/site.json` | All website content. Read with `useCache: false`, so a read right after a save is never stale. |
| `content/history/<timestamp>.json` | One file per save: who, when, which section, and the full content. Newest 20 kept. |
| `auth/users.json` | Admin users: email, name, role, bcrypt hash, session version. Never plain passwords. |
| `auth/attempts/<sha256(email)>.json` | Failed login counter for the lockout (5 failures in 15 min → locked for 15 min). |
| `media/<random-id>-<name>.<ext>` | Uploaded photos, served by `app/media/[...path]/route.ts` with `Cache-Control: immutable`. |

**Schema** (`lib/content-schema.ts`). One zod schema for all content, split into sections (`specials`, `units`,
`contact`, `home`, `photos`, `about`, `locations`, `reviews`, `settings`). It gives the TypeScript types, validates
admin forms in the browser, and validates every save on the server. Defaults are in `lib/site.ts`.
`normalizeContent()` (`lib/content.ts`) merges stored content over the defaults section by section, so fields added
later get their default and one broken section never blanks the page.

**Cache.** `getSiteContent()` and the home page itself use `"use cache"` + `cacheTag("site-content")` +
`cacheLife("hours")`. Every save or restore calls `updateTag("site-content")`, so the public page is regenerated
on the next request and is otherwise served from cache. The hourly refresh also keeps the specials dates and the
footer year current; the specials bar additionally re-checks its dates in the browser before paint.

**Admin auth.**

- `/admin/login` posts to the `login` Server Action. The session is a JWT (jose, HS256, `SESSION_SECRET`) in an
  httpOnly, Secure, SameSite=Lax cookie that lasts 7 days.
- `proxy.ts` checks the JWT signature for `/admin/**` and `/api/admin/**` and redirects (or returns 401). That's only
  the first line of defence. Every admin page, Server Action and route handler loads the user again from
  `auth/users.json` (`lib/auth.ts`) and checks the role and session version. Bumping the session version on a
  password change or reset signs that person out everywhere.
- Server Actions get Next's built-in Origin check; the upload route handler checks `Origin` itself.
- Roles: `owner` can do everything; `editor` can't open Contact form emails or People, and the server refuses those actions.
- The public page shows signed-in people an "Edit this part" bar. It reads a non-httpOnly hint cookie
  (`lib/editor-hint.ts`) that `proxy.ts` sets next to a valid session; the hint grants nothing.

**How the panel is organised.** `lib/screens.ts` defines one admin screen per part of the homepage, in page order,
plus business details and tools. Each screen lists the content paths it edits ("scopes"), so a section's photo is
edited on the same screen as its words. `saveScreen` writes only those paths onto the currently stored content, and
refuses (unless the person confirms) if someone else saved them after the screen was opened. Field labels and help
are in `components/admin/screen-fields.ts`. Each screen shows a live preview: `app/admin/preview` draws the real
section components from the unsaved draft, sent over `postMessage` (`components/admin/PreviewFrame.tsx` and
`PreviewCanvas.tsx`); the start screen uses the same frame as a clickable map of the homepage. Version history
works out what each save changed (`lib/diff.ts`), which also powers "Undo this change".

**Uploads.** With a Blob store, the browser uploads straight to Blob (`app/api/admin/upload`): with a client token
(`handleUpload`) when `BLOB_READ_WRITE_TOKEN` is set, or with a presigned URL (`handleUploadPresigned` +
`issueSignedToken`) when the store is connected through Vercel OIDC. Auth is checked before either is handed out.
In local mode the browser posts
the file to the same route, which checks it really is a JPEG, PNG or WebP. Limits: those three types, 8 MB. A
replaced photo is deleted once no saved version uses it any more (so going back to a version never shows a broken image).

### Add a new editable field

1. **Schema:** add it to the right section in `lib/content-schema.ts` (with a max length or other limits).
2. **Default:** add its starting value in `lib/site.ts`. Existing saved content picks this up automatically.
3. **Form:** describe it in `components/admin/screen-fields.ts`, in the block of the screen that shows that part of
   the page (label, help text). If it lives outside that screen's paths, add the path to the screen's `scopes` in
   `lib/screens.ts`. Field kinds are rendered by `components/admin/fields.tsx`.
4. **Component:** read it from props in the public component, passed down from `app/page.tsx`.

Run `npm run build`; the types will point at anything you missed.

### Back up the content

In Vercel, open **Storage**, then the Blob store, and download `content/site.json` (and the `media/` photos) from its file list.
From a terminal with the token (`vercel env pull`), any script using `@vercel/blob`'s `get()` with
`access: "private"` works too. The admin panel's change history already keeps the last 20 saves.

## What's where

| Path | What |
| --- | --- |
| `app/page.tsx` | Home page: reads content, renders sections, builds the SelfStorage JSON-LD (office hours, prices as offers) |
| `components/` | One file per public section; all take content as props |
| `app/admin/` | Admin panel: `login/`, `(panel)/` screens, `actions.ts` (every Server Action), `admin.css` |
| `components/admin/` | Admin UI: `screen-fields.ts` (fields per screen), `ScreenEditor.tsx`, `fields.tsx`, `PreviewFrame.tsx` / `PreviewCanvas.tsx` (live preview), `HomeMap.tsx`, `FindBox.tsx` (search), `Mentions.tsx`, `PhotoField.tsx`, people, history |
| `lib/` | `content-schema.ts`, `screens.ts` (admin screens), `content.ts`, `diff.ts`, `storage.ts`, `auth.ts`, `session-token.ts`, `editor-hint.ts`, `media.ts`, `format.ts`, `site.ts` (defaults), `brand.ts`, `nav.ts` |
| `proxy.ts` | Session check in front of `/admin` and `/api/admin` |
| `app/media/[...path]/route.ts` | Serves uploaded photos from the private store |
| `app/api/contact/route.ts` | Contact form email through Resend, with a hidden spam trap |
| `app/employee/page.tsx` | The old site's staff schedule (Google Calendar embed). Not linked anywhere and `noindex` |
| `next.config.ts` | Cache Components, image sources, 308 redirects from the old WordPress URLs |

Payments and reservations stay on the existing Storedge and Quikstor portals; the site only links to them.

## Before launch, confirm with the client

- Unit sizes: the old site only stated "5×5 to 20×20". 5×10, 10×15 and 10×20 are placeholders. Prices and office
  hours are empty until the owner enters them in the admin panel.
- Free moving truck: mentioned for the company's locations generally; confirm it applies in Tulare.
- Photos and the real logo (see below).

## Photos

The four default photos are Unsplash placeholders (free for commercial use): hero and door by Adam Winger, drive-up
shot by Moj Box. The owner replaces them in the admin panel (each section's screen, or **All photos**); `lib/site.ts` notes which photo on the old
WordPress site belongs in each slot. Download those before the domain moves (the WordPress server goes away at
launch, so don't hotlink). Once no default in `lib/site.ts` points at Unsplash, remove `images.unsplash.com` from
`next.config.ts`. The real logo (`/wp-content/uploads/2020/06/RSSlogo.png`) replaces `components/Mark.tsx` and `app/icon.svg`.

## Design

White and navy palette (`#0b1a33` navy, `#1d5bff` blue for actions, `#f4f7fb` section tint), Schibsted Grotesk
self-hosted through Fontsource. Colors, the fluid type scale, spacing, radii and shadows are CSS variables at the
top of `app/globals.css`; the admin panel (`app/admin/admin.css`) reuses them.

Motion: the hero animates in with plain CSS on first paint; sections below reveal as they scroll into view
(`components/Motion.tsx`, rendered inside the page so it runs after hydration). An inline script in
`app/layout.tsx` adds a `js` class before paint so content is only hidden when the reveal script can run, and is
un-hidden after 4s if the app bundle fails to load. Everything is static for visitors with "reduce motion" on.
