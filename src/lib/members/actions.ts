"use server";
// Member sign-up, log-in and log-out. Docs: 03-api-reference/01-directives/use-server.md, 02-guides/forms.md,
// 04-functions/redirect.md.
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { clientIp } from "@/lib/rateLimit";
import { createSharedLimiter } from "@/lib/sharedLimiter";
import { StorageUnavailableError } from "@/lib/storage/driver";
import { clearMemberCookies, setMemberCookies } from "./session";
import { createMember, findMemberByEmail, passwordMatches } from "./store";
import { membersConfigured, safeNext } from "./token";
import { AGE_TERMS_ERROR, type AuthResult } from "./types";

// Shared across instances via Redis (per-instance when Redis is absent or down): 10 attempts per 10 minutes per client IP.
const limiter = createSharedLimiter({ name: "member-auth", windowMs: 10 * 60 * 1000, perKey: 10, global: 300 });
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const text = (f: FormData, k: string) => (typeof f.get(k) === "string" ? (f.get(k) as string) : "");
const UNAVAILABLE = "Member accounts aren't available right now. Please email basecampcamsur@gmail.com.";

async function limited(): Promise<boolean> {
  return limiter.take(clientIp(await headers()));
}

export async function signUp(_prev: AuthResult, formData: FormData): Promise<AuthResult> {
  if (!membersConfigured()) return { status: "error", message: UNAVAILABLE };
  if (await limited()) return { status: "error", message: "Too many attempts. Please try again in a few minutes." };
  const firstName = text(formData, "firstName").trim();
  const lastName = text(formData, "lastName").trim();
  const email = text(formData, "email").trim();
  const phone = text(formData, "phone").trim();
  const password = text(formData, "password");
  const confirm = text(formData, "confirm");
  const fieldErrors: Record<string, string> = {};
  if (!firstName || firstName.length > 80) fieldErrors.firstName = "Enter your first name.";
  if (lastName.length > 80) fieldErrors.lastName = "Use 80 characters or fewer.";
  if (!EMAIL.test(email) || email.length > 254) fieldErrors.email = "Enter a valid email address.";
  if (phone.length > 40) fieldErrors.phone = "Use 40 characters or fewer.";
  if (password.length < 8 || password.length > 200) fieldErrors.password = "Use at least 8 characters.";
  if (confirm !== password) fieldErrors.confirm = "Passwords don't match.";
  // One box confirms both: the visitor is 18+ and agrees to the account data being stored.
  if (formData.get("terms") !== "on") fieldErrors.terms = AGE_TERMS_ERROR;
  if (Object.keys(fieldErrors).length) return { status: "error", message: "Please check the highlighted fields.", fieldErrors };

  let memberId: string;
  try {
    const member = await createMember({ email, firstName, lastName, phone, password });
    if (!member) return { status: "error", message: "An account with this email already exists. Log in instead.", fieldErrors: { email: "Already registered." } };
    memberId = member.id;
  } catch (e) {
    return { status: "error", message: e instanceof StorageUnavailableError ? UNAVAILABLE : "We couldn't create your account just now. Please try again." };
  }
  await setMemberCookies(memberId);
  redirect(safeNext(formData.get("next"), "/"));
}

export async function logIn(_prev: AuthResult, formData: FormData): Promise<AuthResult> {
  if (!membersConfigured()) return { status: "error", message: UNAVAILABLE };
  if (await limited()) return { status: "error", message: "Too many attempts. Please try again in a few minutes." };
  const email = text(formData, "email").trim();
  const password = text(formData, "password");
  if (!EMAIL.test(email) || !password) return { status: "error", message: "Enter your email and password." };

  let memberId: string | null = null;
  try {
    const member = await findMemberByEmail(email);
    if (member && (await passwordMatches(password, member.passwordHash))) memberId = member.id;
  } catch {
    return { status: "error", message: UNAVAILABLE };
  }
  // Same message for unknown email and wrong password.
  if (!memberId) return { status: "error", message: "Email or password is incorrect." };
  await setMemberCookies(memberId);
  redirect(safeNext(formData.get("next"), "/"));
}

/** No-JS fallback for the log-out form: clears the session and redirects. */
export async function logOut(formData: FormData): Promise<void> {
  await clearMemberCookies();
  redirect(safeNext(formData.get("next"), "/"));
}