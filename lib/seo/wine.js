/* Aus einem Wein wird eine Suchergebniszeile.

   Die neun Produktseiten sind die kommerziell wertvollsten Adressen der
   Domain: Wer „Lugana kaufen" oder „Primitivo di Manduria" sucht, hat die
   Kaufabsicht schon mitgebracht. Vor diesem Umbau trugen sie den schwächsten
   Kopf der ganzen Seite — ein Titel mit doppeltem Markennamen, keine
   Canonical, kein hreflang, kein Teaserbild.

   Der Kern dieser Datei ist eine Entscheidung: Titel und Description werden
   NICHT aus der deutschen `wineData.js` gezogen, sondern aus dem übersetzten
   Katalog in content/<sprache>/common.js zusammengesetzt. Der Grund ist
   Reichweite. Die wineData-Fließtexte sind ausschließlich deutsch — würde die
   Description daraus stammen, stünde auf /en/unsere-weine/lugana ein
   deutscher Satz, und die englische Fassung könnte auf kein einziges
   englisches Suchwort ranken. Weinart, Region, Charakterworte und
   Speiseempfehlung liegen dagegen in allen vier Sprachen vor. Aus ihnen
   entsteht in jeder Sprache eine vollständige, faktisch korrekte Beschreibung
   mit genau den Wörtern, nach denen dort gesucht wird.

   Die Satzbausteine stehen in content/<sprache>/meta.js unter `wine` — die
   Wortstellung ist je Sprache anders, und Platzhalter zu verketten hätte
   dieselbe Falle aufgestellt, die I18N.md für den Rest der Seite beschreibt. */

import { WINE_PAGES } from "@/components/weine/wineRegistry";
import { localizeWinePage } from "@/lib/i18n/winePages";
import { byName } from "@/components/data";
import { localizeWine } from "@/lib/i18n/catalogue";
import { formatPrice, joinList } from "@/lib/i18n/format";
import { DEFAULT_LOCALE } from "@/lib/i18n/config";

/* "{name} ({year}) — {type}" + Werte → fertiger Satz.
   Unbekannte Platzhalter bleiben stehen statt „undefined" zu schreiben: ein
   sichtbares {price} im Titel fällt beim ersten Blick auf, ein „undefined"
   liest sich wie Absicht und überlebt Monate. */
function fill(template, values) {
  if (typeof template !== "string") return "";
  return template
    .replace(/\{(\w+)\}/g, (match, key) => (key in values ? String(values[key]) : match))
    /* Doppelte Leerzeichen entstehen, wenn ein Platzhalter leer bleibt —
       etwa `pairing` bei einem Wein ohne Speiseempfehlung. */
    .replace(/\s{2,}/g, " ")
    .trim();
}

/* Der Titel wird auf ein Längenbudget zurückgeschnitten, indem hintere
   Segmente wegfallen — „… · Rotwein · Apulien" wird zu „… · Rotwein".

   Nötig wegen der langen Herkunftsbezeichnungen: „Primitivo di Manduria
   D.O.C. 15,5" belegt allein 33 Zeichen, mit Jahrgang, Weinart, Region und
   dem Markennamen aus dem Layout stünden 72 in der Ergebniszeile. Google
   schneidet bei rund 600 Pixeln ab, und was danach kommt, ersetzt es gern
   durch selbst gewählten Text aus der Seite.

   Geschnitten wird von hinten, weil vorn das Suchwort steht: Lieber die
   Region verlieren als den Namen des Weins. Die Region steht ohnehin in der
   Description und im Produkt-Markup.

   Das Budget ist der Rest nach dem Marken-Suffix („ — Maria Maria", 14
   Zeichen) und arbeitet auf dem gerenderten String statt auf der Vorlage —
   so bleibt es gültig, egal wie eine Sprache ihre Vorlage baut. */
const TITLE_BUDGET = 48;

function fitTitle(title) {
  let fitted = title;
  while (fitted.length > TITLE_BUDGET && fitted.includes(" · ")) {
    fitted = fitted.slice(0, fitted.lastIndexOf(" · "));
  }
  return fitted;
}

/* Dasselbe Prinzip für die Description — und aus demselben Grund.

   Google schneidet den Ausschnitt bei rund 160 Zeichen ab. Zwanzig der
   sechsunddreißig Weinseiten lagen darüber (162–174), weil die Vorlage kein
   Budget kannte: `notes` und `pairing` sind je nach Wein und Sprache
   unterschiedlich lang, und „Primitivo di Manduria D.O.C. 15,5" verbraucht
   allein 33 Zeichen, bevor der erste Inhalt kommt. Abgeschnitten wurde
   deshalb mitten im letzten Satz — genau dort, wo der Preis steht.

   Statt einer harten Kürzung ist der Preissatz aus der Vorlage
   herausgelöst (content/<sprache>/meta.js, `descriptionPrice`) und wird nur
   angehängt, wenn er noch hineinpasst. Ein sauber weggelassener Satz liest
   sich besser als ein mitten im Wort gekappter.

   Warum ausgerechnet der Preis fällt: Er steht ohnehin maschinenlesbar im
   Offer-Knoten (lib/seo/jsonLd.js) und ist damit nicht verloren. Charakter
   und Speiseempfehlung stehen nirgendwo sonst — und es sind die Wörter, mit
   denen jemand „Wein zu gegrilltem Fisch" sucht.

   NICHT gekürzt wird, was übrig bleibt: Liegt schon der Satz ohne Preis über
   dem Budget, ist die Description trotzdem vollständig. Ein halber Satz wäre
   das schlechtere Ergebnis, und Google kürzt dann selbst. */
const DESCRIPTION_BUDGET = 160;

function fitDescription(base, priceSentence) {
  if (!priceSentence) return base;
  const full = `${base} ${priceSentence}`;
  return full.length <= DESCRIPTION_BUDGET ? full : base;
}

/* Alles, was eine Weinseite über sich selbst weiß — einmal berechnet, von
   Metadaten UND strukturierten Daten geteilt. Liefen beide getrennt, driften
   Titel und Produktname auseinander, und Google sieht auf derselben Seite
   zwei verschiedene Produktbezeichnungen. */
export function wineSeo(slug, locale = DEFAULT_LOCALE, dict = {}) {
  /* Dieselbe Zusammenführung wie auf der Seite: das Text-Overlay der
     aktiven Sprache legt sich über die deutsche Basis. Ohne diesen Schritt
     trugen Datenblatt und FAQ im JSON-LD deutschen Text, während die Seite
     darüber übersetzt rendert — Google las auf /it und /en eine deutsche
     Produktbeschreibung. */
  const page = localizeWinePage(WINE_PAGES[slug], dict?.weinePages?.[slug]);
  if (!page) return null;

  /* `catalogName` ist die erklärte Verbindung zwischen Landingpage und
     Katalog — dieselbe, die auch die Seite selbst benutzt. */
  const base = byName(page.catalogName);
  if (!base) return null;

  const catalogue = dict?.common?.catalogue ?? {};
  const wine = localizeWine(base, catalogue);
  const templates = dict?.meta?.wine ?? {};

  const values = {
    /* Der Katalogname ist der amtliche: „Lugana D.O.P." trägt die geschützte
       Herkunftsbezeichnung, die Überschrift der Seite kürzt sie zu „Lugana
       DOC". In Titel, Description und Produktnamen gehört die vollständige
       Form — nach ihr wird gesucht. */
    name: base.name,
    year: base.year,
    type: wine.type,
    region: wine.region,
    notes: joinList(locale, wine.notes),
    pairing: wine.pairing,
    price: formatPrice(locale, base.price),
  };

  const description = fitDescription(
    fill(templates.description, values),
    fill(templates.descriptionPrice, values)
  );

  return {
    slug,
    name: base.name,
    /* Für den <title>: der Markenname kommt aus dem title.template des
       Layouts und steht deshalb NICHT in der Vorlage. Genau dieser doppelte
       Anhang war der Fehler vorher — „Lugana DOC — Maria Maria — Maria Maria". */
    title: fitTitle(fill(templates.title, values)),
    description,
    price: base.price,
    category: wine.type,
    /* Bildreihenfolge nach Nutzen für die Suche: erst der freigestellte
       Packshot (das Motiv, das in Produktergebnissen erwartet wird), dann
       das Stimmungsbild, zuletzt das Rückenetikett mit dem Datenblatt. */
    images: [page.images?.front, page.images?.hero, page.images?.back].filter(Boolean),
    /* Das Teaserbild fürs Teilen — quer, 1200 × 630, aus dem Kellerei-Motiv
       geschnitten (scripts/og-images.mjs). */
    ogImage: {
      url: `/img/og/wines/${slug}.jpg`,
      width: 1200,
      height: 630,
      alt: fill(templates.ogImageAlt, values),
    },
    /* Das Datenblatt als Attribut-Paare. `wide`/`span` ist reine
       Layout-Information und hat in strukturierten Daten nichts verloren. */
    properties: (page.detail ?? []).map(({ label, value }) => ({ name: label, value })),
    /* Die Fragen führt der FAQ-Editor (lib/faq/store); ohne Eintrag dort
       bleibt es bei der Liste aus wineData.js. */
    faq: dict?.faqWines?.[slug] ?? page.faq ?? [],
    lede: page.lede,
  };
}

/* Der Pfad zur Krume: Home › Unsere Weine › <Wein>.

   Bewusst aus dem Wörterbuch statt aus `wineData.breadcrumb` — die dortige
   Fassung ist deutsch und stünde damit auch über der englischen Seite. Die
   Navigationsbeschriftungen sind in allen vier Sprachen gepflegt und meinen
   dieselben Ziele. */
export function wineBreadcrumb(slug, dict = {}, name = "") {
  const nav = dict?.common?.nav ?? {};
  return [
    { label: nav.home || "Home", href: "/" },
    { label: nav.wines || "Unsere Weine", href: "/unsere-weine" },
    { label: name, href: `/unsere-weine/${slug}` },
  ];
}
