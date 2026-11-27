"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { startTransition, useCallback, useEffect, useMemo, useOptimistic, useRef, useState } from "react";
import { logoutAction } from "@/app/admin/actions";
import { SECTION_KEYS } from "@/content/constants";
import { EDITOR_SCHEMA, type Option, type RefSource } from "@/content/editor-schema";
import type { ReviewItem } from "@/content/review";
import type { ContentMeta, SectionKey, SiteContent } from "@/content/types";
import type { Lead } from "@/lib/leads/types";
import type { StorageDriver } from "@/lib/storage/driver";
import { ContentReviewNotice } from "./ContentReview";
import { RefOptionsContext } from "./fields/RefsInput";
import LeadsInbox from "./LeadsInbox";
import SectionEditor from "./SectionEditor";

type Tab = SectionKey | "inbox";
// signedInAs: the staff email from the session, or null when signed in with the legacy shared password.
// review: stored values that differ from the current defaults for prices and offers (src/content/review.ts).
// staleFil: content paths edited in English since their Filipino translation was written (src/i18n/stale.ts).
type Props = { content: SiteContent; meta: ContentMeta; review: ReviewItem[]; leads: Lead[]; storage: StorageDriver; signedInAs: string | null; staleFil?: string[] };

const STORAGE_LABEL: Record<StorageDriver, string> = {
  upstash: "Upstash Redis",
  file: "Local file (.data)",
  readonly: "Read-only: storage not configured",
};
const isTab = (v: string | null): v is Tab => v === "inbox" || (SECTION_KEYS as readonly (string | null)[]).includes(v);
const WHEN = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Manila" });
const when = (iso: string) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : WHEN.format(d);
};

// Admin client shell (spec §D.3, §D.7). Rendered inside <Suspense>, so useSearchParams is allowed.
export default function AdminApp({ content, meta, review, leads, storage, signedInAs, staleFil = [] }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requested = searchParams.get("tab");
  const requestedItem = searchParams.get("item");
  const [tab, setOptimisticTab] = useOptimistic<Tab>(isTab(requested) ? requested : "home");
  const [toast, setToast] = useState<{ message: string; href: string } | null>(null);
  const dirtyRef = useRef(false);
  const onDirtyChange = useCallback((dirty: boolean) => { dirtyRef.current = dirty; }, []);
  const newCount = leads.filter((l) => l.status === "new").length;

  const refOptions = useMemo<Record<RefSource, Option[]>>(() => ({
    pricingItems: content.pricing.groups.flatMap((g) => g.items.map((i) => ({ value: i.id, label: `${i.name} (${g.title})` }))),
    recoveryModalities: content.recovery.modalities.map((m) => ({ value: m.id, label: m.title })),
  }), [content.pricing.groups, content.recovery.modalities]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 8000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const selectTab = (next: Tab) => {
    if (next === tab) return;
    if (dirtyRef.current && !window.confirm("You have unsaved changes in this section. Leave without saving?")) return;
    dirtyRef.current = false;
    startTransition(() => {
      setOptimisticTab(next);
      router.replace(`?tab=${next}`, { scroll: false });
    });
  };

  const section = tab === "inbox" ? null : tab;
  const schema = section ? EDITOR_SCHEMA[section] : null;
  const savedAt = section ? meta[section] : undefined;
  const sectionReview = section ? review.filter((r) => r.section === section) : [];
  // Sections with review items, for the banner on every other tab.
  const reviewSections = SECTION_KEYS.filter((key) => key !== section && review.some((r) => r.section === key));
  const onSaved = (kind: "saved" | "reset") => {
    setToast({ message: kind === "reset" ? "Reset to defaults. Live pages updated." : "Saved. Live pages updated.", href: schema?.previewPath ?? "/" });
  };

  return (
    <div className="adm-app">
      <header className="adm-topbar">
        <p className="adm-topbar-title">BaseCamp CamSur · Content admin</p>
        <span className="adm-storage" data-storage={storage}>{STORAGE_LABEL[storage]}</span>
        <span className="adm-topbar-user" style={{ fontSize: 13, overflowWrap: "anywhere" }}>
          {signedInAs ? <>Signed in as <strong>{signedInAs}</strong></> : "Signed in with the shared staff password"}
        </span>
        <div className="adm-topbar-actions">
          <a className="adm-topbar-link" href="/admin/payments">Payments</a>
          <a className="adm-topbar-link" href="/admin/bookings">Bookings</a>
          <a className="adm-topbar-link" href="/admin/privacy">Privacy</a>
          <a className="adm-topbar-link" href="/" target="_blank" rel="noopener noreferrer">View site ↗</a>
          <form action={logoutAction}>
            <button type="submit" className="adm-topbar-link">Log out</button>
          </form>
        </div>
      </header>

      {staleFil.length > 0 && (
        <details className="adm-muted" style={{ margin: "8px 16px", fontSize: 13 }}>
          <summary>
            Filipino pages: {staleFil.length} edited {staleFil.length === 1 ? "text shows" : "texts show"} in English until re-translated
          </summary>
          <p>Update these in src/i18n/fil/content.ts:</p>
          <ul>{staleFil.map((path) => <li key={path}><code>{path}</code></li>)}</ul>
        </details>
      )}

      <div className="adm-layout">
        <nav className="adm-tabs" aria-label="Content sections">
          {SECTION_KEYS.map((key) => (
            <button key={key} type="button" className="adm-tab" aria-current={tab === key ? "page" : undefined} onClick={() => selectTab(key)}>
              {EDITOR_SCHEMA[key].label}
              {meta[key] && <span className="adm-tab-dot" aria-label="(edited)" />}
            </button>
          ))}
          <button type="button" className="adm-tab adm-tab--inbox" aria-current={tab === "inbox" ? "page" : undefined} onClick={() => selectTab("inbox")}>
            Inbox ({newCount} new)
          </button>
        </nav>

        <section className="adm-panel" aria-labelledby="adm-panel-title">
          {reviewSections.length > 0 && (
            <div className="adm-alert" role="note">
              <p>
                <strong>Content review</strong>: saved content differs from the site&apos;s current defaults in{" "}
                {reviewSections.map((key, i) => (
                  <span key={key}>
                    {i > 0 && ", "}
                    <button type="button" className="adm-review-link" onClick={() => selectTab(key)}>{EDITOR_SCHEMA[key].label} ({review.filter((r) => r.section === key).length})</button>
                  </span>
                ))}
                . Check those sections after this update.
              </p>
            </div>
          )}
          {section && schema ? (
            <>
              <div className="adm-panel-head">
                <div>
                  <h1 id="adm-panel-title">{schema.label}</h1>
                  <p className="adm-muted">{schema.description}</p>
                </div>
                <p className="adm-panel-meta">
                  <span suppressHydrationWarning>{savedAt ? `Last saved: ${when(savedAt)}` : "Using defaults"}</span>
                  <a href={schema.previewPath} target="_blank" rel="noopener noreferrer">Preview ↗</a>
                </p>
              </div>
              <ContentReviewNotice items={sectionReview} />
              <RefOptionsContext value={refOptions}>
                <SectionEditor
                  key={`${section}:${savedAt ?? "default"}`}
                  section={section}
                  initial={content[section]}
                  baseUpdatedAt={savedAt ?? ""}
                  readOnly={storage === "readonly"}
                  onSaved={onSaved}
                  onDirtyChange={onDirtyChange}
                  focusItem={section === "programmes" ? requestedItem : null}
                  pricingGroups={content.pricing.groups}
                />
              </RefOptionsContext>
            </>
          ) : (
            <>
              <div className="adm-panel-head">
                <div>
                  <h1 id="adm-panel-title">Inbox</h1>
                  <p className="adm-muted">Submissions from the early-access, footer, contact, and booking forms. Personal data: handle with care.</p>
                </div>
              </div>
              <LeadsInbox leads={leads} />
            </>
          )}
        </section>
      </div>

      {toast && (
        <div className="adm-toast" role="status">
          <span>{toast.message}</span>
          <a href={toast.href} target="_blank" rel="noopener noreferrer">View ↗</a>
          <button type="button" className="adm-icon-btn" aria-label="Dismiss" onClick={() => setToast(null)}>✕</button>
        </div>
      )}
    </div>
  );
}
