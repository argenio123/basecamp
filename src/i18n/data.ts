// Static copy in src/data/* per locale (design: src/i18n/README.md). Server-only (uses the request locale).
//
// Pages keep importing types and functions from "@/data/…" as before; for the *strings* they call
//   const { VISIT_HERO, GETTING_THERE } = getData("visit");
// inside the component body. English is src/data/<name>.ts; Filipino is src/i18n/fil/data/<name>.ts (same export
// names, any subset) overlaid with localizeValue(), so a missing export, item or field shows in English.
import * as enAbout from "@/data/about";
import * as enBrand from "@/data/brand";
import * as enFacilities from "@/data/facilities";
import * as enFeaturedProgrammes from "@/data/featured-programmes";
import * as enFeatures from "@/data/features";
import * as enLegal from "@/data/legal";
import * as enMembershipGains from "@/data/membership-gains";
import * as enProgramsStatic from "@/data/programs-static";
import * as enVisit from "@/data/visit";
import * as enWorkoutDetails from "@/data/workout-details";
import * as enWorkoutTypes from "@/data/workout-types";
import * as filAbout from "./fil/data/about";
import * as filBrand from "./fil/data/brand";
import * as filFacilities from "./fil/data/facilities";
import * as filFeaturedProgrammes from "./fil/data/featured-programmes";
import * as filFeatures from "./fil/data/features";
import * as filLegal from "./fil/data/legal";
import * as filMembershipGains from "./fil/data/membership-gains";
import * as filProgramsStatic from "./fil/data/programs-static";
import * as filVisit from "./fil/data/visit";
import * as filWorkoutDetails from "./fil/data/workout-details";
import * as filWorkoutTypes from "./fil/data/workout-types";
import { DEFAULT_LOCALE, type Locale } from "./config";
import { localizeValue, mapHrefs } from "./merge";
import { localizedHref } from "./paths";
import { getLocale } from "./server";

const pair = <T,>(en: T, fil: unknown) => ({ en, fil: fil as Partial<T> });

/** One entry per src/data/*.ts file (key = file name). */
const DATA = {
  about: pair(enAbout, filAbout),
  brand: pair(enBrand, filBrand),
  facilities: pair(enFacilities, filFacilities),
  "featured-programmes": pair(enFeaturedProgrammes, filFeaturedProgrammes),
  features: pair(enFeatures, filFeatures),
  legal: pair(enLegal, filLegal),
  "membership-gains": pair(enMembershipGains, filMembershipGains),
  "programs-static": pair(enProgramsStatic, filProgramsStatic),
  visit: pair(enVisit, filVisit),
  "workout-details": pair(enWorkoutDetails, filWorkoutDetails),
  "workout-types": pair(enWorkoutTypes, filWorkoutTypes),
};

export type DataName = keyof typeof DATA;
type DataModule<K extends DataName> = (typeof DATA)[K]["en"];

const memo = new Map<string, unknown>();

/**
 * The exports of src/data/<name>.ts in `locale` (default: the request locale). Translated strings come from
 * src/i18n/fil/data/<name>.ts; functions, numbers, ids, links and images always from English. Internal links to
 * localized pages point at the /fil page. Memoised per module and locale (pure data).
 */
export function getData<K extends DataName>(name: K, locale: Locale = getLocale()): DataModule<K> {
  const entry = DATA[name];
  if (locale === DEFAULT_LOCALE) return entry.en;
  const key = `${name}:${locale}`;
  if (!memo.has(key)) {
    const merged = localizeValue({ ...entry.en } as Record<string, unknown>, { ...(entry.fil as object) });
    memo.set(key, mapHrefs(merged, (href) => localizedHref(href, locale)));
  }
  return memo.get(key) as DataModule<K>;
}
