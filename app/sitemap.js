import { seoRoutes } from "@/lib/seo/routes";
import { LOCALES, LOCALE_META, DEFAULT_LOCALE } from "@/lib/i18n/config";
import { localePath } from "@/lib/i18n/routing";
import { absoluteUrl } from "@/lib/site";

/* /sitemap.xml — jede indexierbare Seite in jeder der vier Sprachen.

   Vier Sprachen × zwanzig Seiten ergibt achtzig URLs. Jede davon trägt ihre
   drei Geschwister als `xhtml:link rel="alternate"` plus `x-default` mit:
   Google verlangt, dass die Sprachvarianten einer Seite sich GEGENSEITIG
   benennen — eine hreflang-Angabe, die nicht erwidert wird, verwirft der
   Crawler stillschweigend. Die Angaben stehen deshalb doppelt, hier in der
   Sitemap und im <head> jeder Seite (lib/i18n/metadata.js). Das ist keine
   Redundanz: die Sitemap bringt Google die Beziehungen, bevor es die Seiten
   überhaupt geladen hat.

   Deutsch steht ohne Präfix — localePath() erledigt das, damit die Sitemap
   dieselben Adressen meldet, die auch in der Adressleiste stehen. Meldete sie
   /de/shop, zeigte sie auf eine URL, die mit 308 weiterleitet: jede Zeile ein
   unnötiger Umweg für den Crawler.

   BEWUSST OHNE `lastModified`. Ein Zeitstempel aus der Bauzeit behauptet bei
   jedem Deploy, alle achtzig Seiten hätten sich geändert — auch wenn nur eine
   CSS-Zeile anders ist. Google erkennt diese Art Rauschen und ignoriert
   daraufhin die lastmod-Angaben der GESAMTEN Domain. Keine Angabe ist besser
   als eine unglaubwürdige. Sobald Seiteninhalte aus einem CMS mit echtem
   Änderungsdatum kommen, gehört das Feld wieder hinein.

   Die Gespräche kommen seit dem Redaktionssystem aus einer Abfrage (Sprach-
   dateien + Speicher) — daher async. Das Veröffentlichen im Backoffice ruft
   zusätzlich revalidatePath("/sitemap.xml") auf, aber bei einer
   MetadataRoute-Datei wie dieser wirkt das anders als bei einer normalen
   Seite: Next generiert `sitemap.js` beim Build als vollstatische Route
   OHNE eigenen `revalidate`-Export komplett einmalig, und ein
   revalidatePath auf eine rein statische MetadataRoute-Datei setzt zwar das
   Cache-Tag zurück, ohne dass beim nächsten Aufruf neu gerendert wird —
   verifiziert am 2026-09-05, als eine frisch veröffentlichte Adresse in der
   Sitemap fehlte, obwohl die Artikelseite selbst schon erreichbar war. Der
   `revalidate`-Export unten macht daraus zeitbasiertes ISR: Der erste
   Aufruf nach Ablauf des Fensters baut die Datei serverseitig neu, jeder
   Aufruf innerhalb des Fensters bekommt die zwischengespeicherte Antwort.
   Fünf Minuten sind für eine Sitemap großzügig kurz — ein Crawler liest sie
   ohnehin nur gelegentlich — und lang genug, dass wiederholte Aufrufe
   (mehrere Crawler, ein Browser-Refresh) nicht jedes Mal alle Register neu
   abfragen.

   Nicht enthalten: /admin und /api (kein öffentlicher Inhalt, in robots.txt
   gesperrt), 404 und die Fehlerseite (nichts, was indexiert werden soll). */

export const revalidate = 300;

export default async function sitemap() {
  const routes = await seoRoutes();
  return routes.flatMap(({ path, priority, changeFrequency }) => {
    /* Einmal pro Seite gebaut und von allen vier Sprachzeilen geteilt —
       die Alternates einer Seite sind in jeder Sprache dieselbe Menge. */
    const languages = {
      ...Object.fromEntries(
        LOCALES.map((l) => [LOCALE_META[l].hreflang, absoluteUrl(localePath(l, path))])
      ),
      /* x-default fängt jede Sprache ab, die wir nicht führen — Französisch,
         Spanisch, Polnisch. Sie landen auf der deutschen Fassung. */
      "x-default": absoluteUrl(localePath(DEFAULT_LOCALE, path)),
    };

    return LOCALES.map((locale) => ({
      url: absoluteUrl(localePath(locale, path)),
      changeFrequency,
      /* Die Nicht-Default-Sprachen einen Hauch niedriger: Der deutsche Markt
         ist der Heimatmarkt (Düsseldorfer GmbH, deutschsprachiger Shop), und
         bei begrenztem Crawl-Budget soll er zuerst drankommen. */
      priority: locale === DEFAULT_LOCALE ? priority : Math.round(priority * 0.9 * 10) / 10,
      alternates: { languages },
    }));
  });
}
