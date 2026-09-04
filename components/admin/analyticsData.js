"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { bySlug } from "@/components/data";
import { INQUIRY_INTENTS } from "@/lib/inquiries/schema";
import { LOCALES, LOCALE_META } from "@/lib/i18n/config";
import { SHOP_GENERIC_KEYS } from "@/lib/insights/model";

/* Data layer of the Übersicht.
   ------------------------------------------------------------------
   This file used to hold invented sales figures — bottles sold, revenue by
   wine type, an order book — under a note that called them Beispieldaten.
   They described a shop this site does not run: since the hand-off,
   customers buy at Terra Vera, and revenue, orders and allocation are
   Terra Vera's numbers, not ours. A backoffice that shows a made-up figure
   next to a real one teaches the reader to trust neither.

   What replaced them is measured, and every number below can be traced to
   the request that produced it:

     Anfragen   the inbox the /kontakt form writes to      (lib/inquiries)
     Klicks     the pass-through every shop button takes   (/api/out/shop)
     Gelesen    articles read to the end                   (/api/beacon)
     Sprachen   page opens per language                    (/api/beacon)
     Inhalt     drafts, missing translations, dead links   (lib/insights)

   One request feeds all of them (/api/admin/overview): four cards
   describing one week must not be able to disagree about which week that
   is. The page owns the hook and hands each card its slice. */

const ENDPOINT = "/api/admin/overview";

/* Windows the desk can choose between. Seven days is the default because
   the question on a Monday is "what happened last week"; thirty smooths a
   quiet week out of the picture when judging a trend. */
export const WINDOWS = Object.freeze([7, 30, 90]);
export const DEFAULT_WINDOW = 7;

/** The whole overview, refetched when the window changes. */
export function useOverview({ days = DEFAULT_WINDOW } = {}) {
  const [data, setData] = useState(null);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checking, setChecking] = useState(false);
  const [tick, setTick] = useState(0);
  const abortRef = useRef(null);

  useEffect(() => {
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setLoading(true);

    fetch(`${ENDPOINT}?days=${days}`, { signal: ctrl.signal })
      .then(async (res) => {
        const body = await res.json().catch(() => null);
        if (!res.ok) throw new Error(body?.error ?? `Request failed (${res.status})`);
        setData(body?.data ?? null);
        setMeta(body?.meta ?? null);
        setError(null);
      })
      .catch((err) => {
        if (err.name !== "AbortError") setError(err);
      })
      .finally(() => {
        if (!ctrl.signal.aborted) setLoading(false);
      });

    return () => ctrl.abort();
  }, [days, tick]);

  const refetch = useCallback(() => setTick((t) => t + 1), []);

  /* The link check reaches a foreign server, so it is a button rather than
     something that happens while the page loads. Its result is merged in
     place — re-running the whole overview for it would throw away a window
     the reader has just chosen. */
  const checkLinks = useCallback(async () => {
    setChecking(true);
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "check-links" }),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) throw new Error(body?.error ?? `Request failed (${res.status})`);
      setData((prev) =>
        prev ? { ...prev, links: body.data.links, content: body.data.content } : prev,
      );
      setError(null);
      return body.data.links;
    } catch (err) {
      setError(err);
      return null;
    } finally {
      setChecking(false);
    }
  }, []);

  return { data, meta, loading, error, refetch, checkLinks, checking };
}

/* ------------------------------------------------------------ shaping ---- */

/* Every derivation below turns a bare tally into rows a card can render:
   sorted, named, and with a share of the largest so the meters compare
   against each other rather than against an invisible maximum. */

const withShare = (rows) => {
  const top = Math.max(0, ...rows.map((r) => r.count));
  return rows.map((r) => ({ ...r, share: top ? r.count / top : 0 }));
};

const GENERIC = new Set(SHOP_GENERIC_KEYS);

/**
 * Outbound clicks per target. Wines first and named; the two targets that
 * do not name a bottle (the collection page, the header's topseller button)
 * follow, flagged, because "somebody went to the shop front" is different
 * news from "somebody went to the Lugana".
 */
export function shopClickRows(traffic) {
  const byKey = traffic?.shopClicks?.byKey ?? {};
  const rows = Object.entries(byKey).map(([key, count]) => ({
    key,
    count,
    generic: GENERIC.has(key),
    name: bySlug(key)?.name ?? null,
    tone: bySlug(key)?.dot ?? "#7A6B63",
  }));

  return withShare(
    rows.sort((a, b) => Number(a.generic) - Number(b.generic) || b.count - a.count),
  );
}

/** Inquiries in the window, by Anliegen. Intents with none are kept: a zero
    is an answer ("no trade inquiries this week"), an absent row is not. */
export function intentRows(inquiries) {
  const byIntent = inquiries?.byIntent ?? {};
  return withShare(
    INQUIRY_INTENTS.map((intent) => ({ intent, count: byIntent[intent] ?? 0 })).sort(
      (a, b) => b.count - a.count,
    ),
  );
}

/** Page opens per language, strongest first. */
export function languageRows(traffic) {
  const byLocale = traffic?.pageviews?.byLocale ?? {};
  return withShare(
    LOCALES.map((locale) => ({
      locale,
      label: LOCALE_META[locale]?.native ?? locale,
      short: LOCALE_META[locale]?.short ?? locale.toUpperCase(),
      count: byLocale[locale] ?? 0,
    })).sort((a, b) => b.count - a.count),
  );
}

/** Interviews read to the end, joined with their titles from the content
    report so the card shows a person rather than a slug. */
export function readRows(traffic, interviews = []) {
  const byKey = traffic?.reads?.byKey ?? {};
  const titles = new Map(interviews.map((i) => [i.slug, i.title]));

  return withShare(
    Object.keys(byKey)
      .concat(interviews.map((i) => i.slug))
      .filter((slug, i, all) => all.indexOf(slug) === i)
      .map((slug) => ({ slug, title: titles.get(slug) ?? slug, count: byKey[slug] ?? 0 }))
      .sort((a, b) => b.count - a.count),
  );
}

/* ------------------------------------------------------------- trends ---- */

/**
 * Change against the window before this one, as a fraction. Returns null
 * where a percentage would lie: against a previous zero, any number at all
 * is "infinitely more", and the card says "neu" instead.
 */
export function trend(current, previous) {
  if (!Number.isFinite(current) || !Number.isFinite(previous)) return null;
  if (previous === 0) return null;
  return (current - previous) / previous;
}

/** Has anything ever been counted? Distinguishes a quiet week from a
    counter that started yesterday — the difference between "nobody came"
    and "we have not been looking yet". */
export function measuringSince(traffic) {
  return traffic?.firstDay ?? null;
}

/* --------------------------------------------------------------- dates ---- */

/** "3.9." — the compact axis label under a sparkline. */
export function shortDay(dayKey, intl) {
  const [y, m, d] = dayKey.split("-").map(Number);
  return new Intl.DateTimeFormat(intl, { day: "numeric", month: "numeric" }).format(
    new Date(Date.UTC(y, m - 1, d, 12)),
  );
}

/** A window as "27.8. – 3.9." for the card caption. */
export function windowLabel(window, intl) {
  if (!window?.from || !window?.to) return "";
  return `${shortDay(window.from, intl)} – ${shortDay(window.to, intl)}`;
}

/** Memo-friendly identity for the window selector. */
export function useWindow(initial = DEFAULT_WINDOW) {
  const [days, setDays] = useState(initial);
  return useMemo(() => ({ days, setDays }), [days]);
}
