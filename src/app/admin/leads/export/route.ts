// CSV export of leads (spec §D.5). Docs: 03-api-reference/03-file-conventions/route.md,
// 01-getting-started/15-route-handlers.md (reading request.cookies makes this GET handler request-time).
// Re-verifies the session itself: proxy.ts is only an optimistic gate.
import type { NextRequest } from "next/server";
import { isAdminRequest } from "@/lib/auth/session";
import { listLeads } from "@/lib/leads/store";
import { LEAD_KINDS, type Lead } from "@/lib/leads/types";

type Cell = string | number | boolean;
const COLUMNS: [string, (lead: Lead) => Cell][] = [
  ["createdAt", (l) => l.createdAt],
  ["kind", (l) => l.kind],
  ["status", (l) => l.status],
  ["firstName", (l) => l.firstName],
  ["lastName", (l) => l.lastName],
  ["email", (l) => l.email],
  ["phone", (l) => l.phone],
  ["persona", (l) => l.persona],
  ["tier", (l) => l.tier],
  ["interests", (l) => (l.interests ?? []).join(";")],
  ["enquiryType", (l) => l.enquiryType],
  ["booking.service", (l) => l.booking?.service ?? ""],
  ["booking.item", (l) => l.booking?.item ?? ""],
  ["booking.preferredDate", (l) => l.booking?.preferredDate ?? ""],
  ["booking.preferredTime", (l) => l.booking?.preferredTime ?? ""],
  ["booking.addOns", (l) => (l.booking?.addOns ?? []).join(";")],
  ["booking.partySize", (l) => l.booking?.partySize ?? ""],
  ["booking.waitlist", (l) => (l.booking ? (l.booking.waitlist ? "yes" : "no") : "")],
  ["message", (l) => l.message],
  ["source", (l) => l.source],
  ["notes", (l) => l.notes],
];

/** RFC 4180 quoting, plus a ' prefix on cells that a spreadsheet would read as a formula. */
function csvCell(value: Cell | null | undefined): string {
  let s = value === null || value === undefined ? "" : String(value);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return new Response("Unauthorized", { status: 401, headers: { "Cache-Control": "no-store" } });
  }
  const kindParam = request.nextUrl.searchParams.get("kind") ?? "all";
  const kind = (LEAD_KINDS as readonly string[]).includes(kindParam) ? kindParam : "all";

  let leads: Lead[];
  try {
    leads = await listLeads();
  } catch {
    return new Response("Couldn't reach storage. Please try again.", { status: 503, headers: { "Cache-Control": "no-store" } });
  }
  const rows = kind === "all" ? leads : leads.filter((l) => l.kind === kind);
  const lines = [COLUMNS.map(([name]) => csvCell(name)).join(","), ...rows.map((lead) => COLUMNS.map(([, get]) => csvCell(get(lead))).join(","))];
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Manila", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());

  // BOM so spreadsheet apps read UTF-8 (₱, accents) correctly.
  return new Response(`﻿${lines.join("\r\n")}\r\n`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="basecamp-leads-${today}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
