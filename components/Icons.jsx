/* Shared line-art icons — champagne/charcoal aesthetic.
   Small UI icons use a 24x24 box; feature icons use 48x48. */

const S = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" };
const F = { fill: "none", stroke: "currentColor", strokeWidth: 1.3, strokeLinecap: "round", strokeLinejoin: "round" };

export const Arrow = (p) => (
  <svg viewBox="0 0 24 24" {...S} {...p}><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></svg>
);
export const ArrowUpRight = (p) => (
  <svg viewBox="0 0 24 24" {...S} {...p}><path d="M7 17L17 7" /><path d="M8 7h9v9" /></svg>
);
export const Menu = (p) => (
  <svg viewBox="0 0 24 24" {...S} strokeWidth="1.6" {...p}><path d="M4 8h16" /><path d="M4 16h16" /></svg>
);
export const Close = (p) => (
  <svg viewBox="0 0 24 24" {...S} strokeWidth="1.6" {...p}><path d="M6 6l12 12" /><path d="M18 6L6 18" /></svg>
);
export const Plus = (p) => (
  <svg viewBox="0 0 24 24" {...S} strokeWidth="1.6" {...p}><path d="M12 5v14" /><path d="M5 12h14" /></svg>
);
export const Check = (p) => (
  <svg viewBox="0 0 24 24" {...S} strokeWidth="1.8" {...p}><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
);
export const Star = (p) => (
  <svg viewBox="0 0 24 24" {...S} strokeWidth="1.4" {...p}><path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9L3.5 9.7l5.9-.8z" /></svg>
);
export const Clock = (p) => (
  <svg viewBox="0 0 24 24" {...S} strokeWidth="1.6" {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
);
export const ChevronRight = (p) => (
  <svg viewBox="0 0 24 24" {...S} strokeWidth="1.8" {...p}><path d="M9 6l6 6-6 6" /></svg>
);
export const ChevronDown = (p) => (
  <svg viewBox="0 0 24 24" {...S} strokeWidth="1.8" {...p}><path d="M6 9l6 6 6-6" /></svg>
);
export const Cart = (p) => (
  <svg viewBox="0 0 24 24" {...S} strokeWidth="1.6" {...p}>
    <path d="M6 6h15l-1.5 9h-12z" /><path d="M6 6 5 3H2" /><circle cx="9" cy="20" r="1" /><circle cx="18" cy="20" r="1" />
  </svg>
);

/* ---- decorative grape cluster (used in section rules) ---- */
export const Grapes = (p) => (
  <svg viewBox="0 0 48 48" {...F} {...p}>
    <path d="M24 13c0-3 2-5 5-6-1 3 0 5 2 6" />
    <circle cx="19" cy="19" r="3.4" /><circle cx="26" cy="19" r="3.4" /><circle cx="33" cy="19" r="3.4" />
    <circle cx="22.5" cy="26" r="3.4" /><circle cx="29.5" cy="26" r="3.4" /><circle cx="26" cy="33" r="3.4" />
  </svg>
);

/* ---- Der Maria-Moment feature icons ---- */
export const Vineyard = (p) => (
  <svg viewBox="0 0 48 48" {...F} {...p}>
    {/* rolling vineyard rows */}
    <path d="M3 40C13 34 30 34 44 39" />
    <path d="M6 43.5C16 37.5 31 37.5 43 43" strokeOpacity="0.7" />
    <path d="M19 44C26 40.5 34 40.5 41 42.5" strokeOpacity="0.55" />
    {/* farmhouse */}
    <path d="M30 33v-7h9v7" />
    <path d="M28 26.5l6.5-4.5 6.5 4.5" />
    <path d="M34 33v-4h2.4v4" />
    <path d="M39 22.7v-3h1.6v3.8" />
    {/* trees */}
    <path d="M13 33v-4" /><circle cx="13" cy="24.5" r="3.6" />
    <path d="M20.5 33c0-5 1.3-8 2.4-9 1.1 1 2.4 4 2.4 9z" />
  </svg>
);
export const Barrel = (p) => (
  <svg viewBox="0 0 48 48" {...F} {...p}>
    <g transform="rotate(-16 24 24)">
      <ellipse cx="24" cy="12" rx="8" ry="2.8" />
      <path d="M16 12C13.6 16 13.6 30 16 34" />
      <path d="M32 12C34.4 16 34.4 30 32 34" />
      <path d="M16 34C19 36 29 36 32 34" />
      <path d="M15.2 19C19 21 29 21 32.8 19" />
      <path d="M15 27C19 29 29 29 33 27" />
      <path d="M20 12.4V34.6M24 12V35M28 12.4V34.6" strokeOpacity="0.6" />
    </g>
    <circle cx="36.5" cy="33" r="3.1" />
  </svg>
);
export const Glasses = (p) => (
  <svg viewBox="0 0 48 48" {...F} {...p}>
    <g transform="translate(19.5 18) rotate(19)">
      <path d="M-4.5 0H4.5" />
      <path d="M-4.5 0C-4.5 6-2 9 0 9 2 9 4.5 6 4.5 0" />
      <path d="M0 9v7" /><path d="M-3.6 16.6H3.6" />
      <path d="M-3.2 3.6C-1 5 1 5 3.2 3.6" strokeOpacity="0.7" />
    </g>
    <g transform="translate(28.5 18) rotate(-19)">
      <path d="M-4.5 0H4.5" />
      <path d="M-4.5 0C-4.5 6-2 9 0 9 2 9 4.5 6 4.5 0" />
      <path d="M0 9v7" /><path d="M-3.6 16.6H3.6" />
      <path d="M-3.2 3.6C-1 5 1 5 3.2 3.6" strokeOpacity="0.7" />
    </g>
    <path d="M24 9.5V6M20.8 10L19.2 7M27.2 10L28.8 7" />
  </svg>
);

/* ---- utility feature icons (weine strip / magazin themes) ---- */
export const Plate = (p) => (
  <svg viewBox="0 0 48 48" {...F} {...p}>
    <circle cx="24" cy="26" r="12" /><circle cx="24" cy="26" r="6" />
    <path d="M9 12v9M9 12c-2 0-2 3-2 4s0 4 2 4M39 12v22M39 12c2 0 2 4 2 7s-1 5-3 5" />
  </svg>
);
export const GrapeVine = (p) => (
  <svg viewBox="0 0 48 48" {...F} {...p}>
    <path d="M24 8c-1 3-1 5 1 7" /><path d="M27 15c3-2 6-2 8 0-2 2-5 2-8 0z" />
    <circle cx="20" cy="22" r="3" /><circle cx="27" cy="22" r="3" /><circle cx="23.5" cy="28" r="3" />
    <circle cx="17" cy="30" r="3" /><circle cx="30" cy="30" r="3" /><circle cx="23.5" cy="36" r="3" />
  </svg>
);
export const Book = (p) => (
  <svg viewBox="0 0 48 48" {...F} {...p}>
    <path d="M24 14c-3-2-8-3-12-3v24c4 0 9 1 12 3 3-2 8-3 12-3V11c-4 0-9 1-12 3z" /><path d="M24 14v24" />
  </svg>
);
export const Sun = (p) => (
  <svg viewBox="0 0 48 48" {...F} {...p}>
    <circle cx="24" cy="24" r="7" />
    <path d="M24 8v4M24 36v4M8 24h4M36 24h4M13 13l3 3M32 32l3 3M35 13l-3 3M16 32l-3 3" />
  </svg>
);
export const Mountains = (p) => (
  <svg viewBox="0 0 48 48" {...F} {...p}>
    <path d="M6 36l10-16 6 9 5-8 15 15z" /><path d="M16 20l3 5M27 21l4 6" /><circle cx="34" cy="14" r="3" />
  </svg>
);
export const Fields = (p) => (
  <svg viewBox="0 0 48 48" {...F} {...p}>
    <path d="M6 34h36" /><path d="M10 34c0-6 4-9 9-9M19 25c0-4 4-6 8-5M14 34c0-4 2-6 5-7" />
    <circle cx="35" cy="15" r="4" /><path d="M35 8v-2M35 24v-2M28 15h-2M44 15h-2M30 10l-1.5-1.5M40 20l1.5 1.5M40 10l1.5-1.5M30 20l-1.5 1.5" />
  </svg>
);

/* ---- contact icons ---- */
export const Mail = (p) => (
  <svg viewBox="0 0 24 24" {...S} strokeWidth="1.5" {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
);
export const Phone = (p) => (
  <svg viewBox="0 0 24 24" {...S} strokeWidth="1.5" {...p}><path d="M6 3h4l2 5-3 2a12 12 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2z" /></svg>
);
export const Pin = (p) => (
  <svg viewBox="0 0 24 24" {...S} strokeWidth="1.5" {...p}><path d="M12 21c5-5 8-8.5 8-12a8 8 0 1 0-16 0c0 3.5 3 7 8 12z" /><circle cx="12" cy="9" r="2.5" /></svg>
);

/* ---- socials ---- */
export const Instagram = (p) => (
  <svg viewBox="0 0 24 24" {...S} strokeWidth="1.5" {...p}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" /></svg>
);
export const Facebook = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M13.5 21v-8h2.5l.4-3h-2.9V8.2c0-.9.3-1.5 1.6-1.5H16.5V4.1C16.2 4 15.2 4 14.1 4c-2.3 0-3.9 1.4-3.9 4v2H7.6v3h2.6v8h3.3z" /></svg>
);
export const LinkedIn = (p) => (
  <svg viewBox="0 0 24 24" {...S} strokeWidth="1.5" {...p}><rect x="3" y="3" width="18" height="18" rx="4" /><path d="M8 11v6" /><circle cx="8" cy="7.5" r="0.9" fill="currentColor" stroke="none" /><path d="M12 17v-4a2 2 0 0 1 4 0v4M12 11v6" /></svg>
);
export const MailCircle = (p) => (
  <svg viewBox="0 0 48 48" {...F} {...p}><rect x="8" y="13" width="32" height="22" rx="2" /><path d="m8 16 16 11 16-11" /></svg>
);
