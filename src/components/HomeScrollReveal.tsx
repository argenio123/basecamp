// Kept as a no-op so the frozen homepage JSX (`<HomeScrollReveal />` in src/app/page.tsx) stays byte-identical.
// The reveal behaviour moved, unchanged, into the site-wide <SiteReveal /> mounted once in the root layout
// (src/components/ui/SiteReveal.tsx), which also handles the homepage's data-home-reveal elements.
export default function HomeScrollReveal() {
  return null;
}
