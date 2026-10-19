"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type NavigatorWithConnection = Navigator & {
  connection?: { saveData?: boolean };
};

/** Decorative hero media. The poster is always available; motion is loaded only when the visitor allows it. */
export default function HomeHeroMedia() {
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const saveData = (navigator as NavigatorWithConnection).connection?.saveData === true;
    const update = () => setShowVideo(!reducedMotion.matches && !saveData);

    update();
    reducedMotion.addEventListener("change", update);
    return () => reducedMotion.removeEventListener("change", update);
  }, []);

  return (
    <>
      <Image
        src="/images/hero/hero-training.png"
        alt=""
        fill
        sizes="100vw"
        className="home-hero-poster"
        preload
      />
      {showVideo && (
        <video className="home-hero-video" autoPlay muted loop playsInline preload="metadata" aria-hidden="true" tabIndex={-1}>
          <source src="https://res.cloudinary.com/nkk9rbc7/video/upload/basecamp-hero.mp4" type="video/mp4" />
        </video>
      )}
    </>
  );
}
