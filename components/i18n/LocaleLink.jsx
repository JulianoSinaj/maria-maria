"use client";

import { forwardRef } from "react";
import NextLink from "next/link";
import { useLocaleTools } from "@/lib/i18n/context";

/* Ein `next/link`, das die aktive Sprache mitnimmt.

   Ohne diesen Wrapper führt jeder Klick zurück ins Deutsche: Ein hart
   notiertes `href="/kontakt"` zeigt aus /it/unsere-weine heraus auf die
   deutsche Kontaktseite. Statt 39 Link-Ziele im Code mit Präfix-Logik zu
   verzieren, übersetzt diese Komponente sie beim Rendern.

   Im ganzen Storefront-Code wird deshalb `@/components/i18n/LocaleLink`
   importiert und nicht mehr `next/link` — Ausnahme ist /admin, das einsprachig
   bleibt und weiterhin direkt auf next/link zugreift.

   `forwardRef`, weil ui/Button die Komponente durch `motion.create()` schickt;
   Motion braucht den Ref auf das DOM-Element für Press- und Hover-Gesten. */

const LocaleLink = forwardRef(function LocaleLink({ href, ...rest }, ref) {
  const { href: localize } = useLocaleTools();

  /* next/link erlaubt auch die Objektform ({ pathname, query, hash }).
     Sprache gehört in den Pfad, Query und Hash bleiben unberührt. */
  const target =
    href && typeof href === "object"
      ? { ...href, ...(href.pathname ? { pathname: localize(href.pathname) } : null) }
      : localize(href);

  return <NextLink ref={ref} href={target} {...rest} />;
});

export default LocaleLink;
