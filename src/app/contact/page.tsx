import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense, type CSSProperties } from "react";
import RequestGate from "@/components/members/RequestGate";
import ScheduleExplore from "@/components/schedule/ScheduleExplore";
import PageHero from "@/components/sections/PageHero";
import AtAGlance from "@/components/ui/AtAGlance";
import { getSiteContent } from "@/content/get";
import { directionsUrl } from "@/data/brand";

export const metadata: Metadata = {
  title: "Contact",
  description: "Email, call, or message BaseCamp CamSur, find the address and hours, get quick answers, and follow us on social media.",
};

const pad = (n: number) => String(n + 1).padStart(2, "0");

/** Self-serve answers before writing in, shown in the list + photo layout used on Schedule, Visit, and About. */
const QUICK_ANSWERS = [
  { href: "/about/faq", label: "FAQ", summary: "Class-pack validity, guest passes, freezes, and cancellations.", image: "/images/programs/stations/row.jpg", imageAlt: "Athlete on a rowing machine" },
  { href: "/membership/price-guide", label: "Price guide", summary: "Passes, recovery, camps, and team bookings with starting prices.", image: "/images/programs/stations/farmers-carry.jpg", imageAlt: "Athlete carrying kettlebells" },
  { href: "/schedule/timetable", label: "Weekly timetable", summary: "This week's classes by day, with a request button on every session.", image: "/images/programs/stations/wall-ball-squat.jpg", imageAlt: "Athlete throwing a wall ball" },
  { href: "/visit", label: "Plan your visit", summary: "Camps, trips, extended stays, and how to find BaseCamp in Pili.", image: "/images/facilities/facility-front.jpg", imageAlt: "Front approach of BaseCamp CamSur" },
];

type Line = { label: string; value: string; note: string; href?: string; action?: string; external?: boolean };

/**
 * Contact page (no form, no map): hero → statement → Direct lines (full-bleed: training photo + contact lines)
 * → Quick answers (list + photo) → Follow us (Ink tiles). `#enquire` stays on the direct-lines section so older
 * links that pointed at the form land on the contact details. Request links (?interest=…) need a log-in first.
 */
export default async function ContactPage() {
  const c = await getSiteContent();
  const { contact, socials } = c.settings;
  const phoneDigits = contact.phoneE164.replace(/\D/g, "");
  const whatsappUrl = phoneDigits ? `https://wa.me/${phoneDigits}?text=${encodeURIComponent("Hi BaseCamp CamSur, I have a quick question.")}` : "";
  const address = contact.addressLines.join(", ");
  const follow = socials.filter((s) => s.url);

  const lines = [
    contact.email && { label: "Email", value: contact.email, note: "Best for anything detailed. Reply within one business day.", href: `mailto:${contact.email}`, action: "Send email" },
    contact.phoneDisplay && { label: "Phone", value: contact.phoneDisplay, note: "Booking line for quick questions and same-day visits.", href: `tel:${contact.phoneE164 || contact.phoneDisplay}`, action: "Call now" },
    whatsappUrl && { label: "WhatsApp", value: contact.phoneDisplay, note: "Message anytime; we answer during opening hours.", href: whatsappUrl, action: "Open chat", external: true },
    address && { label: "Address", value: address, note: "Beside the Provincial Capitol, near the Magic Park.", href: contact.mapsQuery ? directionsUrl(contact.mapsQuery) : undefined, action: contact.mapsQuery ? "Directions" : undefined, external: true },
    contact.hours && { label: "Hours", value: contact.hours, note: "Class, open-gym, and recovery hours are on the Schedule page.", href: "/schedule", action: "Schedule" },
  ].filter(Boolean) as Line[];

  return <>
    <Suspense fallback={null}><RequestGate /></Suspense>
    <PageHero title="Let's connect." intro="Email, call, or message us. We reply within one business day." image="/images/facilities/facility-landscape.jpg" imageAlt="BaseCamp CamSur set within the CamSur landscape" />

    <AtAGlance summary={"Ask anything.\nWe answer fast.\nThen come train."} statement />

    {/* 1 · Direct lines: full-bleed split, heading + contact lines left, training photo right edge-to-edge. */}
    <section id="enquire" className="ct11" aria-labelledby="ct11-title">
      <div className="ct11-panel">
        <div className="ct11-head" data-reveal>
          <p className="sd-tt-eyebrow">Talk to us</p>
          <h2 id="ct11-title">Direct lines.</h2>
          <p>Coaches on the floor, team on the line. Phone and WhatsApp are quickest; email is best for anything detailed.</p>
        </div>
        <ul className="ct10-lines" data-reveal="stagger">
          {lines.map((l, n) => (
            <li key={l.label} style={{ "--i": n } as CSSProperties}>
              <div className="ct10-text">
                <small>{l.label}</small>
                {l.href
                  ? <a className="ct10-value" href={l.href} {...(l.external ? { target: "_blank", rel: "noreferrer" } : {})}>{l.value}</a>
                  : <strong className="ct10-value">{l.value}</strong>}
                <p>{l.note}</p>
              </div>
              {l.href && l.action && <span className="ct10-actions">
                {l.href.startsWith("/")
                  ? <Link className="ct10-pill ct10-pill-fill" href={l.href}>{l.action}</Link>
                  : <a className="ct10-pill ct10-pill-fill" href={l.href} {...(l.external ? { target: "_blank", rel: "noreferrer" } : {})}>{l.action}</a>}
              </span>}
            </li>
          ))}
        </ul>
      </div>
      <figure className="ct11-photo">
        <Image src="/images/programs/generated/personal-coaching.png" alt="Coach reviewing a session with an athlete at BaseCamp CamSur" fill sizes="(max-width: 1000px) 100vw, 50vw" className="cover-image" />
        <figcaption data-reveal><span>BaseCamp CamSur · Pili</span><strong>We reply within one business day.</strong></figcaption>
      </figure>
    </section>

    {/* 2 · Quick answers */}
    <ScheduleExplore eyebrow="Before you write" title="Quick answers." intro="Most questions about prices, passes, class times, and visiting are answered here." items={QUICK_ANSWERS} />

    {/* 3 · Social */}
    {follow.length > 0 && (
      <section className="section sd-ev sd-ev-dark" id="follow">
        <div className="shell">
          <div className="sd-tt-head" data-reveal>
            <div><p className="sd-tt-eyebrow">Follow us</p><h2>Train with us online.</h2></div>
            <p>Build updates, training clips, and community news before we open.</p>
          </div>
          <div className="sd-ev-board">
            <ol className="sd-ev-tiles ct8-social" data-reveal="stagger">
              {follow.map((s, n) => (
                <li key={s.platform}>
                  <a href={s.url} target="_blank" rel="noreferrer">
                    <span className="sd-ev-num">{pad(n)}</span>
                    <h3>{s.platform}</h3>
                    <p>{s.handle || s.platform}</p>
                    <span className="ct8-social-go">Follow<span className="sr-only"> BaseCamp on {s.platform} (opens in a new tab)</span></span>
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    )}
  </>;
}
