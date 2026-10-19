// Persistence for edited content sections (spec §B.3). Server-only.
// Upstash: one key per section, value {"updatedAt":ISO,"data":…}. File: .data/content.json {sections, meta}.
import { driver, readJsonFile, StorageUnavailableError, upstash, withFileLock, writeJsonFile } from "@/lib/storage/driver";
import { SECTION_KEYS } from "./constants";
import type { ContentMeta, SectionKey } from "./types";

export type StoredSections = Partial<Record<SectionKey, unknown>>;
export type StoredContent = { sections: StoredSections; meta: ContentMeta };

const FILE = "content.json";
const keyFor = (section: SectionKey) => `bc:content:v1:${section}`;
const empty = (): StoredContent => ({ sections: {}, meta: {} });

function readFileStore(): Promise<StoredContent> {
  return readJsonFile<StoredContent>(FILE, empty()).then((s) => ({ sections: s?.sections ?? {}, meta: s?.meta ?? {} }));
}

export async function readStoredContent(): Promise<StoredContent> {
  const mode = driver();
  if (mode === "readonly") return empty();
  if (mode === "file") return readFileStore();
  const values = await upstash<(string | null)[]>(["MGET", ...SECTION_KEYS.map(keyFor)]);
  const out = empty();
  SECTION_KEYS.forEach((section, i) => {
    const raw = values?.[i];
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as { updatedAt?: string; data?: unknown };
      if (parsed && "data" in parsed) {
        out.sections[section] = parsed.data;
        if (parsed.updatedAt) out.meta[section] = parsed.updatedAt;
      }
    } catch { /* ignore a corrupt entry: defaults apply */ }
  });
  return out;
}

/** Stores one section and returns its new updatedAt (ISO). */
export async function writeSection(section: SectionKey, data: unknown): Promise<string> {
  const mode = driver();
  if (mode === "readonly") throw new StorageUnavailableError();
  const updatedAt = new Date().toISOString();
  if (mode === "upstash") {
    await upstash(["SET", keyFor(section), JSON.stringify({ updatedAt, data })]);
    return updatedAt;
  }
  await withFileLock(async () => {
    const current = await readFileStore();
    current.sections[section] = data;
    current.meta[section] = updatedAt;
    await writeJsonFile(FILE, current);
  });
  return updatedAt;
}

/** Removes a stored section so its defaults apply again. */
export async function deleteSection(section: SectionKey): Promise<void> {
  const mode = driver();
  if (mode === "readonly") throw new StorageUnavailableError();
  if (mode === "upstash") {
    await upstash(["DEL", keyFor(section)]);
    return;
  }
  await withFileLock(async () => {
    const current = await readFileStore();
    delete current.sections[section];
    delete current.meta[section];
    await writeJsonFile(FILE, current);
  });
}
