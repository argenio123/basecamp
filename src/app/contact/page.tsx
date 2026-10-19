import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import InterestForm, { type ProgrammeOption } from "@/components/forms/InterestForm";
import ProgramInterestForm from "@/components/forms/ProgramInterestForm";
import AtAGlance from "@/components/ui/AtAGlance";
import FoundingCounter from "@/components/ui/FoundingCounter";
import SocialIcon from "@/components/ui/SocialIcon";
import { getSiteContent } from "@/content/get";
import { FOUNDING_HREF } from "@/content/sitemap";
import { ABOUT_GLANCE, CONTACT } from "@/data/about";
import { directionsUrl } from "@/data/brand";

export const metadata: Metadata = {
  title: "Early Access & Contact",
  description: "Join the BaseCamp CamSur founding list for founding-member rates, exclusive updates and priority access, send an inquiry about corporate, camp and partnership bookings, or get directions.",
};

// Stage-3 §1: intro → At a glance (ways to reach BaseCamp) → enquiry form → address + map link.
// Static shell: the form reads ?program=, ?interest= and ?enquiry= on the client inside <Suspense>
// (03-api-reference/04-functions/use-search-params.md). The page itself only awaits the cached content.
export default async function ContactPage() {
  const c = await getSiteContent();
  const { contact, founding } = c.settings;
  const socials = c.settings.socials.filter((s) => s.url);
  const list: ProgrammeOption[] = c.programmes.featured.map((p) => ({ slug: p.slug, title: p.title, interest: p.interest }));
  const hasAddress = contact.addressLines.length > 0 || Boolean(contact.phoneDisplay || contact.email || contact.hours || contact.mapsQuery);

  return <>
    <section className="ct-hero"><div className="shell" data-reveal>
      <p className="eyebrow">{CONTACT.eyebrow}</p>
      <h1 className="ct-title">{CONTACT.title}</h1>
      <p className="lead">{CONTACT.lead}</p>
    </div></section>

    <AtAGlance
      summary={ABOUT_GLANCE.contact}
      facts={[
        contact.email && { label: "Email", value: contact.email },
        contact.phoneDisplay && { label: "Phone", value: contact.phoneDisplay },
        contact.hours && { label: "Hours", value: contact.hours },
        contact.addressLines.length > 0 && { label: "Address", value: contact.addressLines.join(", ") },
      ]}
    />

    <section id="enquire" className="contact-page ct-page"><div className="shell contact-grid">
      {/* .contact-intro is sticky on desktop, so the reveal goes on an inner wrapper. */}
      <div className="contact-intro"><div data-reveal>
        <p className="eyebrow">{CONTACT.formEyebrow}</p>
        <h2 className="ct-form-title">{CONTACT.formTitle}</h2>
        <p className="ct-form-intro">{CONTACT.formIntro}</p>
        {founding.enabled && <div className="ct-founding">
          {founding.summary && <p>{founding.summary}</p>}
          {founding.example && <p className="ct-founding-example">{founding.example}</p>}
          <FoundingCounter founding={founding} />
          <Link href={FOUNDING_HREF} className="text-link ct-founding-link">{CONTACT.foundingLink} <span>↗</span></Link>
        </div>}
        {socials.length > 0 && <ul className="ct-socials" aria-label="Follow BaseCamp CamSur">{socials.map((s) => <li key={s.platform}><a href={s.url} target="_blank" rel="noreferrer" aria-label={s.platform}><SocialIcon platform={s.platform} /></a></li>)}</ul>}
      </div></div>
      <div className="form-card" data-reveal data-reveal-delay="short">
        <Suspense fallback={<InterestForm programmes={list} />}><ProgramInterestForm programmes={list} /></Suspense>
      </div>
    </div></section>

    {hasAddress && <section id="find-us" className="section ct-find"><div className="shell ct-find-grid">
      <div data-reveal>
        <p className="eyebrow">{CONTACT.findEyebrow}</p>
        <h2>{CONTACT.findTitle}</h2>
        <p className="ct-find-intro">{CONTACT.findIntro}</p>
        <Link href="/visit" className="text-link">{CONTACT.visitLink} <span>↗</span></Link>
      </div>
      <address className="ct-find-card" data-reveal data-reveal-delay="short">
        <span className="ct-find-name">BaseCamp CamSur</span>
        {contact.addressLines.length > 0 && <span className="ct-find-lines">{contact.addressLines.map((line, i) => <span key={i}>{i > 0 && <br />}{line}</span>)}</span>}
        {contact.phoneDisplay && <span className="ct-find-row"><span>Phone</span><a href={`tel:${contact.phoneE164}`}>{contact.phoneDisplay}</a></span>}
        {contact.email && <span className="ct-find-row"><span>Email</span><a href={`mailto:${contact.email}`}>{contact.email}</a></span>}
        {contact.hours && <span className="ct-find-row"><span>Hours</span><span>{contact.hours}</span></span>}
        {contact.mapsQuery && <a className="button button-dark ct-find-directions" href={directionsUrl(contact.mapsQuery)} target="_blank" rel="noreferrer">Get directions <span aria-hidden="true">↗</span></a>}
      </address>
    </div></section>}
  </>;
}
