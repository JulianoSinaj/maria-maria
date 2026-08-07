/* Zentrale Seiten-Konstanten für Metadaten und strukturierte Daten.

   Die Domain steht bewusst nicht im Code: sie kommt aus NEXT_PUBLIC_SITE_URL
   (in Vercel/Hosting einmal setzen). Ohne die Variable greift der Fallback —
   die Seite baut und läuft dann normal, nur Canonical-, OpenGraph- und
   JSON-LD-URLs zeigen auf den Platzhalter. Das ist Absicht: ein falsch
   geratener Canonical ist schlimmer als ein offensichtlicher Platzhalter.

   Trailing Slash wird abgeschnitten, damit `${SITE_URL}/magazin` nie zu einer
   doppelten Schrägstrich-URL wird. */

const FALLBACK_URL = "https://www.mariamaria.wine";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || FALLBACK_URL).replace(/\/+$/, "");

export const SITE_NAME = "Maria Maria";
export const SITE_TAGLINE = "Il piacere del vino";
export const SITE_LOCALE = "de_DE";

/* Profile der Marke — als `sameAs` in den strukturierten Daten */
export const SOCIAL_PROFILES = [
  "https://www.instagram.com/mariamaria.wine",
  "https://www.facebook.com/mariamaria.wine",
];

/* Absolute URL aus einem seitenrelativen Pfad — Canonicals und JSON-LD
   brauchen sie absolut, `metadata.alternates` in Next.js dagegen relativ. */
export function absoluteUrl(path = "/") {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/* Die Organisation hinter allen Seiten — Basis für Publisher-Angaben. */
export const ORGANIZATION = {
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: absoluteUrl("/img/logo.png"),
  sameAs: SOCIAL_PROFILES,
};
