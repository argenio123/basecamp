// Admin session cookies (spec §B.18).
// Docs: 03-api-reference/04-functions/cookies.md, 02-guides/authentication.md,
//       02-guides/authentication-with-cache-components.md, 04-functions/redirect.md.
// cookies() is always awaited; set/clear only from Server Actions; reads only inside Suspense.
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connection, type NextRequest } from "next/server";
import { cache } from "react";
import { SESSION_TTL_MS, signSession, verifySession } from "./token";

export const COOKIE = "bc_admin_session";
export const HINT_COOKIE = "bc_admin_hint";
const MAX_AGE = SESSION_TTL_MS / 1000;
const secure = () => process.env.NODE_ENV === "production";

/** Redirects to /login unless the request carries a valid session. Call first in every admin action. */
// connection() (04-functions/connection.md) excludes the Date.now() check from prerendering under cacheComponents.
export const requireAdmin = cache(async (): Promise<void> => {
  const token = (await cookies()).get(COOKIE)?.value;
  await connection();
  if (!token || !verifySession(token, Date.now())) redirect("/login");
});

/** For route handlers: checks the session cookie on the incoming request. */
export function isAdminRequest(request: NextRequest): boolean {
  return verifySession(request.cookies.get(COOKIE)?.value ?? "", Date.now());
}

/** Server Actions only. Sets the httpOnly session cookie and the non-httpOnly UI hint cookie. */
export async function setSessionCookies(): Promise<void> {
  const store = await cookies();
  store.set(COOKIE, signSession(Date.now()), { httpOnly: true, secure: secure(), sameSite: "lax", path: "/admin", maxAge: MAX_AGE });
  store.set(HINT_COOKIE, "1", { httpOnly: false, sameSite: "lax", path: "/", maxAge: MAX_AGE, secure: secure() });
}

/** Server Actions only. Expires both cookies on their original paths. */
export async function clearSessionCookies(): Promise<void> {
  const store = await cookies();
  store.set(COOKIE, "", { httpOnly: true, secure: secure(), sameSite: "lax", path: "/admin", maxAge: 0 });
  store.set(HINT_COOKIE, "", { httpOnly: false, sameSite: "lax", path: "/", maxAge: 0, secure: secure() });
}
