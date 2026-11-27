"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { LOGIN_PATH } from "@/content/sitemap";
import { useLocale } from "@/i18n/client";

/**
 * Hides the (server-rendered) footer on /admin routes and the sign-in page. The root layout renders the footer once
 * per locale (children = English, `fil` = Filipino); only the one matching the URL is rendered into the page.
 */
export default function FooterGate({ children, fil }: { children: ReactNode; fil?: ReactNode }) {
  const pathname = usePathname();
  const locale = useLocale();
  if (pathname.startsWith("/admin") || pathname === LOGIN_PATH) return null;
  return <>{locale === "fil" && fil ? fil : children}</>;
}
