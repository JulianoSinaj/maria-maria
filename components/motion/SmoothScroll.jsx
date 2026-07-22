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
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      lerp: 0.105,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    });
    lenisRef.current = lenis;

    let raf;
    const loop = (time) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <LenisContext.Provider value={lenisRef}>{children}</LenisContext.Provider>
    </MotionConfig>
  );
}
