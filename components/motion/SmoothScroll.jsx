"use client";
import { createContext, useContext, useEffect, useRef } from "react";
import { MotionConfig, frame, cancelFrame } from "motion/react";
import Lenis from "lenis";

/* Global inertial smooth-scroll (Lenis). Exposes the instance through context
   so overlays (mobile menu, modals) can stop/start the scroll. */

const LenisContext = createContext({ current: null });
export const useLenis = () => useContext(LenisContext);

export default function SmoothScroll({ children }) {
  const lenisRef = useRef(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let tick = null;

    const start = () => {
      if (lenisRef.current) return;
      const lenis = new Lenis({
        lerp: 0.105,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.4,
        /* wir takten selbst — siehe frame.setup unten */
        autoRaf: false,
      });
      lenisRef.current = lenis;

      /* Lenis läuft im Frame-Loop von Motion statt in einem eigenen rAF.
         Zwei getrennte rAF-Schleifen sind der eigentliche Grund für
         „schwimmende" Parallax- und Pin-Ebenen: Lenis schreibt die
         Scroll-Position in Schleife A, Motion misst sie in Schleife B —
         je nach Reihenfolge liegt zwischen Schreiben und Messen ein
         ganzes Frame, und jede scroll-gebundene Ebene hängt sichtbar
         hinter dem Inhalt her.

         Motions Steps laufen in fester Ordnung:
           setup → read → resolveKeyframes → preUpdate → update → render
         Motion misst den Scroll in `read` und benachrichtigt in
         `preUpdate`. Lenis muss also in `setup` schreiben — dem einzigen
         Step vor `read`. Damit fallen Schreiben, Messen und Rendern in
         dieselbe Frame: null Versatz. (`update` wäre zu spät, das liegt
         hinter `read` und kostet wieder ein Frame.)

         keepAlive=true, weil Lenis dauerhaft takten muss — der Prozess
         hält den Loop am Leben, genau wie das alte requestAnimationFrame. */
      tick = ({ timestamp }) => lenis.raf(timestamp);
      frame.setup(tick, true);
    };

    const stop = () => {
      if (tick) cancelFrame(tick);
      tick = null;
      lenisRef.current?.destroy();
      lenisRef.current = null;
    };

    /* auf Änderungen der OS-Einstellung reagieren — nicht nur beim Mount:
       wer Reduced Motion einschaltet, bekommt sofort natives Scrollen */
    const sync = () => (mq.matches ? stop() : start());
    sync();
    mq.addEventListener("change", sync);

    return () => {
      mq.removeEventListener("change", sync);
      stop();
    };
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <LenisContext.Provider value={lenisRef}>{children}</LenisContext.Provider>
    </MotionConfig>
  );
}
