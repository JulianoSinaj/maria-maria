/* Stylized Maria Maria bottle — tasteful placeholder for product photography.
   variant: red | white | rose  (or pass custom glass / accent). */

const VARIANTS = {
  red: { glass: "#241014", glass2: "#3a1a1f", capsule: "#1c0c0f", accent: "#6B0F1A" },
  redsoft: { glass: "#2c1418", glass2: "#43222a", capsule: "#241016", accent: "#8a2b2f" },
  amber: { glass: "#2a1712", glass2: "#432619", capsule: "#241209", accent: "#B5651D" },
  white: { glass: "#5d6a3c", glass2: "#7c8a54", capsule: "#464f2c", accent: "#C8B77A" },
  rose: { glass: "#caa39c", glass2: "#e2c3bc", capsule: "#a9736c", accent: "#c67f78" },
};

export default function Bottle({ variant = "red", glass, accent, className = "h-40" }) {
  const v = VARIANTS[variant] || VARIANTS.red;
  const g1 = glass || v.glass;
  const g2 = v.glass2;
  const cap = v.capsule;
  const acc = accent || v.accent;
  const uid = `${variant}${acc}`.replace(/[^a-z0-9]/gi, "");

  return (
    <svg viewBox="0 0 80 236" className={`${className} w-auto`} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`g${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={g1} />
          <stop offset="0.42" stopColor={g2} />
          <stop offset="0.62" stopColor={g1} />
          <stop offset="1" stopColor={g1} />
        </linearGradient>
      </defs>
      {/* bottle body + neck */}
      <path
        d="M34 12h12v6c0 6 1 8 3 12 4 7 6 12 6 22v146c0 6-3 9-9 9H28c-6 0-9-3-9-9V64c0-10 2-15 6-22 2-4 3-6 3-12z"
        fill={`url(#g${uid})`}
        stroke="rgba(0,0,0,0.25)"
        strokeWidth="1"
      />
      {/* sheen */}
      <path d="M28 70c-2 6-2 12-2 20v120" stroke="rgba(255,255,255,0.14)" strokeWidth="3" strokeLinecap="round" />
      {/* capsule */}
      <path d="M34 12h12v10c0 3-2 4-6 4s-6-1-6-4z" fill={cap} />
      <rect x="33" y="11" width="14" height="3" rx="1" fill={cap} />
      {/* label */}
      <g>
        <rect x="24" y="150" width="32" height="60" rx="1" fill="#efe9dc" />
        <rect x="24" y="150" width="32" height="5" fill={acc} />
        <text x="40" y="174" textAnchor="middle" fontFamily="Georgia, 'Playfair Display', serif" fontSize="8.5" letterSpacing="1.2" fill="#1B1B1B">MARIA</text>
        <text x="40" y="184" textAnchor="middle" fontFamily="Georgia, 'Playfair Display', serif" fontSize="8.5" letterSpacing="1.2" fill="#1B1B1B">MARIA</text>
        <rect x="30" y="192" width="20" height="1.4" fill={acc} opacity="0.8" />
        <text x="40" y="203" textAnchor="middle" fontFamily="Georgia, serif" fontSize="4.4" letterSpacing="0.8" fill="#6b6257">ITALIA</text>
      </g>
    </svg>
  );
}
