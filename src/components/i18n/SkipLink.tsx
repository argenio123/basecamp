"use client";

import { useUi } from "@/i18n/client";

/** "Skip to content" in the page's language (root layout). */
export default function SkipLink() {
  return <a className="skip-link" href="#main-content">{useUi().common.skipToContent}</a>;
}
