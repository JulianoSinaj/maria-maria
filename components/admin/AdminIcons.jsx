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

export const Orders = (p) => (
  <svg {...base} {...p}>
    <path d="m12 2.75 8 4v10.5l-8 4-8-4V6.75z" />
    <path d="m4 6.75 8 4 8-4M12 10.75v10.5" />
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

export const ICONS = {
  overview: Overview,
  bottle: Bottle,
  map: MapPin,
  media: Media,
  orders: Orders,
};
