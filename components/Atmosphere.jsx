/* Atmosphere — ambient background layers that fill sections with colour and
   depth: drifting aurora fields, giant serif ghost words, vine line-art and a
   global backdrop. Purely decorative (aria-hidden) and GPU-friendly: soft
   radial gradients + slow transform loops, no blur filters. The global
   reduced-motion rule in globals.css freezes the drift. */

const TINTS = {
  gold: "rgba(227, 217, 184, 0.55)",
  champagne: "rgba(200, 183, 122, 0.4)",
  blush: "rgba(198, 127, 120, 0.28)",
  bordeaux: "rgba(107, 15, 26, 0.14)",
  wine: "rgba(138, 43, 47, 0.2)",
  olive: "rgba(142, 154, 99, 0.3)",
  sea: "rgba(123, 160, 160, 0.24)",
  terracotta: "rgba(216, 169, 126, 0.38)",
};

export function Aura({ tint = "champagne", drift = 1, className = "" }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute rounded-full will-transform ${
        drift === 2 ? "animate-aura2" : "animate-aura"
      } ${className}`}
      style={{
        background: `radial-gradient(circle, ${TINTS[tint] || TINTS.champagne} 0%, transparent 68%)`,
      }}
    />
  );
}

const VARIANTS = {
  warm: [
    { tint: "gold", drift: 1, cls: "-left-48 -top-48 h-[38rem] w-[38rem]" },
    { tint: "blush", drift: 2, cls: "-right-56 top-1/4 h-[34rem] w-[34rem]" },
    { tint: "bordeaux", drift: 1, cls: "-bottom-64 left-1/4 h-[32rem] w-[32rem]" },
  ],
  olive: [
    { tint: "olive", drift: 1, cls: "-right-48 -top-40 h-[36rem] w-[36rem]" },
    { tint: "gold", drift: 2, cls: "-left-56 top-1/3 h-[34rem] w-[34rem]" },
    { tint: "sea", drift: 1, cls: "-bottom-56 right-1/4 h-[30rem] w-[30rem]" },
  ],
  rose: [
    { tint: "blush", drift: 1, cls: "-left-48 -top-40 h-[36rem] w-[36rem]" },
    { tint: "gold", drift: 2, cls: "-right-48 top-1/2 h-[34rem] w-[34rem]" },
    { tint: "wine", drift: 1, cls: "-bottom-64 left-1/3 h-[30rem] w-[30rem]" },
  ],
  dusk: [
    { tint: "terracotta", drift: 1, cls: "-right-48 -top-48 h-[36rem] w-[36rem]" },
    { tint: "bordeaux", drift: 2, cls: "-left-56 top-1/4 h-[34rem] w-[34rem]" },
    { tint: "gold", drift: 1, cls: "-bottom-56 right-1/3 h-[32rem] w-[32rem]" },
  ],
};

export default function Atmosphere({ variant = "warm", className = "" }) {
  const blobs = VARIANTS[variant] || VARIANTS.warm;
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 ${className}`}>
      {blobs.map((b, i) => (
        <Aura key={i} tint={b.tint} drift={b.drift} className={b.cls} />
      ))}
    </div>
  );
}

/* giant italic serif word floating behind a section */
export function GhostWord({ children, className = "" }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute select-none whitespace-nowrap font-playfair italic leading-none text-bordeaux/[0.05] ${className}`}
    >
      {children}
    </span>
  );
}

/* flowing vineyard line-art — rolling vine rows, a low sun, one grape cluster */
export function Vines({ className = "", stroke = "rgba(200, 183, 122, 0.45)" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 480"
      preserveAspectRatio="xMidYMax slice"
      className={`pointer-events-none absolute ${className}`}
      fill="none"
      stroke={stroke}
      strokeWidth="1.1"
      strokeLinecap="round"
    >
      <path d="M-40 380 C 200 300, 460 310, 720 350 S 1220 390, 1480 310" />
      <path d="M-40 424 C 240 352, 520 362, 780 396 S 1240 424, 1480 362" strokeOpacity="0.6" />
      <path d="M-40 336 C 180 276, 400 282, 640 314 S 1180 352, 1480 268" strokeOpacity="0.35" />
      {/* low sun */}
      <circle cx="1180" cy="130" r="54" strokeOpacity="0.55" />
      <circle cx="1180" cy="130" r="82" strokeOpacity="0.25" />
      {/* grape cluster */}
      <g strokeOpacity="0.6">
        <path d="M172 64 C 168 48, 178 38, 194 34 C 188 48, 190 58, 198 64" />
        <circle cx="152" cy="86" r="13" />
        <circle cx="180" cy="86" r="13" />
        <circle cx="208" cy="86" r="13" />
        <circle cx="166" cy="112" r="13" />
        <circle cx="194" cy="112" r="13" />
        <circle cx="180" cy="138" r="13" />
      </g>
    </svg>
  );
}

/* full-viewport ambient wash behind every page — kills flat-white voids in the
   gaps between decorated sections. Sits above the body colour, below content. */
export function AmbientBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
      <Aura tint="gold" drift={1} className="-top-72 right-[-12%] h-[52rem] w-[52rem]" />
      <Aura tint="blush" drift={2} className="left-[-18%] top-[32%] h-[46rem] w-[46rem]" />
      <Aura tint="olive" drift={1} className="bottom-[-22%] right-[2%] h-[42rem] w-[42rem] opacity-70" />
    </div>
  );
}
