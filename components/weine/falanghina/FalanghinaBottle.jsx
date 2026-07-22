/* Beneventano Falanghina IGP — illustrated bottle, drawn from the real packshot:
   olive glass bordolese, green capsule, teal/white checkered label with the
   black MARIA MARIA bands. Acts as the stand-in until the freigestellte
   product photo lands in public/img/wines/falanghina/ (pass it as photoSrc
   via wineData.images.front and this component swaps automatically). */

export default function FalanghinaBottle({
  photoSrc = null,
  alt = "Flasche Beneventano Falanghina IGP",
  className = "h-72",
}) {
  if (photoSrc) {
    return (
      <img
        src={photoSrc}
        alt={alt}
        draggable={false}
        className={`${className} w-auto select-none object-contain`}
      />
    );
  }

  return (
    <svg
      viewBox="0 0 120 420"
      role="img"
      aria-label={alt}
      className={`${className} w-auto select-none`}
    >
      <defs>
        {/* olive glass — dark edges, lit core */}
        <linearGradient id="flb-glass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#39431B" />
          <stop offset="0.22" stopColor="#5C6A2E" />
          <stop offset="0.46" stopColor="#8C9A4E" />
          <stop offset="0.62" stopColor="#75843C" />
          <stop offset="0.85" stopColor="#4A5622" />
          <stop offset="1" stopColor="#2E3714" />
        </linearGradient>
        <linearGradient id="flb-neck" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#333D16" />
          <stop offset="0.5" stopColor="#6E7D38" />
          <stop offset="1" stopColor="#2C3513" />
        </linearGradient>
        {/* green capsule */}
        <linearGradient id="flb-capsule" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#25603E" />
          <stop offset="0.45" stopColor="#3E8A5C" />
          <stop offset="0.75" stopColor="#2F714A" />
          <stop offset="1" stopColor="#1D5134" />
        </linearGradient>
        <linearGradient id="flb-sheen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.5" />
          <stop offset="0.6" stopColor="#FFFFFF" stopOpacity="0.14" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0.05" />
        </linearGradient>
      </defs>

      {/* body + shoulders + neck */}
      <path
        d="M49 62 L49 148 C49 163 39 169 33 177 C27 185 25 191 25 202 L25 400 Q25 412 37 412 L83 412 Q95 412 95 400 L95 202 C95 191 93 185 87 177 C81 169 71 163 71 148 L71 62 Z"
        fill="url(#flb-glass)"
      />
      {/* neck re-tint above the shoulder for depth */}
      <rect x="49" y="62" width="22" height="88" fill="url(#flb-neck)" />

      {/* capsule */}
      <path d="M47 14 Q47 8 53 8 L67 8 Q73 8 73 14 L73 74 L47 74 Z" fill="url(#flb-capsule)" />
      <ellipse cx="60" cy="9.5" rx="11.5" ry="3.2" fill="#2C6B45" />
      <ellipse cx="60" cy="9.5" rx="8.4" ry="2.1" fill="#3E8A5C" />
      <rect x="47" y="62" width="26" height="1.6" fill="#1A4930" opacity="0.85" />
      <rect x="47" y="70.5" width="26" height="3.5" fill="#174127" opacity="0.9" />

      {/* standing sheen down the lit side */}
      <path d="M40 84 C38 150 36 210 36 300 L36 396 L43 396 C42 300 43 170 46 84 Z" fill="url(#flb-sheen)" opacity="0.5" />
      <path d="M83 96 C85 170 86 240 85 380 L82 380 C83 250 82 170 80 96 Z" fill="#FFFFFF" opacity="0.12" />

      {/* ---- label ---- */}
      <g>
        <rect x="29" y="205" width="62" height="126" rx="1.5" fill="#F7F6F1" />
        {/* top row: teal | white */}
        <rect x="29" y="205" width="24" height="48" fill="#45B3A2" />
        <rect x="31.4" y="205" width="1.1" height="48" fill="#F7F6F1" opacity="0.85" />
        <rect x="34" y="205" width="1.1" height="48" fill="#F7F6F1" opacity="0.85" />
        <rect x="36.6" y="205" width="1.1" height="48" fill="#F7F6F1" opacity="0.85" />

        {/* MARIA MARIA — two black bands, deco-striped lettering */}
        <rect x="29" y="253" width="62" height="19" fill="#141412" />
        <rect x="29" y="272.6" width="62" height="19" fill="#141412" />
        <text
          x="60"
          y="267.5"
          textAnchor="middle"
          fill="#F7F6F1"
          fontFamily="var(--font-montserrat), Arial, sans-serif"
          fontWeight="800"
          fontSize="14.5"
          letterSpacing="1.5"
        >
          MARIA
        </text>
        <text
          x="60"
          y="287"
          textAnchor="middle"
          fill="#F7F6F1"
          fontFamily="var(--font-montserrat), Arial, sans-serif"
          fontWeight="800"
          fontSize="14.5"
          letterSpacing="1.5"
        >
          MARIA
        </text>
        {/* inline stripes through the letterforms */}
        <g fill="#141412">
          <rect x="33" y="257.2" width="54" height="0.9" />
          <rect x="33" y="260.6" width="54" height="0.9" />
          <rect x="33" y="264" width="54" height="0.9" />
          <rect x="33" y="276.8" width="54" height="0.9" />
          <rect x="33" y="280.2" width="54" height="0.9" />
          <rect x="33" y="283.6" width="54" height="0.9" />
        </g>

        {/* bottom row: white text block | teal column */}
        <rect x="62" y="291.6" width="24" height="39.4" fill="#45B3A2" />
        <rect x="64.2" y="291.6" width="1.1" height="39.4" fill="#F7F6F1" opacity="0.85" />
        <rect x="66.8" y="291.6" width="1.1" height="39.4" fill="#F7F6F1" opacity="0.85" />
        <text
          x="45"
          y="306"
          textAnchor="middle"
          fill="#403F39"
          fontFamily="var(--font-montserrat), Arial, sans-serif"
          fontWeight="600"
          fontSize="4.6"
          letterSpacing="0.7"
        >
          BENEVENTANO
        </text>
        <text
          x="45"
          y="313"
          textAnchor="middle"
          fill="#403F39"
          fontFamily="var(--font-montserrat), Arial, sans-serif"
          fontWeight="600"
          fontSize="4.6"
          letterSpacing="0.7"
        >
          FALANGHINA
        </text>
        <text
          x="45"
          y="320"
          textAnchor="middle"
          fill="#403F39"
          fontFamily="var(--font-montserrat), Arial, sans-serif"
          fontWeight="600"
          fontSize="4.6"
          letterSpacing="0.7"
        >
          IGP
        </text>
      </g>

      {/* label edge shading so it wraps the cylinder */}
      <path d="M29 205 L33 205 L33 331 L29 331 Z" fill="#20250D" opacity="0.18" />
      <path d="M87 205 L91 205 L91 331 L87 331 Z" fill="#20250D" opacity="0.22" />

      {/* base shadow ring */}
      <ellipse cx="60" cy="409" rx="33" ry="4.5" fill="#1E2410" opacity="0.35" />
    </svg>
  );
}
