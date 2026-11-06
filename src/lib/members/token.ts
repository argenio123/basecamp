// HMAC-signed member session tokens. Pure: node:crypto + node:fs only (no Next imports), so it runs in proxy.ts,
// route handlers and server actions alike.
//
// Secret: MEMBER_SESSION_SECRET (≥32 chars). Local development without it falls back to a random secret kept in
// .data/member-secret.txt (gitignored), created on first use. On Vercel without the env var, member login is off.
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

export const MEMBER_COOKIE = "bc_member_session";
/** Non-httpOnly hint so client components can show "Log in" vs "Log out" (never trusted for access). */
export const MEMBER_HINT_COOKIE = "bc_member";
export const MEMBER_TTL_MS = 30 * 24 * 3600 * 1000;

let cachedSecret: string | null = null;

function memberSecret(): string {
  if (cachedSecret) return cachedSecret;
  const env = process.env.MEMBER_SESSION_SECRET ?? "";
  if (env.length >= 32) return (cachedSecret = env);
  if (process.env.VERCEL === "1") return "";
  const file = path.join(process.cwd(), ".data", "member-secret.txt");
  try {
    const existing = fs.readFileSync(file, "utf8").trim();
    if (existing.length >= 32) return (cachedSecret = existing);
  } catch { /* create below */ }
  try {
    const fresh = randomBytes(32).toString("base64url");
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, fresh, { encoding: "utf8", flag: "wx" });
    return (cachedSecret = fresh);
  } catch {
    // Another request created it first: read it back.
    try {
      const again = fs.readFileSync(file, "utf8").trim();
      return again.length >= 32 ? (cachedSecret = again) : "";
    } catch { return ""; }
  }
}

/** True when member sessions can be signed (a secret is available). */
export function membersConfigured(): boolean {
  return memberSecret().length >= 32;
}

const sign = (payload: string) => createHmac("sha256", memberSecret()).update(payload).digest("base64url");

/** `m1.<memberId>.<exp>.<HMAC-SHA256(secret, "m1.<memberId>.<exp>")>` */
export function signMemberSession(memberId: string, now: number): string {
  if (!membersConfigured()) throw new Error("Member login is not configured.");
  if (!/^[A-Za-z0-9-]{8,64}$/.test(memberId)) throw new Error("Bad member id.");
  const exp = now + MEMBER_TTL_MS;
  return `m1.${memberId}.${exp}.${sign(`m1.${memberId}.${exp}`)}`;
}

/** Returns the member id for a valid, unexpired token; null otherwise. */
export function verifyMemberSession(token: string, now: number): string | null {
  if (typeof token !== "string" || !membersConfigured()) return null;
  const parts = token.split(".");
  if (parts.length !== 4 || parts[0] !== "m1" || !/^[A-Za-z0-9-]{8,64}$/.test(parts[1]) || !/^\d{1,16}$/.test(parts[2])) return null;
  const expected = Buffer.from(sign(`m1.${parts[1]}.${parts[2]}`));
  const given = Buffer.from(parts[3]);
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null;
  return Number(parts[2]) > now ? parts[1] : null;
}

/** Only same-site paths: "/contact?x=1" ok; "//evil.com", "https://…" or anything odd → fallback. */
export function safeNext(next: unknown, fallback = "/"): string {
  if (typeof next !== "string" || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\") || next.length > 500) return fallback;
  return next;
}
