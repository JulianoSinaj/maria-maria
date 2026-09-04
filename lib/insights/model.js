/* First-party measurement — the vocabulary.
   ==================================================================
   What the site counts, and nothing else. Since the Terra Vera hand-off the
   only numbers that describe this site's success are the inquiries that
   come in and the clicks that go out to the partner shop; a tag manager
   would need a consent banner (TTDSG §25) and would still not see a click
   that opens a new tab before the tag has loaded. So the site keeps its own
   count, server-side, of aggregates only:

     pageview        one per page open, by language and page
     shop click      one per pass through /api/out/shop/<key>
     interview read  one per article that was actually read (see Beacon)

   No cookies, no IP addresses, no user agents, no session ids. A record is
   "on this day, in this language, this page was opened n times". That is
   why no banner is needed — there is nothing here that identifies a person.

   Plain module without Node or Next imports: the store (fs), the routes,
   the storefront beacon and the unit tests all read from here. */

import { LOCALES, DEFAULT_LOCALE, isLocale } from "../i18n/config";
/* The catalogue, NOT components/weine/wineRegistry: the registry imports all
   nine wineData.js modules, and this file is read by a client component
   (the beacon). Importing the registry would drag every landing page's
   German copy into the browser bundle to learn nine slugs. */
import { WINES, detailHref } from "../../components/data";
import { INTERVIEW_SLUGS } from "../../components/magazin/interviewRegistry";
import {
  EXTERNAL_PRODUCT_URLS,
  EXTERNAL_SHOP_URL,
  EXTERNAL_TOPSELLER_URL,
  SHOP_COLLECTION_KEY,
  SHOP_TOPSELLER_KEY,
  SHOP_OUT_PATH,
} from "../shop/config";

/* Re-exported so a consumer of the measurement vocabulary does not have to
   know that the link targets live in the shop config — the keys and the
   table below are one idea. */
export { SHOP_COLLECTION_KEY, SHOP_TOPSELLER_KEY, SHOP_OUT_PATH };

export { LOCALES, DEFAULT_LOCALE };

/* Berlin decides what "today" and "this week" mean — the desk that reads
   the numbers sits there, and a click at 00:30 belongs to the new day for
   them, not to the UTC evening before. */
export const TIME_ZONE = "Europe/Berlin";

/* --------------------------------------------------------- shop targets ---- */

/* The keys a shop link may carry through the pass-through route: the nine
   product slugs plus the collection page every unspecific "Zum Shop" link
   points at. Anything else is not a key — the route answers 404 instead of
   redirecting to a URL it was handed, which is what keeps it from being an
   open redirect. */
export const SHOP_TARGETS = Object.freeze({
  ...EXTERNAL_PRODUCT_URLS,
  [SHOP_COLLECTION_KEY]: EXTERNAL_SHOP_URL,
  [SHOP_TOPSELLER_KEY]: EXTERNAL_TOPSELLER_URL,
});

export const SHOP_KEYS = Object.freeze(Object.keys(SHOP_TARGETS));
export const isShopKey = (key) => Object.prototype.hasOwnProperty.call(SHOP_TARGETS, key);

/* The two keys that do not name a bottle. The overview lists wines first
   and these two underneath, because "somebody went to the shop front" and
   "somebody went to the Lugana" are different pieces of news. */
export const SHOP_GENERIC_KEYS = Object.freeze([SHOP_COLLECTION_KEY, SHOP_TOPSELLER_KEY]);

/* ------------------------------------------------------------ page keys ---- */

/* Pages are counted under a bounded set of keys. A path that is none of
   these lands in "other", so a scan of random URLs cannot grow the file by
   one entry per guess. The wine and interview keys are what the overview
   joins clicks and reads against. */
export const PAGE_OTHER = "other";

const STATIC_PAGES = new Set([
  "/",
  "/unsere-weine",
  "/regionen",
  "/magazin",
  "/kontakt",
  "/geschichte",
  "/impressum",
  "/datenschutz",
  "/agb",
]);

/* Only wines that actually have a landing page: a slug without one is
   never a page key, because there is no page to open. */
export const WINE_PAGE_SLUGS = Object.freeze(
  WINES.filter((w) => detailHref(w)).map((w) => w.slug),
);

const WINE_SET = new Set(WINE_PAGE_SLUGS);
const INTERVIEW_SET = new Set(INTERVIEW_SLUGS);

/* Strip the locale prefix without importing the routing module (which pulls
   nothing heavy today, but the beacon ships this file to the browser). */
export function splitPublicPath(pathname) {
  if (typeof pathname !== "string" || !pathname.startsWith("/")) {
    return { locale: DEFAULT_LOCALE, path: "/" };
  }
  const clean = pathname.split(/[?#]/)[0];
  const [, first = "", ...rest] = clean.split("/");
  if (isLocale(first)) {
    return { locale: first, path: `/${rest.join("/")}`.replace(/\/+$/, "") || "/" };
  }
  return { locale: DEFAULT_LOCALE, path: clean.replace(/\/+$/, "") || "/" };
}

export function pageKey(path) {
  if (typeof path !== "string") return PAGE_OTHER;
  if (STATIC_PAGES.has(path)) return path;
  const wine = path.match(/^\/unsere-weine\/([^/]+)$/);
  if (wine && WINE_SET.has(wine[1])) return path;
  const interview = path.match(/^\/magazin\/interviews\/([^/]+)$/);
  if (interview && INTERVIEW_SET.has(interview[1])) return path;
  return PAGE_OTHER;
}

export const winePagePath = (slug) => `/unsere-weine/${slug}`;
export const interviewPagePath = (slug) => `/magazin/interviews/${slug}`;
export const isInterviewSlug = (slug) => INTERVIEW_SET.has(slug);

/* ---------------------------------------------------------------- days ---- */

const dayFormat = new Intl.DateTimeFormat("en-CA", {
  timeZone: TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** "2026-09-03" for an instant, as seen from Berlin. */
export function dayKey(date = new Date()) {
  return dayFormat.format(date);
}

/* Calendar arithmetic on day keys, done at UTC noon so a DST switch can
   never push a date across midnight. */
const toUtc = (key) => {
  const [y, m, d] = key.split("-").map(Number);
  return Date.UTC(y, m - 1, d, 12);
};
const fromUtc = (ms) => new Date(ms).toISOString().slice(0, 10);

export function shiftDay(key, days) {
  return fromUtc(toUtc(key) + days * 86_400_000);
}

/** 0 = Monday … 6 = Sunday, so the week starts where a German calendar does. */
export function weekdayIndex(key) {
  return (new Date(toUtc(key)).getUTCDay() + 6) % 7;
}

/** Monday of the week the day belongs to. */
export function weekStart(key) {
  return shiftDay(key, -weekdayIndex(key));
}

/** Every day key from `from` to `to`, inclusive. */
export function dayRange(from, to) {
  const out = [];
  for (let k = from; k <= to; k = shiftDay(k, 1)) out.push(k);
  return out;
}

/* ISO week number, for the card caption ("KW 36"). */
export function isoWeek(key) {
  const d = new Date(toUtc(key));
  const day = (d.getUTCDay() + 6) % 7;
  d.setUTCDate(d.getUTCDate() - day + 3);
  const firstThursday = new Date(Date.UTC(d.getUTCFullYear(), 0, 4));
  const diff = (d - firstThursday) / 86_400_000;
  return 1 + Math.round((diff - 3 + ((firstThursday.getUTCDay() + 6) % 7)) / 7);
}

/* ------------------------------------------------------------- crawlers ---- */

/* Bots are not visitors. The same broad pattern the middleware uses for its
   language redirect; a human misjudged as a bot is one click short, a bot
   counted as a human inflates a number the desk acts on — the second error
   is the worse one. */
const CRAWLER =
  /bot|crawl|spider|slurp|facebookexternalhit|whatsapp|telegram|preview|embedly|iframely|lighthouse|pagespeed|headlesschrome|curl\/|wget|python-requests|go-http-client|okhttp|java\//i;

export const isCrawlerUserAgent = (ua) => Boolean(ua) && CRAWLER.test(ua);

/* --------------------------------------------------------------- beacon ---- */

export const BEACON_PATH = "/api/beacon";

export const BEACON_KINDS = Object.freeze({
  PAGEVIEW: "pageview",
  INTERVIEW_READ: "interview_read",
});

/** Validate and normalise what the browser sent. Returns null for
    anything that is not exactly one of the two events. */
export function parseBeacon(body) {
  if (!body || typeof body !== "object") return null;
  const locale = isLocale(body.locale) ? body.locale : null;
  if (!locale) return null;

  if (body.kind === BEACON_KINDS.PAGEVIEW) {
    if (typeof body.path !== "string" || body.path.length > 300) return null;
    return { kind: body.kind, locale, page: pageKey(splitPublicPath(body.path).path) };
  }
  if (body.kind === BEACON_KINDS.INTERVIEW_READ) {
    if (!isInterviewSlug(body.slug)) return null;
    return { kind: body.kind, locale, slug: body.slug };
  }
  return null;
}
