// Promo codes for online checkout (server-only). Codes live in .env as PAYMENT_PROMO_CODES, comma-separated:
//   CODE=10%            10% off any payable item
//   CODE=500            PHP 500 off any payable item
//   CODE=29%@athlete    only for the listed item ids (separate several with |, e.g. @athlete|premium)
// Codes are case-insensitive. The discount is worked out here on the server every time; the browser only sends the code.

export type PromoRule = { code: string; percent?: number; peso?: number; items?: string[] };
export type PromoResult = { ok: true; code: string; label: string; discount: number; total: number } | { ok: false; message: string };

/** PayMongo's smallest accepted checkout amount (PHP 20), in centavos. */
export const MIN_CHARGE = 2000;

export function promoRules(): PromoRule[] {
  return (process.env.PAYMENT_PROMO_CODES ?? "").split(",").map((raw) => raw.trim()).filter(Boolean).flatMap((raw): PromoRule[] => {
    const m = raw.match(/^([A-Za-z0-9_-]{2,32})\s*=\s*(\d+(?:\.\d+)?)(%?)\s*(?:@\s*([A-Za-z0-9_|-]+))?$/);
    if (!m) return [];
    const value = Number(m[2]);
    const items = m[4] ? m[4].split("|").filter(Boolean) : undefined;
    if (m[3]) return value > 0 && value < 100 ? [{ code: m[1].toUpperCase(), percent: value, items }] : [];
    return value > 0 ? [{ code: m[1].toUpperCase(), peso: value, items }] : [];
  });
}

/** Applies a promo code to an amount (centavos) for an item. Never discounts below PayMongo's minimum charge. */
export function applyPromo(rawCode: string, itemId: string, amount: number): PromoResult {
  const code = rawCode.trim().toUpperCase();
  if (!code) return { ok: false, message: "Enter a promo code." };
  const rule = promoRules().find((r) => r.code === code);
  if (!rule) return { ok: false, message: "That promo code isn't valid." };
  if (rule.items && !rule.items.includes(itemId)) return { ok: false, message: "That promo code doesn't apply to this item." };
  const wanted = rule.percent ? Math.round((amount * rule.percent) / 100) : Math.round((rule.peso ?? 0) * 100);
  const discount = Math.min(wanted, Math.max(0, amount - MIN_CHARGE));
  if (discount <= 0) return { ok: false, message: "That promo code can't be used on this amount." };
  const label = rule.percent ? `${code} (${rule.percent}% off)` : `${code} (PHP ${rule.peso!.toLocaleString("en-PH")} off)`;
  return { ok: true, code, label, discount, total: amount - discount };
}
