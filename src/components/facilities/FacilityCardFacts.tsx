import type { FacilityDetails } from "@/data/facilities";
import { t } from "@/i18n/server";

// Server Component (used by the server-safe ItemList): labels via t(), the details text from getData("facilities").

export default function FacilityCardFacts({ details }: { details: FacilityDetails }) {
  return (
    <>
      <dl className="fc-card-facts">
        <div><dt>{t("Best for")}</dt><dd>{details.audience}</dd></div>
        <div><dt>{t("Member access")}</dt><dd>{details.access}</dd></div>
        <div><dt>{t("Booking")}</dt><dd>{details.booking}</dd></div>
        <div><dt>{t("Related programs")}</dt><dd>{details.programs.join(" · ")}</dd></div>
      </dl>
      {details.technical && <p className="fc-card-technical"><strong>{t("Technical detail")}</strong>{details.technical}</p>}
    </>
  );
}
