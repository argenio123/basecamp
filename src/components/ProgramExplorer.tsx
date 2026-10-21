import Image from "next/image";
import Link from "next/link";
import StatusBadge from "@/components/ui/StatusBadge";
import { programmeHref } from "@/content/sitemap";
import type { FeaturedProgramme, LaunchPhase } from "@/content/types";
import { FEATURED_PROGRAMME_OUTCOMES } from "@/data/programs-static";

export type ExplorerProgramme = Pick<FeaturedProgramme, "slug" | "title" | "description" | "image" | "duration" | "format">;

const STATUS: Record<LaunchPhase, { availability: "available" | "at-launch"; label: string }> = {
  "pre-launch": { availability: "at-launch", label: "At launch" },
  "soft-opening": { availability: "at-launch", label: "Early access" },
  live: { availability: "available", label: "Available now" },
};

export default function ProgramExplorer({ programmes, launchPhase }: { programmes: ExplorerProgramme[]; launchPhase: LaunchPhase }) {
  const status = STATUS[launchPhase];

  return (
    <div className="pr-explorer">
      <div className="pr-finder-head" data-reveal>
        <div><p className="eyebrow">Find your class</p><h2>Choose what you want to become stronger at.</h2></div>
        <p>Explore each training path, then open the class that feels right.</p>
      </div>
      <div className="pr-finder-status"><span>{programmes.length} classes</span></div>
      <ul className="pr-program-grid" data-reveal="stagger">
        {programmes.map((programme) => {
          return (
            <li key={programme.slug} className="pr-program-card">
              <Link href={programmeHref(programme.slug)} className="pr-program-media" aria-label={`View ${programme.title} classes`}>
                <Image src={programme.image} alt="" fill sizes="(max-width: 760px) 100vw, (max-width: 1040px) 50vw, 33vw" className="cover-image" />
              </Link>
              <div className="pr-program-body">
                <div className="pr-program-head"><StatusBadge availability={status.availability} label={status.label} /></div>
                <h2><Link href={programmeHref(programme.slug)}>{programme.title}</Link></h2>
                <p className="pr-program-outcome">{FEATURED_PROGRAMME_OUTCOMES[programme.slug] ?? programme.description}</p>
                <div className="pr-program-actions"><Link href={programmeHref(programme.slug)}>View class</Link></div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
