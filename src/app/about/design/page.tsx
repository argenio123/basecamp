import type { Metadata } from "next";
import { DetailTemplate } from "@/components/nav/PageTemplates";
import CtaBand from "@/components/sections/CtaBand";
import { Plan } from "@/components/sections/Layouts";
import PageHero from "@/components/sections/PageHero";
import { getSiteContent } from "@/content/get";
import { ABOUT_CTA, ABOUT_GLANCE, DESIGN_HERO, FLOOR_PLAN } from "@/data/about";

export const metadata: Metadata = {
  title: "Design & Place",
  description: "How BaseCamp CamSur is designed, with a ground floor laid out zone by zone for training, recovery, and community.",
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
      <Plan id="place" {...FLOOR_PLAN} />
    </DetailTemplate>
  );
}
