# Languages: English + Filipino

The site is in English and Filipino (approved by the provincial Governor for local members and Philippine tourism).
This folder holds the whole mechanism. Based on the Next 16.4.6 docs in `node_modules/next/dist/docs/01-app/`:
`02-guides/internationalization.md`, `03-api-reference/04-functions/next-root-params.md`, `01-directives/use-cache.md`
("React.cache isolation"), `04-functions/use-pathname.md` ("cacheComponents"), `04-functions/generate-metadata.md`
(`alternates`), and `03-file-conventions/01-metadata/sitemap.md` (`alternates.languages`).

## URL scheme

| Locale | URL | Example |
|---|---|---|
| English (default) | unchanged, no prefix | `/membership#tiers` |
| Filipino | `/fil` + the English path | `/fil/membership#tiers` |

- The URL is the only source of the locale. There is no cookie, no `Accept-Language` redirect and no proxy rewrite, so
  every page stays statically prerendered and crawlers see both languages at stable URLs. The visitor switches
  language with the **EN | FIL** switcher (`components/i18n/LanguageSwitcher.tsx`). It sits in the header (compact: only
  the other language), in the mobile menu and in the footer.
- `paths.ts` `LOCALIZED_PATHS` lists the English paths that have a Filipino page. Links, the switcher, hreflang and the
  sitemap point at `/fil/…` only for those paths. Every other link goes to the English page (English fallback for
  whole pages). On a page with no translation, the switcher's FIL option goes to `/fil`.

## Why not `app/[lang]`, root params or a proxy rewrite

- **`app/[lang]/…`** (the guide's pattern, with `next/root-params`) would move every route file under `[lang]`. Other
  branches (pricing, hero, booking, founding counter, privacy) are editing those files, so moving them makes every merge
  a rename conflict. It would also change English URLs, or need a proxy rewrite of every request.
- **A proxy rewrite of `/fil/x` to `/x`** serves the English prerender. The page cannot know it should be Filipino
  without reading headers or cookies, which would make it dynamic. `usePathname` also mismatches across rewrites
  (use-pathname.md).
- **Chosen: a `/fil` route tree that reuses the English page modules.** Each Filipino route is a 6-line file. It
  imports the English page module and renders it in Filipino. English route files do not move. The only per-page
  change to an English page is wrapping its text in `t()`, `getData()` and `localHref()`, done one line at a time.

## How a page gets its locale (and stays static)

```tsx
// src/app/fil/membership/page.tsx
import * as en from "@/app/membership/page";
import { localizedRoute } from "@/i18n/route";
const route = localizedRoute("fil", "/membership", en);
export default route.Page;
export const generateMetadata = route.generateMetadata;
```

`route.Page` calls `setRequestLocale("fil")` and then renders the English page with the same props. `server.ts` keeps
the locale in a `React.cache()` store, and that store is scoped to one server render. The English page and every Server
Component below it read the locale with `getLocale()`, `t()`, `getData()` and `getSiteContent()`, without props and
without dynamic APIs. Nothing sets the locale on English routes, so they read `"en"`. The build output lists `/fil`,
`/fil/membership`, `/fil/visit` and `/fil/contact` as `○ (Static)`.

The rules that keep this correct:

1. **`'use cache'` scopes cannot see React.cache.** Pass the locale in as an argument, as `getSiteContent(locale)` does:
   it resolves the request locale outside its cached inner function.
2. **The root layout renders beside the page, not below it.** Layout code never relies on the request locale:
   - It calls `getSiteContent("en")` explicitly. JsonLd does the same.
   - It renders the server Footer once per locale (`<Footer locale>`), and `FooterGate` shows the one for the URL. The
     other footer exists only in the RSC payload of the shared layout, which is a few KB.
   - Client parts (Header, MegaMenu, MobileNav, SkipLink, `<html lang>`) read the locale from the URL.
3. **Client Components** use `useLocale()`, `useUi()` and `useBasePath()` from `client.ts`. These read `usePathname()`,
   which is known while prerendering every route here, so no Suspense is needed.
4. **`<html lang>`** comes from `components/i18n/LocaleHtml.tsx`, a Client Component that renders `<html>` with the lang
   for the current URL. The static HTML of `/fil/*` already has `lang="fil"`.
5. **Path checks** that compare the pathname with site-map paths use `basePath()` / `useBasePath()`, so that
   `/fil/visit` behaves like `/visit`. This covers `data-route`/`data-section` (`RouteScope` and the boot script),
   header overlay, hero replay and offer tracking.

## Where each kind of text lives

| Text | English source | Filipino source | API |
|---|---|---|---|
| Editable content (admin) | `content/defaults.ts` + admin edits | `fil/content.ts` (`filContent`, deep-partial `SiteContent`) | `getSiteContent()` |
| Static copy in `src/data/*.ts` | `src/data/<name>.ts` | `fil/data/<name>.ts` (same export names, any subset) | `getData("<name>")` |
| Shared interface text (nav, buttons, footer, forms, privacy note, 404) | `ui.ts` `en` | `ui.ts` `fil` | `getUi()` server, `useUi()` client |
| Site-map labels and summaries (menus, footer, cards) | `content/sitemap.ts` (unchanged) | `ui.ts` `fil.pages` / `sections` / `highlights` | `localizeSections()`, `localizePage()`, `localizeLink()` (`sitemap.ts`) |
| Copy written inline in pages and Server Components | the page itself | `fil/phrases.ts` (English text → Filipino) | `t("…")`, `t("Opening {date}", { date })` |
| Internal links | the page itself | — | `localHref("/x")` server, `localizedHref(href, locale)` anywhere |

### `getSiteContent(locale)`: Filipino over English, English as fallback

`getSiteContent(locale = getLocale())` reads the stored admin edits and merges them over the defaults, exactly as
before. For `"fil"` it then overlays `filContent` with `localizeValue()` from `merge.ts` and rewrites internal `href`s to
`/fil` pages. All of this happens in one `'use cache'` function that takes the locale as a key and is tagged
`site-content`. Admin saves therefore refresh both languages, and there is no nested cache scope.

Overlay rules:

- The English value sets the shape. Only keys that exist in English are read from the translation.
- Only text is taken from the translation: string leaves, and only non-empty strings. Numbers, booleans, functions and
  the `FIXED_KEYS` always come from English or the admin. `FIXED_KEYS` covers ids, slugs, hrefs, images, video, emails,
  phone numbers, availability and similar fields.
- Arrays of objects match by `id`, then by `slug`, then by index for items that have neither. Arrays of strings match
  by index.
- An English item with no translation stays English. A translated item with no English match is dropped.

So admin changes to prices, images, links and on/off switches show in both languages at once. If an admin rewrites
English text that has a translation, the old Filipino text keeps showing until a translator updates it (see Risks).

### `getData(name)` for `src/data/*`

`data.ts` registers every `src/data/*.ts` module next to `fil/data/<name>.ts`. `getData("visit")` returns the English
module overlaid with the Filipino one, using the same rules as content. The result is memoised per module and locale.
Pages keep importing types and functions from `@/data/…`, and read the strings inside the component body:

```tsx
const { VISIT_HERO, GETTING_THERE } = getData("visit");
```

Client Components cannot call `getData` (it is server-only). Their data strings must arrive as props from a Server
Component.

### `t()` and `fil/phrases.ts`

Inline page copy stays readable in English in the page file: `t("Choose your tier.")`. The English text is the
dictionary key, so:

- a phrase with no translation shows in English;
- a phrase whose English was later edited on another branch falls back to English instead of showing stale Filipino;
- a `t()` wrap is a one-line change that merges cleanly next to other branches' edits.

Call `t()` inside the component or `generateMetadata`, never at module level: module scope has no request locale.
For a static `export const metadata`, `localizedRoute` translates `title` and `description` by phrase lookup, so
static metadata needs no change apart from `alternates`.

## hreflang, canonical, Open Graph, sitemap

- **English pages** that have a Filipino version add `alternates: alternatesFor("/path")` to their metadata.
  **Filipino routes** get this from `localizedRoute`.
- The result is a self-referencing canonical plus `hreflang="en"`, `"fil"` and `"x-default"`, where `x-default` points
  at English. Relative URLs resolve against the root layout's `metadataBase`.
- Filipino routes also set `openGraph.locale = "fil_PH"`, keeping the layout's site name and image.
- `app/sitemap.ts` lists the `/fil` URL next to every localized English URL. Both entries carry
  `alternates.languages`, which Next renders as `<xhtml:link rel="alternate" hreflang>`.
- `fil` is the registered BCP 47 / ISO 639-2 tag for Filipino, and it is what `<html lang>` uses. Google's hreflang
  documentation asks for ISO 639-1 codes, and Filipino has none (`tl` is Tagalog). Check how Search Console reports the
  `fil` annotations after launch. If it rejects them, change only `LOCALE_TAG.fil` in `config.ts`.

## 404

The single prerendered `not-found` serves every unknown URL, including `/fil/…`. It is bilingual (English and Filipino
lines, links to `/` and `/fil`) rather than guessing the locale.

## Not localized (by design)

- `/admin`, `/login` and the member account and checkout (`/account`, `/pay`) stay English.
- Server Actions cannot read the request locale. Lead forms send a hidden `locale` field (`useLocale()`), and
  `lib/leads/validate.ts` picks its messages (`ui.ts` `leads`) by it; a form without the field gets English.

## Risks and limits

- **Stale translations.** When an admin edits English content that has a translation, Filipino keeps the old wording.
  A later step can store a hash of the English source next to each translation and fall back on mismatch.
- **Request locale ordering.** Only code rendered below a `/fil` page, or inside `generateMetadata`, sees `"fil"`. Code
  in the layout, `'use cache'` functions or module scope must take the locale as an argument.
- **Content agent contract.** `fil/content.ts` must export `filContent` and `DeepPartial`. Each `fil/data/<name>.ts`
  must use the English export names. Extra exports and keys are ignored, and type differences only fail where
  `data.ts` casts them.
