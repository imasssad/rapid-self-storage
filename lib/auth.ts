// Admin users, logins and sessions. Users live in auth/users.json (bcrypt hashes only, never passwords);
// failed logins are counted in storage because serverless memory doesn't survive between requests.
import "server-only";
import { createHash, timingSafeEqual } from "node:crypto";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { SESSION_COOKIE, SESSION_MAX_AGE, signSession, verifySession, type Role } from "./session-token";
import { deleteFiles, readJSON, writeJSON } from "./storage";

export type { Role };
export type StoredUser = {
  email: string;
  name: string;
  role: Role;
  passwordHash: string;
  /** Bumped on password change or reset, which signs that user out everywhere. */
  sv: number;
  createdAt: string;
};
export type User = Omit<StoredUser, "passwordHash">;

const USERS_PATH = "auth/users.json";
const BCRYPT_ROUNDS = 12;
export const MIN_PASSWORD = 10;
const MAX_FAILURES = 5;
const WINDOW_MS = 15 * 60 * 1000;
// A real hash of a random string, compared against when the email doesn't exist so timing doesn't reveal it.
const DUMMY_HASH = "$2b$12$GVZ1RW58gNWLV4LONETGP.QXzZJsRS0nqAndpz2.N1/XxbBVehDVe";

export const normalizeEmail = (v: unknown) => String(v ?? "").trim().toLowerCase().slice(0, 200);
const strip = ({ passwordHash: _hash, ...user }: StoredUser): User => user;

export async function loadUsers(): Promise<StoredUser[] | null> {
  const data = await readJSON<{ users: StoredUser[] }>(USERS_PATH);
  return data?.users ?? null;
}

export async function saveUsers(users: StoredUser[]): Promise<void> {
  await writeJSON(USERS_PATH, { users });
}

export const hashPassword = (password: string) => bcrypt.hash(password, BCRYPT_ROUNDS);

/** "eric.smith@example.com" → "Eric", so the first owner is greeted by name. */
function nameFromEmail(email: string): string {
  const first = email.split("@")[0].split(/[._+-]/)[0] || "Owner";
  return first.charAt(0).toUpperCase() + first.slice(1);
}

function sameString(a: string, b: string): boolean {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

/**
 * Checks an email and password. On the very first login (no users file yet) the owner is created from
 * ADMIN_EMAIL / ADMIN_PASSWORD; after that those variables are ignored.
 */
export async function checkCredentials(email: string, password: string): Promise<StoredUser | null> {
  const users = await loadUsers();
  if (users === null) {
    const envEmail = normalizeEmail(process.env.ADMIN_EMAIL);
    const envPassword = process.env.ADMIN_PASSWORD ?? "";
    if (!envEmail || envPassword.length < MIN_PASSWORD) return null;
    if (!sameString(email, envEmail) || !sameString(password, envPassword)) return null;
    const owner: StoredUser = {
      email: envEmail,
      name: nameFromEmail(envEmail),
      role: "owner",
      passwordHash: await hashPassword(password),
      sv: 1,
      createdAt: new Date().toISOString(),
    };
    await saveUsers([owner]);
    return owner;
  }
  const user = users.find((u) => u.email === email);
  const ok = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH);
  return user && ok ? user : null;
}

// ---- Login attempts ----

type Attempts = { failures: number[]; lockedUntil?: number };
const attemptsPath = (email: string) => `auth/attempts/${createHash("sha256").update(email).digest("hex")}.json`;

/** Minutes left on a lockout, or 0. */
export async function lockoutMinutes(email: string): Promise<number> {
  const a = await readJSON<Attempts>(attemptsPath(email));
  const left = (a?.lockedUntil ?? 0) - Date.now();
  return left > 0 ? Math.ceil(left / 60000) : 0;
}

/** Records a failed login; returns minutes locked if this failure triggered the lock. */
export async function recordFailure(email: string): Promise<number> {
  const now = Date.now();
  const a = (await readJSON<Attempts>(attemptsPath(email))) ?? { failures: [] };
  const failures = [...a.failures.filter((t) => now - t < WINDOW_MS), now];
  const locked = failures.length >= MAX_FAILURES;
  await writeJSON(attemptsPath(email), locked ? { failures: [], lockedUntil: now + WINDOW_MS } : { failures });
  return locked ? WINDOW_MS / 60000 : 0;
}

export async function clearFailures(email: string): Promise<void> {
  await deleteFiles([attemptsPath(email)]);
}

// ---- Sessions ----

export async function startSession(user: StoredUser): Promise<void> {
  const token = await signSession({ email: user.email, role: user.role, sv: user.sv });
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function endSession(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
}

/** The signed-in user, re-checked against the users file (so removed users and old passwords are refused). */
export const getCurrentUser = cache(async (): Promise<User | null> => {
  const claims = await verifySession((await cookies()).get(SESSION_COOKIE)?.value);
  if (!claims) return null;
  const users = await loadUsers();
  const user = users?.find((u) => u.email === claims.email);
  if (!user || user.sv !== claims.sv) return null;
  return strip(user);
});

/** For pages: the user, or a redirect to the login screen. */
export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  return user;
}

export class AuthError extends Error {}

/** For Server Actions and route handlers: the user (with the needed role), or an AuthError. */
export async function requireUserFor(role: Role | "any" = "any"): Promise<User> {
  const user = await getCurrentUser();
  if (!user) throw new AuthError("You've been signed out. Sign in again and retry.");
  if (role === "owner" && user.role !== "owner") throw new AuthError("Only an owner can do that.");
  return user;
}
