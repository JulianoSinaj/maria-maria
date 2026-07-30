"use client";
import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import CartDrawer from "./shop/CartDrawer";
import { AmbientBackdrop } from "./Atmosphere";

/* The storefront frame — header, footer, ambient wash and the cart slide-over.
   /admin is a separate surface with its own shell, so it opts out of all of it
   (a nested layout can add chrome but never remove a parent's). Everything
   else on the site keeps the frame unchanged. */

export default function StorefrontChrome({ children }) {
  const isAdmin = usePathname()?.startsWith("/admin");

  if (isAdmin) return children;

  return (
    <>
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
    </>
  );
}
