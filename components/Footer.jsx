"use client";
import { useEffect, useState } from "react";
import Link from "@/components/i18n/LocaleLink";
import { Stagger, StaggerItem } from "./motion/Reveal";
import { Instagram, Facebook, Mail, Arrow } from "./Icons";
import LanguageSwitcher from "./i18n/LanguageSwitcher";
import { useCommon } from "@/lib/i18n/context";
import { AGENCY } from "@/lib/agency";

const EXPLORE = [
  { key: "wines", href: "/unsere-weine" },
  { key: "regions", href: "/regionen" },
  { key: "magazine", href: "/magazin" },
  { key: "contact", href: "/kontakt" },
];

/* Netzwerknamen sind Eigennamen und bleiben in jeder Sprache stehen — nur
   „E-Mail" ist ein Wort und kommt daher aus dem Wörterbuch. */
const SOCIALS = [
  { key: "instagram", label: "Instagram", href: "https://www.instagram.com/mariamaria.wine", Icon: Instagram },
  { key: "facebook", label: "Facebook", href: "https://www.facebook.com/mariamaria.wine", Icon: Facebook },
  { key: "mail", label: null, href: "mailto:info@maria-maria.de", Icon: Mail },
];

const LEGAL = [
  { key: "privacy", href: "/datenschutz" },
  { key: "imprint", href: "/impressum" },
  { key: "terms", href: "/agb" },
];

export default function Footer() {
  const t = useCommon("footer");
  const a11y = useCommon("a11y");
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
        {/* columns */}
        <Stagger className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4" gap={0.07}>
          <StaggerItem>
            <p className="font-playfair text-[24px] leading-none">
              Maria <span className="italic text-champagne">Maria</span>
            </p>
            <p className="mt-4 max-w-[230px] text-[12.5px] leading-relaxed text-ivory/60">
              {t.tagline}
            </p>
            <div className="mt-6 flex items-center gap-3">
              {SOCIALS.map(({ key, label, href, Icon }) => (
                <a
                  key={key}
                  href={href}
                  aria-label={label ?? t.mailLabel}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-ivory/15 text-ivory/75 transition-colors duration-300 hover:border-champagne hover:text-champagne"
                >
                  <Icon className="h-[18px] w-[18px]" />
                </a>
              ))}
            </div>
          </StaggerItem>

          <StaggerItem>
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-champagne">{t.exploreHeading}</h4>
            <ul className="mt-5 space-y-3">
              {EXPLORE.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="group inline-flex items-center gap-2 text-[13px] text-ivory/75 transition-colors hover:text-ivory"
                  >
                    <span className="h-px w-4 origin-left scale-x-0 bg-champagne transition-transform duration-400 ease-out-expo group-hover:scale-x-100" />
                    {t.explore[l.key]}
                  </Link>
                </li>
              ))}
            </ul>
          </StaggerItem>

          <StaggerItem>
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-champagne">{t.contactHeading}</h4>
            <div className="mt-5 space-y-2 text-[12.5px] leading-relaxed text-ivory/65">
              <p>Senso Valerio Weinhandel</p>
              <p>Valerio Caniglia</p>
              <p>Ellerfelderstrasse 78d</p>
              <p>40822 Mettmann</p>
              <a href="mailto:info@maria-maria.de" className="block transition-colors hover:text-champagne">
                info@maria-maria.de
              </a>
            </div>
          </StaggerItem>

          <StaggerItem>
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-champagne">{t.shopHeading}</h4>
            <p className="mt-5 max-w-[220px] text-[12.5px] leading-relaxed text-ivory/65">
              {t.shopText}
            </p>
            <Link
              href="/shop"
              className="group mt-5 inline-flex items-center gap-2 text-[13px] font-medium text-champagne"
            >
              <span className="relative">
                {t.shopLink}
                <span className="absolute -bottom-1 left-0 right-0 h-px origin-left scale-x-0 bg-champagne transition-transform duration-400 ease-out-expo group-hover:scale-x-100" />
              </span>
              <Arrow className="h-4 w-4 transition-transform duration-500 ease-out-expo group-hover:translate-x-1" />
            </Link>
          </StaggerItem>
        </Stagger>
      </div>

      {/* bottom bar */}
      <div className="relative">
        <div className="mx-auto flex max-w-content flex-wrap items-center justify-between gap-x-6 gap-y-3 px-6 py-5 text-[11px] text-ivory/60 lg:px-10">
          <span>© {year} {t.copyright}</span>
          <div className="flex flex-wrap items-center gap-5">
            {LEGAL.map((l) => (
              <Link key={l.href} href={l.href} className="transition-colors hover:text-champagne">
                {t.legal[l.key]}
              </Link>
            ))}
            {/* Zweiter Zugang zur Sprachwahl: Wer unten ankommt, soll nicht
                erst wieder nach oben scrollen müssen. */}
            <LanguageSwitcher variant="inline" />
          </div>
        </div>

        {/* Agentur-Zeile.

            Bewusst eine eigene Stufe unter der Rechts-Leiste und blasser
            gesetzt: Der Hinweis gehört sichtbar zur Seite, darf aber nicht
            mit Impressum und Datenschutz um Aufmerksamkeit konkurrieren.

            „Powered by" steht wie die Netzwerknamen weiter oben in jeder
            Sprache gleich da — eine feste Kreditzeile, kein Fließtext, und
            deshalb nicht im Wörterbuch. */}
        <div className="border-t border-ivory/10">
          <div className="mx-auto flex max-w-content flex-wrap items-center justify-center gap-x-2 gap-y-1 px-6 py-4 text-[11px] text-ivory/45 lg:px-10">
            <span>
              Powered by{" "}
              {AGENCY.url ? (
                <a
                  href={AGENCY.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ivory/70 underline-offset-4 transition-colors hover:text-champagne hover:underline"
                >
                  {AGENCY.name}
                </a>
              ) : (
                <span className="text-ivory/70">{AGENCY.name}</span>
              )}
            </span>
            {AGENCY.email && (
              <>
                <span aria-hidden="true" className="text-ivory/25">
                  ·
                </span>
                <a
                  href={`mailto:${AGENCY.email}`}
                  className="underline-offset-4 transition-colors hover:text-champagne hover:underline"
                >
                  {AGENCY.email}
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
