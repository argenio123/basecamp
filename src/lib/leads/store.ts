// Lead persistence (spec §B.3). Server-only.
// Upstash: hash bc:leads:v1 (field = id, value = JSON) plus hash bc:leads:v1:meta (fields "<id>:status" and
// "<id>:notes", written without a prior read so concurrent admin edits never overwrite each other).
// File: .data/leads.json (Lead[]), serialised by withFileLock.
import { driver, readJsonFile, StorageUnavailableError, upstash, withFileLock, writeJsonFile } from "@/lib/storage/driver";
import { LEAD_STATUSES, type Lead, type LeadStatus } from "./types";

const HASH = "bc:leads:v1";
const META = "bc:leads:v1:meta";
const FILE = "leads.json";
/** Storage ceiling: beyond this, new submissions fail and the form shows the email fallback. */
export const MAX_LEADS = 5000;
const full = () => new Error("Lead store is full.");

const byNewest = (a: Lead, b: Lead) => (a.createdAt < b.createdAt ? 1 : a.createdAt > b.createdAt ? -1 : 0);
const readFileLeads = () => readJsonFile<Lead[]>(FILE, []).then((l) => (Array.isArray(l) ? l : []));
/** A stored lead with its admin overrides (status, notes) from the meta hash applied. */
const withMeta = (lead: Lead, status: string | null | undefined, notes: string | null | undefined): Lead => ({
  ...lead,
  ...(status && (LEAD_STATUSES as readonly string[]).includes(status) ? { status: status as LeadStatus } : {}),
  ...(notes !== undefined && notes !== null ? { notes } : {}),
});
/** Compare-and-set attempts per lead in rewriteLeads (each retry re-reads the lead and decides again). */
const CAS_ATTEMPTS = 5;

// Compare-and-set rewrite. KEYS: hash, meta. ARGV: id, expected json, new json, notes field. Returns 0 (nothing
// written) when the stored lead changed (or was deleted) since it was read; on success the notes override goes too.
const REWRITE_SCRIPT = `
if redis.call('HGET', KEYS[1], ARGV[1]) ~= ARGV[2] then return 0 end
redis.call('HSET', KEYS[1], ARGV[1], ARGV[3])
redis.call('HDEL', KEYS[2], ARGV[4])
return 1`;

export async function addLead(lead: Lead): Promise<void> {
  const mode = driver();
  if (mode === "readonly") throw new StorageUnavailableError();
  if (mode === "upstash") {
    if ((await upstash<number>(["HLEN", HASH])) >= MAX_LEADS) throw full();
    await upstash(["HSET", HASH, lead.id, JSON.stringify(lead)]);
    return;
  }
  await withFileLock(async () => {
    const leads = await readFileLeads();
    if (leads.length >= MAX_LEADS) throw full();
    leads.push(lead);
    await writeJsonFile(FILE, leads);
  });
}

/** All leads, newest first. */
export async function listLeads(): Promise<Lead[]> {
  const mode = driver();
  if (mode === "readonly") return [];
  if (mode === "file") return (await readFileLeads()).sort(byNewest);
  const [flat, metaFlat] = await Promise.all([upstash<string[] | null>(["HGETALL", HASH]), upstash<string[] | null>(["HGETALL", META])]);
  const meta = new Map<string, string>();
  for (let i = 1; i < (metaFlat ?? []).length; i += 2) meta.set(metaFlat![i - 1], metaFlat![i]);
  const leads: Lead[] = [];
  for (let i = 1; i < (flat ?? []).length; i += 2) {
    try {
      const lead = JSON.parse(flat![i]) as Lead;
      leads.push(withMeta(lead, meta.get(`${lead.id}:status`), meta.get(`${lead.id}:notes`)));
    } catch { /* skip corrupt entry */ }
  }
  return leads.sort(byNewest);
}

export async function updateLead(id: string, patch: { status?: LeadStatus; notes?: string }): Promise<void> {
  const mode = driver();
  if (mode === "readonly") throw new StorageUnavailableError();
  const apply = (lead: Lead): Lead => ({ ...lead, ...(patch.status ? { status: patch.status } : {}), ...(patch.notes !== undefined ? { notes: patch.notes } : {}) });
  if (mode === "upstash") {
    if (!(await upstash<number>(["HEXISTS", HASH, id]))) return;
    const fields: string[] = [];
    if (patch.status) fields.push(`${id}:status`, patch.status);
    if (patch.notes !== undefined) fields.push(`${id}:notes`, patch.notes);
    if (fields.length) await upstash(["HSET", META, ...fields]);
    return;
  }
  await withFileLock(async () => {
    const leads = await readFileLeads();
    await writeJsonFile(FILE, leads.map((l) => (l.id === id ? apply(l) : l)));
  });
}

export async function deleteLead(id: string): Promise<void> {
  const mode = driver();
  if (mode === "readonly") throw new StorageUnavailableError();
  if (mode === "upstash") {
    await upstash(["HDEL", HASH, id]);
    await upstash(["HDEL", META, `${id}:status`, `${id}:notes`]);
    return;
  }
  await withFileLock(async () => {
    const leads = await readFileLeads();
    await writeJsonFile(FILE, leads.filter((l) => l.id !== id));
  });
}

/**
 * Privacy tools (account deletion, retention clean-up): replaces each lead for which `transform` returns a new
 * value (null leaves it as is) and returns how many changed. Upstash: each rewrite is compare-and-set (a lead that
 * changed or was deleted meanwhile is re-read and decided again, never written back from a stale copy), and the
 * rewritten lead's notes override is dropped in the same step, so the notes stored on the lead itself apply. File:
 * read and written inside withFileLock, like every other change.
 */
export async function rewriteLeads(transform: (lead: Lead) => Lead | null): Promise<number> {
  const mode = driver();
  if (mode === "readonly") throw new StorageUnavailableError();
  if (mode === "upstash") {
    let changed = 0;
    const [flat, metaFlat] = await Promise.all([upstash<string[] | null>(["HGETALL", HASH]), upstash<string[] | null>(["HGETALL", META])]);
    const meta = new Map<string, string>();
    for (let i = 1; i < (metaFlat ?? []).length; i += 2) meta.set(metaFlat![i - 1], metaFlat![i]);
    for (let i = 0; i + 1 < (flat ?? []).length; i += 2) {
      const id = flat![i];
      let raw: string | null = flat![i + 1];
      let status: string | null | undefined = meta.get(`${id}:status`);
      let notes: string | null | undefined = meta.get(`${id}:notes`);
      for (let attempt = 0; raw && attempt < CAS_ATTEMPTS; attempt++) {
        let lead: Lead;
        try { lead = JSON.parse(raw) as Lead; } catch { break; }
        const next = transform(withMeta(lead, status, notes));
        if (!next) break;
        if (Number(await upstash<number>(["EVAL", REWRITE_SCRIPT, 2, HASH, META, id, raw, JSON.stringify(next), `${id}:notes`])) === 1) {
          changed++;
          break;
        }
        [raw, status, notes] = await Promise.all([
          upstash<string | null>(["HGET", HASH, id]),
          upstash<string | null>(["HGET", META, `${id}:status`]),
          upstash<string | null>(["HGET", META, `${id}:notes`]),
        ]);
      }
    }
    return changed;
  }
  return withFileLock(async () => {
    let changed = 0;
    const leads = (await readFileLeads()).map((lead) => {
      const next = transform(lead);
      if (!next) return lead;
      changed++;
      return next;
    });
    if (changed) await writeJsonFile(FILE, leads);
    return changed;
  });
}
