/* First-party measurement — the counters.
   ==================================================================
   Daily aggregates and nothing else: per day, how often a page was opened,
   how often a shop button was pressed, how often an article was read
   through — each split by language. No cookies, no IP addresses, no user
   agents, no identifiers of any kind. There is nothing in this file that
   could be traced back to a person, which is exactly why the site needs no
   consent banner to keep it (TTDSG §25 covers access to a visitor's device;
   a server-side tally of requests is not that).

   Persistence follows lib/inquiries/store.js — a JSON file under data/,
   read once into a globalThis singleton, rewritten atomically. Where the
   filesystem is read-only (serverless containers) the write fails once, is
   logged once, and the counters carry on in memory; the overview says so
   rather than presenting a number that silently restarts at zero.

   Writes are coalesced: a pageview is not worth an fsync of its own, and a
   burst of them would otherwise mean a burst of file writes. Up to
   FLUSH_DELAY of counting can be lost if the process dies — an acceptable
   trade for a visit counter, and never for an inquiry, which is why the
   inbox writes through instead. */

import fs from "fs";
import path from "path";
import { dayKey, shiftDay, dayRange, DEFAULT_LOCALE, LOCALES } from "./model.js";

const FILE_VERSION = 1;

/* Six months. Long enough to compare a season against the last one, short
   enough that the file stays a few hundred kilobytes at most. */
const RETENTION_DAYS = 180;

const FLUSH_DELAY = 1500;

const storeFile = () =>
  process.env.MM_INSIGHTS_FILE || path.join(process.cwd(), "data", "insights", "insights.json");

const g = globalThis;
g.__mmInsightsStore ??= { data: null, persistence: null, warned: false, timer: null };
const state = g.__mmInsightsStore;

const emptyDay = () => ({ pageviews: {}, shopClicks: {}, reads: {} });
const emptyData = () => ({ version: FILE_VERSION, days: {}, links: null });

/* ---------------------------------------------------------- persistence ---- */

function load() {
  if (state.data) return state.data;
  try {
    const parsed = JSON.parse(fs.readFileSync(storeFile(), "utf8"));
    state.data = {
      version: FILE_VERSION,
      days: parsed?.days && typeof parsed.days === "object" ? parsed.days : {},
      links: parsed?.links ?? null,
    };
    state.persistence = "file";
  } catch (err) {
    state.data = emptyData();
    /* No file yet is the normal first start — it appears with the first
       visit. Anything else means the disk is not ours to rely on. */
    state.persistence = err?.code === "ENOENT" ? "file" : "memory";
    if (err?.code !== "ENOENT") {
      console.warn(
        `[insights] Zähler-Datei nicht lesbar (${err?.code ?? err}); Zahlen nur im Arbeitsspeicher.`,
      );
    }
  }
  return state.data;
}

function writeNow() {
  const file = storeFile();
  try {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    /* write-then-rename: a crash mid-write leaves the previous file intact */
    const tmp = `${file}.${process.pid}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify(state.data));
    fs.renameSync(tmp, file);
    state.persistence = "file";
  } catch (err) {
    state.persistence = "memory";
    if (!state.warned) {
      state.warned = true;
      console.warn(
        `[insights] Zähler-Datei nicht schreibbar (${err?.code ?? err}); Zahlen nur im Arbeitsspeicher.`,
      );
    }
  }
}

function flushSoon() {
  if (state.timer) return;
  state.timer = setTimeout(() => {
    state.timer = null;
    writeNow();
  }, FLUSH_DELAY);
  /* Never hold the process open for a visit counter. */
  state.timer.unref?.();
}

/** Write pending counts immediately. Used by the tests and by the link
    check, which is rare enough to deserve its own fsync. */
export function flush() {
  if (state.timer) {
    clearTimeout(state.timer);
    state.timer = null;
  }
  load();
  writeNow();
}

/** "file" when the counts survive a restart, "memory" when they do not. */
export function persistenceMode() {
  load();
  return state.persistence;
}

/** Empty the counters. Used by tests. */
export function reset() {
  state.data = emptyData();
  flush();
}

/* -------------------------------------------------------------- writing ---- */

/* One composite key per bucket rather than a map of maps: the file stays
   flat and diffable, and every read below splits it once. A "|" cannot
   occur in a locale, a page key or a wine slug. */
const composite = (key, locale) => `${key}|${LOCALES.includes(locale) ? locale : DEFAULT_LOCALE}`;

function bump(bucket, key, locale, now) {
  const data = load();
  const day = dayKey(now);
  data.days[day] ??= emptyDay();
  const map = data.days[day][bucket];
  const k = composite(key, locale);
  map[k] = (map[k] ?? 0) + 1;
  prune(data, day);
  flushSoon();
}

function prune(data, today) {
  const cutoff = shiftDay(today, -RETENTION_DAYS);
  for (const day of Object.keys(data.days)) {
    if (day < cutoff) delete data.days[day];
  }
}

export const recordPageview = ({ page, locale }, now = new Date()) =>
  bump("pageviews", page, locale, now);

export const recordShopClick = ({ key, locale }, now = new Date()) =>
  bump("shopClicks", key, locale, now);

export const recordInterviewRead = ({ slug, locale }, now = new Date()) =>
  bump("reads", slug, locale, now);

/* -------------------------------------------------------------- reading ---- */

/* Sum a bucket over a range of days into { byKey, byLocale, total }. */
function tally(data, bucket, days) {
  const byKey = {};
  const byLocale = {};
  let total = 0;

  for (const day of days) {
    const map = data.days[day]?.[bucket];
    if (!map) continue;
    for (const [composed, count] of Object.entries(map)) {
      const cut = composed.lastIndexOf("|");
      const key = cut === -1 ? composed : composed.slice(0, cut);
      const locale = cut === -1 ? DEFAULT_LOCALE : composed.slice(cut + 1);
      byKey[key] = (byKey[key] ?? 0) + count;
      byLocale[locale] = (byLocale[locale] ?? 0) + count;
      total += count;
    }
  }
  return { byKey, byLocale, total };
}

/** Per-day totals of one bucket — the sparkline under a headline number. */
function series(data, bucket, days) {
  return days.map((day) => {
    const map = data.days[day]?.[bucket];
    let sum = 0;
    if (map) for (const count of Object.values(map)) sum += count;
    return { day, count: sum };
  });
}

/**
 * Everything the overview reads, in one pass over the file.
 * @param {Object}  [opts]
 * @param {number}  [opts.days=7]  window length, today included
 * @param {Date}    [opts.now]
 */
export function summary({ days = 7, now = new Date() } = {}) {
  const data = load();
  const today = dayKey(now);
  const from = shiftDay(today, -(days - 1));
  const range = dayRange(from, today);

  /* The window before this one, same length — "12 % more than last week"
     is the only way a bare count says whether it is good news. */
  const prevTo = shiftDay(from, -1);
  const prev = dayRange(shiftDay(prevTo, -(days - 1)), prevTo);

  const pageviews = tally(data, "pageviews", range);
  const shopClicks = tally(data, "shopClicks", range);
  const reads = tally(data, "reads", range);

  return {
    from,
    to: today,
    days,
    pageviews: {
      ...pageviews,
      previous: tally(data, "pageviews", prev).total,
      series: series(data, "pageviews", range),
    },
    shopClicks: {
      ...shopClicks,
      previous: tally(data, "shopClicks", prev).total,
      series: series(data, "shopClicks", range),
    },
    reads: {
      ...reads,
      previous: tally(data, "reads", prev).total,
    },
    /* Whether anything has ever been counted — an empty overview means
       something different on day one than it does in week three. */
    firstDay: Object.keys(data.days).sort()[0] ?? null,
    persistence: state.persistence,
  };
}

/* ---------------------------------------------------------- link checks ---- */

/** The last result of the Terra Vera link check, or null. */
export function linkCheck() {
  return load().links;
}

export function saveLinkCheck(result) {
  const data = load();
  data.links = result;
  flush();
  return result;
}
