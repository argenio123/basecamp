import type { Metadata } from "next";
import { Suspense } from "react";
import { DetailTemplate } from "@/components/nav/PageTemplates";
import BookingRequestForm, { type BookingFormContent } from "@/components/schedule/BookingRequestForm";
import BookingRequestFormWithParams from "@/components/schedule/BookingRequestFormWithParams";
import CtaBand from "@/components/sections/CtaBand";
import PageHero from "@/components/sections/PageHero";
import StatusBadge from "@/components/ui/StatusBadge";
import { formatPhp } from "@/content/format";
import { getSiteContent } from "@/content/get";
import { PHASE_COPY } from "@/content/labels";
import type { PriceGroup } from "@/content/types";
import { BOOKING_NOTE, PLATFORM_CARDS, PLATFORM_COMING_SOON } from "@/data/programs-static";

export const metadata: Metadata = {
  title: "Book a session",
  description: "Request a class, recovery or 1:1 appointment, camp place or corporate group session at BaseCamp CamSur. Our team confirms every request by email or phone.",
};

const pad = (n: number) => String(n).padStart(2, "0");
const priceOptions = (groups: PriceGroup[], ids: string[]) => groups
  .filter((g) => ids.includes(g.id))
  .flatMap((g) => g.items.filter((i) => i.visible))
  .map((i) => ({ value: i.id, label: i.price ? `${i.name} · ${formatPhp(i.price)}` : i.name }));

// Detail page (stage-3 §1): [book] booking-request form + [platform], moved from the stage-2 /schedule page.
// Static under cacheComponents: reads only the cached getSiteContent(). The form reads ?service= / ?item= with
// useSearchParams inside <Suspense>; the fallback is the same form without pre-fill
// (docs: 03-api-reference/04-functions/use-search-params.md, "Prerendering").
export default async function ScheduleBookPage() {
  const c = await getSiteContent();
  const s = c.schedule;
  const phase = c.settings.launchPhase;
  const bookingWidgetUrl = c.settings.bookingWidgetUrl;

  const booking: BookingFormContent = {
    slots: s.timetable,
    programmes: c.programmes.featured.filter((p) => p.bookable).map((p) => ({ slug: p.slug, title: p.title })),
    appointments: priceOptions(c.pricing.groups, ["recovery", "advanced-recovery", "optimisation"]),
    camps: priceOptions(c.pricing.groups, ["camps"]),
    submitLabel: PHASE_COPY[phase].bookingSubmit,
  };

  return (
    <DetailTemplate
      path="/schedule/book"
      hero={<PageHero eyebrow="Book" title="Request a session." intro="Classes, recovery and 1:1 appointments, camps and corporate groups: tell us what you need and we'll confirm availability." image="/images/programs/generated/functional-training.png" imageAlt="Functional training session" />}
      glance={{
        summary: "Request a class, recovery appointment, camp place or group session. Our team confirms every request by email or phone.",
        facts: [
          { label: "Request", value: "Classes · appointments · camps · groups" },
          { label: "Party size", value: "1–60" },
          { label: "Confirmation", value: "By email or phone" },
        ],
      }}
      related={["/membership/passes", "/membership/recovery-pricing", "/visit/camps"]}
      cta={<CtaBand eyebrow="Early members" label={PHASE_COPY[phase].ctaLabel} />}
    >
      <section className="section" id="book">
        <div className="shell sd-book">
          <div className="sd-book-intro">
            <div className="sd-book-intro-inner" data-reveal>
              <p className="eyebrow">Book</p>
              <h2>Your booking request.</h2>
              <p className="lead">Choose a service, pick a program, session or package, and tell us when suits you.</p>
              <p className="sd-meta">{BOOKING_NOTE}</p>
              {c.recovery.disclaimer && <p className="sd-meta sd-disclaimer">{c.recovery.disclaimer}</p>}
            </div>
          </div>
          <div className="form-card" data-reveal data-reveal-delay="short">
            <Suspense fallback={<BookingRequestForm content={booking} />}>
              <BookingRequestFormWithParams content={booking} />
            </Suspense>
          </div>
        </div>
      </section>

      <section className="section sd-band" id="platform">
        <div className="shell">
          <div className="section-heading split-heading light-split" data-reveal><div><p className="eyebrow">Digital platform</p><h2>Booking made easy.</h2></div><p>The digital experience will match the physical one: easy booking, clear communication and frictionless membership.</p></div>
          <ul className="sd-grid sd-grid-4" data-reveal="stagger">
            {PLATFORM_CARDS.map((p, i) => (
              <li className="sd-card" key={p.id}>
                <span className="sd-index">{pad(i + 1)}</span>
                <h3>{p.title}</h3>
                <p>{p.description}</p>
                {p.id === "booking" && bookingWidgetUrl
                  ? <a className="text-link" href={bookingWidgetUrl} target="_blank" rel="noopener noreferrer">Book online <span>↗</span></a>
                  : <StatusBadge availability="planned" label="Coming soon" />}
              </li>
            ))}
          </ul>
          <div className="sd-coming-soon" data-reveal>
            <p className="eyebrow">Coming soon</p>
            <ul className="sd-chip-list">{PLATFORM_COMING_SOON.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
        </div>
      </section>
    </DetailTemplate>
  );
}
