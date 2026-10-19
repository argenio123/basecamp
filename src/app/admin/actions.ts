"use server";
// Admin Server Actions (spec §D.4, §D.8).
// Docs: 03-api-reference/01-directives/use-server.md, 02-guides/server-actions.md, 02-guides/forms.md,
//       04-functions/updateTag.md, 04-functions/revalidatePath.md, 04-functions/refresh.md,
//       04-functions/headers.md, 04-functions/redirect.md.
// Every action except login calls requireAdmin() first; redirect() is never called inside try/catch.
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
import { adminConfigured, passwordMatches } from "@/lib/auth/token";
import { clearSessionCookies, requireAdmin, setSessionCookies } from "@/lib/auth/session";
import { deleteLead, updateLead } from "@/lib/leads/store";
import { LEAD_STATUSES, type LeadStatus } from "@/lib/leads/types";
import { clientIp, createLimiter } from "@/lib/rateLimit";
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

// ---------- login (in-memory, per-instance: 5 failures per 15 minutes per IP, 30 across all IPs) ----------
// The global cap bounds brute force even when the client rotates spoofed forwarding headers.
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_LIMIT = 5;
const loginFailures = createLimiter({ windowMs: LOGIN_WINDOW_MS, perKey: LOGIN_LIMIT, global: 30 });

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  if (!adminConfigured()) return { error: "Sign-in isn't set up yet. Please ask the person who manages the website to finish the setup." };
  const ip = clientIp(await headers());
  const now = Date.now();
  if (loginFailures.blocked(ip, now)) return { error: "Too many attempts. Try again later." };

  const password = formData.get("password");
  if (typeof password !== "string" || !password || password.length > 512 || !passwordMatches(password)) {
    loginFailures.hit(ip, now);
    await new Promise((resolve) => setTimeout(resolve, 600));
    return { error: loginFailures.blocked(ip, now) ? "Too many attempts. Try again later." : "Incorrect password." };
  }

  loginFailures.clear(ip);
  await setSessionCookies();
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await clearSessionCookies();
  redirect("/login");
}

// ---------- content ----------
export async function saveSectionAction(_prev: SaveState, formData: FormData): Promise<SaveState> {
  await requireAdmin();
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
    return { ok: false, error: storageMessage(error, SAVE_FAILED) };
  }
  invalidateContent();
  return { ok: true, savedAt };
}

export async function resetSectionAction(_prev: SaveState, formData: FormData): Promise<SaveState> {
  await requireAdmin();
  const section = formData.get("section");
  if (!isSection(section)) return { ok: false, error: "Unknown section." };
  try {
    await deleteSection(section);
  } catch (error) {
    return { ok: false, error: storageMessage(error, "Couldn't reset just now. Please try again.") };
  }
  invalidateContent();
  return { ok: true, reset: true };
}

// ---------- leads ----------
const leadId = (formData: FormData) => {
  const id = formData.get("id");
  return typeof id === "string" && id.length > 0 && id.length <= 100 ? id : "";
};

export async function updateLeadAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = leadId(formData);
  if (!id) return;
  const rawStatus = formData.get("status");
  const status = (LEAD_STATUSES as readonly string[]).includes(String(rawStatus)) ? (rawStatus as LeadStatus) : undefined;
  const rawNotes = formData.get("notes");
  const notes = typeof rawNotes === "string" ? rawNotes.replace(/\u0000/g, "").trim().slice(0, 1000) : undefined;
  if (status === undefined && notes === undefined) return;
  try {
    await updateLead(id, { status, notes });
  } catch {
    // Read-only storage or an outage: the refreshed inbox shows the unchanged lead.
  }
  refresh();
}

export async function deleteLeadAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = leadId(formData);
  if (!id) return;
  try {
    await deleteLead(id);
  } catch {
    // See updateLeadAction.
  }
  refresh();
}
