"use client";

import Link from "next/link";
import { useState } from "react";

const ITINERARIES = [
  { id: "half-day", label: "Half-day", time: "4 hours", flow: "Arrival · team baseline · coached challenge · recovery reset" },
  { id: "full-day", label: "Full-day", time: "8 hours", flow: "Assessment · training blocks · shared lunch · recovery · team debrief" },
  { id: "weekend", label: "Weekend", time: "2 days / 1 night", flow: "Training · recovery · CamSur experience · leadership session · team close" },
] as const;

export default function CorporateConfigurator() {
  const [team, setTeam] = useState("10–20 people");
  const [duration, setDuration] = useState("Full-day");
  const [objective, setObjective] = useState("Team connection");

  return (
    <div className="pr-corporate-config">
      <div className="pr-config-fields">
        <label>Team size<select value={team} onChange={(event) => setTeam(event.target.value)}><option>6–10 people</option><option>10–20 people</option><option>20–40 people</option><option>40+ people</option></select></label>
        <label>Duration<select value={duration} onChange={(event) => setDuration(event.target.value)}>{ITINERARIES.map((item) => <option key={item.id}>{item.label}</option>)}</select></label>
        <label>Objective<select value={objective} onChange={(event) => setObjective(event.target.value)}><option>Team connection</option><option>Leadership under pressure</option><option>Health & wellbeing</option><option>Performance challenge</option></select></label>
      </div>
      <aside className="pr-config-summary"><p className="pr-meta">Your starting brief</p><h3>{duration} for {team}</h3><p>Primary objective: {objective}. We’ll scale the training, recovery and facilitation around your group.</p><Link href={`/contact?enquiry=corporate&team=${encodeURIComponent(team)}&duration=${encodeURIComponent(duration)}&objective=${encodeURIComponent(objective)}`}>Send this brief →</Link><small>Downloadable proposal summaries will be added when corporate booking goes live.</small></aside>
      <div className="pr-itinerary-grid">{ITINERARIES.map((item) => <article key={item.id}><p className="pr-meta">{item.time}</p><h3>{item.label}</h3><p>{item.flow}</p></article>)}</div>
    </div>
  );
}
