import Link from "next/link";
import { getSiteContent } from "@/content/get";
import { formatPhp } from "@/content/format";
import type { PriceGroup, PriceItem } from "@/content/types";
import Money from "./Money";
import { itemPrice } from "./pricing";

/**
 * Proposed introductory Athlete rate on test. It is not in the price guide, so it lives here (and only here); the
 * standard rates it is compared with come from the pricing content.
 */
export const INTRO_ATHLETE_RATE = 3200;
/** Proposed early-booking camp discount (matches the camps group intro and FAQ in the pricing content). */
export const CAMP_EARLY_DISCOUNT = "20%";

const php = (n: number) => formatPhp({ min: n, max: null });
const findItem = (groups: readonly PriceGroup[], id: string): PriceItem | undefined =>
  groups.flatMap((g) => g.items).find((i) => i.id === id && i.visible);

/** The prices the launch promotions compare, all read from the pricing content (null when an item is hidden). */
export function launchPromoPrices(groups: readonly PriceGroup[]) {
  return {
    athlete: itemPrice(groups, "athlete"),
    dayStandard: itemPrice(groups, "day-pass-standard"),
    dayWeekend: itemPrice(groups, "day-pass-weekend"),
  };
}

type Promo = {
  tag: string; title: string; a: readonly [string, string]; b: readonly [string, string];
  note: string; perks: readonly string[]; buy: { label: string; href: string };
};

/**
 * Proposed launch promotions from the pricing deck (rates being tested; reviewed after the first 90 days).
 * Standard and weekend prices come from the pricing content (admin-editable), so this card never disagrees with
 * the price guide; the day-pass note is the weekend item's own description (which names the rate on test).
 * `perks` lists what each offer includes (Athlete features, day-pass inclusions, early-booking terms).
 * Each card ends with Purchase (checkout: logged-out visitors log in first, via the proxy) or Book a camp (a
 * public request).
 */
export default async function LaunchPromos() {
  const { pricing } = await getSiteContent();
  const prices = launchPromoPrices(pricing.groups);
  const weekend = findItem(pricing.groups, "day-pass-weekend");

  const promos: Promo[] = [];
  if (prices.athlete != null && INTRO_ATHLETE_RATE < prices.athlete) promos.push({
    tag: "Membership test", title: "Athlete membership", a: ["Standard", php(prices.athlete)], b: ["Introductory", php(INTRO_ATHLETE_RATE)],
    note: "Standard monthly rate tested against an introductory rate.",
    perks: ["All coached group classes", "Unlimited open-gym access", "Programming for serious local athletes", "Community-focused training program"],
    buy: { label: "Purchase", href: "/pay?item=athlete" },
  });
  if (prices.dayStandard != null && prices.dayWeekend != null) promos.push({
    tag: "Visitor test", title: "Day pass", a: ["Standard", php(prices.dayStandard)], b: ["Weekend", php(prices.dayWeekend)],
    note: weekend?.description || "Standard day pass compared with the weekend rate.",
    perks: ["Full gym access for the day", "One coached class included", "Built for hotel guests and day travelers", "Weekend rate covers Saturdays, Sundays, and long weekends"],
    buy: { label: "Purchase", href: "/pay?item=day-pass-standard" },
  });
  promos.push({
    tag: "Camps", title: "Early booking", a: ["Book ahead", "60+ days"], b: ["Discount", CAMP_EARLY_DISCOUNT],
    note: "Proposed for camps booked at least 60 days in advance.",
    perks: [`${CAMP_EARLY_DISCOUNT} off camp packages`, "Day clinics, weekend camps, and five-day immersives", "Lock in your dates early", "Inquiry first: the team confirms dates and pricing"],
    buy: { label: "Book a camp", href: "/schedule/book?service=camp" },
  });

  return (
    <section id="launch-promotions" className="section mb-promos" aria-labelledby="mb-promos-title">
      <div className="shell">
        <div className="mb-promos-head" data-reveal>
          <p className="eyebrow eyebrow-light">Launch promotions</p>
          <h2 id="mb-promos-title">Rates on test.</h2>
          <p>We are testing these launch offers with the community. Every price is reviewed after the first 90 days.</p>
        </div>
        <ul className="mb-promos-grid" data-reveal="stagger">
          {promos.map((p) => (
            <li key={p.title} className="mb-promo">
              <span className="mb-label mb-label-signal">{p.tag}</span>
              <h3>{p.title}</h3>
              <dl className="mb-promo-compare">
                <div><dt>{p.a[0]}</dt><dd><Money value={p.a[1]} /></dd></div>
                <div><dt>{p.b[0]}</dt><dd><Money value={p.b[1]} /></dd></div>
              </dl>
              <p className="mb-promo-note">{p.note}</p>
              <div className="mb-promo-perks">
                <p className="mb-promo-perks-label">Benefits</p>
                <ul className="mb-promo-checks">
                  {p.perks.map((perk) => <li key={perk}>{perk}</li>)}
                </ul>
              </div>
              <p className="mb-promo-actions">
                <Link href={p.buy.href} className="mb-promo-buy">{p.buy.label}</Link>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
