"use client";

import Image from "next/image";
import { useState } from "react";

type DesignPoint = { title: string; body: string };

const HOTSPOTS = [
  { left: "18%", top: "67%" },
  { left: "53%", top: "32%" },
  { left: "72%", top: "70%" },
  { left: "86%", top: "39%" },
] as const;

export default function DesignExplorer({ image, imageAlt, points }: { image: string; imageAlt: string; points: readonly DesignPoint[] }) {
  const [active, setActive] = useState(0);
  const selected = points[active];

  return (
    <div className="ab-explorer">
      <div className="ab-explorer-media">
        <Image src={image} alt={imageAlt} fill sizes="(max-width: 1040px) 100vw, 62vw" className="cover-image" />
        {points.map((point, index) => {
          const position = HOTSPOTS[index % HOTSPOTS.length];
          return (
            <button
              key={point.title}
              type="button"
              className="ab-explorer-hotspot"
              style={position}
              aria-label={`Show ${point.title}`}
              aria-pressed={active === index}
              aria-controls="ab-explorer-detail"
              onClick={() => setActive(index)}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
            </button>
          );
        })}
      </div>
      <div className="ab-explorer-panel" id="ab-explorer-detail" aria-live="polite">
        <p className="ab-explorer-count">Detail {String(active + 1).padStart(2, "0")} / {String(points.length).padStart(2, "0")}</p>
        <h3>{selected?.title}</h3>
        <p>{selected?.body}</p>
        <div className="ab-explorer-controls" aria-label="Architectural details">
          {points.map((point, index) => (
            <button key={point.title} type="button" aria-label={point.title} aria-pressed={active === index} onClick={() => setActive(index)} />
          ))}
        </div>
      </div>
    </div>
  );
}
