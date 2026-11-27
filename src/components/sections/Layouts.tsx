import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { ImageLabel, imageKind, labelledImageAlt } from "@/components/ui/AiImageLabel";

// Short page sections in five different looks (styles: the "lx-" block at the end of src/styles/features.css), so a
// page can use 3-4 sections without repeating the same list rows: photo + text (Split), big-word strip (Stats),
// photo cards (Cards), dark tiles (Tiles), and an annotated floor plan (Plan). Server-safe. Headings reuse the
// site's .sd-tt-head style.

type Tone = "light" | "band" | "dark";
type Cta = { href: string; label: string };

const tone = (t: Tone) => (t === "dark" ? " sd-ev-dark" : t === "band" ? " sd-ev-band" : "");
const pad = (n: number) => String(n + 1).padStart(2, "0");
const cols = (n: number) => ({ "--n": Math.min(n, 4) }) as CSSProperties;

function Head({ eyebrow, title, intro, dark }: { eyebrow: string; title: string; intro?: string; dark: boolean }) {
  return (
    <div className={`sd-tt-head${dark ? "" : " sd-tt-head-light"}`} data-reveal>
      <div><p className="sd-tt-eyebrow">{eyebrow}</p><h2>{title}</h2></div>
      {intro && <p>{intro}</p>}
    </div>
  );
}

/** Photo on one side, short copy (eyebrow, title, one line, chips, button) on the other. */
export function Split({ id, look = "light", eyebrow, title, body, chips, badge, cta, image, imageAlt, reverse = false }: {
  id?: string; look?: Tone; eyebrow: string; title: string; body?: string; chips?: string[]; badge?: ReactNode;
  cta?: Cta; image: string; imageAlt: string; reverse?: boolean;
}) {
  return (
    <section id={id} className={`section sd-ev lx-split-section${tone(look)}`}>
      <div className={`shell lx-split${reverse ? " lx-split--reverse" : ""}`}>
        <div className="lx-split-media" data-reveal><Image src={image} alt={imageAlt} fill sizes="(max-width: 900px) 100vw, 50vw" className="cover-image" /></div>
        <div className="lx-split-copy" data-reveal data-reveal-delay="short">
          <p className="sd-tt-eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
          {badge}
          {body && <p className="lx-split-body">{body}</p>}
          {chips && chips.length > 0 && <ul className="lx-chips">{chips.map((c) => <li key={c}>{c}</li>)}</ul>}
          {cta && <Link href={cta.href} className="lx-button">{cta.label}<span aria-hidden="true">→</span></Link>}
        </div>
      </div>
    </section>
  );
}

/** A strip of 3-4 big values (a number or a short word) with a one-line label each. */
export function Stats({ id, look = "dark", eyebrow, title, intro, items }: {
  id?: string; look?: Tone; eyebrow: string; title: string; intro?: string; items: { value: string; label: string }[];
}) {
  return (
    <section id={id} className={`section sd-ev${tone(look)}`}>
      <div className="shell">
        <Head eyebrow={eyebrow} title={title} intro={intro} dark={look === "dark"} />
        <ol className="lx-stats" data-reveal="stagger" style={cols(items.length)}>
          {items.map((item) => <li key={item.label}><strong>{item.value}</strong><span>{item.label}</span></li>)}
        </ol>
      </div>
    </section>
  );
}

/** 3-4 photo cards: picture on top, a title and one line under it; optional tag and link. */
export function Cards({ id, look = "light", eyebrow, title, intro, items }: {
  id?: string; look?: Tone; eyebrow: string; title: string; intro?: string;
  items: { title: string; body: string; image: string; imageAlt: string; tag?: string; href?: string }[];
}) {
  return (
    <section id={id} className={`section sd-ev${tone(look)}`}>
      <div className="shell">
        <Head eyebrow={eyebrow} title={title} intro={intro} dark={look === "dark"} />
        <ul className="lx-cards" data-reveal="stagger" style={cols(items.length)}>
          {items.map((item) => {
            const inner = (
              <>
                <span className="lx-card-media"><Image src={item.image} alt={item.imageAlt} fill sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 25vw" className="cover-image" /></span>
                <span className="lx-card-copy">
                  {item.tag && <small>{item.tag}</small>}
                  <strong>{item.title}</strong>
                  <span>{item.body}</span>
                </span>
              </>
            );
            return <li key={item.title}>{item.href ? <Link href={item.href}>{inner}</Link> : <div>{inner}</div>}</li>;
          })}
        </ul>
      </div>
    </section>
  );
}

/** Numbered tiles on a dark board (short title + one line each). */
export function Tiles({ id, eyebrow, title, intro, items, badge }: {
  id?: string; eyebrow: string; title: string; intro?: string; items: { title: string; body: string }[]; badge?: ReactNode;
}) {
  return (
    <section id={id} className="section sd-ev sd-ev-dark">
      <div className="shell">
        <Head eyebrow={eyebrow} title={title} intro={intro} dark />
        <div className="sd-ev-board">
          <ol className="sd-ev-tiles lx-tiles" data-reveal="stagger" style={cols(items.length)}>
            {items.map((item, n) => (
              <li key={item.title}>
                <span className="sd-ev-num">{pad(n)}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
                {badge}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/** A plan image with numbered hotspots that reveal the zone details on hover or focus. */
export function Plan({ id, look = "band", eyebrow, title, intro, image, imageAlt, width, height, zones }: {
  id?: string; look?: Tone; eyebrow: string; title: string; intro?: string; image: string; imageAlt: string;
  width: number; height: number; zones: { label: string; description: string; x: number; y: number }[];
}) {
  return (
    <section id={id} className={`section sd-ev${tone(look)}`}>
      <div className="shell">
        <Head eyebrow={eyebrow} title={title} intro={intro} dark={look === "dark"} />
        <div className="lx-plan">
          <figure className="lx-plan-map" data-reveal style={{ aspectRatio: `${width} / ${height}` }}>
            <Image src={image} alt={labelledImageAlt(imageAlt, imageKind(image))} fill sizes="(max-width: 1000px) 100vw, 70vw" className="cover-image" />
            <ImageLabel src={image} className="ai-label--corner" hidden={!!imageAlt.trim()} />
            <ol className="lx-plan-labels" aria-label="Floor plan zones">
              {zones.map((z, n) => (
                <li
                  key={z.label}
                  className="lx-plan-pin"
                  data-align={z.x > 72 ? "end" : "start"}
                  style={{ left: `${z.x}%`, top: `${z.y}%` }}
                >
                  <button type="button" aria-label={`${n + 1}. ${z.label}. ${z.description}`}>
                    <span>{n + 1}</span>
                    <span className="lx-plan-pin-copy">
                      <strong>{z.label}</strong>
                      <small>{z.description}</small>
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </figure>
          <ol className="lx-plan-device-legend" aria-label="Floor plan zone details">
            {zones.map((z, n) => (
              <li key={z.label}>
                <span>{n + 1}</span>
                <div><strong>{z.label}</strong><p>{z.description}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
