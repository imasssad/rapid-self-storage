# Handover

One page for anyone taking over the Rapid Self Storage website.

## Where things are

| What | Where |
| --- | --- |
| Code | GitHub: `imasssad/rapid-self-storage`. `main` is what's live; every branch and pull request gets a Vercel preview. |
| Hosting | Vercel project connected to that repo. A push to `main` deploys; no build settings, no `vercel.json`. |
| Website content and history | Vercel Blob store (private) connected to the project: `content/site.json` and `content/history/`. |
| Photos | The same Blob store, under `media/`. |
| Admin users | The same Blob store, `auth/users.json` (bcrypt hashes only). |
| Contact form email | Resend (`RESEND_API_KEY`), sending as `CONTACT_FROM_EMAIL`. |
| Payments and reservations | Not part of this site: the Storedge rental center (pay, log in, move in). The site only links to it. |
| Domain and DNS | `rapidselfstorage.com` at the registrar; points at Vercel once the switch from the old WordPress site is approved. |

The README covers architecture, local development and how to add an editable field. ADMIN-GUIDE.md is the owner's guide.

## Accounts the owner must own

These should be in the business's name, with the owner as admin, not in a developer's personal account:

- **GitHub:** the account or organization that owns the repository.
- **Vercel:** the team that owns the project (hosting, the Blob store, environment variables, domains).
- **Domain registrar:** `rapidselfstorage.com`.
- **Resend:** the contact form email account and its verified domain.
- **Storedge:** already the business's own.

Developers are invited to these accounts; they don't own them.

## Giving a new developer access

1. **GitHub:** repository → **Settings → Collaborators** (or the organization's **People**), then invite them
   with write access.
2. **Vercel:** team → **Settings → Members**, then invite them as a Member (Owner only if they must manage billing).
   That gives them the project, its environment variables and the Blob store.
3. **Admin panel:** an owner signs in at `/admin`, opens **People**, and adds them as an Editor (or an Owner if they
   need to manage people). Remove them there when the work ends.
4. **Local setup:** they clone the repo and run `vercel env pull .env.local` to get the real settings, or copy
   `.env.example` to `.env.local` to work against the local `.data/` folder instead.

## If the owner is locked out

- Another owner can reset the password under **People**.
- If there's no other owner, a developer with Vercel access can do it. Download `auth/users.json` from the Blob
  store, then either replace the owner's `passwordHash` with a new bcrypt hash and add 1 to `sv`, or delete the file
  entirely. Deleting it makes the next login with `ADMIN_EMAIL` / `ADMIN_PASSWORD` (set them again in Vercel and
  redeploy) recreate the owner; other users would need to be added again.
- Too many wrong passwords lock that email for 15 minutes. It clears on its own, or delete
  `auth/attempts/<sha256 of the email>.json` from the store.
