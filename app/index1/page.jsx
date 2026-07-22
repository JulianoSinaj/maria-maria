import HomeContent from "@/components/home/HomeContent";

/* Variant 1 — stationary buttons: colour/fill hover only, no cursor
   tracking. MagneticRouteProvider switches magnetism off for /index1. */

export const metadata = {
  title: "Maria Maria — Variante 1 (statische Buttons)",
};

export default function Index1Page() {
  return <HomeContent />;
}
