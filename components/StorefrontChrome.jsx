"use client";
import Header from "./Header";
import Footer from "./Footer";
import CartDrawer from "./shop/CartDrawer";
import { AmbientBackdrop } from "./Atmosphere";
import Beacon from "./insights/Beacon";
import { useCommon } from "@/lib/i18n/context";
import { SHOP_ENABLED } from "@/lib/shop/config";

/* The storefront frame — header, footer, ambient wash and the cart slide-over.

   Bis zur Mehrsprachigkeit prüfte diese Komponente selbst, ob der Pfad mit
   /admin beginnt, und gab in dem Fall die Kinder unverändert zurück. Diese
   Abfrage ist entfallen: /admin liegt jetzt in einer eigenen Route-Group mit
   eigenem Root-Layout (app/(admin)/layout.jsx) und kommt hier gar nicht mehr
   vorbei. Die Storefront-Kette hängt ausschließlich unter
   app/(site)/[locale]/. */

export default function StorefrontChrome({ children }) {
  const a11y = useCommon("a11y");

  return (
    <>
      {/* Zählt den Seitenaufruf — anonym, ohne Cookie, ohne Kennung.
          Liegt hier und nicht im Layout, weil dieser Rahmen ohnehin um
          jede Seite der Storefront liegt und die Sprache bereits kennt. */}
      <Beacon />
      <AmbientBackdrop />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-bordeaux focus:px-5 focus:py-3 focus:text-[13px] focus:text-ivory"
      >
        {a11y.skipToContent}
      </a>
      <Header />
      <main id="main">{children}</main>
      <Footer />
      {/* site-wide cart: slide-over + floating pill, appears once something is added.

          Bei stillgelegtem Shop bleibt er aus — sonst schwebte die Pille bei
          jedem wieder, der vor der Umstellung etwas in den Warenkorb gelegt
          hat: Der Inhalt liegt im localStorage und überlebt den Deploy. */}
      {SHOP_ENABLED && <CartDrawer />}
    </>
  );
}
