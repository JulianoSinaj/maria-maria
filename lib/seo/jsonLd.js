/* Strukturierte Daten — ein zusammenhängender Graph statt vieler Inseln.

   Der entscheidende Unterschied zu „jede Seite bekommt einen JSON-LD-Block":
   Alle Knoten hier tragen eine stabile `@id` und verweisen über `{"@id": …}`
   aufeinander. Google baut daraus EINE Entität „Maria Maria" mit Adresse,
   Profilen und neun Produkten — statt achtzig unverbundener Beschreibungen,
   die sich gegenseitig nicht kennen. Genau diese Verkettung ist es, die aus
   Markup ein Wissensgraph-Eintrag werden lässt.

   Regeln, die hier durchgehalten werden:

   1. NUR beschreiben, was auf der Seite steht. Strukturierte Daten, die
      etwas behaupten, das ein Besucher nicht sieht, sind ein Verstoß gegen
      Googles Richtlinien und im Wiederholungsfall eine manuelle Maßnahme.
   2. KEINE erfundenen Bewertungen. `aggregateRating` ohne echte Rezensionen
      ist der häufigste Grund für eine Abstrafung von Produkt-Markup — und
      der einzige Fehler in dieser Datei, der nicht reparabel wäre.
   3. Preise, Adresse und Rückgabefrist stammen aus derselben Quelle wie die
      sichtbaren Texte (lib/site.js, components/data.js, content/<sprache>/legal.js).
      Wo Markup und Seite auseinanderlaufen, ist immer die Seite maßgeblich.

   Was hier NICHT steht: `SearchAction` im WebSite-Knoten. Die Storefront hat
   keine Suchseite — ein Sitelinks-Searchbox-Markup ohne Suche darunter wäre
   eine Angabe ins Leere. */

import {
  SITE_NAME,
  SITE_URL,
  SITE_TAGLINE,
  SOCIAL_PROFILES,
  BUSINESS,
  COMMERCE,
  FOUNDING_YEAR,
  absoluteUrl,
} from "@/lib/site";
import { LOCALE_META, DEFAULT_LOCALE } from "@/lib/i18n/config";

/* --- Stabile Knoten-Adressen ------------------------------------------- */

/* Die beiden globalen Knoten hängen an der Wurzel, nicht an der Sprache: Es
   gibt EIN Unternehmen und EINE Website, in vier Sprachfassungen. Bekämen
   sie je Sprache eine eigene @id, entstünden vier Firmen mit derselben
   Adresse — und Google müsste raten, welche gemeint ist. */
export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

const nodeId = (url, fragment) => `${url}#${fragment}`;

/* --- Die Organisation --------------------------------------------------- */

/* `OnlineStore` statt `LocalBusiness`: Maria Maria verkauft online und führt
   am Firmensitz kein Ladengeschäft mit Laufkundschaft.
   LocalBusiness-Markup verspricht Öffnungszeiten und einen Kartenpunkt, an
   dem man Wein kaufen kann — wer daraufhin hinfährt, steht vor einer Tür.
   `OnlineStore` ist ein Untertyp von `Organization`, alle publisher-Verweise
   funktionieren unverändert. */
export function organizationNode({ description } = {}) {
  return {
    "@type": "OnlineStore",
    "@id": ORG_ID,
    name: SITE_NAME,
    legalName: BUSINESS.legalName,
    alternateName: `${SITE_NAME} — ${SITE_TAGLINE}`,
    url: `${SITE_URL}/`,
    slogan: SITE_TAGLINE,
    /* Die Beschreibung reist je Sprachfassung herein (meta.orgDescription):
       sie stand hier deutsch und erschien so auch im Graphen von /en und
       /cs — genau der Text, aus dem Suchmaschinen die Marke beschreiben. */
    description: description ?? "",
    foundingDate: FOUNDING_YEAR,
    /* Als ImageObject statt als nackte URL: Google verlangt für das Logo im
       Wissensgraph nachweisbare Kantenlängen. */
    logo: {
      "@type": "ImageObject",
      "@id": `${SITE_URL}/#logo`,
      url: absoluteUrl("/img/logo.png"),
      contentUrl: absoluteUrl("/img/logo.png"),
      caption: SITE_NAME,
    },
    image: { "@id": `${SITE_URL}/#logo` },
    address: {
      "@type": "PostalAddress",
      streetAddress: BUSINESS.street,
      postalCode: BUSINESS.postalCode,
      addressLocality: BUSINESS.city,
      addressRegion: BUSINESS.region,
      addressCountry: BUSINESS.country,
    },
    email: BUSINESS.email,
    telephone: BUSINESS.phone,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: BUSINESS.email,
      telephone: BUSINESS.phone,
      /* Die Sprachen, in denen tatsächlich geantwortet wird — die Storefront
         läuft in vier, der Kundendienst sitzt in Deutschland. */
      availableLanguage: ["de", "it", "en"],
      areaServed: COMMERCE.shipsTo,
    },
    /* sameAs zieht Website und Social-Profile zu einer Entität zusammen —
       ohne diese Verweise bleiben es für Google fremde Konten. */
    sameAs: SOCIAL_PROFILES,
  };
}

/* --- Die Website -------------------------------------------------------- */

export function websiteNode(locale = DEFAULT_LOCALE) {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: `${SITE_URL}/`,
    name: SITE_NAME,
    alternateName: SITE_TAGLINE,
    publisher: { "@id": ORG_ID },
    inLanguage: LOCALE_META[locale]?.hreflang ?? DEFAULT_LOCALE,
  };
}

/* --- Die einzelne Seite ------------------------------------------------- */

/* Der WebPage-Knoten ist der Anker, an dem Breadcrumb, Produkt und Bild
   hängen. Ohne ihn stehen die anderen Knoten beziehungslos nebeneinander;
   mit ihm weiß Google, dass sie DIESELBE Seite beschreiben.

   `type` erlaubt die genauere Bauform — CollectionPage für Übersichten,
   ItemPage für Produktseiten, AboutPage, ContactPage. Sie sagt Google, was
   für eine Art Seite das ist, bevor es einen Buchstaben Text gelesen hat. */
export function webPageNode({
  url,
  name,
  description,
  locale = DEFAULT_LOCALE,
  type = "WebPage",
  image = null,
  breadcrumbId = null,
  datePublished = null,
  dateModified = null,
}) {
  return {
    "@type": type,
    "@id": nodeId(url, "webpage"),
    url,
    name,
    ...(description ? { description } : null),
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORG_ID },
    inLanguage: LOCALE_META[locale]?.hreflang ?? DEFAULT_LOCALE,
    ...(image
      ? {
          primaryImageOfPage: {
            "@type": "ImageObject",
            url: absoluteUrl(typeof image === "string" ? image : image.url),
            ...(typeof image === "object" && image.alt ? { caption: image.alt } : null),
          },
        }
      : null),
    ...(breadcrumbId ? { breadcrumb: { "@id": breadcrumbId } } : null),
    ...(datePublished ? { datePublished } : null),
    ...(dateModified ? { dateModified } : null),
  };
}

/* --- Breadcrumb --------------------------------------------------------- */

/* Ersetzt in der Suchergebniszeile die nackte URL durch den Pfad
   „mariamaria.wine › Unsere Weine › Lugana DOC". Das ist kein Schmuck: Der
   Pfad zeigt dem Suchenden vor dem Klick, wo er landet, und trägt zusätzlich
   die Kategoriewörter in die Ergebniszeile.

   Die LETZTE Station bekommt bewusst kein `item`. Sie ist die Seite selbst;
   ein Link auf sich selbst ist laut Googles Spezifikation überflüssig und
   führt bei manchen Validatoren zu einer Warnung. */
export function breadcrumbNode(items = [], { url, localize = (p) => p } = {}) {
  const usable = items.filter((i) => i && i.label);
  if (usable.length < 2) return null;

  return {
    "@type": "BreadcrumbList",
    "@id": nodeId(url, "breadcrumb"),
    itemListElement: usable.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href && index < usable.length - 1
        ? { item: absoluteUrl(localize(item.href)) }
        : null),
    })),
  };
}

/* --- Angebot ------------------------------------------------------------ */

/* Preise laufen kalenderjährlich ab: `priceValidUntil` in der Vergangenheit
   lässt Google das Angebot als veraltet werten und die Preisanzeige im
   Suchergebnis verschwinden. Der 31.12. des FOLGENDEN Jahres gibt jedem
   Build mindestens zwölf Monate Vorlauf. */
function priceValidUntil() {
  return `${new Date().getFullYear() + 1}-12-31`;
}

/* Versandkonditionen aus lib/site.js — dieselben Zahlen, die im Shop stehen.
   Google zeigt Lieferzeit und Versandkosten direkt im Suchergebnis an; die
   Angabe muss deshalb stimmen, nicht optimistisch sein. */
function shippingDetails() {
  return {
    "@type": "OfferShippingDetails",
    shippingRate: {
      "@type": "MonetaryAmount",
      value: COMMERCE.shippingCost,
      currency: COMMERCE.currency,
    },
    shippingDestination: COMMERCE.shipsTo.map((country) => ({
      "@type": "DefinedRegion",
      addressCountry: country,
    })),
    deliveryTime: {
      "@type": "ShippingDeliveryTime",
      handlingTime: {
        "@type": "QuantitativeValue",
        minValue: COMMERCE.handlingDaysMin,
        maxValue: COMMERCE.handlingDaysMax,
        unitCode: "DAY",
      },
      transitTime: {
        "@type": "QuantitativeValue",
        minValue: COMMERCE.transitDaysMin,
        maxValue: COMMERCE.transitDaysMax,
        unitCode: "DAY",
      },
    },
  };
}

/* § 7 AGB: vierzehn Tage gesetzliches Widerrufsrecht, Rücksendekosten trägt
   der Käufer. `ReturnShippingFees` bildet genau das ab — die schmeichelhafte
   Alternative `FreeReturn` wäre falsch und widerspräche den eigenen AGB. */
function returnPolicy() {
  return {
    "@type": "MerchantReturnPolicy",
    applicableCountry: COMMERCE.shipsTo,
    returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
    merchantReturnDays: COMMERCE.returnDays,
    returnMethod: "https://schema.org/ReturnByMail",
    returnFees: "https://schema.org/ReturnShippingFees",
  };
}

export function offerNode({ url, price, availability = "InStock" }) {
  return {
    "@type": "Offer",
    "@id": nodeId(url, "offer"),
    url,
    /* Als String mit zwei Nachkommastellen: `16.9` als Zahl liest Google als
       „16,90", `"16.90"` ist unmissverständlich. */
    price: Number(price).toFixed(2),
    priceCurrency: COMMERCE.currency,
    priceValidUntil: priceValidUntil(),
    availability: `https://schema.org/${availability}`,
    itemCondition: "https://schema.org/NewCondition",
    seller: { "@id": ORG_ID },
    shippingDetails: shippingDetails(),
    hasMerchantReturnPolicy: returnPolicy(),
  };
}

/* --- Produkt ------------------------------------------------------------ */

/* Die wertvollsten neun Seiten der Domain. Was hier fehlt, fehlt in den
   Produkt-Rich-Results: ohne `image` keine Bildvorschau, ohne `offers` kein
   Preis, ohne `sku` keine Zuordnung über Google Shopping hinweg.

   `additionalProperty` trägt das Datenblatt — Rebsorte, Herkunft, Ausbau,
   Serviertemperatur. Für Wein gibt es bei schema.org keinen eigenen Typ, und
   generische PropertyValue-Paare sind der dokumentierte Weg, fachliche
   Attribute anzuhängen. Sie sind es, aus denen eine KI-Antwortmaschine
   „Welcher italienische Weißwein passt zu Fisch?" beantworten kann. */
/* `Country` ist bei schema.org ein Ort, und ein Ort trägt einen Namen, kein
   Länderkürzel: „IT" wäre für einen Parser derselbe undurchsichtige String
   wie „XY". Der Name in der Seitensprache — die strukturierten Daten
   beschreiben eine deutschsprachige Seite und sollen deutsch antworten. */
const ITALY = { de: "Italien", it: "Italia", en: "Italy", cs: "Itálie" };

export function productNode({
  url,
  name,
  description,
  images = [],
  sku,
  category = null,
  price,
  availability = "InStock",
  properties = [],
  locale = DEFAULT_LOCALE,
}) {
  return {
    "@type": "Product",
    "@id": nodeId(url, "product"),
    name,
    description,
    url,
    sku,
    /* mpn spiegelt sku: Ohne eine der beiden Kennungen (oder GTIN) verweigert
       Google Merchant-Listings die Zuordnung desselben Produkts über
       verschiedene Quellen hinweg. Eine echte EAN gehört hier hinein, sobald
       die Etiketten sie tragen. */
    mpn: sku,
    ...(images.length ? { image: images.map((src) => absoluteUrl(src)) } : null),
    brand: { "@type": "Brand", name: SITE_NAME },
    manufacturer: { "@id": ORG_ID },
    ...(category ? { category } : null),
    countryOfOrigin: { "@type": "Country", name: ITALY[locale] ?? ITALY[DEFAULT_LOCALE] },
    ...(properties.length
      ? {
          additionalProperty: properties
            .filter((p) => p && p.name && p.value)
            .map((p) => ({ "@type": "PropertyValue", name: p.name, value: String(p.value) })),
        }
      : null),
    offers: offerNode({ url, price, availability }),
    /* Kein `isPartOf` auf den Breadcrumb: Die Eigenschaft gehört bei
       schema.org zu CreativeWork, nicht zu Product — und eine Krümelspur
       ist ohnehin kein Ding, dessen Teil ein Wein wäre. Die Verbindung
       zwischen Seite und Pfad stellt der WebPage-Knoten her, dort gehört
       sie hin. */
    /* Kein aggregateRating und kein review: Es gibt keine echten Bewertungen.
       Erfundene sind der schnellste Weg zu einer manuellen Maßnahme — und die
       trifft nicht nur das Markup, sondern die ganze Domain. */
  };
}

/* --- Liste ------------------------------------------------------------- */

/* Für Übersichtsseiten: sagt Google, dass /unsere-weine neun Produkte in
   dieser Reihenfolge zeigt, und verkettet sie mit ihren Detailseiten. Die
   Übersicht wird damit zum Verteiler statt zur konkurrierenden Textseite. */
export function itemListNode({ url, items = [], name = null }) {
  const usable = items.filter((i) => i && i.url);
  if (!usable.length) return null;

  return {
    "@type": "ItemList",
    "@id": nodeId(url, "itemlist"),
    ...(name ? { name } : null),
    numberOfItems: usable.length,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    itemListElement: usable.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: absoluteUrl(item.url),
    })),
  };
}

/* --- Häufige Fragen ----------------------------------------------------- */

/* Seit August 2023 zeigt Google FAQ-Rich-Results nur noch für Behörden- und
   Gesundheitsseiten — die klassische Aufklapp-Darstellung im Suchergebnis
   ist für eine Weinseite also nicht mehr zu holen.

   Das Markup steht trotzdem hier, aus einem anderen Grund: Google AI
   Overviews, ChatGPT und Perplexity lesen strukturierte Daten, um Frage und
   Antwort als Paar zu erkennen. Ein Fließtext-Akkordeon müssen sie erst
   interpretieren; ein FAQPage-Knoten liefert die Zuordnung fertig. Für eine
   Marke, die auf „Welcher Wein passt zu …" gefunden werden will, ist das der
   direkteste Weg in eine generierte Antwort.

   Voraussetzung bleibt: Jede Frage und jede Antwort steht sichtbar auf der
   Seite. Genau das tun sie — FaqSection rendert dieselbe Quelle. */
export function faqNode({ url, items = [] }) {
  const usable = items.filter((i) => i && i.q && i.a);
  if (!usable.length) return null;

  return {
    "@type": "FAQPage",
    "@id": nodeId(url, "faq"),
    mainEntity: usable.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

/* --- Redaktionelle Stücke ----------------------------------------------- */

/* Die Person, mit der gesprochen wurde.

   Ein eigener Knoten, kein Freitext im Article: Daniele Malavasi ist eine
   reale Entität mit eigener Firmenseite. Über `sameAs` auf die Cantina
   verbindet sich unser Artikel mit der Person, die Google dort schon kennt —
   statt einen zweiten, namensgleichen Fremden anzulegen. `worksFor` bleibt
   bewusst ein reiner Organisationsname ohne @id: Die Cantina ist NICHT
   Maria Maria, und der ORG_ID-Knoten dieser Domain darf sie nicht einsammeln.

   Der Knoten beschreibt nur, was im Profilkasten am Fuß des Artikels auch
   sichtbar steht (Regel 1 im Kopf dieser Datei). */
export function personNode({ url, name, jobTitle = null, worksFor = null, sameAs = null, image = null }) {
  if (!name) return null;

  return {
    "@type": "Person",
    "@id": nodeId(url, "person"),
    name,
    ...(jobTitle ? { jobTitle } : null),
    ...(worksFor ? { worksFor: { "@type": "Organization", name: worksFor } } : null),
    ...(sameAs ? { sameAs: [].concat(sameAs) } : null),
    ...(image ? { image: absoluteUrl(image) } : null),
  };
}

/* Der Artikel selbst.

   `datePublished` ist optional und fehlt, solange die Redaktion kein Datum
   gesetzt hat. Das ist die ehrliche Variante: Ein erfundenes oder aus dem
   Build-Zeitpunkt abgeleitetes Datum wäre eine Angabe, die auf der Seite
   nirgends steht — und würde bei jedem Deploy stillschweigend neu altern.

   `author` und `interviewee` sind verschiedene Rollen: Geschrieben hat die
   Redakteurin, gesprochen hat der Winzer. Wer beide zusammenwirft,
   behauptet, der Winzer habe den Text verfasst.

   `mainEntityOfPage` zeigt auf den WebPage-Knoten derselben URL — damit ist
   für Google eindeutig, dass Artikel und Seite dasselbe Stück sind und die
   Adresse die kanonische ist. */
export function articleNode({
  url,
  headline,
  description = null,
  locale = DEFAULT_LOCALE,
  image = null,
  authorName = null,
  intervieweeId = null,
  datePublished = null,
  dateModified = null,
  section = null,
  keywords = null,
  webPageId = null,
}) {
  return {
    "@type": "Article",
    "@id": nodeId(url, "article"),
    /* Google kürzt Headlines über 110 Zeichen im Ergebnis — die H1 dieser
       Strecke bleibt darunter, deshalb steht sie unverändert hier. */
    headline,
    ...(description ? { description } : null),
    inLanguage: LOCALE_META[locale]?.hreflang ?? DEFAULT_LOCALE,
    ...(image
      ? {
          image: {
            "@type": "ImageObject",
            url: absoluteUrl(typeof image === "string" ? image : image.url),
            ...(typeof image === "object" && image.alt ? { caption: image.alt } : null),
          },
        }
      : null),
    ...(authorName
      ? { author: { "@type": "Person", name: authorName } }
      : { author: { "@id": ORG_ID } }),
    ...(intervieweeId ? { interviewee: { "@id": intervieweeId } } : null),
    publisher: { "@id": ORG_ID },
    ...(datePublished ? { datePublished } : null),
    ...(dateModified ? { dateModified } : null),
    ...(section ? { articleSection: section } : null),
    ...(keywords ? { keywords: [].concat(keywords).join(", ") } : null),
    ...(webPageId ? { mainEntityOfPage: { "@id": webPageId } } : null),
  };
}

/* --- Zusammenbau -------------------------------------------------------- */

/* Bündelt Knoten zu einem @graph. Eine fertige Seite trägt genau zwei
   Blöcke: den globalen aus dem Layout (Unternehmen + Website) und den der
   Seite selbst. Zusammengehörige Knoten stehen damit immer im selben Block,
   und die blockübergreifenden Verweise gehen ausschließlich in eine
   Richtung — von der Seite auf die beiden festen @ids der Wurzel, die auf
   jeder Seite mitgeliefert werden. Für einen Parser, der die Blöcke eines
   Dokuments zusammenführt, ist das dasselbe wie ein einziger Graph; für
   einen, der es nicht tut, bleiben die Verweise trotzdem auflösbar, weil
   ihre Ziele im selben Dokument stehen. */
export function graph(...nodes) {
  return {
    "@context": "https://schema.org",
    "@graph": nodes.flat().filter(Boolean),
  };
}
