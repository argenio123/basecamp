"use client";

import { useState } from "react";

const METRICS = [
  { id: "engine", label: "Aerobic capacity", value: 48, detail: "Guides pacing, interval density and recovery between efforts." },
  { id: "movement", label: "Movement quality", value: 59, detail: "Highlights range, control and technique priorities for the plan." },
  { id: "strength", label: "Strength", value: 70, detail: "Sets useful starting loads and progressive strength targets." },
  { id: "composition", label: "Body composition", value: 81, detail: "Provides optional context for health or performance goals." },
] as const;

export default function PerformanceBaselineDashboard() {
  const [active, setActive] = useState<(typeof METRICS)[number]["id"]>("engine");
  const selected = METRICS.find((metric) => metric.id === active) ?? METRICS[0];

  return (
    <div className="pr-baseline-dashboard" data-reveal>
      <div><p className="pr-meta">Performance baseline · Example view</p><h3>Your starting point, made visible.</h3><p>Select a marker to see how it informs a training plan. This preview contains illustrative values, not athlete data.</p><aside aria-live="polite"><strong>{selected.label}</strong><span>{selected.detail}</span></aside></div>
      <div className="pr-baseline-metrics" role="group" aria-label="Preview performance markers">
        {METRICS.map((metric) => <button key={metric.id} type="button" aria-pressed={metric.id === active} onClick={() => setActive(metric.id)}><span>{metric.label}</span><i><b style={{ width: `${metric.value}%` }} /></i><small>Explore</small></button>)}
      </div>
    </div>
  );
}
