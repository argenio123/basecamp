import localFont from "next/font/local";

/**
 * Gretaros: the homepage display face (all-caps), shared site-wide through the --font-display variable so the
 * navigation pages (Classes, Facilities, Membership, Schedule, Visit, About) use the same headline type.
 */
export const gretaros = localFont({
  src: "./fonts/Gretaros-Regular.otf",
  display: "swap",
  weight: "400",
  style: "normal",
  variable: "--font-display",
});
