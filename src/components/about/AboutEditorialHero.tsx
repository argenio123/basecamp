import Image from "next/image";

type AboutEditorialHeroProps = {
  chapter: string;
  eyebrow: string;
  title: string;
  intro: string;
  image: string;
  imageAlt: string;
  variant: "overview" | "design" | "build";
};

const VARIANT_LABEL: Record<AboutEditorialHeroProps["variant"], string> = {
  overview: "The story",
  design: "Design study",
  build: "Field notes",
};

export default function AboutEditorialHero({ chapter, eyebrow, title, intro, image, imageAlt, variant }: AboutEditorialHeroProps) {
  return (
    <section className={`ab-editorial-hero ab-editorial-hero--${variant}`}>
      <Image src={image} alt={imageAlt} fill preload sizes="100vw" className="ab-editorial-hero-image" />
      <div className="ab-editorial-hero-shade" />
      <div className="ab-editorial-grid" aria-hidden="true"><i /><i /><i /><i /></div>
      <div className="shell ab-editorial-hero-content">
        <p className="ab-editorial-kicker"><span>{chapter}</span>{eyebrow}</p>
        <h1>{title}</h1>
        <div className="ab-editorial-hero-foot">
          <p>{intro}</p>
          <p className="ab-editorial-edition">BaseCamp CamSur<br />{VARIANT_LABEL[variant]}</p>
        </div>
      </div>
    </section>
  );
}
