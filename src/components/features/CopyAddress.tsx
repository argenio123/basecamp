"use client";

import { useState } from "react";

/** Copy-to-clipboard pill (address by default, e.g. "Copy email" too); confirms for two seconds. */
export default function CopyAddress({ text, className, label = "Copy address", copiedLabel = "Address copied" }: { text: string; className?: string; label?: string; copiedLabel?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked (e.g. insecure context): nothing to do; the text is on screen.
    }
  };
  return (
    <button type="button" className={className} onClick={copy} aria-live="polite">
      {copied ? copiedLabel : label}
    </button>
  );
}
