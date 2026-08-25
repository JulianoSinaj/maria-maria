"use client";
import { useSyncExternalStore } from "react";

/* SSR-safe media query subscription — the server snapshot defaults to
   `false`, the client corrects itself right after hydration.

   `serverSnapshot` lets a caller pick what the server (and the first client
   render during hydration) assumes. WineRail passes `true` for its
   desktop breakpoint: the server-rendered HTML then carries the full rail of
   nine wines — the version a crawler without JavaScript should read — and
   phones swap to their pager as soon as they hydrate. */

export default function useMediaQuery(query, serverSnapshot = false) {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => serverSnapshot
  );
}

/* Hydration-safe "prefers-reduced-motion".

   Motion's own useReducedMotion() reads matchMedia on the FIRST client
   render, so a phone with "Reduce Motion" switched on (iOS accessibility,
   Android "Remove animations") renders `true` while the server HTML was
   built with `false`. Wherever a component branches its DOM on that value —
   SplitText's word spans vs. plain text, the hero's initial transform, a
   <video>/<img> that is skipped for reduced users — React sees a mismatch,
   throws hydration away and re-renders the whole root on the client. The
   page flashes, and a tap that lands during the swap (the language pill
   was the one people noticed) is lost.

   This variant goes through useSyncExternalStore: the server snapshot is
   `false`, the hydration pass therefore matches the server HTML, and the
   real preference is applied in the very next render. For everyone without
   the preference nothing changes at all. Use it in any component whose
   markup or inline style differs for reduced motion; pure animation props
   (initial/animate/transition) don't need it — MotionConfig handles those. */
export function useReducedMotionSafe() {
  return useMediaQuery("(prefers-reduced-motion: reduce)", false);
}

/* Touch-first device (phone/tablet): no hover, coarse pointer. Used to swap
   cursor choreography for touch choreography — gentler offsets, no animated
   blur (expensive on mobile GPUs), no magnetic tracking. */
export function useTouchDevice() {
  return useMediaQuery("(hover: none) and (pointer: coarse)");
}
