// Draft translations — to be reviewed by a native speaker.
// Filipino t() phrases for the membership pages/components (same rules as ../phrases.ts). One file per section so
// sections can be localised in parallel without merge conflicts. Figures (prices, percents, the founding cap) are
// never written here: they arrive through {placeholders} from the pricing content, so both languages show the same
// numbers. Kept in English on purpose (GLOSSARY.md): membership, founding member, early member, day pass, tier names.
export const PHRASES_MEMBERSHIP: Readonly<Record<string, string>> = {
  // ---------- shared membership components (components/membership/*) ----------
  "Proposed rate": "Proposed na rate",
  "/month": "/buwan",
  "{tier} tier": "{tier} tier",
  "Standard Php {amount}": "Standard: Php {amount}",
  "Save Php {amount}/month": "Tipid na Php {amount}/buwan",
  "about {percent}": "humigit-kumulang {percent}",
  "What you gain": "Ang makukuha mo",
  "Early membership": "Early membership",
  "Early membership · Limited": "Early membership · Limitado",
  "See membership plans": "Tingnan ang mga membership plan",
  "Become an early member": "Maging early member",
  "Offer ends {date}": "Hanggang {date} lang ang offer",
  "On request": "Sa request",
  "From {amount}": "Mula {amount}",

  // LaunchPromos
  "Launch promotions": "Launch promos",
  "Launch rates.": "Mga launch rate.",
  "Launch offers for the community. Every price is reviewed after the first 90 days.":
    "Mga launch offer para sa komunidad. Rerepasuhin ang bawat presyo pagkatapos ng unang 90 araw.",
  "Founding offer": "Founding offer",
  "{tier} membership": "{tier} membership",
  "Standard": "Standard",
  "Founding rate": "Founding rate",
  "{percent} off the standard monthly rate for your first six months{cap}.":
    "{percent} off sa standard na buwanang rate sa unang anim na buwan mo{cap}.",
  ", for the first {cap} founding members": ", para sa unang {cap} na founding member",
  "Purchase": "Bumili",
  "Visitors": "Mga bisita",
  "Day pass": "Day pass",
  "Weekend": "Weekend",
  "Standard day pass compared with the weekend rate.": "Standard day pass kumpara sa weekend rate.",
  "Full gym access for the day": "Buong gym access sa buong araw",
  "One coached class included": "May kasamang isang coached class",
  "Built for hotel guests and day travelers": "Swak sa mga hotel guest at day traveler",
  "Weekend rate covers Saturdays, Sundays, and long weekends": "Sakop ng weekend rate ang Sabado, Linggo, at mga long weekend",
  "Camps": "Camps",
  "Early booking": "Early booking",
  "Book ahead": "Mag-book nang maaga",
  "60+ days": "60+ araw",
  "Discount": "Discount",
  "Proposed for camps booked at least 60 days in advance.": "Proposed para sa mga camp na na-book nang hindi bababa sa 60 araw bago ito.",
  "{discount} off camp packages": "{discount} off sa mga camp package",
  "Day clinics, weekend camps, and five-day immersives": "Day clinics, weekend camps, at five-day immersives",
  "Lock in your dates early": "I-lock nang maaga ang mga petsa mo",
  "Inquiry first: the team confirms dates and pricing": "Inquiry muna: kukumpirmahin ng team ang petsa at presyo",
  "Book a camp": "Mag-book ng camp",
  "Benefits": "Mga benepisyo",

  // FromPrices (price guide board)
  "Get a Book": "Mag-book",
  "Inquire": "Magtanong",
  "Train": "Train",
  "Recover": "Recover",
  "Camps & teams": "Camps at teams",
  "Locals & travelers": "Mga lokal at biyahero",
  "Locals": "Mga lokal",
  "Travelers": "Mga biyahero",

  // ---------- /membership/founding ----------
  "Founding Members": "Founding Members",
  "{percent} off for your first six months": "{percent} off sa unang anim na buwan mo",
  "a founding rate for your first six months": "founding rate sa unang anim na buwan mo",
  "Become a BaseCamp CamSur founding member: {offer} or a locked lifetime alumni rate, priority access to camps and events, and an exclusive launch event.":
    "Maging founding member ng BaseCamp CamSur: {offer} o naka-lock na lifetime alumni rate, priority access sa mga camp at event, at isang eksklusibong launch event.",
  "Be one of the first.": "Maging isa sa mga nauna.",
  "Join before opening and keep the founding rate, priority access and a place at the launch event.":
    "Sumali bago kami magbukas at sa iyo na ang founding rate, priority access, at puwesto sa launch event.",
  "Founding gym members gathering together after their first workout": "Mga founding member ng gym na nagtitipon pagkatapos ng kanilang unang workout",
  "Founding rates.\nPriority access.\nA seat at launch.": "Founding rates.\nPriority access.\nPuwesto sa launch.",
  "Founding members": "Founding members",
  "Founding spots are full.": "Puno na ang founding spots.",
  "All founding spots have been taken. Our standard memberships are open.":
    "Nakuha na ang lahat ng founding spot. Bukas pa rin ang aming standard memberships.",
  "Claim your founding spot.": "Kunin na ang founding spot mo.",

  // ---------- /membership/launch-promotions ----------
  "Launch Promotions": "Launch Promos",
  "{tier} membership {standard} vs {founding} founding rate ({percent} off)":
    "{tier} membership {standard} kumpara sa {founding} na founding rate ({percent} off)",
  "day pass {standard} standard vs {weekend} weekend": "day pass {standard} standard kumpara sa {weekend} tuwing weekend",
  "{discount} off camps booked 60+ days ahead": "{discount} off sa mga camp na na-book 60+ araw bago nito",
  "BaseCamp CamSur launch promotions: {offers}.": "Mga launch promo ng BaseCamp CamSur: {offers}.",
  "Launch offers for the community, reviewed after the first 90 days.":
    "Mga launch offer para sa komunidad, rerepasuhin pagkatapos ng unang 90 araw.",
  "BaseCamp CamSur members cheering on an athlete during a launch-day sled workout inside the glass-fronted training hall":
    "Mga member ng BaseCamp CamSur na nagchi-cheer sa isang atleta habang nagse-sled workout sa launch day, sa loob ng training hall na may salaming harapan",
  "Founding rates.\nWeekend passes.\nEarly-bird camps.": "Founding rates.\nWeekend passes.\nEarly-bird na camps.",
  "Lock in a launch rate.": "I-lock ang launch rate mo.",
  "Register interest": "Mag-register ng interes",

  // ---------- /membership/price-guide ----------
  "Passes, Recovery & More": "Passes, Recovery at Iba Pa",
  "Every BaseCamp CamSur price beyond the monthly tiers: class packs, day passes, open gym, yoga, recovery, camps, and corporate bookings, with starting prices in PHP.":
    "Lahat ng presyo sa BaseCamp CamSur bukod sa buwanang tiers: class packs, day passes, open gym, yoga, recovery, camps, at corporate bookings, kasama ang panimulang presyo sa PHP.",
  "Passes, recovery, and more.": "Passes, recovery, at iba pa.",
  "Starting prices for everything beyond the monthly tiers, in one place.":
    "Panimulang presyo ng lahat bukod sa buwanang tiers, sa iisang lugar.",
  "Gym reception staff helping a visitor beside accreditation displays": "Staff sa reception ng gym na tumutulong sa isang bisita sa tabi ng mga accreditation display",
  "Packs and day passes.\nYoga and recovery.\nCamps and teams.": "Packs at day passes.\nYoga at recovery.\nCamps at teams.",
  "Passes, recovery and more.": "Passes, recovery at iba pa.",
  "Every price beyond the monthly tiers in one place: class packs, day passes and open gym, yoga, recovery, camps, and team bookings, each with its full details.":
    "Lahat ng presyo bukod sa buwanang tiers sa iisang lugar: class packs, day passes at open gym, yoga, recovery, camps, at team bookings, bawat isa kumpleto ang detalye.",
  // "Price guide", "Need help choosing?" and "Talk to us" are shared with /contact and /membership (../phrases.ts).
};
