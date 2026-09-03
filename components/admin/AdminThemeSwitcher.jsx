"use client";
import { motion, useReducedMotion } from "motion/react";
import { Sun, Moon, Auto } from "./AdminIcons";
import { ADMIN_THEME_MODES, useAdminTheme } from "./theme/AdminTheme";
import { useAdminI18n } from "./i18n/AdminI18n";

/* Admin colour-scheme switcher — light / dark / auto.
   Same segmented pill as the language switcher: one shared layoutId highlight
   springs between the three glyphs. `tone` picks the palette: "light" for the
   header, "dark" for the espresso drawer. */

const SPRING = { type: "spring", stiffness: 380, damping: 32, mass: 0.7 };
const GLYPH = { light: Sun, dark: Moon, auto: Auto };

export default function AdminThemeSwitcher({ tone = "light", className = "" }) {
  const { mode, setMode } = useAdminTheme();
  const { t } = useAdminI18n();
  const reduced = useReducedMotion();
  const dark = tone === "dark";

  return (
    <div
      role="radiogroup"
      aria-label={t("theme.choose")}
      className={`flex h-10 items-center gap-0.5 rounded-full border p-1 ${
        dark ? "border-ivory/20 bg-ivory/[0.04]" : "border-a-ink/12 bg-a-surface/60"
      } ${className}`}
    >
      {ADMIN_THEME_MODES.map((key) => {
        const active = key === mode;
        const Glyph = GLYPH[key];
        const label = t(`theme.${key}`);
        return (
          <motion.button
            key={key}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={label}
            title={label}
            onClick={() => setMode(key)}
            whileTap={{ scale: 0.96 }}
            transition={SPRING}
            className={`relative grid h-8 w-8 place-items-center rounded-full outline-offset-2 transition-colors duration-300 ${
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
                layoutId={`admin-theme-pill-${tone}`}
                aria-hidden="true"
                className={`absolute inset-0 rounded-full ${
                  dark ? "bg-champagne" : "bg-gradient-to-br from-a-fill to-a-fill-2"
                }`}
                transition={reduced ? { duration: 0 } : SPRING}
              />
            )}
            <Glyph className="relative z-10 h-[15px] w-[15px]" />
          </motion.button>
        );
      })}
    </div>
  );
}
