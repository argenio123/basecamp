import Link from "next/link";

export default function CtaBand({
  eyebrow,
  title = "Move with purpose.",
  body = "Join the founding list for founding-member rates, exclusive updates and priority access.",
  label = "Get early access",
  href = "/contact",
}: { eyebrow?: string; title?: string; body?: string; label?: string; href?: string }) {
  return (
    <section className="cta-band">
      <div className="shell cta-band-inner">
        <div>{eyebrow && <p className="eyebrow eyebrow-light">{eyebrow}</p>}<h2>{title}</h2><p>{body}</p></div>
        <Link href={href} className="button button-light">{label} <span>↗</span></Link>
      </div>
    </section>
  );
}
