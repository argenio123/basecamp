"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

export default function RouteScrollReset() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    const root = document.documentElement;

    if (root.dataset.scrollAfterNavigation !== "top") {
      return;
    }

    delete root.dataset.scrollAfterNavigation;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return null;
}
