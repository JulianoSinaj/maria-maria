"use client";
import { useState } from "react";

/* Tasteful on-brand placeholder for photography.
   Pass `img` (e.g. "/img/hero.jpg") to show a real photo; if the file is
   missing or fails to load it gracefully falls back to the gradient + motif,
   so the layout never breaks. `imgPos` controls object-position (e.g. "right"). */

const BG = {
  sunset:
    "radial-gradient(circle at 78% 24%, rgba(255,242,214,.92), transparent 42%), linear-gradient(120deg,#f4ead6 0%,#ecd4a9 26%,#dcae7e 48%,#c58a68 66%,#9c6455 82%,#6f4a45 100%)",
  vineyard:
    "radial-gradient(circle at 70% 20%, rgba(247,240,220,.8), transparent 46%), linear-gradient(160deg,#e9e2cc 0%,#cfc79a 32%,#a6ab74 56%,#7c8a52 78%,#5f6f43 100%)",
  sea:
    "radial-gradient(circle at 72% 22%, rgba(247,242,226,.78), transparent 46%), linear-gradient(165deg,#e7e1cd 0%,#c7cdae 30%,#9db9ac 55%,#7ba0a0 74%,#5c7f83 92%)",
  terracotta:
    "radial-gradient(circle at 30% 24%, rgba(250,239,220,.72), transparent 46%), linear-gradient(135deg,#f0e5d3 0%,#e3c59d 38%,#c2946a 66%,#8a5a44 100%)",
  feast:
    "radial-gradient(circle at 28% 18%, rgba(120,80,55,.5), transparent 55%), linear-gradient(125deg,#241813 0%,#3a281f 45%,#503528 75%,#5f3e2c 100%)",
  field:
    "radial-gradient(circle at 74% 22%, rgba(247,240,220,.7), transparent 48%), linear-gradient(160deg,#e6dfc8 0%,#cdbf90 40%,#a7a56e 70%,#87884f 100%)",
};

const DEFAULT_MOTIF = {
  sunset: "hills", vineyard: "vines", sea: "lake", terracotta: "still", feast: "table", field: "hills",
};

const OVERLAY = {
  "ivory-left":
    "linear-gradient(to right, rgba(247,244,239,.25) 0%, rgba(247,244,239,.18) 35%, rgba(247,244,239,.09) 65%, rgba(247,244,239,0) 95%)",
  "ivory-left-soft":
    "linear-gradient(to right, rgba(247,244,239,.9) 0%, rgba(247,244,239,.55) 40%, rgba(247,244,239,0) 72%)",
  "dark-left":
    "linear-gradient(to right, rgba(24,16,12,.82) 0%, rgba(24,16,12,.5) 45%, rgba(24,16,12,.12) 78%)",
  "dark-bottom":
    "linear-gradient(to top, rgba(20,13,10,.88) 0%, rgba(20,13,10,.35) 52%, rgba(20,13,10,.05) 100%)",
  dark: "linear-gradient(rgba(22,14,11,.5), rgba(22,14,11,.6))",
};

function Motif({ scene, color }) {
  const c = color;
  if (scene === "none") return null;
  const common = { fill: "none", stroke: c, strokeWidth: 1.2, strokeLinecap: "round", strokeLinejoin: "round" };
  return (
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {scene === "hills" && (
        <g {...common}>
          <circle cx="312" cy="66" r="26" strokeWidth="1.4" />
          <path d="M-10 210c70-46 130-40 190-8s140 20 240-26" />
          <path d="M-10 236c80-34 150-26 220 2s130 14 200-20" strokeOpacity="0.7" />
          <path d="M60 150c4-10 10-14 0-26M100 140c4-10 10-14 0-26M140 150c4-10 10-14 0-26" strokeOpacity="0.6" />
        </g>
      )}
      {scene === "vines" && (
        <g {...common}>
          <path d="M20 250l90-120M90 250l70-120M160 250l50-120M230 250l30-120M300 250l14-120" strokeOpacity="0.8" />
          <path d="M60 200h280M75 165h250M92 132h214" strokeOpacity="0.55" />
          <circle cx="330" cy="60" r="22" strokeWidth="1.3" />
        </g>
      )}
      {scene === "lake" && (
        <g {...common}>
          <path d="M-10 150c60-30 120-30 210-6M-10 150c-2 0 0 0 0 0" strokeOpacity="0.7" />
          <path d="M-10 172h420M-10 190h420M-10 206h420" strokeOpacity="0.45" />
          <path d="M250 150l-10-40 8-4 8 4-10 40M300 150l-8-30 6-3 6 3-8 30" strokeOpacity="0.7" />
          <circle cx="60" cy="70" r="18" strokeWidth="1.3" />
        </g>
      )}
      {scene === "table" && (
        <g {...common} stroke={c} strokeWidth="1.3">
          <circle cx="150" cy="150" r="46" /><circle cx="150" cy="150" r="24" strokeOpacity="0.7" />
          <path d="M250 96c-3 9-3 15 3 19v50M258 96c3 9 3 15-3 19" />
          <path d="M300 150c0 40 0 0 0 0" />
          <path d="M296 108c-6 8-6 16 0 20 6-4 6-12 0-20zM296 128v42" strokeOpacity="0.85" />
        </g>
      )}
      {scene === "still" && (
        <g {...common}>
          <path d="M150 110c-6 12-6 20 4 26v60M160 110c6 12 6 20-4 26" />
          <path d="M138 196h24" />
          <path d="M232 120c-16 0-24 10-24 28v58h48v-58c0-18-8-28-24-28z" strokeOpacity="0.8" />
          <path d="M232 120c0-8 4-12 10-14" />
          <circle cx="316" cy="70" r="18" strokeWidth="1.3" strokeOpacity="0.7" />
        </g>
      )}
    </svg>
  );
}

export default function PhotoBlock({
  variant = "sunset",
  scene,
  overlay,
  motif = true,
  children,
  className = "",
  motifColor,
  style,
  img,
  imgPos = "center",
}) {
  const [err, setErr] = useState(false);
  const showImg = img && !err;
  const dark = variant === "feast";
  const mColor = motifColor || (dark ? "rgba(255,247,235,0.22)" : "rgba(90,60,48,0.20)");
  const sc = scene || DEFAULT_MOTIF[variant] || "hills";
  // If the caller positions this block itself (e.g. `absolute inset-0` for a hero
  // background), don't force `relative` — otherwise the two position utilities
  // clash and the layer collapses to zero height.
  const pos = /(^|\s)absolute(\s|$)/.test(className) ? "" : "relative ";
  return (
    <div className={`${pos}overflow-hidden ${className}`} style={{ background: BG[variant], ...style }}>
      {showImg && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          data-photo="1"
          src={img}
          alt=""
          onError={() => setErr(true)}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: imgPos }}
        />
      )}
      {!showImg && motif && <Motif scene={sc} color={mColor} />}
      {/* subtle vignette */}
      <div className="pointer-events-none absolute inset-0" style={{ boxShadow: "inset 0 0 60px rgba(60,40,30,0.14)" }} />
      {overlay && <div className="pointer-events-none absolute inset-0" style={{ background: OVERLAY[overlay] }} />}
      {children != null && <div className="relative h-full w-full">{children}</div>}
    </div>
  );
}
