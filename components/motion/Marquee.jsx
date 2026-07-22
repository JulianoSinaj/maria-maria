import { Grapes } from "../Icons";

/* Slow editorial ticker — content duplicated for a seamless CSS loop.
   Reduced-motion users get a static (effectively frozen) strip via globals. */

export default function Marquee({ items = [], className = "" }) {
  const row = (hidden) => (
    <div aria-hidden={hidden || undefined} className="flex w-max shrink-0 items-center">
      {items.map((item, i) => (
        <span key={`${item}-${i}`} className="flex items-center">
          <span className="whitespace-nowrap px-8 font-playfair text-[15px] italic tracking-wide text-charcoal/55 md:px-12 md:text-[17px]">
            {item}
          </span>
          <Grapes className="h-4 w-4 shrink-0 text-champagne/80" />
        </span>
      ))}
    </div>
  );

  return (
    <div className={`relative overflow-hidden py-5 ${className}`}>
      <div className="flex w-max animate-marquee will-transform">
        {row(false)}
        {row(true)}
      </div>
      {/* soft edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-ivory to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-ivory to-transparent" />
    </div>
  );
}
