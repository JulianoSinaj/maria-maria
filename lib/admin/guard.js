import { NextResponse } from "next/server";
import { actorFromRequest } from "./actor";
import { canManageUsers, canWrite } from "./roles";

/* May they? — the Node-side half of the access check.

   The middleware is still the chokepoint: it turns away anyone without a
   valid session before a route file is even loaded, and it turns away a
   viewer's write before it can reach a store. This module exists for the two
   things the Edge cannot do:

     1. Hand the route the IDENTITY behind the request, so every save can be
        written into the audit log with a name on it.
     2. Say no a second time. A route is reachable by anything that can make
        an HTTP request; "the middleware would have stopped it" is a fact
        about one deployment's configuration, not a property of the endpoint.
        Two independent checks cost one function call and remove a whole class
        of accident — a matcher edited in a hurry, a route mounted somewhere
        the matcher does not cover.

   Who the actor IS comes from actor.js, which server components share. */

export { actorFromRequest, currentActor } from "./actor";

const json = (status, error) =>
  NextResponse.json(
    { error },
    { status, headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" } },
  );

/* The three gates. Each resolves to `{ actor }` when the request may proceed
   and `{ denied: Response }` when it may not — so a route reads:

     const gate = await requireWriter(request);
     if (gate.denied) return gate.denied;                                  */

export async function requireActor(request) {
  const actor = await actorFromRequest(request);
  return actor ? { actor } : { denied: json(401, "Nicht angemeldet.") };
}

export async function requireWriter(request) {
  const actor = await actorFromRequest(request);
  if (!actor) return { denied: json(401, "Nicht angemeldet.") };
  if (!canWrite(actor.role)) {
    return { denied: json(403, "Dieser Zugang darf nur lesen.") };
  }
  return { actor };
}

export async function requireOwner(request) {
  const actor = await actorFromRequest(request);
  if (!actor) return { denied: json(401, "Nicht angemeldet.") };
  if (!canManageUsers(actor.role)) {
    return { denied: json(403, "Das dürfen nur Zugänge mit der Rolle Leitung.") };
  }
  return { actor };
}

/** Best-effort client address for the audit log. Behind Coolify's proxy the
    first hop in x-forwarded-for is the visitor; direct requests fall back to
    the header Next passes through. Never trusted for anything but display. */
export function clientIp(request) {
  const forwarded = request?.headers?.get?.("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim().slice(0, 64);
  return request?.headers?.get?.("x-real-ip")?.slice(0, 64) ?? null;
}
