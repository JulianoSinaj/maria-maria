"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useLocaleTools } from "@/lib/i18n/context";
import { BEACON_PATH, BEACON_KINDS } from "@/lib/insights/model";

/* The page says hello — once, and anonymously.

   Every page here is pre-rendered and served from a cache, so a visit does
   not necessarily reach any code of ours. Without this line the backoffice
   could not answer the simplest question about the site ("is anybody
   reading the Italian pages?"), and the alternative — a tag manager — costs
   a consent banner and hands the visit to a third party.

   What leaves the browser is the page key and the language. No cookie is
   read or written, no identifier is generated, nothing is stored on the
   device: sendBeacon posts once and forgets. That is why this needs no
   consent — TTDSG §25 governs access to a visitor's device, and there is
   none here.

   Do Not Track is deliberately not consulted. It is a request not to be
   tracked ACROSS sites, and nothing here follows anyone anywhere: the
   server keeps a per-day tally in which two readers of the same page are
   indistinguishable. Honouring it would only make the count wrong. */

/* Fire-and-forget. sendBeacon survives the page being closed mid-request,
   which a plain fetch does not — the last page of a visit is exactly the
   one a naive implementation loses. */
export function sendBeacon(payload) {
  if (typeof navigator === "undefined") return;
  const body = JSON.stringify(payload);
  try {
    /* text/plain keeps it a "simple request": no CORS preflight, and no
       preflight means no second round trip for a 204. */
    const blob = new Blob([body], { type: "text/plain;charset=UTF-8" });
    if (navigator.sendBeacon?.(BEACON_PATH, blob)) return;
  } catch {
    /* fall through to fetch */
  }
  try {
    fetch(BEACON_PATH, { method: "POST", body, keepalive: true }).catch(() => {});
  } catch {
    /* measurement must never break a page */
  }
}

export default function Beacon() {
  const pathname = usePathname();
  const { locale } = useLocaleTools();

  /* One count per page, not one per render. The App Router remounts a fair
     amount around navigation; without this guard a single visit to
     /unsere-weine could arrive as three. */
  const counted = useRef(null);

  useEffect(() => {
    if (!pathname || counted.current === pathname) return;
    counted.current = pathname;
    sendBeacon({ kind: BEACON_KINDS.PAGEVIEW, path: pathname, locale });
  }, [pathname, locale]);

  return null;
}
