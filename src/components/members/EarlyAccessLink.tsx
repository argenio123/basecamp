"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { MEMBERSHIP_PLANS_PATH } from "@/content/constants";
import { useLocale } from "@/i18n/client";
import { localizedHref } from "@/i18n/paths";

/**
 * Main-content membership / early-access CTA: opens the membership plans (/membership#tiers), each with its pay link.
 * Public for everyone: visitors only meet the member log-in at checkout (/pay), not before they can see the plans.
 * On a Filipino page the link opens the Filipino plans (/fil/membership#tiers) when that page exists.
 */
export default function EarlyAccessLink({ children, className, href = MEMBERSHIP_PLANS_PATH }: { children: ReactNode; className?: string; href?: string }) {
  return <Link href={localizedHref(href, useLocale())} className={className}>{children}</Link>;
}
