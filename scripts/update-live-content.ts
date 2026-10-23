// One-off update of the live saved content: point the business's portal links (Reserve, Pay, each location's
// login) at the Storedge rental center, replacing the dead links to the old reservation portal, and swap out
// the gravel placeholder photo. The site reads content saved through the admin panel, so the code defaults alone
// don't change what visitors see.
//
// It reads and writes through lib/content.ts and lib/storage.ts, the same code the admin panel uses, and changes
// only link and photo fields that still hold an old value. Everything else in the saved content stays as it is.
//
// 1. Get the production settings (BLOB_STORE_ID and VERCEL_OIDC_TOKEN, or BLOB_READ_WRITE_TOKEN):
//      vercel env pull --environment=production .env.production.local
// 2. Dry run. Prints the exact before/after of every field it would change. Writes nothing:
//      NODE_OPTIONS=--conditions=react-server npx tsx@4.19.2 scripts/update-live-content.ts --env .env.production.local
// 3. Only after checking that output, write it:
//      NODE_OPTIONS=--conditions=react-server npx tsx@4.19.2 scripts/update-live-content.ts --env .env.production.local --write
//
// Writing first saves the current content to version history ("Snapshot before the Storedge link and photo
// update"), so "Go back to this version" in the admin panel undoes everything. `--local` runs against .data/.
import { promises as fs } from "node:fs";
import path from "node:path";

type Json = null | boolean | number | string | Json[] | { [key: string]: Json };
type Change = { path: (string | number)[]; before: Json | undefined; after: Json | undefined; why: string };

const args = process.argv.slice(2);
const write = args.includes("--write");
const local = args.includes("--local");
const envFile = args.includes("--env") ? args[args.indexOf("--env") + 1] : undefined;
if (envFile) process.loadEnvFile(envFile);

/** Placeholder photos that must not stay on the site (the drive-up one shows a gravel lot). */
const RETIRED_PHOTOS = ["photo-1696976004001-e714f32f2fa5"];

const BY = { email: "website-update-script", name: "Website update script" };

async function main() {
  // Imported after the env file is loaded, so the storage module sees the production settings.
  const { normalizeContent, readStoredContent, recordVersion, saveContent } = await import("../lib/content");
  const { changedPaths } = await import("../lib/diff");
  const { mediaPathFor } = await import("../lib/media");
  const { defaultContent } = await import("../lib/site");
  const { storageMode, writeFile } = await import("../lib/storage");

  const mode = storageMode();
  if (mode === "local" && !local) {
    throw new Error("No Blob store settings found. Pass --env with the file from `vercel env pull`, or --local to use .data/.");
  }
  console.log(`Storage: ${mode === "blob" ? `Vercel Blob${process.env.BLOB_STORE_ID ? ` (store ${process.env.BLOB_STORE_ID})` : ""}` : "local .data/"}`);
  console.log(write ? "Mode: WRITE\n" : "Mode: dry run (nothing is written)\n");

  const stored = (await readStoredContent()) as { [key: string]: Json } | null;
  if (!stored) {
    console.log("Nothing has been saved yet, so the site shows the built-in defaults, which already have the new links.");
    return;
  }

  // The new values come from the defaults in lib/site.ts, where each link is written once.
  const NEW = {
    reserve: defaultContent.contact.reserveUrl,
    pay: defaultContent.contact.payUrl,
    location: (name: string) => defaultContent.locations.items.find((l) => !l.highlight && sameLocation(l.name, name))?.buttonUrl,
  };

  // The portal links must point to the Storedge rental center. Anything else in those fields is the old, dead
  // portal; its address is remembered so the same dead site can be found anywhere else in the content.
  const STOREDGE = new URL(NEW.pay).hostname;
  const deadHosts = new Set<string>();
  const isDead = (url: string) => {
    const host = hostOf(url);
    if (!host || host === STOREDGE) return false;
    deadHosts.add(host);
    return true;
  };
  const onDeadSite = (url: string) => deadHosts.has(hostOf(url) ?? "");

  const next = structuredClone(stored);
  const changes: Change[] = [];
  const decide: string[] = [];
  const at = (p: (string | number)[]) => p.reduce<Json | undefined>((o, k) => (o as Record<string | number, Json> | undefined)?.[k], next);
  const set = (p: (string | number)[], value: Json | undefined, why: string) => {
    const parent = at(p.slice(0, -1)) as Record<string | number, Json>;
    const before = parent[p[p.length - 1]];
    if (value === undefined) delete parent[p[p.length - 1]];
    else parent[p[p.length - 1]] = value;
    changes.push({ path: p, before, after: value, why });
  };

  // Hours, phone, address & links
  const contact = next.contact as Record<string, Json> | undefined;
  if (contact) {
    for (const [key, target] of [["reserveUrl", NEW.reserve], ["payUrl", NEW.pay]] as const) {
      const url = contact[key];
      if (typeof url !== "string") continue;
      if (isDead(url)) set(["contact", key], target, "dead link to the old reservation portal");
      else if (samePage(url, target)) set(["contact", key], target, "same page, now spelled exactly as confirmed");
    }
    if ("sisterLoginUrl" in contact) {
      if (typeof contact.sisterLoginUrl === "string") isDead(contact.sisterLoginUrl);
      set(["contact", "sisterLoginUrl"], undefined, "no longer used: the footer and phone menu now link each Visalia location from its card");
    }
  }

  // Location cards
  const items = ((next.locations as Record<string, Json> | undefined)?.items ?? []) as Record<string, Json>[];
  items.forEach((item, i) => {
    const url = item.buttonUrl;
    if (typeof url !== "string") return;
    const name = String(item.name ?? "");
    if (isDead(url)) {
      const target = item.highlight ? NEW.pay : NEW.location(name);
      if (target) set(["locations", "items", i, "buttonUrl"], target, `dead portal link on the “${name}” card`);
      else decide.push(`locations.items.${i}.buttonUrl (“${name}”) doesn't point to Storedge, and it isn't clear which Storedge page it should open: ${url}`);
    } else if (samePage(url, NEW.pay)) {
      set(["locations", "items", i, "buttonUrl"], NEW.pay, `same page, now spelled exactly as confirmed (“${name}” card)`);
    }
  });

  // Special offer bar: an empty button link already goes to the Reserve page.
  const specials = next.specials as Record<string, Json> | undefined;
  if (specials && typeof specials.buttonUrl === "string" && onDeadSite(specials.buttonUrl)) {
    set(["specials", "buttonUrl"], "", "dead portal link; an empty link sends the button to the Reserve page");
  }

  // Buttons set to "Another web address" on the dead portal: point them at the Reserve page.
  walk(next, [], (value, p) => {
    if (!isObject(value) || value.to !== "link" || typeof value.url !== "string" || !onDeadSite(value.url)) return;
    if (p[0] === "navbar" && p[1] === "links") {
      decide.push(`${p.join(".")} (menu link “${value.label}”) points to the old portal; choose where it should go in Menu bar & logo.`);
      return;
    }
    set([...p, "to"], "reserve", `button “${value.label}” pointed to the old portal; it now follows the Reserve link`);
    set([...p, "url"], "", "");
  });

  // Photos still on a retired placeholder: upload the new photo to the admin panel's storage and use it.
  const photos = (next.photos ?? {}) as Record<string, Record<string, Json>>;
  const uploads: { slot: string; file: string; mediaPath: string }[] = [];
  for (const [slot, photo] of Object.entries(photos)) {
    const src = String(photo?.src ?? "");
    if (!RETIRED_PHOTOS.some((id) => src.includes(id))) continue;
    const replacement = defaultContent.photos[slot as keyof typeof defaultContent.photos];
    if (!replacement?.src.startsWith("/photos/")) {
      decide.push(`photos.${slot} still shows a retired placeholder (${src}), and no replacement photo is in public/photos/ yet.`);
      continue;
    }
    const file = path.join(process.cwd(), "public", replacement.src);
    const mediaPath = mediaPathFor(path.basename(file), "image/jpeg");
    uploads.push({ slot, file, mediaPath });
    set(["photos", slot], { src: `/${mediaPath}`, alt: replacement.alt, credit: replacement.credit }, "retired placeholder photo");
  }

  // Anything on the dead portal that none of the rules above covered.
  walk(next, [], (value, p) => {
    if (typeof value === "string" && onDeadSite(value)) decide.push(`${p.join(".")} still links to the old portal: ${value}`);
  });

  // Report
  if (!changes.length) console.log("No link or photo field needs changing.");
  for (const c of changes.filter((c) => c.why)) {
    console.log(`• ${c.path.join(".")}  (${c.why})`);
    const pair = changes.filter((x) => x.path.slice(0, -1).join(".") === c.path.slice(0, -1).join(".") && !x.why);
    console.log(`    before: ${show(c.before)}${pair.map((x) => `, ${x.path[x.path.length - 1]}: ${show(x.before)}`).join("")}`);
    console.log(`    after:  ${show(c.after)}${pair.map((x) => `, ${x.path[x.path.length - 1]}: ${show(x.after)}`).join("")}`);
  }
  for (const u of uploads) console.log(`• upload ${path.relative(process.cwd(), u.file)} → ${u.mediaPath} (shown in the admin panel's Photos)`);
  if (decide.length) {
    console.log("\nNot changed (needs a decision):");
    for (const d of decide) console.log(`  - ${d}`);
  }
  // Every save stores the full content, so fields added to the site after the last save get their defaults
  // written too. They're already what visitors see.
  const toSave = normalizeContent(next);
  const filled = changedPaths(next, toSave, 200).filter((p) => !changes.some((c) => c.path.join(".") === p.join(".")));
  if (filled.length) {
    console.log(`\nAlso written, because every save stores the full content (already shown on the site, unchanged for visitors):`);
    for (const p of filled) console.log(`  - ${p.join(".")}`);
  }

  if (!write || !changes.length) {
    if (!write && changes.length) console.log("\nDry run: nothing was written. Run again with --write to apply exactly these changes.");
    return;
  }

  // Write: snapshot first, then photos, then the content.
  await recordVersion(stored, { by: BY, note: "Snapshot before the Storedge link and photo update" });
  await new Promise((r) => setTimeout(r, 10)); // distinct history timestamps
  for (const u of uploads) await writeFile(u.mediaPath, await fs.readFile(u.file), "image/jpeg");
  await saveContent(toSave, { by: BY, section: "restore", note: "Updated links to Storedge and replaced placeholder photos" });

  const left: string[] = [];
  walk((await readStoredContent()) as Json, [], (value) => typeof value === "string" && onDeadSite(value) && left.push(value));
  console.log(`\nWritten. ${left.length ? "Warning: links to the old portal are still stored (see above)." : "No link to the old portal is left in the saved content."}`);
  console.log("Visitors see the change within the hour (the page is cached), or right away after the next deploy.");
}

function hostOf(url: string) {
  try {
    return /^https?:/i.test(url) ? new URL(url).hostname : null;
  } catch {
    return null;
  }
}

/** The same address written differently (for example "storedge.com/?" versus "storedge.com?"), but not identical. */
function samePage(a: string, b: string) {
  if (a === b) return false;
  try {
    return new URL(a).href === new URL(b).href;
  } catch {
    return false;
  }
}

function sameLocation(a: string, b: string) {
  const key = (s: string) => s.toLowerCase().replace(/[^a-z]+/g, " ").trim();
  return key(a) === key(b) || key(b).includes(key(a)) || key(a).includes(key(b));
}

function isObject(v: Json | undefined): v is { [key: string]: Json } {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function walk(v: Json | undefined, p: (string | number)[], visit: (value: Json | undefined, p: (string | number)[]) => void) {
  visit(v, p);
  if (Array.isArray(v)) v.forEach((x, i) => walk(x, [...p, i], visit));
  else if (isObject(v)) for (const [k, x] of Object.entries(v)) walk(x, [...p, k], visit);
}

function show(v: Json | undefined) {
  return v === undefined ? "(removed)" : JSON.stringify(v);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
