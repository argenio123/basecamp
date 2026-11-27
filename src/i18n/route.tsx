// Locale route wrapper (design: src/i18n/README.md). Server-only.
//
// A Filipino route file reuses the English page module instead of copying it:
//
//   // src/app/fil/membership/page.tsx
//   import * as en from "@/app/membership/page";
//   import { localizedRoute } from "@/i18n/route";
//   const route = localizedRoute("fil", "/membership", en);
//   export default route.Page;
//   export const generateMetadata = route.generateMetadata;
//
// Page sets the request locale, then renders the English page component with the same props (params/searchParams),
// so the page, getSiteContent(), getData(), t() and every Server Component below it render in Filipino while the
// route stays statically prerendered (no cookies/headers). Metadata: the English metadata in this locale (static
// title/description strings translated through fil/phrases.ts, generateMetadata re-run under the locale), plus a
// self-canonical and hreflang alternates.
import type { Metadata, ResolvingMetadata } from "next";
import type { ReactNode } from "react";
import { OG_LOCALE, type Locale } from "./config";
import { alternatesFor } from "./paths";
import { setRequestLocale, translate } from "./server";

/* eslint-disable @typescript-eslint/no-explicit-any -- page props differ per route; they are passed through untouched */
type PageComponent = (props: any) => ReactNode | Promise<ReactNode>;
type MetadataFn = (props: any, parent: ResolvingMetadata) => Metadata | Promise<Metadata>;
/** The route's own page props (Next's generated route types check that a page takes only these). */
type RouteProps = { params: Promise<any>; searchParams: Promise<any> };
/* eslint-enable @typescript-eslint/no-explicit-any */

/** What localizedRoute() reads from an English page module (`import * as en from "@/app/…/page"`). */
export type PageModule = { default: PageComponent; metadata?: Metadata; generateMetadata?: MetadataFn };

function translateTitle(title: Metadata["title"], locale: Locale): Metadata["title"] {
  if (typeof title === "string") return translate(title, locale);
  if (title && typeof title === "object" && "absolute" in title && typeof title.absolute === "string") return { ...title, absolute: translate(title.absolute, locale) };
  return title;
}

/** Translates the static title/description strings of English metadata (phrase lookup, English fallback). */
function translateMetadata(meta: Metadata, locale: Locale): Metadata {
  return {
    ...meta,
    title: translateTitle(meta.title, locale),
    ...(typeof meta.description === "string" ? { description: translate(meta.description, locale) } : {}),
  };
}

export function localizedRoute(locale: Locale, path: string, mod: PageModule) {
  const EnglishPage = mod.default;

  // props: the route's own PageProps, passed through to the English page.
  async function Page(props: RouteProps) {
    setRequestLocale(locale);
    return <EnglishPage {...props} />;
  }

  async function generateMetadata(props: RouteProps, parent: ResolvingMetadata): Promise<Metadata> {
    setRequestLocale(locale);
    const base = mod.generateMetadata ? await mod.generateMetadata(props, parent) : (mod.metadata ?? {});
    const meta = translateMetadata(base, locale);
    const parentOg = (await parent).openGraph;
    const title = typeof meta.title === "string" ? meta.title : meta.title && "absolute" in meta.title ? meta.title.absolute : undefined;
    return {
      ...meta,
      alternates: alternatesFor(path, locale),
      // A page's openGraph replaces the layout's (shallow merge): keep the layout's site name and image, set the locale.
      openGraph: {
        type: "website",
        siteName: parentOg?.siteName ?? undefined,
        images: parentOg?.images,
        ...(title ? { title } : {}),
        ...(typeof meta.description === "string" ? { description: meta.description } : {}),
        locale: OG_LOCALE[locale],
      },
    };
  }

  return { Page, generateMetadata };
}
