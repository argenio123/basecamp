import { type CSSProperties, type ReactNode } from "react";
import { TierCards } from "@/components/membership/PriceTable";
import { getSiteContent } from "@/content/get";
import AuthEyebrow from "./AuthEyebrow";
import AuthSlides from "./AuthSlides";
import ScrollToTop from "./ScrollToTop";
import { signupHref } from "@/lib/members/types";

/** What a member account gets (2 x 2 beside the card). */
const BENEFITS = [
  { title: "Request in a few taps", body: "Classes, appointments, and camp places." },
  { title: "Early-member rates", body: "Lock in membership pricing before opening." },
  { title: "Priority access", body: "First in line for camps and events." },
  { title: "Opening news first", body: "Build updates and launch dates before anyone else." },
];

/**
 * Shared frame of the member log-in / sign-up pages, used as the (auth) route-group layout so it stays mounted when
 * the visitor switches between Log in and Sign up: the rotating gym photos (AuthSlides), the eyebrow, headline,
 * intro and 2 x 2 benefits on the left, the page's card (children) on the right with a help line under it, and the
 * membership plans below. No entrance animations: the page shows at once on load and on a Log in / Sign up switch.
 */
export default async function AuthShell({ children }: { children: ReactNode }) {
  const content = await getSiteContent();
  const tierGroup = content.pricing.groups.find((g) => g.id === "memberships");
  const tiers = (tierGroup?.items ?? []).filter((i) => i.visible && i.price);
  const { phoneDisplay, phoneE164, email } = content.settings.contact;

  return (
    <>
      <section className="mb-auth mb-auth--club">
        <ScrollToTop />
        <AuthSlides />
        <div className="shell mb-auth-grid">
          <div className="mb-auth-brand">
            <AuthEyebrow />
            <h1><span className="mb-auth-title">Train first. Train better.</span></h1>
            <p className="mb-auth-lead">Log in to your member account, or create one in a minute. Members request sessions first, lock in early rates, and hear about opening before anyone else.</p>
            <ul className="mb-auth-benefits">
              {BENEFITS.map((b, i) => (
                <li key={b.title} style={{ "--i": i } as CSSProperties}>
                  <span className="mb-auth-tick" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m6 12 4 4 8-9" /></svg></span>
                  <strong>{b.title}</strong>
                  <small>{b.body}</small>
                </li>
              ))}
            </ul>
          </div>
          <div className="mb-auth-side">
            {children}
            {(phoneDisplay || email) && (
              <p className="mb-auth-help">
                Need help with your account?{" "}
                {phoneDisplay && <>Call <a href={`tel:${phoneE164 || phoneDisplay}`}>{phoneDisplay}</a></>}
                {phoneDisplay && email && " or email "}
                {email && <a href={`mailto:${email}`}>{email}</a>}.
              </p>
            )}
          </div>
        </div>
      </section>

      {tiers.length > 0 && (
        <section id="plans" className="section mb-auth-plans">
          <div className="shell">
            <div className="mb-auth-plans-head" data-reveal>
              <p className="eyebrow">Membership plans</p>
              <h2>Pick your plan.</h2>
              <p>Every plan is monthly. Create your account above, then choose the plan that fits how often you train.</p>
            </div>
            <TierCards items={tiers} exchangeRate={content.settings.exchangeRate} ctaLabel="Sign up to join" ctaHref={signupHref} />
            {tierGroup?.intro && <p className="mb-auth-plans-note" data-reveal>{tierGroup.intro}</p>}
          </div>
        </section>
      )}
    </>
  );
}
