// In-memory, per-instance sliding-window limiter shared by the login and lead actions. Pure; no Next imports.

/**
 * Best-effort client IP. Prefers x-real-ip, then the rightmost x-forwarded-for hop: an appending proxy
 * (nginx $proxy_add_x_forwarded_for) puts the address it saw last, while the leftmost entry is whatever
 * the client sent. With no proxy (bare `next start`) both headers are still client-controlled, which is
 * why every limiter below also keeps a global cap that does not depend on the IP.
 */
export function clientIp(h: Headers): string {
  const real = h.get("x-real-ip")?.trim();
  if (real) return real.slice(0, 64);
  const hops = (h.get("x-forwarded-for") ?? "").split(",").map((v) => v.trim()).filter(Boolean);
  return hops.length ? hops[hops.length - 1].slice(0, 64) : "unknown";
}

type Options = { windowMs: number; perKey: number; global: number; maxKeys?: number };

export function createLimiter({ windowMs, perKey, global, maxKeys = 5000 }: Options) {
  const byKey = new Map<string, number[]>();
  let all: number[] = [];
  const fresh = (times: number[], now: number) => times.filter((t) => now - t < windowMs);

  return {
    /** True when this key or the instance as a whole has reached its limit in the current window. */
    blocked(key: string, now: number): boolean {
      all = fresh(all, now);
      return all.length >= global || fresh(byKey.get(key) ?? [], now).length >= perKey;
    },
    /** Records one hit. Map insertion order is oldest-first, so overflow evicts the least recently hit keys. */
    hit(key: string, now: number): void {
      const times = fresh(byKey.get(key) ?? [], now);
      times.push(now);
      byKey.delete(key);
      byKey.set(key, times);
      all = fresh(all, now);
      if (all.length < global) all.push(now);
      while (byKey.size > maxKeys) byKey.delete(byKey.keys().next().value as string);
    },
    clear(key: string): void {
      byKey.delete(key);
    },
  };
}
