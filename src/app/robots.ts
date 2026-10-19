// Docs: 03-api-reference/03-file-conventions/01-metadata/robots.md
import type { MetadataRoute } from "next";
import { siteUrl } from "@/data/brand";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/login"] },
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
