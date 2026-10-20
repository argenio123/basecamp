import type { FacilityDetails } from "@/data/facilities";

export default function FacilityCardFacts({ details }: { details: FacilityDetails }) {
  return (
    <>
      <dl className="fc-card-facts">
        <div><dt>Best for</dt><dd>{details.audience}</dd></div>
        <div><dt>Member access</dt><dd>{details.access}</dd></div>
        <div><dt>Booking</dt><dd>{details.booking}</dd></div>
        <div><dt>Related programs</dt><dd>{details.programs.join(" · ")}</dd></div>
      </dl>
      {details.technical && <p className="fc-card-technical"><strong>Technical detail</strong>{details.technical}</p>}
    </>
  );
}
