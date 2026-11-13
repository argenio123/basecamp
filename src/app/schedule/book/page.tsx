import type { Metadata } from "next";
import { Suspense } from "react";
import RequestGate from "@/components/members/RequestGate";
import BookingRequestForm, { type BookingFormContent } from "@/components/schedule/BookingRequestForm";
import BookingRequestFormWithParams from "@/components/schedule/BookingRequestFormWithParams";
import { formatPhp } from "@/content/format";
import { getSiteContent } from "@/content/get";
import { PHASE_COPY } from "@/content/labels";
import type { PriceGroup } from "@/content/types";
import { BOOKING_NOTE } from "@/data/programs-static";

export const metadata: Metadata = {
  title: "Book a session",
  description: "Request a class, recovery, or 1:1 appointment, camp place, or corporate group session at BaseCamp CamSur. Our team confirms every request by email or phone.",
};

const priceOptions = (groups: PriceGroup[], ids: string[]) => groups
  .filter((g) => ids.includes(g.id))
  .flatMap((g) => g.items.filter((i) => i.visible))
  .map((i) => ({ value: i.id, label: i.price ? `${i.name} · ${formatPhp(i.price)}` : i.name }));

// Booking request: one question per screen, same format as /membership/join (cover → service → program/session →
// time → details → contact). Member-only (src/proxy.ts). Static under cacheComponents: reads only the cached
// getSiteContent(); ?service= / ?item= are read client-side inside <Suspense> (docs: use-search-params.md).
export default async function ScheduleBookPage() {
  const c = await getSiteContent();
  const { contact } = c.settings;

  const booking: BookingFormContent = {
    slots: c.schedule.timetable,
    programmes: c.programmes.featured.filter((p) => p.bookable).map((p) => ({ slug: p.slug, title: p.title })),
    appointments: priceOptions(c.pricing.groups, ["recovery", "advanced-recovery", "optimisation"]),
    camps: priceOptions(c.pricing.groups, ["camps"]),
    submitLabel: PHASE_COPY[c.settings.launchPhase].bookingSubmit,
    contact: { phoneDisplay: contact.phoneDisplay, phoneHref: `tel:${contact.phoneE164 || contact.phoneDisplay}`, email: contact.email },
    image: "/images/schedule/generated/booking-cover-1263x1090-v2.png",
    note: BOOKING_NOTE,
    disclaimer: c.recovery.disclaimer,
  };

  return (
    <section className="jf-page" id="book">
      <div className="shell">
        <Suspense fallback={null}><RequestGate always /></Suspense>
        <Suspense fallback={<BookingRequestForm content={booking} />}>
          <BookingRequestFormWithParams content={booking} />
        </Suspense>
      </div>
    </section>
  );
}
