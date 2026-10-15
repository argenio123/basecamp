import Link from "next/link";

const explore = [["Programs", "/programs"], ["Facilities", "/facilities"], ["Membership", "/membership"], ["Schedule", "/schedule"]];
const company = [["Visit", "/visit"], ["About", "/about"], ["Contact", "/contact"]];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main shell">
        <div className="footer-brand">
          <Link href="/" className="brand brand-light">
            <span className="brand-mark" aria-hidden="true">B</span>
            <span>BASECAMP <small>CAMSUR</small></span>
          </Link>
          <p>A new home for movement, performance, recovery, and community in Camarines Sur.</p>
        </div>
        <div><p className="footer-label">Explore</p>{explore.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</div>
        <div><p className="footer-label">Basecamp</p>{company.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</div>
        <div className="footer-action">
          <p className="footer-label">Opening updates</p>
          <p>Be first to hear about memberships, previews, and opening details.</p>
          <Link href="/contact" className="text-link light">Register your interest <span>↗</span></Link>
        </div>
      </div>
      <div className="footer-bottom shell"><span>© 2026 Basecamp CamSur</span><span>Camarines Sur, Philippines</span></div>
    </footer>
  );
}
