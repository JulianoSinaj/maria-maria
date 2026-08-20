/* Zentrale Seiten-Konstanten für Metadaten und strukturierte Daten.

   Die Domain steht bewusst nicht im Code verstreut: sie kommt aus
   NEXT_PUBLIC_SITE_URL (in Vercel/Hosting einmal setzen). Ohne die Variable
   greift der Fallback — die Seite baut und läuft dann normal, nur Canonical-,
   OpenGraph- und JSON-LD-URLs zeigen auf die hier hinterlegte Adresse.

   ACHTUNG: Diese eine Konstante bestimmt jede Canonical-URL, jeden hreflang-
   Eintrag, jede Sitemap-Zeile und jede @id im JSON-LD. Zeigt sie auf die
   falsche Domain, meldet die Seite Google konsequent eine Adresse, unter der
   sie nicht erreichbar ist — der teuerste Einzelfehler, den technisches SEO
   kennt. Vor dem Produktiv-Deploy prüfen.

   Trailing Slash wird abgeschnitten, damit `${SITE_URL}/magazin` nie zu einer
   doppelten Schrägstrich-URL wird. */

const FALLBACK_URL = "https://maira.testdemo.it";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || FALLBACK_URL).replace(/\/+$/, "");

export const SITE_NAME = "Maria Maria";
export const SITE_TAGLINE = "Il piacere del vino";
export const SITE_LOCALE = "de_DE";

/* Gründungsjahr der Marke in Deutschland — taucht in der Markenerzählung
   („seit 2019 in Deutschland zu Hause") und in `foundingDate` auf. */
export const FOUNDING_YEAR = "2019";

/* Profile der Marke — als `sameAs` in den strukturierten Daten. sameAs ist
   der Weg, auf dem Google Website und Social-Profile zu EINER Entität
   zusammenzieht; jedes fehlende Profil ist eine verpasste Bestätigung. */
export const SOCIAL_PROFILES = [
  "https://www.instagram.com/mariamaria.wine",
  "https://www.facebook.com/mariamaria.wine",
  "https://www.linkedin.com/company/mariamaria-wine",
];

/* Das Unternehmen hinter der Marke — die Angaben sind identisch mit dem
   Impressum (content/<sprache>/legal.js). Weicht das JSON-LD vom Impressum
   ab, ist genau eine der beiden Stellen falsch; deshalb liegen die Werte
   hier einmal und werden von dort zitiert. */
export const BUSINESS = {
  legalName: "Maria Maria Wines GmbH",
  street: "Ellerfelderstrasse 78",
  postalCode: "40822",
  city: "Mettmann",
  region: "Nordrhein-Westfalen",
  country: "DE",
  countryName: "Deutschland",
  /* Kontakt-Handoff 18.08.2026: die verbindliche Adresse ist
     info@maria-maria.de — NICHT die frühere Adresse auf der .wine-Domain.
     Von hier lesen Kontaktseite, Footer, mobiles Menü, Rechtstexte-Kasten
     und JSON-LD. */
  email: "info@maria-maria.de",
  /* Telefon: Die Düsseldorfer Festnetznummer aus dem alten Mockup ist laut
     Handoff NICHT zu verwenden; eine bestätigte Nummer liegt noch nicht vor.
     Bis dahin bleiben beide Felder leer — Kontaktseite, Footer und JSON-LD
     blenden die Telefonzeile dann aus, statt eine falsche Nummer zu zeigen.
     Sobald die Nummer bestätigt ist: `phone` in E.164-Schreibweise
     ("+49…", ohne Leerzeichen — Google will die internationale Form) und
     `phoneDisplay` als Lesefassung eintragen. Mehr ist nicht zu tun. */
  phone: null,
  phoneDisplay: null,
};

/* Vorschau-/Staging-Deployments (Vercel Preview, Testdomain) dürfen nicht in
   den Index: Sie würden mit der Live-Domain um dieselben Inhalte konkurrieren.
   VERCEL_ENV setzt Vercel selbst; NEXT_PUBLIC_NOINDEX=1 ist der Schalter für
   jedes andere Staging. Produktion bleibt unberührt — dort ist keine der
   beiden Variablen gesetzt. */
export const IS_PREVIEW =
  process.env.VERCEL_ENV === "preview" || process.env.NEXT_PUBLIC_NOINDEX === "1";

/* Versand- und Rückgabekonditionen, wie sie in AGB und Shop stehen.
   Google liest sie aus dem Offer-Knoten und zeigt „Kostenloser Versand"
   bzw. das Rückgabefenster direkt im Suchergebnis an. */
export const COMMERCE = {
  currency: "EUR",
  freeShippingFrom: 69,
  shippingCost: 4.9,
  /* Bearbeitung + Transport in Werktagen — „Versand in 1–3 Werktagen" */
  handlingDaysMin: 0,
  handlingDaysMax: 1,
  transitDaysMin: 1,
  transitDaysMax: 3,
  /* § 7 AGB: gesetzliches Widerrufsrecht, Rücksendekosten trägt der Käufer */
  returnDays: 14,
  shipsTo: ["DE", "AT"],
};

/* Absolute URL aus einem seitenrelativen Pfad — Canonicals und JSON-LD
   brauchen sie absolut, `metadata.alternates` in Next.js dagegen relativ. */
export function absoluteUrl(path = "/") {
  if (typeof path !== "string") return SITE_URL;
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/* Das Standard-Teaserbild für Seiten ohne eigenes Motiv. Ohne dieses Bild
   rendert Twitter/X die Karte trotz `summary_large_image` als schmale
   Textzeile und LinkedIn zeigt gar nichts — bei geteilten Links kostet das
   unmittelbar Klicks. Erzeugt von scripts/og-images.mjs. */
export const DEFAULT_OG_IMAGE = {
  url: "/img/og/default.jpg",
  width: 1200,
  height: 630,
};

/* Die Organisation hinter allen Seiten — Basis für Publisher-Angaben.

   Bewusst schlank gehalten und ohne @id: Wer den vollständigen Knoten mit
   Adresse, Kontaktpunkt und Öffnungszeiten braucht, nimmt
   `organizationNode()` aus lib/seo/jsonLd.js. Diese Kurzform bleibt für
   `publisher`-Referenzen bestehen. */
export const ORGANIZATION = {
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: absoluteUrl("/img/logo.png"),
  sameAs: SOCIAL_PROFILES,
};
