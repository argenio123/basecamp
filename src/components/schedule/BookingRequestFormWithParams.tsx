"use client";

import { useSearchParams } from "next/navigation";
import BookingRequestForm, { type BookingFormContent } from "./BookingRequestForm";

/**
 * Reads ?service=&item= for preselection, and ?start=1 (back from log-in after pressing Start) to open on the first
 * question instead of the cover screen. Render only inside <Suspense> so /schedule/book keeps a static shell
 * (docs: 03-api-reference/04-functions/use-search-params.md). The key remounts the form when the params change,
 * e.g. after clicking a timetable slot.
 */
export default function BookingRequestFormWithParams({ content }: { content: BookingFormContent }) {
  const params = useSearchParams();
  const service = params.get("service");
  const item = params.get("item");
  const autoStart = params.get("start") === "1";
  return <BookingRequestForm key={`${service ?? ""}|${item ?? ""}|${autoStart}`} content={content} initialService={service} initialItem={item} autoStart={autoStart} />;
}
