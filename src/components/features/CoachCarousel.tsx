import Image from "next/image";
import type { Coach } from "@/content/types";

/**
 * Coach / team carousel (reload-fitness.com "THE TEAM"): portrait cards with the name over the photo, a faded
 * ghost title behind, swipeable on every screen size. Renders nothing until coaches are added in /admin.
 */
export default function CoachCarousel({ coaches, title = "The team" }: { coaches: readonly Coach[]; title?: string }) {
  const list = coaches.filter((coach) => coach.name && coach.image);
  if (list.length === 0) return null;
  return (
    <section className="section ft-team section-dark">
      <div className="shell ft-ghost-wrap">
        <span className="ft-ghost" aria-hidden="true">{title.toUpperCase()}</span>
        <h2 className="ft-team-title" data-reveal>{title}</h2>
      </div>
      <ul className="ft-team-row" data-reveal="stagger">
        {list.map((coach) => (
          <li key={coach.id} className="ft-coach">
            <Image src={coach.image} alt={coach.name} fill sizes="(max-width: 760px) 70vw, 300px" className="cover-image" />
            <span className="ft-coach-name">{coach.name}{coach.role && <small>{coach.role}</small>}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
