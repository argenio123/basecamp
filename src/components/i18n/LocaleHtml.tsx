"use client";

import type { ComponentProps } from "react";
import { LOCALE_TAG } from "@/i18n/config";
import { useLocale } from "@/i18n/client";

/**
 * The root <html> element with lang="en" | "fil" from the URL. A Client Component so the root layout (which has no
 * route params) stays shared by both locales: usePathname() is known while prerendering every route, so the static
 * HTML of /fil/* already says lang="fil", and client navigation across locales updates it.
 */
export default function LocaleHtml({ children, ...props }: ComponentProps<"html">) {
  const locale = useLocale();
  return <html {...props} lang={LOCALE_TAG[locale]}>{children}</html>;
}
