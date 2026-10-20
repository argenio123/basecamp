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
      { source: "/programs/crossfit-group", destination: "/classes/functional-training", permanent: true },
      { source: "/programs/foundations", destination: "/classes/functional-training", permanent: true },
      { source: "/programs/open-gym", destination: "/classes/strength-conditioning", permanent: true },
      { source: "/programs/commercial-gym", destination: "/classes/strength-conditioning", permanent: true },
      { source: "/programs/hyrox", destination: "/classes/endurance", permanent: true },
      { source: "/programs/outdoor-running", destination: "/classes/endurance", permanent: true },
      { source: "/programs/weekend-camps", destination: "/classes/endurance", permanent: true },
      { source: "/programs/ice-sauna", destination: "/classes/recovery-mobility", permanent: true },
      { source: "/programs/mobility-deck", destination: "/classes/recovery-mobility", permanent: true },
      { source: "/programs/therapy-zones", destination: "/classes/recovery-mobility", permanent: true },
      { source: "/programs/yoga-breathwork", destination: "/classes/recovery-mobility", permanent: true },
      { source: "/programs/massage-physio", destination: "/classes/personal-coaching", permanent: true },
      { source: "/programs/wellness-consults", destination: "/classes/personal-coaching", permanent: true },
      { source: "/programs/:path*", destination: "/classes/:path*", permanent: true },
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
