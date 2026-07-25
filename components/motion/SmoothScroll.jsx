"use client";
import { createContext, useContext, useEffect, useRef } from "react";
import { MotionConfig } from "motion/react";
import Lenis from "lenis";

/* Global inertial smooth-scroll (Lenis). Exposes the instance through context
   so overlays (mobile menu, modals) can stop/start the scroll. */

const LenisContext = createContext({ current: null });
export const useLenis = () => useContext(LenisContext);

export default function SmoothScroll({ children }) {
  const lenisRef = useRef(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = null;

    const start = () => {
      if (lenisRef.current) return;
      const lenis = new Lenis({
        lerp: 0.105,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.4,
      });
      lenisRef.current = lenis;
      const loop = (time) => {
        lenis.raf(time);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    };

    const stop = () => {
      if (raf !== null) cancelAnimationFrame(raf);
      raf = null;
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
