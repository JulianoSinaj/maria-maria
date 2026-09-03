import { notFound } from "next/navigation";

/* The catch-all that makes the backoffice 404 reachable.

   A not-found.jsx is a BOUNDARY, not a route: Next renders it when something
   inside its segment calls notFound(), and for an address that matches no
   route at all it falls back to the root not-found — which cannot exist here,
   because the app has two root layouts ((site) and (admin)) and no app/layout
   above them. /admin/portfoli therefore came out as Next's own black-on-white
   default page.

   This route matches every /admin/… address that nothing else claims and does
   the one thing that turns it into our 404: it calls notFound(), which sets
   the 404 status and hands rendering to ../not-found.jsx.

   Static segments win over a catch-all, so /admin/portfolio and friends are
   untouched — this only ever runs for addresses that were already lost. */

export default function UnknownAdminRoute() {
  notFound();
}
