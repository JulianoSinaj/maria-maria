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
  ["/sitemap.xml"],
];

export function revalidateInterviewPages() {
  for (const [target, type] of TARGETS) {
    try {
      revalidatePath(target, type);
    } catch {
      /* outside a request context (a test importing the module directly) */
    }
  }
}
