/**
 * Big scrolling heading band between sections (ritebali.com "Find Your Ritual ○ Find Your Ritual").
 * Pure CSS loop: the track holds two identical groups and slides by one group. Decorative, so hidden from
 * screen readers; it stops under prefers-reduced-motion (src/styles/features.css).
 */
export default function Marquee({ text, tone = "light", className = "" }: { text: string; tone?: "light" | "dark" | "stone"; className?: string }) {
  const group = Array.from({ length: 4 }, (_, i) => (
    <span className="ft-marquee-item" key={i}>
      {text}
      <span className="ft-marquee-dot" />
    </span>
  ));

  return (
    <div className={`ft-marquee ft-marquee--${tone}${className ? ` ${className}` : ""}`} aria-hidden="true">
      <div className="ft-marquee-track">
        <div className="ft-marquee-group">{group}</div>
        <div className="ft-marquee-group">{group}</div>
      </div>
    </div>
  );
}
