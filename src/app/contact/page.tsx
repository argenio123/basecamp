import type { Metadata } from "next";
import Link from "next/link";
import { Suspense, type CSSProperties } from "react";
import EarlyAccessLink from "@/components/members/EarlyAccessLink";
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

type ContactIconName = "access" | "email" | "phone" | "chat" | "location" | "hours";
type Line = { label: string; value: string; icon: ContactIconName; href?: string; action?: string; external?: boolean; earlyAccess?: boolean };

function ContactIcon({ name }: { name: ContactIconName }) {
  return (
    <svg className="ct11-card-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {name === "access" && <path d="M13.5 2 5 13h6l-1 9 9-12h-6l.5-8Z" />}
      {name === "email" && <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></>}
      {name === "phone" && <path d="M8.2 3H5.4A2.4 2.4 0 0 0 3 5.4C3 14 10 21 18.6 21a2.4 2.4 0 0 0 2.4-2.4v-2.8l-4.1-1.2-1.2 2.2a14.3 14.3 0 0 1-8.5-8.5l2.2-1.2L8.2 3Z" />}
      {name === "chat" && <><path d="M21 11.5a8.4 8.4 0 0 1-9 8.5 9.7 9.7 0 0 1-4-.9L3 21l1.7-4.4A8.7 8.7 0 0 1 3 11.5 8.5 8.5 0 0 1 12 3a8.5 8.5 0 0 1 9 8.5Z" /><path d="M8 12h.01M12 12h.01M16 12h.01" /></>}
      {name === "location" && <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>}
      {name === "hours" && <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>}
    </svg>
  );
}

/**
 * Contact page (no form, no map): hero → statement → Direct lines action cards
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
    { label: "Early access", value: "Priority updates", icon: "access", action: "Join now", earlyAccess: true },
    contact.email && { label: "Email", value: contact.email, icon: "email", href: `mailto:${contact.email}`, action: "Send email" },
    contact.phoneDisplay && { label: "Phone", value: contact.phoneDisplay, icon: "phone", href: `tel:${contact.phoneE164 || contact.phoneDisplay}`, action: "Call now" },
    whatsappUrl && { label: "WhatsApp", value: contact.phoneDisplay, icon: "chat", href: whatsappUrl, action: "Open chat", external: true },
    address && { label: "Address", value: address, icon: "location", href: contact.mapsQuery ? directionsUrl(contact.mapsQuery) : undefined, action: contact.mapsQuery ? "Directions" : undefined, external: true },
    contact.hours && { label: "Hours", value: contact.hours, icon: "hours", href: "/schedule", action: "Schedule" },
  ].filter(Boolean) as Line[];
  return <>
    <Suspense fallback={null}><RequestGate /></Suspense>
    <PageHero title="Let's connect." intro="Email, call, or message us. We reply within one business day." image="/images/facilities/facility-landscape.jpg" imageAlt="BaseCamp CamSur set within the CamSur landscape" imagePosition="center 80%" />

    <AtAGlance summary={"Ask anything.\nWe answer fast.\nThen come train."} statement />

    {/* 1 · Direct lines: editorial 3×2 quick-connect grid, with early access featured first. */}
    <section id="enquire" className="ct11" aria-labelledby="ct11-title">
      <div className="ct11-panel">
        <div className="ct11-head" data-reveal>
          <p className="sd-tt-eyebrow">Talk to us</p>
          <h2 id="ct11-title">Direct lines.</h2>
          <p>Choose the quickest way to reach our team, ask a question, or plan your first visit.</p>
        </div>
        <ul className="ct11-cards" data-reveal="stagger">
          {lines.map((l, n) => {
            const card = <>
              <span className="ct11-card-icon"><ContactIcon name={l.icon} /></span>
              <span className="ct11-card-body">
                <span className="ct11-card-label">{l.label}</span>
                <span className="ct11-card-value">{l.value}</span>
              </span>
              {l.action && <span className="ct11-card-action"><span className="ct11-card-action-text">{l.action}</span></span>}
            </>;

            return (
              <li className={`ct11-card${l.icon === "email" ? " ct11-card--email" : ""}`} key={l.label} style={{ "--i": n } as CSSProperties}>
                {l.earlyAccess
                  ? <EarlyAccessLink className="ct11-card-link">{card}</EarlyAccessLink>
                  : l.href?.startsWith("/")
                  ? <Link className="ct11-card-link" href={l.href}>{card}</Link>
                  : l.href
                    ? <a className="ct11-card-link" href={l.href} {...(l.external ? { target: "_blank", rel: "noreferrer" } : {})}>{card}</a>
                    : <div className="ct11-card-link">{card}</div>}
              </li>
            );
          })}
        </ul>
      </div>
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
