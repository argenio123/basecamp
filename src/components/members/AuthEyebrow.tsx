"use client";

import { usePathname } from "next/navigation";
import { MEMBER_SIGNUP_PATH } from "@/lib/members/types";

/** Small label above the headline; follows the current page because the shared frame stays mounted. */
export default function AuthEyebrow() {
  const signup = usePathname() === MEMBER_SIGNUP_PATH;
  return <p className="mb-auth-eyebrow">{signup ? "Create your account" : "Member's login"}</p>;
}
