import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import FindUs from "@/components/features/FindUs";
import InterestForm, { type ProgrammeOption } from "@/components/forms/InterestForm";
import ProgramInterestForm from "@/components/forms/ProgramInterestForm";
import { formatDateLabel } from "@/content/format";
import { getSiteContent } from "@/content/get";
import { directionsUrl } from "@/data/brand";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact BaseCamp CamSur about membership, camps, corporate programs, partnerships or media, and find directions to the facility.",
};

const PHASE_STATUS = {
  "pre-launch": { label: "Pre-opening", body: "Early membership and inquiry channels are open." },
  "soft-opening": { label: "Soft opening", body: "Invitation-only sessions are underway." },
  live: { label: "Open", body: "Training and recovery sessions are operating." },
} as const;

export default async function ContactPage() {
  const c = await getSiteContent();
  const { contact, launchPhase, openingDate } = c.settings;
  const programmes: ProgrammeOption[] = c.programmes.featured.map((programme) => ({ slug: programme.slug, title: programme.title, interest: programme.interest }));
  const phoneDigits = contact.phoneE164.replace(/\D/g, "");
  const whatsappUrl = phoneDigits ? `https://wa.me/${phoneDigits}?text=${encodeURIComponent("Hi BaseCamp CamSur, I have a quick question.")}` : "";
  const phase = PHASE_STATUS[launchPhase];
  const opening = openingDate ? formatDateLabel(openingDate) : "Date to be announced";

  return <>
    <section className="ct7-hero">
      <Image
        src="/images/facilities/facility-landscape.jpg"
        alt="BaseCamp CamSur set within the CamSur landscape"
        fill
        priority
        sizes="100vw"
        className="ct7-hero-image"
      />
      <div className="ct7-hero-shade" aria-hidden="true" />
      <div className="shell ct7-hero-content" data-reveal>
        <p className="eyebrow eyebrow-light">Contact BaseCamp</p>
        <h1>Let&apos;s connect.</h1>
        <div className="ct7-hero-intro">
          <p>Tell us what you need. We&apos;ll route it to the right person.</p>
        </div>
        <ul className="ct7-hero-facts" aria-label="At a glance">
          <li><i aria-hidden="true" />Reply within 1 business day</li>
          {whatsappUrl && <li>WhatsApp for quick questions</li>}
          <li>{phase.label}</li>
        </ul>
      </div>
    </section>

    <section id="enquire" className="ct7-enquire">
      <div className="shell ct7-enquire-grid">
        <aside className="ct7-enquire-aside" data-reveal>
          <p className="eyebrow">Guided inquiry</p>
          <h2>Tell us where to begin.</h2>
          <p>Membership, group travel and business requests need different details. Select a path and we&apos;ll keep it focused.</p>
          <dl>
            <div><dt>Response</dt><dd>Within one business day</dd></div>
            <div><dt>Best for</dt><dd>Detailed or non-urgent requests</dd></div>
            <div><dt>Privacy</dt><dd>Your information stays with BaseCamp</dd></div>
          </dl>
        </aside>
        <div className="form-card ct7-form-card" data-reveal data-reveal-delay="short">
          <Suspense fallback={<InterestForm programmes={programmes} />}><ProgramInterestForm programmes={programmes} /></Suspense>
        </div>
      </div>
    </section>

    <section className="ct7-channels">
      <div className="shell">
        <div className="ct7-section-head" data-reveal>
          <p className="eyebrow eyebrow-light">Choose the right channel</p>
          <h2>Fast question or full brief?</h2>
        </div>
        <div className="ct7-channel-grid" data-reveal="stagger">
          {whatsappUrl && <a href={whatsappUrl} target="_blank" rel="noreferrer">
            <span>01 · Fastest</span><em className="ct7-channel-time">Quickest reply</em><h3>WhatsApp</h3><p>Quick questions and same-day visits.</p><strong>Open chat <b aria-hidden="true">↗</b></strong>
          </a>}
          {contact.email && <a href={`mailto:${contact.email}`}>
            <span>02 · Attachments</span><em className="ct7-channel-time">1 business day</em><h3>Email</h3><p>Proposals, press files and longer briefs.</p><strong>{contact.email} <b aria-hidden="true">↗</b></strong>
          </a>}
          <a href="#enquire">
            <span>03 · Recommended</span><em className="ct7-channel-time">1 business day</em><h3>Guided form</h3><p>Membership, camps, corporate, partnerships and media.</p><strong>Choose an inquiry <b aria-hidden="true">↑</b></strong>
          </a>
        </div>
      </div>
    </section>

    <section className="ct7-status" aria-labelledby="visit-status-title">
      <div className="shell ct7-status-grid" data-reveal>
        <div>
          <p className="eyebrow">Visit status</p>
          <h2 id="visit-status-title">Plan before you travel.</h2>
        </div>
        <div className="ct7-status-card">
          <span className="ct7-status-label"><i aria-hidden="true" /> {phase.label}</span>
          <p>{phase.body}</p>
          <dl>
            <div><dt>Opening</dt><dd>{opening}</dd></div>
            {contact.hours && <div><dt>Hours</dt><dd>{contact.hours}</dd></div>}
            {contact.addressLines.length > 0 && <div><dt>Location</dt><dd>{contact.addressLines.join(", ")}</dd></div>}
          </dl>
          <div className="button-row">
            {contact.mapsQuery && <a className="button button-dark" href={directionsUrl(contact.mapsQuery)} target="_blank" rel="noreferrer">Get directions <span aria-hidden="true">↗</span></a>}
            <Link className="text-link" href="/visit">Plan your visit <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </div>
    </section>

    <FindUs contact={contact} title="BaseCamp CamSur" />
  </>;
}
