import Image from "next/image";
import AiImageLabel, { imageKind, labelledImageAlt, type ImageKind } from "@/components/ui/AiImageLabel";
import HeroVideo, { type HeroVideoSource } from "./HeroVideo";

type PageHeroProps = {
  /** Optional small label above the title. */
  eyebrow?: string;
  title: string;
  intro: string;
  /** Hero photo (not shown when a `video` is set). */
  image: string;
  imageAlt: string;
  /** Focal point of the photo (CSS object-position), so phones and tablets crop around the subject. */
  imagePosition?: string;
  align?: "left" | "bottom";
  /** Optional background video, shown instead of the photo. */
  video?: HeroVideoSource;
  /** Fill the whole screen height instead of the standard hero height. */
  fullHeight?: boolean;
  /** With a `video`: size the hero to the video's 16:9 frame so none of it is cropped (text moves below it on phones). */
  fitVideo?: boolean;
  /** Set false to show the hero without its entrance animation (text rise, photo zoom). */
  animate?: boolean;
  /** Label the photo "AI-generated image". Automatic by default (see imageKind): AI images under a `/generated/`
   *  folder get "AI-generated image", facility renders get "Concept render". false turns the label off. */
  aiGenerated?: boolean;
};

export default function PageHero({ eyebrow, title, intro, image, imageAlt, imagePosition, align = "bottom", video, fullHeight = false, fitVideo = false, animate = true, aiGenerated }: PageHeroProps) {
  // AI photos of people must not pass as real members or staff, nor renders as the finished building: label the
  // photo and say so in its alt text.
  const kind: ImageKind | null = video || aiGenerated === false ? null : aiGenerated ? "ai" : imageKind(image);
  return (
    <section className={`page-hero page-hero-${align}${fullHeight ? " page-hero--full" : ""}${video ? " page-hero--video" : ""}${video && fitVideo ? " page-hero--ratio" : ""}${animate ? "" : " page-hero--static"}`}>
      {/* Video heroes use the supplied photo as a responsive loading poster; other heroes keep the optimized image. */}
      {video ? <HeroVideo {...video} poster={video.poster ?? image} /> : <Image src={image} alt={labelledImageAlt(imageAlt, kind)} fill preload sizes="100vw" className="cover-image" style={imagePosition ? { objectPosition: imagePosition } : undefined} />}
      <div className="hero-shade" />
      {kind && <AiImageLabel kind={kind} className="ai-label--hero" hidden={!!imageAlt.trim()} />}
      <div className="shell page-hero-content">
        {eyebrow && <p className="eyebrow eyebrow-light">{eyebrow}</p>}
        <h1>{title}</h1>
        <p>{intro}</p>
      </div>
    </section>
  );
}
