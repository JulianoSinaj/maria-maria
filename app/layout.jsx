import "./globals.css";
import { Playfair_Display, Montserrat } from "next/font/google";
import SmoothScroll from "@/components/motion/SmoothScroll";
import { MagneticRouteProvider } from "@/components/motion/MagneticContext";
import { CartProvider } from "@/components/shop/CartContext";
import StorefrontChrome from "@/components/StorefrontChrome";

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

export const metadata = {
  title: "Maria Maria — Il piacere del vino",
  description: "Italienische Boutique-Weine für bewusst gewählte Genussmomente.",
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
