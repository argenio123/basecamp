// The page scrolls on <html> (it has overflow-x: clip), so locking <body> alone
// doesn't stop it. Lock the root and reserve the scrollbar gutter to avoid layout shift.
export function lockPageScroll() {
  const root = document.documentElement;
  const previous = { overflow: root.style.overflow, scrollbarGutter: root.style.scrollbarGutter };

  root.style.overflow = "hidden";
  root.style.scrollbarGutter = "stable";

  return () => {
    root.style.overflow = previous.overflow;
    root.style.scrollbarGutter = previous.scrollbarGutter;
  };
}
