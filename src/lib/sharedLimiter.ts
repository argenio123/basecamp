// Rate limit shared by every server instance: a fixed-window counter in Upstash Redis when it is configured, and
// the in-memory limiter from rateLimit.ts otherwise. Serverless instances don't share memory, so the in-memory limit
// alone resets whenever a request lands on a fresh instance. Server-only: goes through the storage driver.
import { createLimiter } from "./rateLimit";
import { driver, upstash } from "./storage/driver";

type Options = { name: string; windowMs: number; perKey: number; global: number };

// Redis is a guard here, not the source of truth: past this, the visitor is waved through on the local count
// instead of waiting out the driver's 5s timeout.
const REDIS_BUDGET_MS = 1500;

// One round trip that checks and counts atomically, so concurrent instances can't both slip under the limit.
// Mirrors the in-memory limiter: a blocked "take" counts nothing, and the global counter stops at its cap, so one
// noisy IP can't run the global count up by retrying. Returns 1 when blocked (for "hit": blocked after counting).
const SCRIPT = `
local k = tonumber(redis.call('GET', KEYS[1]) or '0')
local g = tonumber(redis.call('GET', KEYS[2]) or '0')
local perKey, cap, ttl, mode = tonumber(ARGV[1]), tonumber(ARGV[2]), tonumber(ARGV[3]), ARGV[4]
local blocked = k >= perKey or g >= cap
if mode == 'peek' or (mode == 'take' and blocked) then return blocked and 1 or 0 end
k = redis.call('INCR', KEYS[1])
if k == 1 then redis.call('PEXPIRE', KEYS[1], ttl) end
if g < cap then
  g = redis.call('INCR', KEYS[2])
  if g == 1 then redis.call('PEXPIRE', KEYS[2], ttl) end
end
if mode == 'take' then return 0 end
return (k >= perKey or g >= cap) and 1 or 0`;

/** Fixed-window index and the Redis keys for it. The {name} hash tag keeps both keys in one slot for EVAL. */
export function windowKeys(name: string, windowMs: number, key: string, now: number) {
  const win = Math.floor(now / windowMs);
  return { key: `bc:rl:{${name}}:${win}:k:${key}`, all: `bc:rl:{${name}}:${win}:all` };
}

let lastWarn = 0;
function warn(error: unknown) {
  // At most once a minute per instance, so a Redis outage doesn't flood the logs.
  if (Date.now() - lastWarn < 60_000) return;
  lastWarn = Date.now();
  console.warn("[rateLimit] Upstash unavailable, using the per-instance limit:", error instanceof Error ? error.message : error);
}

function withBudget<T>(task: Promise<T>): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`timed out after ${REDIS_BUDGET_MS}ms`)), REDIS_BUDGET_MS);
  });
  return Promise.race([task, timeout]).finally(() => clearTimeout(timer));
}

export function createSharedLimiter({ name, windowMs, perKey, global }: Options) {
  // Always fed, so a Redis failure falls back to this instance's real recent history rather than an empty slate.
  const local = createLimiter({ windowMs, perKey, global });

  /** Runs the script; null means "Redis not configured or failed", and the caller uses the local limiter. */
  async function redis(mode: "peek" | "hit" | "take", key: string, now: number): Promise<boolean | null> {
    if (driver() !== "upstash") return null;
    const keys = windowKeys(name, windowMs, key, now);
    try {
      const res = await withBudget(upstash<number>(["EVAL", SCRIPT, 2, keys.key, keys.all, perKey, global, windowMs, mode]));
      return Number(res) === 1;
    } catch (error) {
      warn(error);
      return null;
    }
  }

  return {
    /** True when this key or the site as a whole has reached its limit in the current window (counts nothing). */
    async blocked(key: string, now = Date.now()): Promise<boolean> {
      return (await redis("peek", key, now)) ?? local.blocked(key, now);
    },
    /** Records one hit and returns whether the key is now blocked (for counting failures, e.g. wrong passwords). */
    async hit(key: string, now = Date.now()): Promise<boolean> {
      const shared = await redis("hit", key, now);
      local.hit(key, now);
      return shared ?? local.blocked(key, now);
    },
    /** Check-and-count in one step: true means blocked (nothing counted); false means allowed and counted. */
    async take(key: string, now = Date.now()): Promise<boolean> {
      const shared = await redis("take", key, now);
      const blocked = shared ?? local.blocked(key, now);
      if (!blocked) local.hit(key, now);
      return blocked;
    },
    async clear(key: string, now = Date.now()): Promise<void> {
      local.clear(key);
      if (driver() !== "upstash") return;
      try {
        await withBudget(upstash(["DEL", windowKeys(name, windowMs, key, now).key]));
      } catch (error) {
        warn(error);
      }
    },
  };
}
