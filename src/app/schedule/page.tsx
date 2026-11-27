import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { OverviewTemplate } from "@/components/nav/PageTemplates";
import ScheduleExplore from "@/components/schedule/ScheduleExplore";
import CtaBand from "@/components/sections/CtaBand";
import PageHero from "@/components/sections/PageHero";
import { ImageLabel, imageKind, labelledImageAlt } from "@/components/ui/AiImageLabel";
import { getSiteContent } from "@/content/get";
import { alternatesFor } from "@/i18n/paths";
import { getLocale, getUi, localHref, t } from "@/i18n/server";

export const metadata: Metadata = {
  title: "Schedule & timetable",
  description: "The weekly rhythm at BaseCamp CamSur: morning classes, open gym, private sessions, and evening programming. Preview the timetable and hours by zone, then see events, or request a session.",
  alternates: alternatesFor("/schedule"),
};

/** Timetable and events stay in the image-switching explorer; booking actions have their own section below. */
const MORE_SCHEDULE = ["/schedule/timetable", "/schedule/events"] as const;
const MORE_SCHEDULE_CARDS = {
  "/schedule/timetable": { label: "Weekly timetable", summary: "Pick a day and request a place.", image: "/images/schedule/generated/timetable-class-briefing.webp", imageAlt: "Coach briefing gym members beside a weekly session board and wall clock" },
  "/schedule/events": { label: "Competitions & events", summary: "Weekly comps and leaderboards.", image: "/images/schedule/generated/gym-competition-night.webp", imageAlt: "Athletes racing weighted sleds during a gym competition" },
};

const BOOKING_COVER = "/images/schedule/generated/booking-cover-1263x1090-v2.webp";

const BOOKING_OPTIONS = [
  { href: "/schedule/book", eyebrow: "Classes & camps", label: "Book a session", summary: "Request a coached class, camp place, or private session." },
  { href: "/schedule/book?service=appointment", eyebrow: "Recovery", label: "Recovery appointments", summary: "Request sauna, ice bath, massage, physio, or 1:1 support." },
] as const;

// Overview: four blocks between hero and footer: At a glance · [hours by zone] · Explore (Timetable, Events, Book) · CTA.
// Static under cacheComponents: reads only the cached getSiteContent(). Legacy #competition/#events/#book/
// #platform links are forwarded to the sub-pages by the root-layout HashForwarder (LEGACY_HASH_REDIRECTS).
// /fil/schedule reuses this page (src/i18n/README.md): copy goes through t(), links through localHref().
export default async function SchedulePage() {
  const c = await getSiteContent();
  const phase = c.settings.launchPhase;
  const hours = c.settings.contact.hours;

  // Hours by zone (CorePower / YMCA pattern): one schedule per kind of access, each with where it continues.
  const zones = [
    { id: "classes", label: t("Coached classes"), title: t("Class timetable"), hours: phase === "live" ? t("See the timetable") : t("Times confirmed before opening"), items: [t("Sunrise and evening classes"), "Friday Night Lights"], link: { href: localHref("/schedule/timetable"), label: t("View the timetable") } },
    { id: "open-gym", label: t("Open gym"), title: t("Athlete hours"), hours, items: [t("Train solo, staff on hand"), t("In every membership")], link: { href: localHref("/membership/price-guide#open-gym"), label: t("Open-gym passes") } },
    { id: "recovery", label: t("Recovery & appointments"), title: t("By appointment"), hours, items: [t("Sauna, ice bath, massage"), t("1:1 coaching")], link: { href: localHref("/schedule/book?service=appointment"), label: t("Request an appointment") } },
  ];

  return (
    <OverviewTemplate
      path="/schedule"
      quote={false}
      cards={false}
      hero={<PageHero variant="compact" title={t("Train from sunrise to night.")} intro={t("Classes, open gym, and recovery from sunrise to night.")} image="/images/programs/generated/personal-coaching.webp" imageAlt={t("Coach supporting an athlete during a training session")} imagePosition="35% 30%" />}
      glance={{
        summary: t("Sunrise classes.\nOpen gym hours.\nTraining under lights."),
        statement: true,
      }}
      cta={<CtaBand eyebrow={t("Early members")} label={getUi().labels.phase[phase].ctaLabel} />}
    >
      <section className="section" id="hours">
        <div className="shell">
          <div className="section-heading split-heading light-split" data-reveal>
            <div><p className="eyebrow">{t("Hours by zone")}</p><h2>{t("When each space is open.")}</h2></div>
            <p>{t("Each zone keeps its own hours.")}</p>
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
        eyebrow={t("More schedule")}
        title={t("Timetable & events.")}
        intro={t("Plan the week and see what is coming up.")}
        items={MORE_SCHEDULE.map((href) => {
          const card = MORE_SCHEDULE_CARDS[href];
          return { ...card, href: localHref(href), label: t(card.label), summary: t(card.summary), imageAlt: t(card.imageAlt) };
        })}
      />
      <section className="section sd-booking-choices" aria-labelledby="sd-booking-title">
        <div className="shell sd-booking-frame">
          <div className="sd-booking-media" data-reveal>
            <Image
              src={BOOKING_COVER}
              alt={labelledImageAlt(t("An athlete pushing a weighted sled while her coach watches at BaseCamp CamSur"), imageKind(BOOKING_COVER), getLocale())}
              fill
              sizes="(max-width: 900px) 100vw, 55vw"
              className="cover-image"
            />
            <ImageLabel src={BOOKING_COVER} className="ai-label--corner" hidden />
          </div>
          <div className="sd-booking-copy" data-reveal data-reveal-delay="short">
            <div>
              <p className="sd-booking-eyebrow">{t("Book at BaseCamp")}</p>
              <h2 id="sd-booking-title">{t("Choose your next move.")}</h2>
              <p className="sd-booking-intro">{t("Classes, camps, and recovery use one quick request. Pick where you want to begin.")}</p>
            </div>
            <div className="sd-booking-actions">
              {BOOKING_OPTIONS.map((option) => (
                <Link href={localHref(option.href)} className="sd-booking-action" key={option.href}>
                  <span className="sd-booking-action-copy">
                    <small>{t(option.eyebrow)}</small>
                    <strong>{t(option.label)}</strong>
                    <span>{t(option.summary)}</span>
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
