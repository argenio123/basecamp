import Link from "next/link";
import type { TimetableSlot } from "@/content/types";
import { SLOT_CATEGORY_LABEL, SLOT_STATUS_LABEL, TIMETABLE_CAPTION, WEEKDAY_LABEL, WEEKDAYS } from "@/data/programs-static";

function Slot({ slot }: { slot: TimetableSlot }) {
  return (
    <li className="sd-slot" data-category={slot.category}>
      <Link href={`/schedule/book?service=class&item=${encodeURIComponent(slot.id)}#book`} aria-label={`${WEEKDAY_LABEL[slot.day]}, ${slot.time}: ${slot.title}. ${SLOT_STATUS_LABEL[slot.status]}. Request this session`}>
        <span className="sd-slot-time">{slot.time}</span>
        <span className="sd-slot-title">{slot.title}</span>
        <span className="sd-slot-meta">
          <span className="sd-chip" data-category={slot.category}>{SLOT_CATEGORY_LABEL[slot.category]}</span>
          <span className="sd-chip" data-status={slot.status}>{SLOT_STATUS_LABEL[slot.status]}</span>
        </span>
        <span className="sd-slot-capacity">{slot.capacity ? `Capacity ${slot.capacity}` : "Capacity TBA"}</span>
      </Link>
    </li>
  );
}

/** Weekly timetable (server-rendered): 7-column grid on desktop, a details accordion (Monday open) at ≤760px. */
export default function Timetable({ slots }: { slots: TimetableSlot[] }) {
  const days = WEEKDAYS.map((day) => ({ day, slots: slots.filter((s) => s.day === day) }));
  const empty = <p className="sd-slot-empty">Sessions to be announced</p>;

  return (
    <div className="sd-timetable">
      <div className="sd-week" role="list" aria-label="Weekly timetable" data-reveal="stagger">
        {days.map(({ day, slots: daySlots }) => (
          <div className="sd-day" role="listitem" key={day}>
            <h3>{WEEKDAY_LABEL[day]}</h3>
            {daySlots.length ? <ul>{daySlots.map((slot) => <Slot slot={slot} key={slot.id} />)}</ul> : empty}
          </div>
        ))}
      </div>
      <div className="sd-week-accordion" data-reveal="stagger">
        {days.map(({ day, slots: daySlots }) => (
          <details className="sd-day" open={day === "Mon"} key={day}>
            <summary>{WEEKDAY_LABEL[day]} <span>{daySlots.length} {daySlots.length === 1 ? "session" : "sessions"}</span></summary>
            {daySlots.length ? <ul>{daySlots.map((slot) => <Slot slot={slot} key={slot.id} />)}</ul> : empty}
          </details>
        ))}
      </div>
      <p className="sd-caption" data-reveal>{TIMETABLE_CAPTION}</p>
    </div>
  );
}
