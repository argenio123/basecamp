// Booking records and per-session capacity (server-only). Same storage as payments and leads.
//
// Upstash: every key shares the {bk} hash tag, so one EVAL can touch them all.
//   bc:{bk}:v1                hash  bookingId -> JSON Booking
//   bc:{bk}:occ:<slot>:<date> zset  bookingId -> score: hold expiry (ms) for held, CONFIRMED_SCORE for confirmed
//   bc:{bk}:mem               hash  "<slot>:<date>:<memberId>" -> bookingId (one live booking per member and session)
//   bc:{bk}:pay               hash  paymentId -> bookingId
// Spots used = ZCOUNT occ (now, +inf]: expired holds drop out by themselves, no sweeper needed. Taking a spot is one
// Lua script (check duplicate, count, add), so two members can't both take the last spot.
// Every later change to a stored booking (confirm, release, update, privacy rewrite) is compare-and-set: the script
// writes only if the stored JSON is still the copy the change was computed from, else the change is re-applied to
// the fresh copy. So a payment webhook can't write back a booking that was anonymised or cancelled meanwhile.
// File (local dev): .data/bookings.json (Booking[]), the same checks done on a fresh read inside withFileLock.
// Privacy tools (account deletion, retention clean-up) go through rewriteBookings, which never touches a booking
// that still holds a spot in a future session.
import { driver, readJsonFile, StorageUnavailableError, upstash, withFileLock, writeJsonFile } from "@/lib/storage/driver";
import { isAnonymisedBooking } from "@/lib/privacy/anonymise";
import { effectiveStatus, isActive, type Booking } from "./types";

const HASH = "bc:{bk}:v1";
const MEMBER_INDEX = "bc:{bk}:mem";
const PAYMENT_INDEX = "bc:{bk}:pay";
const FILE = "bookings.json";
const occKey = (slotId: string, date: string) => `bc:{bk}:occ:${slotId}:${date}`;
const memberField = (b: Pick<Booking, "slotId" | "date" | "memberId">) => `${b.slotId}:${b.date}:${b.memberId}`;
/** Occurrence sets expire two days after the session (the booking records themselves are kept). */
const occExpiry = (date: string) => Date.parse(`${date}T00:00:00+08:00`) + 3 * 86_400_000;
/**
 * Occurrence-set score of a confirmed booking: later than any hold expiry (ms) and finite, so every Redis Lua build
 * reads it back with tonumber() (older sets may still hold "+inf"; the scripts treat an unreadable score as live).
 */
const CONFIRMED_SCORE = "9000000000000000";
const score = (b: Booking) => (b.status === "confirmed" ? CONFIRMED_SCORE : String(Date.parse(b.holdExpiresAt ?? "") || 0));
/** Compare-and-set attempts before a change gives up (each retry re-reads the booking and re-applies the change). */
const CAS_ATTEMPTS = 5;
const busy = () => new Error("The booking changed several times while being updated; try again.");

const byNewest = (a: Booking, b: Booking) => (a.createdAt < b.createdAt ? 1 : a.createdAt > b.createdAt ? -1 : 0);
const readFile = () => readJsonFile<Booking[]>(FILE, []).then((l) => (Array.isArray(l) ? l : []));
const sameOcc = (a: Pick<Booking, "slotId" | "date">, b: Pick<Booking, "slotId" | "date">) => a.slotId === b.slotId && a.date === b.date;
const parse = (raw: string | null | undefined): Booking | null => { try { return raw ? (JSON.parse(raw) as Booking) : null; } catch { return null; } };
const getRaw = (id: string) => upstash<string | null>(["HGET", HASH, id]);

// KEYS: occ, hash, member index. ARGV: now, capacity, bookingId, score, json, member field, occ expiry (ms).
const HOLD_SCRIPT = `
local now = tonumber(ARGV[1])
redis.call('ZREMRANGEBYSCORE', KEYS[1], '-inf', now)
local existing = redis.call('HGET', KEYS[3], ARGV[6])
if existing then
  local s = redis.call('ZSCORE', KEYS[1], existing)
  if s and (tonumber(s) or now + 1) > now then return {'duplicate', existing} end
end
local used = redis.call('ZCOUNT', KEYS[1], '(' .. ARGV[1], '+inf')
if used >= tonumber(ARGV[2]) then return {'full', ''} end
redis.call('ZADD', KEYS[1], ARGV[4], ARGV[3])
redis.call('PEXPIREAT', KEYS[1], ARGV[7])
redis.call('HSET', KEYS[2], ARGV[3], ARGV[5])
redis.call('HSET', KEYS[3], ARGV[6], ARGV[3])
return {'ok', ARGV[3]}`;

// Compare-and-set confirm. KEYS: occ, hash. ARGV: now, capacity, bookingId, expected json, json, json with
// overCapacity, occ expiry (ms), confirmed score. Returns -1 (nothing written) when the stored copy changed since it
// was read, 1 when the booking took a spot the session no longer had (over capacity), else 0. The occ set gets its
// expiry again: the ZADD recreates it when every hold in it had run out and been trimmed.
const CONFIRM_SCRIPT = `
if redis.call('HGET', KEYS[2], ARGV[3]) ~= ARGV[4] then return -1 end
local now = tonumber(ARGV[1])
local s = redis.call('ZSCORE', KEYS[1], ARGV[3])
local over = 0
if not (s and (tonumber(s) or now + 1) > now) then
  local used = redis.call('ZCOUNT', KEYS[1], '(' .. ARGV[1], '+inf')
  if used >= tonumber(ARGV[2]) then over = 1 end
end
redis.call('ZADD', KEYS[1], ARGV[8], ARGV[3])
redis.call('PEXPIREAT', KEYS[1], ARGV[7])
if over == 1 then redis.call('HSET', KEYS[2], ARGV[3], ARGV[6]) else redis.call('HSET', KEYS[2], ARGV[3], ARGV[5]) end
return over`;

// Compare-and-set release. KEYS: occ, hash, member index. ARGV: bookingId, expected json, json, member field.
// Returns 0 (nothing written) when the stored copy changed since it was read.
const RELEASE_SCRIPT = `
if redis.call('HGET', KEYS[2], ARGV[1]) ~= ARGV[2] then return 0 end
redis.call('ZREM', KEYS[1], ARGV[1])
redis.call('HSET', KEYS[2], ARGV[1], ARGV[3])
if redis.call('HGET', KEYS[3], ARGV[4]) == ARGV[1] then redis.call('HDEL', KEYS[3], ARGV[4]) end
return 1`;

// Compare-and-set update. KEYS: hash, payment index. ARGV: bookingId, expected json, json, paymentId to index ('' when
// none). Returns 0 (nothing written) when the stored copy changed since it was read.
const UPDATE_SCRIPT = `
if redis.call('HGET', KEYS[1], ARGV[1]) ~= ARGV[2] then return 0 end
redis.call('HSET', KEYS[1], ARGV[1], ARGV[3])
if ARGV[4] ~= '' then redis.call('HSET', KEYS[2], ARGV[4], ARGV[1]) end
return 1`;

// KEYS: occ sets. ARGV: now. Returns the spots used in each.
const COUNT_SCRIPT = `
local out = {}
for i, k in ipairs(KEYS) do out[i] = redis.call('ZCOUNT', k, '(' .. ARGV[1], '+inf') end
return out`;

// Compare-and-set rewrite. KEYS: hash, member index. ARGV: bookingId, expected json, new json, old member field, new
// member field. Returns 0 (nothing written) when the stored copy changed since it was read.
const REWRITE_SCRIPT = `
if redis.call('HGET', KEYS[1], ARGV[1]) ~= ARGV[2] then return 0 end
redis.call('HSET', KEYS[1], ARGV[1], ARGV[3])
if ARGV[4] ~= ARGV[5] and redis.call('HGET', KEYS[2], ARGV[4]) == ARGV[1] then redis.call('HDEL', KEYS[2], ARGV[4]) end
return 1`;

// Compare-and-delete. KEYS: hash, member index, payment index, occ. ARGV: bookingId, expected json, member field,
// paymentId ('' when none). Returns 0 when the stored copy changed since it was read.
const DELETE_SCRIPT = `
if redis.call('HGET', KEYS[1], ARGV[1]) ~= ARGV[2] then return 0 end
redis.call('HDEL', KEYS[1], ARGV[1])
redis.call('ZREM', KEYS[4], ARGV[1])
if redis.call('HGET', KEYS[2], ARGV[3]) == ARGV[1] then redis.call('HDEL', KEYS[2], ARGV[3]) end
if ARGV[4] ~= '' and redis.call('HGET', KEYS[3], ARGV[4]) == ARGV[1] then redis.call('HDEL', KEYS[3], ARGV[4]) end
return 1`;

export type HoldResult = { ok: true; booking: Booking } | { ok: false; reason: "full" } | { ok: false; reason: "duplicate"; existing: Booking };

/**
 * Takes a spot atomically: fails with "duplicate" when the member already has a live booking for this session and
 * "full" when confirmed bookings plus live holds have reached `capacity`. A free (membership) booking is stored
 * confirmed straight away; a paid one is "held" until holdExpiresAt.
 */
export async function createHold(booking: Booking, capacity: number, now = Date.now()): Promise<HoldResult> {
  const mode = driver();
  if (mode === "readonly") throw new StorageUnavailableError();
  if (mode === "upstash") {
    const [result, id] = await upstash<[string, string]>(["EVAL", HOLD_SCRIPT, 3, occKey(booking.slotId, booking.date), HASH, MEMBER_INDEX,
      now, capacity, booking.id, score(booking), JSON.stringify(booking), memberField(booking), occExpiry(booking.date)]);
    if (result === "ok") return { ok: true, booking };
    if (result === "duplicate") {
      const existing = await getBooking(id);
      if (existing) return { ok: false, reason: "duplicate", existing };
    }
    return { ok: false, reason: "full" };
  }
  return withFileLock(async () => {
    const all = await readFile();
    const live = all.filter((b) => sameOcc(b, booking) && isActive(b, now));
    const existing = live.find((b) => b.memberId === booking.memberId);
    if (existing) return { ok: false as const, reason: "duplicate" as const, existing };
    if (live.length >= capacity) return { ok: false as const, reason: "full" as const };
    all.push(booking);
    await writeJsonFile(FILE, all);
    return { ok: true as const, booking };
  });
}

/** What confirmBooking does with the latest stored copy of a booking. */
export type ConfirmPlan = {
  /** Applied to a held booking (live or run-out hold); the status becomes "confirmed". */
  confirm: (b: Booking) => Booking;
  /** Applied instead when the booking was cancelled, released or anonymised (e.g. a refund note for staff). */
  refuse: (b: Booking) => Booking;
};

/**
 * Only a stored "held" booking (its hold may have run out) of a member who still has an account can be confirmed:
 * cancelled, released ("expired") and anonymised bookings are never brought back.
 */
export const confirmable = (b: Booking) => b.status === "held" && !isAnonymisedBooking(b);

/**
 * Confirms a booking (after payment), compare-and-set against the latest stored copy. If its hold had already run
 * out and the session filled up meanwhile, it is still confirmed (the member paid) but flagged overCapacity for staff.
 * An already confirmed booking is returned as is; one that isn't `confirmable` gets `plan.refuse` instead.
 */
export async function confirmBooking(id: string, plan: ConfirmPlan, capacity: number, now = Date.now()): Promise<Booking | null> {
  const mode = driver();
  if (mode === "readonly") throw new StorageUnavailableError();
  if (mode === "upstash") {
    for (let attempt = 0; attempt < CAS_ATTEMPTS; attempt++) {
      const raw = await getRaw(id);
      const current = parse(raw);
      if (!raw || !current) return null;
      if (current.status === "confirmed") return current;
      if (!confirmable(current)) {
        const refused = plan.refuse(current);
        if (refused === current) return current;
        if (await casUpdate(id, raw, refused, current)) return refused;
        continue;
      }
      const next = { ...plan.confirm(current), status: "confirmed" as const };
      const over = Number(await upstash<number>(["EVAL", CONFIRM_SCRIPT, 2, occKey(current.slotId, current.date), HASH,
        now, capacity, id, raw, JSON.stringify(next), JSON.stringify({ ...next, overCapacity: true }), occExpiry(current.date), CONFIRMED_SCORE]));
      if (over === -1) continue;
      return over === 1 ? { ...next, overCapacity: true } : next;
    }
    throw busy();
  }
  return withFileLock(async () => {
    const all = await readFile();
    const i = all.findIndex((b) => b.id === id);
    if (i < 0) return null;
    const current = all[i];
    if (current.status === "confirmed") return current;
    if (!confirmable(current)) {
      const refused = plan.refuse(current);
      if (refused === current) return current;
      all[i] = refused;
    } else {
      const used = all.filter((b) => b.id !== id && sameOcc(b, current) && isActive(b, now)).length;
      const over = !isActive(current, now) && used >= capacity;
      all[i] = { ...plan.confirm(current), status: "confirmed", ...(over ? { overCapacity: true } : {}) };
    }
    await writeJsonFile(FILE, all);
    return all[i];
  });
}

/**
 * Frees the spot and stores the booking as cancelled or expired (with `update` applied to the latest copy). When
 * `update` returns the copy unchanged, nothing is written and the spot stays taken.
 */
export async function releaseBooking(id: string, update: (b: Booking) => Booking): Promise<Booking | null> {
  const mode = driver();
  if (mode === "readonly") throw new StorageUnavailableError();
  if (mode === "upstash") {
    for (let attempt = 0; attempt < CAS_ATTEMPTS; attempt++) {
      const raw = await getRaw(id);
      const current = parse(raw);
      if (!raw || !current) return null;
      const next = update(current);
      if (next === current) return current;
      const done = await upstash<number>(["EVAL", RELEASE_SCRIPT, 3, occKey(current.slotId, current.date), HASH, MEMBER_INDEX, id, raw, JSON.stringify(next), memberField(current)]);
      if (Number(done) === 1) return next;
    }
    throw busy();
  }
  return updateFile(id, update);
}

/** Changes fields that don't affect capacity (e.g. linking the payment, a staff note), on the latest stored copy. */
export async function updateBooking(id: string, update: (b: Booking) => Booking): Promise<Booking | null> {
  const mode = driver();
  if (mode === "readonly") throw new StorageUnavailableError();
  if (mode === "upstash") {
    for (let attempt = 0; attempt < CAS_ATTEMPTS; attempt++) {
      const raw = await getRaw(id);
      const current = parse(raw);
      if (!raw || !current) return null;
      const next = update(current);
      if (next === current) return current;
      if (await casUpdate(id, raw, next, current)) return next;
    }
    throw busy();
  }
  return updateFile(id, update);
}

/** One compare-and-set write of a booking (Upstash); false when the stored copy is no longer `raw`. */
async function casUpdate(id: string, raw: string, next: Booking, current: Booking): Promise<boolean> {
  const indexPayment = next.paymentId && next.paymentId !== current.paymentId ? next.paymentId : "";
  return Number(await upstash<number>(["EVAL", UPDATE_SCRIPT, 2, HASH, PAYMENT_INDEX, id, raw, JSON.stringify(next), indexPayment])) === 1;
}

function updateFile(id: string, update: (b: Booking) => Booking): Promise<Booking | null> {
  return withFileLock(async () => {
    const all = await readFile();
    const i = all.findIndex((b) => b.id === id);
    if (i < 0) return null;
    const next = update(all[i]);
    if (next === all[i]) return next;
    all[i] = next;
    await writeJsonFile(FILE, all);
    return next;
  });
}

export async function getBooking(id: string): Promise<Booking | null> {
  const mode = driver();
  if (mode === "readonly" || !id) return null;
  if (mode === "file") return (await readFile()).find((b) => b.id === id) ?? null;
  return parse(await getRaw(id));
}

export async function findBookingByPaymentId(paymentId: string): Promise<Booking | null> {
  const mode = driver();
  if (mode === "readonly" || !paymentId) return null;
  if (mode === "file") return (await readFile()).find((b) => b.paymentId === paymentId) ?? null;
  const id = await upstash<string | null>(["HGET", PAYMENT_INDEX, paymentId]);
  return id ? getBooking(id) : null;
}

/** All bookings, newest first, with run-out holds read as "expired". */
export async function listBookings(now = Date.now()): Promise<Booking[]> {
  const mode = driver();
  if (mode === "readonly") return [];
  let all: Booking[];
  if (mode === "file") all = await readFile();
  else {
    const flat = (await upstash<string[] | null>(["HGETALL", HASH])) ?? [];
    all = [];
    for (let i = 1; i < flat.length; i += 2) { const b = parse(flat[i]); if (b) all.push(b); }
  }
  return all.map((b) => ({ ...b, status: effectiveStatus(b, now) })).sort(byNewest);
}

export const listMemberBookings = async (memberId: string, now = Date.now()) => (await listBookings(now)).filter((b) => b.memberId === memberId);

/** Spots used (confirmed + live holds) for each occurrence, keyed "<slotId>:<date>". */
export async function countUsed(occurrences: { slotId: string; date: string }[], now = Date.now()): Promise<Record<string, number>> {
  const out: Record<string, number> = {};
  if (!occurrences.length) return out;
  const mode = driver();
  if (mode === "readonly") return out;
  if (mode === "upstash") {
    const counts = await upstash<number[]>(["EVAL", COUNT_SCRIPT, occurrences.length, ...occurrences.map((o) => occKey(o.slotId, o.date)), now]);
    occurrences.forEach((o, i) => { out[`${o.slotId}:${o.date}`] = Number(counts?.[i] ?? 0); });
    return out;
  }
  const all = await readFile();
  for (const o of occurrences) out[`${o.slotId}:${o.date}`] = all.filter((b) => sameOcc(b, o) && isActive(b, now)).length;
  return out;
}

/** What a privacy rewrite does with one booking: replace it, delete it, or leave it (null). */
export type BookingRewrite = Booking | "delete" | null;

/**
 * Privacy tools (account deletion, retention clean-up): `decide` sees each stored booking (stored status: a run-out
 * hold still reads "held"; use effectiveStatus) and returns a replacement, "delete" or null. Bookings that still hold
 * a spot in a session that hasn't started are never passed to `decide`: cancel those with releaseBooking first, so
 * capacity stays right. Upstash: each change is one compare-and-set EVAL (re-read and re-decided, up to 3 times, when
 * a payment or staff change landed meanwhile); a replaced or deleted booking also leaves the member and payment
 * indexes. Returns how many bookings were rewritten and deleted.
 */
export async function rewriteBookings(decide: (b: Booking) => BookingRewrite, now = Date.now()): Promise<{ rewritten: number; deleted: number }> {
  const mode = driver();
  if (mode === "readonly") throw new StorageUnavailableError();
  const holdsFutureSpot = (b: Booking) => isActive(b, now) && !(Date.parse(b.startAt) <= now);
  const pick = (b: Booking | null) => (b && !holdsFutureSpot(b) ? decide(b) : null);
  let rewritten = 0;
  let deleted = 0;
  if (mode === "upstash") {
    const flat = (await upstash<string[] | null>(["HGETALL", HASH])) ?? [];
    for (let i = 0; i + 1 < flat.length; i += 2) {
      const id = flat[i];
      let raw: string | null = flat[i + 1];
      for (let attempt = 0; raw && attempt < 3; attempt++) {
        const current = parse(raw);
        const next = pick(current);
        if (!current || !next) break;
        const done = next === "delete"
          ? await upstash<number>(["EVAL", DELETE_SCRIPT, 4, HASH, MEMBER_INDEX, PAYMENT_INDEX, occKey(current.slotId, current.date), id, raw, memberField(current), current.paymentId ?? ""])
          : await upstash<number>(["EVAL", REWRITE_SCRIPT, 2, HASH, MEMBER_INDEX, id, raw, JSON.stringify(next), memberField(current), memberField(next)]);
        if (Number(done) === 1) {
          if (next === "delete") deleted++;
          else rewritten++;
          break;
        }
        raw = await getRaw(id);
      }
    }
    return { rewritten, deleted };
  }
  return withFileLock(async () => {
    const kept: Booking[] = [];
    for (const b of await readFile()) {
      const next = pick(b);
      if (next === "delete") deleted++;
      else if (next) { rewritten++; kept.push(next); }
      else kept.push(b);
    }
    if (rewritten || deleted) await writeJsonFile(FILE, kept);
    return { rewritten, deleted };
  });
}
