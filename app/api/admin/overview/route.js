import { NextResponse } from "next/server";
import { summary, linkCheck, saveLinkCheck, persistenceMode } from "@/lib/insights/store";
import { contentStatus } from "@/lib/insights/content";
import { runLinkCheck } from "@/lib/insights/links";
import { dayKey, shiftDay, isoWeek } from "@/lib/insights/model";
import { list as listInquiries, stats as inquiryStats } from "@/lib/inquiries/store";
import { INQUIRY_INTENTS } from "@/lib/inquiries/schema";

/* Everything the Übersicht shows, in one request.

   One endpoint rather than four: the four cards describe one week, and four
   round trips could straddle midnight or a link check and disagree with
   each other about which week that is. The window is computed once here and
   every card is drawn from the same pass.

   Behind the backoffice guard — /api/admin is checked in middleware.js, so
   this file needs no auth code of its own and cannot forget it. */

export const dynamic = "force-dynamic";

/* Walking every leaf of four dictionaries takes long enough to be worth not
   repeating on a double-click, and the content it reads only changes on a
   deploy. Memoised per process, briefly. */
const CONTENT_TTL = 60_000;
const g = globalThis;
g.__mmOverviewContentCache ??= { at: 0, value: null, links: null };
const cache = g.__mmOverviewContentCache;

async function cachedContentStatus(links) {
  const fresh = Date.now() - cache.at < CONTENT_TTL && cache.links === (links?.checkedAt ?? null);
  if (fresh && cache.value) return cache.value;
  const value = await contentStatus({ links });
  cache.at = Date.now();
  cache.links = links?.checkedAt ?? null;
  cache.value = value;
  return value;
}

/* Inquiries in the window, grouped by intent.

   lib/inquiries/store gives byIntent over the whole inbox and a plain
   seven-day count; the card asks a third question — which ANLIEGEN came in
   this week — so the window is applied here rather than widening the
   store's API for one caller. */
function inquiriesInWindow(days, now) {
  const from = shiftDay(dayKey(now), -(days - 1));
  const previousFrom = shiftDay(from, -days);

  const all = listInquiries();
  const inWindow = all.filter((i) => dayKey(new Date(i.receivedAt)) >= from);
  const previous = all.filter((i) => {
    const day = dayKey(new Date(i.receivedAt));
    return day >= previousFrom && day < from;
  });

  const byIntent = Object.fromEntries(INQUIRY_INTENTS.map((k) => [k, 0]));
  const byLanguage = {};
  for (const i of inWindow) {
    byIntent[i.intent] = (byIntent[i.intent] ?? 0) + 1;
    byLanguage[i.language] = (byLanguage[i.language] ?? 0) + 1;
  }

  const stats = inquiryStats(now.getTime());

  return {
    total: inWindow.length,
    previous: previous.length,
    byIntent,
    byLanguage,
    open: stats.open,
    inbox: stats.total,
    persistence: stats.persistence,
  };
}

/** GET /api/admin/overview?days=7 */
export async function GET(request) {
  const raw = Number(request.nextUrl.searchParams.get("days"));
  const days = Number.isFinite(raw) && raw >= 1 && raw <= 90 ? Math.round(raw) : 7;
  const now = new Date();

  const links = linkCheck();
  const traffic = summary({ days, now });
  const content = await cachedContentStatus(links);

  return NextResponse.json({
    data: {
      window: { days, from: traffic.from, to: traffic.to, week: isoWeek(traffic.to) },
      traffic,
      inquiries: inquiriesInWindow(days, now),
      content,
      links,
    },
    meta: {
      /* Counting only survives a restart where the disk does. On a
         serverless host it does not, and the card says so instead of
         presenting a number that quietly resets. */
      persistence: persistenceMode(),
      generatedAt: now.toISOString(),
    },
  });
}

/** POST /api/admin/overview — { action: "check-links" } */
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400 });
  }

  if (body?.action !== "check-links") {
    return NextResponse.json({ error: "Unbekannte Aktion." }, { status: 400 });
  }

  const result = saveLinkCheck(await runLinkCheck());
  /* The content report quotes the link result, so it has to be rebuilt
     alongside it rather than served from a cache that predates the check. */
  const content = await cachedContentStatus(result);

  return NextResponse.json({ data: { links: result, content } });
}
