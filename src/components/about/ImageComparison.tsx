"use client";

import Image from "next/image";
import { useState } from "react";
import { useLocale } from "@/i18n/client";
import { fmt } from "@/i18n/ui";
import { UI_VISIT_ABOUT } from "@/i18n/ui-sections/visit-about";

type ComparisonImage = { src: string; alt: string; label: string };

export default function ImageComparison({ first, second }: { first: ComparisonImage; second: ComparisonImage }) {
  const ui = UI_VISIT_ABOUT[useLocale()].comparison;
  const [position, setPosition] = useState(52);

  return (
    <figure className="ab-comparison">
      <div className="ab-comparison-frame">
        <Image src={second.src} alt={second.alt} fill sizes="100vw" className="cover-image" />
        <div className="ab-comparison-layer" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
          <Image src={first.src} alt={first.alt} fill sizes="100vw" className="cover-image" />
        </div>
        <span className="ab-comparison-label ab-comparison-label--first">{first.label}</span>
        <span className="ab-comparison-label ab-comparison-label--second">{second.label}</span>
        <span className="ab-comparison-handle" style={{ left: `${position}%` }} aria-hidden="true"><i /></span>
        <input
          type="range"
          min="0"
          max="100"
          value={position}
          onChange={(event) => setPosition(Number(event.target.value))}
          aria-label={fmt(ui.compare, { first: first.label, second: second.label })}
        />
      </div>
      <figcaption>{ui.caption}</figcaption>
    </figure>
  );
}
