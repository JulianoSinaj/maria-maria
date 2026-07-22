"use client";
import { Grapes } from "./Icons";
import { Reveal } from "./motion/Reveal";

/* thin champagne rule that fades at the ends */
export function GoldRule({ className = "" }) {
  return (
    <span
      className={`block h-px ${className}`}
      style={{ background: "linear-gradient(90deg,transparent,#C8B77A,transparent)" }}
    />
  );
}

/* small uppercase eyebrow with a grape mark — the editorial section opener */
export function Eyebrow({ children, className = "", light = false }) {
  return (
    <span
      className={`inline-flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.24em] ${
        light ? "text-champagne-light" : "text-champagne"
      } ${className}`}
    >
      <Grapes className="h-4 w-4" />
      {children}
    </span>
  );
}

/* animated section heading — eyebrow + serif display, left or centered */
export function SectionTitle({
  children,
  eyebrow,
  description,
  align = "center",
  mark = true,
  light = false,
  className = "",
}) {
  const centered = align === "center";
  return (
    <Reveal className={`${centered ? "text-center" : "text-left"} ${className}`}>
      {eyebrow ? (
        <Eyebrow light={light} className={centered ? "justify-center" : ""}>
          {eyebrow}
        </Eyebrow>
      ) : (
        mark && (
          <div className={`mb-3 flex ${centered ? "justify-center" : ""}`}>
            <Grapes className="h-6 w-6 text-champagne" />
          </div>
        )
      )}
      <h2
        className={`text-balance font-playfair text-[clamp(1.75rem,3.4vw,2.6rem)] leading-[1.12] ${
          light ? "text-ivory" : "text-charcoal"
        } ${eyebrow ? "mt-3" : ""}`}
      >
        {children}
      </h2>
      {description && (
        <p
          className={`mt-4 max-w-xl text-[13.5px] leading-relaxed ${
            light ? "text-ivory/70" : "text-charcoal/70"
          } ${centered ? "mx-auto" : ""}`}
        >
          {description}
        </p>
      )}
      {centered && (
        <div className="mt-5 flex items-center justify-center gap-4">
          <GoldRule className="w-16 sm:w-24" />
          <Grapes className="h-4 w-4 text-champagne/80" />
          <GoldRule className="w-16 sm:w-24" />
        </div>
      )}
    </Reveal>
  );
}

/* grape motif between two short gold lines (used under hero headings) */
export function GrapeRule({ className = "" }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="h-px w-16 bg-champagne/70" />
      <Grapes className="h-5 w-5 text-champagne" />
      <span className="h-px w-16 bg-champagne/70" />
    </div>
  );
}

/* circular icon chip — champagne tint, hairline ring, for feature icons */
export function IconChip({ children, className = "", size = "md" }) {
  const s = size === "lg" ? "h-16 w-16" : "h-14 w-14";
  return (
    <span
      className={`ring-hairline inline-flex ${s} items-center justify-center rounded-full bg-gradient-to-br from-cream to-champagne-light/40 text-bordeaux shadow-luxe ${className}`}
    >
      {children}
    </span>
  );
}
