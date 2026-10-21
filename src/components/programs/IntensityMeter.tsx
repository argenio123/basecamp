// Five-bar intensity label for class cards. Maps the free-text intensity in data/workout-types.ts to a filled range.
import type { CSSProperties } from "react";

const LEVELS: Record<string, [number, number]> = {
  Low: [1, 1],
  "Low–moderate": [1, 2],
  Moderate: [1, 3],
  "Moderate–high": [1, 4],
  High: [1, 5],
  Scalable: [1, 5],
  "Scalable–high": [2, 5],
};

export default function IntensityMeter({ intensity }: { intensity: string }) {
  const [from, to] = LEVELS[intensity] ?? [1, 3];
  const scalable = intensity.startsWith("Scalable");
  return (
    <span className={`pr-intensity${scalable ? " pr-intensity-scalable" : ""}`} role="img" aria-label={`Intensity: ${intensity}`}>
      <span className="pr-intensity-bars" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((bar) => <i key={bar} data-on={bar >= from && bar <= to ? "" : undefined} style={{ "--bar": bar } as CSSProperties} />)}
      </span>
      <span aria-hidden="true">{scalable ? "All levels" : intensity}</span>
    </span>
  );
}
