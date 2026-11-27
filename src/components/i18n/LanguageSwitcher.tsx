"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { MouseEvent } from "react";
import { LOCALE_LABELS, LOCALE_SHORT, LOCALE_TAG, LOCALES, type Locale } from "@/i18n/config";
import { useLocale, useUi } from "@/i18n/client";
import { switchLocaleHref } from "@/i18n/paths";
import { fmt } from "@/i18n/ui";
import "@/styles/i18n.css";

/**
 * EN | FIL switcher (header, mobile menu, footer). Each option links to the same page in that language when it has a
 * translation (src/i18n/paths.ts LOCALIZED_PATHS), otherwise to that language's home page. The visitor's choice is
 * the URL itself: no cookie, no automatic redirect, so every page stays static and crawlable. `compact` shows only the
 * other language ("FIL" on English pages, "EN" on Filipino ones) where space is tight.
 */
export default function LanguageSwitcher({ className, tone = "light", compact = false }: { className?: string; tone?: "light" | "dark"; /** Only the other language (the crowded desktop header bar). */ compact?: boolean }) {
  const pathname = usePathname() || "/";
  const current = useLocale();
  const ui = useUi();
  const router = useRouter();

  // Keep the query and #section when the same page exists in the other language.
  const keepPosition = (target: Locale) => (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const href = switchLocaleHref(pathname, target);
    const samePage = href.replace(/^\/fil(?=\/|$)/, "") === pathname.replace(/^\/fil(?=\/|$)/, "");
    if (!samePage || (!window.location.search && !window.location.hash)) return;
    event.preventDefault();
    router.push(`${href}${window.location.search}${window.location.hash}`);
  };

  return (
    <nav className={`lang-switch lang-switch--${tone}${className ? ` ${className}` : ""}`} aria-label={ui.lang.label}>
      {LOCALES.filter((l) => !compact || l !== current).map((l, i) => (
        <span key={l} className="lang-switch-item">
          {i > 0 && <span className="lang-switch-sep" aria-hidden="true">|</span>}
          {l === current
            ? <span className="lang-switch-link" aria-current="true" lang={LOCALE_TAG[l]} title={LOCALE_LABELS[l]}>{LOCALE_SHORT[l]}</span>
            : (
              <Link href={switchLocaleHref(pathname, l)} className="lang-switch-link" hrefLang={LOCALE_TAG[l]} lang={LOCALE_TAG[l]} aria-label={fmt(ui.lang.switchTo, { language: LOCALE_LABELS[l] })} title={LOCALE_LABELS[l]} onClick={keepPosition(l)}>
                {LOCALE_SHORT[l]}
              </Link>
            )}
        </span>
      ))}
    </nav>
  );
}
