// Member session cookies. Docs: 03-api-reference/04-functions/cookies.md, 02-guides/authentication.md.
// cookies() is always awaited; set/clear only from Server Actions.
import { cookies } from "next/headers";
import { connection } from "next/server";
import { findMemberById, toPublic, type PublicMember } from "./store";
import { MEMBER_COOKIE, MEMBER_HINT_COOKIE, MEMBER_TTL_MS, signMemberSession, verifyMemberSession } from "./token";

const secure = () => process.env.NODE_ENV === "production";
const MAX_AGE = MEMBER_TTL_MS / 1000;

/** The signed-in member's id, or null. Reads the request cookies (dynamic). */
export async function currentMemberId(): Promise<string | null> {
  const token = (await cookies()).get(MEMBER_COOKIE)?.value ?? "";
  await connection();
  return verifyMemberSession(token, Date.now());
}

/** The signed-in member (without the password hash), or null. */
export async function currentMember(): Promise<PublicMember | null> {
  const id = await currentMemberId();
  if (!id) return null;
  const member = await findMemberById(id);
  return member ? toPublic(member) : null;
}

/** Server Actions only. */
export async function setMemberCookies(memberId: string): Promise<void> {
  const store = await cookies();
  store.set(MEMBER_COOKIE, signMemberSession(memberId, Date.now()), { httpOnly: true, secure: secure(), sameSite: "lax", path: "/", maxAge: MAX_AGE });
  store.set(MEMBER_HINT_COOKIE, "1", { httpOnly: false, secure: secure(), sameSite: "lax", path: "/", maxAge: MAX_AGE });
}

/** Server Actions only. */
export async function clearMemberCookies(): Promise<void> {
  const store = await cookies();
  store.set(MEMBER_COOKIE, "", { httpOnly: true, secure: secure(), sameSite: "lax", path: "/", maxAge: 0 });
  store.set(MEMBER_HINT_COOKIE, "", { httpOnly: false, secure: secure(), sameSite: "lax", path: "/", maxAge: 0 });
}
