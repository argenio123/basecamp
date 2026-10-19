import type { ComponentProps, ReactNode } from "react";
import AtAGlance from "@/components/ui/AtAGlance";
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
  /** Usually <CtaBand …/>. */
  cta?: ReactNode;
  /** Highlights: the overview's own sections. */
  children?: ReactNode;
};

/**
 * Overview page order: hero → at a glance → sub-page cards → highlights → CTA (no previous/next on overviews).
 * Legacy #anchors are forwarded by the site-wide <HashForwarder /> in the root layout.
 */
export function OverviewTemplate({ path, hero, glance, cards = {}, cta, children }: OverviewTemplateProps) {
  return (
    <>
      {hero}
      <AtAGlance {...glance} />
      {cards !== false && <SubpageCards section={path} title="Explore" {...cards} />}
      {children}
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
      <AtAGlance {...glance} />
      {children}
      <RelatedLinks current={path} hrefs={related} title={relatedTitle} />
      {afterRelated}
      {cta}
      <PrevNext current={path} />
    </>
  );
}
