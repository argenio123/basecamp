"use client";

import { useSearchParams } from "next/navigation";
import BookingRequestForm, { type BookingFormContent } from "./BookingRequestForm";

/**
 * Reads ?service=&item= (and ?date=, ?waitlist=1 from instant booking) for preselection. Render only inside <Suspense> so /schedule/book keeps a static shell
 * (docs: 03-api-reference/04-functions/use-search-params.md). The key remounts the form when the params change,
 * e.g. after clicking a timetable slot.
 */
export default function BookingRequestFormWithParams({ content }: { content: BookingFormContent }) {
  const params = useSearchParams();
  const service = params.get("service");
  const item = params.get("item");
  const date = params.get("date");
  const waitlist = params.get("waitlist") === "1";
  return <BookingRequestForm key={`${service ?? ""}|${item ?? ""}|${date ?? ""}|${waitlist}`} content={content} initialService={service} initialItem={item} initialDate={date} initialWaitlist={waitlist} />;
}
