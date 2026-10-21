"use client";

import Link from "next/link";
import { useState } from "react";

const ROUTES = [
  { id: "foundation", label: "Build a foundation", fit: "New, returning or rebuilding confidence", plan: ["Movement baseline", "Technique sessions", "Progressive full-body plan"] },
  { id: "performance", label: "Improve performance", fit: "Training consistently with a clear sport or fitness goal", plan: ["Performance testing", "Goal-specific strength", "Load and recovery review"] },
  { id: "race", label: "Prepare to compete", fit: "Working toward HYROX, endurance or another timed event", plan: ["Race baseline", "Pacing and station work", "Taper and event strategy"] },
] as const;

export default function CoachingRouteGuide() {
  const [active, setActive] = useState<(typeof ROUTES)[number]["id"]>("foundation");
  const route = ROUTES.find((item) => item.id === active) ?? ROUTES[0];

  return (
    <section className="pr-route-guide" aria-labelledby="pr-route-title">
      <div className="pr-route-options" role="tablist" aria-label="Coaching routes">
        {ROUTES.map((item) => <button key={item.id} type="button" role="tab" aria-selected={active === item.id} onClick={() => setActive(item.id)}>{item.label}</button>)}
      </div>
      <div className="pr-route-result" role="tabpanel">
        <p className="pr-meta">Best fit</p><h3 id="pr-route-title">{route.label}</h3><p>{route.fit}</p>
        <ol>{route.plan.map((step, index) => <li key={step}><span>0{index + 1}</span>{step}</li>)}</ol>
        <Link href={`/contact?enquiry=coaching&route=${route.id}`}>Discuss this route →</Link>
      </div>
    </section>
  );
}
