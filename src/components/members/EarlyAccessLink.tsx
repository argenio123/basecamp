"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { MEMBERSHIP_JOIN_PATH } from "@/content/constants";
import { loginHref } from "@/lib/members/types";
import { useMemberHint } from "./useMemberHint";


/**
 * Main-content membership / early-access CTA: opens the membership form (/membership/join).
 * Visitors log in first and land on the form's cover screen; members go straight to it. Header/nav and footer links
 * intentionally do not use this component.
 */
export default function EarlyAccessLink({ children, className, href: target = MEMBERSHIP_JOIN_PATH }: { children: ReactNode; className?: string; href?: string }) {
  const member = useMemberHint();
  const href = member ? target : loginHref(target);

  return <Link href={href} className={className}>{children}</Link>;
}
