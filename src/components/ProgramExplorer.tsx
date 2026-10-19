import Image from "next/image";
import Link from "next/link";
import { programmeHref } from "@/content/sitemap";
import type { FeaturedProgramme } from "@/content/types";

export type ExplorerProgramme = Pick<
  FeaturedProgramme,
  "slug" | "title" | "description" | "image"
>;

/** The five flagship programme cards. */
export default function ProgramExplorer({ programmes }: { programmes: ExplorerProgramme[] }) {
  return (
    <div className="pr-explorer">
      <ul className="pr-explorer-grid" data-reveal="stagger">
        {programmes.map((programme) => (
          <li key={programme.slug}>
            <Link href={programmeHref(programme.slug)} className="pr-card">
              <span className="pr-card-media">
                <Image src={programme.image} alt="" fill sizes="(max-width: 760px) 100vw, (max-width: 1040px) 50vw, 33vw" className="cover-image" />
              </span>
              <span className="pr-card-body">
                <span className="pr-card-title">{programme.title}</span>
                <span className="pr-card-summary">{programme.description}</span>
                <span className="pr-card-more">Read more <span aria-hidden="true">→</span></span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
