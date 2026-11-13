// When the homepage founding-offer modal shows. Everything lives in sessionStorage, which belongs to one tab in one
// browser, so the modal shows:
//   1. the first time a new tab opens the homepage,
//   2. the first time another browser opens the homepage (its own storage),
//   3. on the next full load (reload / reopen) of the homepage after the visitor was idle for 15 minutes or more.
// Otherwise it stays hidden: once per tab, apart from the idle rule.

const SEEN_KEY = "basecamp:home-offer-seen";
const LAST_ACTIVE_KEY = "basecamp:last-active";
const IDLE_KEY = "basecamp:home-offer-idle";

export const OFFER_IDLE_MS = 15 * 60 * 1000;

const read = (key: string) => { try { return window.sessionStorage.getItem(key); } catch { return null; } };
const write = (key: string, value: string) => { try { window.sessionStorage.setItem(key, value); } catch { /* storage blocked */ } };
const remove = (key: string) => { try { window.sessionStorage.removeItem(key); } catch { /* storage blocked */ } };

/**
 * Records visitor activity (called from the site-wide tracker). Activity after a gap of 15+ minutes marks the
 * session idle, so moving the mouse back to press reload doesn't hide the fact that the visitor had been away.
 */
export function recordActivity(now = Date.now(), markIdle = true) {
  const last = Number(read(LAST_ACTIVE_KEY));
  if (markIdle && last && now - last >= OFFER_IDLE_MS) write(IDLE_KEY, "1");
  write(LAST_ACTIVE_KEY, String(now));
}

/** A full load of a page other than the homepage: an idle mark no longer applies to a later homepage visit. */
export function clearIdleMark() { remove(IDLE_KEY); }

/** Decide on a full load of the homepage whether the modal shows, and record the visit. */
export function takeOfferVisit(now = Date.now()) {
  const last = Number(read(LAST_ACTIVE_KEY));
  const idle = read(IDLE_KEY) === "1" || (!!last && now - last >= OFFER_IDLE_MS);
  const show = read(SEEN_KEY) !== "1" || idle;
  write(SEEN_KEY, "1");
  remove(IDLE_KEY);
  write(LAST_ACTIVE_KEY, String(now));
  return show;
}
