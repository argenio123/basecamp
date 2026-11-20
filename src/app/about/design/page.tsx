import type { Metadata } from "next";
import { DetailTemplate } from "@/components/nav/PageTemplates";
import CtaBand from "@/components/sections/CtaBand";
import { Plan, Split, Tiles } from "@/components/sections/Layouts";
import PageHero from "@/components/sections/PageHero";
import StatusBadge from "@/components/ui/StatusBadge";
import { getSiteContent } from "@/content/get";
import { ABOUT_CTA, ABOUT_GLANCE, DESIGN, DESIGN_HERO, FLOOR_PLAN, PERFORMANCE_NATURE } from "@/data/about";

export const metadata: Metadata = {
  title: "Design & Place",
  description: "How BaseCamp CamSur is designed: modern tropical architecture, a ground floor laid out zone by zone, and an outdoor training lab.",
};

// Three sections, three looks: how it's built (photo + design chips) → the ground-floor plan (top view with numbered
// zones) → designed for outdoors (dark tiles) → CTA. Anchors kept for older links: #design, #place (the plan),
// #performance-nature.
export default async function AboutDesignPage() {
  const c = await getSiteContent();

  return (
    <DetailTemplate
      path="/about/design"
      hero={<PageHero title={DESIGN_HERO.title} intro={DESIGN_HERO.intro} image={DESIGN_HERO.image} imageAlt={DESIGN_HERO.imageAlt} />}
      glance={{ summary: ABOUT_GLANCE.design, statement: true }}
      cta={<CtaBand title={ABOUT_CTA.title} body={ABOUT_CTA.body} label={c.settings.founding.enabled ? c.settings.founding.ctaLabel || undefined : undefined} href="/contact" />}
    >
      <Split id="design" eyebrow={DESIGN.eyebrow} title={DESIGN.title} body={DESIGN.body} chips={DESIGN.pillars}
        image={DESIGN.image} imageAlt={DESIGN.imageAlt} />

      <Plan id="place" {...FLOOR_PLAN} />

      <Tiles id="performance-nature" eyebrow={PERFORMANCE_NATURE.eyebrow} title={PERFORMANCE_NATURE.title}
        intro={PERFORMANCE_NATURE.sub} items={PERFORMANCE_NATURE.items} badge={<StatusBadge availability="planned" />} />
    </DetailTemplate>
  );
}
