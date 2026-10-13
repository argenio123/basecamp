import type { Metadata } from "next";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="text-4xl font-bold tracking-tight">Get in touch</h1>
      <p className="mt-4 text-lg leading-8 text-muted">
        Questions about a trip, or want help picking one? Send us a note and a
        guide will get back to you within two days.
      </p>
      <ContactForm />
    </section>
  );
}
