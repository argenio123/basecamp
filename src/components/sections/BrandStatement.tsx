import type { StoryContent } from "@/content/types";

/** Editable positioning statement (story.positioning): not-line, headline, sub and a numbered breakdown. */
export default function BrandStatement({ positioning, className }: { positioning: StoryContent["positioning"]; className?: string }) {
  return (
    <div className={`ui-brand-statement${className ? ` ${className}` : ""}`}>
      {positioning.notLine && <p className="ui-brand-statement-not">{positioning.notLine}</p>}
      <h2 className="ui-brand-statement-headline">{positioning.headline}</h2>
      {positioning.sub && <p className="lead ui-brand-statement-sub">{positioning.sub}</p>}
      {positioning.breakdown.length > 0 && (
        <ol className="ui-brand-statement-grid">
          {positioning.breakdown.map((part, i) => (
            <li key={part.id}><span className="ui-brand-statement-index">{String(i + 1).padStart(2, "0")}</span><h3>{part.title}</h3><p>{part.body}</p></li>
          ))}
        </ol>
      )}
    </div>
  );
}
