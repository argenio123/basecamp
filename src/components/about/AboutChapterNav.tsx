"use client";

import { useEffect, useState } from "react";

export type AboutChapter = { id: string; label: string };

export default function AboutChapterNav({ items, label }: { items: readonly AboutChapter[]; label: string }) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const sections = items.flatMap((item) => {
      const element = document.getElementById(item.id);
      return element ? [element] : [];
    });
    if (sections.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (visible?.target.id) setActive(visible.target.id);
    }, { rootMargin: "-28% 0px -58% 0px", threshold: [0, 0.1] });

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav className="ab-chapter-nav" aria-label={label}>
      <div className="shell ab-chapter-nav-inner">
        <p>{label}</p>
        <ol>
          {items.map((item, index) => (
            <li key={item.id}>
              <a href={`#${item.id}`} aria-current={active === item.id ? "location" : undefined}>
                <span>{String(index + 1).padStart(2, "0")}</span>{item.label}
              </a>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
