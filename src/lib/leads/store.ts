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
      const status = meta.get(`${lead.id}:status`);
      const notes = meta.get(`${lead.id}:notes`);
      leads.push({ ...lead, ...(status && (LEAD_STATUSES as readonly string[]).includes(status) ? { status: status as LeadStatus } : {}), ...(notes !== undefined ? { notes } : {}) });
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
