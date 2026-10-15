import type { Metadata } from "next";
import InterestForm from "@/components/forms/InterestForm";

export const metadata: Metadata = { title: "Contact & Early Access", description: "Contact Basecamp CamSur and register for opening updates." };

export default function ContactPage() {
  return <section className="contact-page"><div className="shell contact-grid"><div className="contact-intro"><p className="eyebrow">Contact · Early access</p><h1>Be there<br />from the start.</h1><p className="lead">Tell us what you&apos;re interested in and be among the first to receive confirmed membership, program, tour, and opening information.</p><div className="contact-note"><span>BASECAMP CAMSUR</span><p>Camarines Sur, Philippines<br />Opening details to be announced</p></div></div><div className="form-card"><p className="eyebrow">Register your interest</p><InterestForm /></div></div></section>;
}
