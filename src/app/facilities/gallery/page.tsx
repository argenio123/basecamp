import type { Metadata } from "next";
import Image from "next/image";
import SocialGallery from "@/components/SocialGallery";
import { DetailTemplate } from "@/components/nav/PageTemplates";
import CtaBand from "@/components/sections/CtaBand";
import PageHero from "@/components/sections/PageHero";
import { getSiteContent } from "@/content/get";
import { FACILITIES_CTA, GALLERY, GALLERY_HERO } from "@/data/facilities";

export const metadata: Metadata = {
  title: "Facility gallery",
  description: "Architectural renders of the BaseCamp CamSur facility in Camarines Sur, plus the latest posts from the build and the community.",
};

// Stage-3 §1: /facilities/gallery holds [gallery]. The social posts (admin "Gallery" tab, the tab this page's
// "Edit this page" pill opens) follow when the homepage socials block is enabled and has posts.
export default async function FacilitiesGalleryPage() {
  const c = await getSiteContent();
  const posts = c.home.social.enabled ? c.gallery.posts : [];
  const instagram = c.settings.socials.find((s) => s.platform === "Instagram" && s.url);

  return (
    <DetailTemplate
      path="/facilities/gallery"
      hero={<PageHero {...GALLERY_HERO} />}
      glance={{
        summary: `Renders of the planned facility, designed so every angle works for photography and video${posts.length > 0 ? ", plus the latest posts from BaseCamp CamSur" : ""}.`,
        facts: [
          { label: "Renders", value: String(GALLERY.images.length) },
          posts.length > 0 && { label: "Social posts", value: String(posts.length) },
          instagram?.handle && { label: instagram.platform, value: instagram.handle },
        ],
      }}
      related={["/about/design", "/about/the-build", "/facilities/lifestyle#signature-spaces"]}
      cta={<CtaBand {...FACILITIES_CTA} />}
    >
      <section id="gallery" className="fc-gallery">
        <div className="shell split-heading light-split" data-reveal><div><p className="eyebrow">{GALLERY.eyebrow}</p><h2>Architectural renders.</h2></div><p>The exterior, the front approach, architectural details and the site in its landscape.</p></div>
        <div className="gallery-grid shell" data-reveal="stagger">
          {GALLERY.images.slice(0, 4).map((img) => <div key={img.src} className={`image-frame${img.wide ? " gallery-wide" : ""}`}><Image src={img.src} alt={img.alt} fill sizes={img.wide ? "(max-width: 760px) 100vw, 60vw" : "(max-width: 760px) 100vw, 40vw"} className="cover-image" /></div>)}
          <div className="gallery-quote"><p>{GALLERY.quote}</p><span>BASECAMP CAMSUR</span></div>
          {GALLERY.images.slice(4).map((img) => <div key={img.src} className="image-frame fc-gallery-pano"><Image src={img.src} alt={img.alt} fill sizes="100vw" className="cover-image" /></div>)}
        </div>
      </section>

      {posts.length > 0 && <SocialGallery socials={c.settings.socials} eyebrow={c.gallery.eyebrow} title={c.gallery.title} intro={c.gallery.intro} posts={posts} followHref={instagram?.url ?? ""} handle={instagram?.handle || undefined} />}
    </DetailTemplate>
  );
}
