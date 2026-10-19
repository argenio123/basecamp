"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useMemo, useState, type MouseEvent } from "react";
import { resetSectionAction, saveSectionAction } from "@/app/admin/actions";
import { EDITOR_SCHEMA, sectionFields, type Field } from "@/content/editor-schema";
import { currentHrefFor } from "@/content/sitemap";
import type { SectionKey } from "@/content/types";
import { ObjectFields } from "./fields/FieldControl";
import { fieldId } from "./fields/inputs";
import { INITIAL_SAVE_STATE, type SaveState } from "./state";

type Group = { title: string; anchor?: string; help?: string; fields: Record<string, Field> };

type Props = {
  section: SectionKey;
  initial: unknown;
  /** meta[section] ("" while using defaults); sent back for conflict detection. */
  baseUpdatedAt: string;
  readOnly: boolean;
  onSaved: (kind: "saved" | "reset") => void;
  onDirtyChange: (dirty: boolean) => void;
  focusItem?: string | null;
};

/** "Founders › Paragraphs › 2" for an error path such as founders.paragraphs.1 */
function labelForPath(fields: Record<string, Field>, path: string): string {
  const out: string[] = [];
  let current: Record<string, Field> | null = fields;
  let list: Field | null = null;
  for (const part of path.split(".")) {
    if (list && list.kind === "list") {
      out.push(`Item ${Number(part) + 1}`);
      current = list.fields;
      list = null;
      continue;
    }
    const f: Field | undefined = current?.[part];
    if (!f) {
      out.push(/^\d+$/.test(part) ? `#${Number(part) + 1}` : part === "min" ? "From" : part === "max" ? "To" : part);
      current = null;
      continue;
    }
    if (f.label) out.push(f.label);
    current = f.kind === "object" ? f.fields : null;
    list = f.kind === "list" ? f : null;
  }
  return out.join(" › ") || "Section";
}

// Stage-3: sections moved to sub-pages keep their content keys; the site map forwards each stage-2
// "page#anchor" to where it is rendered now (e.g. /#build → /about/the-build, /facilities#recovery → /facilities/recovery).
// A group anchor starting with "/" is already a full site path (used for content shown on another section's page).
const previewHref = (previewPath: string, anchor: string) => (anchor.startsWith("/") ? anchor : currentHrefFor(previewPath, anchor));
const previewWhere = (href: string) => (href.startsWith("/#") ? "homepage" : "site");

// Edits one content section (spec §D.7). Local draft starts as a structured clone of the stored content;
// the editor is remounted (via its key) after a save or reset so it picks up the new stored version.
export default function SectionEditor({ section, initial, baseUpdatedAt, readOnly, onSaved, onDirtyChange, focusItem }: Props) {
  const router = useRouter();
  const schema = EDITOR_SCHEMA[section];
  const groups = schema.groups as readonly Group[];
  const allFields = useMemo(() => sectionFields(section), [section]);
  const initialJson = useMemo(() => JSON.stringify(initial), [initial]);
  const [draft, setDraft] = useState<unknown>(() => structuredClone(initial));
  const payload = useMemo(() => JSON.stringify(draft), [draft]);
  const dirty = payload !== initialJson;

  const [saveState, saveAction, saving] = useActionState(async (prev: SaveState, formData: FormData) => {
    const result = await saveSectionAction(prev, formData);
    if (result.ok) onSaved("saved");
    return result;
  }, INITIAL_SAVE_STATE);
  const [resetState, resetAction, resetting] = useActionState(async (prev: SaveState, formData: FormData) => {
    const result = await resetSectionAction(prev, formData);
    if (result.ok) onSaved("reset");
    return result;
  }, INITIAL_SAVE_STATE);
  const [dismissed, setDismissed] = useState<SaveState | null>(null);
  const busy = saving || resetting;

  const visible = saveState === dismissed ? INITIAL_SAVE_STATE : saveState;
  const errorList = useMemo(() => visible.errors ?? [], [visible]);
  const errors = useMemo(() => Object.fromEntries(errorList.map((e) => [e.path, e.message])), [errorList]);
  const errorKeys = useMemo(() => new Set(errorList.map((e) => e.path.split(".")[0])), [errorList]);

  useEffect(() => {
    onDirtyChange(dirty);
    return () => onDirtyChange(false);
  }, [dirty, onDirtyChange]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  useEffect(() => {
    if (!focusItem || !/^[a-z0-9-]{1,60}$/.test(focusItem)) return;
    const frame = window.requestAnimationFrame(() => {
      document.querySelector<HTMLElement>(`[data-admin-item="${focusItem}"]`)?.scrollIntoView({ block: "center" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [focusItem]);

  const discard = () => {
    setDraft(structuredClone(initial));
    setDismissed(saveState);
  };
  const confirmReset = (event: MouseEvent<HTMLButtonElement>) => {
    if (!window.confirm(`Reset “${schema.label}” to the default content? Your saved edits to this section will be removed from the live site.`)) event.preventDefault();
  };

  return (
    <div className="adm-editor">
      {readOnly && (
        <p className="adm-alert" role="note">
          Storage is not configured, so saving is disabled. Add KV_REST_API_URL and KV_REST_API_TOKEN to enable editing.
        </p>
      )}
      {visible.conflict ? (
        <div className="adm-alert" role="alert">
          <p>{visible.error}</p>
          <button type="button" className="adm-btn" onClick={() => router.refresh()}>Reload latest</button>
        </div>
      ) : errorList.length > 0 ? (
        <div className="adm-alert" role="alert">
          <p><strong>{errorList.length === 1 ? "1 field needs attention." : `${errorList.length} fields need attention.`}</strong> Nothing was saved.</p>
          <ul className="adm-error-list">
            {errorList.map((e) => (
              <li key={e.path}><a href={`#${fieldId(e.path)}`}>{labelForPath(allFields, e.path)}</a>: {e.message}</li>
            ))}
          </ul>
        </div>
      ) : visible.error ? (
        <p className="adm-alert" role="alert">{visible.error}</p>
      ) : null}
      {resetState.error && !resetState.ok && <p className="adm-alert" role="alert">{resetState.error}</p>}

      {groups.map((group, i) => {
        const hasError = Object.keys(group.fields).some((key) => errorKeys.has(key));
        return (
          <details key={group.title} className="adm-group" open={i === 0 || hasError || Boolean(focusItem && "featured" in group.fields)}>
            <summary className="adm-group-summary">
              <span className="adm-group-title">{group.title}</span>
              {hasError && <span className="adm-group-flag">Needs attention</span>}
            </summary>
            <div className="adm-group-body">
              {(group.help || group.anchor) && (
                <p className="adm-help adm-group-help">
                  {group.help}
                  {group.anchor && (
                    <a className="adm-view-link" href={previewHref(schema.previewPath, group.anchor)} target="_blank" rel="noopener noreferrer">
                      View on {previewWhere(previewHref(schema.previewPath, group.anchor))} ↗ <code>{previewHref(schema.previewPath, group.anchor)}</code>
                    </a>
                  )}
                </p>
              )}
              <ObjectFields fields={group.fields} value={draft} onChange={setDraft} path="" errors={errors} />
            </div>
          </details>
        );
      })}

      <form action={saveAction} className="adm-savebar">
        <input type="hidden" name="section" value={section} />
        <input type="hidden" name="payload" value={payload} />
        <input type="hidden" name="baseUpdatedAt" value={baseUpdatedAt} />
        <span className={`adm-dirty${dirty ? " adm-dirty--on" : ""}`} role="status">{dirty ? "Unsaved changes" : "All changes saved"}</span>
        <div className="adm-savebar-actions">
          <button type="button" className="adm-btn adm-btn--quiet" onClick={discard} disabled={!dirty || busy}>Discard</button>
          <button type="submit" className="adm-btn adm-btn--primary" disabled={!dirty || busy || readOnly}>{saving ? "Saving…" : "Save section"}</button>
          <button type="submit" formAction={resetAction} className="adm-btn adm-btn--danger" onClick={confirmReset} disabled={!baseUpdatedAt || busy || readOnly}>
            {resetting ? "Resetting…" : "Reset to defaults"}
          </button>
        </div>
      </form>
    </div>
  );
}
