"use client";
import { useEffect, useRef } from "react";

/* Hero-Video der Regionen-Seite. Client-seitig, damit muted/autoplay
   zuverlässig greifen (React 18 serialisiert `muted` nicht ins SSR-HTML)
   und die Wiedergabe verlangsamt werden kann — 0.75x nimmt dem Panorama
   die Hektik und lässt es ruhig und schwer wirken. Der leichte Grade
   (Sättigung/Kontrast) läuft als GPU-Composite, kein Repaint. */

export default function RegionHeroVideo({ src, poster, rate = 0.75, className = "" }) {
  const ref = useRef(null);

  /* Reduced Motion pausiert das Video — als einzige große Bewegtfläche der
     Seite war es bisher von der sonst durchgängigen Motion-Disziplin
     ausgenommen. Reagiert wie SmoothScroll auch auf spätere Änderungen der
     OS-Einstellung; ohne die Einstellung läuft alles exakt wie zuvor. */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      el.muted = true;
      el.playbackRate = rate;
      if (mq.matches) {
        el.pause();
      } else {
        const attempt = el.play();
        if (attempt && typeof attempt.catch === "function") attempt.catch(() => {});
      }
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [rate]);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      autoPlay
      loop
      muted
      playsInline
      preload="metadata"
      disablePictureInPicture
      className={className}
      style={{
        filter: "saturate(1.12) contrast(1.05) brightness(0.98)",
        willChange: "transform",
      }}
    />
  );
}
