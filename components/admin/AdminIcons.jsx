/* Admin-only glyph set — 1.5px hairline strokes to match the storefront's
   Icons.jsx weight. Consumers pass sizing via className. */

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": "true",
};

export const Overview = (p) => (
  <svg {...base} {...p}>
    <path d="M3.5 12.5h5l2-5 3 8 2-4h5" />
    <rect x="2.5" y="4" width="19" height="16" rx="3" />
  </svg>
);

export const Bottle = (p) => (
  <svg {...base} {...p}>
    <path d="M10 2.75h4v3.4c0 1 .3 1.6.9 2.3l.9 1c.8.9 1.2 1.8 1.2 3v7.3a1.5 1.5 0 0 1-1.5 1.5h-7a1.5 1.5 0 0 1-1.5-1.5v-7.3c0-1.2.4-2.1 1.2-3l.9-1c.6-.7.9-1.3.9-2.3z" />
    <path d="M7 13.5h10" />
  </svg>
);

export const MapPin = (p) => (
  <svg {...base} {...p}>
    <path d="M9.5 21 3.5 18.5V4.5l6 2.5m0 14 6-2.5m-6 2.5V7m6 11.5 5 2v-14l-5 2m0 10v-10m0 0-6-2.5" />
  </svg>
);

export const Media = (p) => (
  <svg {...base} {...p}>
    <rect x="2.5" y="4.5" width="19" height="15" rx="3" />
    <circle cx="8.5" cy="10" r="1.75" />
    <path d="m3 17 4.8-4.2c.8-.7 1.9-.6 2.6.1l3.1 3.3m0 0 2.3-2c.8-.7 1.9-.6 2.6.1L21 17" />
  </svg>
);

/* inbox tray — the Anfragen section */
export const Inbox = (p) => (
  <svg {...base} {...p}>
    <path d="M3.5 13.5V17a2.5 2.5 0 0 0 2.5 2.5h12a2.5 2.5 0 0 0 2.5-2.5v-3.5" />
    <path d="M3.5 13.5h4.3l1.4 2.6h5.6l1.4-2.6h4.3" />
    <path d="m5.4 13.5 2.2-7.3A2 2 0 0 1 9.5 4.8h5a2 2 0 0 1 1.9 1.4l2.2 7.3" />
  </svg>
);

/* the magazine: an open spread with a folded corner — the editorial section */
export const Magazine = (p) => (
  <svg {...base} {...p}>
    <path d="M4 5.5h6.5a2 2 0 0 1 1.5.7 2 2 0 0 1 1.5-.7H20v13h-6.5a1.5 1.5 0 0 0-1.5.8 1.5 1.5 0 0 0-1.5-.8H4z" />
    <path d="M12 6.2v12.3" />
    <path d="M6.5 9h3M6.5 12h3M14.5 9h3M14.5 12h3" />
  </svg>
);

export const Search = (p) => (
  <svg {...base} {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m16 16 4.5 4.5" />
  </svg>
);

export const Bell = (p) => (
  <svg {...base} {...p}>
    <path d="M18 9a6 6 0 1 0-12 0c0 4.5-1.5 5.8-1.5 5.8h15S18 13.5 18 9" />
    <path d="M13.7 18.5a2 2 0 0 1-3.4 0" />
  </svg>
);

export const Sidebar = (p) => (
  <svg {...base} {...p}>
    <rect x="2.5" y="4" width="19" height="16" rx="3" />
    <path d="M9.5 4v16" />
  </svg>
);

/* sign-in / password page */
export const Lock = (p) => (
  <svg {...base} {...p}>
    <rect x="4.5" y="10" width="15" height="10.5" rx="2.5" />
    <path d="M8 10V7.5a4 4 0 0 1 8 0V10" />
    <path d="M12 14v2.5" />
  </svg>
);

export const Eye = (p) => (
  <svg {...base} {...p}>
    <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6" />
    <circle cx="12" cy="12" r="2.75" />
  </svg>
);

export const EyeOff = (p) => (
  <svg {...base} {...p}>
    <path d="M4 4.5 20 20" />
    <path d="M9.9 5.2A9.6 9.6 0 0 1 12 5c6 0 9.5 6 9.5 6a17 17 0 0 1-3.2 3.8" />
    <path d="M6.2 7.3A16.6 16.6 0 0 0 2.5 11s3.5 6 9.5 6a9.9 9.9 0 0 0 3.6-.66" />
    <path d="M9.9 10a2.75 2.75 0 0 0 3.8 3.85" />
  </svg>
);

export const Logout = (p) => (
  <svg {...base} {...p}>
    <path d="M14.5 4.5h3.5a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2h-3.5" />
    <path d="M10 8.5 6.5 12l3.5 3.5" />
    <path d="M6.5 12H15" />
  </svg>
);

/* colour-scheme switcher: light / dark / follow the device */
export const Sun = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8" />
  </svg>
);

export const Moon = (p) => (
  <svg {...base} {...p}>
    <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
  </svg>
);

export const Auto = (p) => (
  <svg {...base} {...p}>
    <rect x="2.5" y="4" width="19" height="13" rx="2.5" />
    <path d="M8.5 20.5h7M12 17v3.5" />
    <path d="M12 6.5v8a4 4 0 0 0 0-8Z" fill="currentColor" stroke="none" />
  </svg>
);

/* interview editor: language completeness, external preview, block actions */
export const ExternalLink = (p) => (
  <svg {...base} {...p}>
    <path d="M14 4.5h5.5V10" />
    <path d="M19.5 4.5 11 13" />
    <path d="M17 13.5v4a2 2 0 0 1-2 2H6.5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h4" />
  </svg>
);

export const Plus = (p) => (
  <svg {...base} {...p}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const Trash = (p) => (
  <svg {...base} {...p}>
    <path d="M4.5 7h15M9.5 7V4.75h5V7M6.5 7l.8 12.5h9.4L17.5 7" />
    <path d="M10 10.5v6M14 10.5v6" />
  </svg>
);

export const ArrowUp = (p) => (
  <svg {...base} {...p}>
    <path d="M12 19V5M5.5 11.5 12 5l6.5 6.5" />
  </svg>
);

export const ArrowDown = (p) => (
  <svg {...base} {...p}>
    <path d="M12 5v14M5.5 12.5 12 19l6.5-6.5" />
  </svg>
);

export const Image = (p) => (
  <svg {...base} {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <circle cx="8.5" cy="10" r="1.6" />
    <path d="m4 17 4.6-4c.7-.6 1.7-.6 2.4.1l2.7 2.9 2-1.8c.7-.6 1.8-.6 2.5.1L20 16" />
  </svg>
);

/* FAQ: the question mark in a speech bubble — the section is about what
   the site answers, not about a document. */
export const Faq = (p) => (
  <svg {...base} {...p}>
    <path d="M20.5 13.5a7.5 7.5 0 0 1-7.5 7.5H8l-4.5 2.5.9-4.2A7.5 7.5 0 0 1 13 6h0a7.5 7.5 0 0 1 7.5 7.5Z" />
    <path d="M10.4 11.2a2.1 2.1 0 1 1 2.9 2c-.5.3-.8.8-.8 1.4v.4" />
    <path d="M12.5 17.4h.01" />
  </svg>
);

/* Benutzer: two people, because one is an account and two are a list. */
export const Users = (p) => (
  <svg {...base} {...p}>
    <circle cx="9.5" cy="8.5" r="3.5" />
    <path d="M3 19.5c0-3 2.9-5 6.5-5s6.5 2 6.5 5" />
    <path d="M16.5 5.6a3.2 3.2 0 0 1 0 6.1" />
    <path d="M18.2 14.9c1.8.7 2.8 2 2.8 3.8" />
  </svg>
);

/* Protokoll: a clock that has been wound backwards. */
export const History = (p) => (
  <svg {...base} {...p}>
    <path d="M3.6 9.2A8.5 8.5 0 1 1 3.5 12" />
    <path d="M3.5 4.5v4.7h4.7" />
    <path d="M12 7.8V12l2.8 1.8" />
  </svg>
);

/* Rechtstexte: ein Bogen mit umgeschlagener Ecke — ein Dokument, das man
   unterschreibt. Das Fragezeichen war schon an die FAQ vergeben. */
/* Seiten: a page divided into its blocks — a hero band over two text rows.
   Deliberately not the document glyph of `legal`: that one is a text FILE,
   this one is a laid-out page. */
export const Pages = (p) => (
  <svg {...base} {...p}>
    <rect x="3" y="3.5" width="18" height="17" rx="2.5" />
    <path d="M3 9.5h18" />
    <path d="M6.5 13.5h11M6.5 16.9h7" />
  </svg>
);

export const Legal = (p) => (
  <svg {...base} {...p}>
    <path d="M13.8 2.75H7a2 2 0 0 0-2 2v14.5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7.95z" />
    <path d="M13.8 2.75v5.2H19" />
    <path d="M8.5 12.5h7M8.5 16h4.5" />
  </svg>
);

/* Einstellungen: drei Schieberegler */
export const Settings = (p) => (
  <svg {...base} {...p}>
    <path d="M3.5 7h8.5M16.5 7h4M3.5 12h3M10.5 12h10M3.5 17h11M18.5 17h2" />
    <circle cx="14" cy="7" r="2.25" />
    <circle cx="8" cy="12" r="2.25" />
    <circle cx="16.5" cy="17" r="2.25" />
  </svg>
);

export const ICONS = {
  overview: Overview,
  bottle: Bottle,
  map: MapPin,
  media: Media,
  faq: Faq,
  pages: Pages,
  inbox: Inbox,
  magazine: Magazine,
  legal: Legal,
  lock: Lock,
  users: Users,
  settings: Settings,
};
