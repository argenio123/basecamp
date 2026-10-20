type Props = {
  text: string;
  tone?: "light" | "dark" | "stone";
  className?: string;
  gymMarks?: boolean;
};

function DumbbellMark() {
  return (
    <span className="ft-marquee-gym-mark ft-marquee-gym-mark--dumbbell">
      <svg className="ft-marquee-gym-svg--outline" viewBox="0 0 96 48" fill="none" aria-hidden="true">
        <rect x="4" y="16" width="8" height="16" rx="2" />
        <rect x="12" y="10" width="11" height="28" rx="2" />
        <rect x="23" y="17" width="7" height="14" rx="2" />
        <path d="M30 24h36" />
        <rect x="66" y="17" width="7" height="14" rx="2" />
        <rect x="73" y="10" width="11" height="28" rx="2" />
        <rect x="84" y="16" width="8" height="16" rx="2" />
      </svg>
    </span>
  );
}

function KettlebellMark() {
  return (
    <span className="ft-marquee-gym-mark ft-marquee-gym-mark--kettlebell">
      <svg className="ft-marquee-gym-svg--outline" viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <path d="M13 31 10.5 18C9 9 16 3 26 3h12c10 0 17 6 15.5 15L51 31" />
        <path d="M20 26.5 18.5 19c-.8-4.5 2.4-7.5 7.5-7.5h12c5.1 0 8.3 3 7.5 7.5L44 26.5" />
        <path d="M32 24.5c-15.2 0-27.5 12.3-27.5 27.5 0 6.1 4.9 11 11 11h33c6.1 0 11-4.9 11-11 0-15.2-12.3-27.5-27.5-27.5Z" />
      </svg>
    </span>
  );
}

/**
 * Big scrolling heading band. The track holds two identical groups and slides by one group. Decorative, so
 * hidden from screen readers; it stops under prefers-reduced-motion (src/styles/features.css).
 */
export default function Marquee({ text, tone = "light", className = "", gymMarks = false }: Props) {
  const group = Array.from({ length: 4 }, (_, i) => (
    <span className="ft-marquee-item" key={i}>
      {text}
      {gymMarks ? (i % 2 === 0 ? <DumbbellMark /> : <KettlebellMark />) : <span className="ft-marquee-dot" />}
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
