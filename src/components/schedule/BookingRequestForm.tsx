"use client";

import Link from "next/link";
import { useActionState, useEffect, useId, useRef, useState } from "react";
import { FieldError, fieldA11y, submitWithoutReset } from "@/components/forms/FormStatus";
import { FlowCover, FlowNav, useStartOrLogin, FlowOptions, FlowProgress, FlowQuestion, type FlowChoice, type FlowContact } from "@/components/forms/StepFlow";
import PrivacyNote from "@/components/ui/PrivacyNote";
import { BOOKING_ADDONS, BOOKING_SERVICES, PREFERRED_TIMES } from "@/content/constants";
import type { TimetableSlot } from "@/content/types";
import { SLOT_STATUS_LABEL, WEEKDAY_LABEL } from "@/data/programs-static";
import { trackLead } from "@/lib/analytics";
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
};

type Props = { content: BookingFormContent; initialService?: string | null; initialItem?: string | null; autoStart?: boolean };

const SERVICE_VALUES = BOOKING_SERVICES.map((s) => s.value) as readonly string[];
const isService = (v: string | null | undefined): v is Service => !!v && SERVICE_VALUES.includes(v);

const SERVICE_HINT: Record<Service, string> = {
  class: "A coached class, timetable session or open gym.",
  appointment: "Sauna, ice bath, therapy, massage or performance testing.",
  camp: "Day clinics, weekend camps and longer immersives.",
  corporate: "Team-building and private group sessions.",
};
const TIME_HINT: Record<string, string> = {
  "Early morning": "Sunrise sessions, before work.",
  Midday: "Late morning to mid-afternoon.",
  Evening: "After work, into the night sessions.",
  Flexible: "Any time that has space.",
};

function optionGroups(service: Service, content: BookingFormContent): OptionGroup[] {
  switch (service) {
    case "class": return [
      { label: "Classes", options: content.programmes.map((p) => ({ value: p.slug, label: p.title })) },
      { label: SESSIONS, options: content.slots.map((s) => ({ value: s.id, label: `${WEEKDAY_LABEL[s.day]} · ${s.time} · ${s.title}${s.status === "full" ? ` (${SLOT_STATUS_LABEL.full})` : ""}` })) },
    ].filter((g) => g.options.length > 0);
    case "appointment": return [{ label: "Recovery & 1:1", options: [...content.appointments, { value: "performance-testing", label: "Performance testing" }] }];
    case "camp": return content.camps.length ? [{ label: "Camps & packages", options: content.camps }] : [];
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
const SESSIONS = "Timetable sessions";

/**
 * Booking request (kind=booking) as a one-question-per-screen flow: cover → service → program/session → time →
 * date, group size & add-ons → contact. Field names are unchanged, so the lead store and admin inbox are unaffected.
 */
export default function BookingRequestForm(props: Props) {
  const [formKey, setFormKey] = useState(0);
  // "Start over" after sending returns to the cover screen, even when the form opened on the first question.
  return <BookingFlow key={formKey} {...props} autoStart={formKey === 0 && props.autoStart} onReset={() => setFormKey((k) => k + 1)} />;
}

function BookingFlow({ content, initialService, initialItem, autoStart, onReset }: Props & { onReset: () => void }) {
  const [state, formAction, pending] = useActionState(submitLead, INITIAL_LEAD_RESULT);
  const [initial] = useState(() => resolveInitial(content, initialService, initialItem));
  const [step, setStep] = useState<Step>(autoStart ? "service" : "intro");
  const [service, setService] = useState<Service | "">(initial.service);
  const [item, setItem] = useState(initial.item);
  const [groupNote, setGroupNote] = useState("");
  const [time, setTime] = useState("");
  const id = useId();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);
  const index = STEPS.indexOf(step);

  useEffect(() => {
    // On load, only an auto-started form (opened on its first question) takes focus and scrolls to the question.
    if (firstRender.current) { firstRender.current = false; if (!autoStart) return; }
    headingRef.current?.focus({ preventScroll: true });
    headingRef.current?.closest(".jf")?.scrollIntoView({ block: "start", behavior: "smooth" });
  }, [step, autoStart]);

  useEffect(() => {
    if (state.status === "success") trackLead("booking");
  }, [state]);

  const next = () => setStep(STEPS[Math.min(index + 1, STEPS.length - 1)]);
  const back = () => setStep(STEPS[Math.max(index - 1, 0)]);
  const startOrLogin = useStartOrLogin(next);

  const groups = service ? optionGroups(service, content) : [];
  const slot = service === "class" ? content.slots.find((s) => s.id === item) : undefined;
  const waitlist = slot?.status === "full";
  const itemValue = service === "corporate" ? groupNote : item === ADVISE ? "" : item;

  if (state.status === "success") {
    return (
      <div className="jf jf-done" role="status">
        <span className="jf-done-mark" aria-hidden="true">✓</span>
        <h2>Request received.</h2>
        <p>{state.message}</p>
        <div className="jf-done-actions">
          <Link href="/schedule/timetable" className="jf-start">View the timetable</Link>
          <button type="button" className="jf-back" onClick={onReset}>Book something else</button>
        </div>
      </div>
    );
  }

  const itemTitle = service === "class" ? "Which class or session?" : service === "appointment" ? "Which appointment?" : service === "camp" ? "Which camp or package?" : "Tell us about your group";
  // Timetable sessions are a long list: they go in a dropdown (grouped by day) instead of option cards.
  const sessionGroup = service === "class" ? groups.find((g) => g.label === SESSIONS) : undefined;
  const itemGroups = groups.filter((g) => g !== sessionGroup).map((g) => ({ label: g.label, choices: g.options as FlowChoice[] }));
  const adviseGroup = [{ label: groups.length ? "Not sure?" : "Options", choices: [{ value: ADVISE, label: groups.length ? "Not sure yet — advise me" : "Details to be announced — advise me", hint: "We'll suggest the best fit when we reply." }] }];
  const sessionDays = [...new Set(content.slots.map((s) => s.day))];
  const isSession = Boolean(sessionGroup?.options.some((o) => o.value === item));

  return (
    <form className="jf" action={formAction} onSubmit={(e) => { if (step !== "contact") { e.preventDefault(); return; } submitWithoutReset(formAction)(e); }} noValidate aria-busy={pending || undefined}>
      <input type="hidden" name="kind" value="booking" />
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
          title="Tell us what you'd like to book"
          lead="Classes, recovery and 1:1 appointments, camps and group sessions. A few quick questions, then our team confirms availability with you."
          facts={[
            { title: "About a minute", body: "One question per screen, and Back works the whole way through. Nothing is sent until the last screen." },
            { title: "Confirmed by our team", body: content.note },
            { title: "Nothing to pay now", body: "This is a request, not a payment. We reply with times, availability and anything you need to bring." },
          ]}
          contact={content.contact}
          image={content.image}
          imageAlt="An athlete pushing a weighted sled while her coach watches at BaseCamp CamSur"
          caption="Sessions run from sunrise to night at BaseCamp CamSur, Pili."
          onStart={startOrLogin}
        />
      ) : (
        <div className="jf-stage">
          <FlowProgress index={index} total={QUESTION_COUNT} />

          {step === "service" && (
            <FlowQuestion headingRef={headingRef} title="What would you like to book?" hint="Pick one. You can add recovery extras later in the form."
              nav={<FlowNav onBack={back} canContinue={Boolean(service)} onContinue={next} />}>
              <FlowOptions label="Service" value={service} choices={BOOKING_SERVICES.map((s) => ({ value: s.value, label: s.label, hint: SERVICE_HINT[s.value] }))}
                onPick={(v) => { if (v !== service) { setService(v as Service); setItem(""); } }} />
            </FlowQuestion>
          )}

          {step === "item" && (service === "corporate" ? (
            <FlowQuestion headingRef={headingRef} title={itemTitle} hint="Group size, goals and the kind of session you have in mind."
              nav={<FlowNav onBack={back} canContinue onContinue={next} />}>
              <label className="jf-field" htmlFor={`${id}-item`}><span className="jf-label">Group size &amp; goals <small>Optional</small></span>
                <input id={`${id}-item`} value={groupNote} onChange={(e) => setGroupNote(e.target.value)} maxLength={120} placeholder="e.g. 20 people, team-building half day" {...fieldA11y(state, `${id}-item`, "item")} />
                <FieldError id={`${id}-item`} state={state} name="item" />
              </label>
            </FlowQuestion>
          ) : (
            <FlowQuestion headingRef={headingRef} title={itemTitle} hint={service === "class" ? "Choose a class, or a specific session from the timetable." : service === "appointment" ? content.disclaimer : ""}
              nav={<FlowNav onBack={back} canContinue={Boolean(item)} onContinue={next} />}>
              {itemGroups.length > 0 && <FlowOptions label={itemTitle} value={item} groups={itemGroups} onPick={setItem} />}
              {sessionGroup && (
                <div className="jf-group jf-select-group">
                  <label className="jf-group-label" htmlFor={`${id}-session`}>{SESSIONS}</label>
                  <div className={`jf-select${isSession ? " is-selected" : ""}`}>
                    <select id={`${id}-session`} value={isSession ? item : ""} onChange={(e) => setItem(e.target.value)}>
                      <option value="">Choose a session from the timetable…</option>
                      {sessionDays.map((day) => (
                        <optgroup label={WEEKDAY_LABEL[day]} key={day}>
                          {content.slots.filter((s) => s.day === day).map((s) => (
                            <option value={s.id} key={s.id}>{`${WEEKDAY_LABEL[s.day]} · ${s.time} · ${s.title}${s.status === "full" ? ` (${SLOT_STATUS_LABEL.full})` : ""}`}</option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>
                </div>
              )}
              <FlowOptions label="Not sure" value={item} groups={adviseGroup} onPick={setItem} />
              {waitlist && <p className="jf-hint" role="status">This session is full: we&apos;ll add you to the waitlist.</p>}
            </FlowQuestion>
          ))}

          {step === "time" && (
            <FlowQuestion headingRef={headingRef} title="What time suits you?" hint="Your usual window. We'll confirm the exact time."
              nav={<FlowNav onBack={back} canContinue={Boolean(time)} onContinue={next} />}>
              <FlowOptions label="Preferred time" value={time} choices={PREFERRED_TIMES.map((t) => ({ value: t, label: t, hint: TIME_HINT[t] }))} onPick={setTime} />
            </FlowQuestion>
          )}

          {/* Kept mounted (hidden) after this screen so the date, size and add-ons are still submitted. */}
          <div hidden={step !== "details"}>
            <FlowQuestion headingRef={step === "details" ? headingRef : null} title="A few details" hint="All optional. Skip ahead if you're not sure yet."
              nav={<FlowNav onBack={back} canContinue onContinue={next} />}>
              <div className="jf-fields">
                <label className="jf-field" htmlFor={`${id}-date`}><span className="jf-label">Preferred date</span>
                  <input id={`${id}-date`} name="preferredDate" type="date" />
                </label>
                <label className="jf-field" htmlFor={`${id}-party`}><span className="jf-label">Group size</span>
                  <input id={`${id}-party`} name="partySize" type="number" inputMode="numeric" min={1} max={60} step={1} defaultValue={1} {...fieldA11y(state, `${id}-party`, "partySize")} />
                  <FieldError id={`${id}-party`} state={state} name="partySize" />
                </label>
              </div>
              <fieldset className="jf-ticks">
                <legend>Add-ons</legend>
                {BOOKING_ADDONS.map((a) => (
                  <label className="jf-tick" key={a}>
                    <input type="checkbox" name="addOns" value={a} />
                    <span>{a}</span>
                  </label>
                ))}
              </fieldset>
            </FlowQuestion>
          </div>

          <div hidden={step !== "contact"}>
            <FlowQuestion headingRef={step === "contact" ? headingRef : null} title="How can we reach you?" hint="Last screen. We confirm by email or phone."
              nav={<FlowNav onBack={back} submitLabel={content.submitLabel} pending={pending} />}>
              {state.status === "error" && state.message && <p className="jf-error" role="alert">{state.message}</p>}
              <div className="jf-fields">
                <label className="jf-field" htmlFor={`${id}-first`}><span className="jf-label">First name*</span>
                  <input id={`${id}-first`} name="firstName" autoComplete="given-name" required maxLength={80} {...fieldA11y(state, `${id}-first`, "firstName")} />
                  <FieldError id={`${id}-first`} state={state} name="firstName" />
                </label>
                <label className="jf-field" htmlFor={`${id}-last`}><span className="jf-label">Surname</span>
                  <input id={`${id}-last`} name="lastName" autoComplete="family-name" maxLength={80} {...fieldA11y(state, `${id}-last`, "lastName")} />
                  <FieldError id={`${id}-last`} state={state} name="lastName" />
                </label>
                <label className="jf-field" htmlFor={`${id}-email`}><span className="jf-label">Email*</span>
                  <input id={`${id}-email`} name="email" type="email" autoComplete="email" required maxLength={254} {...fieldA11y(state, `${id}-email`, "email")} />
                  <FieldError id={`${id}-email`} state={state} name="email" />
                </label>
                <label className="jf-field" htmlFor={`${id}-phone`}><span className="jf-label">Phone</span>
                  <input id={`${id}-phone`} name="phone" type="tel" autoComplete="tel" maxLength={30} {...fieldA11y(state, `${id}-phone`, "phone")} />
                  <FieldError id={`${id}-phone`} state={state} name="phone" />
                </label>
                <label className="jf-field jf-field--wide" htmlFor={`${id}-message`}><span className="jf-label">Anything we should know? <small>Optional</small></span>
                  <textarea id={`${id}-message`} name="message" rows={3} maxLength={2000} placeholder="Injuries, experience, questions…" {...fieldA11y(state, `${id}-message`, "message")} />
                  <FieldError id={`${id}-message`} state={state} name="message" />
                </label>
              </div>
              <label className="jf-check" htmlFor={`${id}-consent`}>
                <input id={`${id}-consent`} name="consent" type="checkbox" required {...fieldA11y(state, `${id}-consent`, "consent")} />
                <span>I agree to be contacted by BaseCamp CamSur about this request.</span>
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
