// Storage driver (spec §B.3): Upstash Redis REST when configured, local JSON under .data/ otherwise,
// and read-only (writes fail closed) on Vercel without KV. Server-only: uses node:fs.
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

export type StorageDriver = "upstash" | "file" | "readonly";

export class StorageUnavailableError extends Error {
  constructor(message = "Storage is not configured. Add KV_REST_API_URL and KV_REST_API_TOKEN.") {
    super(message);
    this.name = "StorageUnavailableError";
  }
}

const kvUrl = () => process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL ?? "";
const kvToken = () => process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN ?? "";

export function driver(): StorageDriver {
  if (kvUrl() && kvToken()) return "upstash";
  if (process.env.VERCEL === "1") return "readonly";
  return "file";
}

/** Runs one Redis command over the Upstash REST API, e.g. ["MGET", "a", "b"]. No fetch cache options; 5s timeout. */
export async function upstash<T = unknown>(cmd: (string | number)[]): Promise<T> {
  const res = await fetch(kvUrl(), {
    method: "POST",
    headers: { Authorization: `Bearer ${kvToken()}`, "Content-Type": "application/json" },
    body: JSON.stringify(cmd),
    // A stalled KV request rejects instead of hanging, so callers fall back (defaults, error messages).
    signal: AbortSignal.timeout(5000),
  });
  let body: { result?: T; error?: string } | null = null;
  try { body = (await res.json()) as { result?: T; error?: string }; } catch { body = null; }
  if (!res.ok || !body || body.error) throw new Error(`Upstash ${String(cmd[0])} failed (${res.status})${body?.error ? `: ${body.error}` : ""}`);
  return body.result as T;
}

const dataPath = (name: string) => path.join(process.cwd(), ".data", name);

export async function readJsonFile<T>(name: string, fallback: T): Promise<T> {
  try {
    return JSON.parse(await readFile(dataPath(name), "utf8")) as T;
  } catch (error) {
    if ((error as NodeJS.ErrnoException)?.code === "ENOENT") return fallback;
    throw error;
  }
}

export async function writeJsonFile(name: string, data: unknown): Promise<void> {
  const file = dataPath(name);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(`${file}.tmp`, JSON.stringify(data, null, 2), "utf8");
  await rename(`${file}.tmp`, file);
}

// Serialises read-modify-write cycles on local files within this process.
let queue: Promise<unknown> = Promise.resolve();
export function withFileLock<T>(task: () => Promise<T>): Promise<T> {
  const run = queue.then(task, task);
  queue = run.catch(() => undefined);
  return run;
}
