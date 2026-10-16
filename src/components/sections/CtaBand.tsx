import Link from "next/link";

export default function CtaBand({
  eyebrow,
  title = "Move with purpose.",
  body = "Register your interest for opening updates, previews, and membership information.",
  label = "Join early access",
  href = "/contact",
  revealOnScroll = false,
}: { eyebrow?: string; title?: string; body?: string; label?: string; href?: string; revealOnScroll?: boolean }) {
  return (
    <section className="cta-band">
      <div className="shell cta-band-inner" data-home-reveal={revealOnScroll ? "" : undefined}>
        <div>{eyebrow && <p className="eyebrow eyebrow-light">{eyebrow}</p>}<h2>{title}</h2><p>{body}</p></div>
        <Link href={href} className="button button-light">{label} <span>↗</span></Link>
      </div>
    </section>
  );
}
