"use client";

import type { ReactNode } from "react";
import type { BooleanField, DateField, HrefField, MultiSelectField, NumberField, SelectField, TextareaField, TextField, IdField, UrlField, VideoField } from "@/content/editor-schema";

// Basic admin field controls. Every control is controlled; errors come from the server action
// and are wired with aria-invalid + aria-describedby (spec §D.7).

export type ControlProps<F, V = unknown> = { field: F; value: V; onChange: (value: unknown) => void; id: string; error?: string };

/** Returns a copy of `list` with the item at `from` moved to `to`. */
export function move<T>(list: readonly T[], from: number, to: number): T[] {
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export const fieldId = (path: string) => `adm-f-${path.replace(/[^a-zA-Z0-9-]/g, "-") || "root"}`;

export function describedBy(id: string, help?: string, error?: string) {
  const ids = [help ? `${id}-help` : "", error ? `${id}-error` : ""].filter(Boolean).join(" ");
  return { "aria-invalid": error ? true : undefined, "aria-describedby": ids || undefined } as const;
}

/** Label + control + help + inline error. `group` renders a fieldset/legend for multi-input controls. */
export function FieldShell({ id, label, help, error, wide, group, children }: { id: string; label: string; help?: string; error?: string; wide?: boolean; group?: boolean; children: ReactNode }) {
  const cls = `adm-field${wide ? " adm-field--wide" : ""}${error ? " adm-field--invalid" : ""}`;
  const extras = (
    <>
      {help && <p className="adm-help" id={`${id}-help`}>{help}</p>}
      {error && <p className="adm-field-error" id={`${id}-error`}>{error}</p>}
    </>
  );
  if (group) {
    return (
      <fieldset className={cls} id={id} aria-describedby={error ? `${id}-error` : undefined}>
        {label && <legend className="adm-label">{label}</legend>}
        {children}
        {extras}
      </fieldset>
    );
  }
  return (
    <div className={cls}>
      {label && <label className="adm-label" htmlFor={id}>{label}</label>}
      {children}
      {extras}
    </div>
  );
}

const str = (v: unknown) => (typeof v === "string" ? v : v === null || v === undefined ? "" : String(v));

export function TextControl({ field, value, onChange, id, error }: ControlProps<TextField | IdField | HrefField | UrlField | VideoField>) {
  const isLink = field.kind === "href" || field.kind === "url" || field.kind === "video";
  const placeholder = field.kind === "href" ? "/page#section or https://…" : field.kind === "url" || field.kind === "video" ? "https://…" : undefined;
  return (
    <FieldShell id={id} label={field.label} help={field.help} error={error} wide={isLink && field.kind !== "href"}>
      <input
        id={id} type={field.kind === "url" || field.kind === "video" ? "url" : field.kind === "text" && field.format === "email" ? "email" : "text"}
        value={str(value)} onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder} spellCheck={field.kind === "text" && !field.format ? undefined : false}
        className={field.kind === "id" || isLink ? "adm-mono" : undefined} {...describedBy(id, field.help, error)}
      />
    </FieldShell>
  );
}

export function TextareaControl({ field, value, onChange, id, error }: ControlProps<TextareaField>) {
  const text = str(value);
  return (
    <FieldShell id={id} label={field.label} help={field.help} error={error} wide>
      <textarea id={id} rows={field.rows ?? 3} value={text} onChange={(e) => onChange(e.target.value)} {...describedBy(id, field.help, error)} />
      {field.max && <span className="adm-count" aria-hidden="true">{text.length}/{field.max}</span>}
    </FieldShell>
  );
}

export function NumberControl({ field, value, onChange, id, error }: ControlProps<NumberField>) {
  return (
    <FieldShell id={id} label={field.label} help={field.help} error={error}>
      <input
        id={id} type="number" inputMode={field.integer ? "numeric" : "decimal"} step={field.integer ? 1 : "any"} min={field.min} max={field.max}
        value={value === null || value === undefined ? "" : str(value)} placeholder={field.nullable ? "Not set" : undefined}
        onChange={(e) => {
          const raw = e.target.value;
          if (raw === "") return onChange(field.nullable ? null : "");
          const n = Number(raw);
          onChange(Number.isFinite(n) ? n : raw);
        }}
        {...describedBy(id, field.help, error)}
      />
    </FieldShell>
  );
}

export function BooleanControl({ field, value, onChange, id, error }: ControlProps<BooleanField>) {
  return (
    <div className={`adm-field adm-field--check${error ? " adm-field--invalid" : ""}`}>
      <label className="adm-check" htmlFor={id}>
        <input id={id} type="checkbox" checked={value === true} onChange={(e) => onChange(e.target.checked)} {...describedBy(id, field.help, error)} />
        <span>{field.label}</span>
      </label>
      {field.help && <p className="adm-help" id={`${id}-help`}>{field.help}</p>}
      {error && <p className="adm-field-error" id={`${id}-error`}>{error}</p>}
    </div>
  );
}

export function SelectControl({ field, value, onChange, id, error }: ControlProps<SelectField>) {
  const current = str(value);
  const known = field.options.some((o) => o.value === current);
  return (
    <FieldShell id={id} label={field.label} help={field.help} error={error}>
      <select id={id} value={current} onChange={(e) => onChange(e.target.value)} {...describedBy(id, field.help, error)}>
        {!known && <option value={current}>{current ? `${current} (unknown)` : "Choose…"}</option>}
        {field.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </FieldShell>
  );
}

export function MultiSelectControl({ field, value, onChange, id, error }: ControlProps<MultiSelectField>) {
  const selected = Array.isArray(value) ? (value as unknown[]).filter((v): v is string => typeof v === "string") : [];
  const toggle = (v: string, on: boolean) => onChange(on ? [...selected, v] : selected.filter((s) => s !== v));
  return (
    <FieldShell id={id} label={field.label} help={field.help} error={error} wide group>
      <div className="adm-chips">
        {field.options.map((o) => (
          <label key={o.value} className="adm-chip">
            <input type="checkbox" checked={selected.includes(o.value)} onChange={(e) => toggle(o.value, e.target.checked)} />
            <span>{o.label}</span>
          </label>
        ))}
      </div>
    </FieldShell>
  );
}

export function DateControl({ field, value, onChange, id, error }: ControlProps<DateField>) {
  const current = str(value);
  return (
    <FieldShell id={id} label={field.label} help={field.help} error={error}>
      <div className="adm-inline">
        <input id={id} type="date" value={current} onChange={(e) => onChange(e.target.value)} {...describedBy(id, field.help, error)} />
        <button type="button" className="adm-btn adm-btn--quiet" onClick={() => onChange("")} disabled={!current}>Clear</button>
      </div>
    </FieldShell>
  );
}
