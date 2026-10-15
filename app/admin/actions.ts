"use server";

// Every admin change goes through these Server Actions. Each one checks the session and role itself
// (never relying on proxy.ts alone); Next.js checks the Origin header of Server Action requests.
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import {
  AuthError,
  MIN_PASSWORD,
  SetupError,
  checkCredentials,
  clearFailures,
  endSession,
  hashPassword,
  loadUsers,
  lockoutMinutes,
  normalizeEmail,
  recordFailure,
  requireUserFor,
  saveUsers,
  signInSetupProblem,
  startSession,
  type Role,
  type StoredUser,
} from "@/lib/auth";
import { CONTENT_TAG, listHistory, normalizeContent, readContent, readHistoryEntry, readHistoryPair, saveContent } from "@/lib/content";
import { fieldErrors, sectionSchemas, siteContentSchema, type SectionKey } from "@/lib/content-schema";
import { changedPaths } from "@/lib/diff";
import { getAt, isScreenKey, screens, setAt } from "@/lib/screens";
import { BlobError } from "@vercel/blob";
import bcrypt from "bcryptjs";

/** `conflict`: someone else saved this part after it was opened (see saveScreen). */
type Failure = { ok: false; error: string; fieldErrors?: Record<string, string>; conflict?: boolean };
export type ActionResult = { ok: true; message?: string } | Failure;
/** A saved screen returns the values as stored, so the editor shows exactly what the website now uses. */
export type SaveResult = { ok: true; values: unknown[] } | Failure;

const fail = (error: string, errors?: Record<string, string>): Failure => ({ ok: false, error, fieldErrors: errors });

async function guarded<T extends ActionResult | SaveResult>(fn: () => Promise<T>): Promise<T | Failure> {
  try {
    return await fn();
  } catch (err) {
    if (err instanceof AuthError) return fail(err.message);
    console.error(err);
    return fail("Something went wrong and nothing was saved. Try again in a minute.");
  }
}

// ---- Signing in and out ----

export async function login(_prev: { error?: string; email?: string } | undefined, formData: FormData): Promise<{ error?: string; email?: string }> {
  const typed = String(formData.get("email") ?? "").trim().slice(0, 254);
  const email = normalizeEmail(formData.get("email"));
  const password = String(formData.get("password") ?? "").slice(0, 200);
  // Every error hands the typed email back, so the form keeps it.
  const failed = (error: string) => ({ error, email: typed });
  const generic = failed("Email or password is incorrect.");
  if (!email || !password) return generic;

  // Name a missing setup step (no Blob store, no SESSION_SECRET…) instead of a vague failure.
  const problem = signInSetupProblem();
  if (problem) return failed(problem);

  try {
    const locked = await lockoutMinutes(email);
    if (locked) return failed(`Too many attempts. For your security, sign-in is paused for ${locked} minutes.`);

    const user = await checkCredentials(email, password);
    if (!user) {
      const lockedNow = await recordFailure(email);
      return lockedNow ? failed(`Too many attempts. For your security, sign-in is paused for ${lockedNow} minutes.`) : generic;
    }
    await clearFailures(email);
    await startSession(user);
  } catch (err) {
    console.error(err);
    if (err instanceof SetupError) return failed(err.message);
    if (err instanceof BlobError) {
      return failed(`The Blob store refused the request (${err.message}). Check that it's a Private store connected to this project, then redeploy.`);
    }
    return failed("Signing in isn't working right now. Try again in a minute.");
  }
  redirect("/admin");
}

export async function logout(): Promise<void> {
  await endSession();
  redirect("/admin/login");
}

// ---- Website text ----

const when = (iso: string) =>
  new Date(iso).toLocaleString("en-US", { timeZone: "America/Los_Angeles", dateStyle: "medium", timeStyle: "short" });

/**
 * Saves one admin screen. A screen edits fixed parts of the content (lib/screens.ts), so the browser only sends
 * the values for those parts, in order, and the server decides where they go. Everything else is kept as
 * currently stored, so two people editing different screens never overwrite each other. `base` is what those
 * parts held when the screen was opened: if someone else saved them since, the save stops and says so, unless
 * `force` (the person chose to replace the other version).
 */
export async function saveScreen(screen: string, values: unknown[], base?: unknown[], force = false): Promise<SaveResult> {
  return guarded(async () => {
    if (!isScreenKey(screen)) return fail("That part of the website doesn't exist.");
    const def = screens[screen];
    const user = await requireUserFor(def.ownerOnly ? "owner" : "any");
    if (!Array.isArray(values) || values.length !== def.scopes.length) return fail("Something went wrong and nothing was saved. Reload the page and try again.");

    const current = await readContent();
    if (!force && Array.isArray(base) && JSON.stringify(def.scopes.map((p) => getAt(current, p))) !== JSON.stringify(base)) {
      const [latest] = await listHistory();
      const who = latest && latest.savedBy.email !== user.email ? latest.savedBy.name || latest.savedBy.email : "Someone";
      return {
        ok: false,
        conflict: true,
        error: `${who} saved changes to this part of the website${latest ? ` at ${when(latest.savedAt)}` : ""}, after you opened it. Saving now would replace their changes.`,
      };
    }
    let next = def.scopes.reduce((c, path, i) => setAt(c, path, values[i]), current);

    const touched = [...new Set(def.scopes.map((p) => p[0] as SectionKey))];
    const errors: Record<string, string> = {};
    for (const key of touched) {
      const parsed = sectionSchemas[key].safeParse(next[key]);
      if (!parsed.success) {
        for (const [k, v] of Object.entries(fieldErrors(parsed.error))) errors[k ? `${key}.${k}` : key] = v;
      } else {
        next = { ...next, [key]: parsed.data };
      }
    }
    if (Object.keys(errors).length) return fail("Some fields need attention.", errors);

    if (touched.includes("photos")) {
      // An uploaded photo replaces a placeholder, so its "Photo: … on Unsplash" credit no longer applies.
      const photos = { ...next.photos };
      for (const k of Object.keys(photos) as (keyof typeof photos)[]) {
        if (photos[k].src.startsWith("/media/")) photos[k] = { ...photos[k], credit: "" };
      }
      next = { ...next, photos };
    }

    if (!changedPaths(current, next).length) return { ok: true, values: def.scopes.map((p) => getAt(next, p)) };
    await saveContent(next, { by: { email: user.email, name: user.name }, section: screen });
    updateTag(CONTENT_TAG);
    return { ok: true, values: def.scopes.map((p) => getAt(next, p)) };
  });
}

export async function restoreVersion(id: string): Promise<ActionResult> {
  return guarded(async () => {
    const user = await requireUserFor("any");
    const entry = await readHistoryEntry(id);
    if (!entry) return fail("That version is no longer available.");
    const current = await readContent();
    // Editors can't change settings, so a restore by an editor keeps the current settings.
    const old = normalizeContent(entry.content); // fills in any fields added since that version was saved
    const restored = user.role === "owner" ? old : { ...old, settings: current.settings };
    await saveContent(restored, { by: { email: user.email, name: user.name }, section: "restore", note: `Went back to the version from ${when(entry.savedAt)}` });
    updateTag(CONTENT_TAG);
    return { ok: true, message: `The website is back to how it was at ${when(entry.savedAt)}.` };
  });
}

/**
 * Undoes one save and nothing else: each field that save changed gets back the value it had just before it.
 * Later changes to other fields stay. Saved as a new version, so it can be undone too.
 */
export async function undoChange(id: string): Promise<ActionResult> {
  return guarded(async () => {
    const user = await requireUserFor("any");
    const pair = await readHistoryPair(id);
    if (!pair) return fail("That version is no longer available.");
    if (!pair.previous) return fail("This is the oldest version kept, so there's nothing earlier to go back to.");
    const before = normalizeContent(pair.previous.content);
    const after = normalizeContent(pair.entry.content);
    const paths = changedPaths(before, after, 500).filter((p) => user.role === "owner" || p[0] !== "settings");
    if (!paths.length) return fail("That save didn't change anything you can undo.");

    const current = await readContent();
    const next = paths.reduce((c, p) => setAt(c, p, getAt(before, p)), current);
    if (!siteContentSchema.safeParse(next).success) {
      return fail("This change can't be undone on its own, because the same part was changed again later. Use “Go back to this version” on an earlier save instead.");
    }
    await saveContent(next, { by: { email: user.email, name: user.name }, section: "restore", note: `Undid the change saved at ${when(pair.entry.savedAt)}` });
    updateTag(CONTENT_TAG);
    return { ok: true, message: `Undone. Those fields are back to how they were before ${when(pair.entry.savedAt)}.` };
  });
}

// ---- People ----

const validRole = (r: unknown): r is Role => r === "owner" || r === "editor";

export async function addUser(input: { name: string; email: string; role: string; password: string }): Promise<ActionResult> {
  return guarded(async () => {
    await requireUserFor("owner");
    const name = String(input.name ?? "").trim().slice(0, 80);
    const email = normalizeEmail(input.email);
    const errors: Record<string, string> = {};
    if (!name) errors.name = "Add their name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter a full email address.";
    if (!validRole(input.role)) errors.role = "Choose what they can do.";
    if (String(input.password ?? "").length < MIN_PASSWORD) errors.password = `Use at least ${MIN_PASSWORD} characters.`;
    if (Object.keys(errors).length) return fail("Some fields need attention.", errors);

    const users = (await loadUsers()) ?? [];
    if (users.some((u) => u.email === email)) return fail("Some fields need attention.", { email: "Someone with this email already has access." });
    const user: StoredUser = {
      email,
      name,
      role: input.role as Role,
      passwordHash: await hashPassword(input.password),
      sv: 1,
      createdAt: new Date().toISOString(),
    };
    await saveUsers([...users, user]);
    return { ok: true, message: `${name} can now sign in. Give them their temporary password and ask them to change it.` };
  });
}

export async function resetUserPassword(email: string, password: string): Promise<ActionResult> {
  return guarded(async () => {
    await requireUserFor("owner");
    if (String(password ?? "").length < MIN_PASSWORD) return fail(`Use at least ${MIN_PASSWORD} characters.`);
    const users = (await loadUsers()) ?? [];
    const target = users.find((u) => u.email === normalizeEmail(email));
    if (!target) return fail("That person no longer has access.");
    target.passwordHash = await hashPassword(password);
    target.sv += 1; // signs them out everywhere
    await saveUsers(users);
    await clearFailures(target.email);
    return { ok: true, message: `New temporary password set for ${target.name}.` };
  });
}

export async function removeUser(email: string): Promise<ActionResult> {
  return guarded(async () => {
    const me = await requireUserFor("owner");
    const users = (await loadUsers()) ?? [];
    const target = users.find((u) => u.email === normalizeEmail(email));
    if (!target) return { ok: true };
    if (target.email === me.email) return fail("You can't remove yourself. Ask another owner to do it.");
    if (target.role === "owner" && users.filter((u) => u.role === "owner").length === 1) {
      return fail("There must always be at least one owner.");
    }
    await saveUsers(users.filter((u) => u.email !== target.email));
    return { ok: true, message: `${target.name} no longer has access.` };
  });
}

export async function changeOwnPassword(current: string, next: string): Promise<ActionResult> {
  return guarded(async () => {
    const me = await requireUserFor("any");
    if (String(next ?? "").length < MIN_PASSWORD) return fail("Some fields need attention.", { next: `Use at least ${MIN_PASSWORD} characters.` });
    const users = (await loadUsers()) ?? [];
    const stored = users.find((u) => u.email === me.email);
    if (!stored || !(await bcrypt.compare(String(current ?? ""), stored.passwordHash))) {
      return fail("Some fields need attention.", { current: "That isn't your current password." });
    }
    stored.passwordHash = await hashPassword(next);
    stored.sv += 1; // signs out other devices
    await saveUsers(users);
    await startSession(stored); // keeps this device signed in
    return { ok: true, message: "Your password is changed." };
  });
}
