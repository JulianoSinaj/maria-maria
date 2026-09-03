"use client";
import { motion, useReducedMotion } from "motion/react";
import { useAdminI18n } from "./i18n/AdminI18n";

/* Structural stand-in for sections whose functionality lands later. It states
   what belongs here rather than faking data, so nobody mistakes the shell for
   a working feature. */

export default function Placeholder({ icon: Icon, title, items = [] }) {
  const reduced = useReducedMotion();
  const { t } = useAdminI18n();

  return (
    <div className="rounded-card-lg border border-a-ink/[0.08] bg-a-surface/60 p-8 sm:p-11">
      <div className="flex items-center gap-4">
        {Icon && (
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-a-fill to-a-fill-2 text-ivory">
            <Icon className="h-[21px] w-[21px]" />
          </span>
        )}
        <div>
          <h3 className="font-playfair text-[19px] text-a-ink">{title}</h3>
          <p className="mt-0.5 text-[11.5px] uppercase tracking-[0.16em] text-a-accent/55">
            {t("common.inPreparation")}
          </p>
        </div>
      </div>

      {items.length > 0 && (
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {items.map((item, i) => (
            <motion.li
              key={item}
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 180,
                damping: 24,
                delay: reduced ? 0 : i * 0.05,
              }}
              className="group flex items-start gap-3 rounded-2xl border border-a-ink/[0.07] bg-a-canvas/70 px-5 py-4 transition-colors duration-300 hover:border-champagne/50"
            >
              <span
                aria-hidden="true"
                className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-champagne transition-transform duration-500 ease-out-expo group-hover:scale-150"
              />
              <span className="text-[13px] leading-relaxed text-a-ink/70">{item}</span>
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  );
}
