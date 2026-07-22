import "./globals.css";
import { Playfair_Display, Montserrat } from "next/font/google";
import SmoothScroll from "@/components/motion/SmoothScroll";
import { MagneticRouteProvider } from "@/components/motion/MagneticContext";
import { CartProvider } from "@/components/shop/CartContext";
import CartDrawer from "@/components/shop/CartDrawer";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AmbientBackdrop } from "@/components/Atmosphere";

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
};

export default function RootLayout({ children }) {
  return (
    <html lang="de" className={`${playfair.variable} ${montserrat.variable}`}>
      <body className="font-montserrat">
        <SmoothScroll>
          <MagneticRouteProvider>
          <CartProvider>
          <AmbientBackdrop />
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-bordeaux focus:px-5 focus:py-3 focus:text-[13px] focus:text-ivory"
          >
            Zum Inhalt springen
          </a>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          {/* site-wide cart: slide-over + floating pill, appears once something is added */}
          <CartDrawer />
          </CartProvider>
          </MagneticRouteProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
