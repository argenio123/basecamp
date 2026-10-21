import Image from "next/image";

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
};

const VARIANT_LABEL: Record<ClassesEditorialHeroProps["variant"], string> = {
  overview: "Class system",
  race: "Race format",
  industrial: "Strength floor",
  documentary: "Coach led",
  restore: "Reset ritual",
  team: "Group format",
};

export default function ClassesEditorialHero({ chapter, eyebrow, title, intro, image, imageAlt, variant, stat, statLabel, minimalMeta = false }: ClassesEditorialHeroProps) {
  return (
    <section className={`pr-editorial-hero pr-editorial-hero-${variant}`} aria-labelledby="pr-editorial-title">
      <Image src={image} alt={imageAlt} fill priority sizes="100vw" className="pr-editorial-image" />
      <span className="pr-editorial-shade" aria-hidden="true" />
      <div className="shell pr-editorial-inner">
        {!minimalMeta && <div className="pr-editorial-kicker"><span>{chapter}</span><p>{eyebrow}</p><strong>{VARIANT_LABEL[variant]}</strong></div>}
        <h1 id="pr-editorial-title">{title}</h1>
        <div className={`pr-editorial-foot${minimalMeta ? " pr-editorial-foot-minimal" : ""}`}>
          <p>{intro}</p>
          {!minimalMeta && stat && <div><strong>{stat}</strong><span>{statLabel}</span></div>}
        </div>
      </div>
    </section>
  );
}
