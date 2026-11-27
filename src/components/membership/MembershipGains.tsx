import GainList from "@/components/programs/GainList";
import { getData } from "@/i18n/data";
import { t } from "@/i18n/server";

/** "What you gain" on Membership pages: the class-page rows (open/close with the plus), content per page path. */
export default function MembershipGains({ path }: { path: string }) {
  const gains = getData("membership-gains").MEMBERSHIP_GAINS[path];
  if (!gains?.length) return null;
  return (
    <section className="section pr-dev-gains mb-gains" aria-labelledby="mb-gains-title">
      <div className="shell">
        <p className="pr-dev-label pr-dev-gains-label" id="mb-gains-title" data-reveal>{t("What you gain")}</p>
        <GainList gains={[...gains]} />
      </div>
    </section>
  );
}
