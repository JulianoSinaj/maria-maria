"use client";
import { motion } from "motion/react";
import { useTouchDevice } from "./useMediaQuery";
import useFirstLoad from "./useFirstLoad";

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

/* `priority` — für Inhalt, der beim Laden SCHON IM BILD steht (Heroes).

   Ein Reveal startet auf opacity 0. Unterhalb des Falzes ist das gratis:
   Was niemand sieht, hält auch kein Paint auf. Im Hero ist es teuer. Dort
   liegt das größte Element der Seite, also das LCP-Element, und solange es
   transparent ist, zählt Chrome es weder für FCP noch für LCP. Die
   Hero-Reveals liefen zudem mit Verzögerungen bis 0,78 s — dieser Zuschlag
   landete oben auf der Hydrationszeit und damit direkt im LCP-Wert.

   `priority` schaltet die Einblendung deshalb für den ERSTEN Aufbau ab: Der
   Inhalt steht fertig im server-gerenderten HTML, ohne Inline-Style, ohne
   IntersectionObserver, ohne JavaScript. Ab der ersten clientseitigen
   Navigation blendet dasselbe Element wieder normal ein (useFirstLoad) —
   die Choreografie der Seite bleibt also erhalten, sie hält nur das erste
   Bild nicht mehr auf.

   WARUM DIESER ZWEIG ERLAUBT IST, der für `reduced` oben verboten war: Der
   Unterschied ist nicht der Zweig, sondern woher sein Wert kommt. `reduced`
   liest matchMedia — der Client weiß beim ersten Render mehr als der Server
   und rendert etwas anderes als im HTML steht. `priority` ist ein statisches
   Prop aus dem Aufrufer und `firstLoad` ist auf Server und erstem
   Client-Render per Konstruktion identisch (siehe useFirstLoad). Beide
   Seiten nehmen garantiert denselben Zweig. */

const SPRING = { type: "spring", stiffness: 90, damping: 20, mass: 1 };

export function Reveal({
  children,
  className = "",
  delay = 0,
  y = 28,
  blur = true,
  once = true,
  amount = 0.25,
  priority = false,
}) {
  const touch = useTouchDevice();
  const firstLoad = useFirstLoad();
  if (priority && firstLoad) return <div className={className}>{children}</div>;
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

export function Stagger({ children, className = "", style, delay = 0, gap = 0.09, once = true, amount = 0.18, priority = false }) {
  const firstLoad = useFirstLoad();
  if (priority && firstLoad) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }
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

/* `priority` gehört bei Stagger und StaggerItem IMMER zusammen gesetzt: Die
   Kinder holen ihren Zustand über die Varianten-Weitergabe des Elternteils,
   und ein Elternteil ohne Motion gibt nichts mehr weiter. Nur oben gesetzt
   bliebe die Gruppe ohne Taktgeber zurück. */
export function StaggerItem({ children, className = "", y = 26, priority = false }) {
  const touch = useTouchDevice();
  const firstLoad = useFirstLoad();
  if (priority && firstLoad) return <div className={className}>{children}</div>;
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
