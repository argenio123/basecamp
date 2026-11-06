import type { SiteSettings } from "@/content/types";
import { directionsUrl } from "@/data/brand";
import MapEmbed from "@/components/ui/MapEmbed";

/**
 * Location block: a dark full-width map with a floating Ink card on the right (clear of the map's own place box),
 * in the site's dark-card language: mono label, display title, labelled detail rows and pill buttons.
 */
export default function FindUs({ contact, title = "Find us", id = "find-us" }: { contact: SiteSettings["contact"]; title?: string; id?: string }) {
  const hasAny = contact.addressLines.length > 0 || contact.mapsQuery || contact.phoneDisplay || contact.email;
  if (!hasAny) return null;
  const mapUrl = contact.mapsQuery ? `https://www.google.com/maps?q=${encodeURIComponent(contact.mapsQuery)}` : "";
  const rows = [
    contact.addressLines.length > 0 && { label: "Address", value: <>{contact.addressLines.map((line, i) => <span key={i}>{i > 0 && <br />}{line}</span>)}</> },
    contact.email && { label: "Email", value: <a href={`mailto:${contact.email}`}>{contact.email}</a> },
    contact.phoneDisplay && { label: "Phone", value: <a href={`tel:${contact.phoneE164 || contact.phoneDisplay}`}>{contact.phoneDisplay}</a> },
    contact.hours && { label: "Hours", value: contact.hours },
  ].filter(Boolean) as { label: string; value: React.ReactNode }[];

  return (
    <section id={id} className="ft-find" aria-labelledby={`${id}-title`}>
      {contact.mapsQuery && <MapEmbed query={contact.mapsQuery} className="ft-find-map" />}
      <div className="shell ft-find-shell">
        <address className="ft-find-card" data-reveal>
          <p className="ft-find-label">BaseCamp CamSur · Pili</p>
          <h2 id={`${id}-title`} className="ft-find-title">{title}</h2>
          <dl className="ft-find-rows">
            {rows.map((r) => (
              <div key={r.label}><dt>{r.label}</dt><dd>{r.value}</dd></div>
            ))}
          </dl>
          {contact.mapsQuery && (
            <p className="ft-find-actions">
              <a className="ft-find-primary" href={directionsUrl(contact.mapsQuery)} target="_blank" rel="noreferrer">Get directions<span className="sr-only"> (opens in a new tab)</span></a>
              <a className="ft-find-secondary" href={mapUrl} target="_blank" rel="noreferrer">View on map<span className="sr-only"> (opens in a new tab)</span></a>
            </p>
          )}
        </address>
      </div>
    </section>
  );
}
