// Staff accounts for the admin. Pure: node:crypto only, no Next imports (proxy.ts reaches this through token.ts).
//
// Personal accounts: ADMIN_USERS lists `email:hash` entries separated by commas, semicolons or new lines, where
// hash is an s1 scrypt hash from `node scripts/hash-admin-password.mjs` (never a plain password), e.g.
//   ADMIN_USERS=ana@example.com:s1.<salt>.<key>,ben@example.com:s1.<salt>.<key>
// Legacy: when ADMIN_USERS is unset or blank, the single shared ADMIN_PASSWORD signs everyone in, as before.
// When ADMIN_USERS is set, ADMIN_PASSWORD is ignored; if no ADMIN_USERS entry is valid, nobody can sign in (fails
// closed rather than falling back to the shared password).
import { createHash, timingSafeEqual } from "node:crypto";
import { hashPassword, isPasswordHash, verifyPassword } from "./password";

export type AuthMode = "personal" | "shared";
/** Identity recorded for sessions opened with the legacy shared ADMIN_PASSWORD. Not an email, so it never collides. */
export const SHARED_STAFF_ID = "shared-password";

const MAX_EMAIL = 254;
const EMAIL = /^[^\s@:,;]+@[^\s@:,;]+$/;

export const normaliseEmail = (email: string) => email.trim().toLowerCase();
export const sharedPassword = () => process.env.ADMIN_PASSWORD ?? "";
const rawUsers = () => (process.env.ADMIN_USERS ?? "").trim();

export const authMode = (): AuthMode => (rawUsers() ? "personal" : "shared");

/** Parses ADMIN_USERS into email → hash. Malformed entries are skipped (and counted, never echoed). */
export function parseAdminUsers(raw: string): { users: Map<string, string>; invalid: number } {
  const users = new Map<string, string>();
  let invalid = 0;
  for (const entry of raw.split(/[,;\r\n]+/)) {
    const item = entry.trim();
    if (!item) continue;
    // The hash is base64url and dots only, so the last colon separates it from the email.
    const at = item.lastIndexOf(":");
    const email = normaliseEmail(item.slice(0, Math.max(at, 0)));
    const hash = item.slice(at + 1).trim();
    if (at <= 0 || email.length > MAX_EMAIL || !EMAIL.test(email) || !isPasswordHash(hash)) {
      invalid += 1;
      continue;
    }
    users.set(email, hash);
  }
  return { users, invalid };
}

// Re-parsed only when the env value changes (proxy and every admin request read it).
let cached: { raw: string; users: Map<string, string> } | null = null;
let warned = "";

/** The configured personal accounts (empty in legacy shared-password mode). */
export function staffUsers(): Map<string, string> {
  const raw = rawUsers();
  if (cached?.raw === raw) return cached.users;
  const { users, invalid } = parseAdminUsers(raw);
  if (invalid > 0 && warned !== raw) {
    warned = raw;
    console.warn(`[admin-auth] ADMIN_USERS: ignored ${invalid} malformed entr${invalid === 1 ? "y" : "ies"} (expected email:s1.<salt>.<key>).`);
  }
  cached = { raw, users };
  return users;
}

/** Constant-time shared-password check over sha256 digests (equal lengths by construction). */
function sharedPasswordMatches(input: string): boolean {
  const expected = sharedPassword();
  if (!expected) return false;
  const digest = (v: string) => createHash("sha256").update(v, "utf8").digest();
  return timingSafeEqual(digest(typeof input === "string" ? input : ""), digest(expected));
}

// Unknown emails still pay for one scrypt run, so response time doesn't reveal which emails have accounts.
let dummyHash: Promise<string> | null = null;
const dummy = () => (dummyHash ??= hashPassword(createHash("sha256").update(String(Math.random())).digest("hex")));

/**
 * Checks a sign-in. Returns the staff identity to record in the session (the lower-cased email in personal mode,
 * SHARED_STAFF_ID in legacy mode), or null. Callers must check adminConfigured() first.
 */
export async function checkCredentials(email: string, password: string): Promise<string | null> {
  if (typeof password !== "string" || !password) return null;
  if (authMode() === "shared") return sharedPasswordMatches(password) ? SHARED_STAFF_ID : null;
  const key = normaliseEmail(typeof email === "string" ? email : "");
  const stored = staffUsers().get(key);
  const ok = await verifyPassword(password, stored ?? (await dummy()));
  return stored && ok ? key : null;
}
