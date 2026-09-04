import { NextResponse } from "next/server";
import { list as listWines } from "@/lib/inventory/store";
import { list as listInquiries, stats as inquiryStats } from "@/lib/inquiries/store";
import { INQUIRY_STATUS } from "@/lib/inquiries/schema";
import { STATUS } from "@/lib/inventory/schema";

/* What the bell in the header actually rings about.
   ==================================================================
   The bell used to carry a red dot that never went away, because nothing
   was behind it. Everything it reports now is DERIVED from the state of the
   two stores at the moment of the request — nothing is invented, nothing is
   stored, and an item disappears by itself once the thing it reports is
   dealt with:

     storage_memory   the inbox could not be written to disk. First, because
                      it means every other notice here may be lost at the
                      next restart.
     inquiry_new      a message in the inbox nobody has picked up ("neu").
     stock_out        a limited wine whose batch is exhausted.
     stock_low        a limited wine at a quarter of its batch or less.
     wine_draft       a wine the portfolio holds as an unpublished draft.

   The route sends DATA, not sentences: `kind` plus `params`. The wording
   lives in the admin dictionary like every other string in here, so the
   panel speaks German, Italian and English without the server knowing which
   one is on screen. Enum values (intent, status) travel raw and are
   translated by the client through tm() — the same rule the tables follow.

   Read-state is not a server concern either: which notices an editor has
   already seen is personal to their browser, and the ids below are stable
   and content-derived precisely so the client can remember them. */
export const dynamic = "force-dynamic";

/* Enough to act on; the panel links to the full list rather than becoming
   one. What is cut off is reported as a single "and N more" row. */
const MAX_INQUIRIES = 5;
const MAX_WINES = 4;

export async function GET() {
  const items = [];

  /* ---- 1. can the inbox even be kept? ---- */
  const stats = inquiryStats();
  if (stats.persistence === "memory") {
    items.push({
      id: "storage:memory",
      kind: "storage_memory",
      tone: "alert",
      at: null,
      href: "/admin/anfragen",
      params: {},
    });
  }

  /* ---- 2. unanswered messages ---- */
  const fresh = listInquiries({ status: INQUIRY_STATUS.NEW });
  for (const inquiry of fresh.slice(0, MAX_INQUIRIES)) {
    items.push({
      id: `inquiry:${inquiry.id}`,
      kind: "inquiry_new",
      tone: "action",
      at: inquiry.receivedAt,
      href: `/admin/anfragen?id=${encodeURIComponent(inquiry.id)}`,
      params: { name: inquiry.name, intent: inquiry.intent },
    });
  }
  if (fresh.length > MAX_INQUIRIES) {
    items.push({
      /* the id carries the count: once another message arrives, this is a
         new notice again rather than one the editor has already dismissed */
      id: `inquiry:more:${fresh.length}`,
      kind: "inquiry_more",
      tone: "action",
      at: null,
      href: "/admin/anfragen",
      params: { count: fresh.length - MAX_INQUIRIES },
    });
  }

  /* ---- 3. what the portfolio needs a decision about ---- */
  const wines = listWines({ includeArchived: false });
  const byStatus = (status) => wines.filter((w) => w.status === status);

  for (const wine of byStatus(STATUS.SOLD_OUT).slice(0, MAX_WINES)) {
    items.push({
      id: `stock:out:${wine.id}`,
      kind: "stock_out",
      tone: "alert",
      at: null,
      href: `/admin/portfolio?q=${encodeURIComponent(wine.name)}`,
      params: { name: wine.name },
    });
  }

  for (const wine of byStatus(STATUS.LOW).slice(0, MAX_WINES)) {
    items.push({
      id: `stock:low:${wine.id}`,
      kind: "stock_low",
      tone: "warn",
      at: null,
      href: `/admin/portfolio?q=${encodeURIComponent(wine.name)}`,
      /* the number is the point of the notice, so it travels with it. It is
         deliberately NOT part of the id: a wine selling its way down is one
         standing condition, and re-ringing per bottle would be noise. */
      params: { name: wine.name, remaining: wine.remaining ?? 0 },
    });
  }

  for (const wine of byStatus(STATUS.DRAFT).slice(0, MAX_WINES)) {
    items.push({
      id: `wine:draft:${wine.id}`,
      kind: "wine_draft",
      tone: "info",
      at: null,
      href: `/admin/portfolio?q=${encodeURIComponent(wine.name)}`,
      params: { name: wine.name },
    });
  }

  return NextResponse.json({
    data: {
      items,
      count: items.length,
      generatedAt: new Date().toISOString(),
    },
  });
}
