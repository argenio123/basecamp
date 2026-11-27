import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import CopyrightYear from "@/components/layout/CopyrightYear";
import FooterSignup from "@/components/layout/FooterSignup";
import ScrollTopLink from "@/components/ui/ScrollTopLink";
import SocialIcon from "@/components/ui/SocialIcon";
import { getSiteContent } from "@/content/get";
import LanguageSwitcher from "@/components/i18n/LanguageSwitcher";
import { getSections } from "@/content/sitemap";
import { directionsUrl } from "@/data/brand";
import { PRIVACY_PATH, TERMS_PATH } from "@/data/legal";
import { DEFAULT_LOCALE, type Locale } from "@/i18n/config";
import { getData } from "@/i18n/data";
import { localizedHref } from "@/i18n/paths";
import { getUi } from "@/i18n/server";
import { localizeSections } from "@/i18n/sitemap";
import { fmt } from "@/i18n/ui";
import "@/styles/legal.css";

// Hash links use plain Link so the browser lands on the anchor (ScrollTopLink forces scroll to top).
function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  return href.includes("#") ? <Link href={href}>{children}</Link> : <ScrollTopLink href={href}>{children}</ScrollTopLink>;
}

/** Rendered by the root layout once per locale (FooterGate picks one), so the locale is a prop, not the request locale. */
export default async function Footer({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const { settings, programmes } = await getSiteContent(locale);
  const ui = getUi(locale);
  const { TAGLINE, PLAYGROUND } = getData("brand", locale);
  const { contact } = settings;
  const socials = settings.socials.filter((s) => s.url);
  const navigationGroups = localizeSections(getSections(programmes.featured), locale).map((section) => ({
    label: section.label,
    href: section.href,
    // Keep footer categories identical to the navbar highlights.
    links: section.menu.highlights.map(({ label, href }) => [label, href] as const),
  }));

  return (
    <footer className="site-footer">
      <div className="footer-primary shell">
        <div className="footer-brand">
          <div className="footer-brand-mark">
            <ScrollTopLink href={localizedHref("/", locale)} className="footer-brand-link" aria-label={ui.header.homeLabel}>
              <Image
                src="/images/brand/basecamp-camsur-logo-white.png"
                alt=""
                width={1118}
                height={982}
                sizes="150px"
                className="footer-brand-logo"
              />
            </ScrollTopLink>
            <p className="ui-footer-tagline">{TAGLINE}</p>
            <p className="ui-footer-positioning">{PLAYGROUND}</p>
          </div>
          <address className="footer-brand-details">
            <span className="footer-address">
              {contact.addressLines.map((line, i) => <span key={i}>{i > 0 && <br />}{line}</span>)}
            </span>
            <dl className="footer-contact-list">
              {contact.phoneDisplay && <div className="footer-contact-row"><dt>{ui.footer.bookingLine}</dt><dd><a href={`tel:${contact.phoneE164}`}>{contact.phoneDisplay}</a></dd></div>}
              {contact.email && <div className="footer-contact-row"><dt>{ui.footer.email}</dt><dd><a href={`mailto:${contact.email}`}>{contact.email}</a></dd></div>}
              {contact.hours && <div className="footer-contact-row"><dt>{ui.footer.hours}</dt><dd className="ui-footer-hours">{contact.hours}</dd></div>}
            </dl>
            <a className="ui-footer-directions" href={directionsUrl(contact.mapsQuery)} target="_blank" rel="noreferrer">{ui.common.getDirections} <span className="sr-only">{ui.common.opensNewTab}</span></a>
          </address>
        </div>
        <nav className="footer-nav footer-nav-desktop footer-nav-inline nv-footer-sitemap" aria-label={ui.footer.nav}>
          {navigationGroups.map(({ label, href, links }) => (
            <div className="footer-nav-group" key={label}>
              {/* The column heading links to the section overview. */}
              <p className="footer-label"><ScrollTopLink href={href} className="footer-label-link">{label}</ScrollTopLink></p>
              <div className="footer-nav-links">
                {links.map(([linkLabel, href]) => (
                  <FooterLink key={linkLabel} href={href}>{linkLabel}</FooterLink>
                ))}
              </div>
            </div>
          ))}
        </nav>
        <div className="footer-connect">
          <FooterSignup />
          {socials.length > 0 && (
            <div className="footer-socials">
              <p className="footer-label">{ui.footer.followUs}</p>
              <div className="footer-social-links">
                {socials.map(({ platform, url }) => (
                  <a href={url} target="_blank" rel="noreferrer" className="footer-social-link" aria-label={fmt(ui.footer.socialLink, { platform })} key={platform}>
                    <SocialIcon platform={platform} />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <nav className="footer-nav footer-nav-mobile nv-footer-sitemap shell" aria-label={ui.footer.nav}>
        {navigationGroups.map(({ label, links }) => (
          <details className="footer-nav-group" key={label}>
            <summary className="footer-label">{label}<span aria-hidden="true" /></summary>
            <div className="footer-nav-links">
              {links.map(([linkLabel, href]) => (
                <FooterLink key={linkLabel} href={href}>{linkLabel}</FooterLink>
              ))}
            </div>
          </details>
        ))}
      </nav>
      <div className="footer-bottom shell">
        <span>© <CopyrightYear /> {ui.footer.rights}</span>
        <p className="footer-ai-note">{ui.footer.aiNote}</p>
        <LanguageSwitcher className="footer-lang" />
        <nav className="footer-legal" aria-label={ui.footer.legal}>
          <ScrollTopLink href={localizedHref(PRIVACY_PATH, locale)}>{ui.footer.privacy}</ScrollTopLink>
          <ScrollTopLink href={localizedHref(TERMS_PATH, locale)}>{ui.footer.terms}</ScrollTopLink>
        </nav>
      </div>
    </footer>
  );
}
