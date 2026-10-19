"use client";

import type { StringListField } from "@/content/editor-schema";
import { describedBy, FieldShell, fieldId, move, type ControlProps } from "./inputs";

type Props = ControlProps<StringListField> & { path: string; errors: Record<string, string> };

// One text line per entry, with reorder and remove. Empty lines are dropped on save.
export default function StringListInput({ field, value, onChange, id, error, path, errors }: Props) {
  const items = Array.isArray(value) ? (value as unknown[]).map((v) => (typeof v === "string" ? v : "")) : [];
  const full = items.length >= field.maxItems;
  return (
    <FieldShell id={id} label={field.label} help={field.help} error={error} wide group>
      <ol className="adm-lines">
        {items.map((line, i) => {
          const lineId = fieldId(`${path}.${i}`);
          const lineError = errors[`${path}.${i}`];
          return (
            <li key={i}>
              <div className="adm-line">
                <input id={lineId} aria-label={`${field.label} ${i + 1}`} value={line} onChange={(e) => onChange(items.map((v, j) => (j === i ? e.target.value : v)))} {...describedBy(lineId, undefined, lineError)} />
                <button type="button" className="adm-icon-btn" aria-label={`Move ${field.label} ${i + 1} up`} disabled={i === 0} onClick={() => onChange(move(items, i, i - 1))}>↑</button>
                <button type="button" className="adm-icon-btn" aria-label={`Move ${field.label} ${i + 1} down`} disabled={i === items.length - 1} onClick={() => onChange(move(items, i, i + 1))}>↓</button>
                <button type="button" className="adm-icon-btn" aria-label={`Remove ${field.label} ${i + 1}`} onClick={() => onChange(items.filter((_, j) => j !== i))}>✕</button>
              </div>
              {lineError && <p className="adm-field-error" id={`${lineId}-error`}>{lineError}</p>}
            </li>
          );
        })}
      </ol>
      <button type="button" className="adm-btn adm-btn--quiet" disabled={full} onClick={() => onChange([...items, ""])}>
        + Add line{full ? ` (max ${field.maxItems})` : ""}
      </button>
    </FieldShell>
  );
}
