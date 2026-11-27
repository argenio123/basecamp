import type { Metadata } from "next";
import { Suspense } from "react";
import BookingRequestForm, { type BookingFormContent } from "@/components/schedule/BookingRequestForm";
import BookingRequestFormWithParams from "@/components/schedule/BookingRequestFormWithParams";
import { formatPhp } from "@/content/format";
import { getSiteContent } from "@/content/get";
import { PHASE_COPY } from "@/content/labels";
import type { PriceGroup } from "@/content/types";
import { bookingNote } from "@/data/programs-static";
import { getData } from "@/i18n/data";
import { alternatesFor } from "@/i18n/paths";
import { t } from "@/i18n/server";
import { isClassSlot, sessionPayable } from "@/lib/bookings/schedule";
import { bookingPaymentsOn } from "@/lib/bookings/service";
import { pesoLabel } from "@/lib/bookings/types";
import { paymentsLive } from "@/lib/payments/status";

export const metadata: Metadata = {
  title: "Book a session",
  description: "Request a class, recovery, or 1:1 appointment, camp place, or corporate group session at BaseCamp CamSur. Our team confirms every request by email or phone.",
  alternates: alternatesFor("/schedule/book"),
};

const priceOptions = (groups: PriceGroup[], ids: string[]) => groups
  .filter((g) => ids.includes(g.id))
  .flatMap((g) => g.items.filter((i) => i.visible))
  .map((i) => ({ value: i.id, label: i.price ? `${i.name} · ${formatPhp(i.price)}` : i.name }));

// Booking request: one question per screen, one-question-per-screen (cover → service → program/session →
// time → details → contact). Public: no account needed to send a request. Static under cacheComponents: reads only the cached
// getSiteContent(); ?service= / ?item= are read client-side inside <Suspense> (docs: use-search-params.md).
/** Drop-in price label for instant booking, only when online payment is on (env only: keeps the page static). */
function instantPrice(c: Awaited<ReturnType<typeof getSiteContent>>) {
  const payable = sessionPayable(c);
  return payable && bookingPaymentsOn() ? pesoLabel(payable.amount) : null;
}

// /fil/schedule/book reuses this page (src/i18n/README.md): labels and the cover note follow the request locale;
// instant booking (/pay/book) stays English by design.
export default async function ScheduleBookPage() {
  const c = await getSiteContent();
  const { contact } = c.settings;
  const { SLOT_STATUS_LABEL, WEEKDAY_LABEL } = getData("programs-static");

  const booking: BookingFormContent = {
    slots: c.schedule.timetable,
    programmes: c.programmes.featured.filter((p) => p.bookable).map((p) => ({ slug: p.slug, title: p.title })),
    appointments: priceOptions(c.pricing.groups, ["recovery", "advanced-recovery", "optimisation"]),
    camps: priceOptions(c.pricing.groups, ["camps"]),
    submitLabel: t(PHASE_COPY[c.settings.launchPhase].bookingSubmit),
    contact: { phoneDisplay: contact.phoneDisplay, phoneHref: `tel:${contact.phoneE164 || contact.phoneDisplay}`, email: contact.email },
    image: "/images/schedule/generated/booking-cover-1263x1090-v2.webp",
    // getData() keeps functions English, so the note is translated by phrase.
    note: t(bookingNote(paymentsLive())),
    disclaimer: c.recovery.disclaimer,
    labels: { weekday: WEEKDAY_LABEL, full: SLOT_STATUS_LABEL.full },
    instant: { slotIds: c.schedule.timetable.filter((s) => s.status === "open" && isClassSlot(s)).map((s) => s.id), price: instantPrice(c) },
  };

  return (
    <section className="jf-page" id="book">
      <div className="shell">
        <Suspense fallback={<BookingRequestForm content={booking} />}>
          <BookingRequestFormWithParams content={booking} />
        </Suspense>
      </div>
    </section>
  );
}
