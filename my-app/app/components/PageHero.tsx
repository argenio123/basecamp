import Image from "next/image";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  intro: string;
  image: string;
  imageAlt: string;
  align?: "left" | "bottom";
};

export default function PageHero({ eyebrow, title, intro, image, imageAlt, align = "bottom" }: PageHeroProps) {
  return (
    <section className={`page-hero page-hero-${align}`}>
      <Image src={image} alt={imageAlt} fill priority sizes="100vw" className="cover-image" />
      <div className="hero-shade" />
      <div className="shell page-hero-content">
        <p className="eyebrow eyebrow-light">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{intro}</p>
      </div>
    </section>
  );
}
