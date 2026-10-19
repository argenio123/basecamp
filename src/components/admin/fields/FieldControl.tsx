"use client";

import type { Field, ListField } from "@/content/editor-schema";
import ImagePicker from "./ImagePicker";
import {
  BooleanControl, DateControl, FieldShell, fieldId, move, MultiSelectControl, NumberControl, SelectControl, TextareaControl, TextControl,
} from "./inputs";
import PriceInput from "./PriceInput";
import RefsInput from "./RefsInput";
import StringListInput from "./StringListInput";

export type FieldProps = { field: Field; value: unknown; onChange: (value: unknown) => void; path: string; errors: Record<string, string> };

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);

/** Renders the right control for a schema field. Objects and lists recurse. */
export default function FieldControl({ field, value, onChange, path, errors }: FieldProps) {
  const id = fieldId(path);
  const error = errors[path];
  switch (field.kind) {
    case "text":
    case "id":
    case "href":
    case "url":
    case "video":
      return <TextControl field={field} value={value} onChange={onChange} id={id} error={error} />;
    case "textarea":
      return <TextareaControl field={field} value={value} onChange={onChange} id={id} error={error} />;
    case "number":
      return <NumberControl field={field} value={value} onChange={onChange} id={id} error={error} />;
    case "boolean":
      return <BooleanControl field={field} value={value} onChange={onChange} id={id} error={error} />;
    case "select":
      return <SelectControl field={field} value={value} onChange={onChange} id={id} error={error} />;
    case "multiSelect":
      return <MultiSelectControl field={field} value={value} onChange={onChange} id={id} error={error} />;
    case "date":
      return <DateControl field={field} value={value} onChange={onChange} id={id} error={error} />;
    case "image":
      return <ImagePicker field={field} value={value} onChange={onChange} id={id} error={error} />;
    case "price":
      return <PriceInput field={field} value={value} onChange={onChange} id={id} error={error} path={path} errors={errors} />;
    case "stringList":
      return <StringListInput field={field} value={value} onChange={onChange} id={id} error={error} path={path} errors={errors} />;
    case "refs":
      return <RefsInput field={field} value={value} onChange={onChange} id={id} error={error} path={path} errors={errors} />;
    case "object": {
      const fields = (
        <ObjectFields fields={field.fields} value={value} onChange={onChange} path={path} errors={errors} />
      );
      if (!field.label) return <div className="adm-field adm-field--wide">{fields}{error && <p className="adm-field-error">{error}</p>}</div>;
      return <FieldShell id={id} label={field.label} help={field.help} error={error} wide group>{fields}</FieldShell>;
    }
    case "list":
      return <ListEditor field={field} value={value} onChange={onChange} path={path} errors={errors} />;
  }
}

/** A grid of fields for one object value. */
export function ObjectFields({ fields, value, onChange, path, errors }: { fields: Record<string, Field>; value: unknown; onChange: (value: unknown) => void; path: string; errors: Record<string, string> }) {
  const obj = isRecord(value) ? value : {};
  return (
    <div className="adm-fields">
      {Object.entries(fields).map(([key, f]) => (
        <FieldControl key={key} field={f} value={obj[key]} path={path ? `${path}.${key}` : key} errors={errors} onChange={(v) => onChange({ ...obj, [key]: v })} />
      ))}
    </div>
  );
}

function duplicate(field: ListField, item: unknown): unknown {
  const copy = structuredClone(item);
  if (!isRecord(copy)) return copy;
  for (const [key, f] of Object.entries(field.fields)) {
    if (f.kind === "id" && typeof copy[key] === "string") copy[key] = `${(copy[key] as string).slice(0, 48)}-${Math.random().toString(36).slice(2, 6)}`;
  }
  return copy;
}

/** List of item cards with ↑ ↓ Duplicate, Remove (confirmed) and Add item (disabled at maxItems). */
function ListEditor({ field, value, onChange, path, errors }: { field: ListField; value: unknown; onChange: (value: unknown) => void; path: string; errors: Record<string, string> }) {
  const items = Array.isArray(value) ? (value as unknown[]) : [];
  const full = items.length >= field.maxItems;
  const id = fieldId(path);
  const error = errors[path];
  const titleOf = (item: unknown, i: number) => {
    const t = isRecord(item) ? item[field.itemTitleKey] : undefined;
    return typeof t === "string" && t.trim() ? t : `Item ${i + 1}`;
  };
  return (
    <FieldShell id={id} label={`${field.label} (${items.length}/${field.maxItems})`} help={field.help} error={error} wide group>
      {items.length === 0 && <p className="adm-muted">No items yet.</p>}
      <ol className="adm-cards">
        {items.map((item, i) => {
          const itemPath = `${path}.${i}`;
          const title = titleOf(item, i);
          const itemKey = isRecord(item) && typeof (item.slug ?? item.id) === "string" ? String(item.slug ?? item.id) : undefined;
          return (
            <li key={i} className="adm-card" data-admin-item={itemKey}>
              <div className="adm-card-head">
                <span className="adm-card-title"><span className="adm-mono">{String(i + 1).padStart(2, "0")}</span> {title}</span>
                <div className="adm-card-actions">
                  <button type="button" className="adm-icon-btn" aria-label={`Move ${title} up`} disabled={i === 0} onClick={() => onChange(move(items, i, i - 1))}>↑</button>
                  <button type="button" className="adm-icon-btn" aria-label={`Move ${title} down`} disabled={i === items.length - 1} onClick={() => onChange(move(items, i, i + 1))}>↓</button>
                  <button type="button" className="adm-btn adm-btn--quiet" disabled={full} onClick={() => onChange([...items.slice(0, i + 1), duplicate(field, item), ...items.slice(i + 1)])}>Duplicate</button>
                  <button
                    type="button" className="adm-btn adm-btn--danger"
                    onClick={() => { if (window.confirm(`Remove “${title}”? This takes effect when you save.`)) onChange(items.filter((_, j) => j !== i)); }}
                  >
                    Remove
                  </button>
                </div>
              </div>
              <ObjectFields fields={field.fields} value={item} path={itemPath} errors={errors} onChange={(v) => onChange(items.map((it, j) => (j === i ? v : it)))} />
            </li>
          );
        })}
      </ol>
      <button type="button" className="adm-btn" disabled={full} onClick={() => onChange([...items, field.newItem()])}>
        + Add item{full ? ` (max ${field.maxItems})` : ""}
      </button>
    </FieldShell>
  );
}
