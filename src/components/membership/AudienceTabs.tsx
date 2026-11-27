"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type KeyboardEvent } from "react";
import { PriceBlock } from "@/components/membership/PriceTable";
import { toBlocks } from "@/components/membership/pricing";
import type { PriceGroup } from "@/content/types";
import { useLocale } from "@/i18n/client";
import { MEMBERSHIP_UI } from "@/i18n/ui-sections/membership";

// Audience filter for price groups (spec §C.6.3; formerly /membership/passes). Every group is prerendered;
// the tabs only toggle `hidden`, so all prices stay in the HTML. A hash that targets a hidden group switches
// the view back to "All prices". The tabs are left out when filtering would change nothing.
type Tab = "all" | "locals" | "travellers";
// Labels: MEMBERSHIP_UI[locale].tabs (src/i18n/ui-sections/membership.ts).
const TABS: { id: Tab }[] = [{ id: "all" }, { id: "locals" }, { id: "travellers" }];

// location.hash as an external store (react-hooks v7: no setState in effects). Next <Link> hash navigation uses
// pushState, which fires neither hashchange nor popstate, so the Navigation API event is used where available.
function subscribe(onChange: () => void) {
  const nav = "navigation" in window ? (window as unknown as { navigation: EventTarget }).navigation : undefined;
  window.addEventListener("hashchange", onChange);
  window.addEventListener("popstate", onChange);
  nav?.addEventListener("currententrychange", onChange);
  return () => {
    window.removeEventListener("hashchange", onChange);
    window.removeEventListener("popstate", onChange);
    nav?.removeEventListener("currententrychange", onChange);
  };
}
const getSnapshot = () => window.location.hash;
const getServerSnapshot = () => "";

function hashTarget(hash: string) {
  try { return decodeURIComponent(hash.replace(/^#/, "")); } catch { return hash.replace(/^#/, ""); }
}
const showsFor = (group: PriceGroup, tab: Tab) => tab === "all" || group.audience === "both" || group.audience === tab;

type AudienceTabsProps = {
  groups: PriceGroup[];
  exchangeRate: number;
  disclaimer: string;
  eyebrow?: string;
  title?: string;
  /** ≤2 sentences. */
  intro?: string;
};

export default function AudienceTabs({ groups, exchangeRate, disclaimer, eyebrow, title, intro }: AudienceTabsProps) {
  const locale = useLocale();
  const ui = MEMBERSHIP_UI[locale];
  eyebrow ??= ui.eyebrow;
  title ??= ui.title;
  const hash = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [choice, setChoice] = useState<{ tab: Tab; hash: string }>({ tab: "all", hash: "" });
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const blocks = toBlocks(groups);
  // Tabs only help when some block would be hidden under "For locals" or "For travellers".
  const filterable = TABS.some((t) => blocks.some((b) => !b.groups.some((g) => showsFor(g, t.id))));
  const target = hashTarget(hash);
  const targetBlock = target ? blocks.find((b) => b.anchor === target) : undefined;
  // Only a hash that changed since the visitor picked a tab can override that pick.
  const forcedAll = choice.tab !== "all" && hash !== choice.hash && !!targetBlock && !targetBlock.groups.some((g) => showsFor(g, choice.tab));
  const tab: Tab = !filterable || forcedAll ? "all" : choice.tab;

  useEffect(() => {
    // The browser could not scroll to the hidden group; now that it is visible, bring it into view.
    if (forcedAll && target) document.getElementById(target)?.scrollIntoView({ block: "start" });
  }, [forcedAll, target]);

  const select = (next: Tab) => setChoice({ tab: next, hash });
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const index = TABS.findIndex((t) => t.id === tab);
    const keys: Record<string, number> = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: TABS.length - 1 };
    if (!(event.key in keys)) return;
    event.preventDefault();
    const nextIndex = (keys[event.key] + TABS.length) % TABS.length;
    select(TABS[nextIndex].id);
    tabRefs.current[nextIndex]?.focus();
  };

  if (!blocks.length) return null;

  const panel = blocks.map((block) => (
    <PriceBlock key={block.key} block={block} exchangeRate={exchangeRate} disclaimer={disclaimer} locale={locale}
      hidden={!block.groups.some((g) => showsFor(g, tab))}
      hiddenGroups={block.groups.filter((g) => !showsFor(g, tab)).map((g) => g.id)} />
  ));

  return (
    <div className="mb-pricing">
      <div className="section-heading split-heading light-split" data-reveal>
        <div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2></div>
        {intro && <p>{intro}</p>}
      </div>
      {filterable ? (
        <>
          <div className="mb-tabs" role="tablist" aria-label={ui.tabsLabel} onKeyDown={onKeyDown} data-reveal data-reveal-delay="short">
            {TABS.map((t, i) => (
              <button key={t.id} ref={(el) => { tabRefs.current[i] = el; }} id={`mb-tab-${t.id}`} type="button" role="tab" className="mb-tab"
                aria-selected={tab === t.id} aria-controls="mb-pricing-panel" tabIndex={tab === t.id ? 0 : -1} onClick={() => select(t.id)}>
                {ui.tabs[t.id]}
              </button>
            ))}
          </div>
          <div id="mb-pricing-panel" className="mb-panel" role="tabpanel" aria-labelledby={`mb-tab-${tab}`}>{panel}</div>
        </>
      ) : (
        <div className="mb-panel">{panel}</div>
      )}
    </div>
  );
}
