"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Search, ExternalLink } from "./AdminIcons";
import { useAdminI18n } from "./i18n/AdminI18n";

/* The header search — one box over wines, inquiries, FAQ entries and
   interviews (see app/api/admin/search/route.js for what is indexed).

   It is a combobox, not a page: results drop under the input and a keystroke
   takes you to the record. ↑/↓ walk the list across group borders, Enter
   opens, Escape steps back out (panel first, then the query), ⌘K / Ctrl-K
   reaches it from anywhere in the backoffice.

   Results that live in the backoffice navigate; FAQ answers and interviews
   have no editor yet and open the storefront page they appear on, in a new
   tab, marked with the outward arrow so the jump is never a surprise.

   The panel is absolutely positioned and the input never changes width while
   it is open: nothing under the header moves when a search runs. */

const PANEL_SPRING = { type: "spring", stiffness: 420, damping: 34, mass: 0.7 };
const DEBOUNCE_MS = 220;

/* Kept in step with MIN_QUERY in the route — the hint has to describe the
   same threshold the server applies. */
const MIN_QUERY = 2;

export default function AdminSearch({ className = "" }) {
  const router = useRouter();
  const reduced = useReducedMotion();
  const { t, tm, locale } = useAdminI18n();

  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  /* Which key the hint names. Starts on the Ctrl form so server and client
     render the same thing, and switches after mount on a Mac — the chip is
     decorative, so nobody sees the correction. */
  const [mac, setMac] = useState(false);

  const rootRef = useRef(null);
  const inputRef = useRef(null);
  const abortRef = useRef(null);

  useEffect(() => {
    setMac(/mac|iphone|ipad/i.test(window.navigator.platform || window.navigator.userAgent));
  }, []);

  /* one round trip per pause in typing, not one per keystroke */
  useEffect(() => {
    const h = window.setTimeout(() => setDebounced(query), DEBOUNCE_MS);
    return () => window.clearTimeout(h);
  }, [query]);

  /* An AbortController per request: a fast typist must not have an older,
     slower answer land on top of a newer one. */
  useEffect(() => {
    const term = debounced.trim();
    abortRef.current?.abort();

    if (term.length < MIN_QUERY) {
      setResult(null);
      setError(null);
      setLoading(false);
      return undefined;
    }

    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setLoading(true);

    fetch(`/api/admin/search?q=${encodeURIComponent(term)}&locale=${locale}`, {
      signal: ctrl.signal,
      headers: { Accept: "application/json" },
    })
      .then(async (res) => {
        const body = await res.json().catch(() => null);
        if (!res.ok) throw new Error(body?.error ?? `Request failed (${res.status})`);
        return body?.data ?? null;
      })
      .then((data) => {
        setResult(data);
        setError(null);
        setActive(0);
      })
      .catch((err) => {
        if (err.name !== "AbortError") setError(err);
      })
      .finally(() => {
        if (!ctrl.signal.aborted) setLoading(false);
      });

    return () => ctrl.abort();
  }, [debounced, locale]);

  /* The flat order the keyboard walks — groups are a visual grouping, the
     list underneath them is one sequence. */
  const groups = result?.groups ?? [];
  const flat = useMemo(() => groups.flatMap((g) => g.items), [groups]);

  const close = useCallback(() => setOpen(false), []);

  const go = useCallback(
    (item) => {
      if (!item) return;
      close();
      if (item.external) {
        window.open(item.href, "_blank", "noopener,noreferrer");
        return;
      }
      inputRef.current?.blur();
      router.push(item.href);
    },
    [close, router],
  );

  /* ⌘K / Ctrl-K from anywhere in the backoffice. Registered on the document
     because the point is to reach the box without pointing at it. */
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
        setOpen(true);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  /* A click anywhere else puts the panel away — but only a click that starts
     outside, so a drag that selects text inside a result keeps it open. */
  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  const onKeyDown = (e) => {
    if (e.key === "Escape") {
      /* one step at a time: the panel, then the query itself */
      if (open) setOpen(false);
      else if (query) setQuery("");
      else inputRef.current?.blur();
      return;
    }
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      if (!flat.length) return;
      e.preventDefault();
      setOpen(true);
      setActive((i) => {
        const next = e.key === "ArrowDown" ? i + 1 : i - 1;
        return (next + flat.length) % flat.length;
      });
      return;
    }
    if (e.key === "Enter") {
      if (!open || !flat.length) return;
      e.preventDefault();
      go(flat[active]);
    }
  };

  const term = debounced.trim();
  const showPanel = open && term.length >= MIN_QUERY;
  const empty = Boolean(result) && !loading && flat.length === 0;

  /* running index across the groups, so ↑/↓ and the mouse agree on which row
     is which */
  let cursor = -1;

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <label className="relative block">
        <span className="sr-only">{t("header.searchSr")}</span>
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-a-ink/35" />
        <input
          ref={inputRef}
          type="search"
          role="combobox"
          aria-expanded={showPanel}
          aria-controls="admin-search-results"
          aria-autocomplete="list"
          aria-activedescendant={showPanel && flat[active] ? `admin-search-${active}` : undefined}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder={t("header.searchPlaceholder")}
          /* the width no longer grows on focus: with a panel underneath, a
             box that resizes as you type drags the whole header with it */
          className="h-10 w-[190px] rounded-full border border-a-ink/12 bg-a-surface/70 pl-10 pr-12 text-[12.5px] text-a-ink transition-colors duration-300 placeholder:text-a-ink/35 focus:border-champagne focus:outline-none xl:w-[240px]"
        />
        {/* the shortcut, shown only while the box is idle */}
        {!query && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-a-ink/12 px-1.5 py-0.5 text-[9.5px] font-semibold tracking-[0.08em] text-a-ink/35"
          >
            {mac ? t("search.shortcutMac") : t("search.shortcut")}
          </span>
        )}
      </label>

      <AnimatePresence>
        {showPanel && (
          <motion.div
            id="admin-search-results"
            role="listbox"
            aria-label={t("header.searchSr")}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.99 }}
            transition={reduced ? { duration: 0.12 } : PANEL_SPRING}
            style={{ transformOrigin: "top right" }}
            className="absolute right-0 top-[calc(100%+10px)] z-50 max-h-[min(70vh,540px)] w-[min(440px,calc(100vw-2rem))] overflow-y-auto overscroll-contain rounded-card border border-a-ink/10 bg-a-canvas/95 p-2 shadow-glass backdrop-blur-xl"
          >
            {error && (
              <p role="alert" className="px-3 py-4 text-[12px] text-a-accent">
                {t("search.error", { message: error.message })}
              </p>
            )}

            {!error && empty && (
              <div className="px-3 py-6 text-center">
                <p className="font-playfair text-[16px] text-a-ink">
                  {t("search.empty", { query: term })}
                </p>
                <p className="mx-auto mt-1.5 max-w-[34ch] text-[11.5px] leading-relaxed text-a-ink/50">
                  {t("search.emptyHint")}
                </p>
              </div>
            )}

            {!error &&
              groups.map((group) => (
                <div key={group.key} className="mb-1.5 last:mb-0">
                  <p className="px-3 pb-1 pt-2 text-[9.5px] font-semibold uppercase tracking-[0.2em] text-a-accent/55">
                    {t(`search.groups.${group.key}`)}
                  </p>

                  <ul>
                    {group.items.map((item) => {
                      cursor += 1;
                      const index = cursor;
                      return (
                        <Row
                          key={item.id}
                          item={item}
                          index={index}
                          activeRow={index === active}
                          onHover={() => setActive(index)}
                          onPick={close}
                          t={t}
                          tm={tm}
                        />
                      );
                    })}
                  </ul>

                  {group.more > 0 && (
                    <p className="px-3 pb-1 pt-1 text-[10.5px] text-a-ink/40">
                      {t("search.more", { n: group.more })}
                    </p>
                  )}
                </div>
              ))}

            {loading && (
              <p className="px-3 py-2 text-[11px] text-a-ink/40">{t("search.loading")}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* One result. A real link, so the mouse gets the browser's own behaviour
   (middle-click, "open in new tab") and the click handler only has to put
   the panel away — the keyboard path goes through go() instead. External
   targets open beside the backoffice, never in place: an editor who lands
   on the storefront would lose the search they were in the middle of. */
function Row({ item, index, activeRow, onHover, onPick, t, tm }) {
  const badge = item.badge ? tm(item.badge.group, item.badge.value) : null;
  const faqGroup = item.groupKey ? t(`search.faqGroups.${item.groupKey}`) : item.groupName;

  const body = (
    <>
      <span className="flex min-w-0 items-baseline gap-2">
        <span className="truncate text-[12.5px] font-medium text-a-ink">{item.title}</span>
        {item.meta && (
          <span className="shrink-0 text-[10.5px] tabular-nums text-a-ink/40">{item.meta}</span>
        )}
        {item.external && (
          <ExternalLink
            aria-hidden="true"
            className="ml-auto h-3.5 w-3.5 shrink-0 self-center text-a-ink/30"
          />
        )}
      </span>

      {(item.subtitle || badge || faqGroup) && (
        <span className="mt-0.5 flex min-w-0 items-center gap-2">
          {badge && (
            <span className="shrink-0 rounded-full bg-a-ink/[0.06] px-2 py-0.5 text-[9.5px] uppercase tracking-[0.1em] text-a-ink/55">
              {badge}
            </span>
          )}
          {faqGroup && (
            <span className="shrink-0 text-[10.5px] text-a-accent/60">{faqGroup}</span>
          )}
          {item.subtitle && (
            <span className="truncate text-[11px] leading-relaxed text-a-ink/50">
              {item.subtitle}
            </span>
          )}
        </span>
      )}
    </>
  );

  const className = `flex flex-col rounded-xl px-3 py-2.5 outline-none transition-colors duration-200 ${
    activeRow ? "bg-a-accent/[0.08]" : "hover:bg-a-ink/[0.04]"
  }`;

  return (
    <li role="option" id={`admin-search-${index}`} aria-selected={activeRow}>
      {item.external ? (
        <a
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          title={t("search.openExternal")}
          onMouseEnter={onHover}
          onClick={onPick}
          className={className}
        >
          {body}
        </a>
      ) : (
        <Link
          href={item.href}
          prefetch={false}
          onMouseEnter={onHover}
          onClick={onPick}
          className={className}
        >
          {body}
        </Link>
      )}
    </li>
  );
}
