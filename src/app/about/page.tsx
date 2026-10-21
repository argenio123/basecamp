import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import CtaBand from "@/components/sections/CtaBand";
import PageHero from "@/components/sections/PageHero";
import AtAGlance from "@/components/ui/AtAGlance";
import { getSections } from "@/content/sitemap";

const ABOUT_CATEGORIES = getSections([]).find((section) => section.id === "about")?.menu.highlights ?? [];

const ABOUT_CATEGORY_IMAGES: Record<string, string> = {
  "/about#vision": "/images/facilities/facility-exterior.jpg",
  "/about#pillars": "/images/destination/train.png",
  "/about/design": "/images/facilities/facility-background-a1-5-b.jpg",
  "/about/the-build": "/images/facilities/facility-render-a1-3.jpg",
  "/about#different": "/images/destination/transform.png",
};

export const metadata: Metadata = {
  title: "About",
  description: "BaseCamp CamSur brings performance training, recovery and community together in one purpose-built destination.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="About BaseCamp CamSur"
        intro="Training, recovery and community—together."
        image="/images/facilities/facility-exterior.jpg"
        imageAlt="BaseCamp CamSur facility surrounded by tropical landscape"
      />

      <AtAGlance
        id="story"
        eyebrow="Our story"
        ghost="About"
        summary="BaseCamp CamSur is a purpose-built destination where performance training, recovery and community come together, surrounded by the energy and landscape of CamSur."
      />

      <section className="ab-about-categories" aria-labelledby="about-categories-title">
        <div className="shell">
          <p className="eyebrow eyebrow-light" id="about-categories-title">About highlights</p>
          <nav aria-label="About categories">
            <ul className="ab-about-category-list" data-reveal="stagger">
              {ABOUT_CATEGORIES.map((category) => {
                const anchorId = category.href.startsWith("/about#")
                  ? category.href.split("#")[1]
                  : undefined;

                return (
                  <li key={category.href}>
                    <Link href={category.href} id={anchorId}>
                      <span className="ab-about-category-media" aria-hidden="true">
                        <Image
                          src={ABOUT_CATEGORY_IMAGES[category.href]}
                          alt=""
                          fill
                          sizes="(max-width: 760px) 100vw, (max-width: 1040px) 50vw, 34vw"
                          className="ab-about-category-image"
                        />
                        <span className="ab-about-category-shade" />
                      </span>
                      <span className="ab-about-category-copy">
                        <strong>{category.label}</strong>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </section>

      <CtaBand eyebrow="Early members" className="ab-cta-expanded" />
    </>
  );
}
