"use client";

import { useSyncExternalStore } from "react";
import { MEMBER_HINT } from "@/lib/members/types";

// The hint cookie only drives UI ("Log in" vs "Log out", showing the log-in prompt). Access is always checked on
// the server (proxy for member pages, the lead action for submissions).
const read = () => typeof document !== "undefined" && document.cookie.split("; ").some((c) => c === `${MEMBER_HINT}=1`);
const subscribe = (onChange: () => void) => {
  window.addEventListener("focus", onChange);
  window.addEventListener("pageshow", onChange);
  return () => { window.removeEventListener("focus", onChange); window.removeEventListener("pageshow", onChange); };
};

/** True when the browser carries the member hint cookie. Always false during server rendering. */
export function useMemberHint(): boolean {
  return useSyncExternalStore(subscribe, read, () => false);
}

/** Current path + query, for "?next=" after logging in. */
export function currentPathForNext(): string {
  if (typeof window === "undefined") return "/";
  return `${window.location.pathname}${window.location.search}${window.location.hash}`;
}
