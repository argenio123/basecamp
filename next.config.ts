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
      { source: "/programs/crossfit-group", destination: "/programs/functional-training", permanent: true },
      { source: "/programs/foundations", destination: "/programs/functional-training", permanent: true },
      { source: "/programs/open-gym", destination: "/programs/strength-conditioning", permanent: true },
      { source: "/programs/commercial-gym", destination: "/programs/strength-conditioning", permanent: true },
      { source: "/programs/hyrox", destination: "/programs/endurance", permanent: true },
      { source: "/programs/outdoor-running", destination: "/programs/endurance", permanent: true },
      { source: "/programs/weekend-camps", destination: "/programs/endurance", permanent: true },
      { source: "/programs/ice-sauna", destination: "/programs/recovery-mobility", permanent: true },
      { source: "/programs/mobility-deck", destination: "/programs/recovery-mobility", permanent: true },
      { source: "/programs/therapy-zones", destination: "/programs/recovery-mobility", permanent: true },
      { source: "/programs/yoga-breathwork", destination: "/programs/recovery-mobility", permanent: true },
      { source: "/programs/massage-physio", destination: "/programs/personal-coaching", permanent: true },
      { source: "/programs/wellness-consults", destination: "/programs/personal-coaching", permanent: true },
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
