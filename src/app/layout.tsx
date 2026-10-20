import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import Script from "next/script";
import Footer from "@/components/layout/Footer";
import FooterGate from "@/components/layout/FooterGate";
import Header from "@/components/layout/Header";
import HashForwarder from "@/components/nav/HashForwarder";
import JsonLd from "@/components/seo/JsonLd";
import AdminQuickEdit from "@/components/ui/AdminQuickEdit";
import CopyGuard from "@/components/ui/CopyGuard";
import RouteScrollReset from "@/components/ui/RouteScrollReset";
import SiteReveal from "@/components/ui/SiteReveal";
import { getSiteContent } from "@/content/get";
import { PHASE_COPY } from "@/content/labels";
import { getSections } from "@/content/sitemap";
import { KEYWORDS, POSITIONING_LINE, siteUrl } from "@/data/brand";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Navbar text and its button labels (not a variable font, so the weight is named).
const poppins = Poppins({
  variable: "--font-poppins",
  weight: "500",
  subsets: ["latin"],
});

const gaId = process.env.NEXT_PUBLIC_GA_ID;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "BaseCamp CamSur | Train. Transform. Thrive.",
    template: "%s | BaseCamp CamSur",
  },
  description: POSITIONING_LINE,
  keywords: KEYWORDS,
  openGraph: {
    type: "website",
    siteName: "BaseCamp CamSur",
    locale: "en_PH",
    title: "BaseCamp CamSur | Southeast Asia's Performance Playground",
    description: POSITIONING_LINE,
    images: [{ url: "/images/facilities/facility-aerial.jpg" }],
  },
  twitter: { card: "summary_large_image" },
};

// getSiteContent() is 'use cache' (tag site-content), so awaiting it here keeps every route prerenderable.
export default async function RootLayout({ children }: LayoutProps<"/">) {
  const c = await getSiteContent();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable}`}
    >
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <RouteScrollReset />
        <Header
          ctaLabel={PHASE_COPY[c.settings.launchPhase]?.ctaLabel ?? PHASE_COPY["pre-launch"].ctaLabel}
          sections={getSections(c.programmes.featured)}
        />
        <main id="main-content" tabIndex={-1}>{children}</main>
        <FooterGate><Footer /></FooterGate>
        <SiteReveal />
        <CopyGuard />
        <HashForwarder />
        <AdminQuickEdit />
        <JsonLd />
        {gaId && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`} strategy="afterInteractive" />
            <Script id="ga-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config',${JSON.stringify(gaId)});`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
