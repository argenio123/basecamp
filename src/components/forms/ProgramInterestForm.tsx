"use client";

import { useSearchParams } from "next/navigation";
import InterestForm, { type ProgrammeOption } from "@/components/forms/InterestForm";

// Reads ?program=, ?interest= and ?enquiry= on the client so /contact stays prerendered.
// Render inside <Suspense> (03-api-reference/04-functions/use-search-params.md).
export default function ProgramInterestForm({ programmes }: { programmes: ProgrammeOption[] }) {
  const params = useSearchParams();
  const program = params.get("program") ?? undefined;
  const interests = params.getAll("interest").flatMap((v) => v.split(",")).map((v) => v.trim()).filter(Boolean);
  const enquiry = params.get("enquiry");
  const key = params.toString();

  return <InterestForm key={key} programmes={programmes} program={program} interests={interests} enquiry={enquiry ?? undefined} />;
}
