// Founding offer link helpers (pure, safe anywhere): which tier the founding offer is for.

/** "Example: Athlete founding rate Php 3,200/month (standard Php 4,500)." → tier name and founding price (pesos). */
export function parseFoundingExample(example: string): { tier: string; founding: number } | null {
  const amounts = [...example.matchAll(/(?:₱|Php)\s?([\d,]+)/gi)].map((m) => Number(m[1].replace(/,/g, "")));
  const tier = example.match(/^(?:Example:\s*)?([A-Za-z][A-Za-z ]*?)\s+founding/i)?.[1]?.trim() ?? "";
  return tier && amounts[0] ? { tier, founding: amounts[0] } : null;
}

/** Item id for the founding tier ("Athlete" → "athlete"), for links. */
export const foundingItemId = (example: string) => parseFoundingExample(example)?.tier.toLowerCase().replace(/\s+/g, "-") ?? "";
