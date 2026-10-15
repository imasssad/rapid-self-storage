"use server";

// Every admin change goes through these Server Actions. Each one checks the session and role itself
// (never relying on proxy.ts alone); Next.js checks the Origin header of Server Action requests.
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import {
  AuthError,
  MIN_PASSWORD,
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
  startSession,
  type Role,
  type StoredUser,
} from "@/lib/auth";
import { CONTENT_TAG, normalizeContent, readContent, readHistoryEntry, saveContent } from "@/lib/content";
import { fieldErrors, isSectionKey, ownerOnlySections, sectionSchemas, type SiteContent } from "@/lib/content-schema";
import bcrypt from "bcryptjs";

export type ActionResult = { ok: true; message?: string } | { ok: false; error: string; fieldErrors?: Record<string, string> };

const fail = (error: string, errors?: Record<string, string>): ActionResult => ({ ok: false, error, fieldErrors: errors });

async function guarded(fn: () => Promise<ActionResult>): Promise<ActionResult> {
  try {
    return await fn();
  } catch (err) {
    if (err instanceof AuthError) return fail(err.message);
    console.error(err);
    return fail("Something went wrong and nothing was saved. Try again in a minute.");
  }
}

// ---- Signing in and out ----

export async function login(_prev: { error?: string } | undefined, formData: FormData): Promise<{ error?: string }> {
  const email = normalizeEmail(formData.get("email"));
  const password = String(formData.get("password") ?? "").slice(0, 200);
  const generic = { error: "Email or password is incorrect." };
  if (!email || !password) return generic;

  try {
    const locked = await lockoutMinutes(email);
    if (locked) return { error: `Too many attempts. For your security, sign-in is paused for ${locked} minutes.` };

    const user = await checkCredentials(email, password);
    if (!user) {
      const lockedNow = await recordFailure(email);
      return lockedNow
        ? { error: `Too many attempts. For your security, sign-in is paused for ${lockedNow} minutes.` }
        : generic;
    }
    await clearFailures(email);
    await startSession(user);
  } catch (err) {
    console.error(err);
    return { error: "Signing in isn't working right now. Try again in a minute." };
  }
  redirect("/admin");
}

export async function logout(): Promise<void> {
  await endSession();
  redirect("/admin/login");
}

// ---- Website text ----

export async function saveSection(section: string, data: unknown): Promise<ActionResult> {
  return guarded(async () => {
    if (!isSectionKey(section)) return fail("That part of the website doesn't exist.");
    const user = await requireUserFor(ownerOnlySections.includes(section) ? "owner" : "any");

    const parsed = sectionSchemas[section].safeParse(data);
    if (!parsed.success) return fail("Some fields need attention.", fieldErrors(parsed.error));

    let value = parsed.data;
    if (section === "photos") {
      // An uploaded photo replaces a placeholder, so its "Photo: … on Unsplash" credit no longer applies.
      const photos = { ...(value as SiteContent["photos"]) };
      for (const k of Object.keys(photos) as (keyof typeof photos)[]) {
        if (photos[k].src.startsWith("/media/")) photos[k] = { ...photos[k], credit: "" };
      }
      value = photos;
    }

    const current = await readContent();
    await saveContent({ ...current, [section]: value }, { by: { email: user.email, name: user.name }, section });
    updateTag(CONTENT_TAG);
    return { ok: true };
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
    const when = new Date(entry.savedAt).toLocaleString("en-US", { timeZone: "America/Los_Angeles", dateStyle: "medium", timeStyle: "short" });
    await saveContent(restored, { by: { email: user.email, name: user.name }, section: "restore", note: `Restored the version from ${when}` });
    updateTag(CONTENT_TAG);
    return { ok: true, message: `Restored the version from ${when}. Your website is updated.` };
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
