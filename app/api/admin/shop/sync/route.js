import { NextResponse } from "next/server";
import { getById, shopSummary } from "@/lib/inventory/store";
import { syncAllWines, syncWine } from "@/lib/shop/sync";

/* Partner-shop sync — the button in the backoffice.

   GET  → what the last sync found, without talking to the shop.
   POST → talk to the shop: one wine ({ "id": … }) or all of them ({}).

   Behind the session guard like every other /api/admin route (middleware.js).
   The nightly job cannot present a session cookie and therefore has its own
   door with its own credential: /api/cron/shop-sync. Both end up in the same
   two functions. */

export const dynamic = "force-dynamic";

/** GET /api/admin/shop/sync — the stored state, no outbound request. */
export async function GET() {
  return NextResponse.json({ data: shopSummary() });
}

/** POST /api/admin/shop/sync
      {}            → sync every wine that carries a handle
      { id: "inv-…" } → sync that one */
export async function POST(request) {
  let body = {};
  try {
    /* An empty body is the "sync everything" case, not an error. */
    const text = await request.text();
    body = text ? JSON.parse(text) : {};
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400 });
  }

  if (body.id) {
    const item = getById(body.id);
    if (!item) {
      return NextResponse.json({ error: `No inventory item with id "${body.id}"` }, { status: 404 });
    }
    if (!item.shop?.handle) {
      return NextResponse.json(
        { error: "This wine has no partner-shop handle to sync against." },
        { status: 422 },
      );
    }

    const { item: updated, result } = await syncWine(item);
    return NextResponse.json({
      data: updated,
      meta: {
        /* `resolvedHandle` is deliberately not stored: it is what the shop
           redirected to, i.e. a suggestion for the editor, not a fact about
           this record until a person accepts it. */
        result: {
          sync: result.sync,
          error: result.error,
          source: result.source,
          resolvedHandle:
            result.resolvedHandle && result.resolvedHandle !== item.shop.handle
              ? result.resolvedHandle
              : null,
        },
        summary: shopSummary(),
      },
    });
  }

  const run = await syncAllWines();
  return NextResponse.json({
    data: run.items,
    meta: {
      run: {
        checked: run.checked,
        ok: run.ok,
        missing: run.missing,
        error: run.error,
        durationMs: run.durationMs,
        finishedAt: run.finishedAt,
        renamed: run.renamed,
      },
      summary: shopSummary(),
    },
  });
}
