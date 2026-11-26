import Link from "next/link";
import type { ReactNode } from "react";
import { MEMBERSHIP_PLANS_PATH } from "@/content/constants";

/**
 * Main-content membership / early-access CTA: opens the membership plans (/membership#tiers), each with its pay link.
 * Public for everyone: visitors only meet the member log-in at checkout (/pay), not before they can see the plans.
 */
export default function EarlyAccessLink({ children, className, href = MEMBERSHIP_PLANS_PATH }: { children: ReactNode; className?: string; href?: string }) {
  return <Link href={href} className={className}>{children}</Link>;
}
