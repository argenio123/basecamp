import Link from "next/link";
import { getSiteContent } from "@/content/get";
import { formatPhp } from "@/content/format";
import type { FoundingOffer, PriceGroup, PriceItem } from "@/content/types";
import { payHref } from "@/lib/payments/types";
import { localHref, t } from "@/i18n/server";
import Money from "./Money";
import { percentText } from "./localize";
import { foundingSaving, itemPrice } from "./pricing";

/** Proposed early-booking camp discount (matches the camps group intro and FAQ in the pricing content). */
export const CAMP_EARLY_DISCOUNT = "20%";

const php = (n: number) => formatPhp({ min: n, max: null });
const findItem = (groups: readonly PriceGroup[], id: string): PriceItem | undefined =>
  groups.flatMap((g) => g.items).find((i) => i.id === id && i.visible);

/** The prices the launch promotions compare, all read from the pricing content (null when an item is hidden). */
export function launchPromoPrices(groups: readonly PriceGroup[]) {
  return {
    dayStandard: itemPrice(groups, "day-pass-standard"),
    dayWeekend: itemPrice(groups, "day-pass-weekend"),
  };
}

/**
 * The introductory membership rate is the founding offer (settings.founding): the same tier, price and saving the
 * founding page shows and checkout charges (src/lib/payments/founding.ts). Null while the offer is off.
 */
export function launchFoundingRate(founding: FoundingOffer, groups: readonly PriceGroup[]) {
  return foundingSaving(founding, groups);
}

type Promo = {
  tag: string; title: string; a: readonly [string, string]; b: readonly [string, string];
  note: string; perks: readonly string[]; buy: { label: string; href: string };
};

/**
 * Launch promotions from the pricing deck (reviewed after the first 90 days). The membership card is the founding
 * offer (launchFoundingRate) and buys at the founding rate; standard and weekend prices come from the pricing
 * content (admin-editable), so no card disagrees with the price guide or checkout. The day-pass note is the weekend
 * item's own description. `perks` lists what each offer includes (tier features, day-pass inclusions,
 * early-booking terms). Each card ends with Purchase (checkout: logged-out visitors log in first, via the proxy) or
 * Book a camp (a public request). Words go through t() (src/i18n/fil/phrases/membership.ts); prices, percents and the
 * cap are filled in from content, so both languages show the same figures. Pay links stay English (/pay).
 */
export default async function LaunchPromos() {
  const { pricing, settings } = await getSiteContent();
  const prices = launchPromoPrices(pricing.groups);
  const weekend = findItem(pricing.groups, "day-pass-weekend");
  const founding = launchFoundingRate(settings.founding, pricing.groups);
  const cap = Math.max(0, Math.floor(settings.founding.cap));

  const promos: Promo[] = [];
  if (founding) promos.push({
    tag: t("Founding offer"), title: t("{tier} membership", { tier: founding.tier }), a: [t("Standard"), php(founding.standard)], b: [t("Founding rate"), php(founding.founding)],
    note: t("{percent} off the standard monthly rate for your first six months{cap}.", {
      percent: percentText(founding.percent),
      cap: cap > 0 ? t(", for the first {cap} founding members", { cap }) : "",
    }),
    perks: findItem(pricing.groups, founding.tierId)?.features ?? [],
    buy: { label: t("Purchase"), href: payHref(founding.tierId, "founding") },
  });
  if (prices.dayStandard != null && prices.dayWeekend != null) promos.push({
    tag: t("Visitors"), title: t("Day pass"), a: [t("Standard"), php(prices.dayStandard)], b: [t("Weekend"), php(prices.dayWeekend)],
    note: weekend?.description || t("Standard day pass compared with the weekend rate."),
    perks: [t("Full gym access for the day"), t("One coached class included"), t("Built for hotel guests and day travelers"), t("Weekend rate covers Saturdays, Sundays, and long weekends")],
    buy: { label: t("Purchase"), href: "/pay?item=day-pass-standard" },
  });
  promos.push({
    tag: t("Camps"), title: t("Early booking"), a: [t("Book ahead"), t("60+ days")], b: [t("Discount"), CAMP_EARLY_DISCOUNT],
    note: t("Proposed for camps booked at least 60 days in advance."),
    perks: [t("{discount} off camp packages", { discount: CAMP_EARLY_DISCOUNT }), t("Day clinics, weekend camps, and five-day immersives"), t("Lock in your dates early"), t("Inquiry first: the team confirms dates and pricing")],
    buy: { label: t("Book a camp"), href: localHref("/schedule/book?service=camp") },
  });

  return (
    <section id="launch-promotions" className="section mb-promos" aria-labelledby="mb-promos-title">
      <div className="shell">
        <div className="mb-promos-head" data-reveal>
          <p className="eyebrow eyebrow-light">{t("Launch promotions")}</p>
          <h2 id="mb-promos-title">{t("Launch rates.")}</h2>
          <p>{t("Launch offers for the community. Every price is reviewed after the first 90 days.")}</p>
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
                <p className="mb-promo-perks-label">{t("Benefits")}</p>
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
