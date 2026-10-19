import type { StoryContent } from "@/content/types";

/** The five brand pillars (story.brandPillars) as a compact row. Works on paper and dark sections. */
export default function BrandPillars({ pillars, className }: { pillars: StoryContent["brandPillars"]; className?: string }) {
  if (!pillars.length) return null;
  return (
    <ul className={`ui-brand-pillars${className ? ` ${className}` : ""}`} aria-label="Brand pillars">
      {pillars.map((pillar) => (
        <li key={pillar.id} className="ui-brand-pillars-item"><h3>{pillar.title}</h3><p>{pillar.body}</p></li>
      ))}
    </ul>
  );
}
