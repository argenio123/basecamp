"use client";

import type { PriceField } from "@/content/editor-schema";
import { formatPhp } from "@/content/format";
import type { Price } from "@/content/types";
import { describedBy, FieldShell, fieldId, type ControlProps } from "./inputs";

type Props = ControlProps<PriceField> & { path: string; errors: Record<string, string> };

const toNumber = (raw: string): number | string => (raw === "" ? "" : Number.isFinite(Number(raw)) ? Number(raw) : raw);

// Price: "From" and optional "To" in pesos, or "On request" (null). Spec §D.7.
export default function PriceInput({ field, value, onChange, id, error, path, errors }: Props) {
  const price = value && typeof value === "object" ? (value as { min: unknown; max: unknown }) : null;
  const minId = fieldId(`${path}.min`);
  const maxId = fieldId(`${path}.max`);
  const minError = errors[`${path}.min`];
  const maxError = errors[`${path}.max`];
  const preview = price && typeof price.min === "number" && (price.max === null || typeof price.max === "number") ? formatPhp(price as Price) : price ? "" : formatPhp(null);
  return (
    <FieldShell id={id} label={field.label} help={field.help} error={error} wide group>
      <div className="adm-price">
        <label className="adm-check">
          <input type="checkbox" checked={!price} onChange={(e) => onChange(e.target.checked ? null : { min: 0, max: null })} />
          <span>On request</span>
        </label>
        {price && (
          <>
            <label className="adm-mini" htmlFor={minId}>
              From (₱)
              <input id={minId} type="number" inputMode="numeric" min={0} step={1} value={price.min === null || price.min === undefined ? "" : String(price.min)}
                onChange={(e) => onChange({ ...price, min: toNumber(e.target.value) })} {...describedBy(minId, undefined, minError)} />
            </label>
            <label className="adm-mini" htmlFor={maxId}>
              To (₱, optional)
              <input id={maxId} type="number" inputMode="numeric" min={0} step={1} value={price.max === null || price.max === undefined ? "" : String(price.max)}
                onChange={(e) => onChange({ ...price, max: e.target.value === "" ? null : toNumber(e.target.value) })} {...describedBy(maxId, undefined, maxError)} />
            </label>
          </>
        )}
        {preview && <span className="adm-muted">Shows as {preview}</span>}
      </div>
      {minError && <p className="adm-field-error" id={`${minId}-error`}>{minError}</p>}
      {maxError && <p className="adm-field-error" id={`${maxId}-error`}>{maxError}</p>}
    </FieldShell>
  );
}
