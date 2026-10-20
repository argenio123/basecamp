"use client";

import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { adminTabForPath, LOGIN_PATH } from "@/content/sitemap";

// Shows "Edit this page ↗" when the non-httpOnly bc_admin_hint cookie is present (spec §A.4).
// The hint grants nothing: /admin re-verifies the real session.
// Path → admin tab comes from the site map (src/content/sitemap.ts), so every stage-3 route is covered;
// every /classes/<slug> maps to the programmes tab.
const HINT_RE = /(?:^|;\s*)bc_admin_hint=1(?:;|$)/;

function subscribe(onChange: () => void) {
  window.addEventListener("focus", onChange);
  document.addEventListener("visibilitychange", onChange);
  return () => {
    window.removeEventListener("focus", onChange);
    document.removeEventListener("visibilitychange", onChange);
  };
}
const getSnapshot = () => HINT_RE.test(document.cookie);
const getServerSnapshot = () => false;

export default function AdminQuickEdit() {
  const pathname = usePathname();
  const hasHint = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  if (!hasHint || pathname.startsWith("/admin") || pathname === LOGIN_PATH) return null;
  const tab = adminTabForPath(pathname);
  const programmeSlug = pathname.match(/^\/classes\/([^/]+)$/)?.[1];
  const href = tab
    ? `/admin?tab=${tab}${tab === "programmes" && programmeSlug ? `&item=${encodeURIComponent(programmeSlug)}` : ""}`
    : "/admin";
  return (
    <a className="ui-admin-quick-edit" href={href}>
      Edit this page <span aria-hidden="true">↗</span>
    </a>
  );
}
