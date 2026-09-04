import { NextResponse } from "next/server";
import { parseBeacon, BEACON_KINDS, isCrawlerUserAgent } from "@/lib/insights/model";
import { recordPageview, recordInterviewRead } from "@/lib/insights/store";

/* Two counts the server cannot take by itself.

   Every page of this site is pre-rendered and served from a cache, so a
   visit does not necessarily reach any code of ours — which is why the
   pages say hello here instead. What they send is the page they are (as one
   of a fixed list of keys) and the language they are in. Nothing else: no
   identifier, no cookie, no address, no user agent kept, no referrer. The
   file behind this route can answer "how often was the Lugana page opened
   in Italian last week" and cannot answer anything about a person.

   The second count is an interview READ, which is not the same as an
   interview opened: the storefront only sends it once the end of the
   article has actually been on screen (components/insights/ReadBeacon).
   The magazine is the site's own product now, and "opened" flatters it.

   Deliberately not rate-limited: the only thing a flood could achieve is a
   wrong number in a backoffice nobody outside the house can see, the page
   keys are a fixed set so the file cannot be made to grow, and a limiter
   would need to remember addresses — which is the one thing this route is
   built not to do. */

export const dynamic = "force-dynamic";

const NO_CONTENT = () =>
  new NextResponse(null, {
    status: 204,
    headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" },
  });

export async function POST(request) {
  /* sendBeacon posts a Blob; the content type it carries is whatever the
     caller set, so parse the body as text and read it as JSON ourselves
     rather than trusting request.json() to be handed a JSON mime type. */
  let body;
  try {
    body = JSON.parse(await request.text());
  } catch {
    return NO_CONTENT();
  }

  const event = parseBeacon(body);
  /* An unparseable or unknown event is silently dropped: this endpoint
     talks to a beacon that cannot read a reply, so an error status would
     tell nobody anything. */
  if (!event) return NO_CONTENT();

  if (isCrawlerUserAgent(request.headers.get("user-agent"))) return NO_CONTENT();

  if (event.kind === BEACON_KINDS.PAGEVIEW) {
    recordPageview({ page: event.page, locale: event.locale });
  } else if (event.kind === BEACON_KINDS.INTERVIEW_READ) {
    recordInterviewRead({ slug: event.slug, locale: event.locale });
  }

  return NO_CONTENT();
}
