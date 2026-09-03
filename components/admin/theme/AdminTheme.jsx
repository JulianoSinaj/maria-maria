"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

/* Admin-only colour-scheme context — light / dark / auto.
   ------------------------------------------------------------------
   Lives entirely inside /admin: the storefront keeps its fixed ivory palette
   and never sees this. The choice is a personal editor preference, stored in
   a cookie scoped to /admin (so the server layout can paint the right scheme
   on the very first render) and mirrored to localStorage.

   "auto" follows the device: the <html> element carries no attribute and the
   `prefers-color-scheme` media query in admin.css decides — so an OS switch
   at dusk re-skins the backoffice without a reload. `resolved` is what is
   actually on screen right now and is only used for UI (theme-color meta,
   the colour-scheme hint for native form controls). */

import { ADMIN_THEME_COOKIE, ADMIN_THEME_MODES, ADMIN_DEFAULT_THEME, isAdminTheme } from "./config";

/* re-exported for client callers; the server layout imports from ./config */
export { ADMIN_THEME_COOKIE, ADMIN_THEME_MODES, ADMIN_DEFAULT_THEME, isAdminTheme };

const STORAGE_KEY = "mm-admin-theme";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

const THEME_COLOR = { light: "#FBF9F4", dark: "#141110" };
const MQ = "(prefers-color-scheme: dark)";

const AdminThemeContext = createContext(null);

export function AdminThemeProvider({ initialMode, children }) {
  const [mode, setModeState] = useState(
    isAdminTheme(initialMode) ? initialMode : ADMIN_DEFAULT_THEME,
  );
  /* the server cannot know the device scheme — start from "light" and correct
     after mount; the CSS media query has already painted the right colours */
  const [system, setSystem] = useState("light");

  /* cookie absent (first visit / blocked) but localStorage remembers */
  useEffect(() => {
    if (isAdminTheme(initialMode)) return;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (isAdminTheme(stored)) setModeState(stored);
    } catch {
      /* storage disabled — stay on auto */
    }
  }, [initialMode]);

  /* track the device scheme so "auto" resolves live */
  useEffect(() => {
    if (!window.matchMedia) return undefined;
    const mq = window.matchMedia(MQ);
    const sync = () => setSystem(mq.matches ? "dark" : "light");
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const resolved = mode === "auto" ? system : mode;

  /* stamp <html>: explicit choice → attribute; auto → no attribute, CSS decides */
  useEffect(() => {
    const root = document.documentElement;
    if (mode === "auto") delete root.dataset.adminTheme;
    else root.dataset.adminTheme = mode;
    root.style.colorScheme = resolved;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", THEME_COLOR[resolved]);
  }, [mode, resolved]);

  const setMode = useCallback((next) => {
    if (!isAdminTheme(next)) return;
    setModeState(next);
    try {
      document.cookie = `${ADMIN_THEME_COOKIE}=${next}; path=/admin; max-age=${COOKIE_MAX_AGE}; samesite=lax`;
    } catch {
      /* non-fatal */
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* non-fatal */
    }
  }, []);

  const value = useMemo(() => ({ mode, resolved, setMode }), [mode, resolved, setMode]);

  return <AdminThemeContext.Provider value={value}>{children}</AdminThemeContext.Provider>;
}

const FALLBACK = { mode: "auto", resolved: "light", setMode: () => {} };

export function useAdminTheme() {
  return useContext(AdminThemeContext) ?? FALLBACK;
}
