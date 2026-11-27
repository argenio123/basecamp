"use server";
// Admin Server Actions (spec §D.4, §D.8).
// Docs: 03-api-reference/01-directives/use-server.md, 02-guides/server-actions.md, 02-guides/forms.md,
//       04-functions/updateTag.md, 04-functions/revalidatePath.md, 04-functions/refresh.md,
//       04-functions/headers.md, 04-functions/redirect.md.
// Every action except login calls requireAdmin() first; redirect() is never called inside try/catch.
// requireAdmin() returns who is signed in; every change is recorded with audit() (see src/lib/auth/audit.ts).
// CSRF protection relies on Next's built-in Origin/Host check for Server Actions (no allowedOrigins set).
import { refresh, revalidatePath, updateTag } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { LoginState, SaveState } from "@/components/admin/state";
import { CONTENT_TAG, SECTION_KEYS } from "@/content/constants";
import { readContentFresh } from "@/content/get";
import { deleteSection, writeSection } from "@/content/store";
import type { SectionKey } from "@/content/types";
import { refSetsFor, validateSection } from "@/content/validate";
import { audit } from "@/lib/auth/audit";
import { clearSessionCookies, currentAdminSession, requireAdmin, setSessionCookies } from "@/lib/auth/session";
import { authMode, checkCredentials } from "@/lib/auth/staff";
import { adminConfigured } from "@/lib/auth/token";
import { deleteLead, updateLead } from "@/lib/leads/store";
import { LEAD_STATUSES, type LeadStatus } from "@/lib/leads/types";
import { clientIp } from "@/lib/rateLimit";
import { createSharedLimiter } from "@/lib/sharedLimiter";
import { StorageUnavailableError } from "@/lib/storage/driver";

const MAX_PAYLOAD = 300 * 1024;
const SAVE_FAILED = "Couldn't save just now. Please try again.";

const isSection = (v: unknown): v is SectionKey => typeof v === "string" && (SECTION_KEYS as readonly string[]).includes(v);
const storageMessage = (error: unknown, fallback: string) => (error instanceof StorageUnavailableError ? error.message : fallback);

/** Invalidates the cached site content so public pages regenerate on their next request. */
function invalidateContent() {
  updateTag(CONTENT_TAG);
  revalidatePath("/", "layout");
}

// ---------- login (shared via Redis, per-instance without it: 5 failures per 15 minutes per IP, 200 across all IPs) ----------
// The global cap bounds brute force even when the client rotates spoofed forwarding headers. It is site-wide once
// Redis is on, so it is set high enough that a stranger can't cheaply lock the owner out (200 guesses per 15 min is
// still nothing against a long random password), while a real brute-force run is still capped.
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_LIMIT = 5;
const loginFailures = createSharedLimiter({ name: "admin-login", windowMs: LOGIN_WINDOW_MS, perKey: LOGIN_LIMIT, global: 200 });

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  if (!adminConfigured()) return { error: "Sign-in isn't set up yet. Please ask the person who manages the website to finish the setup." };
  const ip = clientIp(await headers());
  const now = Date.now();
  if (await loginFailures.blocked(ip, now)) return { error: "Too many attempts. Try again later." };

  // Personal accounts (ADMIN_USERS) need email + password; the legacy shared ADMIN_PASSWORD needs only the password.
  const personal = authMode() === "personal";
  const email = formData.get("email");
  const password = formData.get("password");
  const staff =
    typeof password === "string" && password && password.length <= 512 && (!personal || (typeof email === "string" && email.length <= 254))
      ? await checkCredentials(typeof email === "string" ? email : "", password)
      : null;
  if (!staff) {
    // Counting and the blocked check are one Redis call; the delay runs alongside it.
    const [nowBlocked] = await Promise.all([loginFailures.hit(ip, now), new Promise((resolve) => setTimeout(resolve, 600))]);
    const error = nowBlocked ? "Too many attempts. Try again later." : personal ? "Incorrect email or password." : "Incorrect password.";
    return personal && typeof email === "string" ? { error, email: email.slice(0, 254) } : { error };
  }

  await loginFailures.clear(ip, now);
  await setSessionCookies(staff);
  audit({ staff }, "auth.login");
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  const session = await currentAdminSession();
  if (session) audit(session, "auth.logout");
  await clearSessionCookies();
  redirect("/login");
}

// ---------- content ----------
export async function saveSectionAction(_prev: SaveState, formData: FormData): Promise<SaveState> {
  const session = await requireAdmin();
  const section = formData.get("section");
  if (!isSection(section)) return { ok: false, error: "Unknown section." };
  const payload = formData.get("payload");
  if (typeof payload !== "string" || !payload) return { ok: false, error: "Nothing to save." };
  if (payload.length > MAX_PAYLOAD) return { ok: false, error: "This section is too large to save (300 KB limit)." };
  const baseUpdatedAt = formData.get("baseUpdatedAt");

  let parsed: unknown;
  try {
    parsed = JSON.parse(payload);
  } catch {
    return { ok: false, error: "The edited data could not be read. Reload and try again." };
  }

  let fresh: Awaited<ReturnType<typeof readContentFresh>>;
  try {
    fresh = await readContentFresh();
  } catch {
    return { ok: false, error: "Couldn't reach storage. Please try again." };
  }

  const result = validateSection(section, parsed, refSetsFor(fresh.content));
  if (!result.ok) return { ok: false, error: "Please fix the highlighted fields.", errors: result.errors };

  // Normalise both sides: a never-saved section ("" vs "") saves, but a save or reset made elsewhere
  // after this editor loaded the section (stored differs, or was deleted) is reported as a conflict.
  const stored = fresh.meta[section] ?? "";
  if (stored !== (typeof baseUpdatedAt === "string" ? baseUpdatedAt : "")) {
    return { ok: false, conflict: true, error: "This section was changed elsewhere. Reload to see the latest version." };
  }

  let savedAt: string;
  try {
    savedAt = await writeSection(section, result.value);
  } catch (error) {
    audit(session, "content.save", { section, ok: false });
    return { ok: false, error: storageMessage(error, SAVE_FAILED) };
  }
  audit(session, "content.save", { section, ok: true, savedAt });
  invalidateContent();
  return { ok: true, savedAt };
}

export async function resetSectionAction(_prev: SaveState, formData: FormData): Promise<SaveState> {
  const session = await requireAdmin();
  const section = formData.get("section");
  if (!isSection(section)) return { ok: false, error: "Unknown section." };
  try {
    await deleteSection(section);
  } catch (error) {
    audit(session, "content.reset", { section, ok: false });
    return { ok: false, error: storageMessage(error, "Couldn't reset just now. Please try again.") };
  }
  audit(session, "content.reset", { section, ok: true });
  invalidateContent();
  return { ok: true, reset: true };
}

// ---------- leads ----------
const leadId = (formData: FormData) => {
  const id = formData.get("id");
  return typeof id === "string" && id.length > 0 && id.length <= 100 ? id : "";
};

export async function updateLeadAction(formData: FormData): Promise<void> {
  const session = await requireAdmin();
  const id = leadId(formData);
  if (!id) return;
  const rawStatus = formData.get("status");
  const status = (LEAD_STATUSES as readonly string[]).includes(String(rawStatus)) ? (rawStatus as LeadStatus) : undefined;
  const rawNotes = formData.get("notes");
  const notes = typeof rawNotes === "string" ? rawNotes.replace(/\u0000/g, "").trim().slice(0, 1000) : undefined;
  if (status === undefined && notes === undefined) return;
  // The audit line names the lead by id only: notes and contact details are personal data and stay out of logs.
  try {
    await updateLead(id, { status, notes });
    audit(session, "lead.update", { lead: id, status, notesSaved: notes !== undefined, ok: true });
  } catch {
    // Read-only storage or an outage: the refreshed inbox shows the unchanged lead.
    audit(session, "lead.update", { lead: id, status, notesSaved: notes !== undefined, ok: false });
  }
  refresh();
}

export async function deleteLeadAction(formData: FormData): Promise<void> {
  const session = await requireAdmin();
  const id = leadId(formData);
  if (!id) return;
  try {
    await deleteLead(id);
    audit(session, "lead.delete", { lead: id, ok: true });
  } catch {
    // See updateLeadAction.
    audit(session, "lead.delete", { lead: id, ok: false });
  }
  refresh();
}
