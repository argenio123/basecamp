import Image from "next/image";
import Link from "next/link";
import StatusBadge from "@/components/ui/StatusBadge";
import { programmeHref } from "@/content/sitemap";
import type { FeaturedProgramme, LaunchPhase, ProgrammeGoalId } from "@/content/types";
import { FEATURED_PROGRAMME_OUTCOMES } from "@/data/programs-static";

export type ExplorerProgramme = Pick<FeaturedProgramme, "slug" | "title" | "description" | "image" | "goals" | "intensity" | "level" | "duration" | "format">;

const GOAL_LABEL: Record<ProgrammeGoalId, string> = {
  strength: "Strength",
  movement: "Movement",
  engine: "Engine",
  fitness: "Fitness",
  recover: "Recovery",
  new: "Beginner friendly",
};

const STATUS: Record<LaunchPhase, { availability: "available" | "at-launch"; label: string }> = {
  "pre-launch": { availability: "at-launch", label: "At launch" },
  "soft-opening": { availability: "at-launch", label: "Early access" },
  live: { availability: "available", label: "Available now" },
};

/**
 * Program concept tiles: dark photo links with signal-lime names beneath a faded ghost word.
 */
export default function ProgramExplorer({ programmes, launchPhase }: { programmes: ExplorerProgramme[]; launchPhase: LaunchPhase }) {
  const status = STATUS[launchPhase];

  return (
    <div className="pr-explorer">
      <ul className="pr-program-grid" data-reveal="stagger">
        {programmes.map((programme, index) => (
          <li key={programme.slug} className="pr-program-card">
            <Link href={programmeHref(programme.slug)} className="pr-program-media" aria-label={`View ${programme.title} classes`}>
              <Image src={programme.image} alt="" fill sizes="(max-width: 760px) 100vw, (max-width: 1040px) 50vw, 33vw" className="cover-image" />
              <span className="pr-program-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
            </Link>
            <div className="pr-program-body">
              <div className="pr-program-head">
                <p className="pr-meta">{programme.format} · {programme.duration} min</p>
                <StatusBadge availability={status.availability} label={status.label} />
              </div>
              <h2><Link href={programmeHref(programme.slug)}>{programme.title}</Link></h2>
              <p className="pr-program-outcome">{FEATURED_PROGRAMME_OUTCOMES[programme.slug] ?? programme.description}</p>
              <dl className="pr-program-facts">
                <div><dt>Level</dt><dd>{programme.level}</dd></div>
                <div><dt>Intensity</dt><dd>{programme.intensity == null ? "Individual" : `${programme.intensity} / 5`}</dd></div>
                <div><dt>Focus</dt><dd>{programme.goals.slice(0, 2).map((goal) => GOAL_LABEL[goal]).join(" + ")}</dd></div>
              </dl>
              <Link href={programmeHref(programme.slug)} className="pr-program-link">View classes <span aria-hidden="true">→</span></Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
