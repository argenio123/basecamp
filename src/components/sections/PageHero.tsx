import Image from "next/image";
import AiImageLabel, { imageKind, labelledImageAlt, type ImageKind } from "@/components/ui/AiImageLabel";
import { getLocale } from "@/i18n/server";
import HeroVideo, { type HeroVideoSource } from "./HeroVideo";

/**
 * Hero layouts, so each section opens differently (CSS only, see "Page hero variants" in globals.css):
 * - "full" (default): full-bleed photo or video, headline bottom-left.
 * - "split": headline on ink on the left, photo on the right (desktop/tablet); photo above the text on phones.
 * - "editorial": oversized headline on ink with the photo set as a framed inset with caption (`frame="inset"`),
 *   or as a short full-width band along the bottom (`frame="band"`).
 * - "stat": full-bleed photo or video with the headline and a solid strip of 2–3 key `facts` along the bottom.
 * - "compact": a shorter (~60% screen) full-bleed banner for utility pages, so the content is reached sooner.
 */
export type PageHeroVariant = "full" | "split" | "editorial" | "stat" | "compact";
/** Same shape as the "At a glance" fact chips (GlanceFact); facts without a label are skipped. */
export type PageHeroFact = { value: string; label?: string };

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
  /** Optional background video, shown instead of the photo ("full" and "stat" variants). */
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
  /** Layout (see PageHeroVariant). Default "full". */
  variant?: PageHeroVariant;
  /** "stat" only: 2–3 key facts taken from the page content (never invented). Empty values are dropped; max 3. */
  facts?: readonly (PageHeroFact | null | undefined | false)[];
  /** "editorial" only: how the photo sits under the headline. Default "inset". */
  frame?: "inset" | "band";
  /** "editorial" only: short caption under the photo (visible text, so keep it factual). */
  caption?: string;
};

/** Image `sizes` per layout, so the browser preloads the right file for the box the photo actually fills. */
const SIZES: Record<PageHeroVariant, string> = {
  full: "100vw",
  split: "(max-width: 760px) 100vw, 50vw",
  editorial: "(max-width: 760px) 100vw, 48vw",
  stat: "100vw",
  compact: "100vw",
};

export default function PageHero({ eyebrow, title, intro, image, imageAlt, imagePosition, align = "bottom", video, fullHeight = false, fitVideo = false, animate = true, aiGenerated, variant = "full", facts = [], frame = "inset", caption }: PageHeroProps) {
  // AI photos of people must not pass as real members or staff, nor renders as the finished building: label the
  // photo and say so in its alt text.
  const hasVideo = !!video && (variant === "full" || variant === "stat");
  const kind: ImageKind | null = hasVideo || aiGenerated === false ? null : aiGenerated ? "ai" : imageKind(image);
  const locale = getLocale();
  const copy = (
    <div className="shell page-hero-content">
      {eyebrow && <p className="eyebrow eyebrow-light">{eyebrow}</p>}
      <h1>{title}</h1>
      <p>{intro}</p>
    </div>
  );

  if (variant === "full") {
    return (
      <section className={`page-hero page-hero-${align}${fullHeight ? " page-hero--full" : ""}${video ? " page-hero--video" : ""}${video && fitVideo ? " page-hero--ratio" : ""}${animate ? "" : " page-hero--static"}`}>
        {/* Video heroes use the supplied photo as a responsive loading poster; other heroes keep the optimized image. */}
        {video ? <HeroVideo {...video} poster={video.poster ?? image} /> : <Image src={image} alt={labelledImageAlt(imageAlt, kind, locale)} fill preload sizes="100vw" className="cover-image" style={imagePosition ? { objectPosition: imagePosition } : undefined} />}
        <div className="hero-shade" />
        {kind && <AiImageLabel kind={kind} className="ai-label--hero" hidden={!!imageAlt.trim()} />}
        {copy}
      </section>
    );
  }

  const photo = (
    <Image src={image} alt={labelledImageAlt(imageAlt, kind, locale)} fill preload sizes={variant === "editorial" && frame === "band" ? "100vw" : SIZES[variant]} className="cover-image" style={imagePosition ? { objectPosition: imagePosition } : undefined} />
  );
  const label = (className: string) => kind && <AiImageLabel kind={kind} className={className} hidden={!!imageAlt.trim()} />;
  const classes = `page-hero page-hero--${variant}${variant === "editorial" ? ` page-hero--${frame}` : ""}${hasVideo ? " page-hero--video" : ""}${animate ? "" : " page-hero--static"}`;

  if (variant === "split") {
    return (
      <section className={classes}>
        {copy}
        <div className="page-hero-media">
          {photo}
          {label("ai-label--hero")}
        </div>
      </section>
    );
  }

  if (variant === "editorial") {
    return (
      <section className={classes}>
        {copy}
        <figure className="page-hero-figure">
          <div className="page-hero-media">
            {photo}
            {label("ai-label--corner")}
          </div>
          {caption && <figcaption>{caption}</figcaption>}
        </figure>
      </section>
    );
  }

  // "stat" and "compact": full-bleed media behind the copy.
  const shown = facts.filter((f): f is Required<PageHeroFact> => !!f && f.value.trim() !== "" && !!f.label?.trim()).slice(0, 3);
  return (
    <section className={classes}>
      {hasVideo && video ? <HeroVideo {...video} poster={video.poster ?? image} /> : photo}
      <div className="hero-shade" />
      {label("ai-label--hero")}
      {copy}
      {variant === "stat" && shown.length > 0 && (
        <div className="page-hero-facts">
          <dl className="shell">
            {shown.map((f) => (
              <div key={`${f.value}${f.label}`}>
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </section>
  );
}
