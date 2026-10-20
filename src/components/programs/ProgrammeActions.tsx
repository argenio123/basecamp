import Link from "next/link";
import type { FeaturedProgramme, LaunchPhase } from "@/content/types";
import { SCHEDULE_SOON } from "@/data/programs-static";

/**
 * Programme page buttons (stage-3 §3): Register interest → /contact?program=slug, and View schedule.
 * Before opening, "View schedule" carries "Schedule releasing soon" and leads to the timetable preview;
 * once sessions open, bookable programmes also get "Request a session" (pre-filled booking form).
 */
export default function ProgrammeActions({ programme, launchPhase }: { programme: Pick<FeaturedProgramme, "slug" | "title" | "bookable">; launchPhase: LaunchPhase }) {
  const preLaunch = launchPhase === "pre-launch";
  const live = launchPhase === "live";
  const slug = encodeURIComponent(programme.slug);
  const primary = live && programme.bookable
    ? { label: "Request a session", href: `/schedule/book?service=class&item=${slug}` }
    : launchPhase === "soft-opening"
      ? { label: "Request early access", href: `/contact?program=${slug}` }
      : { label: "Join the class waitlist", href: `/contact?program=${slug}` };

  return (
    <div className="pr-actions">
      <div className="program-actions">
        <Link className="button button-dark" href={primary.href}>{primary.label} <span aria-hidden="true">↗</span></Link>
        <Link className="button program-button-outline" href="/schedule#timetable" aria-describedby={preLaunch ? `pr-schedule-soon-${slug}` : undefined}>
          {preLaunch ? "Preview schedule" : "View schedule"} <span aria-hidden="true">→</span>
        </Link>
        <Link className="button program-button-outline" href="/membership">Compare access <span aria-hidden="true">→</span></Link>
      </div>
      {preLaunch && <p className="pr-actions-note" id={`pr-schedule-soon-${slug}`}>{SCHEDULE_SOON}</p>}
    </div>
  );
}
