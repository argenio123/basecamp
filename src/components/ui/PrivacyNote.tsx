import { PRIVACY_EMAIL, PRIVACY_NOTE } from "@/data/brand";

/** Shown under every form (spec §0.13, §B.16). `compact` for tight spaces like the footer. */
export default function PrivacyNote({ compact = false, className }: { compact?: boolean; className?: string }) {
  const [before, after] = PRIVACY_NOTE.split(PRIVACY_EMAIL);
  return (
    <p className={`ui-privacy-note${className ? ` ${className}` : ""}`} data-compact={compact ? "" : undefined}>
      {before}<a href={`mailto:${PRIVACY_EMAIL}`}>{PRIVACY_EMAIL}</a>{after}
    </p>
  );
}
