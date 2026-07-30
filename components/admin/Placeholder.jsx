"use client";
import { motion, useReducedMotion } from "motion/react";

/* Structural stand-in for sections whose functionality lands later. It states
   what belongs here rather than faking data, so nobody mistakes the shell for
   a working feature. */

export default function Placeholder({ icon: Icon, title, items = [] }) {
  const reduced = useReducedMotion();

  return (
    <div className="rounded-card-lg border border-charcoal/[0.08] bg-ivory/60 p-8 sm:p-11">
      <div className="flex items-center gap-4">
        {Icon && (
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-bordeaux to-wine text-ivory">
            <Icon className="h-[21px] w-[21px]" />
          </span>
        )}
        <div>
          <h3 className="font-playfair text-[19px] text-charcoal">{title}</h3>
          <p className="mt-0.5 text-[11.5px] uppercase tracking-[0.16em] text-bordeaux/55">
            In Vorbereitung
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
              className="group flex items-start gap-3 rounded-2xl border border-charcoal/[0.07] bg-cream/70 px-5 py-4 transition-colors duration-300 hover:border-champagne/50"
            >
              <span
                aria-hidden="true"
                className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-champagne transition-transform duration-500 ease-out-expo group-hover:scale-150"
              />
              <span className="text-[13px] leading-relaxed text-charcoal/70">{item}</span>
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  );
}
