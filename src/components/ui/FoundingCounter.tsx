import type { FoundingOffer } from "@/content/types";
import { getFoundingAvailability } from "@/lib/payments/founding";

/**
 * Public founding counter: "37 of 100 founding spots taken" (+ optional progress bar), "Only N left" from 80% taken,
 * "Founding spots are full" at the cap, and "Be one of the first 100" before any sales. Taken = paid founding members
 * or the admin's "Spots taken" number, whichever is larger (src/lib/payments/founding-status.ts). The count is cached
 * ('use cache', refreshed when a founding payment is paid or refunded), so pages using it stay static.
 * Renders nothing unless founding.enabled && founding.showCounter.
 */
export default async function FoundingCounter({ founding, showBar = false, className }: { founding: FoundingOffer; showBar?: boolean; className?: string }) {
  if (!founding.enabled || !founding.showCounter) return null;
  const { cap, taken, left, state } = await getFoundingAvailability(founding);
  if (cap <= 0) return null;
  const label = state === "full" ? "Founding spots are full" : `${taken} of ${cap} founding spots taken`;
  return (
    <div className={`ui-founding-counter${className ? ` ${className}` : ""}`} data-state={state}>
      {state === "unstarted" ? (
        <p className="ui-founding-counter-text"><strong>Be one of the first {cap}</strong> founding members.</p>
      ) : (
        <>
          <p className="ui-founding-counter-text">
            {state === "full" ? <strong>Founding spots are full</strong> : <><strong>{taken}</strong> of {cap} founding spots taken</>}
          </p>
          {state === "low" && <p className="ui-founding-counter-left">Only {left} left</p>}
          {showBar && (
            <div className="ui-founding-counter-bar" role="progressbar" aria-label="Founding spots taken" aria-valuemin={0} aria-valuemax={cap} aria-valuenow={taken} aria-valuetext={label}>
              <span className="ui-founding-counter-fill" style={{ width: `${Math.round((taken / cap) * 1000) / 10}%` }} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
