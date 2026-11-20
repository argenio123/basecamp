// Payment records (server-only). Same storage as leads: Upstash hash bc:payments:v1 (field = id, value = JSON), or
// .data/payments.json (Payment[]) serialised by withFileLock.
import { driver, readJsonFile, StorageUnavailableError, upstash, withFileLock, writeJsonFile } from "@/lib/storage/driver";
import type { Payment } from "./types";

const HASH = "bc:payments:v1";
const FILE = "payments.json";

const byNewest = (a: Payment, b: Payment) => (a.createdAt < b.createdAt ? 1 : a.createdAt > b.createdAt ? -1 : 0);
const readFile = () => readJsonFile<Payment[]>(FILE, []).then((l) => (Array.isArray(l) ? l : []));

export async function addPayment(payment: Payment): Promise<void> {
  const mode = driver();
  if (mode === "readonly") throw new StorageUnavailableError();
  if (mode === "upstash") { await upstash(["HSET", HASH, payment.id, JSON.stringify(payment)]); return; }
  await withFileLock(async () => {
    const all = await readFile();
    all.push(payment);
    await writeJsonFile(FILE, all);
  });
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
  const raw = await upstash<string | null>(["HGET", HASH, id]);
  try { return raw ? (JSON.parse(raw) as Payment) : null; } catch { return null; }
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
    const current = await getPayment(id);
    if (!current) return null;
    const next = update(current);
    await upstash(["HSET", HASH, id, JSON.stringify(next)]);
    return next;
  }
  return withFileLock(async () => {
    const all = await readFile();
    const i = all.findIndex((p) => p.id === id);
    if (i < 0) return null;
    all[i] = update(all[i]);
    await writeJsonFile(FILE, all);
    return all[i];
  });
}
