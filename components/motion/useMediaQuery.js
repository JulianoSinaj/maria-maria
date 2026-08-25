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

/* Touch-first device (phone/tablet): no hover, coarse pointer. Used to swap
   cursor choreography for touch choreography — gentler offsets, no animated
   blur (expensive on mobile GPUs), no magnetic tracking. */
export function useTouchDevice() {
  return useMediaQuery("(hover: none) and (pointer: coarse)");
}
