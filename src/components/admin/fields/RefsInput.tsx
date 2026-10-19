"use client";

import { createContext, use } from "react";
import type { Option, RefSource, RefsField } from "@/content/editor-schema";
import { FieldShell, fieldId, move, type ControlProps } from "./inputs";

/** Options for `refs` fields, derived from the current content (pricing items, recovery modalities). */
export const RefOptionsContext = createContext<Record<RefSource, Option[]>>({ pricingItems: [], recoveryModalities: [] });

type Props = ControlProps<RefsField> & { path: string; errors: Record<string, string> };

// An ordered pick-list of ids from another section.
export default function RefsInput({ field, value, onChange, id, error, path, errors }: Props) {
  const options = use(RefOptionsContext)[field.source];
  const selected = Array.isArray(value) ? (value as unknown[]).filter((v): v is string => typeof v === "string") : [];
  const labelFor = (v: string) => options.find((o) => o.value === v)?.label;
  const remaining = options.filter((o) => !selected.includes(o.value));
  const full = field.maxItems !== undefined && selected.length >= field.maxItems;
  return (
    <FieldShell id={id} label={field.label} help={field.help} error={error} wide group>
      {selected.length === 0 && <p className="adm-muted">Nothing selected.</p>}
      <ol className="adm-lines">
        {selected.map((v, i) => {
          const itemError = errors[`${path}.${i}`];
          const label = labelFor(v);
          return (
            <li key={v}>
              <div className="adm-line">
                <span className={`adm-ref${label ? "" : " adm-ref--missing"}`} id={fieldId(`${path}.${i}`)}>
                  {label ?? "Missing item"} <code>{v}</code>
                </span>
                <button type="button" className="adm-icon-btn" aria-label={`Move ${label ?? v} up`} disabled={i === 0} onClick={() => onChange(move(selected, i, i - 1))}>↑</button>
                <button type="button" className="adm-icon-btn" aria-label={`Move ${label ?? v} down`} disabled={i === selected.length - 1} onClick={() => onChange(move(selected, i, i + 1))}>↓</button>
                <button type="button" className="adm-icon-btn" aria-label={`Remove ${label ?? v}`} onClick={() => onChange(selected.filter((s) => s !== v))}>✕</button>
              </div>
              {itemError && <p className="adm-field-error">{itemError}</p>}
            </li>
          );
        })}
      </ol>
      <select
        aria-label={`Add to ${field.label}`} value="" disabled={full || remaining.length === 0}
        onChange={(e) => e.target.value && onChange([...selected, e.target.value])}
      >
        <option value="">{full ? `Maximum ${field.maxItems} selected` : "+ Add…"}</option>
        {remaining.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </FieldShell>
  );
}
