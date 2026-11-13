"use client";

import { useSearchParams } from "next/navigation";
import type { ComponentProps } from "react";
import MembershipJoinForm from "./MembershipJoinForm";

/**
 * Reads ?tier= (set by the "Join <plan>" buttons) to preselect the plan, and ?start=1 (back from log-in after
 * pressing Start) to open on the first question instead of the cover screen. Render only inside <Suspense> so
 * /membership/join keeps a static shell (docs: 03-api-reference/04-functions/use-search-params.md).
 */
export default function MembershipJoinFormWithParams(props: Omit<ComponentProps<typeof MembershipJoinForm>, "initialTier" | "autoStart">) {
  const params = useSearchParams();
  const tier = params.get("tier");
  const autoStart = params.get("start") === "1";
  return <MembershipJoinForm key={`${tier ?? ""}:${autoStart}`} {...props} initialTier={tier} autoStart={autoStart} />;
}
