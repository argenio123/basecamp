"use server";
// Self-service account deletion (RA 10173 Sec. 16(e)). Docs: 03-api-reference/01-directives/use-server.md,
// 02-guides/forms.md, 03-api-reference/04-functions/cookies.md.
// CSRF protection relies on Next's built-in Origin/Host check for Server Actions.
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { eraseMember } from "@/lib/privacy/erase";
import { clientIp } from "@/lib/rateLimit";
import { createSharedLimiter } from "@/lib/sharedLimiter";
import { StorageUnavailableError } from "@/lib/storage/driver";
import { clearMemberCookies, currentMemberId } from "./session";
import { findMemberById, isDemoMember, passwordMatches } from "./store";
import { membersConfigured } from "./token";

export type DeleteAccountResult = { status: "idle" | "error"; message: string; fieldErrors?: Record<string, string> };

// 5 attempts per 15 minutes per account and per IP (shared via Redis when configured): the password check here
// must not become a way to guess the password of a session left open on a shared computer.
const WINDOW_MS = 15 * 60 * 1000;
const byAccount = createSharedLimiter({ name: "member-delete", windowMs: WINDOW_MS, perKey: 5, global: 200 });
const byIp = createSharedLimiter({ name: "member-delete-ip", windowMs: WINDOW_MS, perKey: 10, global: 200 });
const text = (f: FormData, k: string) => (typeof f.get(k) === "string" ? (f.get(k) as string) : "");
const UNAVAILABLE = "We couldn't delete your account just now. Please try again, or email basecampcamsur@gmail.com.";

export async function deleteAccount(_prev: DeleteAccountResult, formData: FormData): Promise<DeleteAccountResult> {
  if (!membersConfigured()) return { status: "error", message: UNAVAILABLE };
  const memberId = await currentMemberId();
  if (!memberId) return { status: "error", message: "Your session has expired. Log in again to delete your account." };
  const ip = clientIp(await headers());
  if ((await byIp.take(ip)) || (await byAccount.take(memberId))) {
    return { status: "error", message: "Too many attempts. Please try again in 15 minutes." };
  }

  let member;
  try {
    member = await findMemberById(memberId);
  } catch {
    return { status: "error", message: UNAVAILABLE };
  }
  if (!member) return { status: "error", message: "We couldn't find your account. Log in again and retry." };
  if (isDemoMember(member.id)) return { status: "error", message: "The local demo account can't be deleted." };

  const confirm = text(formData, "confirm").trim();
  const password = text(formData, "password");
  const fieldErrors: Record<string, string> = {};
  if (confirm !== "DELETE" && confirm.toLowerCase() !== member.email) fieldErrors.confirm = "Type your email address or DELETE exactly.";
  if (!password || password.length > 200 || !(await passwordMatches(password, member.passwordHash))) fieldErrors.password = "That password is incorrect.";
  if (Object.keys(fieldErrors).length) return { status: "error", message: "Your account was not deleted. Check the highlighted fields.", fieldErrors };

  try {
    await eraseMember(member);
  } catch (error) {
    return { status: "error", message: error instanceof StorageUnavailableError ? UNAVAILABLE : "Something went wrong part-way through. Please try again (it is safe to repeat), or email basecampcamsur@gmail.com." };
  }
  await clearMemberCookies();
  // Redirect from the action itself (outside try/catch): the settings page would otherwise re-render without a
  // session and bounce to the log-in page before the confirmation could show.
  redirect("/account/deleted");
}
