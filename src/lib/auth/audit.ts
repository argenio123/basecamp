// Admin audit trail: one structured log line per admin change, naming the staff member who made it.
// The content and lead stores keep only timestamps, so the record lives in the server logs (Vercel → Logs):
// search for "[admin-audit]". Never pass passwords, tokens or lead personal data (names, emails, notes) here.
import type { AdminSession } from "./token";

type Detail = string | number | boolean | null | undefined;

export function audit(session: Pick<AdminSession, "staff">, action: string, details: Record<string, Detail> = {}): void {
  // The fixed fields come last in the spread so a detail can't overwrite who/what/when.
  const entry = { ...details, at: new Date().toISOString(), staff: session.staff, action };
  console.info(`[admin-audit] ${JSON.stringify(entry)}`);
}
