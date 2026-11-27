// Draft translations — to be reviewed by a native speaker.
//
// Filipino for page copy written inline in page files and Server Components, used by t() (src/i18n/server.ts).
// Key = the exact English text passed to t() (including {placeholders}); value = Filipino. A missing or empty entry
// falls back to English, and so does a key whose English text has since been edited in the page, so a stale entry is
// harmless (find them with the check in MERGE-PLAN.md). Editable content and src/data/* copy are NOT here: see
// fil/content.ts and fil/data/*. Grouped by page; keep each group next to its page's path comment.

import { PHRASES_CLASSES } from "./phrases/classes";
import { PHRASES_FACILITIES } from "./phrases/facilities";
import { PHRASES_MEMBERSHIP } from "./phrases/membership";
import { PHRASES_SCHEDULE } from "./phrases/schedule";
import { PHRASES_VISIT_ABOUT } from "./phrases/visit-about";
import { PHRASES_SHARED } from "./phrases/shared";

export const FIL_PHRASES: Readonly<Record<string, string>> = {
  // ---------- / (home) ----------
  "Now open": "Bukas na",
  "Soft opening · Early memberships open": "Soft opening · Bukas na ang early memberships",
  "Founding memberships open": "Bukas na ang founding memberships",
  "Early access open": "Bukas na ang early access",
  "Opening {date}": "Magbubukas sa {date}",
  "Now being built": "Itinatayo na ngayon",
  "Train & recover": "Mag-train at mag-recover",
  "in Pili, CamSur": "sa Pili, CamSur",
  "A gym, coached classes and recovery (cold plunge, sauna, therapy) in one place, in Camarines Sur, Philippines.":
    "Gym, mga coached class at recovery (cold plunge, sauna, therapy) sa iisang lugar, dito sa Camarines Sur.",
  "Join early access": "Sumali sa early access",
  "See the facilities": "Tingnan ang mga pasilidad",
  // The three lines of the home statement are rebalanced in Filipino (similar lengths), so none overflows.
  "The Philippines' first": "Ang kauna-unahang integrated",
  "integrated sports, fitness": "sports, fitness at wellness",
  "& wellness destination": "destination sa Pilipinas",
  "Basecamp CamSur represents a bold new category in sports tourism: an integrated destination where elite performance training, evidence-based recovery, and authentic lifestyle converge to create transformative experiences.":
    "Bagong klase ng sports tourism ang Basecamp CamSur: isang integrated destination kung saan nagsasama ang elite performance training, recovery na batay sa siyensya, at tunay na lifestyle para sa mga karanasang talagang nagpapabago.",
  "Purpose-built performance training zones combining CrossFit, functional fitness, and endurance programming in a world-class outdoor environment.":
    "Mga training zone na ginawa para sa performance: CrossFit, functional fitness at endurance programming sa world-class na outdoor na kapaligiran.",
  "Comprehensive recovery infrastructure featuring contrast therapy, cold plunge pools, saunas, and dedicated wellness facilities.":
    "Kumpletong recovery facilities: contrast therapy, cold plunge pools, sauna, at mga pasilidad para sa wellness.",
  "A thriving community ecosystem where athletes connect, grow, and belong. Designed for long stays and lasting impact.":
    "Isang masiglang komunidad kung saan nagkakakilala, lumalago at may kinabibilangan ang mga atleta. Ginawa para sa mahabang pananatili at pangmatagalang resulta.",
  "Explore all classes": "Tingnan lahat ng klase",

  // ---------- /membership ----------
  "Membership & Pricing": "Membership at Presyo",
  "BaseCamp CamSur membership and pricing{tiers}. Early-member rates, plus class packs, day passes, recovery, and corporate pricing.":
    "Membership at presyo sa BaseCamp CamSur{tiers}. Early-member rates, pati class packs, day passes, recovery, at corporate pricing.",
  "Choose access that fits how you train.": "Piliin ang access na bagay sa paraan ng training mo.",
  "Athlete driving a weighted sled in the BaseCamp CamSur open-air gym": "Atletang nagtutulak ng weighted sled sa open-air gym ng BaseCamp CamSur",
  "Monthly memberships.\nFlexible passes.\nRecovery on demand.": "Buwanang membership.\nFlexible na passes.\nRecovery kahit kailan.",
  "Membership guidance": "Tulong sa pagpili ng membership",
  "Need help choosing?": "Kailangan ng tulong sa pagpili?",
  "Tell us how often you plan to train and what you want to work on. We will point you to the most suitable option.":
    "Sabihin sa amin kung gaano kadalas ka magte-train at ano ang gusto mong i-improve. Ituturo namin ang pinakaangkop na option para sa iyo.",
  "Talk to us": "Kausapin kami",
  "Membership tiers": "Mga membership tier",
  "Choose your tier.": "Piliin ang iyong tier.",
  "Membership categories": "Mga kategorya ng membership",
  "More membership.": "Iba pang membership.",
  "Founding rates, promotions, passes, recovery, yoga, camps, and team pricing. Pick a category to see every price.":
    "Founding rates, promos, passes, recovery, yoga, camps, at team pricing. Pumili ng kategorya para makita ang lahat ng presyo.",

  // ---------- /visit ----------
  "Plan your visit": "Planuhin ang pagbisita",
  "Train & Travel.": "Mag-train at bumiyahe.",
  "Training camps and group trips, plus why Camarines Sur is built for training.":
    "Training camps at group trips, at kung bakit swak ang Camarines Sur para sa training.",
  "Training camps, travel packages, and group trips for traveling athletes.":
    "Training camps, travel packages, at group trips para sa mga atletang bumibiyahe.",
  "Training camp guests arriving with travel bags and meeting their coach": "Mga guest ng training camp na dumarating dala ang kanilang bag at sinasalubong ng coach",
  "Why athletes choose Camarines Sur: cooler lakes, forest, and room to train.":
    "Kung bakit pinipili ng mga atleta ang Camarines Sur: malalamig na lawa, gubat, at maluwag na lugar para mag-train.",
  "Athletes and visitors gathering inside the BaseCamp CamSur cafeteria and lounge": "Mga atleta at bisitang nagtitipon sa cafeteria at lounge ng BaseCamp CamSur",

  // ---------- /contact ----------
  "Contact": "Makipag-ugnayan",
  "Email, call, or message BaseCamp CamSur, find the address and hours, get quick answers, and follow us on social media.":
    "Mag-email, tumawag, o mag-message sa BaseCamp CamSur, alamin ang address at oras, kumuha ng mabilis na sagot, at i-follow kami sa social media.",
  "Hi BaseCamp CamSur, I have a quick question.": "Hi BaseCamp CamSur, may tanong lang po ako.",
  "Class-pack validity, guest passes, freezes, and cancellations.": "Validity ng class pack, guest passes, pag-freeze, at cancellation.",
  "Price guide": "Price guide",
  "Passes, recovery, camps, and team bookings with starting prices.": "Passes, recovery, camps, at team bookings, kasama ang panimulang presyo.",
  "This week's classes by day, with a request button on every session.": "Mga klase ngayong linggo kada araw, may request button sa bawat session.",
  "Camps, trips, extended stays, and how to find BaseCamp in Pili.": "Camps, trips, mahabang pananatili, at paano hanapin ang BaseCamp sa Pili.",
  "Athlete carrying kettlebells": "Atletang may bitbit na kettlebells",
  "Athlete throwing a wall ball": "Atletang nagbabato ng wall ball",
  "Front approach of BaseCamp CamSur": "Harapan ng BaseCamp CamSur",
  "Early access": "Early access",
  "Priority updates": "Priority updates",
  "Join now": "Sumali na",
  "Email": "Email",
  "Send email": "Mag-email",
  "Phone": "Telepono",
  "Call now": "Tumawag",
  "WhatsApp": "WhatsApp",
  "Open chat": "Buksan ang chat",
  "Address": "Address",
  "Directions": "Direksyon",
  "Hours": "Oras",
  "Schedule": "Iskedyul",
  "Let's connect.": "Usap tayo.",
  "Email, call, or message us. We reply within one business day.": "Mag-email, tumawag, o mag-message sa amin. Sumasagot kami sa loob ng isang business day.",
  "BaseCamp CamSur set within the CamSur landscape": "Ang BaseCamp CamSur sa gitna ng tanawin ng CamSur",
  "Ask anything.\nWe answer fast.\nThen come train.": "Magtanong kahit ano.\nMabilis kaming sumagot.\nTapos, tara mag-train.",
  "Direct lines.": "Direktang contact.",
  "Choose the quickest way to reach our team, ask a question, or plan your first visit.":
    "Piliin ang pinakamabilis na paraan para makausap ang team namin, magtanong, o planuhin ang unang bisita mo.",
  "Before you write": "Bago ka mag-message",
  "Quick answers.": "Mabilis na sagot.",
  "Most questions about prices, passes, class times, and visiting are answered here.":
    "Nandito na ang sagot sa karamihan ng tanong tungkol sa presyo, passes, oras ng klase, at pagbisita.",
  "Follow us": "I-follow kami",
  "Train with us online.": "Mag-train kasama kami online.",
  "Build updates, training clips, and community news before we open.": "Build updates, training clips, at balita mula sa komunidad bago kami magbukas.",
  "Follow": "I-follow",
  " BaseCamp on {platform} (opens in a new tab)": " ang BaseCamp sa {platform} (magbubukas sa bagong tab)",
  // ---------- section files (src/i18n/fil/phrases/*) ----------
  ...PHRASES_CLASSES,
  ...PHRASES_FACILITIES,
  ...PHRASES_MEMBERSHIP,
  ...PHRASES_SCHEDULE,
  ...PHRASES_VISIT_ABOUT,
  ...PHRASES_SHARED,
};
