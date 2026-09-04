"use client";
import { useEffect, useRef } from "react";
import { useLocaleTools } from "@/lib/i18n/context";
import { BEACON_KINDS } from "@/lib/insights/model";
import { sendBeacon } from "./Beacon";

/* An interview that was READ, not merely opened.

   The magazine is one of the things this site now sells itself on, and
   "opened" flatters it: a click from the magazine index that bounces in
   four seconds is not a read. So this marker sits at the FOOT of the
   article and reports only when it has genuinely been on screen — the
   reader got to the end.

   DWELL exists because scrolling past is not reading either. A flick to the
   bottom of the page crosses this marker in a few hundred milliseconds; two
   seconds of it standing still on screen is a person who stopped there.

   Same payload discipline as the pageview: the slug and the language, and
   nothing that could say who. */

const DWELL_MS = 2000;

export default function ReadBeacon({ slug }) {
  const { locale } = useLocaleTools();
  const ref = useRef(null);
  const done = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || done.current || typeof IntersectionObserver === "undefined") return;

    let timer = null;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !timer && !done.current) {
          timer = setTimeout(() => {
            done.current = true;
            observer.disconnect();
            sendBeacon({ kind: BEACON_KINDS.INTERVIEW_READ, slug, locale });
          }, DWELL_MS);
        } else if (!entry.isIntersecting && timer) {
          /* Scrolled away again before the dwell was up — not a read. */
          clearTimeout(timer);
          timer = null;
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(node);
    return () => {
      if (timer) clearTimeout(timer);
      observer.disconnect();
    };
  }, [slug, locale]);

  /* Zero height, no margin, aria-hidden: it must not add a pixel to a
     layout that was designed without it. */
  return <span ref={ref} aria-hidden="true" className="block h-px w-full" />;
}
