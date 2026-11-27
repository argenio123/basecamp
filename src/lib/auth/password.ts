// Staff password hashes. Pure: node:crypto only, no Next imports.
// Same format and parameters as member passwords in src/lib/members/store.ts (hashPassword / passwordMatches):
// `s1.<base64url 16-byte random salt>.<base64url 64-byte scrypt key>`, scrypt N=16384, r=8, p=1 (Node defaults).
// scripts/hash-admin-password.mjs produces the same format for ADMIN_USERS; keep the three in step.
import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt) as (password: string, salt: Buffer, keylen: number) => Promise<Buffer>;
const SALT_BYTES = 16;
const KEY_BYTES = 64;
const B64URL = /^[A-Za-z0-9_-]+$/;

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_BYTES);
  const key = await scryptAsync(password, salt, KEY_BYTES);
  return `s1.${salt.toString("base64url")}.${key.toString("base64url")}`;
}

/** True when `stored` is a well-formed s1 hash with at least a 16-byte salt and exactly a 64-byte key. */
export function isPasswordHash(stored: string): boolean {
  const [v, salt, key, extra] = stored.split(".");
  if (v !== "s1" || !salt || !key || extra !== undefined || !B64URL.test(salt) || !B64URL.test(key)) return false;
  return Buffer.from(salt, "base64url").length >= SALT_BYTES && Buffer.from(key, "base64url").length === KEY_BYTES;
}

/** Recomputes scrypt with the stored salt and compares in constant time. Malformed hashes never match. */
export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  if (typeof password !== "string" || !isPasswordHash(stored)) return false;
  const [, salt, key] = stored.split(".");
  const expected = Buffer.from(key, "base64url");
  const given = await scryptAsync(password, Buffer.from(salt, "base64url"), expected.length);
  return given.length === expected.length && timingSafeEqual(given, expected);
}
