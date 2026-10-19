import type { GlanceFact } from "@/components/ui/AtAGlance";
import type { Availability, RecoveryModality, Stat } from "@/content/types";

/**
 * "At a glance" facts for the facilities pages (stage-3 §6): taken from content only, never invented.
 * A missing stat yields null, which AtAGlance drops (no "TBA" chips).
 */
export function statFact(stats: readonly Stat[], id: string): GlanceFact | null {
  const s = stats.find((item) => item.id === id);
  return s && s.value.trim() ? { label: s.label, value: s.value } : null;
}

const LAUNCH: readonly Availability[] = ["available", "at-launch"];

/** Modality counts: total, at launch (available now or at launch) and later phases. Zero counts are dropped. */
export function modalityFacts(modalities: readonly RecoveryModality[]): (GlanceFact | null)[] {
  const launch = modalities.filter((m) => LAUNCH.includes(m.availability)).length;
  const later = modalities.length - launch;
  return [
    modalities.length ? { label: "Recovery modalities", value: String(modalities.length) } : null,
    launch ? { label: "At launch", value: String(launch) } : null,
    later ? { label: "Phase 2 or planned", value: String(later) } : null,
  ];
}
