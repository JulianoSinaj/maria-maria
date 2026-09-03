/* Admin colour-scheme constants — a plain module without "use client" so the
   server root layout can import them: helpers exported from a client module
   arrive in server components as client-reference proxies, not callable
   functions (same reason ADMIN_LOCALE_COOKIE lives in i18n/dictionary.js). */

export const ADMIN_THEME_COOKIE = "mm-admin-theme";
export const ADMIN_THEME_MODES = ["light", "dark", "auto"];
export const ADMIN_DEFAULT_THEME = "auto";
export const isAdminTheme = (v) => ADMIN_THEME_MODES.includes(v);
