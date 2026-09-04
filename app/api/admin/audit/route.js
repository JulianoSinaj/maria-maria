import { NextResponse } from "next/server";
import { requireActor } from "@/lib/admin/guard";
import { count, recent } from "@/lib/admin/audit";

/* The audit log, read side.

   Open to every signed-in role including viewers, and that is deliberate: a
   read-only account exists so somebody can see the state of things, and "who
   changed the price last Tuesday" is exactly that kind of question. Nothing
   in an entry is a secret — it is a list of things people did to a public
   website, with names they already know.

   Never cached: an activity list served from a cache is a list of things that
   used to have happened. */
export const dynamic = "force-dynamic";

/** GET /api/admin/audit?limit=25&action=hero.update&actor=jan@haus.de */
export async function GET(request) {
  const gate = await requireActor(request);
  if (gate.denied) return gate.denied;

  const p = request.nextUrl.searchParams;
  const entries = await recent({
    limit: p.get("limit"),
    action: p.get("action") ?? undefined,
    actor: p.get("actor") ?? undefined,
  });

  return NextResponse.json(
    { data: entries, meta: { total: await count() } },
    { headers: { "Cache-Control": "no-store" } },
  );
}
