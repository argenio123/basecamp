"use client";

import Link from "next/link";
import { useState } from "react";
import type { TimetableSlot } from "@/content/types";
import { SLOT_CATEGORY_LABEL, SLOT_STATUS_LABEL, TIMETABLE_CAPTION, WEEKDAY_LABEL, WEEKDAYS } from "@/data/programs-static";

type Weekday = (typeof WEEKDAYS)[number];
type Category = TimetableSlot["category"];

/** Chip text without the ☀/☾ glyphs used elsewhere. */
const chipLabel = (category: Category) => SLOT_CATEGORY_LABEL[category].replace(/^[^A-Za-z]+/, "");

/** "Early morning (time TBA)" → { time: "TBA", part: "Early morning" }; "7:00 AM" → { time: "7:00", part: "AM" }. */
function splitTime(time: string) {
  const tba = time.match(/^(.*?)\s*\(time TBA\)$/i);
  if (tba) return { time: "TBA", part: tba[1] };
  const clock = time.match(/^(\d{1,2}:\d{2})\s*(AM|PM)?$/i);
  return clock ? { time: clock[1], part: clock[2]?.toUpperCase() ?? "" } : { time, part: "" };
}

function Slot({ slot }: { slot: TimetableSlot }) {
  const { time, part } = splitTime(slot.time);
  return (
    <li className="sd-app-slot" data-category={slot.category}>
      <Link href={`/schedule/book?service=class&item=${encodeURIComponent(slot.id)}#book`} aria-label={`${WEEKDAY_LABEL[slot.day]}, ${slot.time}: ${slot.title}. ${SLOT_STATUS_LABEL[slot.status]}. Request this session`}>
        <span className="sd-app-time"><strong>{time}</strong>{part && <small>{part}</small>}</span>
        <span className="sd-app-body">
          <span className="sd-app-title">{slot.title}</span>
          <span className="sd-app-chip">{chipLabel(slot.category)}</span>
        </span>
        <span className="sd-app-spots"><strong>{slot.capacity ?? "TBA"}</strong><small>Spots</small></span>
      </Link>
    </li>
  );
}

/**
 * Weekly timetable styled like the BaseCamp app "Find your rhythm" screen (brand book 2026, Screens · Book):
 * day strip, discipline chips and session cards. Every day is in the server HTML; only the selected one is shown.
 */
export default function Timetable({ slots }: { slots: TimetableSlot[] }) {
  const [day, setDay] = useState<Weekday>("Mon");
  const [filter, setFilter] = useState<Category | "all">("all");
  const categories = [...new Set(slots.map((s) => s.category))];

  return (
    <div className="sd-timetable sd-app">
      <div className="sd-app-days" role="tablist" aria-label="Day of the week">
        {WEEKDAYS.map((d) => (
          <button key={d} type="button" role="tab" id={`sd-tab-${d}`} aria-controls={`sd-day-${d}`} aria-selected={day === d} onClick={() => setDay(d)}>
            <small>{d}</small>
            <strong>{slots.filter((s) => s.day === d).length}</strong>
          </button>
        ))}
      </div>

      {categories.length > 1 && (
        <div className="sd-app-filters" role="toolbar" aria-label="Filter by discipline">
          {(["all", ...categories] as const).map((c) => (
            <button key={c} type="button" aria-pressed={filter === c} onClick={() => setFilter(c)}>{c === "all" ? "All" : chipLabel(c)}</button>
          ))}
        </div>
      )}

      {WEEKDAYS.map((d) => {
        const daySlots = slots.filter((s) => s.day === d && (filter === "all" || s.category === filter));
        return (
          <div key={d} className="sd-app-list" role="tabpanel" id={`sd-day-${d}`} aria-labelledby={`sd-tab-${d}`} hidden={day !== d}>
            <p className="sd-app-dayname">{WEEKDAY_LABEL[d]}</p>
            {daySlots.length ? <ul>{daySlots.map((slot) => <Slot slot={slot} key={slot.id} />)}</ul> : <p className="sd-slot-empty">Sessions to be announced</p>}
          </div>
        );
      })}
      <p className="sd-caption">{TIMETABLE_CAPTION}</p>
    </div>
  );
}
