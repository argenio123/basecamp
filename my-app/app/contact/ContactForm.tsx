"use client";

import { useState } from "react";

const inputClass =
  "mt-2 w-full rounded-lg border border-border bg-surface px-4 py-2.5 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30";

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="mt-10 rounded-2xl border border-border bg-surface p-8 text-center">
        <h2 className="text-xl font-semibold">Thanks for reaching out!</h2>
        <p className="mt-2 text-muted">We&apos;ll be in touch soon.</p>
      </div>
    );
  }

  return (
    <form
      className="mt-10 space-y-6"
      onSubmit={(event) => {
        // Demo only: no backend is wired up yet.
        event.preventDefault();
        setSent(true);
      }}
    >
      <div>
        <label htmlFor="name" className="text-sm font-medium">Name</label>
        <input id="name" name="name" required className={inputClass} />
      </div>
      <div>
        <label htmlFor="email" className="text-sm font-medium">Email</label>
        <input id="email" name="email" type="email" required className={inputClass} />
      </div>
      <div>
        <label htmlFor="message" className="text-sm font-medium">Message</label>
        <textarea id="message" name="message" rows={5} required className={inputClass} />
      </div>
      <button
        type="submit"
        className="inline-flex h-12 items-center justify-center rounded-full bg-accent px-6 font-medium text-white transition-colors hover:bg-accent-hover dark:text-black"
      >
        Send message
      </button>
    </form>
  );
}
