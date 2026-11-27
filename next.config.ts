import type { NextConfig } from "next";

// Security headers. Docs: node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/headers.md
// and 01-app/02-guides/content-security-policy.md ("Without Nonces").
const isDev = process.env.NODE_ENV !== "production";

// Payment pages the checkout form is redirected to (PayMongo checkout, PayPal live + sandbox approval).
const PAYMENT_ORIGINS = "https://checkout.paymongo.com https://www.paypal.com https://www.sandbox.paypal.com";

// Enforced now: these cannot break page content. Clickjacking (frame-ancestors), plugins, <base> hijacking, and
// forms posting anywhere but this site or the payment providers.
const CSP_ENFORCED = [
  "frame-ancestors 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  `form-action 'self' ${PAYMENT_ORIGINS}`,
].join("; ");

// The full policy, sent as Report-Only (violations show in the browser console, nothing is blocked) until it has
// been checked against Google Analytics in production and the signed-in admin/payment flows; then rename the header
// to Content-Security-Policy. Sources:
// - script-src 'unsafe-inline': the App Router injects inline scripts, and the root layout has inline boot scripts and
//   JSON-LD. The alternative (per-request nonces via proxy.ts) forces dynamic rendering of every page, which this
//   statically prerendered site must not do. 'unsafe-eval' only in development (React dev tooling / refresh).
// - googletagmanager / google-analytics / doubleclick: GA4 via gtag (layout.tsx, only when NEXT_PUBLIC_GA_ID is set).
// - res.cloudinary.com: hero/menu videos and their posters (data/brand.ts). media-src allows any https: because the
//   admin "Launch video URL" (about/the-build) accepts any https MP4 link.
// - www.google.com frames: the Google Maps embeds (ui/MapEmbed.tsx, features/FindUsMap.tsx).
const CSP_FULL = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' https://www.googletagmanager.com${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://res.cloudinary.com https://*.google-analytics.com https://*.googletagmanager.com https://*.g.doubleclick.net https://www.google.com",
  "font-src 'self' data:",
  "media-src 'self' blob: https:",
  "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://*.g.doubleclick.net https://www.google.com",
  "frame-src 'self' https://www.google.com https://maps.google.com",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  CSP_ENFORCED,
].join("; ");

const SECURITY_HEADERS = [
  ...(isDev ? [] : [{ key: "Strict-Transport-Security", value: "max-age=63072000" }]),
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Allowed (self only): clipboard-write (Copy address / share fallback), web-share (social gallery), fullscreen
  // (video). Everything else is off; the maps are plain embeds and the site never asks for location.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), serial=(), bluetooth=(), hid=(), midi=(), magnetometer=(), gyroscope=(), accelerometer=(), display-capture=(), browsing-topics=(), clipboard-write=(self), web-share=(self), fullscreen=(self)",
  },
  { key: "Content-Security-Policy", value: CSP_ENFORCED },
  { key: "Content-Security-Policy-Report-Only", value: CSP_FULL },
];

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // Every route (pages, API, static files). Static headers only, so prerendered pages stay static.
  async headers() {
    return [{ source: "/(.*)", headers: SECURITY_HEADERS }];
  },
  // Stage-3 §8/§9. Docs: node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/redirects.md
  // (permanent → 308; runs before Proxy). Legacy #anchors never reach the server: see components/nav/HashForwarder.
  async redirects() {
    return [
      { source: "/admin/login", destination: "/login", permanent: true },
      // The facility gallery page was removed; old links land on the Facilities overview.
      { source: "/facilities/gallery", destination: "/facilities", permanent: true },
      { source: "/membership/faq", destination: "/about/faq", permanent: true },
      // The membership application was replaced by online checkout: a plan goes to its /pay page, otherwise the plans.
      { source: "/membership/join", has: [{ type: "query", key: "tier", value: "(?<tier>local-basic|athlete|premium)" }], destination: "/pay?item=:tier", permanent: false },
      { source: "/membership/join", destination: "/membership#tiers", permanent: false },
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
