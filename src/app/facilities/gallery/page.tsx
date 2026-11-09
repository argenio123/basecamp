import type { Metadata } from "next";
import Image from "next/image";
import PhotoStrip from "@/components/features/PhotoStrip";
import { DetailTemplate } from "@/components/nav/PageTemplates";
import CtaBand from "@/components/sections/CtaBand";
import PageHero from "@/components/sections/PageHero";
import { FACILITIES_CTA, GALLERY, GALLERY_HERO } from "@/data/facilities";

export const metadata: Metadata = {
  title: "Facility gallery",
  description: "Explore architectural renders of BaseCamp CamSur's first-floor training, welcome, work, changing, and social spaces.",
};

export default function FacilitiesGalleryPage() {
  return (
    <DetailTemplate
      path="/facilities/gallery"
      hero={<PageHero {...GALLERY_HERO} />}
      glance={{
        summary: "A room-by-room look at the planned first floor, from arrival and training to changing, work, and social spaces.",
        facts: [{ label: "Renders", value: String(GALLERY.images.length) }],
      }}
      marquee={false}
      related={false}
      cta={<CtaBand {...FACILITIES_CTA} />}
    >
      <section id="gallery" className="fc-gallery">
        <div className="shell split-heading light-split" data-reveal><div><p className="eyebrow">{GALLERY.eyebrow}</p><h2>Inside the first floor.</h2></div><p>Explore the welcome, training, work, social, and changing spaces room by room.</p></div>
        <div className="gallery-grid shell" data-reveal="stagger">
          {GALLERY.images.slice(0, 4).map((img) => <div key={img.src} className={`image-frame${img.wide ? " gallery-wide" : ""}`}><Image src={img.src} alt={img.alt} fill sizes={img.wide ? "(max-width: 760px) 100vw, 60vw" : "(max-width: 760px) 100vw, 40vw"} className="cover-image" /></div>)}
          <div className="gallery-quote"><p>{GALLERY.quote}</p><span>BASECAMP CAMSUR</span></div>
          {GALLERY.images.slice(4).map((img) => <div key={img.src} className="image-frame"><Image src={img.src} alt={img.alt} fill sizes="(max-width: 760px) 100vw, 50vw" className="cover-image" /></div>)}
        </div>
      </section>

      <PhotoStrip photos={[
        { image: "/images/facilities/1st floor- lobby-v2.png", alt: "Architectural render of the BaseCamp lobby", caption: "Welcome" },
        { image: "/images/facilities/1st floor- crossfit area-v2.png", alt: "Architectural render of the CrossFit-style area", caption: "Train" },
        { image: "/images/facilities/1st floor- yoga-v2.png", alt: "Architectural render of the yoga studio", caption: "Move" },
        { image: "/images/facilities/1st floor- cafeteria-v2.png", alt: "Architectural render of the cafeteria", caption: "Refuel" },
      ]} />
    </DetailTemplate>
  );
}
