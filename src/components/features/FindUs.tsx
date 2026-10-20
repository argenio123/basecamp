import type { SiteSettings } from "@/content/types";
import { directionsUrl } from "@/data/brand";
import MapEmbed from "@/components/ui/MapEmbed";

/**
 * Location block: a dark full-width map with a floating card (ritebali.com "Pererenan"), and contact details in
 * signal lime with bracketed "(directions)" / "(view on map)" links (reload-fitness.com "Find us").
 */
export default function FindUs({ contact, title = "Find us", id = "find-us" }: { contact: SiteSettings["contact"]; title?: string; id?: string }) {
  const hasAny = contact.addressLines.length > 0 || contact.mapsQuery || contact.phoneDisplay || contact.email;
  if (!hasAny) return null;
  const mapUrl = contact.mapsQuery ? `https://www.google.com/maps?q=${encodeURIComponent(contact.mapsQuery)}` : "";

  return (
    <section id={id} className="ft-find" aria-labelledby={`${id}-title`}>
      {contact.mapsQuery && <MapEmbed query={contact.mapsQuery} className="ft-find-map" />}
      <div className="shell ft-find-shell">
        <address className="ft-find-card" data-reveal>
          <h2 id={`${id}-title`}>{title}</h2>
          <p className="ft-find-name">BaseCamp CamSur</p>
          <div className="ft-find-details">
            {contact.addressLines.length > 0 && (
              <p>{contact.addressLines.map((line, i) => <span key={i}>{i > 0 && <br />}{line}</span>)}</p>
            )}
            <p>
              {contact.email && <a href={`mailto:${contact.email}`}>{contact.email}</a>}
              {contact.email && contact.phoneDisplay && <br />}
              {contact.phoneDisplay && <a href={`tel:${contact.phoneE164 || contact.phoneDisplay}`}>{contact.phoneDisplay}</a>}
            </p>
          </div>
          {contact.hours && <p className="ft-find-hours">{contact.hours}</p>}
          {contact.mapsQuery && (
            <p className="ft-find-links">
              <a href={directionsUrl(contact.mapsQuery)} target="_blank" rel="noreferrer"><span aria-hidden="true">(</span>directions<span aria-hidden="true">)</span><span className="sr-only"> (opens in a new tab)</span></a>
              <a href={mapUrl} target="_blank" rel="noreferrer"><span aria-hidden="true">(</span>view on map<span aria-hidden="true">)</span><span className="sr-only"> (opens in a new tab)</span></a>
            </p>
          )}
        </address>
      </div>
    </section>
  );
}
