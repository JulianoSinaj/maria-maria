/* Lineare Icons der Kontaktseite — 48er-Viewbox, Strichstärke 1.3, runde
   Enden: derselbe Strichstil wie components/Icons.jsx, damit die vier
   Intent-Karten, die Hinweiskästen und die Vertrauenszeile aus einer Hand
   wirken (Handoff §13: „Icone lineari, sottili, coerenti tra loro").

   Keine "use client"-Direktive: reine SVGs ohne State, in Server- wie
   Client-Komponenten gleichermaßen verwendbar. */

const F = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.3,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

/* Gastronomie & Feinkost — Gabel und Messer */
export const Cutlery = (p) => (
  <svg viewBox="0 0 48 48" {...F} {...p}>
    <path d="M17 8v32" />
    <path d="M12 8v9a5 5 0 0 0 10 0V8" />
    <path d="M31 40V8c-3 2-5 7-5 13 0 4 2 6 5 6" />
  </svg>
);

/* Handel & Wiederverkauf — Einkaufstasche */
export const ShoppingBag = (p) => (
  <svg viewBox="0 0 48 48" {...F} {...p}>
    <path d="M11 17h26l-2 22H13z" />
    <path d="M18 17v-3a6 6 0 0 1 12 0v3" />
    <path d="M18 23v2M30 23v2" />
  </svg>
);

/* Events & besondere Anlässe — zwei Gläser, die anstoßen */
export const Cheers = (p) => (
  <svg viewBox="0 0 48 48" {...F} {...p}>
    <path d="M14 9c-3 7-3 12 2 14 1 4-1 12-3 16" />
    <path d="M34 9c3 7 3 12-2 14-1 4 1 12 3 16" />
    <path d="M8 39h10M30 39h10" />
    <path d="M16 23c2 1 4 1 6 0" />
    <path d="M26 23c2 1 4 1 6 0" />
    <path d="M24 13v3M21 11l-1-2M27 11l1-2" />
  </svg>
);

/* Verkostung & individuelle Auswahl — ein Weinglas */
export const WineGlass = (p) => (
  <svg viewBox="0 0 48 48" {...F} {...p}>
    <path d="M16 8h16c0 9-2 15-8 16-6-1-8-7-8-16z" />
    <path d="M24 24v15" />
    <path d="M17 40h14" />
    <path d="M17.5 16h13" />
  </svg>
);

/* Hinweiskasten „Bei Event" — Kalender */
export const Calendar = (p) => (
  <svg viewBox="0 0 48 48" {...F} {...p}>
    <rect x="9" y="12" width="30" height="27" rx="2.5" />
    <path d="M9 20h30" />
    <path d="M17 8v7M31 8v7" />
    <path d="M16 27h4M22 27h4M28 27h4M16 33h4M22 33h4" />
  </svg>
);

/* Hinweiskasten „Bei Gastronomie/Handel" — Ladenfront mit Markise */
export const Storefront = (p) => (
  <svg viewBox="0 0 48 48" {...F} {...p}>
    <path d="M9 19l2-8h26l2 8" />
    <path d="M9 19c0 2.5 2 4 4.5 4s4.5-1.5 4.5-4c0 2.5 2 4 4.5 4s4.5-1.5 4.5-4c0 2.5 2 4 4.5 4S39 21.5 39 19" />
    <path d="M12 23v16h24V23" />
    <path d="M20 39v-9h8v9" />
  </svg>
);

/* Vertrauenszeile — Herz */
export const Heart = (p) => (
  <svg viewBox="0 0 48 48" {...F} {...p}>
    <path d="M24 40s-14-8.5-14-19a8 8 0 0 1 14-5 8 8 0 0 1 14 5c0 10.5-14 19-14 19z" />
  </svg>
);

/* Standort — Stecknadel (schlanker als Icons.Pin, passend zur Kontaktzeile) */
export const MapPin = (p) => (
  <svg viewBox="0 0 48 48" {...F} {...p}>
    <path d="M24 41s-12-11-12-20a12 12 0 0 1 24 0c0 9-12 20-12 20z" />
    <circle cx="24" cy="21" r="4" />
  </svg>
);

/* E-Mail — Umschlag */
export const Envelope = (p) => (
  <svg viewBox="0 0 48 48" {...F} {...p}>
    <rect x="8" y="13" width="32" height="22" rx="2.5" />
    <path d="M8 16l16 11 16-11" />
  </svg>
);

/* Telefon — Hörer */
export const Handset = (p) => (
  <svg viewBox="0 0 48 48" {...F} {...p}>
    <path d="M16 9l6 7-4 4c2 5 6 9 11 11l4-4 7 6-4 5c-13 1-26-12-25-25z" />
  </svg>
);

/* Rückmeldung — Uhr */
export const ClockFace = (p) => (
  <svg viewBox="0 0 48 48" {...F} {...p}>
    <circle cx="24" cy="24" r="15" />
    <path d="M24 14v10l6 4" />
  </svg>
);
