/* Stylized silhouette of Italy with one region highlighted.
   region: apulien | kampanien | garda
   ghost: translucent ivory + champagne treatment for dark photo backdrops —
   the light default stays untouched for the home rail and the regions page. */

const ITALY =
  "M40 64 L52 44 L78 34 L104 30 L128 36 L150 48 L146 62 L150 84 L166 112 L176 140 " +
  "L170 150 L192 150 L182 166 L196 196 L200 208 L186 214 L170 206 L176 220 L168 232 " +
  "L150 246 L140 250 L140 236 L150 224 L140 210 L128 196 L120 176 L108 150 L86 120 " +
  "L70 96 L52 80 Z";

const HILITE = {
  apulien: "M176 158 L196 194 L198 206 L186 212 L172 204 L176 184 L168 168 Z", // heel
  kampanien: "M120 176 L134 188 L138 202 L128 200 L118 188 Z", // west / Campania
  garda: "M92 40 L112 38 L114 50 L96 52 Z", // north (Lake Garda)
};
const DOT = { apulien: [184, 190], kampanien: [128, 190], garda: [103, 45] };

export default function ItalyMap({ region = "apulien", className = "w-28", ghost = false }) {
  const dot = DOT[region] || DOT.apulien;
  const land = ghost ? "rgba(247,244,239,0.16)" : "rgba(255,255,255,0.9)";
  const edge = ghost ? "rgba(247,244,239,0.65)" : "rgba(255,255,255,0.95)";
  const mark = ghost ? "#C8B77A" : "#6B0F1A";
  return (
    <svg viewBox="0 0 220 280" className={`${className} h-auto`} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* mainland */}
      <path d={ITALY} fill={land} stroke={edge} strokeWidth="1.2" strokeLinejoin="round" />
      {/* Sicily */}
      <path d="M100 254 L128 266 L104 272 Z" fill={land} stroke={edge} strokeWidth="1.2" strokeLinejoin="round" />
      {/* Sardinia */}
      <ellipse
        cx="30"
        cy="176"
        rx="10"
        ry="17"
        fill={ghost ? "rgba(247,244,239,0.14)" : "rgba(255,255,255,0.85)"}
        stroke={ghost ? edge : "none"}
        strokeWidth="1"
      />
      {/* highlighted region */}
      <path d={HILITE[region]} fill={mark} stroke={mark} strokeWidth="1" strokeLinejoin="round" />
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
