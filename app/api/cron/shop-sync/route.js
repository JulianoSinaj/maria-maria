import { createHash, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { syncAllWines } from "@/lib/shop/sync";

/* The nightly sync, triggered from outside.

   The in-process timer (lib/shop/scheduler.js) covers the normal case; this
   route exists for the other one: a Coolify scheduled task, a systemd timer,
   an uptime monitor — anything that would rather own the schedule itself.
   Both call the same function, so the two can never drift apart.

   WHY IT IS NOT UNDER /api/admin: everything there is behind the session
   cookie, and a cron job has no browser to sign in with. Handing a scheduler
   the client's password would be the wrong trade entirely. So this path sits
   outside the guard and carries its own credential — a secret that is only
   ever known to the machine that calls it.

   What an attacker gains by guessing it: they can make the server read nine
   public product pages. No data is exposed, nothing is written that the shop
   did not say. The secret is there to stop the endpoint being used as a
   free outbound-request button, not to protect a secret. */

export const dynamic = "force-dynamic";

const digest = (value) => createHash("sha256").update(String(value)).digest();

/* Compared over the hashes rather than the strings: a plain comparison
   returns at the first differing character, and the response time then tells
   the caller how much of the secret they got right. */
function secretMatches(supplied, expected) {
  if (!supplied || !expected) return false;
  return timingSafeEqual(digest(supplied), digest(expected));
}

function authorise(request) {
  const secret = process.env.CRON_SECRET;

  if (!secret) {
    /* Unconfigured means closed in production. In development the endpoint
       stays open — it is only reachable over localhost there, and having to
       set a secret to try the sync once would be friction with no gain. */
    if (process.env.NODE_ENV !== "production") return null;
    return NextResponse.json(
      { error: "Cron ist nicht konfiguriert (CRON_SECRET fehlt)." },
      { status: 503 },
    );
  }

  const header = request.headers.get("authorization") ?? "";
  const bearer = header.toLowerCase().startsWith("bearer ") ? header.slice(7).trim() : null;
  const supplied = bearer ?? request.headers.get("x-cron-key");

  if (!secretMatches(supplied, secret)) {
    return NextResponse.json({ error: "Nicht berechtigt." }, { status: 401 });
  }
  return null;
}

async function run(request) {
  const denied = authorise(request);
  if (denied) return denied;

  const result = await syncAllWines();
  return NextResponse.json(
    {
      data: {
        checked: result.checked,
        ok: result.ok,
        missing: result.missing,
        error: result.error,
        durationMs: result.durationMs,
        finishedAt: result.finishedAt,
        renamed: result.renamed,
      },
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}

/* GET as well as POST: most schedulers issue a plain GET, and this one has
   no body to send. */
export const GET = run;
export const POST = run;
