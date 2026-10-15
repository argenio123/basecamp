import Image from "next/image";
import ScrollTopLink from "@/components/ui/ScrollTopLink";

const navigation = [
  ["Programs", "/programs"],
  ["Facilities", "/facilities"],
  ["Membership", "/membership"],
  ["Schedule", "/schedule"],
  ["Visit", "/visit"],
  ["About", "/about"],
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main shell">
        <div className="footer-brand">
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
          <p className="footer-intro">A new home for movement, performance, recovery, and community in Camarines Sur.</p>
          <address className="footer-brand-details">
            <span className="footer-address">Capitol Complex, Pili, 4418<br />Camarines Sur</span>
            <span className="footer-contact-row"><span>Booking line</span><a href="tel:+639189051234">0918-905-1234</a></span>
            <span className="footer-contact-row"><span>Email</span><a href="mailto:basecampcamsur@gmail.com">basecampcamsur@gmail.com</a></span>
          </address>
        </div>
        <nav className="footer-nav" aria-label="Footer navigation">
          <p className="footer-label">Navigation</p>
          <div className="footer-nav-links">
            {navigation.map(([label, href]) => <ScrollTopLink key={href} href={href}>{label}</ScrollTopLink>)}
          </div>
        </nav>
        <div className="footer-action">
          <p className="footer-label">Opening updates</p>
          <p>Be first to hear about memberships, previews, and opening details.</p>
          <ScrollTopLink href="/contact" className="text-link light">Register your interest <span>↗</span></ScrollTopLink>
        </div>
      </div>
      <div className="footer-bottom shell"><span>© 2026 Basecamp CamSur</span><span>Capitol Complex, Pili, Camarines Sur</span></div>
    </footer>
  );
}
