// Reading and saving the website content (content/site.json), its version history, and cleanup of photos
// that nothing uses any more.
import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { sectionKeys, sectionSchemas, siteContentSchema, type SectionKey, type SiteContent } from "./content-schema";
import type { ScreenKey } from "./screens";
import { changedPaths } from "./diff";
import { defaultContent } from "./site";
import { deleteFiles, listFiles, readJSON, writeJSON } from "./storage";

export const CONTENT_TAG = "site-content";
const CONTENT_PATH = "content/site.json";
const HISTORY_PREFIX = "content/history/";
const HISTORY_KEEP = 20;
const MEDIA_PREFIX = "media/";

type Editor = { email: string; name: string };
export type HistoryEntry = {
  savedAt: string;
  savedBy: Editor;
  /** The admin screen that was saved (older entries name a whole content section), or a restore. */
  section: ScreenKey | SectionKey | "restore";
  note?: string;
  content: SiteContent;
};
/** `changes`: what this save changed compared with the version before it (null for the oldest kept version). */
export type HistoryItem = Omit<HistoryEntry, "content"> & { id: string; changes: (string | number)[][] | null };

const isPlainObject = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);

/** Stored values win; anything missing (for example a field added after the last save) comes from the defaults. */
function mergeDefaults(base: unknown, stored: unknown): unknown {
  if (isPlainObject(base) && isPlainObject(stored)) {
    const out: Record<string, unknown> = { ...base };
    for (const [k, v] of Object.entries(stored)) out[k] = k in base ? mergeDefaults(base[k], v) : v;
    return out;
  }
  return stored === undefined ? base : stored;
}

/** Turns whatever is stored into valid content, section by section, so one bad section never blanks the page. */
export function normalizeContent(raw: unknown): SiteContent {
  const stored = isPlainObject(raw) ? raw : {};
  const out = { version: 1 } as Record<string, unknown>;
  for (const key of sectionKeys) {
    const merged = mergeDefaults(defaultContent[key], stored[key]);
    const parsed = sectionSchemas[key].safeParse(merged);
    if (!parsed.success) console.error(`Stored "${key}" content is invalid; using defaults.`, parsed.error.issues);
    out[key] = parsed.success ? parsed.data : defaultContent[key];
  }
  return out as SiteContent;
}

/** Uncached read, for the admin panel and the contact form. */
export async function readContent(): Promise<SiteContent> {
  try {
    return normalizeContent(await readJSON(CONTENT_PATH));
  } catch (err) {
    console.error("Couldn't read website content; showing defaults.", err);
    return defaultContent;
  }
}

/** Cached read for the public page. Saving content calls updateTag(CONTENT_TAG), so edits show within seconds. */
export async function getSiteContent(): Promise<SiteContent> {
  "use cache";
  cacheLife("hours");
  cacheTag(CONTENT_TAG);
  return readContent();
}

/** The content exactly as stored (not filled in from defaults), or null when nothing has been saved yet. */
export async function readStoredContent(): Promise<unknown> {
  return readJSON(CONTENT_PATH);
}

/**
 * Adds a version to history without changing the live content, for example a snapshot taken before a scripted
 * update, so the admin panel's history can put it back.
 */
export async function recordVersion(content: unknown, meta: { by: Editor; note: string }): Promise<void> {
  const savedAt = new Date().toISOString();
  const entry = { savedAt, savedBy: meta.by, section: "restore" as const, note: meta.note, content };
  await writeJSON(`${HISTORY_PREFIX}${savedAt.replace(/[:.]/g, "-")}.json`, entry);
}

/** Validates and saves the whole content, records a version, prunes old versions and unused photos. */
export async function saveContent(next: SiteContent, meta: { by: Editor; section: HistoryEntry["section"]; note?: string }) {
  const content = siteContentSchema.parse(next);
  await writeJSON(CONTENT_PATH, content);

  const savedAt = new Date().toISOString();
  const entry: HistoryEntry = { savedAt, savedBy: meta.by, section: meta.section, note: meta.note, content };
  await writeJSON(`${HISTORY_PREFIX}${savedAt.replace(/[:.]/g, "-")}.json`, entry);

  // Housekeeping never fails a save that already succeeded.
  try {
    const retained = await pruneHistory();
    await deleteUnusedPhotos(content, retained);
  } catch (err) {
    console.error("History or photo cleanup failed (the save itself succeeded).", err);
  }
  return content;
}

async function historyFiles() {
  const files = await listFiles(HISTORY_PREFIX);
  return files.filter((f) => f.pathname.endsWith(".json")).sort((a, b) => b.pathname.localeCompare(a.pathname));
}

/** Keeps the newest 20 versions and returns them. */
async function pruneHistory(): Promise<HistoryEntry[]> {
  const files = await historyFiles();
  await deleteFiles(files.slice(HISTORY_KEEP).map((f) => f.pathname));
  const kept = await Promise.all(files.slice(0, HISTORY_KEEP).map((f) => readJSON<HistoryEntry>(f.pathname)));
  return kept.filter((e): e is HistoryEntry => e !== null);
}

/** Uploaded files a version uses: the four photos and the logo (older versions may have no logo yet). */
const mediaPaths = (c: SiteContent) =>
  [...Object.values(c.photos).map((p) => p.src), c.navbar?.logo?.src ?? ""]
    .filter((src) => src.startsWith("/media/"))
    .map((src) => src.slice(1));

/**
 * Deletes uploaded photos that neither the live content nor any kept version uses. A replaced photo therefore
 * stays until the last version that shows it drops out of history, so "Restore this version" never brings
 * back a broken image. Uploads younger than a day are left alone (they may belong to an unsaved edit).
 */
async function deleteUnusedPhotos(current: SiteContent, history: HistoryEntry[]) {
  const used = new Set([current, ...history.map((h) => h.content)].flatMap(mediaPaths));
  const dayAgo = Date.now() - 24 * 60 * 60 * 1000;
  const unused = (await listFiles(MEDIA_PREFIX)).filter((f) => !used.has(f.pathname) && f.uploadedAt.getTime() < dayAgo);
  await deleteFiles(unused.map((f) => f.pathname));
}

export async function listHistory(): Promise<HistoryItem[]> {
  const files = (await historyFiles()).slice(0, HISTORY_KEEP + 1); // one extra, to describe the oldest shown save
  const entries = await Promise.all(
    files.map(async (f) => {
      const e = await readJSON<HistoryEntry>(f.pathname);
      return e && { ...e, id: f.pathname.slice(HISTORY_PREFIX.length), content: normalizeContent(e.content) };
    }),
  );
  const items: HistoryItem[] = [];
  entries.slice(0, HISTORY_KEEP).forEach((e, i) => {
    if (!e) return;
    const before = entries[i + 1];
    const { content, ...meta } = e;
    items.push({ ...meta, changes: before ? changedPaths(before.content, content) : null });
  });
  return items;
}

/** A saved version and the one saved just before it (null if that one is no longer kept). */
export async function readHistoryPair(id: string): Promise<{ entry: HistoryEntry; previous: HistoryEntry | null } | null> {
  if (!/^[0-9TZ-]+\.json$/.test(id)) return null;
  const files = await historyFiles();
  const i = files.findIndex((f) => f.pathname === `${HISTORY_PREFIX}${id}`);
  if (i === -1) return null;
  const [entry, previous] = await Promise.all([readJSON<HistoryEntry>(files[i].pathname), files[i + 1] ? readJSON<HistoryEntry>(files[i + 1].pathname) : null]);
  return entry && { entry, previous };
}

export async function readHistoryEntry(id: string): Promise<HistoryEntry | null> {
  if (!/^[0-9TZ-]+\.json$/.test(id)) return null;
  return readJSON<HistoryEntry>(`${HISTORY_PREFIX}${id}`);
}
