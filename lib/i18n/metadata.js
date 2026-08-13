import { LOCALES, LOCALE_META, toLocale } from "./config";
import { alternatePaths, localePath } from "./routing";
import { absoluteUrl, SITE_NAME, DEFAULT_OG_IMAGE } from "@/lib/site";

/* Seiten-Metadaten in vier Sprachen.

   Jede Seite trug ihre Metadaten vorher als statisches `export const metadata`
   mit deutschem Titel — und mehrere davon hängten den Markennamen selbst an
   („Shop — Maria Maria"), obwohl das title.template des Layouts ihn ohnehin
   ergänzt. Auf Italienisch stand deshalb „Unsere Weine — Maria Maria — Maria
   Maria" im Tab.

   Diese Funktion räumt beides auf: Titel und Description kommen aus dem
   Wörterbuch der jeweiligen Sprache, der Markenname genau einmal aus dem
   Template — und jede Seite bekommt automatisch ihre vier hreflang-Geschwister
   plus x-default auf die deutsche Fassung. */

/* Ohne eigenes Motiv greift das Markenbild. Der Unterschied ist beim Teilen
   sofort sichtbar: Mit `twitter:card = summary_large_image` und OHNE Bild
   rendert X eine schmale Textzeile und LinkedIn zeigt eine leere Fläche —
   der Link sieht aus wie ein Fehler. Ein Standardbild ist immer besser als
   gar keines. */
function resolveImage(image) {
  const img = image ?? DEFAULT_OG_IMAGE;
  if (!img?.url) return null;
  /* Absolut statt relativ: metadataBase würde es auflösen, aber OpenGraph-
     Scraper (WhatsApp, Slack, iMessage) folgen der Basis nicht immer. */
  return { ...img, url: absoluteUrl(img.url) };
}

export function pageMetadata({
  locale,
  path = "/",
  meta = {},
  image = null,
  keywords = null,
  /* "website" für Seiten, "article" für redaktionelle Stücke. Produktseiten
     bleiben bewusst "website": OpenGraph kennt zwar "product", aber die
     kaufrelevanten Angaben liest Google aus dem JSON-LD, nicht aus og:. */
  type = "website",
  /* Nur für Seiten, die NICHT in den Index sollen — 404 und Fehlerseite.
     Alles andere erbt die freundliche Grundeinstellung des Root-Layouts. */
  robots = null,
} = {}) {
  const l = toLocale(locale);
  const langs = alternatePaths(path);
  const canonical = localePath(l, path);
  const og = resolveImage(image);

  /* `titleAbsolute` für Seiten, deren Titel die Marke selbst trägt —
     /regionen tut das bewusst, weil der Titel eine vollständige
     Suchergebniszeile sein soll. */
  const title = meta.titleAbsolute ? { absolute: meta.titleAbsolute } : meta.title;
  const ogTitle = meta.titleAbsolute ?? `${meta.title} — ${SITE_NAME}`;

  return {
    title,
    description: meta.description,
    ...(keywords || meta.keywords ? { keywords: keywords ?? meta.keywords } : null),
    ...(robots ? { robots } : null),
    alternates: {
      canonical,
      languages: {
        ...Object.fromEntries(LOCALES.map((x) => [LOCALE_META[x].hreflang, absoluteUrl(langs[x])])),
        "x-default": absoluteUrl(langs.de),
      },
    },
    openGraph: {
      type,
      /* Absolut, nicht relativ: og:url IST die kanonische Adresse für jeden
         Scraper, der kein <link rel=canonical> liest. */
      url: absoluteUrl(canonical),
      title: ogTitle,
      description: meta.description,
      siteName: SITE_NAME,
      locale: LOCALE_META[l].ogLocale,
      alternateLocale: LOCALES.filter((x) => x !== l).map((x) => LOCALE_META[x].ogLocale),
      ...(og ? { images: [og] } : null),
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: meta.description,
      ...(og ? { images: [og.url] } : null),
    },
  };
}
