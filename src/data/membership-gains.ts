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
    { title: "First access", detail: "Priority booking for camps, workshops and special events before they open to everyone." },
    { title: "A place in the story", detail: "Founding-community recognition and an invitation to the exclusive launch event." },
  ],
  "/membership/launch-promotions": [
    { title: "An introductory Athlete rate", detail: "Php 3,200 a month on test against the Php 4,500 standard while launch pricing is reviewed." },
    { title: "Weekend day access", detail: "A day pass with gym access and one coached class: Php 650 standard, with an Php 850 weekend rate on test." },
    { title: "Camp savings", detail: "A proposed 20% off camps booked at least 60 days ahead." },
  ],
  "/membership/price-guide": [
    { title: "Every price in one place", detail: "Packs, passes, open gym, yoga, recovery, camps and corporate bookings, each with its starting price." },
    { title: "Pick by how you train", detail: "Locals lean on memberships and class packs; travelers choose day passes, retreats and camps." },
    { title: "Straight to the details", detail: "Every row links to its full price page, so you can compare options in a click." },
  ],
  "/membership/passes": [
    { title: "Try before you commit", detail: "The 5-class intro pack costs Php 1,900 (Php 380 a class) and is valid for 60 days." },
    { title: "Better value per class", detail: "The 10-class pack brings each class down to Php 350, valid for 90 days." },
    { title: "Train on your own terms", detail: "Open-gym passes from Php 300 a day to Php 3,500 a month, no classes required." },
  ],
  "/membership/recovery-pricing": [
    { title: "Recover faster between sessions", detail: "Sauna or ice bath from Php 450 a session, built for post-training recovery." },
    { title: "Expert hands", detail: "Sports massage or physiotherapy at Php 1,200–2,500 per 60-minute treatment." },
    { title: "Save with a bundle", detail: "Five sauna or ice-bath sessions for Php 2,000: Php 250 less than paying per session." },
  ],
  "/membership/yoga": [
    { title: "Balance hard training", detail: "Yoga restores mobility and helps you switch off between heavy sessions." },
    { title: "A lower cost per class", detail: "Packs bring a class from Php 800 down to Php 700 (5-pack) or Php 600 (10-pack)." },
    { title: "Unlimited for members", detail: "Athlete and Premium members can add unlimited yoga for Php 1,000 a month." },
  ],
  "/membership/camps": [
    { title: "Focused coaching", detail: "Structured programming and performance assessment, from one-day clinics to five-day immersives." },
    { title: "Everything handled", detail: "All-inclusive weekends cover training, Villa Del Rey accommodation and meals." },
    { title: "Book early, pay less", detail: "A proposed 20% off camps booked 60 or more days ahead." },
  ],
  "/membership/corporate": [
    { title: "Stronger teams", detail: "Team-building experiences built around training and recovering together." },
    { title: "Group rates", detail: "Group training rates for companies, teams and organized groups." },
    { title: "Custom off-sites", detail: "Wellness off-sites with programming shaped around your team's goals." },
  ],
  "/membership/faq": [
    { title: "Clear answers before you join", detail: "Packs, passes, freezes, cancellations and the founding offer, explained in plain terms." },
    { title: "Know what's coming", detail: "What the member platform will add: online sign-up, bookings with waitlists and automated billing." },
    { title: "A real person when you need one", detail: "Anything not covered here, the BaseCamp CamSur team will answer directly." },
  ],
};
