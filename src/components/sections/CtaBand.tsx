import Image from "next/image";
import Link from "next/link";

/**
 * Closing call to action (ritebali.com "Start Your Journey"): full-width photo with a dark wash, centered heading
 * and one rounded signal-lime button. Same props as before, so every page keeps its own wording.
 */
export default function CtaBand({
  eyebrow,
  title = "Move with purpose.",
  body = "Join the early access list for early-member rates, exclusive updates and priority access.",
  label = "Get early access",
  href = "/contact",
  image = "/images/facilities/facility-background-a1-5-b.jpg",
  className,
}: { eyebrow?: string; title?: string; body?: string; label?: string; href?: string; image?: string; className?: string }) {
  return (
    <section className={`cta-band ft-cta${className ? ` ${className}` : ""}`}>
      <Image src={image} alt="" fill sizes="100vw" className="cover-image ft-cta-image" />
      <div className="ft-cta-shade" aria-hidden="true" />
      <div className="shell ft-cta-inner" data-reveal>
        {eyebrow && <p className="eyebrow eyebrow-light">{eyebrow}</p>}
        <h2>{title}</h2>
        {body && <p>{body}</p>}
        <Link href={href} className="button button-light ft-pill">{label} <span aria-hidden="true">↗</span></Link>
      </div>
    </section>
  );
}
