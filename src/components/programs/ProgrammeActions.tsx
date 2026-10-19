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
  const slug = encodeURIComponent(programme.slug);

  return (
    <div className="pr-actions">
      <div className="program-actions">
        <Link className="button button-dark" href={`/contact?program=${slug}`}>Register interest <span aria-hidden="true">↗</span></Link>
        <Link className="button program-button-outline" href="/schedule#timetable" aria-describedby={preLaunch ? `pr-schedule-soon-${slug}` : undefined}>
          View schedule <span aria-hidden="true">→</span>
        </Link>
        {!preLaunch && programme.bookable && (
          <Link className="button program-button-outline" href={`/schedule/book?service=class&item=${slug}`}>Request a session <span aria-hidden="true">→</span></Link>
        )}
      </div>
      {preLaunch && <p className="pr-actions-note" id={`pr-schedule-soon-${slug}`}>{SCHEDULE_SOON}</p>}
    </div>
  );
}
