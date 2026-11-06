"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logOut } from "@/lib/members/actions";
import { loginHref, MEMBER_LOGIN_PATH, MEMBER_SIGNUP_PATH } from "@/lib/members/types";
import { useMemberHint } from "./useMemberHint";

/** Header / mobile-menu account control: "Login" for visitors, "Log out" for signed-in members. */
export default function MemberNavLink({ className }: { className?: string }) {
  const member = useMemberHint();
  const pathname = usePathname() || "/";
  if (member) {
    return (
      <form action={logOut} className="mb-nav-logout">
        <input type="hidden" name="next" value="/" />
        <button type="submit" className={className}>Log out</button>
      </form>
    );
  }
  // On the log-in page offer sign-up (and vice versa) instead of a link to the page itself.
  if (pathname === MEMBER_LOGIN_PATH) return <Link href={MEMBER_SIGNUP_PATH} className={className} aria-label="Create a member account">Sign up</Link>;
  if (pathname === MEMBER_SIGNUP_PATH) return <Link href={MEMBER_LOGIN_PATH} className={className} aria-label="Member login">Login</Link>;
  return (
    <Link href={loginHref(pathname)} className={className} aria-label="Member login">
      Login
    </Link>
  );
}
