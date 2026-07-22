"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Reveal, Stagger, StaggerItem } from "./motion/Reveal";
import Magnetic from "./motion/Magnetic";
import Button from "./ui/Button";
import { GoldRule } from "./Deco";
import { Instagram, Facebook, Mail, Arrow, Check, Grapes } from "./Icons";

const EXPLORE = [
  { label: "Unsere Weine", href: "/weine" },
  { label: "Regionen Italiens", href: "/regionen" },
  { label: "Magazin", href: "/magazin" },
  { label: "Kontakt", href: "/kontakt" },
];

const SOCIALS = [
  { label: "Instagram", href: "#", Icon: Instagram },
  { label: "Facebook", href: "#", Icon: Facebook },
  { label: "E-Mail", href: "mailto:info@maria-maria.wine", Icon: Mail },
];

export default function Footer() {
  const [sent, setSent] = useState(false);
  // deterministic for SSR/hydration, corrected to the visitor's year after mount
  const [year, setYear] = useState(2026);
  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="grain relative mt-24 overflow-hidden rounded-t-[2.5rem] bg-espresso text-ivory">
      {/* giant serif watermark */}
      <p
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-[2vw] left-1/2 w-max -translate-x-1/2 whitespace-nowrap font-playfair text-[13vw] italic leading-none text-ivory/[0.045]"
      >
        Il piacere del vino
      </p>

      <div className="relative mx-auto max-w-content px-6 pb-12 pt-16 lg:px-10">
        {/* newsletter band */}
        <Reveal className="mx-auto max-w-2xl text-center">
          <Grapes className="mx-auto h-7 w-7 text-champagne" />
          <h3 className="mt-4 text-balance font-playfair text-[clamp(1.6rem,3vw,2.2rem)] leading-tight">
            Geschichten aus Italien, <span className="italic text-champagne">direkt ins Postfach</span>
          </h3>
          <p className="mx-auto mt-3 max-w-md text-[13px] leading-relaxed text-ivory/65">
            Neuigkeiten, exklusive Angebote und Genussmomente — etwa einmal im Monat, ohne Lärm.
          </p>
          {sent ? (
            <p
              className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full border border-champagne/40 bg-champagne/10 px-5 py-3 text-[13px] text-champagne"
              role="status"
            >
              <Check className="h-4 w-4" /> Danke! Bitte bestätigen Sie Ihre Anmeldung im Posteingang.
            </p>
          ) : (
            <form
              className="mx-auto mt-6 flex max-w-md items-center gap-1.5 rounded-full border border-ivory/15 bg-white/[0.06] p-1.5 backdrop-blur-sm transition-colors focus-within:border-champagne/60"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              <label htmlFor="footer-newsletter" className="sr-only">
                E-Mail-Adresse
              </label>
              <input
                id="footer-newsletter"
                type="email"
                required
                autoComplete="email"
                placeholder="E-Mail-Adresse eingeben"
                className="h-11 min-w-0 flex-1 bg-transparent px-4 text-[13px] text-ivory outline-none placeholder:text-ivory/40"
              />
              <Magnetic strength={0.2}>
                <Button type="submit" magnetic={false} className="shrink-0">
                  Anmelden
                </Button>
              </Magnetic>
            </form>
          )}
        </Reveal>

        <GoldRule className="mt-14 w-full opacity-40" />

        {/* columns */}
        <Stagger className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4" gap={0.07}>
          <StaggerItem>
            <p className="font-playfair text-[24px] leading-none">
              Maria <span className="italic text-champagne">Maria</span>
            </p>
            <p className="mt-4 max-w-[230px] text-[12.5px] leading-relaxed text-ivory/60">
              Italienische Boutique-Weine für bewusst gewählte Genussmomente.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {SOCIALS.map(({ label, href, Icon }) => (
                <Magnetic key={label} strength={0.3}>
                  <a
                    href={href}
                    aria-label={label}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-ivory/15 text-ivory/75 transition-colors duration-300 hover:border-champagne hover:text-champagne"
                  >
                    <Icon className="h-[18px] w-[18px]" />
                  </a>
                </Magnetic>
              ))}
            </div>
          </StaggerItem>

          <StaggerItem>
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-champagne">Entdecken</h4>
            <ul className="mt-5 space-y-3">
              {EXPLORE.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="group inline-flex items-center gap-2 text-[13px] text-ivory/75 transition-colors hover:text-ivory"
                  >
                    <span className="h-px w-4 origin-left scale-x-0 bg-champagne transition-transform duration-400 ease-out-expo group-hover:scale-x-100" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </StaggerItem>

          <StaggerItem>
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-champagne">Kontakt</h4>
            <div className="mt-5 space-y-2 text-[12.5px] leading-relaxed text-ivory/65">
              <p>Maria Maria Wines</p>
              <p>Via del Vino 12</p>
              <p>39052 Caldaro (BZ), Italien</p>
              <a href="mailto:info@maria-maria.wine" className="block transition-colors hover:text-champagne">
                info@maria-maria.wine
              </a>
              <a href="tel:+390471123456" className="block transition-colors hover:text-champagne">
                +39 0471 123456
              </a>
            </div>
          </StaggerItem>

          <StaggerItem>
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-champagne">Offizieller Shop</h4>
            <p className="mt-5 max-w-[220px] text-[12.5px] leading-relaxed text-ivory/65">
              Entdecken und bestellen Sie unsere Weine direkt im Maria Maria Shop.
            </p>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-5 inline-flex items-center gap-2 text-[13px] font-medium text-champagne"
            >
              <span className="relative">
                Zum Shop
                <span className="absolute -bottom-1 left-0 right-0 h-px origin-left scale-x-0 bg-champagne transition-transform duration-400 ease-out-expo group-hover:scale-x-100" />
              </span>
              <Arrow className="h-4 w-4 transition-transform duration-500 ease-out-expo group-hover:translate-x-1" />
            </a>
          </StaggerItem>
        </Stagger>
      </div>

      {/* bottom bar */}
      <div className="relative border-t border-ivory/10">
        <div className="mx-auto flex max-w-content flex-wrap items-center justify-between gap-x-6 gap-y-2 px-6 py-5 text-[11px] text-ivory/60 lg:px-10">
          <span>© {year} Maria Maria Wines — Il piacere del vino</span>
          <div className="flex items-center gap-5">
            <a href="#" className="transition-colors hover:text-champagne">Datenschutz</a>
            <a href="#" className="transition-colors hover:text-champagne">Impressum</a>
            <a href="#" className="transition-colors hover:text-champagne">AGB</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
