"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Bell } from "./AdminIcons";
import { useAdminI18n } from "./i18n/AdminI18n";
import { relativeTime } from "./anfragen/shared";

/* The bell — what is waiting for a decision right now.

   Everything in the panel is derived on the server from the two stores
   (app/api/admin/notifications/route.js): unanswered inquiries, wines that
   ran out or are running low, unpublished drafts, and — first, when it
   happens — the warning that the inbox could not be written to disk. The
   route sends `kind` + `params`; the wording lives in the admin dictionary,
   so the panel speaks the language the rest of the backoffice speaks.

   "Read" is personal to a browser, so it is kept there: the ids are stable
   and content-derived, localStorage remembers which ones have been seen, and
   the dot only burns while something unseen is in the list. Opening the panel
   marks what it shows. A notice disappears on its own when the situation it
   reports is dealt with — nothing has to be dismissed by hand.

   The list is refreshed on mount, whenever the section changes, when the
   window is focused again, and every 90 seconds while the tab is visible —
   often enough for a desk, quiet enough not to poll a server for nothing. */

const PANEL_SPRING = { type: "spring", stiffness: 420, damping: 34, mass: 0.7 };
const POLL_MS = 90_000;
const STORAGE_KEY = "mm-admin-notifications-seen";

/* Ids of notices that are gone are dropped on write, so the list cannot grow
   forever; the cap is a belt-and-braces guard for a very busy inbox. */
const SEEN_CAP = 200;

const TONE_DOT = {
  alert: "bg-a-accent",
  action: "bg-a-accent/70",
  warn: "bg-champagne",
  info: "bg-a-ink/25",
};

function readSeen() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    /* private mode, disabled storage, or something else in the slot —
       everything simply counts as unseen */
    return new Set();
  }
}

function writeSeen(ids) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids.slice(-SEEN_CAP)));
  } catch {
    /* non-fatal: the dot then reappears on the next visit */
  }
}

export default function AdminNotifications({ className = "" }) {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const { t, tm, intl, fmtNum } = useAdminI18n();

  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  /* null until the first read after mount — reading localStorage during
     render would make the server and the client disagree about the dot */
  const [seen, setSeen] = useState(null);

  const rootRef = useRef(null);
  const buttonRef = useRef(null);
  const panelRef = useRef(null);

  const load = useCallback((signal) => {
    fetch("/api/admin/notifications", { signal, headers: { Accept: "application/json" } })
      .then(async (res) => {
        const body = await res.json().catch(() => null);
        if (!res.ok) throw new Error(body?.error ?? `Request failed (${res.status})`);
        return body?.data ?? null;
      })
      .then((data) => {
        setItems(data?.items ?? []);
        setError(null);
      })
      .catch((err) => {
        if (err.name !== "AbortError") setError(err);
      });
  }, []);

  useEffect(() => setSeen(readSeen()), []);

  /* mount + every section change: acting on something is the most likely
     reason for the list to have changed */
  useEffect(() => {
    const ctrl = new AbortController();
    load(ctrl.signal);
    return () => ctrl.abort();
  }, [load, pathname]);

  useEffect(() => {
    let ctrl = null;
    const refresh = () => {
      if (document.visibilityState !== "visible") return;
      ctrl?.abort();
      ctrl = new AbortController();
      load(ctrl.signal);
    };
    const timer = window.setInterval(refresh, POLL_MS);
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
      ctrl?.abort();
    };
  }, [load]);

  const unseen = useMemo(
    () => (seen ? items.filter((i) => !seen.has(i.id)).length : 0),
    [items, seen],
  );

  /* Opening is the acknowledgement. Only what is on screen is marked — a
     notice that arrives while the panel is open still lights the dot after. */
  const markSeen = useCallback(() => {
    const ids = items.map((i) => i.id);
    setSeen(new Set(ids));
    writeSeen(ids);
  }, [items]);

  const toggle = () => {
    setOpen((wasOpen) => {
      if (!wasOpen) markSeen();
      return !wasOpen;
    });
  };

  const close = useCallback(
    ({ restoreFocus = false } = {}) => {
      setOpen(false);
      if (restoreFocus) buttonRef.current?.focus();
    },
    [],
  );

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") close({ restoreFocus: true });
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  /* Translate one notice. Enum values (an inquiry's intent) go through tm()
     exactly as they do in the tables; numbers follow the admin language. */
  const wording = (item) => {
    const params = item.params ?? {};
    const vars = { ...params };
    if (params.intent) vars.intent = tm("inquiryIntent", params.intent);
    if (typeof params.remaining === "number") vars.remaining = fmtNum(params.remaining);
    return {
      title: t(`notifications.kinds.${item.kind}.title`, vars),
      body: t(`notifications.kinds.${item.kind}.body`, vars),
    };
  };

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <motion.button
        ref={buttonRef}
        type="button"
        onClick={toggle}
        whileTap={{ scale: 0.94 }}
        transition={{ type: "spring", stiffness: 400, damping: 22 }}
        aria-label={
          unseen > 0
            ? t("notifications.ariaUnread", { n: unseen })
            : t("header.notifications")
        }
        aria-expanded={open}
        aria-haspopup="dialog"
        className={`relative flex h-10 w-10 items-center justify-center rounded-xl border transition-colors duration-300 ${
          open
            ? "border-champagne text-a-accent"
            : "border-a-ink/12 text-a-ink/70 hover:border-champagne hover:text-a-accent"
        }`}
      >
        <Bell className="h-[18px] w-[18px]" />
        {/* the dot is the whole point of the bell: it burns only while
            something in the list has not been looked at */}
        <AnimatePresence>
          {unseen > 0 && (
            <motion.span
              key="dot"
              aria-hidden="true"
              initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.4 }}
              transition={{ type: "spring", stiffness: 500, damping: 24 }}
              className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-a-fill ring-2 ring-a-canvas"
            />
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-label={t("header.notifications")}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.99 }}
            transition={reduced ? { duration: 0.12 } : PANEL_SPRING}
            style={{ transformOrigin: "top right" }}
            className="absolute right-0 top-[calc(100%+10px)] z-50 max-h-[min(70vh,520px)] w-[min(380px,calc(100vw-2rem))] overflow-y-auto overscroll-contain rounded-card border border-a-ink/10 bg-a-canvas/95 p-2 shadow-glass backdrop-blur-xl"
          >
            <p className="px-3 pb-1 pt-2 text-[9.5px] font-semibold uppercase tracking-[0.2em] text-a-accent/55">
              {t("header.notifications")}
            </p>

            {error && (
              <p role="alert" className="px-3 py-4 text-[12px] text-a-accent">
                {t("notifications.error", { message: error.message })}
              </p>
            )}

            {!error && items.length === 0 && (
              <div className="px-3 py-6 text-center">
                <p className="font-playfair text-[16px] text-a-ink">{t("notifications.empty")}</p>
                <p className="mx-auto mt-1.5 max-w-[30ch] text-[11.5px] leading-relaxed text-a-ink/50">
                  {t("notifications.emptyHint")}
                </p>
              </div>
            )}

            <ul>
              {items.map((item, i) => {
                const { title, body } = wording(item);
                const row = (
                  <>
                    <span className="flex items-baseline gap-2">
                      <span
                        aria-hidden="true"
                        className={`mt-[6px] h-1.5 w-1.5 shrink-0 self-start rounded-full ${
                          TONE_DOT[item.tone] ?? TONE_DOT.info
                        }`}
                      />
                      <span className="min-w-0 flex-1 truncate text-[12.5px] font-medium text-a-ink">
                        {title}
                      </span>
                      {item.at && (
                        <span className="shrink-0 text-[10px] tabular-nums text-a-ink/40">
                          {relativeTime(item.at, intl)}
                        </span>
                      )}
                    </span>
                    {body && (
                      <span className="mt-0.5 block pl-3.5 text-[11px] leading-relaxed text-a-ink/50">
                        {body}
                      </span>
                    )}
                  </>
                );

                return (
                  <motion.li
                    key={item.id}
                    initial={reduced ? false : { opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 320,
                      damping: 30,
                      delay: reduced ? 0 : Math.min(i, 6) * 0.03,
                    }}
                  >
                    {item.href ? (
                      <Link
                        href={item.href}
                        prefetch={false}
                        onClick={() => close()}
                        className="block rounded-xl px-3 py-2.5 transition-colors duration-200 hover:bg-a-ink/[0.04]"
                      >
                        {row}
                      </Link>
                    ) : (
                      <div className="block rounded-xl px-3 py-2.5">{row}</div>
                    )}
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
