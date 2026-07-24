/* Accurate silhouette of Italy with one wine region highlighted.
   Geometry traced from real geography — equirectangular projection,
   x = (lon − 6.5°) · 19.3, y = (47.2° − lat) · 26 — so the boot, Sicily
   and Sardinia sit exactly where they belong. Sicily is nudged 3 units
   south-west to keep the Strait of Messina readable at chip size.
   region: apulien | kampanien | garda (highlight = the real region shape,
   its coastal edge shared vertex-for-vertex with the mainland outline).
   ghost: translucent ivory + champagne treatment for dark photo backdrops —
   the light default stays untouched for the home rail and the regions page. */

const MAINLAND =
  "M19.3 88.4 L9.7 65 L3.9 54.6 L9.7 35.1 L36.7 20.8 L54 22.1 L69.5 15.6 " +
  "L88.8 6.5 L110 2.6 L125.5 13 L139 18.2 L137 36.4 L139.9 40.3 L133.2 39 " +
  "L115.8 49.4 L116.8 61.1 L111.6 72.8 L117.2 81.9 L138 94.9 L142.8 110.5 " +
  "L148.6 123.5 L159.2 132.6 L164 135.2 L170.8 138.3 L178.5 137.3 L187 138.3 " +
  "L187.2 141.9 L182 146.4 L189.1 152.9 L200.1 157.8 L208.4 162.5 L221 170.3 " +
  "L231.6 183.3 L228.9 192.4 L221.9 185.9 L207.5 176.3 L200.3 176.3 L193 194.5 " +
  "L205.2 211.9 L204.4 216.3 L194 220.5 L194 227.8 L184.3 241 L178.5 241.3 " +
  "L176.4 236.1 L176.2 232.4 L180.5 227.5 L179.9 223.1 L187.6 215.3 L183.9 204.1 " +
  "L179.1 189.8 L176 185.9 L169.5 186.7 L164.1 178.1 L151.1 172.4 L150 165.6 " +
  "L136.5 156 L126.4 155.5 L118.3 149.8 L110.6 142.2 L101.9 132.9 L88.8 125.1 " +
  "L79.1 111.3 L73.3 95.4 L72 86.6 L64.3 81.1 L46.9 72.8 L38 75.4 L29.5 86.3 Z";

const SICILY =
  "M173.6 235.2 L166.6 246.1 L162.8 255.2 L166.8 266.6 L163.6 276.5 L158.2 275.5 " +
  "L146 266.4 L140.6 265.9 L133.5 261.4 L124 255.2 L114.5 251.3 L111.6 247.4 " +
  "L113 241.7 L117.2 237.8 L122.8 241.7 L129.6 237.3 L142.1 241.4 L153.9 240.4 " +
  "L165.7 236.5 Z";

const SARDINIA =
  "M51.3 154.9 L59.1 161.2 L62.1 163.3 L64.3 174.2 L62 188.9 L59.3 205.4 " +
  "L50.4 207.7 L48.1 215.8 L37.2 213.8 L36.7 193.7 L38 189.8 L36.7 179.4 " +
  "L31.5 172.6 L32.6 162.5 L34.4 159.9 Z";

const HILITE = {
  /* Puglia — Gargano spur, Adriatic coast and the Salento heel */
  apulien:
    "M170.8 138.3 L178.5 137.3 L187 138.3 L187.2 141.9 L182 146.4 L189.1 152.9 " +
    "L200.1 157.8 L208.4 162.5 L221 170.3 L231.6 183.3 L228.9 192.4 L221.9 185.9 " +
    "L207.5 176.3 L200.3 176.3 L183.4 163.8 L174.7 157.3 L170.8 148.2 L164 144.3 " +
    "L166 139.1 Z",
  /* Campania — Bay of Naples, Sorrento peninsula and the Cilento coast */
  kampanien:
    "M142.4 149.5 L151.5 144.3 L160.2 145.6 L169.8 150.8 L177.4 161.2 L179.5 166.4 " +
    "L173.7 174.2 L176 185.9 L169.5 186.7 L164.1 178.1 L151.1 172.4 L150 165.6 " +
    "L142.4 158.1 Z",
  /* Lake Garda — drawn slightly enlarged so it stays legible at chip size */
  garda:
    "M85.7 30.9 L84.7 35.5 L81.8 43.8 L81 49.3 L76.4 48 L75.7 42.6 L84.1 33.8 Z",
};

/* Wine origin: Salento / Beneventano / Lugana (south shore of Lake Garda) */
const DOT = { apulien: [214.8, 176.8], kampanien: [159.8, 157.8], garda: [79.5, 47] };

export default function ItalyMap({ region = "apulien", className = "w-28", ghost = false }) {
  const dot = DOT[region] || DOT.apulien;
  const land = ghost ? "rgba(247,244,239,0.16)" : "rgba(255,255,255,0.9)";
  const edge = ghost ? "rgba(247,244,239,0.65)" : "rgba(255,255,255,0.95)";
  const mark = ghost ? "#C8B77A" : "#6B0F1A";
  return (
    <svg viewBox="0 0 240 285" className={`${className} h-auto`} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* mainland boot */}
      <path d={MAINLAND} fill={land} stroke={edge} strokeWidth="1.1" strokeLinejoin="round" />
      {/* Sicily */}
      <path d={SICILY} fill={land} stroke={edge} strokeWidth="1.1" strokeLinejoin="round" />
      {/* Sardinia */}
      <path
        d={SARDINIA}
        fill={ghost ? "rgba(247,244,239,0.14)" : "rgba(255,255,255,0.85)"}
        stroke={edge}
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
      {/* highlighted region */}
      <path
        d={HILITE[region] || HILITE.apulien}
        fill={mark}
        fillOpacity="0.92"
        stroke={mark}
        strokeWidth="1"
        strokeLinejoin="round"
      />
      {ghost && (
        <circle
          cx={dot[0]}
          cy={dot[1]}
          r="4.5"
          fill="none"
          stroke={mark}
          strokeWidth="1.4"
          className="animate-ping"
          style={{ transformBox: "fill-box", transformOrigin: "center", animationDuration: "2.6s" }}
        />
      )}
      <circle
        cx={dot[0]}
        cy={dot[1]}
        r="3.4"
        fill="#6B0F1A"
        stroke={ghost ? "rgba(247,244,239,0.95)" : "#fff"}
        strokeWidth="1"
      />
    </svg>
  );
}
