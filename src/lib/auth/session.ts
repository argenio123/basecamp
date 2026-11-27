// Admin session cookies (spec §B.18).
// Docs: 03-api-reference/04-functions/cookies.md, 02-guides/authentication.md,
//       02-guides/authentication-with-cache-components.md, 04-functions/redirect.md.
// cookies() is always awaited; set/clear only from Server Actions; reads only inside Suspense.
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connection, type NextRequest } from "next/server";
import { cache } from "react";
import { SHARED_STAFF_ID } from "./staff";
import { type AdminSession, readSession, SESSION_TTL_MS, signSession, verifySession } from "./token";

export const COOKIE = "bc_admin_session";
export const HINT_COOKIE = "bc_admin_hint";
const MAX_AGE = SESSION_TTL_MS / 1000;
const secure = () => process.env.NODE_ENV === "production";

export type { AdminSession };

/**
 * Redirects to /login unless the request carries a valid session. Call first in every admin action.
 * Returns who is signed in: `staff` is the staff email, or SHARED_STAFF_ID for the legacy shared password.
 */
// connection() (04-functions/connection.md) excludes the Date.now() check from prerendering under cacheComponents.
export const requireAdmin = cache(async (): Promise<AdminSession> => {
  const token = (await cookies()).get(COOKIE)?.value;
  await connection();
  const session = token ? readSession(token, Date.now()) : null;
  if (!session) redirect("/login");
  return session;
});

/** Server Actions only: the current session, or null, without redirecting (used to audit log-outs). */
export async function currentAdminSession(): Promise<AdminSession | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  return token ? readSession(token, Date.now()) : null;
}

/** For route handlers: checks the session cookie on the incoming request. */
export function isAdminRequest(request: NextRequest): boolean {
  return verifySession(request.cookies.get(COOKIE)?.value ?? "", Date.now());
}

/** For route handlers: the session on the incoming request, or null (same check as isAdminRequest). */
export function adminRequestSession(request: NextRequest): AdminSession | null {
  return readSession(request.cookies.get(COOKIE)?.value ?? "", Date.now());
}

/** Text for the admin header: the staff email, or null when signed in with the legacy shared password. */
export const staffEmail = (session: AdminSession): string | null => (session.staff === SHARED_STAFF_ID ? null : session.staff);

/** Server Actions only. Sets the httpOnly session cookie (recording `staff`) and the non-httpOnly UI hint cookie. */
export async function setSessionCookies(staff: string): Promise<void> {
  const store = await cookies();
  store.set(COOKIE, signSession(Date.now(), staff), { httpOnly: true, secure: secure(), sameSite: "lax", path: "/admin", maxAge: MAX_AGE });
  store.set(HINT_COOKIE, "1", { httpOnly: false, sameSite: "lax", path: "/", maxAge: MAX_AGE, secure: secure() });
}

/** Server Actions only. Expires both cookies on their original paths. */
export async function clearSessionCookies(): Promise<void> {
  const store = await cookies();
  store.set(COOKIE, "", { httpOnly: true, secure: secure(), sameSite: "lax", path: "/admin", maxAge: 0 });
  store.set(HINT_COOKIE, "", { httpOnly: false, sameSite: "lax", path: "/", maxAge: 0, secure: secure() });
}
