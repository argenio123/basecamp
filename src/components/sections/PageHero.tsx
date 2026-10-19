import Image from "next/image";
import HeroVideo, { type HeroVideoSource } from "./HeroVideo";

type PageHeroProps = {
  /** Optional small label above the title. */
  eyebrow?: string;
  title: string;
  intro: string;
  /** Hero photo (not shown when a `video` is set). */
  image: string;
  imageAlt: string;
  align?: "left" | "bottom";
  /** Optional background video, shown instead of the photo. */
  video?: HeroVideoSource;
  /** Fill the whole screen height instead of the standard hero height. */
  fullHeight?: boolean;
  /** With a `video`: size the hero to the video's 16:9 frame so none of it is cropped (text moves below it on phones). */
  fitVideo?: boolean;
  /** Set false to show the hero without its entrance animation (text rise, photo zoom). */
  animate?: boolean;
};

export default function PageHero({ eyebrow, title, intro, image, imageAlt, align = "bottom", video, fullHeight = false, fitVideo = false, animate = true }: PageHeroProps) {
  return (
    <section className={`page-hero page-hero-${align}${fullHeight ? " page-hero--full" : ""}${video ? " page-hero--video" : ""}${video && fitVideo ? " page-hero--ratio" : ""}${animate ? "" : " page-hero--static"}`}>
      {/* A video hero shows only the video (no still picture first); other heroes use the photo. */}
      {video ? <HeroVideo {...video} /> : <Image src={image} alt={imageAlt} fill preload sizes="100vw" className="cover-image" />}
      <div className="hero-shade" />
      <div className="shell page-hero-content">
        {eyebrow && <p className="eyebrow eyebrow-light">{eyebrow}</p>}
        <h1>{title}</h1>
        <p>{intro}</p>
      </div>
    </section>
  );
}
