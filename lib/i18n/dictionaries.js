import { DEFAULT_LOCALE, toLocale } from "./config";
import { faqDictionary, faqWines } from "@/lib/faq/store";
import { applyPageOverrides } from "@/lib/pages/store";

/* Zugriff auf die Wörterbücher — ausschließlich auf dem Server.

   Die Importe stehen als statisches Objekt da und nicht als
   `import(`@/content/${locale}`)`: Ein Template-String im Import zwingt
   Webpack, ein Kontext-Modul über das ganze Verzeichnis zu bauen und damit
   alles zu bündeln, was dort je liegen wird. Vier benannte Zweige lassen
   sich sauber code-splitten — pro Anfrage lädt der Server genau eine Sprache.

   Diese Datei gehört auf den Server. Das npm-Paket `server-only` wäre die
   übliche Leitplanke dafür, hängt aber nicht im Projekt — statt eine
   Abhängigkeit für eine einzige Zeile aufzunehmen, prüft der Guard unten
   dasselbe über die "react-server"-Bedingung, die Next.js beim Bündeln für
   Client-Components abschaltet.

   Der Grund für die Strenge: Client-Components dürfen den Text als Prop oder
   über den Provider in ./context bekommen — beides bewusst schmal. Ein
   direkter Import hier würde die Redaktionstexte aller vier Sprachen ins
   Browser-Bundle ziehen. */

if (typeof window !== "undefined") {
  throw new Error(
    "lib/i18n/dictionaries ist serverseitig — in Client-Components stattdessen " +
      "useCommon()/useLocaleTools() aus lib/i18n/context nutzen oder den Text als Prop reichen."
  );
}

const DICTIONARIES = {
  de: () => import("@/content/de"),
  it: () => import("@/content/it"),
  en: () => import("@/content/en"),
  cs: () => import("@/content/cs"),
};

/* Die Fragen kommen nicht mehr aus content/<sprache>/faq.js, sondern aus
   dem FAQ-Editor (lib/faq/store). Die Inhaltsdateien bleiben die SAAT: ein
   Store ohne eigene Datei liefert sie unverändert zurück, Zeichen für
   Zeichen. Der Merge sitzt hier, weil jede Seite ihr Wörterbuch über
   getDictionary() holt — FaqSection und faqNode() sehen dieselbe Form wie
   vorher und bleiben unverändert.

   `faqWines` ist der Zweig der neun Produktseiten (Gruppe `wine:<slug>`).
   Er liegt bewusst NEBEN weinePages statt darin: der Overlay-Merge in
   lib/i18n/winePages.js führt Listen Position für Position zusammen, eine
   im Editor hinzugefügte Frage fiele dabei heraus. */
export async function getDictionary(locale) {
  const key = toLocale(locale);
  const load = DICTIONARIES[key] || DICTIONARIES[DEFAULT_LOCALE];
  const mod = await load();
  /* Die redaktionell geänderten Textblöcke der Seiten (lib/pages/store,
     Editor unter /admin/seiten) liegen über den Inhaltsdateien. Gleiches
     Prinzip wie beim FAQ-Merge darüber, nur andersherum gebaut: Der Store
     hält je Seite × Block × Sprache einen vollständigen Block in der Form
     des Codes, der Merge tauscht ihn an seinem Pfad aus. Ist nichts
     überschrieben — der Normalfall — kommt exakt dasselbe Objekt zurück,
     ohne Klon und ohne Durchlauf. */
  const dict = applyPageOverrides(mod.default ?? mod, key);
  const faq = faqDictionary(key);

  /* /kontakt is the one page that keeps its questions beside the rest of
     its copy (dict.kontakt.faq.items) — its accordion AND its FAQPage node
     read from there, so that is where the edited list has to land. The
     surrounding labels of the block stay as they are. */
  const kontakt =
    dict.kontakt && faq.kontakt
      ? { ...dict.kontakt, faq: { ...dict.kontakt.faq, items: faq.kontakt } }
      : dict.kontakt;

  return { ...dict, kontakt, faq, faqWines: faqWines(key) };
}

/* Ein einzelner Abschnitt — die übliche Form im Seiten-Code:
   `const t = await getSection(locale, "kontakt")`. Spart den Umweg über das
   ganze Wörterbuch und macht im Aufrufer sichtbar, welchen Text die Seite
   überhaupt anfasst. */
export async function getSection(locale, section) {
  const dict = await getDictionary(locale);
  return dict[section] ?? {};
}

/* Gemeinsamer Rahmen (Navigation, Footer, Warenkorb, Hilfstexte). Liegt in
   fast jeder Seite an, daher eine eigene Abkürzung. */
export const getCommon = (locale) => getSection(locale, "common");
