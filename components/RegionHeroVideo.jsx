"use client";
import { useEffect, useRef } from "react";

/* Hero-Video der Regionen-Seite. Client-seitig, damit muted/autoplay
   zuverlässig greifen (React 18 serialisiert `muted` nicht ins SSR-HTML)
   und die Wiedergabe verlangsamt werden kann — 0.75x nimmt dem Panorama
   die Hektik und lässt es ruhig und schwer wirken. Der leichte Grade
   (Sättigung/Kontrast) läuft als GPU-Composite, kein Repaint. */

export default function RegionHeroVideo({ src, rate = 0.75, className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.muted = true;
    el.playbackRate = rate;
    const attempt = el.play();
    if (attempt && typeof attempt.catch === "function") attempt.catch(() => {});
  }, [rate]);

  return (
    <video
      ref={ref}
      src={src}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      disablePictureInPicture
      className={className}
      style={{
        filter: "saturate(1.12) contrast(1.05) brightness(0.98)",
        willChange: "transform",
      }}
    />
  );
}
