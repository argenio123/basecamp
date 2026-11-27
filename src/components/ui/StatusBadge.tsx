"use client";

import type { Availability } from "@/content/types";
import { useUi } from "@/i18n/client";

/** Availability pill: "Available now" | "At launch" | "Phase 2" | "Planned" (spec §0.7), in the page's language
 *  (src/i18n/ui.ts labels.availability). A Client Component so Server and Client callers both get it translated. */
export default function StatusBadge({ availability, label, className }: { availability: Availability; label?: string; className?: string }) {
  const ui = useUi();
  return <span className={`ui-status-badge${className ? ` ${className}` : ""}`} data-availability={availability}>{label ?? ui.labels.availability[availability]}</span>;
}
