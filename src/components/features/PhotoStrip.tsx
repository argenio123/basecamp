import Image from "next/image";

export type StripPhoto = { image: string; alt: string; caption?: string };

/** Full-width row of four photos with an optional caption on each (reload-fitness.com image strip). */
export default function PhotoStrip({ photos }: { photos: readonly StripPhoto[] }) {
  if (photos.length === 0) return null;
  return (
    <section className="ft-strip" aria-label="Photos">
      <ul className="ft-strip-row" data-reveal="stagger">
        {photos.slice(0, 4).map((photo) => (
          <li key={photo.image} className="ft-strip-item">
            <Image src={photo.image} alt={photo.alt} fill sizes="(max-width: 760px) 50vw, 25vw" className="cover-image" />
            {photo.caption && <span className="ft-strip-caption">{photo.caption}</span>}
          </li>
        ))}
      </ul>
    </section>
  );
}
