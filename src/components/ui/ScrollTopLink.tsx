"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { usePathname } from "next/navigation";

type ScrollTopLinkProps = ComponentProps<typeof Link>;

export default function ScrollTopLink({ onClick, target, ...props }: ScrollTopLinkProps) {
  const pathname = usePathname();

  return (
    <Link
      {...props}
      target={target}
      scroll={false}
      onClick={(event) => {
        onClick?.(event);

        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey ||
          target === "_blank"
        ) {
          return;
        }

        const destination =
          typeof props.href === "string"
            ? new URL(props.href, window.location.href).pathname
            : props.href.pathname;

        if (destination === pathname) {
          window.scrollTo({ top: 0, left: 0, behavior: "auto" });
          return;
        }

        document.documentElement.dataset.scrollAfterNavigation = "top";
      }}
    />
  );
}
