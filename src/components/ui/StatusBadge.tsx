import { AVAILABILITY_LABEL } from "@/content/labels";
import type { Availability } from "@/content/types";

/** Availability pill: "Available now" | "At launch" | "Phase 2" | "Planned" (spec §0.7). */
export default function StatusBadge({ availability, label, className }: { availability: Availability; label?: string; className?: string }) {
  return <span className={`ui-status-badge${className ? ` ${className}` : ""}`} data-availability={availability}>{label ?? AVAILABILITY_LABEL[availability]}</span>;
}
