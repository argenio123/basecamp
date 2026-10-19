import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import CopyrightYear from "@/components/layout/CopyrightYear";
import FooterSignup from "@/components/layout/FooterSignup";
import ScrollTopLink from "@/components/ui/ScrollTopLink";
import SocialIcon from "@/components/ui/SocialIcon";
import { getSiteContent } from "@/content/get";
import { CONTACT_PAGE, getSections } from "@/content/sitemap";
import { directionsUrl, PLAYGROUND, TAGLINE } from "@/data/brand";

// Hash links use plain Link so the browser lands on the anchor (ScrollTopLink forces scroll to top).
function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  return href.includes("#") ? <Link href={href}>{children}</Link> : <ScrollTopLink href={href}>{children}</ScrollTopLink>;
}

export default async function Footer() {
  const { settings, programmes } = await getSiteContent();
  const { contact } = settings;
  const socials = settings.socials.filter((s) => s.url);
  const navigationGroups = getSections(programmes.featured).map((section) => ({
    label: section.label,
    href: section.href,
    // Sub-pages only; the section overviews stay reachable from the header. Contact sits under About.
    links: [...section.pages.map((pg) => [pg.label, pg.href]), ...(section.id === "about" ? [[CONTACT_PAGE.label, CONTACT_PAGE.href]] : [])],
  }));

  return (
    <footer className="site-footer">
      <div className="footer-primary shell">
        <div className="footer-brand">
          <div className="footer-brand-mark">
            <ScrollTopLink href="/" className="footer-brand-link" aria-label="BaseCamp CamSur home">
              <Image
                src="/images/brand/basecamp-white-logo.png"
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
              {contact.phoneDisplay && <div className="footer-contact-row"><dt>Booking line</dt><dd><a href={`tel:${contact.phoneE164}`}>{contact.phoneDisplay}</a></dd></div>}
              {contact.email && <div className="footer-contact-row"><dt>Email</dt><dd><a href={`mailto:${contact.email}`}>{contact.email}</a></dd></div>}
              {contact.hours && <div className="footer-contact-row"><dt>Hours</dt><dd className="ui-footer-hours">{contact.hours}</dd></div>}
            </dl>
            <a className="ui-footer-directions" href={directionsUrl(contact.mapsQuery)} target="_blank" rel="noreferrer">Get directions <span className="sr-only">(opens in a new tab)</span><span aria-hidden="true">↗</span></a>
          </address>
        </div>
        <nav className="footer-nav footer-nav-desktop footer-nav-inline nv-footer-sitemap" aria-label="Footer navigation">
          {navigationGroups.map(({ label, href, links }) => (
            <div className="footer-nav-group" key={label}>
              {/* The column heading links to the section overview. */}
              <p className="footer-label"><ScrollTopLink href={href} className="footer-label-link">{label}</ScrollTopLink></p>
              <div className="footer-nav-links">
                {links.map(([linkLabel, href]) => (
                  <FooterLink key={href} href={href}>{linkLabel}</FooterLink>
                ))}
              </div>
            </div>
          ))}
        </nav>
        <div className="footer-connect">
          <FooterSignup />
          {socials.length > 0 && (
            <div className="footer-socials">
              <p className="footer-label">Follow us</p>
              <div className="footer-social-links">
                {socials.map(({ platform, url }) => (
                  <a href={url} target="_blank" rel="noreferrer" className="footer-social-link" aria-label={`${platform} (opens in a new tab)`} key={platform}>
                    <SocialIcon platform={platform} />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <nav className="footer-nav footer-nav-mobile nv-footer-sitemap shell" aria-label="Footer navigation">
        {navigationGroups.map(({ label, links }) => (
          <details className="footer-nav-group" key={label}>
            <summary className="footer-label">{label}<span aria-hidden="true" /></summary>
            <div className="footer-nav-links">
              {links.map(([linkLabel, href]) => (
                <FooterLink key={href} href={href}>{linkLabel}</FooterLink>
              ))}
            </div>
          </details>
        ))}
      </nav>
      <div className="footer-bottom shell">
        <span>© <CopyrightYear /> BaseCamp CamSur. All rights reserved.</span>
      </div>
    </footer>
  );
}
