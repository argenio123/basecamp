"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { LOGIN_PATH } from "@/content/sitemap";

/** Hides the (server-rendered) footer on /admin routes and the sign-in page. */
export default function FooterGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin") || pathname === LOGIN_PATH) return null;
  return <>{children}</>;
}
