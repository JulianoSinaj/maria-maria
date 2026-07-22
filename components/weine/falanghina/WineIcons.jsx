/* Wine-detail line-art icons — same champagne/charcoal aesthetic as
   components/Icons.jsx: 48x48 feature box, currentColor, 1.3 stroke.
   Sensory trio (Auge/Nase/Mund) mirrors the client's reference layout. */

import { Pin, Grapes, Plate, Glasses } from "@/components/Icons";

const F = { fill: "none", stroke: "currentColor", strokeWidth: 1.3, strokeLinecap: "round", strokeLinejoin: "round" };

export const Eye = (p) => (
  <svg viewBox="0 0 48 48" {...F} {...p}>
    <path d="M6 24C13 14.5 35 14.5 42 24C35 33.5 13 33.5 6 24Z" />
    <circle cx="24" cy="24" r="5.6" />
    <circle cx="24" cy="24" r="1.6" />
  </svg>
);

export const Nose = (p) => (
  <svg viewBox="0 0 48 48" {...F} {...p}>
    <path d="M24 9c-1.2 7-4.6 11.5-6 16.5-1 3.6.6 6.5 4 6.5 1.8 0 3-.8 4-2" />
    <path d="M21.5 32.5c-2.2 1.6-.6 3.6 1.8 3.1" />
    <path d="M31 20c2.6 1.8 2.6 5.4 0 7.2" strokeOpacity="0.75" />
    <path d="M36 16.5c4.2 3 4.2 11 0 14" strokeOpacity="0.5" />
  </svg>
);

export const Lips = (p) => (
  <svg viewBox="0 0 48 48" {...F} {...p}>
    <path d="M7 26c4-6.2 10.5-7.6 17-4.4 6.5-3.2 13-1.8 17 4.4-4.4 6.6-10.8 9.4-17 9.4S11.4 32.6 7 26Z" />
    <path d="M13 26c7.2 2.6 14.8 2.6 22 0" strokeOpacity="0.75" />
    <path d="M20.5 20.4c1.2 1 2.3 1.5 3.5 1.5s2.3-.5 3.5-1.5" strokeOpacity="0.6" />
  </svg>
);

export const Thermometer = (p) => (
  <svg viewBox="0 0 48 48" {...F} {...p}>
    <path d="M20.5 10a3.5 3.5 0 0 1 7 0v19.2a6.8 6.8 0 1 1-7 0Z" />
    <path d="M24 20v14.5" />
    <circle cx="24" cy="35.5" r="2.4" />
    <path d="M32 13h4.5" strokeOpacity="0.7" />
    <path d="M32 19h4.5" strokeOpacity="0.7" />
    <path d="M32 25h4.5" strokeOpacity="0.7" />
  </svg>
);

export const Tank = (p) => (
  <svg viewBox="0 0 48 48" {...F} {...p}>
    <ellipse cx="24" cy="11.5" rx="10" ry="3.6" />
    <path d="M14 11.5v22.5c0 2.6 4.5 4.6 10 4.6s10-2 10-4.6V11.5" />
    <path d="M14 23h20" strokeOpacity="0.55" />
    <path d="M17.5 39.5 15.5 44" />
    <path d="M30.5 39.5l2 4.5" />
    <path d="M24 38.7V42" strokeOpacity="0.7" />
  </svg>
);

export const Fish = (p) => (
  <svg viewBox="0 0 48 48" {...F} {...p}>
    <path d="M7 24c5.5-7 13.5-10 21.5-7.2 3.8 1.3 7 3.8 10 7.2-3 3.4-6.2 5.9-10 7.2C20.5 34 12.5 31 7 24Z" />
    <path d="M38.5 24l5.5-4.6v9.2Z" />
    <circle cx="14.5" cy="22.6" r="1.4" />
    <path d="M20 18.6c2.2 3.4 2.2 7.4 0 10.8" strokeOpacity="0.6" />
  </svg>
);

export const Shell = (p) => (
  <svg viewBox="0 0 48 48" {...F} {...p}>
    <path d="M24 40C16.5 36 10.5 28.5 10.5 21a13.5 11.5 0 0 1 27 0C37.5 28.5 31.5 36 24 40Z" />
    <path d="M24 40 15 15.5" strokeOpacity="0.6" />
    <path d="M24 40V10.8" strokeOpacity="0.6" />
    <path d="M24 40l9-24.5" strokeOpacity="0.6" />
  </svg>
);

/* name → component map used by the wineData-driven sections */
export const WINE_ICON = {
  pin: Pin,
  grapes: Grapes,
  plate: Plate,
  glasses: Glasses,
  eye: Eye,
  nose: Nose,
  lips: Lips,
  thermometer: Thermometer,
  tank: Tank,
  fish: Fish,
  shell: Shell,
};
