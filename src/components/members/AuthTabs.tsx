"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { loginHref, signupHref } from "@/lib/members/types";

/** Log in / Sign up switch at the top of the member card; keeps ?next= so either form returns to the same page. */
export default function AuthTabs({ mode }: { mode: "login" | "signup" }) {
  const next = useSearchParams().get("next") ?? "/account";
  return (
    <nav className="mb-auth-tabs" aria-label="Member account">
      <Link href={loginHref(next)} aria-current={mode === "login" ? "page" : undefined} replace>Log in</Link>
      <Link href={signupHref(next)} aria-current={mode === "signup" ? "page" : undefined} replace>Sign up</Link>
    </nav>
  );
}
