import type { ComponentProps, ReactNode } from "react";
import Marquee from "@/components/features/Marquee";
import QuoteBand from "@/components/features/QuoteBand";
import AtAGlance from "@/components/ui/AtAGlance";
import { SECTION_FEATURES, sectionKeyFor } from "@/data/features";
import Breadcrumbs from "./Breadcrumbs";
import PrevNext from "./PrevNext";
import RelatedLinks from "./RelatedLinks";
import SubpageCards, { type SubpageCardsProps } from "./SubpageCards";

type GlanceProps = ComponentProps<typeof AtAGlance>;

type OverviewTemplateProps = {
  /** The overview path, e.g. "/facilities". */
  path: string;
  /** Usually <PageHero …/>. */
  hero: ReactNode;
  /** At a glance. Stage 4 keeps this factual; pass explicit on-page links only when they add value. */
  glance: GlanceProps;
  /**
   * Sub-page cards. Default: all sub-pages of the section. Pass props to tune them, or `false` and place
   * <SubpageCards section=… /> yourself inside `children` (e.g. Programmes, where cards come last).
   */
  cards?: Omit<SubpageCardsProps, "section"> | false;
  /** Closing quote band before the CTA. Default on; `false` hides it on this overview. */
  quote?: boolean;
  /** Usually <CtaBand …/>. */
  cta?: ReactNode;
  /** Highlights: the overview's own sections. */
  children?: ReactNode;
};

/**
 * Overview page order: hero → at a glance → sub-page cards → highlights → CTA (no previous/next on overviews).
 * Legacy #anchors are forwarded by the site-wide <HashForwarder /> in the root layout.
 */
export function OverviewTemplate({ path, hero, glance, cards = {}, quote = true, cta, children }: OverviewTemplateProps) {
  // Reference features on every overview: ghost word behind "At a glance", scrolling marquee, closing quote.
  const feature = SECTION_FEATURES[sectionKeyFor(path)];
  return (
    <>
      {hero}
      <AtAGlance ghost={feature.ghost} {...glance} />
      <Marquee text={feature.marquee} />
      {cards !== false && <SubpageCards section={path} title="Explore" {...cards} />}
      {children}
      {quote && <QuoteBand quote={feature.quote} />}
      {cta}
    </>
  );
}

type DetailTemplateProps = {
  /** The sub-page path, e.g. "/facilities/recovery" or `/programs/${slug}`. */
  path: string;
  hero: ReactNode;
  /** At a glance summary (and optional fact chips). */
  glance: GlanceProps;
  /** Last breadcrumb label override. */
  crumbLabel?: string;
  /** 2–3 related pages (any public path, #hash allowed). Default: next sibling sub-pages. */
  related?: readonly string[];
  relatedTitle?: string;
  /** Optional programme-specific actions placed after related cards and before the CTA. */
  afterRelated?: ReactNode;
  cta?: ReactNode;
  /** The page's content sections. */
  children?: ReactNode;
};

/** Detail page order: hero → breadcrumbs → at a glance → content → related → CTA → previous/next (right above the footer). */
export function DetailTemplate({ path, hero, glance, crumbLabel, related, relatedTitle, afterRelated, cta, children }: DetailTemplateProps) {
  return (
    <>
      {hero}
      <Breadcrumbs current={path} label={crumbLabel} />
      <AtAGlance ghost={SECTION_FEATURES[sectionKeyFor(path)].ghost} {...glance} />
      {children}
      <Marquee text={SECTION_FEATURES[sectionKeyFor(path)].marquee} tone="stone" />
      <RelatedLinks current={path} hrefs={related} title={relatedTitle} />
      {afterRelated}
      {cta}
      <PrevNext current={path} />
    </>
  );
}
