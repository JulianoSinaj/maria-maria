"use client";

import Link from "next/link";
import { Arrow } from "@/components/Icons";
import { pushEvent, pageLocation, REGION_CTA_CLICK } from "@/lib/analytics";

/* Regionale CTA unter jedem Regionsblock.

   Die Regionen-Guide (v1.0, Abschnitte 8 und 10) verlangt zweierlei, was ein
   nacktes <Link> nicht leisten kann: einen beschreibenden Anchor je Region
   statt eines gemeinsamen „Mehr erfahren“ — und ein `region_cta_click` mit
   region_name, link_text, link_url und destination_type, damit sich in GA4
   auswerten lässt, welche Herkunft überhaupt weiterführt.

   Die Seite selbst bleibt dadurch eine Server Component; nur dieser Anchor
   ist Client-seitig. */

export default function RegionCta({ region, label, href, destinationType }) {
  return (
    <Link
      href={href}
      onClick={() =>
        pushEvent(REGION_CTA_CLICK, {
          region_name: region,
          link_text: label,
          link_url: href,
          destination_type: destinationType,
          page_location: pageLocation(),
        })
      }
      className="group mt-4 inline-flex min-h-[44px] items-center gap-1.5 text-[15px] font-medium text-bordeaux focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
    >
      {label}
      <Arrow className="h-3.5 w-3.5 transition-transform duration-500 ease-out-expo group-hover:translate-x-1" />
    </Link>
  );
}
