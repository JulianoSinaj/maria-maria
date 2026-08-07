import "./globals.css";
import { Playfair_Display, Montserrat } from "next/font/google";
import SmoothScroll from "@/components/motion/SmoothScroll";
import { MagneticRouteProvider } from "@/components/motion/MagneticContext";
import { CartProvider } from "@/components/shop/CartContext";
import StorefrontChrome from "@/components/StorefrontChrome";
import { SITE_URL, SITE_NAME, SITE_TAGLINE, SITE_LOCALE } from "@/lib/site";

const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

/* metadataBase macht jede relative Angabe der Unterseiten absolut —
   Canonicals, OpenGraph- und Twitter-Bilder. Ohne sie bliebe z. B.
   `alternates.canonical: "/magazin"` ein relativer Wert, den Crawler
   ignorieren. Die Domain kommt aus lib/site (NEXT_PUBLIC_SITE_URL).

   `title.template` gibt allen Unterseiten denselben Marken-Suffix: eine Seite
   setzt nur noch `title: "Magazin"`. */
export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s — ${SITE_NAME}`,
  },
  description: "Italienische Boutique-Weine für bewusst gewählte Genussmomente.",
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: SITE_LOCALE,
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F7F4EF",
  /* lets env(safe-area-inset-*) work on notched phones — the floating cart
     pill, cart summary and mobile menu pad themselves off the home indicator */
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html lang="de" className={`${playfair.variable} ${montserrat.variable}`}>
      <body className="font-montserrat">
        <SmoothScroll>
          <MagneticRouteProvider>
          <CartProvider>
          <StorefrontChrome>{children}</StorefrontChrome>
          </CartProvider>
          </MagneticRouteProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
