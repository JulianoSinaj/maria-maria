import { NextResponse } from "next/server";
import {
  list,
  create,
  stats,
  facets,
  categoryCounts,
  archivedCount,
} from "@/lib/inventory/store";

/* Mock inventory API — collection endpoints.
   The store is an in-memory singleton, so this must never be statically
   optimised or cached: every request has to see the current state. */
export const dynamic = "force-dynamic";

const bool = (v) => (v === null ? undefined : v === "true" ? true : v === "false" ? false : undefined);

/** GET /api/admin/inventory
      ?search= &style= &aging= &region= &pairing= &redAccent= &limitedOnly= &sort=
      ?view=stats  → aggregate counts instead of the item list
      ?view=facets → distinct filter values */
export async function GET(request) {
  const p = request.nextUrl.searchParams;
  const view = p.get("view");

  if (view === "stats") return NextResponse.json({ data: stats() });
  if (view === "facets") return NextResponse.json({ data: facets() });

  const items = list({
    search: p.get("search") ?? undefined,
    style: p.get("style") ?? undefined,
    aging: p.get("aging") ?? undefined,
    region: p.get("region") ?? undefined,
    pairing: p.get("pairing") ?? undefined,
    category: p.get("category") ?? undefined,
    redAccent: bool(p.get("redAccent")),
    limitedOnly: bool(p.get("limitedOnly")),
    includeArchived: bool(p.get("includeArchived")),
    sort: p.get("sort") ?? undefined,
  });

  /* counts ride along with every list response so the tab badges update in
     the same round trip as the rows — no second request, no flicker */
  return NextResponse.json({
    data: items,
    meta: {
      count: items.length,
      categories: categoryCounts(),
      archived: archivedCount(),
    },
  });
}

/** POST /api/admin/inventory — create an item. */
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400 });
  }

  try {
    return NextResponse.json({ data: create(body) }, { status: 201 });
  } catch (err) {
    if (err.code === "VALIDATION") {
      return NextResponse.json({ error: err.message, details: err.details }, { status: 422 });
    }
    if (err.code === "CONFLICT") {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }
    throw err;
  }
}
