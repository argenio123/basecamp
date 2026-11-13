import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // Stage-3 §8/§9. Docs: node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/redirects.md
  // (permanent → 308; runs before Proxy). Legacy #anchors never reach the server: see components/nav/HashForwarder.
  async redirects() {
    return [
      { source: "/admin/login", destination: "/login", permanent: true },
      // The facility gallery page was removed; old links land on the Facilities overview.
      { source: "/facilities/gallery", destination: "/facilities", permanent: true },
      { source: "/membership/faq", destination: "/about/faq", permanent: true },
      { source: "/membership/passes", destination: "/membership/price-guide", permanent: true },
      { source: "/membership/recovery-pricing", destination: "/membership/price-guide#recovery-pricing", permanent: true },
      { source: "/membership/yoga", destination: "/membership/price-guide#yoga", permanent: true },
      { source: "/membership/camps", destination: "/membership/price-guide#camps-pricing", permanent: true },
      { source: "/membership/corporate", destination: "/membership/price-guide#corporate", permanent: true },
      { source: "/programs/crossfit-group", destination: "/classes", permanent: true },
      { source: "/programs/foundations", destination: "/classes", permanent: true },
      { source: "/programs/open-gym", destination: "/classes", permanent: true },
      { source: "/programs/commercial-gym", destination: "/classes", permanent: true },
      { source: "/programs/hyrox", destination: "/classes", permanent: true },
      { source: "/programs/outdoor-running", destination: "/classes", permanent: true },
      { source: "/programs/weekend-camps", destination: "/classes", permanent: true },
      { source: "/programs/ice-sauna", destination: "/classes", permanent: true },
      { source: "/programs/mobility-deck", destination: "/classes", permanent: true },
      { source: "/programs/therapy-zones", destination: "/classes", permanent: true },
      { source: "/programs/yoga-breathwork", destination: "/classes", permanent: true },
      { source: "/programs/massage-physio", destination: "/classes", permanent: true },
      { source: "/programs/wellness-consults", destination: "/classes", permanent: true },
      { source: "/programs/:path*", destination: "/classes", permanent: true },
      // Coaching, Corporate and the programme detail pages were removed: send old links to the closest page.
      { source: "/classes/corporate", destination: "/membership/price-guide#corporate", permanent: true },
      { source: "/classes/:slug(coaching|functional-training|strength-conditioning|endurance|recovery-mobility|personal-coaching)", destination: "/classes", permanent: true },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
