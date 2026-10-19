import type { FoundingOffer } from "@/content/types";

/**
 * "N of CAP spots remaining" (+ optional progress bar). Renders nothing unless
 * founding.enabled && founding.showCounter. Claimed must reflect real sign-ups.
 */
export default function FoundingCounter({ founding, showBar = false, className }: { founding: FoundingOffer; showBar?: boolean; className?: string }) {
  if (!founding.enabled || !founding.showCounter) return null;
  const cap = Math.max(0, Math.floor(founding.cap));
  const claimed = Math.min(cap, Math.max(0, Math.floor(founding.claimed)));
  const remaining = cap - claimed;
  return (
    <div className={`ui-founding-counter${className ? ` ${className}` : ""}`}>
      <p className="ui-founding-counter-text"><strong>{remaining}</strong> of {cap} spots remaining</p>
      {showBar && cap > 0 && (
        <progress className="ui-founding-counter-bar" max={cap} value={claimed} aria-label={`${claimed} of ${cap} early spots claimed`} />
      )}
    </div>
  );
}
