"use client";

import Image from "next/image";
import { IMAGE_OPTIONS, type ImageField } from "@/content/editor-schema";
import { isLibraryImage } from "@/content/images";
import { describedBy, FieldShell, type ControlProps } from "./inputs";

// Images are chosen from the allow-listed library only (spec §D.7, §D.8.6), with a 96px thumbnail.
export default function ImagePicker({ field, value, onChange, id, error }: ControlProps<ImageField>) {
  const current = typeof value === "string" ? value : "";
  const known = isLibraryImage(current);
  return (
    <FieldShell id={id} label={field.label} help={field.help} error={error} wide>
      <div className="adm-image">
        {known ? (
          <Image src={current} alt="" width={96} height={64} className="adm-thumb" sizes="96px" />
        ) : (
          <span className="adm-thumb adm-thumb--empty" aria-hidden="true" />
        )}
        <select id={id} value={current} onChange={(e) => onChange(e.target.value)} {...describedBy(id, field.help, error)}>
          {!known && <option value={current}>{current ? `${current} (not in library)` : "Choose an image…"}</option>}
          {IMAGE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
    </FieldShell>
  );
}
