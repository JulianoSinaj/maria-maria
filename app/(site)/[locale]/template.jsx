"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { useLenis } from "@/components/motion/SmoothScroll";

/* Route-change entrance — a weighted fade-rise so navigation keeps spatial
   continuity. Remounts per navigation (App Router template semantics). */

export default function Template({ children }) {
  const pathname = usePathname();
  const lenis = useLenis();

  /* Force every new route to open at the top — Lenis owns the scroll
     position, so a bare window.scrollTo won't stick. Reset on each path
     change (template remounts, but the browser can restore prior offset).
     Anchor-Navigationen (/kontakt#fragen, /shop#fragen, FAQ-Deep-Links)
     dürfen nicht überschrieben werden — bei vorhandenem Hash nichts tun. */
  const isAdmin = pathname?.startsWith("/admin");

  useEffect(() => {
    if (isAdmin) return; // the admin shell scrolls its own column, not the window
    if (window.location.hash) return;
    if (lenis?.current) {
      lenis.current.scrollTo(0, { immediate: true, force: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, lenis, isAdmin]);

  /* the admin frame is fixed-height; a transformed wrapper around it would
     break the sticky header and the scroll container */
  if (isAdmin) return children;

  /* Reduced Motion wird NICHT hier abgezweigt, sondern von der
     <MotionConfig reducedMotion="user"> in SmoothScroll erledigt: sie lässt
     die Bewegung (y) fallen und behält die Blende.

     Ein `if (reduced) return children` sah harmloser aus, entfernte aber je
     nach Systemeinstellung ein <div> aus dem Baum — der Server rendert immer
     mit reduced=false, der Client bei aktivierter Einstellung ohne Wrapper.
     Solange die Seite darunter selbst mit einem <div> anfing, hydrierte
     React notgedrungen den Wrapper als Seitenwurzel und schwieg. Die
     Kontaktseite beginnt mit dem JSON-LD-<script> — dort brach die
     Hydration mit „Expected server HTML to contain a matching <script> in
     <main>" ab und die Seite wurde clientseitig neu aufgebaut. */
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 90,
        damping: 20,
        opacity: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
      }}
    >
      {children}
    </motion.div>
  );
}
