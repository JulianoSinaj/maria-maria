/* Shop-specific line-art icons — same champagne/charcoal aesthetic as
   components/Icons.jsx: small UI icons on a 24x24 box, feature icons on 48x48. */

const S = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" };
const F = { fill: "none", stroke: "currentColor", strokeWidth: 1.3, strokeLinecap: "round", strokeLinejoin: "round" };

export const Minus = (p) => (
  <svg viewBox="0 0 24 24" {...S} strokeWidth="1.6" {...p}><path d="M5 12h14" /></svg>
);

export const Shield = (p) => (
  <svg viewBox="0 0 48 48" {...F} {...p}>
    <path d="M24 7l13.5 5v10.5C37.5 31.5 32 37.5 24 40c-8-2.5-13.5-8.5-13.5-17.5V12z" />
    <path d="M18 24.5l4.5 4.5 8-9" />
  </svg>
);

export const Truck = (p) => (
  <svg viewBox="0 0 48 48" {...F} {...p}>
    <path d="M6 31V17.5a1.5 1.5 0 0 1 1.5-1.5h19a1.5 1.5 0 0 1 1.5 1.5V31" />
    <path d="M28 21h7.2l5.8 6.8V32h-3.6" />
    <circle cx="15" cy="33.5" r="3.4" />
    <circle cx="33.5" cy="33.5" r="3.4" />
    <path d="M18.6 33.5h11.3M6 31v1.5h5.3" />
    <path d="M2.5 21h6M4.5 25h5" strokeOpacity="0.55" />
  </svg>
);

export const Package = (p) => (
  <svg viewBox="0 0 48 48" {...F} {...p}>
    <path d="M24 8.5l14 7v17l-14 7-14-7v-17z" />
    <path d="M24 22.5l14-7M24 22.5l-14-7M24 22.5V39" />
    <path d="M17 12l14 7v5.5" strokeOpacity="0.6" />
  </svg>
);

export const Amphora = (p) => (
  <svg viewBox="0 0 48 48" {...F} {...p}>
    <path d="M19.5 7h9" />
    <path d="M20.5 7v3.8c0 2.6-6 3.6-6 8.2 0 6 4.5 7.6 4.5 12.6 0 3.8-2 6.2-2 8.9h14c0-2.7-2-5.1-2-8.9 0-5 4.5-6.6 4.5-12.6 0-4.6-6-5.6-6-8.2V7" />
    <path d="M15 15.5c-3.4.8-5.3 2.5-5.3 4.8s1.9 3.5 4 3.1" />
    <path d="M33 15.5c3.4.8 5.3 2.5 5.3 4.8s-1.9 3.5-4 3.1" />
    <path d="M17.6 25c4 1.5 8.8 1.5 12.8 0" strokeOpacity="0.6" />
  </svg>
);

export const Gift = (p) => (
  <svg viewBox="0 0 48 48" {...F} {...p}>
    <rect x="9" y="19" width="30" height="6.5" rx="1.2" />
    <path d="M12.5 25.5V39h23V25.5" />
    <path d="M24 19v20" />
    <path d="M24 19c-6.5 0-9.5-2.2-9.5-5.2 0-2.8 4.8-3.8 6.9.2 1.2 2.2 2.6 5 2.6 5z" />
    <path d="M24 19c6.5 0 9.5-2.2 9.5-5.2 0-2.8-4.8-3.8-6.9.2-1.2 2.2-2.6 5-2.6 5z" />
  </svg>
);
