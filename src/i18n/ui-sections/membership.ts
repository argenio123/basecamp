// Draft translations — to be reviewed by a native speaker.
// Interface labels of the shared membership price renderers (components/membership/PriceTable.tsx, AudienceTabs.tsx).
// Client-safe (no server imports): PriceTable renders inside the client AudienceTabs as well as on server pages, so it
// cannot call t(). Server callers pass `locale={getLocale()}`; client callers pass useLocale(). `{name}` placeholders
// are filled by fmt() from ../ui.ts.
import type { Locale } from "../config";

const en = {
  proposedRate: "Proposed rate",
  join: "Join {name}",
  buyOnline: "Buy online",
  payDeposit: "Pay deposit online",
  pricingNotes: "Pricing notes",
  tabs: { all: "All prices", locals: "For locals", travellers: "For travelers" },
  tabsLabel: "Show prices for",
  eyebrow: "Pricing",
  title: "Rates for every rhythm.",
};

export type MembershipUi = typeof en;

const fil: MembershipUi = {
  proposedRate: "Proposed na rate",
  join: "Sumali sa {name}",
  buyOnline: "Bilhin online",
  payDeposit: "Magbayad ng deposit online",
  pricingNotes: "Mga paalala sa presyo",
  tabs: { all: "Lahat ng presyo", locals: "Para sa mga lokal", travellers: "Para sa mga biyahero" },
  tabsLabel: "Ipakita ang presyo para sa",
  eyebrow: "Presyo",
  title: "May rate para sa bawat rhythm.",
};

export const MEMBERSHIP_UI: Record<Locale, MembershipUi> = { en, fil };
