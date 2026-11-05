import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ClassesEditorialHero from "@/components/programs/ClassesEditorialHero";
import GainList from "@/components/programs/GainList";
import StyleSteps from "@/components/programs/StyleSteps";
import { WORKOUT_DETAILS, stepImage } from "@/data/workout-details";
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
  const detail = WORKOUT_DETAILS[style.slug];
  const station = String(currentIndex + 1).padStart(2, "0");
  const requestHref = `/schedule/book?service=class&item=${encodeURIComponent(style.slug)}#book`;

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

      {/* Development-page layout (What it is · How a session runs · Photos · Continue into · Ask about · pager). */}
      <section className="section pr-dev-intro">
        <div className="shell">
          <div className="pr-dev-statement">
            <p className="pr-dev-statement-text" data-reveal="stagger">{detail ? detail.statement.map((line) => <span key={line}>{line}</span>) : style.description}</p>
          </div>
        </div>
      </section>

      <section className="section pr-dev-steps" aria-labelledby="pr-dev-steps-title">
        <div className="shell">
          <p className="pr-dev-label pr-dev-label-light" data-reveal>The session · 4 blocks</p>
          <h2 id="pr-dev-steps-title" data-reveal data-reveal-delay="short">How a session runs</h2>
        </div>
        <StyleSteps className={style.shortTitle} steps={style.session.map((title, i) => ({ title, body: detail?.steps[i] ?? "", image: stepImage(style.slug, i) }))} />
      </section>

      <section className="section pr-dev-gains" aria-labelledby="pr-dev-gains-title">
        <div className="shell">
          <p className="pr-dev-label pr-dev-gains-label" id="pr-dev-gains-title" data-reveal>What you gain</p>
          <GainList gains={style.outcomes.map((title, i) => ({ title, detail: detail?.gains[i] }))} />
        </div>
      </section>

      <section className="section pr-dev-ask" aria-labelledby="pr-dev-ask-title">
        <div className="shell">
          <div className="pr-dev-ask-grid">
            <div data-reveal><p className="pr-dev-label pr-dev-label-light">Ready for station {station}?</p><h2 id="pr-dev-ask-title">Ask about {style.title}</h2></div>
            <div data-reveal data-reveal-delay="short">
              <p>Tell us your level and when you want to train. The coaching team confirms times and places before opening, and early members get first access to every station class.</p>
              <div className="pr-dev-ask-actions">
                <Link className="button pr-dev-button" href={requestHref}>Request this class</Link>
                <Link className="pr-dev-link pr-dev-link-light" href={`/contact?interest=${encodeURIComponent(style.slug)}`}>General enquiry</Link>
              </div>
            </div>
          </div>
          <nav className="pr-style-pager pr-style-pager--dark" aria-label="Training styles" data-reveal="stagger">
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
    </>
  );
}
