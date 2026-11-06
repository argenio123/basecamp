// Member accounts. Server-only.
// Upstash: hash bc:members:v1 (field = lower-cased email, value = JSON Member).
// File: .data/members.json (Member[]), serialised by withFileLock.
// Passwords are stored only as scrypt hashes (random 16-byte salt, N=16384, r=8, p=1, 64-byte key).
import { randomBytes, randomUUID, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { driver, readJsonFile, StorageUnavailableError, upstash, withFileLock, writeJsonFile } from "@/lib/storage/driver";

export type Member = { id: string; email: string; firstName: string; lastName: string; phone: string; passwordHash: string; createdAt: string };
export type PublicMember = Omit<Member, "passwordHash">;

const HASH = "bc:members:v1";
const FILE = "members.json";
const MAX_MEMBERS = 20000;
const scryptAsync = promisify(scrypt) as (password: string, salt: Buffer, keylen: number) => Promise<Buffer>;

const normalise = (email: string) => email.trim().toLowerCase();
const readFileMembers = () => readJsonFile<Member[]>(FILE, []).then((m) => (Array.isArray(m) ? m : []));

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await scryptAsync(password, salt, 64);
  return `s1.${salt.toString("base64url")}.${key.toString("base64url")}`;
}

export async function passwordMatches(password: string, stored: string): Promise<boolean> {
  const [v, salt, key] = stored.split(".");
  if (v !== "s1" || !salt || !key) return false;
  const expected = Buffer.from(key, "base64url");
  const given = await scryptAsync(password, Buffer.from(salt, "base64url"), expected.length);
  return given.length === expected.length && timingSafeEqual(given, expected);
}

export async function findMemberByEmail(email: string): Promise<Member | null> {
  const key = normalise(email);
  const mode = driver();
  if (mode === "readonly") return null;
  if (mode === "upstash") {
    const raw = await upstash<string | null>(["HGET", HASH, key]);
    return raw ? (JSON.parse(raw) as Member) : null;
  }
  return (await readFileMembers()).find((m) => m.email === key) ?? null;
}

export async function findMemberById(id: string): Promise<Member | null> {
  const mode = driver();
  if (mode === "readonly") return null;
  if (mode === "upstash") {
    const flat = (await upstash<string[] | null>(["HVALS", HASH])) ?? [];
    for (const raw of flat) {
      try { const m = JSON.parse(raw) as Member; if (m.id === id) return m; } catch { /* skip */ }
    }
    return null;
  }
  return (await readFileMembers()).find((m) => m.id === id) ?? null;
}

/** Creates a member; returns null when the email is already registered. */
export async function createMember(input: { email: string; firstName: string; lastName: string; phone: string; password: string }): Promise<Member | null> {
  const mode = driver();
  if (mode === "readonly") throw new StorageUnavailableError();
  const member: Member = {
    id: randomUUID(), email: normalise(input.email), firstName: input.firstName.trim(), lastName: input.lastName.trim(),
    phone: input.phone.trim(), passwordHash: await hashPassword(input.password), createdAt: new Date().toISOString(),
  };
  if (mode === "upstash") {
    if ((await upstash<number>(["HLEN", HASH])) >= MAX_MEMBERS) throw new Error("Member store is full.");
    const created = await upstash<number>(["HSETNX", HASH, member.email, JSON.stringify(member)]);
    return created ? member : null;
  }
  return withFileLock(async () => {
    const members = await readFileMembers();
    if (members.some((m) => m.email === member.email)) return null;
    if (members.length >= MAX_MEMBERS) throw new Error("Member store is full.");
    members.push(member);
    await writeJsonFile(FILE, members);
    return member;
  });
}

export const toPublic = (member: Member): PublicMember => {
  const copy: Partial<Member> = { ...member };
  delete copy.passwordHash;
  return copy as PublicMember;
};
