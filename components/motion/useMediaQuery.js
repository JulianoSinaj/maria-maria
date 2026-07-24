"use client";
import { useSyncExternalStore } from "react";

/* SSR-safe media query subscription — server snapshot is `false`, the client
   corrects itself right after hydration. */

export default function useMediaQuery(query) {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false
  );
}

/* Touch-first device (phone/tablet): no hover, coarse pointer. Used to swap
   cursor choreography for touch choreography — gentler offsets, no animated
   blur (expensive on mobile GPUs), no magnetic tracking. */
export function useTouchDevice() {
  return useMediaQuery("(hover: none) and (pointer: coarse)");
}
