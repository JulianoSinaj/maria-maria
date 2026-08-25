"use client";

import { forwardRef } from "react";
import NextLink from "next/link";
import { useLocaleTools } from "@/lib/i18n/context";
import {
  SHOP_ENABLED,
  EXTERNAL_SHOP_URL,
  isShopPath,
  isExternalHref,
  outwardRel,
} from "@/lib/shop/config";

/* Ein `next/link`, das die aktive Sprache mitnimmt.

   Ohne diesen Wrapper führt jeder Klick zurück ins Deutsche: Ein hart
   notiertes `href="/kontakt"` zeigt aus /it/unsere-weine heraus auf die
   deutsche Kontaktseite. Statt 39 Link-Ziele im Code mit Präfix-Logik zu
   verzieren, übersetzt diese Komponente sie beim Rendern.

   Im ganzen Storefront-Code wird deshalb `@/components/i18n/LocaleLink`
   importiert und nicht mehr `next/link` — Ausnahme ist /admin, das einsprachig
   bleibt und weiterhin direkt auf next/link zugreift.

   `forwardRef`, weil ui/Button die Komponente durch `motion.create()` schickt;
   Motion braucht den Ref auf das DOM-Element für Press- und Hover-Gesten.

   Zweite Aufgabe seit der Stilllegung des Shops: Zeigt ein Link auf /shop,
   führt er zum Partner-Shop statt auf die eigene, verkaufsunfähige Seite —
   siehe lib/shop/config.js. Die Umleitung liegt bewusst hier und nicht in
   den aufrufenden Dateien: „/shop" steht an über dreißig Stellen (Header,
   Footer, FAQ, CTA-Bänder, neun Weinseiten), und ein Ziel, das dreißigmal
   notiert ist, wird beim Ändern neunundzwanzigmal getroffen.

   Dritte Aufgabe: eine absolute http(s)-Adresse (die Weinseiten reichen via
   shopHref(slug) die Produktseite des Weins im Partner-Shop herein) lässt
   sich nicht lokalisieren und führt aus der Site hinaus — sie wird wie der
   Shop-Link als <a target="_blank"> gerendert, damit ui/Button, CTA-Bänder
   und Datenmodule kein `external`-Flag mitführen müssen. */

const LocaleLink = forwardRef(function LocaleLink({ href, ...rest }, ref) {
  const { href: localize } = useLocaleTools();

  const wanted = href && typeof href === "object" ? href.pathname : href;
  const outward = isExternalHref(wanted)
    ? wanted
    : !SHOP_ENABLED && isShopPath(wanted)
      ? EXTERNAL_SHOP_URL
      : null;
  if (outward) {
    /* Die Requisiten von next/link haben an einem <a> nichts zu suchen —
       React schriebe sie als unbekannte Attribute ins DOM. */
    const { prefetch, replace, scroll, shallow, locale, passHref, legacyBehavior, ...anchor } = rest;
    return <a ref={ref} href={outward} target="_blank" rel={outwardRel(outward)} {...anchor} />;
  }

  /* next/link erlaubt auch die Objektform ({ pathname, query, hash }).
     Sprache gehört in den Pfad, Query und Hash bleiben unberührt. */
  const target =
    href && typeof href === "object"
      ? { ...href, ...(href.pathname ? { pathname: localize(href.pathname) } : null) }
      : localize(href);

  return <NextLink ref={ref} href={target} {...rest} />;
});

export default LocaleLink;
