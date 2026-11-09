"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { MEMBER_HINT, loginHref } from "@/lib/members/types";

/**
 * Sends logged-out visitors to the member log-in when a public page is opened as a request (any query, e.g.
 * /contact?interest=yoga from a Purchase / Inquire / Register interest button). The proxy covers full page loads;
 * this covers in-app navigation, where the router can reuse the already-loaded public page without asking the
 * server. Renders nothing.
 */
export default function RequestGate() {
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const router = useRouter();

  useEffect(() => {
    if (!search) return;
    const member = document.cookie.split("; ").some((c) => c === `${MEMBER_HINT}=1`);
    if (!member) router.replace(loginHref(`${pathname}?${search}`), { scroll: true });
  }, [pathname, search, router]);

  return null;
}
