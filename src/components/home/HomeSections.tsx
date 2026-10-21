import Image from "next/image";
import EarlyAccessForm from "@/components/forms/EarlyAccessForm";
import FoundingCounter from "@/components/ui/FoundingCounter";
import { formatDateLabel } from "@/content/format";
import type { SiteContent } from "@/content/types";

type Props = { c: SiteContent; titleClassName?: string };
type Delay = "short" | "medium" | "long" | "longer";

const COLUMN_DELAYS: readonly Delay[] = ["short", "medium", "long"];

/* Train & recover: training-ground stats → /facilities */
export function TrainAndRecover({ c, titleClassName }: Props) {
  const s = c.home.stats;
  if (!s.enabled) return null;
  const image = s.image;

  return (
    <section id="training-ground" className="section hm-section hm-stats hm-train" data-home-reveal>
      {/* Full width at the image's own aspect ratio (no cropping); fades into the section background below. */}
      {image && <Image src={image} alt="" width={1896} height={853} sizes="100vw" className="hm-train-background" />}
      <div className="hm-stats-shade" aria-hidden="true" />
      <div className="shell hm-stats-inner">
        <div className="hm-stats-copy" data-home-reveal>
          <p className="eyebrow eyebrow-light">Train &amp; recover</p>
          <h2 className={titleClassName}>{s.title}</h2>
          {s.intro && <p className="lead">{s.intro}</p>}
        </div>
        {s.items.length > 0 && (
          <dl className="hm-stats-grid" data-home-reveal data-home-reveal-delay="short">
            {s.items.map((stat) => (
              <div className="hm-stats-tile" key={stat.id}>
                <dt>{stat.label}</dt>
                <dd className="hm-stats-value">{stat.value}</dd>
                {stat.detail && <dd className="hm-stats-detail">{stat.detail}</dd>}
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
}

export function EarlyAccess({ c, titleClassName }: Props) {
  const s = c.home.earlyAccess;
  const founding = c.settings.founding;
  const t = c.home.testimonials;
  const testimonials = t.enabled ? c.people.testimonials : [];
  const reviews = c.settings.contact.googleReviewsUrl;
  return (
    <section id="early-access" className="section hm-section hm-early" data-home-reveal>
      <div className="shell hm-early-grid">
        <div className="hm-early-copy" data-home-reveal>
          {s.eyebrow && <p className="eyebrow eyebrow-light">{s.eyebrow}</p>}
          <h2 className={titleClassName}>{s.title}</h2>
          {s.body && <p className="hm-early-body">{s.body}</p>}
          {s.benefits.length > 0 && <ul className="hm-check-list hm-early-benefits">{s.benefits.map((b, i) => <li key={`${i}-${b}`}>{b}</li>)}</ul>}
          {founding.enabled && (
            <div className="hm-early-founding">
              {founding.title && <p className="hm-early-founding-title">{founding.title}</p>}
              {founding.benefits.length > 0
                ? <ul className="hm-check-list hm-early-founding-list">{founding.benefits.map((b, i) => <li key={`${i}-${b}`}>{b}</li>)}</ul>
                : founding.summary && <p>{founding.summary}</p>}
              <FoundingCounter founding={founding} />
              {founding.expiresOn && <p className="hm-early-expires">Early rates end {formatDateLabel(founding.expiresOn)}</p>}
            </div>
          )}
        </div>
        <div className="form-card hm-early-form" data-home-reveal data-home-reveal-delay="short">
          <EarlyAccessForm source="/" />
        </div>
      </div>
      {testimonials.length > 0 && (
        <div id="testimonials" className="shell hm-early-quotes">
          {t.title && <h3 data-home-reveal>{t.title}</h3>}
          <ul className="hm-quote-grid">
            {testimonials.map((item, index) => (
              <li key={item.id} data-home-reveal data-home-reveal-delay={COLUMN_DELAYS[index % 3]}>
                <figure className="hm-quote">
                  <blockquote><p>{item.quote}</p></blockquote>
                  <figcaption><strong>{item.name}</strong>{item.context && <span>{item.context}</span>}</figcaption>
                </figure>
              </li>
            ))}
          </ul>
          {reviews && <div className="section-link" data-home-reveal><a href={reviews} className="text-link light" target="_blank" rel="noreferrer">Read our Google reviews <span>↗</span></a></div>}
        </div>
      )}
    </section>
  );
}
