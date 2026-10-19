"use client";

import { useSyncExternalStore } from "react";

const BUILD_YEAR = 2026;
const subscribe = () => () => undefined;

/** Keeps the static shell deterministic while showing the visitor's current calendar year after hydration. */
export default function CopyrightYear() {
  const year = useSyncExternalStore(subscribe, () => new Date().getFullYear(), () => BUILD_YEAR);
  return <>{year}</>;
}
