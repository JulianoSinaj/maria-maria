"use client";
import { motion, useReducedMotion } from "motion/react";

/* Shared scaffold for every admin section: a lede row plus a staggered
   entrance for the content beneath it. Keeps section pages free of layout
   boilerplate so they only describe their own content. */

export default function PageShell({ title, lede, actions, children }) {
  const reduced = useReducedMotion();

  return (
    <div className="mx-auto w-full max-w-[1240px]">
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 140, damping: 22 }}
        className="flex flex-wrap items-end justify-between gap-5 border-b border-a-ink/[0.08] pb-7"
      >
        <div className="min-w-0 flex-1 basis-[34ch] md:max-w-[58ch]">
          <h2 className="font-playfair text-[26px] leading-tight text-a-ink sm:text-[31px]">
            {title}
          </h2>
          {lede && (
            <p className="mt-2.5 text-[13.5px] leading-relaxed text-a-ink/60">{lede}</p>
          )}
        </div>
        {actions && <div className="flex shrink-0 flex-wrap items-center gap-3">{actions}</div>}
      </motion.div>

      <motion.div
        initial={reduced ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 130, damping: 23, delay: reduced ? 0 : 0.08 }}
        className="pt-8"
      >
        {children}
      </motion.div>
    </div>
  );
}
