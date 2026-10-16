"use client";

import { useSearchParams } from "next/navigation";
import InterestForm from "@/components/forms/InterestForm";

// Reads ?program= on the client so /contact can stay prerendered; render inside <Suspense>
export default function ProgramInterestForm() {
  const program = useSearchParams().get("program") ?? undefined;

  return <InterestForm program={program} key={program} />;
}
