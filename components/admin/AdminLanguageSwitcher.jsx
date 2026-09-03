"use client";
import { motion, useReducedMotion } from "motion/react";
import { ADMIN_LOCALES, ADMIN_LOCALE_META } from "./i18n/dictionary";
import { useAdminI18n } from "./i18n/AdminI18n";

/* Admin language switcher — DE / IT / EN.
   A segmented pill; the active highlight is one shared layoutId element that
   springs between the three options, the same motion grammar as the sidebar
   rail and the portfolio tabs. `tone` picks the palette: "light" for the
   cream header, "dark" for the espresso drawer. */

const SPRING = { type: "spring", stiffness: 380, damping: 32, mass: 0.7 };

export default function AdminLanguageSwitcher({ tone = "light", className = "" }) {
  const { locale, setLocale, t } = useAdminI18n();
  const reduced = useReducedMotion();
  const dark = tone === "dark";

  return (
    <div
      role="radiogroup"
      aria-label={t("language.choose")}
      className={`flex h-10 items-center gap-0.5 rounded-full border p-1 ${
        dark ? "border-ivory/20 bg-ivory/[0.04]" : "border-a-ink/12 bg-a-surface/60"
      } ${className}`}
    >
      {ADMIN_LOCALES.map((code) => {
        const active = code === locale;
        const meta = ADMIN_LOCALE_META[code];
        return (
          <motion.button
            key={code}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={meta.native}
            title={meta.native}
            lang={meta.html}
            onClick={() => setLocale(code)}
            whileTap={{ scale: 0.96 }}
            transition={SPRING}
            className={`relative h-8 min-w-[38px] rounded-full px-2.5 text-[10.5px] font-semibold uppercase tracking-[0.14em] outline-offset-2 transition-colors duration-300 ${
              active
                ? dark
                  ? "text-espresso"
                  : "text-ivory"
                : dark
                  ? "text-ivory/60 hover:text-champagne"
                  : "text-a-ink/55 hover:text-a-accent"
            }`}
          >
            {active && (
              <motion.span
                layoutId={`admin-lang-pill-${tone}`}
                aria-hidden="true"
                className={`absolute inset-0 rounded-full ${
                  dark ? "bg-champagne" : "bg-gradient-to-br from-a-fill to-a-fill-2"
                }`}
                transition={reduced ? { duration: 0 } : SPRING}
              />
            )}
            <span className="relative z-10">{meta.short}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
