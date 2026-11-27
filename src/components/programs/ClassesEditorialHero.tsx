import Image from "next/image";
import AiImageLabel, { aiImageAlt, isAiGeneratedImage } from "@/components/ui/AiImageLabel";
import { t } from "@/i18n/server";

type ClassesEditorialHeroProps = {
  chapter: string;
  eyebrow: string;
  title: string;
  intro: string;
  image: string;
  imageAlt: string;
  variant: "overview" | "race" | "industrial" | "documentary" | "restore" | "team";
  stat?: string;
  statLabel?: string;
  minimalMeta?: boolean;
  /** Size the hero to the photo's own 1920×1072 frame on desktop so the whole image shows (no top/bottom crop). */
  fullImage?: boolean;
  flipImage?: boolean;
};

const VARIANT_LABEL: Record<ClassesEditorialHeroProps["variant"], string> = {
  overview: "Class system",
  race: "Race format",
  industrial: "Strength floor",
  documentary: "Coach led",
  restore: "Reset ritual",
  team: "Group format",
};

export default function ClassesEditorialHero({ chapter, eyebrow, title, intro, image, imageAlt, variant, stat, statLabel, minimalMeta = false, fullImage = false, flipImage = false }: ClassesEditorialHeroProps) {
  const ai = isAiGeneratedImage(image);
  return (
    <section className={`pr-editorial-hero pr-editorial-hero-${variant}${fullImage ? " pr-editorial-hero--full-image" : ""}`} aria-labelledby="pr-editorial-title">
      <div className={`pr-editorial-media${flipImage ? " is-flipped" : ""}`}>
        <Image src={image} alt={ai ? aiImageAlt(imageAlt) : imageAlt} fill preload sizes="100vw" className="pr-editorial-image" />
      </div>
      <span className="pr-editorial-shade" aria-hidden="true" />
      {ai && <AiImageLabel className="ai-label--hero" hidden={!!imageAlt.trim()} />}
      <div className="shell pr-editorial-inner">
        {!minimalMeta && <div className="pr-editorial-kicker"><span>{chapter}</span><p>{eyebrow}</p><strong>{t(VARIANT_LABEL[variant])}</strong></div>}
        <h1 id="pr-editorial-title">{title}</h1>
        <div className={`pr-editorial-foot${minimalMeta ? " pr-editorial-foot-minimal" : ""}`}>
          <p>{intro}</p>
          {!minimalMeta && stat && <div><strong>{stat}</strong><span>{statLabel}</span></div>}
        </div>
      </div>
    </section>
  );
}
