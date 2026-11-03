import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ClassesEditorialHero from "@/components/programs/ClassesEditorialHero";
import CtaBand from "@/components/sections/CtaBand";
import { WORKOUT_TYPES, workoutTypeBySlug } from "@/data/workout-types";

type Params = { slug: string };

export const ensureStatic = "navigation";
export const instant = false;

export function generateStaticParams(): Params[] {
  return WORKOUT_TYPES.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const style = workoutTypeBySlug(slug);
  if (!style) return { title: "Training style not found" };
  return { title: style.title, description: style.description };
}

export default async function WorkoutStylePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const style = workoutTypeBySlug(slug);
  if (!style) notFound();

  const currentIndex = WORKOUT_TYPES.findIndex((item) => item.slug === style.slug);
  // No wrap-around: the first and last stations link back to all training styles instead.
  const prevStyle = currentIndex > 0 ? WORKOUT_TYPES[currentIndex - 1] : null;
  const nextStyle = currentIndex < WORKOUT_TYPES.length - 1 ? WORKOUT_TYPES[currentIndex + 1] : null;
  const ALL_STYLES = { href: "/classes#workout-types", label: "All training styles" };

  return (
    <>
      <ClassesEditorialHero
        chapter={String(currentIndex + 1).padStart(2, "0")}
        eyebrow="Training style"
        title={style.title}
        intro={style.description}
        image={style.image}
        imageAlt={style.imageAlt}
        // Same hero as /classes: the whole 1920×1072 station photo (no crop) with the overview colour grade.
        variant="overview"
        minimalMeta
        fullImage
      />

      <section className={`section pr-style-module pr-style-module-${style.theme}`}>
        <div className="shell">
          <Link className="pr-style-back" href="/classes#workout-types">← All training styles</Link>
          <div className="pr-style-intro">
            <div><p className="eyebrow">The class</p><h2>What this class builds.</h2></div>
            <p>{style.description}</p>
          </div>

          <dl className="pr-style-facts">
            <div><dt>Focus</dt><dd>{style.focus}</dd></div>
            <div><dt>Format</dt><dd>{style.format}</dd></div>
            <div><dt>Intensity</dt><dd>{style.intensity}</dd></div>
          </dl>

          <div className="pr-style-flow">
            <div><p className="eyebrow">Session flow</p><h2>How a session runs.</h2></div>
            <ol>{style.session.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, "0")}</span><strong>{item}</strong></li>)}</ol>
          </div>

          <div className="pr-style-outcomes">
            <p className="eyebrow">What you&apos;ll notice</p>
            <ul>{style.outcomes.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>


          <nav className="pr-style-pager" aria-label="Training styles">
            <Link className="pr-style-pager-link pr-style-pager-prev" href={prevStyle ? `/classes/styles/${prevStyle.slug}` : ALL_STYLES.href}>
              <span><i aria-hidden="true">‹</i> {prevStyle ? "Previous" : "Back to"}</span>
              <strong>{prevStyle ? prevStyle.title : ALL_STYLES.label}</strong>
            </Link>
            <Link className="pr-style-pager-link pr-style-pager-next" href={nextStyle ? `/classes/styles/${nextStyle.slug}` : ALL_STYLES.href}>
              <span>{nextStyle ? "Next" : "Back to"} <i aria-hidden="true">›</i></span>
              <strong>{nextStyle ? nextStyle.title : ALL_STYLES.label}</strong>
            </Link>
          </nav>
        </div>
      </section>

      <CtaBand eyebrow={style.shortTitle} title="Ready to train?" body="Join the early-access list and tell us which class to try first." label="Get early access" href={`/contact?interest=${encodeURIComponent(style.slug)}`} />
    </>
  );
}
