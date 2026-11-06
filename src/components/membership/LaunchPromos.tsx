import Money from "./Money";

/**
 * Proposed launch promotions from the pricing deck (rates being tested; reviewed after the first 90 days).
 * `perks` lists what each offer includes (Athlete features, day-pass inclusions, early-booking terms).
 */
const PROMOS = [
  {
    tag: "Membership test", title: "Athlete membership", a: ["Standard", "Php 4,500"], b: ["Introductory", "Php 3,200"],
    note: "Standard monthly rate tested against an introductory rate.",
    perks: ["All coached group classes", "Unlimited open-gym access", "Programming for serious local athletes", "Community-focused training program"],
  },
  {
    tag: "Visitor test", title: "Day pass", a: ["Standard", "Php 650"], b: ["Weekend", "Php 850"],
    note: "Standard day pass tested against a weekend rate.",
    perks: ["Full gym access for the day", "One coached class included", "Built for hotel guests and day travelers", "Weekend rate covers Saturdays, Sundays, and long weekends"],
  },
  {
    tag: "Camps", title: "Early booking", a: ["Book ahead", "60+ days"], b: ["Discount", "20%"],
    note: "Proposed for camps booked at least 60 days in advance.",
    perks: ["20% off camp packages", "Day clinics, weekend camps, and five-day immersives", "Lock in your dates early", "Inquiry first: the team confirms dates and pricing"],
  },
] as const;

export default function LaunchPromos() {
  return (
    <section id="launch-promotions" className="section mb-promos" aria-labelledby="mb-promos-title">
      <div className="shell">
        <div className="mb-promos-head" data-reveal>
          <p className="eyebrow eyebrow-light">Launch promotions</p>
          <h2 id="mb-promos-title">Rates on test.</h2>
          <p>We are testing these launch offers with the community. Every price is reviewed after the first 90 days.</p>
        </div>
        <ul className="mb-promos-grid" data-reveal="stagger">
          {PROMOS.map((p) => (
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
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
