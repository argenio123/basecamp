// Filipino /classes/styles/[slug] (design: src/i18n/README.md): the English page module rendered in Filipino,
// statically prerendered for every station slug (same generateStaticParams as English).
import type { Metadata, ResolvingMetadata } from "next";
import * as en from "@/app/classes/styles/[slug]/page";
import { WORKOUT_TYPES } from "@/data/workout-types";
import { alternatesFor } from "@/i18n/paths";
import { localizedRoute } from "@/i18n/route";

const route = localizedRoute("fil", "/classes/styles/*", en);
export default route.Page;
export { generateStaticParams } from "@/app/classes/styles/[slug]/page";
// Segment config is read statically, so it is repeated here rather than re-exported (same values as English).
export const ensureStatic = "navigation";
export const instant = false;

// localizedRoute() builds alternates from its fixed path; this route's canonical/hreflang need the real slug.
export async function generateMetadata(props: { params: Promise<{ slug: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }, parent: ResolvingMetadata): Promise<Metadata> {
  const meta = await route.generateMetadata(props, parent);
  const { slug } = await props.params;
  if (!WORKOUT_TYPES.some((item) => item.slug === slug)) return meta;
  return { ...meta, alternates: alternatesFor(`/classes/styles/${slug}`, "fil") };
}
