"use client";

import { useMemo, useState } from "react";
import { deleteLeadAction, updateLeadAction } from "@/app/admin/actions";
import { BOOKING_SERVICES, ENQUIRY_TYPES, INTEREST_OPTIONS, PERSONA_OPTIONS, TIER_OPTIONS } from "@/content/constants";
import { LEAD_KINDS, LEAD_STATUSES, type Lead, type LeadKind, type LeadStatus } from "@/lib/leads/types";

// Lead inbox (spec §D.7): client-side filters, status auto-submit, notes save on blur, confirmed delete, CSV export.
const KIND_LABEL: Record<LeadKind, string> = { "early-access": "Early access", enquiry: "Inquiry", booking: "Booking", newsletter: "Newsletter" };
const STATUS_LABEL: Record<LeadStatus, string> = { new: "New", contacted: "Contacted", closed: "Closed" };
const WHEN = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Manila" });
const when = (iso: string) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso || "—" : WHEN.format(d);
};

const labelOf = (list: readonly { value: string; label: string }[], value: string) => list.find((o) => o.value === value)?.label ?? value;

function profile(lead: Lead): string {
  return [
    lead.persona && labelOf(PERSONA_OPTIONS, lead.persona),
    lead.tier && `Tier: ${labelOf(TIER_OPTIONS, lead.tier)}`,
    lead.enquiryType && labelOf(ENQUIRY_TYPES, lead.enquiryType),
    (lead.interests ?? []).map((i) => labelOf(INTEREST_OPTIONS, i)).join(", "),
  ].filter(Boolean).join(" · ");
}

function bookingSummary(lead: Lead): string {
  const b = lead.booking;
  if (!b) return "";
  return [
    labelOf(BOOKING_SERVICES, b.service), b.item, b.preferredDate, b.preferredTime,
    b.partySize > 1 ? `${b.partySize} people` : "", b.addOns.length ? `Add-ons: ${b.addOns.join(", ")}` : "", b.waitlist ? "Waitlist" : "",
  ].filter(Boolean).join(" · ");
}

function LeadRow({ lead }: { lead: Lead }) {
  const name = [lead.firstName, lead.lastName].filter(Boolean).join(" ") || "—";
  return (
    <tr>
      <td className="adm-nowrap"><time dateTime={lead.createdAt} suppressHydrationWarning>{when(lead.createdAt)}</time></td>
      <td><span className="adm-kind" data-kind={lead.kind}>{KIND_LABEL[lead.kind] ?? lead.kind}</span></td>
      <td>{name}</td>
      <td><a href={`mailto:${lead.email}`}>{lead.email}</a></td>
      <td className="adm-nowrap">{lead.phone ? <a href={`tel:${lead.phone.replace(/[^0-9+]/g, "")}`}>{lead.phone}</a> : "—"}</td>
      <td>{profile(lead) || "—"}</td>
      <td>{bookingSummary(lead) || "—"}</td>
      <td>
        {lead.message ? (
          <details className="adm-message">
            <summary>{lead.message.length > 40 ? `${lead.message.slice(0, 40)}…` : lead.message}</summary>
            <p>{lead.message}</p>
          </details>
        ) : "—"}
        {lead.source && <span className="adm-muted adm-source">From {lead.source}</span>}
      </td>
      <td>
        <form action={updateLeadAction} key={`${lead.id}:${lead.status}`}>
          <input type="hidden" name="id" value={lead.id} />
          <select name="status" aria-label={`Status for ${name}`} defaultValue={lead.status} onChange={(e) => e.currentTarget.form?.requestSubmit()}>
            {LEAD_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
          </select>
        </form>
      </td>
      <td>
        <form action={updateLeadAction} key={`${lead.id}:${lead.notes}`}>
          <input type="hidden" name="id" value={lead.id} />
          <textarea
            name="notes" rows={2} maxLength={1000} aria-label={`Notes for ${name}`} defaultValue={lead.notes} className="adm-notes"
            onBlur={(e) => { if (e.currentTarget.value.trim() !== lead.notes) e.currentTarget.form?.requestSubmit(); }}
          />
        </form>
      </td>
      <td>
        <form action={deleteLeadAction} onSubmit={(e) => { if (!window.confirm(`Delete the submission from ${name}? This can't be undone.`)) e.preventDefault(); }}>
          <input type="hidden" name="id" value={lead.id} />
          <button type="submit" className="adm-btn adm-btn--danger">Delete</button>
        </form>
      </td>
    </tr>
  );
}

export default function LeadsInbox({ leads }: { leads: Lead[] }) {
  const [kind, setKind] = useState<"all" | LeadKind>("all");
  const [status, setStatus] = useState<"all" | LeadStatus>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return leads.filter((l) =>
      (kind === "all" || l.kind === kind) &&
      (status === "all" || l.status === status) &&
      (!q || [l.firstName, l.lastName, l.email, l.phone, l.message, l.notes, l.source].some((v) => (v ?? "").toLowerCase().includes(q))),
    );
  }, [leads, kind, status, query]);

  return (
    <div className="adm-inbox">
      <div className="adm-filters">
        <label className="adm-mini">
          Kind
          <select value={kind} onChange={(e) => setKind(e.target.value as "all" | LeadKind)}>
            <option value="all">All kinds</option>
            {LEAD_KINDS.map((k) => <option key={k} value={k}>{KIND_LABEL[k]}</option>)}
          </select>
        </label>
        <label className="adm-mini">
          Status
          <select value={status} onChange={(e) => setStatus(e.target.value as "all" | LeadStatus)}>
            <option value="all">All statuses</option>
            {LEAD_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
          </select>
        </label>
        <label className="adm-mini adm-search">
          Search
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Name, email, message…" />
        </label>
        <a className="adm-btn" href={`/admin/leads/export?kind=${kind}`}>Export CSV ↗</a>
      </div>

      {leads.length === 0 ? (
        <p className="adm-empty">No submissions yet.</p>
      ) : filtered.length === 0 ? (
        <p className="adm-empty">No submissions match these filters.</p>
      ) : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <caption className="sr-only">Form submissions, newest first ({filtered.length} shown)</caption>
            <thead>
              <tr>
                <th scope="col">Date</th><th scope="col">Kind</th><th scope="col">Name</th><th scope="col">Email</th><th scope="col">Phone</th>
                <th scope="col">Persona / tier / interests</th><th scope="col">Booking</th><th scope="col">Message</th>
                <th scope="col">Status</th><th scope="col">Notes</th><th scope="col"><span className="sr-only">Delete</span></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead) => <LeadRow key={lead.id} lead={lead} />)}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
