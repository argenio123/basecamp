// Hand-written lead validation (spec §B.17). Pure; no Next imports.
// Messages are in the form's language: forms send a hidden `locale` field (<input type="hidden" name="locale"
// value={useLocale()} />), because Server Actions cannot read the request locale. Missing / unknown → English.
// Text: src/i18n/ui.ts `leads`.
import { BOOKING_ADDONS, BOOKING_SERVICES, ENQUIRY_TYPES, INTEREST_OPTIONS, PERSONA_OPTIONS, PREFERRED_TIMES, TIER_OPTIONS } from "@/content/constants";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/i18n/config";
import { fmt, UI } from "@/i18n/ui";
import { LEAD_KINDS, type Lead, type LeadKind } from "./types";

export type LeadInput = Omit<Lead, "id" | "createdAt" | "status" | "notes">;
export type LeadValidation =
  | { ok: true; honeypot: boolean; lead: LeadInput }
  | { ok: false; fieldErrors: Record<string, string> };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[0-9+()\-\s]*$/;

const clean = (v: FormDataEntryValue | null) => (typeof v === "string" ? v.replace(/\u0000/g, "").trim() : "");
function pick<T extends string>(value: string, allowed: readonly T[]): T | "" {
  return (allowed as readonly string[]).includes(value) ? (value as T) : "";
}
const values = <T extends { value: string }>(list: readonly T[]) => list.map((o) => o.value as T["value"]);

/** The language of the submitting form (its hidden `locale` field), English when missing or unknown. */
export function leadLocale(formData: FormData): Locale {
  const value = clean(formData.get("locale"));
  return (LOCALES as readonly string[]).includes(value) ? (value as Locale) : DEFAULT_LOCALE;
}

/** Server Action messages (src/i18n/ui.ts `leads`) in the submitting form's language. */
export const leadMessages = (formData: FormData) => UI[leadLocale(formData)].leads;

export function validateLead(formData: FormData): LeadValidation {
  const get = (name: string) => clean(formData.get(name));
  const m = leadMessages(formData);
  const max = (n: number) => fmt(m.maxChars, { max: n.toLocaleString("en-US") });
  const getAll = (name: string) => formData.getAll(name).map(clean).filter(Boolean);
  const errors: Record<string, string> = {};

  // Honeypot: a filled field means a bot. Report success upstream and store nothing.
  if (get("website")) return { ok: true, honeypot: true, lead: emptyLead("newsletter") };

  const kind = pick(get("kind"), LEAD_KINDS) as LeadKind | "";
  if (!kind) return { ok: false, fieldErrors: { form: m.formInvalid } };

  const firstName = get("firstName");
  const lastName = get("lastName");
  const email = get("email");
  const phone = get("phone");
  const message = get("message");

  if (!email) errors.email = m.emailRequired;
  else if (email.length > 254 || !EMAIL_RE.test(email)) errors.email = m.emailInvalid;
  if (kind !== "newsletter" && !firstName) errors.firstName = m.firstNameRequired;
  if (firstName.length > 80) errors.firstName = max(80);
  if (lastName.length > 80) errors.lastName = max(80);
  if (phone.length > 30 || !PHONE_RE.test(phone)) errors.phone = m.phoneInvalid;
  if (message.length > 2000) errors.message = max(2000);
  if (get("consent") !== "on") errors.consent = m.consent;

  const enquiryType = pick(get("enquiryType"), values(ENQUIRY_TYPES));
  if (kind === "enquiry") {
    if (!enquiryType) errors.enquiryType = m.enquiryType;
    if (!message) errors.message = m.messageRequired;
  }

  let booking: LeadInput["booking"] = null;
  if (kind === "booking") {
    const service = pick(get("service"), values(BOOKING_SERVICES));
    if (!service) errors.service = m.service;
    const item = get("item");
    if (item.length > 120) errors.item = max(120);
    const preferredDate = /^\d{4}-\d{2}-\d{2}$/.test(get("preferredDate")) ? get("preferredDate") : "";
    const partyRaw = get("partySize");
    const partySize = partyRaw ? Number(partyRaw) : 1;
    if (!Number.isInteger(partySize) || partySize < 1 || partySize > 60) errors.partySize = m.partySize;
    booking = {
      service: (service || "class") as NonNullable<LeadInput["booking"]>["service"],
      item, preferredDate,
      preferredTime: pick(get("preferredTime"), PREFERRED_TIMES),
      addOns: [...new Set(getAll("addOns").filter((a) => (BOOKING_ADDONS as readonly string[]).includes(a)))].slice(0, BOOKING_ADDONS.length),
      partySize: Number.isInteger(partySize) ? partySize : 1,
      waitlist: get("waitlist") === "1",
    };
  }

  if (Object.keys(errors).length) return { ok: false, fieldErrors: errors };

  const source = get("source");
  return {
    ok: true,
    honeypot: false,
    lead: {
      kind, firstName, lastName, email, phone, message,
      persona: pick(get("persona"), values(PERSONA_OPTIONS)),
      tier: pick(get("tier"), values(TIER_OPTIONS)),
      interests: [...new Set(getAll("interests").filter((i) => values(INTEREST_OPTIONS).includes(i as never)))],
      enquiryType,
      source: source.startsWith("/") && !source.startsWith("//") ? source.slice(0, 200) : "",
      booking,
    },
  };
}

function emptyLead(kind: LeadKind): LeadInput {
  return { kind, firstName: "", lastName: "", email: "", phone: "", persona: "", tier: "", interests: [], enquiryType: "", message: "", source: "", booking: null };
}
