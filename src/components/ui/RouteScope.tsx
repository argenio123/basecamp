"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Marks <html data-route="home|page|admin" data-section="<first path segment>"> so CSS can style the navigation
 * pages (and individual sections such as Facilities) apart from the homepage.
 * A DOM check such as main:has(.home-hero) is not enough: on client-side navigation Next keeps the previous
 * route mounted but hidden, so the homepage hero is still in the DOM while /classes is on screen.
 * ROUTE_SCOPE_SCRIPT (boot-scripts.ts) sets the value before first paint; this keeps it in sync on navigation.
 */
export function routeScope(pathname: string) {
  if (pathname === "/") return "home";
  if (pathname === "/login" || pathname.startsWith("/admin")) return "admin";
  return "page";
}

export default function RouteScope() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    document.documentElement.dataset.route = routeScope(pathname);
    document.documentElement.dataset.section = pathname.split("/")[1] || "home";
  }, [pathname]);

  return null;
}
