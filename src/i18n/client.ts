// Locale in Client Components (hooks: call them from "use client" components only). The locale is part of the URL ("/fil/…"), so it is read from usePathname(): every
// route here is static or has generateStaticParams, so the pathname is known while prerendering and no Suspense
// boundary is needed (01-app/03-api-reference/04-functions/use-pathname.md, "cacheComponents").
import { usePathname } from "next/navigation";
import type { Locale } from "./config";
import { stripLocale } from "./paths";
import { UI, type UiDict } from "./ui";

/** The current locale ("en" | "fil"). */
export function useLocale(): Locale {
  return stripLocale(usePathname() || "/").locale;
}

/** The pathname without the locale prefix ("/fil/visit" → "/visit"): compare this with site-map paths. */
export function useBasePath(): string {
  return stripLocale(usePathname() || "/").path;
}

/** Shared interface strings for the current locale (src/i18n/ui.ts). */
export function useUi(): UiDict {
  return UI[useLocale()];
}
