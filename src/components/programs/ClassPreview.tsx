"use client";

import Link from "next/link";
import StatusBadge from "@/components/ui/StatusBadge";
import { programmeHref } from "@/content/sitemap";
import type { LaunchPhase } from "@/content/types";
import { CLASS_PREVIEW, CLASS_RHYTHM_PREVIEW } from "@/data/programs-static";

const ACTION: Record<LaunchPhase, { label: string; href: string; note: string }> = {
  "pre-launch": {
    label: "Join the schedule waitlist",
    href: "/contact?interest=schedule",
    note: "This is a launch preview. Exact days, times and coaches will be confirmed before booking opens.",
  },
  "soft-opening": {
    label: "View the soft-opening schedule",
    href: "/schedule#timetable",
    note: "Invitation-only sessions are being released during soft opening.",
  },
  live: {
    label: "View the live schedule",
    href: "/schedule#timetable",
    note: "Check the current timetable for coaches, availability and booking options.",
  },
};

export default function ClassFinder({ launchPhase }: { launchPhase: LaunchPhase }) {
  const action = ACTION[launchPhase];

  return (
    <section className="section pr-class-catalogue" id="finder" aria-labelledby="pr-classes-title">
      <div className="shell">
        <div className="section-heading split-heading" data-reveal>
          <div>
            <p className="eyebrow eyebrow-light">Class finder</p>
            <h2 id="pr-classes-title">Choose how you want to train.</h2>
          </div>
          <div className="pr-class-intro">
            <p>Browse the launch class preview and open the training path that fits your goal.</p>
            <p className="pr-class-note">{action.note}</p>
          </div>
        </div>

        <p className="pr-class-count">{CLASS_PREVIEW.length} classes</p>
        <ul className="pr-class-grid">
          {CLASS_PREVIEW.map((item) => (
            <li key={item.id} className="pr-class-card">
              <div className="pr-class-card-head">
                <p className="pr-meta">{item.programme}</p>
                <StatusBadge availability={item.availability} />
              </div>
              <h3>{item.title}</h3>
              <p className="pr-class-goal">{item.goal}</p>
              <details>
                <summary>Class details</summary>
                <div className="pr-class-details">
                  <p><strong>Equipment</strong>{item.equipment}</p>
                  <p><strong>Access</strong>{item.access}</p>
                  <p><strong>Coach</strong>{item.coach}</p>
                </div>
              </details>
              <div className="pr-class-card-actions">
                <Link href={programmeHref(item.programmeSlug)}>View class <span aria-hidden="true">→</span></Link>
                <Link href={launchPhase === "live" ? `/schedule/book?service=class&item=${item.programmeSlug}` : `/contact?program=${item.programmeSlug}`}>
                  {launchPhase === "live" ? "Book class" : "Join waitlist"} <span aria-hidden="true">↗</span>
                </Link>
              </div>
            </li>
          ))}
        </ul>

        <div className="pr-class-rhythm" id="schedule-preview">
          <div className="pr-class-rhythm-head">
            <div><p className="eyebrow eyebrow-light">Launch schedule preview</p><h3>A class rhythm from morning to night.</h3></div>
            <p>Session types only. Exact days, start times, coaches and capacity will appear when bookings genuinely open.</p>
          </div>
          <ol>
            {CLASS_RHYTHM_PREVIEW.map((item, index) => (
              <li key={item.id}><span>{String(index + 1).padStart(2, "0")}</span><p>{item.window}</p><strong>{item.title}</strong><small>{item.note}</small></li>
            ))}
          </ol>
        </div>

        <div className="pr-class-footer-action"><Link className="button button-dark" href={action.href}>{action.label} <span aria-hidden="true">↗</span></Link></div>
      </div>
    </section>
  );
}
