import Image from "next/image";
import Link from "next/link";
import EarlyAccessLink from "@/components/members/EarlyAccessLink";
import { ImageLabel } from "@/components/ui/AiImageLabel";
import { MEMBERSHIP_PLANS_PATH } from "@/content/constants";
import { localizedHref } from "@/i18n/paths";
import { getLocale, getUi } from "@/i18n/server";

/**
 * Closing call to action (ritebali.com "Start Your Journey"): full-width photo with a dark wash, centered heading
 * and one rounded signal-lime button. Same props as before, so every page keeps its own wording.
 */
export default function CtaBand({
  eyebrow,
  title,
  body,
  label,
  href = MEMBERSHIP_PLANS_PATH,
  image = "/images/facilities/facility-background-a1-5-b.jpg",
  className,
}: { eyebrow?: string; title?: string; body?: string; label?: string; href?: string; image?: string; className?: string }) {
  // Defaults in the page's language (src/i18n/ui.ts cta); passed text is shown as given.
  const ui = getUi();
  title ??= ui.cta.title;
  body ??= ui.cta.body;
  label ??= ui.cta.label;
  return (
    <section className={`cta-band ft-cta${className ? ` ${className}` : ""}`}>
      <Image src={image} alt="" fill sizes="100vw" className="cover-image ft-cta-image" />
      <div className="ft-cta-shade" aria-hidden="true" />
      <ImageLabel src={image} className="ai-label--corner ai-label--inset" />
      <div className="shell ft-cta-inner" data-reveal>
        {eyebrow && <p className="eyebrow eyebrow-light">{eyebrow}</p>}
        <h2>{title}</h2>
        {body && <p>{body}</p>}
        {href === MEMBERSHIP_PLANS_PATH
          ? <EarlyAccessLink href={href} className="button button-light ft-pill">{label}</EarlyAccessLink>
          : <Link href={localizedHref(href, getLocale())} className="button button-light ft-pill">{label}</Link>}
      </div>
    </section>
  );
}
