"use client";

import Link from "next/link";
import { PRIVACY_EMAIL } from "@/data/brand";
import { PRIVACY_PATH } from "@/data/legal";
import { useLocale } from "@/i18n/client";
import { localizedHref } from "@/i18n/paths";
import { UI } from "@/i18n/ui";

/** Shown under every form (spec §0.13, §B.16), with a link to the full privacy policy. `compact` for tight spaces like the footer.
 *  Text in the page's language (src/i18n/ui.ts privacy.note; English = PRIVACY_NOTE in src/data/brand.ts). */
export default function PrivacyNote({ compact = false, className }: { compact?: boolean; className?: string }) {
  const locale = useLocale();
  const ui = UI[locale];
  const [before, after = ""] = ui.privacy.note.split("{email}");
  return (
    <p className={`ui-privacy-note${className ? ` ${className}` : ""}`} data-compact={compact ? "" : undefined}>
      {before}<a href={`mailto:${PRIVACY_EMAIL}`}>{PRIVACY_EMAIL}</a>{after} {ui.privacy.readOur} <Link href={localizedHref(PRIVACY_PATH, locale)}>{ui.privacy.policy}</Link>.
    </p>
  );
}
