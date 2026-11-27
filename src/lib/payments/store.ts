// Payment records (server-only). Same storage as leads: Upstash hash bc:payments:v1 (field = id, value = JSON), or
// .data/payments.json (Payment[]) serialised by withFileLock. Upstash changes are compare-and-set (CAS_SCRIPT): a
// change is written only over the exact copy it was computed from, else re-applied to the fresh copy, so a privacy
// strip can't undo "paid" and a late webhook can't write stripped contact details back.
import { driver, readJsonFile, StorageUnavailableError, upstash, withFileLock, writeJsonFile } from "@/lib/storage/driver";
import { refreshFoundingCount } from "./founding-cache";
import { countFoundingMembers } from "./founding-status";
import type { Payment } from "./types";

const HASH = "bc:payments:v1";
const FILE = "payments.json";

const byNewest = (a: Payment, b: Payment) => (a.createdAt < b.createdAt ? 1 : a.createdAt > b.createdAt ? -1 : 0);
const parse = (raw: string | null | undefined): Payment | null => { try { return raw ? (JSON.parse(raw) as Payment) : null; } catch { return null; } };
const getRaw = (id: string) => upstash<string | null>(["HGET", HASH, id]);
/** Compare-and-set attempts before a change gives up (each retry re-reads the payment and re-applies the change). */
const CAS_ATTEMPTS = 5;

// KEYS: hash. ARGV: id, expected json, new json. Returns 0 (nothing written) when the stored copy changed.
const CAS_SCRIPT = `
if redis.call('HGET', KEYS[1], ARGV[1]) ~= ARGV[2] then return 0 end
redis.call('HSET', KEYS[1], ARGV[1], ARGV[3])
return 1`;
const cas = async (id: string, raw: string, next: Payment) => Number(await upstash<number>(["EVAL", CAS_SCRIPT, 1, HASH, id, raw, JSON.stringify(next)])) === 1;
const readFile = () => readJsonFile<Payment[]>(FILE, []).then((l) => (Array.isArray(l) ? l : []));
/** The public founding counter is refreshed whenever a payment starts or stops counting towards it (paid, refunded). */
const countsAsFounding = (p: Payment | null) => (p ? countFoundingMembers([p]) === 1 : false);
const afterChange = (before: Payment | null, after: Payment | null) => { if (countsAsFounding(before) !== countsAsFounding(after)) refreshFoundingCount(); };

export async function addPayment(payment: Payment): Promise<void> {
  const mode = driver();
  if (mode === "readonly") throw new StorageUnavailableError();
  if (mode === "upstash") await upstash(["HSET", HASH, payment.id, JSON.stringify(payment)]);
  else {
    await withFileLock(async () => {
      const all = await readFile();
      all.push(payment);
      await writeJsonFile(FILE, all);
    });
  }
  afterChange(null, payment);
}

/** All payments, newest first. */
export async function listPayments(): Promise<Payment[]> {
  const mode = driver();
  if (mode === "readonly") return [];
  if (mode === "file") return (await readFile()).sort(byNewest);
  const flat = (await upstash<string[] | null>(["HGETALL", HASH])) ?? [];
  const out: Payment[] = [];
  for (let i = 1; i < flat.length; i += 2) { try { out.push(JSON.parse(flat[i]) as Payment); } catch { /* skip corrupt */ } }
  return out.sort(byNewest);
}

export async function getPayment(id: string): Promise<Payment | null> {
  const mode = driver();
  if (mode === "readonly") return null;
  if (mode === "file") return (await readFile()).find((p) => p.id === id) ?? null;
  return parse(await getRaw(id));
}

export async function findPaymentByCheckoutId(checkoutId: string): Promise<Payment | null> {
  return (await listPayments()).find((p) => p.checkoutId === checkoutId) ?? null;
}

export const listMemberPayments = async (memberId: string) => (await listPayments()).filter((p) => p.memberId === memberId);

/**
 * Applies `update` to the stored payment and returns the result. `update` gets the latest copy, so a paid status
 * written by the webhook is never overwritten by a stale read on the success page.
 */
export async function updatePayment(id: string, update: (p: Payment) => Payment): Promise<Payment | null> {
  const mode = driver();
  if (mode === "readonly") throw new StorageUnavailableError();
  if (mode === "upstash") {
    for (let attempt = 0; attempt < CAS_ATTEMPTS; attempt++) {
      const raw = await getRaw(id);
      const current = parse(raw);
      if (!raw || !current) return null;
      const next = update(current);
      if (next === current) return current;
      if (await cas(id, raw, next)) {
        afterChange(current, next);
        return next;
      }
    }
    throw new Error("The payment changed several times while being updated; try again.");
  }
  return withFileLock(async () => {
    const all = await readFile();
    const i = all.findIndex((p) => p.id === id);
    if (i < 0) return null;
    const before = all[i];
    all[i] = update(before);
    await writeJsonFile(FILE, all);
    afterChange(before, all[i]);
    return all[i];
  });
}

/**
 * Privacy tools: replaces each payment for which `transform` returns a new value (null leaves it). Returns the count.
 * Upstash: each replacement is compare-and-set; when the payment changed meanwhile (e.g. marked paid), `transform`
 * sees the fresh copy and decides again. File: read and written inside withFileLock, like every other change.
 */
export async function rewritePayments(transform: (p: Payment) => Payment | null): Promise<number> {
  const mode = driver();
  if (mode === "readonly") throw new StorageUnavailableError();
  if (mode === "upstash") {
    let changed = 0;
    const flat = (await upstash<string[] | null>(["HGETALL", HASH])) ?? [];
    for (let i = 0; i + 1 < flat.length; i += 2) {
      const id = flat[i];
      let raw: string | null = flat[i + 1];
      for (let attempt = 0; raw && attempt < CAS_ATTEMPTS; attempt++) {
        const current = parse(raw);
        const next = current && transform(current);
        if (!current || !next) break;
        if (await cas(id, raw, next)) {
          afterChange(current, next);
          changed++;
          break;
        }
        raw = await getRaw(id);
      }
    }
    return changed;
  }
  return withFileLock(async () => {
    let changed = 0;
    const all = (await readFile()).map((p) => {
      const next = transform(p);
      if (!next) return p;
      changed++;
      return next;
    });
    if (changed) await writeJsonFile(FILE, all);
    return changed;
  });
}
