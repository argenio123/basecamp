import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { OverviewTemplate } from "@/components/nav/PageTemplates";
import ScheduleExplore from "@/components/schedule/ScheduleExplore";
import CtaBand from "@/components/sections/CtaBand";
import PageHero from "@/components/sections/PageHero";
import { getSiteContent } from "@/content/get";
import { PHASE_COPY } from "@/content/labels";

export const metadata: Metadata = {
  title: "Schedule & timetable",
  description: "The weekly rhythm at BaseCamp CamSur: morning classes, open gym, private sessions, and evening programming. Preview the timetable and hours by zone, then see events, or request a session.",
};

/** Timetable and events stay in the image-switching explorer; booking actions have their own section below. */
const MORE_SCHEDULE = ["/schedule/timetable", "/schedule/events"] as const;
const MORE_SCHEDULE_CARDS = {
  "/schedule/timetable": { label: "Weekly timetable", summary: "Pick a day and request a place.", image: "/images/schedule/generated/timetable-class-briefing.webp", imageAlt: "Coach briefing gym members beside a weekly session board and wall clock" },
  "/schedule/events": { label: "Competitions & events", summary: "Weekly comps and leaderboards.", image: "/images/schedule/generated/gym-competition-night.webp", imageAlt: "Athletes racing weighted sleds during a gym competition" },
};

const BOOKING_OPTIONS = [
  { href: "/schedule/book", eyebrow: "Classes & camps", label: "Book a session", summary: "Request a coached class, camp place, or private session." },
  { href: "/schedule/book?service=appointment", eyebrow: "Recovery", label: "Recovery appointments", summary: "Request sauna, ice bath, massage, physio, or 1:1 support." },
] as const;

// Overview: four blocks between hero and footer: At a glance · [hours by zone] · Explore (Timetable, Events, Book) · CTA.
// Static under cacheComponents: reads only the cached getSiteContent(). Legacy #competition/#events/#book/
// #platform links are forwarded to the sub-pages by the root-layout HashForwarder (LEGACY_HASH_REDIRECTS).
export default async function SchedulePage() {
  const c = await getSiteContent();
  const phase = c.settings.launchPhase;
  const hours = c.settings.contact.hours;

  // Hours by zone (CorePower / YMCA pattern): one schedule per kind of access, each with where it continues.
  const zones = [
    { id: "classes", label: "Coached classes", title: "Class timetable", hours: phase === "live" ? "See the timetable" : "Times confirmed before opening", items: ["Sunrise and evening classes", "Friday Night Lights"], link: { href: "/schedule/timetable", label: "View the timetable" } },
    { id: "open-gym", label: "Open gym", title: "Athlete hours", hours, items: ["Train solo, staff on hand", "In every membership"], link: { href: "/membership/price-guide#open-gym", label: "Open-gym passes" } },
    { id: "recovery", label: "Recovery & appointments", title: "By appointment", hours, items: ["Sauna, ice bath, massage", "1:1 coaching"], link: { href: "/schedule/book?service=appointment", label: "Request an appointment" } },
  ];

  return (
    <OverviewTemplate
      path="/schedule"
      quote={false}
      cards={false}
      hero={<PageHero title="Train from sunrise to night." intro="Classes, open gym, and recovery from sunrise to night." image="/images/programs/generated/personal-coaching.webp" imageAlt="Coach supporting an athlete during a training session" imagePosition="35% center" />}
      glance={{
        summary: "Sunrise classes.\nOpen gym hours.\nTraining under lights.",
        statement: true,
      }}
      cta={<CtaBand eyebrow="Early members" label={PHASE_COPY[phase].ctaLabel} />}
    >
      <section className="section" id="hours">
        <div className="shell">
          <div className="section-heading split-heading light-split" data-reveal>
            <div><p className="eyebrow">Hours by zone</p><h2>When each space is open.</h2></div>
            <p>Each zone keeps its own hours.</p>
          </div>
          <ul className="sd-hours" data-reveal="stagger">
            {zones.map((z) => (
              <li key={z.id} className="sd-hours-card">
                <p className="sd-hours-label">{z.label}</p>
                <h3>{z.title}</h3>
                <p className="sd-hours-time">{z.hours}</p>
                <ul className="sd-hours-list">{z.items.map((item) => <li key={item}>{item}</li>)}</ul>
                <Link className="sd-hours-link" href={z.link.href}>{z.link.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <ScheduleExplore
        eyebrow="More schedule"
        title="Timetable & events."
        intro="Plan the week and see what is coming up."
        items={MORE_SCHEDULE.map((href) => ({ href, ...MORE_SCHEDULE_CARDS[href] }))}
      />
      <section className="section sd-booking-choices" aria-labelledby="sd-booking-title">
        <div className="shell sd-booking-frame">
          <div className="sd-booking-media" data-reveal>
            <Image
              src="/images/schedule/generated/booking-cover-1263x1090-v2.webp"
              alt="An athlete pushing a weighted sled while her coach watches at BaseCamp CamSur"
              fill
              sizes="(max-width: 900px) 100vw, 55vw"
              className="cover-image"
            />
          </div>
          <div className="sd-booking-copy" data-reveal data-reveal-delay="short">
            <div>
              <p className="sd-booking-eyebrow">Book at BaseCamp</p>
              <h2 id="sd-booking-title">Choose your next move.</h2>
              <p className="sd-booking-intro">Classes, camps, and recovery use one quick request. Pick where you want to begin.</p>
            </div>
            <div className="sd-booking-actions">
              {BOOKING_OPTIONS.map((option) => (
                <Link href={option.href} className="sd-booking-action" key={option.href}>
                  <span className="sd-booking-action-copy">
                    <small>{option.eyebrow}</small>
                    <strong>{option.label}</strong>
                    <span>{option.summary}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </OverviewTemplate>
  );
}
