import { notFound } from "next/navigation";

/* The catch-all that makes the storefront's 404 reachable.

   not-found.jsx next door is a BOUNDARY, not a route: Next renders it when
   something inside this segment calls notFound(). For an address that matches
   no route at all, Next instead looks for a root not-found — which this app
   cannot have, because (site) and (admin) are two separate root layouts with
   nothing above them.

   The consequence was quiet and complete: /unser-wein, /kontkt, every dead
   bookmark and every mistyped link answered with Next's own black-on-white
   default page. The designed 404 was written, translated into four languages
   and never shown.

   This route claims every address under a locale that nothing else claims,
   and calls notFound() — which sets the 404 status and hands rendering to
   ../not-found.jsx, inside the layout, with header, footer and the visitor's
   own language.

   Static segments always win over a catch-all, so /kontakt, /magazin and the
   rest are untouched. It only ever runs where the answer was 404 anyway.

   STILL NOT COVERED, and deliberately so: a wrong value in a segment that
   prerenders its own list — /unsere-weine/<unknown-slug>, an unknown
   interview, and any first segment that is not a locale. Those carry
   `dynamicParams = false`, which answers with a bare 404 BEFORE any component
   renders; a boundary is never reached. Lifting that is a separate decision
   with its own trade-off (unknown values would be rendered on demand instead
   of refused outright) and does not belong in a 404 page's commit. */

/* The parent layout declares `dynamicParams = false` for the four locales,
   and that setting reaches every dynamic segment below it — including this
   one, which has no prerendered list of its own and would therefore refuse
   every address before rendering. Exactly what it is here to prevent. */
export const dynamicParams = true;

export default function UnknownStorefrontRoute() {
  notFound();
}
