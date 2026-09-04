import { NextResponse } from "next/server";
import { SHOP_TARGETS, isShopKey, isCrawlerUserAgent, DEFAULT_LOCALE } from "@/lib/insights/model";
import { LOCALES } from "@/lib/i18n/config";
import { recordShopClick } from "@/lib/insights/store";

/* The door to Terra Vera — and the only place the site can count it.

   Since the hand-off, the click that leaves for the partner shop is the
   closest thing this site has to a sale. No tag manager is installed and
   none is wanted: it would need a consent banner (TTDSG §25), and a tag
   that fires in a tab the browser is already leaving misses a share of the
   clicks anyway. A redirect misses none — the browser has to come here
   before it can go there.

   What is counted is a tally per day, per target, per language. No cookie
   is set, no address is read, nothing about the visitor is stored. Two
   people clicking the same bottle are indistinguishable in the file, which
   is precisely the point.

   The key is looked up in a table (lib/insights/model.js), never taken from
   the request. A route that redirected to a URL handed to it would be an
   open redirect: /api/out/shop?to=https://evil.example, sent from our
   domain, with our reputation in front of it. An unknown key is a 404. */

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  const key = params?.key;
  const target = isShopKey(key) ? SHOP_TARGETS[key] : null;

  if (!target) {
    return new NextResponse("Unbekanntes Ziel.", {
      status: 404,
      headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" },
    });
  }

  /* The language the click came from. It rides in the query rather than
     being read off the Referer, which a privacy extension may strip — and
     a stripped Referer must not silently turn every click German. */
  const wanted = request.nextUrl.searchParams.get("l");
  const locale = LOCALES.includes(wanted) ? wanted : DEFAULT_LOCALE;

  /* Bots do not buy wine. Counting them would inflate the one number the
     desk uses to judge whether the site sends anybody to the shop. */
  if (!isCrawlerUserAgent(request.headers.get("user-agent"))) {
    recordShopClick({ key, locale });
  }

  /* 307, not 301: the target is a table in this repository, and a permanent
     code would burn today's Terra Vera handle into every visitor's browser
     cache. When a handle changes — and lib/shop/config.js says plainly that
     it will — the redirect has to be free to change with it. */
  const response = NextResponse.redirect(target, 307);
  response.headers.set("Cache-Control", "no-store");
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}
