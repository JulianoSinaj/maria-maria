import { Grapes } from "./Icons";

/* thin champagne rule that fades at the ends */
export function GoldRule({ className = "" }) {
  return (
    <span
      className={`block h-px ${className}`}
      style={{ background: "linear-gradient(90deg,transparent,#C8B77A,transparent)" }}
    />
  );
}

/* centered section heading flanked by gold rules, with an optional grape mark above */
export function SectionTitle({ children, mark = true, className = "" }) {
  return (
    <div className={`text-center ${className}`}>
      {mark && (
        <div className="mb-3 flex justify-center">
          <Grapes className="h-6 w-6 text-champagne" />
        </div>
      )}
      <div className="flex items-center justify-center gap-5">
        <GoldRule className="w-16 sm:w-24" />
        <h2 className="whitespace-nowrap font-playfair text-[26px] text-charcoal md:text-[30px]">{children}</h2>
        <GoldRule className="w-16 sm:w-24" />
      </div>
    </div>
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
