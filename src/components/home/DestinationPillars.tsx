import Image from "next/image";
import Link from "next/link";
import { ImageLabel } from "@/components/ui/AiImageLabel";
import { t } from "@/i18n/server";

type Destination = {
  title: string;
  description: string;
  href: string;
  image: string;
  imagePosition: string;
};

export default function DestinationPillars({ destinations, titleClassName }: {
  destinations: Destination[];
  titleClassName: string;
}) {
  return (
    <div className="destination-pillars">
      {destinations.map(({ title, description, href, image, imagePosition }, index) => {
        const descriptionId = `destination-${title.toLowerCase()}-description`;

        return (
          <Link
            href={href}
            className="destination-pillar"
            aria-label={t("Learn more about {title}", { title: title.toLowerCase() })}
            aria-describedby={descriptionId}
            data-home-reveal
            data-home-reveal-delay={index === 0 ? "medium" : index === 1 ? "long" : "longer"}
            key={title}
          >
            <span className="destination-pillar-media" aria-hidden="true">
              <Image
                src={image}
                alt=""
                fill
                sizes="(max-width: 600px) calc(100vw - 28px), (max-width: 1040px) calc(50vw - 32px), 33vw"
                className={`destination-pillar-image${title === "THRIVE" ? " destination-pillar-image--thrive" : ""}`}
                style={{ objectPosition: imagePosition }}
              />
            </span>
            {/* Above the card's shade; the link's aria-label names it, so the pill is visual only. */}
            <ImageLabel src={image} className="ai-label--corner ai-label--inset" hidden />
            <span className="destination-pillar-content">
              <span id={descriptionId} className="destination-pillar-copy">{description}</span>
              <span className={`${titleClassName} destination-pillar-title`}>{title}</span>
            </span>
          </Link>
        );
      })}
    </div>
  );
}
