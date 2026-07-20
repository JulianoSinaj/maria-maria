/* Stylized silhouette of Italy with one region highlighted.
   region: apulien | kampanien | garda */

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

export default function ItalyMap({ region = "apulien", className = "w-28" }) {
  const dot = DOT[region] || DOT.apulien;
  return (
    <svg viewBox="0 0 220 280" className={`${className} h-auto`} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* mainland */}
      <path d={ITALY} fill="rgba(255,255,255,0.9)" stroke="rgba(255,255,255,0.95)" strokeWidth="1.2" strokeLinejoin="round" />
      {/* Sicily */}
      <path d="M100 254 L128 266 L104 272 Z" fill="rgba(255,255,255,0.9)" stroke="rgba(255,255,255,0.95)" strokeWidth="1.2" strokeLinejoin="round" />
      {/* Sardinia */}
      <ellipse cx="30" cy="176" rx="10" ry="17" fill="rgba(255,255,255,0.85)" />
      {/* highlighted region */}
      <path d={HILITE[region]} fill="#6B0F1A" stroke="#6B0F1A" strokeWidth="1" strokeLinejoin="round" />
      <circle cx={dot[0]} cy={dot[1]} r="3.4" fill="#6B0F1A" stroke="#fff" strokeWidth="1" />
    </svg>
  );
}
