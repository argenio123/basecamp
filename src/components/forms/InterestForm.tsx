"use client";

import { FormEvent, useState } from "react";
import { programs } from "@/data/site";

export default function InterestForm({ program }: { program?: string }) {
  const selectedProgram = programs.find((item) => item.slug === program);
  const [submitted, setSubmitted] = useState(false);
  function handleSubmit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setSubmitted(true); }

  if (submitted) {
    return (
      <div className="form-success" role="status">
        <span aria-hidden="true">✓</span><h2>You&apos;re on the early-access list.</h2>
        <p>Thanks for your interest. We&apos;ll share confirmed opening and membership details when they are ready.</p>
        <button type="button" className="text-link" onClick={() => setSubmitted(false)}>Submit another response</button>
      </div>
    );
  }

  return (
    <form className="interest-form" onSubmit={handleSubmit}>
      <div className="field-row"><label>First name<input name="firstName" autoComplete="given-name" required /></label><label>Last name<input name="lastName" autoComplete="family-name" required /></label></div>
      <label>Email address<input type="email" name="email" autoComplete="email" required /></label>
      <label>Mobile number<input type="tel" name="phone" autoComplete="tel" /></label>
      <label>I&apos;m most interested in<select name="interest" defaultValue={selectedProgram ? "Training and coaching" : ""}><option value="" disabled>Select an area</option><option>Membership</option><option>Training and coaching</option><option>Classes and community</option><option>Recovery and wellness</option><option>Visiting the facility</option></select></label>
      <label>Program<select name="program" defaultValue={selectedProgram?.slug ?? ""}><option value="">Not sure yet</option>{programs.map((item) => <option key={item.slug} value={item.slug}>{item.title}</option>)}</select></label>
      <label>Message<textarea name="message" rows={4} placeholder="Tell us what you would like to know." /></label>
      <label className="check-field"><input type="checkbox" required /><span>I agree to receive Basecamp CamSur opening updates.</span></label>
      <button className="button button-dark" type="submit">Register interest <span>↗</span></button>
      <p className="form-note">This preview form does not send data to a server yet.</p>
    </form>
  );
}
