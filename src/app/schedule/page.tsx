import type { Metadata } from "next";
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

/** "More schedule" links: the same four links as the Schedule menu highlights, each with its own photo. */
const MORE_SCHEDULE = ["/schedule/timetable", "/schedule/events#night", "/schedule/events", "/schedule/book", "/schedule/book?service=appointment"] as const;
const MORE_SCHEDULE_CARDS = {
  "/schedule/timetable": { label: "Weekly timetable", summary: "Pick your day, filter your session, and request a place.", image: "/images/programs/stations/row.jpg", imageAlt: "Athlete on a rowing machine" },
  "/schedule/events#night": { label: "Night training", summary: "Night Games, Friday Night Lights and night runs under the lights.", image: "/images/programs/generated/endurance.png", imageAlt: "Athlete running on a curved treadmill in the open-air gym" },
  "/schedule/events": { label: "Competitions & events", summary: "Time trials, community comps, festivals and the events calendar.", image: "/images/programs/stations/wall-ball-squat.jpg", imageAlt: "Athlete squatting with a wall ball" },
  "/schedule/book": { label: "Book a session", summary: "Request a class, appointment or camp place.", image: "/images/programs/generated/functional-training.png", imageAlt: "Athlete driving a weighted sled" },
  "/schedule/book?service=appointment": { label: "Recovery appointments", summary: "Sauna, ice bath, sports massage and physiotherapy by appointment.", image: "/images/programs/generated/recovery-mobility.png", imageAlt: "Coach guiding a mobility stretch" },
};

// Overview: four blocks between hero and footer: At a glance · [hours by zone] · Explore (Timetable, Events, Book) · CTA.
// Static under cacheComponents: reads only the cached getSiteContent(). Legacy #night/#competition/#events/#book/
// #platform links are forwarded to the sub-pages by the root-layout HashForwarder (LEGACY_HASH_REDIRECTS).
export default async function SchedulePage() {
  const c = await getSiteContent();
  const s = c.schedule;
  const phase = c.settings.launchPhase;
  const hours = c.settings.contact.hours;

  // Hours by zone (CorePower / YMCA pattern): one schedule per kind of access, each with where it continues.
  const zones = [
    { id: "classes", label: "Coached classes", title: "Class timetable", hours: phase === "live" ? "See the timetable" : "Times confirmed before opening", items: ["Sunrise and evening group classes", "HYROX-style stations and coached sessions", "Friday Night Lights under the lights"], link: { href: "/schedule/timetable", label: "View the timetable" } },
    { id: "open-gym", label: "Open gym", title: "Athlete hours", hours, items: ["Self-directed training during staffed hours", "Rigs, platforms, cardio and strength equipment", "Included in every membership tier"], link: { href: "/membership/price-guide#open-gym", label: "Open-gym passes" } },
    { id: "recovery", label: "Recovery & appointments", title: "By appointment", hours, items: ["Sauna and ice bath sessions", "Sports massage and physiotherapy", "1:1 coaching and assessments"], link: { href: "/schedule/book?service=appointment", label: "Request an appointment" } },
  ];

  return (
    <OverviewTemplate
      path="/schedule"
      quote={false}
      cards={false}
      hero={<PageHero title="Train from sunrise to night." intro={s.intro} image="/images/programs/generated/personal-coaching.png" imageAlt="Coach supporting an athlete during a training session" />}
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
            <p>Classes, open gym, and recovery each keep their own hours, so you can plan coached sessions, solo training, and appointments separately.</p>
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
        title="Events & booking."
        intro="Weekly timetable, night training, competitions, and the events calendar, or request a class, appointment, or camp place."
        items={MORE_SCHEDULE.map((href) => ({ href, ...MORE_SCHEDULE_CARDS[href] }))}
      />
    </OverviewTemplate>
  );
}
