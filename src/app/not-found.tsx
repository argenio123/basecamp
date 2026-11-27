import Link from "next/link";
import { UI } from "@/i18n/ui";

// One prerendered 404 serves every unknown URL, including /fil/…, so it says the same thing in both languages
// instead of guessing the locale (src/i18n/README.md). Text: ui.ts notFound.
export default function NotFound() {
  const en = UI.en.notFound;
  const fil = UI.fil.notFound;
  return (
    <section className="not-found shell">
      <p className="eyebrow">{en.eyebrow}</p>
      <h1>{en.title}</h1>
      <p>{en.body}</p>
      <p lang="fil">{fil.title} {fil.body}</p>
      <div className="button-row">
        <Link className="button button-dark" href="/">{en.back}</Link>
        <Link className="button button-dark" href="/fil" hrefLang="fil" lang="fil">{fil.back}</Link>
      </div>
    </section>
  );
}
