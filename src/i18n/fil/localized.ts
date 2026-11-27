// Type helper for the Filipino copies of `as const` / inferred exports in src/data.
// `Localized<typeof EN_EXPORT>` keeps the exact shape (same keys, same tuple lengths, same readonly-ness) but widens
// string literals to `string`, so translated text type-checks. Keys that carry ids, links, images or enum values
// keep their original literal types, so tsc still proves those fields are unchanged in kind.

type KeepKey = "id" | "slug" | "href" | "kind" | "theme" | "availability" | "image" | "src" | "anchor" | "programmeSlug" | "filters" | "slugs" | "typeOrder";

export type Localized<T> = T extends string
  ? string
  : T extends number | boolean | null | undefined
    ? T
    : T extends (...args: never[]) => unknown
      ? T
      : { [K in keyof T]: K extends KeepKey ? T[K] : Localized<T[K]> };
