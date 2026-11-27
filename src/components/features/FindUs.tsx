import type { SiteSettings } from "@/content/types";
import { directionsUrl } from "@/data/brand";
import { getUi } from "@/i18n/server";
import CopyAddress from "./CopyAddress";
import FindUsMap from "./FindUsMap";

/* The landmark line (shown under the address so visitors know which building to look for inside the Capitol
   Complex) is ui.findUs.landmarkText in src/i18n/ui.ts, in each language. */

/**
 * Location block as a split panel (no overlap): Ink info panel on the left, satellite map on the right, in one
 * rounded frame. Same language as the site's Ink boards: mono label, display title, labelled rows, pill buttons.
 * Stacks on phones (info first, then the map).
 */
export default function FindUs({ contact, title, id = "find-us", landmark }: { contact: SiteSettings["contact"]; title?: string; id?: string; landmark?: string }) {
  const ui = getUi();
  title ??= ui.findUs.title;
  landmark ??= ui.findUs.landmarkText;
  const hasAny = contact.addressLines.length > 0 || contact.mapsQuery || contact.phoneDisplay || contact.email;
  if (!hasAny) return null;
  const address = contact.addressLines.join(", ");
  const rows = [
    contact.addressLines.length > 0 && { label: ui.findUs.address, value: <>{contact.addressLines.map((line, i) => <span key={i}>{i > 0 && <br />}{line}</span>)}</> },
    landmark && { label: ui.findUs.landmark, value: landmark },
    contact.email && { label: ui.findUs.email, value: <a href={`mailto:${contact.email}`}>{contact.email}</a> },
    contact.phoneDisplay && { label: ui.findUs.phone, value: <a href={`tel:${contact.phoneE164 || contact.phoneDisplay}`}>{contact.phoneDisplay}</a> },
    contact.hours && { label: ui.findUs.hours, value: contact.hours },
  ].filter(Boolean) as { label: string; value: React.ReactNode }[];

  return (
    <section id={id} className="section fu" aria-labelledby={`${id}-title`}>
      <div className="shell">
        <div className="fu-frame" data-reveal>
          <address className="fu-info">
            <p className="fu-label">BaseCamp CamSur · Pili</p>
            <h2 id={`${id}-title`} className="fu-title">{title}</h2>
            <dl className="fu-rows">
              {rows.map((r) => (
                <div key={r.label}><dt>{r.label}</dt><dd>{r.value}</dd></div>
              ))}
            </dl>
            <p className="fu-actions">
              {contact.mapsQuery && <a className="fu-primary" href={directionsUrl(contact.mapsQuery)} target="_blank" rel="noreferrer">{ui.common.getDirections}<span className="sr-only"> {ui.common.opensNewTab}</span></a>}
              {address && <CopyAddress text={`BaseCamp CamSur, ${address}`} className="fu-secondary" label={ui.common.copyAddress} copiedLabel={ui.common.addressCopied} />}
            </p>
          </address>
          {contact.mapsQuery && <FindUsMap query={contact.mapsQuery} />}
        </div>
      </div>
    </section>
  );
}
