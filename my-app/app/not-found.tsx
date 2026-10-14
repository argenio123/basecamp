import Link from "next/link";

export default function NotFound() {
  return <section className="not-found shell"><p className="eyebrow">404</p><h1>This path hasn&apos;t been built yet.</h1><p>Return to Basecamp and keep exploring.</p><Link className="button button-dark" href="/">Back to home</Link></section>;
}
