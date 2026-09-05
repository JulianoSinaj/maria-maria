/* "Refresh the pages" — what a publish, withdrawal or edit of a live piece
   has to bust.

   The article is one route with two dynamic segments; the magazine and the
   region page carry the two teasers; the sitemap lists the address. Passing
   the route PATTERN with type "page" revalidates every rendered instance
   (all four languages, every slug) in one call — no need to enumerate
   locale × slug, and nothing is missed when a fifth language arrives.

   Lives in lib/ rather than in a route file because two routes need it and
   a Next route module may only export HTTP verbs and its own config. */

import { revalidatePath } from "next/cache";

const TARGETS = [
  ["/[locale]/magazin/interviews/[slug]", "page"],
  ["/[locale]/magazin", "page"],
  ["/[locale]/regionen", "page"],
];

export function revalidateInterviewPages() {
  for (const [target, type] of TARGETS) {
    try {
      revalidatePath(target, type);
    } catch {
      /* outside a request context (a test importing the module directly) */
    }
  }
  /* app/sitemap.js is NOT revalidated here. It is a MetadataRoute file, not
     a page, and on-demand revalidation of a statically generated App
     Router sitemap does not bust its cache in Next 14.2 — tested on
     2026-09-05 against every combination the public API offers
     (revalidatePath with "page"/"layout"/no type, revalidateTag against
     each of the four tags the prerender manifest lists for the route:
     "/sitemap.xml", "/sitemap.xml/route", "/sitemap.xml/layout", "/layout").
     All six returned success and none changed the cache header on the next
     request. This is a known limitation of the framework, not a mistake in
     the call.

     app/sitemap.js instead carries `export const revalidate = 300`: a
     freshly published interview reaches the sitemap on its own within five
     minutes, which is an ordinary and sufficient cadence for a file crawlers
     read occasionally, not on every request. The article page itself and
     the two teasers above are unaffected by this gap — they revalidate
     immediately via the calls above. */
}
