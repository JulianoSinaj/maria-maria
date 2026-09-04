"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { splitParagraphs, joinParagraphs, splitLines } from "@/lib/interviews/schema";

/* The form vocabulary of the interview editor — one place for the input
   styles, the label/hint/error frame and the two text-area conventions the
   article model needs:

     paragraphs   one text area, a blank line separates paragraphs
     lines        one text area, one item per line

   Both keep their own text while typing and hand the parsed array up on
   every change, so a user can type a blank line without the field eating it
   on re-render. `resetKey` re-seeds the text when a different record loads. */

export const inputCls =
  "h-11 w-full rounded-xl border border-a-ink/12 bg-a-surface/70 px-3.5 text-[13px] text-a-ink transition-colors duration-300 placeholder:text-a-ink/30 focus:border-champagne focus:outline-none";

export const areaCls =
  "w-full rounded-xl border border-a-ink/12 bg-a-surface/70 px-3.5 py-2.5 text-[13px] leading-relaxed text-a-ink transition-colors duration-300 placeholder:text-a-ink/30 focus:border-champagne focus:outline-none";

export const legendCls =
  "text-[11px] font-semibold uppercase tracking-[0.14em] text-a-ink/55";

export const ghostBtn =
  "inline-flex h-9 items-center gap-1.5 rounded-full border border-a-ink/12 px-3.5 text-[11.5px] text-a-ink/65 transition-colors duration-300 hover:border-champagne hover:text-a-accent disabled:opacity-40";

export const dangerBtn =
  "inline-flex h-9 items-center gap-1.5 rounded-full border border-a-ink/12 px-3.5 text-[11.5px] text-a-ink/55 transition-colors duration-300 hover:border-a-accent/40 hover:bg-a-accent/10 hover:text-a-accent disabled:opacity-40";

export const primaryBtn =
  "inline-flex h-11 items-center gap-2 rounded-full bg-gradient-to-br from-a-fill to-a-fill-2 px-6 text-[12px] font-medium uppercase tracking-[0.14em] text-ivory transition-opacity disabled:opacity-50";

/* character counter that warns as the limit nears */
export function Count({ value = "", max }) {
  if (!max) return null;
  const n = (value ?? "").length;
  return (
    <span
      className={`text-[10px] tabular-nums ${
        n > max ? "text-a-accent" : n > max * 0.9 ? "text-a-accent/70" : "text-a-ink/35"
      }`}
    >
      {n}/{max}
    </span>
  );
}

export function Field({ label, hint, error, count, max, required, children, className = "" }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 flex items-baseline justify-between gap-2">
        <span className={legendCls}>
          {label}
          {required && (
            <span aria-hidden="true" className="ml-1 text-a-accent">
              *
            </span>
          )}
        </span>
        <span className="flex items-baseline gap-2">
          {hint && <span className="text-[10.5px] text-a-ink/35">{hint}</span>}
          {max != null && <Count value={count} max={max} />}
        </span>
      </span>
      {children}
      {error && <span className="mt-1 block text-[10.5px] text-a-accent">{error}</span>}
    </label>
  );
}

export function TextInput({ value, onChange, ...rest }) {
  return (
    <input
      className={inputCls}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      {...rest}
    />
  );
}

/* Auto-growing text area: the height follows the content so a long deck is
   never a scroll box inside a scroll box. */
export function TextArea({ value, onChange, rows = 3, ...rest }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight + 2}px`;
  }, [value]);
  return (
    <textarea
      ref={ref}
      className={`${areaCls} resize-none`}
      rows={rows}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      {...rest}
    />
  );
}

/** Array of paragraphs ⇄ one text area (blank line = new paragraph). */
export function ParagraphsArea({ value = [], onChange, resetKey, rows = 6, ...rest }) {
  const [text, setText] = useState(() => joinParagraphs(value));
  useEffect(() => {
    setText(joinParagraphs(value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);
  return (
    <TextArea
      value={text}
      rows={rows}
      onChange={(next) => {
        setText(next);
        onChange(splitParagraphs(next));
      }}
      {...rest}
    />
  );
}

/** Array of short items ⇄ one text area (one item per line). */
export function LinesArea({ value = [], onChange, resetKey, rows = 4, ...rest }) {
  const [text, setText] = useState(() => (Array.isArray(value) ? value.join("\n") : ""));
  useEffect(() => {
    setText(Array.isArray(value) ? value.join("\n") : "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);
  return (
    <TextArea
      value={text}
      rows={rows}
      onChange={(next) => {
        setText(next);
        onChange(splitLines(next));
      }}
      {...rest}
    />
  );
}

export function Select({ value, onChange, children, ...rest }) {
  return (
    <select className={inputCls} value={value ?? ""} onChange={(e) => onChange(e.target.value)} {...rest}>
      {children}
    </select>
  );
}

/* A collapsible group of fields. Open state is local; the heading row is a
   real button so it works from the keyboard. The chevron rotates, nothing
   else moves. */
export function Group({ title, hint, open: initialOpen = true, badge, children, actions }) {
  const [open, setOpen] = useState(initialOpen);
  return (
    <section className="rounded-2xl border border-a-ink/[0.08] bg-a-surface/50">
      <div className="flex items-center gap-3 px-4 py-3">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
        >
          <motion.span
            aria-hidden="true"
            animate={{ rotate: open ? 90 : 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-a-ink/12 text-[10px] text-a-ink/60"
          >
            ›
          </motion.span>
          <span className="min-w-0">
            <span className="block truncate font-playfair text-[16px] leading-tight text-a-ink">
              {title}
            </span>
            {hint && <span className="mt-0.5 block text-[11px] text-a-ink/45">{hint}</span>}
          </span>
          {badge && (
            <span className="ml-auto shrink-0 rounded-full bg-a-ink/[0.06] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-a-ink/50">
              {badge}
            </span>
          )}
        </button>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </div>
      {open && <div className="space-y-4 border-t border-a-ink/[0.06] px-4 pb-5 pt-4">{children}</div>}
    </section>
  );
}

/* On/off for the optional chapters (serving, outro, FAQ) */
export function Toggle({ on, onChange, label }) {
  return (
    <button type="button" role="switch" aria-checked={on} onClick={() => onChange(!on)} className="flex items-center gap-2.5">
      <span className={`relative h-6 w-10 shrink-0 rounded-full transition-colors duration-300 ${on ? "bg-a-fill" : "bg-a-ink/15"}`}>
        <motion.span
          className="absolute top-0.5 h-5 w-5 rounded-full bg-ivory shadow-chip"
          animate={{ left: on ? 18 : 2 }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
        />
      </span>
      {label && <span className="text-[12px] text-a-ink/70">{label}</span>}
    </button>
  );
}
