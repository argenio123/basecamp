"use client";

import { useEffect } from "react";
import { LOGGED_OUT_KEY } from "@/lib/members/types";

/** On /account/deleted: tells the header (useMemberHint re-reads on focus) and the home offer that the session ended. */
export default function SessionEnded() {
  useEffect(() => {
    try { window.sessionStorage.setItem(LOGGED_OUT_KEY, "true"); } catch { /* storage blocked */ }
    window.dispatchEvent(new Event("focus"));
  }, []);
  return null;
}
