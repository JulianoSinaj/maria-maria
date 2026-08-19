/* Linienmotive der Kontaktseite.

   Eigene Datei statt Icons.jsx, weil sie eine andere Regel haben: Die
   globalen Icons sind auf 24 px UI-Größe gezeichnet, diese vier stehen in
   66-px-Kreisen und tragen im Mockup eine sichtbar dünnere Linie. Mit
   strokeWidth 1.5 in einem 40er-Kreis wirken sie fett; im 32er-Raster mit
   1.4 sitzen sie so, wie der Kunde sie abgenommen hat.

   Handoff §13: „Icone lineari, sottili, coerenti tra loro. Evitare emoji o
   icone filled casuali." */

const L = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

/* Anliegen 01 — Gastronomie & Feinkost */
export const Cutlery = (p) => (
  <svg viewBox="0 0 32 32" {...L} {...p}>
    <path d="M11 4v8a2.5 2.5 0 0 1-5 0V4" />
    <path d="M8.5 4v8" />
    <path d="M8.5 14.5V28" />
    <path d="M23 4c-2 1.6-3 3.7-3 6.2 0 1.9.9 3.1 3 3.6" />
    <path d="M23 4v24" />
  </svg>
);

/* Anliegen 02 — Handel & Wiederverkauf */
export const Bag = (p) => (
  <svg viewBox="0 0 32 32" {...L} {...p}>
    <path d="M7 10h18l-1.4 17H8.4z" />
    <path d="M11.5 13V9a4.5 4.5 0 0 1 9 0v4" />
  </svg>
);

/* Anliegen 03 — Events & besondere Anlässe */
export const Cheers = (p) => (
  <svg viewBox="0 0 32 32" {...L} {...p}>
    <path d="M4 9.5 12.5 7l2.3 6.6a4 4 0 0 1-7.6 2.2z" />
    <path d="M10.3 17.6 12.6 25" />
    <path d="M9.5 25.5h6.5" />
    <path d="M28 9.5 19.5 7l-2.3 6.6a4 4 0 0 0 7.6 2.2z" />
    <path d="M21.7 17.6 19.4 25" />
    <path d="M16 25.5h6.5" />
  </svg>
);

/* Anliegen 04 — Verkostung & individuelle Auswahl */
export const WineGlass = (p) => (
  <svg viewBox="0 0 32 32" {...L} {...p}>
    <path d="M9 5h14l-1 8.5a6 6 0 0 1-12 0z" />
    <path d="M9.6 10.5h12.8" />
    <path d="M16 19.5V26" />
    <path d="M11.5 26.5h9" />
  </svg>
);

/* Kontext-Kästchen am Formular — Event */
export const Calendar = (p) => (
  <svg viewBox="0 0 32 32" {...L} {...p}>
    <rect x="5" y="7.5" width="22" height="19.5" rx="2.5" />
    <path d="M5 13.5h22" />
    <path d="M11 4.5V9M21 4.5V9" />
    <path d="M10.5 18h3M14.5 22h3M18.5 18h3" />
  </svg>
);

/* Kontext-Kästchen am Formular — Gastronomie/Handel */
export const Storefront = (p) => (
  <svg viewBox="0 0 32 32" {...L} {...p}>
    <path d="M5 12.5 7 6h18l2 6.5" />
    <path d="M6.5 12.5V27h19V12.5" />
    <path d="M5 12.5a3.4 3.4 0 0 0 5.5 0 3.4 3.4 0 0 0 5.5 0 3.4 3.4 0 0 0 5.5 0 3.4 3.4 0 0 0 5.5 0" />
    <path d="M13 27v-7h6v7" />
  </svg>
);

/* Vertrauenszeile unter den Kästchen */
export const Heart = (p) => (
  <svg viewBox="0 0 32 32" {...L} {...p}>
    <path d="M16 27S4.5 20.2 4.5 12.8A6.3 6.3 0 0 1 16 9.3a6.3 6.3 0 0 1 11.5 3.5C27.5 20.2 16 27 16 27z" />
  </svg>
);
