"use server";

import { revalidatePath } from "next/cache";
import { currentMember } from "./session";
import { getMemberProfile, saveMemberProfile } from "./profile";

export type ProfileFormResult = { status: "idle" | "success" | "error"; message: string; fieldErrors?: Record<string, string> };

const value = (form: FormData, key: string) => String(form.get(key) ?? "").trim();
const allowed = (candidate: string, choices: readonly string[]) => choices.includes(candidate) ? candidate : "";

async function signedInMember() {
  const member = await currentMember();
  if (!member) throw new Error("Your session has expired. Log in again.");
  return member;
}

/** Narrow, authorized account identity for the header menu. */
export async function getMemberMenuSummary(): Promise<{ name: string; email: string } | null> {
  const member = await currentMember();
  if (!member) return null;
  const profile = await getMemberProfile(member);
  return { name: [profile.firstName, profile.lastName].filter(Boolean).join(" ") || "BaseCamp member", email: member.email };
}

export async function updateAccountSettings(_previous: ProfileFormResult, form: FormData): Promise<ProfileFormResult> {
  try {
    const member = await signedInMember();
    const firstName = value(form, "firstName");
    const lastName = value(form, "lastName");
    const phone = value(form, "phone");
    const goal = allowed(value(form, "goal"), ["strength", "conditioning", "mobility", "recovery", "competition"]);
    const experience = allowed(value(form, "experience"), ["new", "returning", "consistent", "competitive"]);
    const preferredTime = allowed(value(form, "preferredTime"), ["morning", "midday", "evening", "flexible"]);
    const contactPreference = allowed(value(form, "contactPreference"), ["email", "phone", "whatsapp"]);
    const fieldErrors: Record<string, string> = {};
    if (!firstName || firstName.length > 80) fieldErrors.firstName = "Enter your first name.";
    if (lastName.length > 80) fieldErrors.lastName = "Use 80 characters or fewer.";
    if (phone.length > 40) fieldErrors.phone = "Use 40 characters or fewer.";
    if (!goal) fieldErrors.goal = "Choose your main training goal.";
    if (!experience) fieldErrors.experience = "Choose your experience level.";
    if (!preferredTime) fieldErrors.preferredTime = "Choose a preferred time.";
    if (!contactPreference) fieldErrors.contactPreference = "Choose how we should contact you.";
    if (Object.keys(fieldErrors).length) return { status: "error", message: "Check the highlighted settings.", fieldErrors };
    await saveMemberProfile(member, { firstName, lastName, phone, goal, experience, preferredTime, contactPreference });
    revalidatePath("/account");
    return { status: "success", message: "Account settings saved." };
  } catch (error) {
    return { status: "error", message: error instanceof Error ? error.message : "We couldn't save your account settings." };
  }
}

export async function updateSystemSettings(_previous: ProfileFormResult, form: FormData): Promise<ProfileFormResult> {
  try {
    const member = await signedInMember();
    const reminderWindow = allowed(value(form, "reminderWindow"), ["2h", "12h", "24h", "48h"]);
    const motionPreference = allowed(value(form, "motionPreference"), ["system", "full", "reduced"]);
    const fieldErrors: Record<string, string> = {};
    if (!reminderWindow) fieldErrors.reminderWindow = "Choose when reminders should arrive.";
    if (!motionPreference) fieldErrors.motionPreference = "Choose a motion preference.";
    if (Object.keys(fieldErrors).length) return { status: "error", message: "Check the highlighted system settings.", fieldErrors };
    await saveMemberProfile(member, {
      bookingReminders: form.get("bookingReminders") === "on",
      reminderWindow,
      scheduleDigest: form.get("scheduleDigest") === "on",
      productUpdates: form.get("productUpdates") === "on",
      motionPreference,
    });
    revalidatePath("/account/settings");
    return { status: "success", message: "System settings saved." };
  } catch (error) {
    return { status: "error", message: error instanceof Error ? error.message : "We couldn't save your system settings." };
  }
}
