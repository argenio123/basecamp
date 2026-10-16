import Image from "next/image";
import ScrollTopLink from "@/components/ui/ScrollTopLink";
import SocialIcon, { type SocialPlatform } from "@/components/ui/SocialIcon";

const navigationGroups = [
  {
    label: "Train",
    links: [
      ["Programs", "/programs"],
      ["Schedule", "/schedule"],
      ["Membership", "/membership"],
    ],
  },
  {
    label: "Explore",
    links: [
      ["Facilities", "/facilities"],
      ["About", "/about"],
    ],
  },
  {
    label: "Visit",
    links: [
      ["Plan your visit", "/visit"],
      ["Contact", "/contact"],
    ],
  },
];

const socialChannels: Array<{ label: SocialPlatform; href: string }> = [
  { label: "Instagram", href: "https://www.instagram.com/basecampcamsur/" },
  { label: "Facebook", href: "https://www.facebook.com/basecampcamsur" },
  { label: "X", href: "https://x.com/basecampcamsur" },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main shell">
        <div className="footer-brand-mark">
          <ScrollTopLink href="/" className="footer-brand-link" aria-label="Basecamp CamSur home">
            <Image
              src="/images/brand/basecamp-white-logo.png"
              alt=""
              width={1118}
              height={982}
              sizes="150px"
              className="footer-brand-logo"
            />
          </ScrollTopLink>
        </div>
        <nav className="footer-nav" aria-label="Footer navigation">
          {navigationGroups.map(({ label, links }) => (
            <div className="footer-nav-group" key={label}>
              <p className="footer-label">{label}</p>
              <div className="footer-nav-links">
                {links.map(([linkLabel, href]) => (
                  <ScrollTopLink key={href} href={href}>{linkLabel}</ScrollTopLink>
                ))}
              </div>
            </div>
          ))}
        </nav>
        <div className="footer-brand-copy">
          <p className="footer-intro">A new home for movement, performance, recovery, and community in Camarines Sur.</p>
          <address className="footer-brand-details">
            <span className="footer-address">Capitol Complex, Pili, 4418<br />Camarines Sur</span>
            <span className="footer-contact-row"><span>Booking line</span><a href="tel:+639189051234">0918-905-1234</a></span>
            <span className="footer-contact-row"><span>Email</span><a href="mailto:basecampcamsur@gmail.com">basecampcamsur@gmail.com</a></span>
          </address>
        </div>
        <div className="footer-socials">
          <p className="footer-label">Follow us</p>
          <div className="footer-social-links">
            {socialChannels.map(({ label, href }) => (
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                className="footer-social-link"
                aria-label={label}
                key={label}
              >
                <SocialIcon platform={label} />
              </a>
            ))}
          </div>
        </div>
        <form className="footer-newsletter" action="/contact" method="get">
          <label className="footer-label" htmlFor="footer-email">Stay in the loop</label>
          <div className="footer-newsletter-row">
            <input id="footer-email" name="email" type="email" placeholder="Email address" autoComplete="email" required />
            <button type="submit">Join updates</button>
          </div>
          <label className="footer-consent">
            <input type="checkbox" required />
            <span>I agree to receive Basecamp CamSur news and opening updates.</span>
          </label>
        </form>
      </div>
      <div className="footer-bottom shell"><span>© 2026 Basecamp CamSur</span></div>
    </footer>
  );
}
