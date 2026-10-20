import Image from "next/image";
import Link from "next/link";

export type PillarTile = { title: string; href: string; image: string; imagePosition?: string };

/** Row of tall image tiles with the title underneath (ritebali.com "Gym · Recovery · Cafe · The Lab"). */
export default function PillarTiles({ items, eyebrow, title }: { items: readonly PillarTile[]; eyebrow?: string; title?: string }) {
  if (items.length === 0) return null;
  return (
    <section className="section ft-pillars">
      <div className="shell">
        {(eyebrow || title) && (
          <div className="nv-block-head" data-reveal>
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            {title && <h2>{title}</h2>}
          </div>
        )}
        <ul className="ft-pillars-grid" data-reveal="stagger">
          {items.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="ft-pillar">
                <span className="ft-pillar-media">
                  <Image src={item.image} alt="" fill sizes="(max-width: 760px) 80vw, 25vw" className="cover-image" style={{ objectPosition: item.imagePosition }} />
                </span>
                <span className="ft-pillar-title">{item.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
