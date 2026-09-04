import { revalidatePath } from "next/cache";
import { PAGE_GROUPS, wineSlugOf } from "./schema";
import { LOCALES, DEFAULT_LOCALE } from "@/lib/i18n/config";

/* Push an edited answer onto the live pages.

   The storefront is statically pre-rendered (generateStaticParams over the
   four languages), so without this nudge a saved answer would stay
   invisible until the next deploy — which is the whole point of having an
   editor. Both spellings of the German page are refreshed: it is served
   without a prefix and rewritten to /de internally (middleware.js).

   Lives in lib/ rather than in the route file because both routes need it
   and a Next route module may only export HTTP verbs and its own config —
   any other export fails the build. */
export function revalidateGroup(group) {
  const slug = wineSlugOf(group);
  const base = slug
    ? `/unsere-weine/${slug}`
    : (PAGE_GROUPS.find((p) => p.key === group)?.path ?? null);
  if (!base) return;

  const targets = new Set([
    base,
    ...LOCALES.map((locale) =>
      locale === DEFAULT_LOCALE ? base : `/${locale}${base === "/" ? "" : base}`,
    ),
  ]);

  for (const target of targets) {
    try {
      revalidatePath(target);
    } catch {
      /* outside a request context (a test importing the module directly) */
    }
  }
}
