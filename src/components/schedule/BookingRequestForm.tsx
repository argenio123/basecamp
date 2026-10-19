"use client";

import { useActionState, useEffect, useId, useState } from "react";
import FormStatus, { FieldError, fieldA11y, submitWithoutReset } from "@/components/forms/FormStatus";
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
};

type Props = { content: BookingFormContent; initialService?: string | null; initialItem?: string | null };

const SERVICE_VALUES = BOOKING_SERVICES.map((s) => s.value) as readonly string[];
const isService = (v: string | null | undefined): v is Service => !!v && SERVICE_VALUES.includes(v);

function optionGroups(service: Service, content: BookingFormContent): OptionGroup[] {
  switch (service) {
    case "class": return [
      { label: "Programs", options: content.programmes.map((p) => ({ value: p.slug, label: p.title })) },
      { label: "Timetable sessions", options: content.slots.map((s) => ({ value: s.id, label: `${WEEKDAY_LABEL[s.day]} · ${s.time} · ${s.title}${s.status === "full" ? ` (${SLOT_STATUS_LABEL.full})` : ""}` })) },
    ].filter((g) => g.options.length > 0);
    case "appointment": return [{ label: "Recovery & 1:1", options: [...content.appointments, { value: "performance-testing", label: "Performance testing" }] }];
    case "camp": return content.camps.length ? [{ label: "Camps & packages", options: content.camps }] : [];
    default: return [];
  }
}
const flat = (groups: OptionGroup[]) => groups.flatMap((g) => g.options);
const firstOption = (service: Service, content: BookingFormContent) => flat(optionGroups(service, content))[0]?.value ?? "";

/** ?service=&item= preselection: matches a slug or slot id; an unknown item falls back to the first option. */
function resolveInitial(content: BookingFormContent, serviceParam?: string | null, itemParam?: string | null): { service: Service; item: string } {
  const owner = itemParam ? (SERVICE_VALUES as Service[]).find((s) => flat(optionGroups(s, content)).some((o) => o.value === itemParam)) : undefined;
  const service: Service = isService(serviceParam) ? serviceParam : owner ?? "class";
  if (service === "corporate") return { service, item: "" };
  const options = flat(optionGroups(service, content));
  return { service, item: itemParam && options.some((o) => o.value === itemParam) ? itemParam : options[0]?.value ?? "" };
}

/** Booking request (kind=booking). Docs: 02-guides/forms.md (useActionState). */
export default function BookingRequestForm(props: Props) {
  const [formKey, setFormKey] = useState(0);
  return <BookingRequestFormInner key={formKey} {...props} onReset={() => setFormKey((k) => k + 1)} />;
}

function BookingRequestFormInner({ content, initialService, initialItem, onReset }: Props & { onReset: () => void }) {
  const [state, formAction, pending] = useActionState(submitLead, INITIAL_LEAD_RESULT);
  const [initial] = useState(() => resolveInitial(content, initialService, initialItem));
  const [service, setService] = useState<Service>(initial.service);
  const [item, setItem] = useState(initial.item);
  const id = useId();

  useEffect(() => {
    if (state.status === "success") trackLead("booking");
  }, [state]);

  const groups = optionGroups(service, content);
  const slot = service === "class" ? content.slots.find((s) => s.id === item) : undefined;
  const waitlist = slot?.status === "full";

  if (state.status === "success") {
    return (
      <div className="form-success sd-form-success" role="status">
        <span aria-hidden="true">✓</span>
        <h2>Request received.</h2>
        <p>{state.message}</p>
        <button type="button" className="text-link" onClick={onReset}>Submit another request</button>
      </div>
    );
  }

  const chooseService = (value: Service) => {
    setService(value);
    setItem(firstOption(value, content));
  };

  return (
    <form className="interest-form sd-form" action={formAction} onSubmit={submitWithoutReset(formAction)} noValidate>
      <input type="hidden" name="kind" value="booking" />
      <input type="hidden" name="source" value="/schedule/book" />
      {waitlist && <input type="hidden" name="waitlist" value="1" />}
      <div className="ui-hp" aria-hidden="true">
        <label htmlFor={`${id}-website`}>Website</label>
        <input id={`${id}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <FormStatus state={state} />

      <fieldset className="sd-fieldset" {...fieldA11y(state, `${id}-service`, "service")}>
        <legend>What would you like to book?*</legend>
        <div className="sd-services">
          {BOOKING_SERVICES.map((s) => (
            <label className="sd-service" key={s.value}>
              <input type="radio" name="service" value={s.value} checked={service === s.value} onChange={() => chooseService(s.value)} />
              <span>{s.label}</span>
            </label>
          ))}
        </div>
        <FieldError id={`${id}-service`} state={state} name="service" />
      </fieldset>

      {service === "corporate" ? (
        <label htmlFor={`${id}-item`}>Group size &amp; goals
          <input id={`${id}-item`} name="item" maxLength={120} placeholder="e.g. 20 people, team-building half day" {...fieldA11y(state, `${id}-item`, "item")} />
          <FieldError id={`${id}-item`} state={state} name="item" />
        </label>
      ) : (
        <label htmlFor={`${id}-item`}>{service === "class" ? "Program or session" : service === "camp" ? "Camp or package" : "Service"}
          <select id={`${id}-item`} name="item" value={item} onChange={(e) => setItem(e.target.value)} {...fieldA11y(state, `${id}-item`, "item")}>
            {groups.length === 0 && <option value="">To be announced</option>}
            {groups.map((g) => (
              <optgroup label={g.label} key={g.label}>
                {g.options.map((o) => <option value={o.value} key={o.value}>{o.label}</option>)}
              </optgroup>
            ))}
          </select>
          <FieldError id={`${id}-item`} state={state} name="item" />
        </label>
      )}
      {waitlist && <p className="sd-waitlist" role="status">This session is full: we&apos;ll add you to the waitlist.</p>}

      <div className="field-row">
        <label htmlFor={`${id}-date`}>Preferred date
          <input id={`${id}-date`} name="preferredDate" type="date" />
        </label>
        <label htmlFor={`${id}-party`}>Party size
          <input id={`${id}-party`} name="partySize" type="number" inputMode="numeric" min={1} max={60} step={1} defaultValue={1} {...fieldA11y(state, `${id}-party`, "partySize")} />
          <FieldError id={`${id}-party`} state={state} name="partySize" />
        </label>
      </div>

      <fieldset className="sd-fieldset">
        <legend>Preferred time</legend>
        <div className="sd-options">
          {PREFERRED_TIMES.map((t) => (
            <label className="check-field sd-option" key={t}>
              <input type="radio" name="preferredTime" value={t} defaultChecked={t === "Flexible"} />
              <span>{t}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="sd-fieldset">
        <legend>Add-ons</legend>
        <div className="sd-options">
          {BOOKING_ADDONS.map((a) => (
            <label className="check-field sd-option" key={a}>
              <input type="checkbox" name="addOns" value={a} />
              <span>{a}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="field-row">
        <label htmlFor={`${id}-first`}>First name*
          <input id={`${id}-first`} name="firstName" autoComplete="given-name" required maxLength={80} {...fieldA11y(state, `${id}-first`, "firstName")} />
          <FieldError id={`${id}-first`} state={state} name="firstName" />
        </label>
        <label htmlFor={`${id}-last`}>Surname
          <input id={`${id}-last`} name="lastName" autoComplete="family-name" maxLength={80} {...fieldA11y(state, `${id}-last`, "lastName")} />
          <FieldError id={`${id}-last`} state={state} name="lastName" />
        </label>
      </div>
      <div className="field-row">
        <label htmlFor={`${id}-email`}>Email*
          <input id={`${id}-email`} name="email" type="email" autoComplete="email" required maxLength={254} {...fieldA11y(state, `${id}-email`, "email")} />
          <FieldError id={`${id}-email`} state={state} name="email" />
        </label>
        <label htmlFor={`${id}-phone`}>Phone
          <input id={`${id}-phone`} name="phone" type="tel" autoComplete="tel" maxLength={30} {...fieldA11y(state, `${id}-phone`, "phone")} />
          <FieldError id={`${id}-phone`} state={state} name="phone" />
        </label>
      </div>
      <label htmlFor={`${id}-message`}>Anything we should know?
        <textarea id={`${id}-message`} name="message" rows={3} maxLength={2000} {...fieldA11y(state, `${id}-message`, "message")} />
        <FieldError id={`${id}-message`} state={state} name="message" />
      </label>

      <label className="check-field sd-option" htmlFor={`${id}-consent`}>
        <input id={`${id}-consent`} name="consent" type="checkbox" required {...fieldA11y(state, `${id}-consent`, "consent")} />
        <span>I agree to be contacted by BaseCamp CamSur about this request.</span>
      </label>
      <FieldError id={`${id}-consent`} state={state} name="consent" />
      <PrivacyNote />
      <button className="button button-dark" type="submit" disabled={pending}>
        {pending ? "Sending…" : <>{content.submitLabel} <span aria-hidden="true">↗</span></>}
      </button>
    </form>
  );
}
