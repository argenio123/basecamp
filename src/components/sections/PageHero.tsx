import Image from "next/image";

type PageHeroProps = {
  /** Optional small label above the title. */
  eyebrow?: string;
  title: string;
  intro: string;
  image: string;
  imageAlt: string;
  align?: "left" | "bottom";
};

export default function PageHero({ eyebrow, title, intro, image, imageAlt, align = "bottom" }: PageHeroProps) {
  return (
    <section className={`page-hero page-hero-${align}`}>
      <Image src={image} alt={imageAlt} fill preload sizes="100vw" className="cover-image" />
      <div className="hero-shade" />
      <div className="shell page-hero-content">
        {eyebrow && <p className="eyebrow eyebrow-light">{eyebrow}</p>}
        <h1>{title}</h1>
        <p>{intro}</p>
      </div>
    </section>
  );
}
