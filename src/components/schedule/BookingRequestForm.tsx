"use client";

import Link from "next/link";
import { useActionState, useEffect, useId, useRef, useState } from "react";
import { FieldError, fieldA11y, submitWithoutReset } from "@/components/forms/FormStatus";
import { FlowCover, FlowNav, FlowOptions, FlowProgress, FlowQuestion, type FlowChoice, type FlowContact } from "@/components/forms/StepFlow";
import PrivacyNote from "@/components/ui/PrivacyNote";
import { BOOKING_ADDONS, BOOKING_SERVICES, PREFERRED_TIMES } from "@/content/constants";
import type { TimetableSlot, Weekday } from "@/content/types";
import { SLOT_STATUS_LABEL, WEEKDAY_LABEL } from "@/data/programs-static";
import { useLocale } from "@/i18n/client";
import { localizedHref } from "@/i18n/paths";
import { SCHEDULE_UI, type ScheduleUi } from "@/i18n/ui-sections/schedule";
import { trackLead } from "@/lib/analytics";
import { bookHref } from "@/lib/bookings/types";
import { submitLead } from "@/lib/leads/actions";
import { INITIAL_LEAD_RESULT } from "@/lib/leads/types";

type Service = (typeof BOOKING_SERVICES)[number]["value"];
type Option = { value: string; label: string };
type OptionGroup = { label: string; options: Option[] };

/** Serialisable data for the booking form, prepared by the /schedule/book page from getSiteContent(). */
export type BookingFormContent = {
  slots: TimetableSlot[];
  programmes: { slug: string; title: string }[];
  appointments: Option[];
  camps: Option[];
  submitLabel: string;
  contact: FlowContact;
  image: string;
  note: string;
  /** Recovery/medical caveat, shown on the appointment question. */
  disclaimer: string;
  /** Timetable sessions members can book instantly (confirm screen at /pay/book), and the price label when paid online. */
  instant?: { slotIds: string[]; price: string | null };
  /** Weekday names and the "full" status in the page's language (getData("programs-static")); English when omitted. */
  labels?: { weekday: Record<Weekday, string>; full: string };
};

type Props = { content: BookingFormContent; initialService?: string | null; initialItem?: string | null; initialDate?: string | null; initialWaitlist?: boolean };

const SERVICE_VALUES = BOOKING_SERVICES.map((s) => s.value) as readonly string[];
const isService = (v: string | null | undefined): v is Service => !!v && SERVICE_VALUES.includes(v);

// Interface text per locale: src/i18n/ui-sections/schedule.ts (service hints, time hints, step titles…). Submitted values
// (service, preferredTime, addOns) stay the English keys, so the lead store and admin inbox are unchanged.
type Ui = ScheduleUi["booking"];
const EN_UI = SCHEDULE_UI.en.booking;
const EN_LABELS = { weekday: WEEKDAY_LABEL, full: SLOT_STATUS_LABEL.full };

/** "Mon · 6:00 AM · Sunrise Strength (Full · Join waitlist)" in the page's language. */
function sessionLabel(s: TimetableSlot, content: BookingFormContent) {
  const labels = content.labels ?? EN_LABELS;
  return `${labels.weekday[s.day]} · ${s.time} · ${s.title}${s.status === "full" ? ` (${labels.full})` : ""}`;
}

/** Option groups. Group labels come from `ui`; the session group is recognised by its `sessions` flag, not its label. */
function optionGroups(service: Service, content: BookingFormContent, ui: Ui = EN_UI): (OptionGroup & { sessions?: boolean })[] {
  switch (service) {
    case "class": return [
      { label: ui.groupClasses, options: content.programmes.map((p) => ({ value: p.slug, label: p.title })) },
      { label: ui.groupSessions, sessions: true, options: content.slots.map((s) => ({ value: s.id, label: sessionLabel(s, content) })) },
    ].filter((g) => g.options.length > 0);
    case "appointment": return [{ label: ui.groupAppointments, options: [...content.appointments, { value: "performance-testing", label: ui.performanceTesting }] }];
    case "camp": return content.camps.length ? [{ label: ui.groupCamps, options: content.camps }] : [];
    default: return [];
  }
}
const flat = (groups: OptionGroup[]) => groups.flatMap((g) => g.options);

/** ?service=&item= preselection: matches a slug or slot id; an unknown item is ignored. */
function resolveInitial(content: BookingFormContent, serviceParam?: string | null, itemParam?: string | null): { service: Service | ""; item: string } {
  const owner = itemParam ? (SERVICE_VALUES as Service[]).find((s) => flat(optionGroups(s, content)).some((o) => o.value === itemParam)) : undefined;
  const service = isService(serviceParam) ? serviceParam : owner ?? "";
  if (!service || service === "corporate") return { service, item: "" };
  return { service, item: itemParam && flat(optionGroups(service, content)).some((o) => o.value === itemParam) ? itemParam : "" };
}

const STEPS = ["intro", "service", "item", "time", "details", "contact"] as const;
type Step = (typeof STEPS)[number];
const QUESTION_COUNT = STEPS.length - 1;
const ADVISE = "__advise";

/**
 * Booking request (kind=booking) as a one-question-per-screen flow: cover → service → program/session → time →
 * date, group size & add-ons → contact. Field names are unchanged, so the lead store and admin inbox are unaffected.
 */
export default function BookingRequestForm(props: Props) {
  const [formKey, setFormKey] = useState(0);
  // "Start over" after sending remounts the flow on the cover screen.
  return <BookingFlow key={formKey} {...props} onReset={() => setFormKey((k) => k + 1)} />;
}

function BookingFlow({ content, initialService, initialItem, initialDate, initialWaitlist, onReset }: Props & { onReset: () => void }) {
  const locale = useLocale();
  const ui = SCHEDULE_UI[locale].booking;
  const [state, formAction, pending] = useActionState(submitLead, INITIAL_LEAD_RESULT);
  const [initial] = useState(() => resolveInitial(content, initialService, initialItem));
  const [step, setStep] = useState<Step>("intro");
  const [service, setService] = useState<Service | "">(initial.service);
  const [item, setItem] = useState(initial.item);
  const [groupNote, setGroupNote] = useState("");
  const [time, setTime] = useState("");
  const id = useId();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);
  const index = STEPS.indexOf(step);

  useEffect(() => {
    // Leave focus alone on load; move it to the new question when the step changes.
    if (firstRender.current) { firstRender.current = false; return; }
    headingRef.current?.focus({ preventScroll: true });
    headingRef.current?.closest(".jf")?.scrollIntoView({ block: "start", behavior: "smooth" });
  }, [step]);

  useEffect(() => {
    if (state.status === "success") trackLead("booking");
  }, [state]);

  const next = () => setStep(STEPS[Math.min(index + 1, STEPS.length - 1)]);
  const back = () => setStep(STEPS[Math.max(index - 1, 0)]);

  const groups = service ? optionGroups(service, content, ui) : [];
  const slot = service === "class" ? content.slots.find((s) => s.id === item) : undefined;
  // Full by status, or sent here from a session whose online spots ran out (?waitlist=1).
  const waitlist = slot?.status === "full" || (!!initialWaitlist && !!slot && item === initial.item);
  const instantHref = slot && content.instant?.slotIds.includes(slot.id) && !waitlist ? bookHref(slot.id, initialDate && item === initial.item ? initialDate : undefined) : "";
  const itemValue = service === "corporate" ? groupNote : item === ADVISE ? "" : item;

  if (state.status === "success") {
    return (
      <div className="jf jf-done" role="status">
        <span className="jf-done-mark" aria-hidden="true">✓</span>
        <h2>{ui.doneTitle}</h2>
        <p>{state.message}</p>
        <div className="jf-done-actions">
          <Link href={localizedHref("/schedule/timetable", locale)} className="jf-start">{ui.doneTimetable}</Link>
          <button type="button" className="jf-back" onClick={onReset}>{ui.doneAgain}</button>
        </div>
      </div>
    );
  }

  const itemTitle = service === "class" ? ui.itemClass : service === "appointment" ? ui.itemAppointment : service === "camp" ? ui.itemCamp : ui.itemGroup;
  // Timetable sessions are a long list: they go in a dropdown (grouped by day) instead of option cards.
  const sessionGroup = service === "class" ? groups.find((g) => g.sessions) : undefined;
  const itemGroups = groups.filter((g) => g !== sessionGroup).map((g) => ({ label: g.label, choices: g.options as FlowChoice[] }));
  const adviseGroup = [{ label: groups.length ? ui.notSure : ui.options, choices: [{ value: ADVISE, label: groups.length ? ui.advise : ui.adviseTba, hint: ui.adviseHint }] }];
  const weekday = (content.labels ?? EN_LABELS).weekday;
  const sessionDays = [...new Set(content.slots.map((s) => s.day))];
  const isSession = Boolean(sessionGroup?.options.some((o) => o.value === item));

  return (
    <form className="jf" action={formAction} onSubmit={(e) => { if (step !== "contact") { e.preventDefault(); return; } submitWithoutReset(formAction)(e); }} noValidate aria-busy={pending || undefined}>
      <input type="hidden" name="kind" value="booking" />
      {/* The page's language, for server-side messages (src/i18n/MERGE-PLAN.md §2). */}
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="source" value="/schedule/book" />
      <input type="hidden" name="service" value={service || "class"} />
      <input type="hidden" name="item" value={itemValue} />
      <input type="hidden" name="preferredTime" value={time || "Flexible"} />
      {waitlist && <input type="hidden" name="waitlist" value="1" />}
      <div className="ui-hp" aria-hidden="true">
        <label htmlFor={`${id}-website`}>Website</label>
        <input id={`${id}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {step === "intro" ? (
        <FlowCover
          headingRef={headingRef}
          title={ui.coverTitle}
          lead={ui.coverLead}
          facts={[
            { title: ui.factMinuteTitle, body: ui.factMinuteBody },
            { title: ui.factTeamTitle, body: content.note },
            { title: ui.factPayTitle, body: ui.factPayBody },
          ]}
          contact={content.contact}
          image={content.image}
          imageAlt={ui.coverImageAlt}
          caption={ui.coverCaption}
          onStart={next}
        />
      ) : (
        <div className="jf-stage">
          <FlowProgress index={index} total={QUESTION_COUNT} />

          {step === "service" && (
            <FlowQuestion headingRef={headingRef} title={ui.serviceTitle} hint={ui.serviceHintText}
              nav={<FlowNav onBack={back} canContinue={Boolean(service)} onContinue={next} />}>
              <FlowOptions label={ui.serviceLabel} value={service} choices={BOOKING_SERVICES.map((s) => ({ value: s.value, label: ui.services[s.value] ?? s.label, hint: ui.serviceHint[s.value] }))}
                onPick={(v) => { if (v !== service) { setService(v as Service); setItem(""); } }} />
            </FlowQuestion>
          )}

          {step === "item" && (service === "corporate" ? (
            <FlowQuestion headingRef={headingRef} title={itemTitle} hint={ui.groupHint}
              nav={<FlowNav onBack={back} canContinue onContinue={next} />}>
              <label className="jf-field" htmlFor={`${id}-item`}><span className="jf-label">{ui.groupLabel} <small>{ui.optional}</small></span>
                <input id={`${id}-item`} value={groupNote} onChange={(e) => setGroupNote(e.target.value)} maxLength={120} placeholder={ui.groupPlaceholder} {...fieldA11y(state, `${id}-item`, "item")} />
                <FieldError id={`${id}-item`} state={state} name="item" />
              </label>
            </FlowQuestion>
          ) : (
            <FlowQuestion headingRef={headingRef} title={itemTitle} hint={service === "class" ? ui.classHint : service === "appointment" ? content.disclaimer : ""}
              nav={<FlowNav onBack={back} canContinue={Boolean(item)} onContinue={next} />}>
              {itemGroups.length > 0 && <FlowOptions label={itemTitle} value={item} groups={itemGroups} onPick={setItem} />}
              {sessionGroup && (
                <div className="jf-group jf-select-group">
                  <label className="jf-group-label" htmlFor={`${id}-session`}>{sessionGroup.label}</label>
                  <div className={`jf-select${isSession ? " is-selected" : ""}`}>
                    <select id={`${id}-session`} value={isSession ? item : ""} onChange={(e) => setItem(e.target.value)}>
                      <option value="">{ui.chooseSession}</option>
                      {sessionDays.map((day) => (
                        <optgroup label={weekday[day]} key={day}>
                          {content.slots.filter((s) => s.day === day).map((s) => (
                            <option value={s.id} key={s.id}>{sessionLabel(s, content)}</option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>
                </div>
              )}
              <FlowOptions label={ui.notSureLabel} value={item} groups={adviseGroup} onPick={setItem} />
              {waitlist && <p className="jf-hint" role="status">{ui.waitlistNote}</p>}
              {/* Instant booking (/pay/book) is checkout and stays English by design. */}
              {instantHref && <p className="jf-hint" role="status">{ui.instantLead} <Link href={instantHref}>{ui.instantLink}{content.instant?.price ? ` · ${content.instant.price}` : ""}</Link> {ui.instantTail}</p>}
            </FlowQuestion>
          ))}

          {step === "time" && (
            <FlowQuestion headingRef={headingRef} title={ui.timeTitle} hint={ui.timeHintText}
              nav={<FlowNav onBack={back} canContinue={Boolean(time)} onContinue={next} />}>
              <FlowOptions label={ui.timeLabel} value={time} choices={PREFERRED_TIMES.map((t) => ({ value: t, label: ui.times[t] ?? t, hint: ui.timeHint[t] }))} onPick={setTime} />
            </FlowQuestion>
          )}

          {/* Kept mounted (hidden) after this screen so the date, size and add-ons are still submitted. */}
          <div hidden={step !== "details"}>
            <FlowQuestion headingRef={step === "details" ? headingRef : null} title={ui.detailsTitle} hint={ui.detailsHint}
              nav={<FlowNav onBack={back} canContinue onContinue={next} />}>
              <div className="jf-fields">
                <label className="jf-field" htmlFor={`${id}-date`}><span className="jf-label">{ui.date}</span>
                  <input id={`${id}-date`} name="preferredDate" type="date" defaultValue={initialDate && /^\d{4}-\d{2}-\d{2}$/.test(initialDate) ? initialDate : undefined} />
                </label>
                <label className="jf-field" htmlFor={`${id}-party`}><span className="jf-label">{ui.partySize}</span>
                  <input id={`${id}-party`} name="partySize" type="number" inputMode="numeric" min={1} max={60} step={1} defaultValue={1} {...fieldA11y(state, `${id}-party`, "partySize")} />
                  <FieldError id={`${id}-party`} state={state} name="partySize" />
                </label>
              </div>
              <fieldset className="jf-ticks">
                <legend>{ui.addonsLegend}</legend>
                {BOOKING_ADDONS.map((a) => (
                  <label className="jf-tick" key={a}>
                    <input type="checkbox" name="addOns" value={a} />
                    <span>{ui.addons[a] ?? a}</span>
                  </label>
                ))}
              </fieldset>
            </FlowQuestion>
          </div>

          <div hidden={step !== "contact"}>
            <FlowQuestion headingRef={step === "contact" ? headingRef : null} title={ui.contactTitle} hint={ui.contactHint}
              nav={<FlowNav onBack={back} submitLabel={content.submitLabel} pending={pending} />}>
              {state.status === "error" && state.message && <p className="jf-error" role="alert">{state.message}</p>}
              <div className="jf-fields">
                <label className="jf-field" htmlFor={`${id}-first`}><span className="jf-label">{ui.firstName}</span>
                  <input id={`${id}-first`} name="firstName" autoComplete="given-name" required maxLength={80} {...fieldA11y(state, `${id}-first`, "firstName")} />
                  <FieldError id={`${id}-first`} state={state} name="firstName" />
                </label>
                <label className="jf-field" htmlFor={`${id}-last`}><span className="jf-label">{ui.lastName}</span>
                  <input id={`${id}-last`} name="lastName" autoComplete="family-name" maxLength={80} {...fieldA11y(state, `${id}-last`, "lastName")} />
                  <FieldError id={`${id}-last`} state={state} name="lastName" />
                </label>
                <label className="jf-field" htmlFor={`${id}-email`}><span className="jf-label">{ui.email}</span>
                  <input id={`${id}-email`} name="email" type="email" autoComplete="email" required maxLength={254} {...fieldA11y(state, `${id}-email`, "email")} />
                  <FieldError id={`${id}-email`} state={state} name="email" />
                </label>
                <label className="jf-field" htmlFor={`${id}-phone`}><span className="jf-label">{ui.phone}</span>
                  <input id={`${id}-phone`} name="phone" type="tel" autoComplete="tel" maxLength={30} {...fieldA11y(state, `${id}-phone`, "phone")} />
                  <FieldError id={`${id}-phone`} state={state} name="phone" />
                </label>
                <label className="jf-field jf-field--wide" htmlFor={`${id}-message`}><span className="jf-label">{ui.message} <small>{ui.optional}</small></span>
                  <textarea id={`${id}-message`} name="message" rows={3} maxLength={2000} placeholder={ui.messagePlaceholder} {...fieldA11y(state, `${id}-message`, "message")} />
                  <FieldError id={`${id}-message`} state={state} name="message" />
                </label>
              </div>
              <label className="jf-check" htmlFor={`${id}-consent`}>
                <input id={`${id}-consent`} name="consent" type="checkbox" required {...fieldA11y(state, `${id}-consent`, "consent")} />
                <span>{ui.consent}</span>
              </label>
              <FieldError id={`${id}-consent`} state={state} name="consent" />
              <PrivacyNote />
            </FlowQuestion>
          </div>
        </div>
      )}
    </form>
  );
}
