import type { Metadata } from "next";
import { Suspense } from "react";
import MembershipJoinForm, { type JoinContact, type JoinPlan } from "@/components/membership/MembershipJoinForm";
import MembershipJoinFormWithParams from "@/components/membership/MembershipJoinFormWithParams";
import RequestGate from "@/components/members/RequestGate";
import { TIER_OPTIONS } from "@/content/constants";
import { formatPhp } from "@/content/format";
import { getSiteContent } from "@/content/get";

const IMAGE = "/images/membership/generated/membership-join-cover-1263x1090.png";

export const metadata: Metadata = {
  title: "Join membership",
  description: "Apply for a BaseCamp CamSur membership: a few quick questions about your plan, goals and start date, and our team will be in touch with rates.",
};

// Membership application: one question per screen (cover → plan → base → goal → frequency → start → contact).
// Member-only like /schedule/book (src/proxy.ts sends visitors to log in first). Static under cacheComponents: only the
// cached getSiteContent() is awaited; ?tier= is read client-side inside <Suspense>.
export default async function MembershipJoinPage() {
  const c = await getSiteContent();
  const { contact } = c.settings;
  const tiers = c.pricing.groups.find((g) => g.id === "memberships")?.items.filter((i) => i.visible) ?? [];

  const plans: JoinPlan[] = TIER_OPTIONS.map((t) => {
    const item = tiers.find((i) => i.id === t.value);
    if (t.value === "unsure") return { value: t.value, label: "Not sure yet — advise me", price: "", hint: "Tell us how you train and we'll suggest a plan." };
    return { value: t.value, label: item?.name ?? t.label, price: item?.price ? `${formatPhp(item.price)}${item.unit}` : "", hint: item?.description ?? "" };
  });
  const contactInfo: JoinContact = { phoneDisplay: contact.phoneDisplay, phoneHref: `tel:${contact.phoneE164 || contact.phoneDisplay}`, email: contact.email };
  const props = { plans, contact: contactInfo, image: IMAGE };

  return (
    <section className="jf-page" id="join">
      <div className="shell">
        <Suspense fallback={null}><RequestGate always /></Suspense>
        <Suspense fallback={<MembershipJoinForm {...props} />}>
          <MembershipJoinFormWithParams {...props} />
        </Suspense>
      </div>
    </section>
  );
}
