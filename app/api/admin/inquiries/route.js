import { NextResponse } from "next/server";
import { list, stats } from "@/lib/inquiries/store";
import { toCsv } from "@/lib/inquiries/schema";

/* Inquiries API — collection endpoints of the Anfragen inbox.
   Protected by the Basic-auth guard in middleware.js like every other
   /api/admin route. Records are CREATED by app/api/contact/route.js when
   the storefront form is submitted — there is no admin-side POST: the desk
   reads, files and annotates, it does not write inquiries on a visitor's
   behalf. The store is a process singleton, so never statically optimise. */
export const dynamic = "force-dynamic";

const posInt = (v) => {
  const n = Number(v);
  return Number.isInteger(n) && n > 0 ? n : undefined;
};

const queryOf = (p) => ({
  intent: p.get("intent") ?? undefined,
  status: p.get("status") ?? undefined,
  language: p.get("language") ?? undefined,
  search: p.get("search") ?? undefined,
  sort: p.get("sort") ?? undefined,
  limit: posInt(p.get("limit")),
});

/** GET /api/admin/inquiries
      ?intent= &status= &language= &search= &sort=newest|oldest &limit=
      ?view=stats   → counts only
      ?format=csv   → the filtered list as a CSV download */
export async function GET(request) {
  const p = request.nextUrl.searchParams;

  if (p.get("view") === "stats") return NextResponse.json({ data: stats() });

  const items = list(queryOf(p));

  if (p.get("format") === "csv") {
    const day = new Date().toISOString().slice(0, 10);
    return new NextResponse(toCsv(items), {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="anfragen-${day}.csv"`,
        "Cache-Control": "no-store",
      },
    });
  }

  /* the counts ride along with every list so the filter pills update in the
     same round trip as the rows */
  return NextResponse.json({
    data: items,
    meta: { count: items.length, ...stats() },
  });
}
