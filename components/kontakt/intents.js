/* Die technischen Werte der Kontakt-Anliegen.

   Handoff §14, „REGOLA TECNICA": Die Beschriftungen sind deutsch und dürfen
   sich ändern; die Werte hier bleiben stabil, weil Backend, Lead-Routing und
   Auswertung an ihnen hängen. Genau dieser Fehler steckte in der alten
   Fassung des Formulars — dort verglich der Code den sichtbaren String
   („Verkostungsanfrage"), womit auf /it, /en und /cs die Zusatzfelder nie
   aufklappten.

   `key` ist der Wörterbuch-Schlüssel (content/<sprache>/kontakt.js),
   `value` der Wert, der das Haus verlässt. Beide getrennt zu halten kostet
   eine Zeile und erspart die nächste stille Fehlübersetzung. */

export const FORM_ANCHOR = "anfrage";

/* Vorbelegung über die Adresse — Homepage-Brief §5 („Destinazioni CTA").

   Die drei Segment-Karten der Startseite verlinken auf
   /kontakt?anliegen=gastronomie-feinkost | handel-wiederverkauf |
   events-verkostungen. Der Parameter wählt das Anliegen im Formular vor,
   erzeugt aber KEINE eigene indexierbare Seite: Canonical der Kontaktseite
   bleibt /kontakt (lib/i18n/metadata.js kennt die Query gar nicht).

   Die Adresswerte sind bewusst Bindestrich-Slugs (lesbar, so wie der Brief
   sie vorgibt) und werden hier auf die stabilen technischen Werte
   abgebildet. „events-verkostungen" fasst zwei Anliegen zusammen — Events
   ist die naheliegendere Vorbelegung, die Verkostung wählt der Nutzer im
   selben Dropdown. Zusätzlich gelten die technischen Werte selbst (mit
   Bindestrich oder Unterstrich), damit ein von Hand gebauter Link nicht ins
   Leere läuft. */
export const INTENT_QUERY_PARAM = "anliegen";

const QUERY_INTENTS = {
  "gastronomie-feinkost": "gastronomie_feinkost",
  "handel-wiederverkauf": "handel_wiederverkauf",
  "events-verkostungen": "event_feier",
  "event-feier": "event_feier",
  "individuelle-auswahl": "individuelle_auswahl",
};

export function intentFromQuery(raw) {
  if (typeof raw !== "string") return null;
  const key = raw.trim().toLowerCase();
  if (!key) return null;
  if (QUERY_INTENTS[key]) return QUERY_INTENTS[key];
  return FORM_INTENTS.includes(key) ? key : null;
}

/* Die vier Karten der 2×2-Kachel — Reihenfolge wie im Mockup. */
export const INTENT_CARDS = [
  { key: "gastronomie", value: "gastronomie_feinkost", icon: "Cutlery" },
  { key: "handel", value: "handel_wiederverkauf", icon: "Bag" },
  { key: "event", value: "event_feier", icon: "Cheers" },
  { key: "verkostung", value: "verkostung", icon: "WineGlass" },
];

/* Die Auswahl im Formular ist länger als die Kachel: „Individuelle
   Weinauswahl" und „Sonstiges" haben keine eigene Karte, sind aber gültige
   Anliegen. */
export const FORM_INTENTS = [
  "gastronomie_feinkost",
  "handel_wiederverkauf",
  "event_feier",
  "verkostung",
  "individuelle_auswahl",
  "sonstiges",
];

/* Welche Zusatzfelder ein Anliegen aufklappt — Handoff §9.

   Die Liste ist zugleich die Reihenfolge im Formular UND die Menge der
   Felder, die überhaupt mitgeschickt werden. Was hier nicht steht, wird beim
   Absenden verworfen, auch wenn der Nutzer es vorher in einem anderen
   Anliegen ausgefüllt hatte: Sonst reist die Gästezahl einer verworfenen
   Event-Anfrage in einer Händleranfrage mit. */
export const CONDITIONAL_FIELDS = {
  event_feier: ["eventDate", "eventType", "guests", "location"],
  gastronomie_feinkost: ["businessTypeGastro", "selection"],
  handel_wiederverkauf: ["businessTypeHandel", "selection"],
  verkostung: ["tastingDate", "persons", "occasion"],
  individuelle_auswahl: ["context", "guestsOptional", "style"],
  sonstiges: [],
};

/* Feldtypen der Zusatzfelder — das Formular baut daraus das Markup, statt
   fünf Varianten desselben Blocks zu wiederholen. */
export const CONDITIONAL_TYPES = {
  eventDate: "date",
  tastingDate: "date",
  occasion: "select",
  businessTypeGastro: "select",
  businessTypeHandel: "select",
  guests: "number",
  persons: "number",
  guestsOptional: "number",
};

/* Zusatzfelder, die über die volle Breite laufen statt in der Zweispalte
   zu stehen — die beiden Freitextfelder brauchen den Platz. */
export const CONDITIONAL_WIDE = new Set(["selection", "style"]);
