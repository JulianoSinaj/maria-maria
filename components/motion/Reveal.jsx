"use client";
import { motion } from "motion/react";
import { useTouchDevice } from "./useMediaQuery";

/* Scroll-reveal primitives — physics springs, subtle blur-in, viewport-once.
   On touch devices the animated blur is dropped (it forces expensive repaints
   on mobile GPUs) and travel is shortened, so reveals stay crisp mid-scroll.

   REDUCED MOTION liegt in CSS, nicht im Render-Zweig: `[data-reveal]` wird
   unter `prefers-reduced-motion: reduce` in globals.css sofort auf volle
   Deckkraft gesetzt. Der Inhalt ist damit ohne Scroll-Trigger, ohne
   IntersectionObserver und selbst ohne JavaScript da.

   Vorher stand hier `if (reduced) return <div>{children}</div>`. Gut gemeint,
   aber kaputt: Der Server rendert immer mit reduced=false und schreibt
   `style="opacity:0;filter:blur(8px);transform:translateY(28px)"` ins HTML.
   Beim Hydrieren lieferte der Client ein nacktes <div> ohne style — und React
   ENTFERNT serverseitige Attribute nicht, es warnt nur („Extra attributes
   from the server: style"). Für genau die Besucher, die weniger Bewegung
   eingestellt haben, wäre der halbe Seiteninhalt dauerhaft unsichtbar
   geblieben. Aufgefallen ist es nie, weil eine zweite Unstimmigkeit im
   Route-Template die Hydration ohnehin abbrechen ließ und React die Seite
   clientseitig neu aufbaute — ein Fehler hat den anderen zugedeckt. */

const SPRING = { type: "spring", stiffness: 90, damping: 20, mass: 1 };

export function Reveal({
  children,
  className = "",
  delay = 0,
  y = 28,
  blur = true,
  once = true,
  amount = 0.25,
}) {
  const touch = useTouchDevice();
  const useBlur = blur && !touch;
  const travel = touch ? Math.min(y, 20) : y;
  return (
    <motion.div
      data-reveal=""
      className={className}
      initial={{ opacity: 0, y: travel, filter: useBlur ? "blur(8px)" : "blur(0px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)", transitionEnd: { filter: "none" } }}
      viewport={{ once, amount, margin: "0px 0px -8% 0px" }}
      transition={{
        ...SPRING,
        delay,
        opacity: { duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] },
        filter: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] },
      }}
    >
      {children}
    </motion.div>
  );
}

export function Stagger({ children, className = "", style, delay = 0, gap = 0.09, once = true, amount = 0.18 }) {
  return (
    <motion.div
      data-reveal=""
      className={className}
      style={style}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount, margin: "0px 0px -6% 0px" }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: gap, delayChildren: delay } } }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = "", y = 26 }) {
  const touch = useTouchDevice();
  const blurFrom = touch ? "blur(0px)" : "blur(6px)";
  return (
    <motion.div
      data-reveal=""
      className={className}
      variants={{
        hidden: { opacity: 0, y: touch ? Math.min(y, 20) : y, filter: blurFrom },
        visible: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: { ...SPRING, opacity: { duration: 0.5 }, filter: { duration: 0.55 } },
          transitionEnd: { filter: "none" },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
