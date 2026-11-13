// Member-facing profile data. Authentication records stay deliberately small; editable preferences live here.
import { driver, readJsonFile, upstash, withFileLock, writeJsonFile } from "@/lib/storage/driver";
import type { PublicMember } from "./store";

export type MemberProfile = {
  firstName: string;
  lastName: string;
  phone: string;
  goal: string;
  experience: string;
  preferredTime: string;
  contactPreference: string;
  notes: string;
  bookingReminders: boolean;
  reminderWindow: string;
  scheduleDigest: boolean;
  productUpdates: boolean;
  motionPreference: string;
  updatedAt: string;
};

export type ProfilePatch = Partial<Omit<MemberProfile, "updatedAt">>;

const HASH = "bc:member-profiles:v1";
const FILE = "member-profiles.json";

const baseProfile = (member: PublicMember): MemberProfile => ({
  firstName: member.firstName,
  lastName: member.lastName,
  phone: member.phone,
  goal: "",
  experience: "",
  preferredTime: "",
  contactPreference: "email",
  notes: "",
  bookingReminders: true,
  reminderWindow: "24h",
  scheduleDigest: true,
  productUpdates: true,
  motionPreference: "system",
  updatedAt: "",
});

async function storedProfile(memberId: string): Promise<Partial<MemberProfile> | null> {
  if (driver() === "upstash") {
    const raw = await upstash<string | null>(["HGET", HASH, memberId]);
    return raw ? JSON.parse(raw) as Partial<MemberProfile> : null;
  }
  if (driver() === "readonly") return null;
  const profiles = await readJsonFile<Record<string, Partial<MemberProfile>>>(FILE, {});
  return profiles[memberId] ?? null;
}

export async function getMemberProfile(member: PublicMember): Promise<MemberProfile> {
  return { ...baseProfile(member), ...(await storedProfile(member.id) ?? {}) };
}

export async function saveMemberProfile(member: PublicMember, patch: ProfilePatch): Promise<MemberProfile> {
  const next = { ...await getMemberProfile(member), ...patch, updatedAt: new Date().toISOString() };
  if (driver() === "upstash") {
    await upstash<number>(["HSET", HASH, member.id, JSON.stringify(next)]);
    return next;
  }
  if (driver() === "readonly") throw new Error("Member profiles are read-only.");
  await withFileLock(async () => {
    const profiles = await readJsonFile<Record<string, MemberProfile>>(FILE, {});
    profiles[member.id] = next;
    await writeJsonFile(FILE, profiles);
  });
  return next;
}
