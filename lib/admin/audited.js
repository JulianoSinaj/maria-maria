import { requireWriter } from "./guard";
import { record } from "./audit";

/* One wrapper, so a save cannot be forgotten by the log.

   The alternative was to open all forty-odd write handlers under
   app/api/admin/ and thread a record() call through each of them by hand.
   That is exactly the kind of change that is correct on the day it is made
   and wrong a fortnight later: the backoffice is still growing an editor a
   week, and every new route would have to remember, unprompted, to write its
   own receipt. A wrapper cannot be forgotten by a route that uses it, and a
   route that does not use it is visible in one grep.

   It does two things and refuses to do more:

     1. asks guard.js whether this request may write at all, and hands the
        handler the identity it got back;
     2. files ONE entry after the handler has answered — and only if the
        handler answered with success. A 422 is not a change; a log that
        records attempts is a log nobody can read.

   The handler describes its own event, because only the handler knows what
   the thing was called and what it looked like before. It does so by filling
   in `audit` on the context object it is handed:

     export const PUT = audited("hero.update", async (request, { audit }) => {
       const before = getHeroConfig();
       const config = putHeroConfig(patch);
       audit({ target: "Hero", before, after: config });
       return NextResponse.json({ data: { config } });
     });

   A handler that never calls audit() files an entry with no diff — still a
   line saying who did what and when, which is the minimum the feature
   promises. A handler that calls it twice replaces its own description; there
   is one entry per request either way. */

const SUCCESS = (status) => status >= 200 && status < 300;

/**
 * @param {string} action  vocabulary key — "hero.update", "inventory.delete";
 *                         the dictionary translates it (auditAction.*)
 * @param {Function} handler  (request, context) => Response
 */
export function audited(action, handler) {
  return async function auditedHandler(request, context = {}) {
    const gate = await requireWriter(request);
    if (gate.denied) return gate.denied;

    /* What the handler tells us about this particular change. Collected
       rather than written immediately: the write may still fail, and the
       handler is mid-flight when it calls this. */
    let described = null;
    const audit = (event) => {
      described = event ?? {};
    };

    const response = await handler(request, { ...context, actor: gate.actor, audit });

    if (SUCCESS(response?.status ?? 200)) {
      /* Never awaited into the response path in a way that could fail it —
         record() swallows its own errors by design (lib/admin/audit.js). */
      await record({ ...(described ?? {}), actor: gate.actor, action });
    }

    return response;
  };
}
