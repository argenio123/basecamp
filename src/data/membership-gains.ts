import type { Gain } from "@/components/programs/GainList";

// "What you gain" rows for the Membership pages (same open/close rows as the class pages). Figures follow the
// pricing deck in src/content/defaults.ts; keep them in step when prices change.
export const MEMBERSHIP_GAINS: Readonly<Record<string, readonly Gain[]>> = {
  "/membership": [
    { title: "Coached classes every week", detail: "Athlete and Premium include every coached group class, with programming built for serious local athletes." },
    { title: "Open gym on your schedule", detail: "Every tier includes unlimited open-gym access during staffed hours, so you can train between classes." },
    { title: "Recovery built in", detail: "Premium adds four monthly recovery credits for sauna, ice bath and therapy zones, plus two guest passes a month." },
  ],
  "/membership/founding": [
    { title: "A lower monthly rate", detail: "A proposed 30% off your first six months, or a lifetime alumni rate that stays locked in." },
    { title: "First access", detail: "Priority booking for camps, workshops, and special events before they open to everyone." },
    { title: "A place in the story", detail: "Founding-community recognition and an invitation to the exclusive launch event." },
  ],
  "/membership/launch-promotions": [
    { title: "An introductory Athlete rate", detail: "Php 3,200 a month on test against the Php 4,500 standard while launch pricing is reviewed." },
    { title: "Weekend day access", detail: "A day pass with gym access and one coached class: Php 650 standard, with an Php 850 weekend rate on test." },
    { title: "Camp savings", detail: "A proposed 20% off camps booked at least 60 days ahead." },
  ],
  "/membership/price-guide": [
    { title: "Every price in one place", detail: "Packs, passes, open gym, yoga, recovery, camps, and corporate bookings, each with its starting price." },
    { title: "Pick by how you train", detail: "Locals lean on memberships and class packs; travelers choose day passes, retreats, and camps." },
    { title: "Straight to the details", detail: "Every row links to its full price page, so you can compare options in a click." },
  ],
  "/about/faq": [
    { title: "Clear answers before you join", detail: "Packs, passes, freezes, cancellations, and the founding offer, explained in plain terms." },
    { title: "Know what's coming", detail: "What the member platform will add: online sign-up, bookings with waitlists, and automated billing." },
    { title: "A real person when you need one", detail: "Anything not covered here, the BaseCamp CamSur team will answer directly." },
  ],
};
