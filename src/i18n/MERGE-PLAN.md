# i18n merge plan: localising every remaining page

Phase 1 (branch `step2-i18n-infra`) delivers the infrastructure, the shared shell (header, mega menu, mobile menu,
footer, `<html lang>`, hreflang, sitemap, 404) and four Filipino pages: `/fil`, `/fil/membership`, `/fil/visit` and
`/fil/contact`. This file lists the mechanical steps for everything else. Read `README.md` first.

## 0. Merge the branches

1. Merge `step2-i18n-infra` and the other feature branches (pricing, hero, booking, founding counter, privacy) as usual.
   - In page files, phase 1 only wrapped strings in `t()`, `getData()` and `localHref()`, and added `alternates`. On a
     conflict, keep the other branch's markup and props, then re-wrap any English strings they added or changed.
2. Merge the content branch (`i18n-content`). It replaces these stub files: take **theirs** for each add/add conflict.
   - `src/i18n/fil/content.ts`. It must still export `filContent` and the `DeepPartial` type.
   - `src/i18n/fil/data/*.ts`, all 11 files. A data file they did not write stays a stub, so that module stays English.
   ```sh
   git checkout --theirs src/i18n/fil/content.ts src/i18n/fil/data/ && git add src/i18n/fil
   ```
3. Run `npx tsc --noEmit -p .`. If a `fil/data/<name>.ts` export has a type incompatible with English, `data.ts`
   reports it at its `pair(...)` line. Fix the translation file, not `data.ts`.

## 1. Per page (repeat for each route in the table in §3)

For English page `src/app/<path>/page.tsx`:

1. **Inline copy.** Wrap every visible English string literal in `t("…")`. This covers JSX text, string props such as
   `title=`, `intro=`, `eyebrow=`, `label=` and `imageAlt=`, and `aria-label` values.
   - Template strings become placeholders: `` `Opening ${d}` `` → `t("Opening {date}", { date: d })`.
   - A literal in a module-level constant (an array of cards, for example) is translated where it is used, inside the
     component: `CARDS.map((c) => ({ ...c, title: t(c.title), href: localHref(c.href) }))`.
   - Leave alone: brand names, class or station names, CSS classes, ids, URLs, `metadata.title` when it is a static
     object (`localizedRoute` translates it).
   - Import: `import { localHref, t } from "@/i18n/server";`
2. **Static data.** Replace `import { X, Y } from "@/data/<name>"` (strings only) with
   `const { X, Y } = getData("<name>");` inside the component body. Keep importing types and functions from `@/data/…`.
   - Import: `import { getData } from "@/i18n/data";`
3. **Content.** Leave `getSiteContent()` as is. It already follows the request locale.
4. **Links.** Change `href="/x"` to `href={localHref("/x")}` and `href={item.href}` (from a site-map or data path) to
   `localHref(item.href)`. Content and `getData()` hrefs are already localized.
   - Site-map items (`findPage(...).section.pages`, highlights) go through `localizePage(pg, getLocale())` or
     `localizeLink(h, getLocale())` from `@/i18n/sitemap`.
5. **Metadata.**
   - A static `metadata` object: add `alternates: alternatesFor("/<path>")` (from `@/i18n/paths`).
   - Metadata built from data (`X_META`): turn it into
     `export async function generateMetadata() { return { ...getData("<name>").X_META, alternates: alternatesFor("/<path>") }; }`.
   - Metadata with interpolated English: use `t()` with placeholders, as in `src/app/membership/page.tsx`.
6. **Filipino copy.** Add every new `t()` key to `src/i18n/fil/phrases.ts` under a `// ---------- /<path> ----------`
   comment. A missing key falls back to English, so this can lag behind.
7. **Filipino route.** Create `src/app/fil/<path>/page.tsx`:
   ```tsx
   // Filipino /<path> (design: src/i18n/README.md): the English page module rendered in Filipino, statically prerendered.
   import * as en from "@/app/<path>/page";
   import { localizedRoute } from "@/i18n/route";

   const route = localizedRoute("fil", "/<path>", en);
   export default route.Page;
   export const generateMetadata = route.generateMetadata;
   ```
   For a dynamic route, also re-export its params:
   `export { generateStaticParams } from "@/app/classes/styles/[slug]/page";`
8. **Register the path.** Add it to `LOCALIZED_PATHS` in `src/i18n/paths.ts`, in the same commit as the route file. Use
   `"/classes/styles/*"` for the dynamic route.
   - From this commit on, the switcher, menus, footer, content links, hreflang and the sitemap point at the new
     `/fil` page automatically.
9. **Verify.**
   - `npx next build --webpack` lists `/fil/<path>` as `○` (or `◐` exactly like its English page).
   - `curl /fil/<path>` shows `lang="fil"`, the canonical and hreflang links, and Filipino text.

## 2. Shared components still in English (do once, then every page benefits)

Server Components can call `t()` or `getUi()` directly. Client Components use `useUi()` and need their strings in
`ui.ts`, or need the text passed in as props.

| Component | Kind | Change |
|---|---|---|
| `nav/Breadcrumbs`, `nav/RelatedLinks`, `nav/PrevNext`, `nav/SubpageCards` | server | Map pages through `localizePage(pg, getLocale())`. Breadcrumb JSON-LD `item` URLs use the localized href. "Explore", "Read more", "Previous" and "Next" come from `getUi()`. |
| `features/QuoteBand`, `features/Marquee` | server | Text already comes from `getData("features")` through the templates. Translate the aria-labels. |
| `membership/PriceTable` (`TierCards`, notes), `membership/*` | mixed | Labels such as "Proposed rate", "Buy online" and "Pay deposit online" go to `ui.ts` (client) or `t()` (server). Pay links stay English (`/pay` is not localized). |
| `home/HomeOfferModal`, `SocialGallery`, `ProgramCoverflow`, `home/HomeSections`, `home/DestinationPillars` | client/server | The home page's own copy is done. Move these components' internal strings to `ui.ts` (client) or `t()` (server). |
| `forms/*`, `schedule/BookingRequestForm`, `schedule/Timetable`, `programs/*` | client | Labels and errors from `useUi().form`. Data strings imported from `@/data/*` in client files (`ClassPreview`, `ModalityGrid`, `BookingRequestForm`, `Timetable`, `FindUsMap`, `HomeHeroMedia`) become props passed from the server page via `getData()`. |
| `lib/leads/validate.ts` (Server Action messages) | server action | Add `<input type="hidden" name="locale" value={useLocale()} />` to the forms. Choose messages by that field: request locale is not available in Server Actions. |
| `content/labels.ts` (`AVAILABILITY_LABEL`, `PHASE_COPY`, `AUDIENCE_LABEL`) | shared | Add a `labels` block to `ui.ts` keyed the same way. Callers read `ui.labels.availability[x]`. |
| `ui/AiImageLabel` ("AI-generated image", "Concept render") | client | `useUi()`. |

## 3. Remaining routes (English file → Filipino route file)

| English route | Filipino route to add | Notes |
|---|---|---|
| `/classes` (`app/classes/page.tsx` re-exports `app/programs/page.tsx`) | `app/fil/classes/page.tsx` importing `@/app/programs/page` | Localise `programs/page.tsx` (`PHASE_COPY` → ui labels). |
| `/classes/styles/[slug]` | `app/fil/classes/styles/[slug]/page.tsx` + `generateStaticParams` re-export | `LOCALIZED_PATHS` entry `"/classes/styles/*"`. `workout-types` / `workout-details` via `getData`. |
| `/facilities`, `/facilities/training`, `/facilities/recovery`, `/facilities/lifestyle` | `app/fil/facilities/...` | `data/facilities.ts` via `getData`. `DetailTemplate` already reads `getData("features")`. |
| `/membership/founding`, `/membership/launch-promotions`, `/membership/price-guide` | `app/fil/membership/...` | These import `founding.css` / `membership.css` from the English module, which is fine. Pay links stay English. |
| `/schedule`, `/schedule/timetable`, `/schedule/events`, `/schedule/book` | `app/fil/schedule/...` | `book` reads `?service=` on the client inside Suspense, which works unchanged under `/fil`. |
| `/visit/camps`, `/visit/why-camsur` | `app/fil/visit/...` | `data/visit.ts` `WHY_*` / camps exports via `getData`. |
| `/about`, `/about/design`, `/about/the-build`, `/about/faq` | `app/fil/about/...` | `data/about.ts` via `getData`. |
| `/privacy`, `/terms` | `app/fil/privacy`, `app/fil/terms` (optional) | Legal text: translate only after legal review. Until then the footer links to English. |
| `/account/*`, `/pay/*`, `/login`, `/admin/*` | none | Stay English by design (see README). |

When every public route is done, `LOCALIZED_PATHS` equals `getPublicPaths()` plus legal. At that point you can replace
the list with a derived check.

## 4. Consistency checks (run after the merge)

```sh
# Every /fil route file has a LOCALIZED_PATHS entry and vice versa
find src/app/fil -name page.tsx | sed 's#src/app/fil##; s#/page.tsx##; s#^$#/#'
grep -n "LOCALIZED_PATHS" -A2 src/i18n/paths.ts
# English strings still inline in a localized page (rough): quoted capitalised text outside t(
grep -nE '>[A-Z][a-z][^<{]{3,}<|="[A-Z][a-z][^"]{3,}"' src/app/<path>/page.tsx
# The same phrase key with two different values across fil/phrases.ts + fil/phrases/*.ts (the last spread wins)
node scripts/check-i18n-phrases.mjs
# Phrase keys no longer used anywhere (stale after copy edits)
node -e 'const s=require("fs").readFileSync("src/i18n/fil/phrases.ts","utf8");for(const m of s.matchAll(/^\s+"(.+?)":/gm))console.log(m[1])' | while read -r k; do grep -rqF "t(\"$k\"" src || echo "unused: $k"; done
```
