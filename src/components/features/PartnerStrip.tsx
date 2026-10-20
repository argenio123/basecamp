import Link from "next/link";

/**
 * Auto-scrolling strip of partner names (ritebali.com "Our Partners" logo strip + "Browse Partners").
 * Names are shown as wordmarks until partner logos are added. Decorative loop; the list is also given once
 * to screen readers.
 */
export default function PartnerStrip({ title, names, cta }: { title: string; names: readonly string[]; cta?: { label: string; href: string } }) {
  if (names.length === 0) return null;
  const group = names.map((name) => <span className="ft-partner" key={name}>{name}</span>);
  return (
    <section className="section ft-partners section-dark">
      <h2 className="ft-partners-title" data-reveal>{title}</h2>
      <ul className="sr-only">{names.map((name) => <li key={name}>{name}</li>)}</ul>
      <div className="ft-partners-strip" aria-hidden="true">
        <div className="ft-partners-track">
          <div className="ft-partners-group">{group}{group}</div>
          <div className="ft-partners-group">{group}{group}</div>
        </div>
      </div>
      {cta && <div className="ft-center-action" data-reveal><Link href={cta.href} className="button button-ghost ft-pill">{cta.label}</Link></div>}
    </section>
  );
}
