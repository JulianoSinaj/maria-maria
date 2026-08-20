"use client";
import { useEffect, useState } from "react";
import Link from "@/components/i18n/LocaleLink";
import { Reveal, Stagger, StaggerItem } from "./motion/Reveal";
import Button from "./ui/Button";
import { Instagram, Facebook, Mail, Arrow, Check, Grapes } from "./Icons";
import LanguageSwitcher from "./i18n/LanguageSwitcher";
import { useCommon, useLocale } from "@/lib/i18n/context";
import { AGENCY } from "@/lib/agency";
import { BUSINESS } from "@/lib/site";
import { pushEvent, CLICK_EMAIL, CLICK_PHONE } from "@/lib/analytics";

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
  /* E-Mail-Adresse aus lib/site.js — dieselbe Quelle wie Kontaktseite,
     Rechtstexte und JSON-LD (Kontakt-Handoff 18.08.2026). */
  { key: "mail", label: null, href: `mailto:${BUSINESS.email}`, Icon: Mail },
];

const LEGAL = [
  { key: "privacy", href: "/datenschutz" },
  { key: "imprint", href: "/impressum" },
  { key: "terms", href: "/agb" },
];

export default function Footer() {
  const t = useCommon("footer");
  const a11y = useCommon("a11y");
  const locale = useLocale();
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
            {t.newsletter.title} <span className="italic text-champagne">{t.newsletter.titleAccent}</span>
          </h3>
          <p className="mx-auto mt-3 max-w-md text-[13px] leading-relaxed text-ivory/65">
            {t.newsletter.text}
          </p>
          {sent ? (
            <p
              className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full border border-champagne/40 bg-champagne/10 px-5 py-3 text-[13px] text-champagne"
              role="status"
            >
              <Check className="h-4 w-4" /> {t.newsletter.success}
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
                {t.newsletter.emailLabel}
              </label>
              <input
                id="footer-newsletter"
                type="email"
                required
                autoComplete="email"
                placeholder={t.newsletter.placeholder}
                className="h-11 min-w-0 flex-1 bg-transparent px-4 text-[13px] text-ivory outline-none placeholder:text-ivory/40"
              />
              <Button type="submit" className="shrink-0">
                {t.newsletter.submit}
              </Button>
            </form>
          )}
        </Reveal>

        {/* columns */}
        <Stagger className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4" gap={0.07}>
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
                  aria-label={label ?? t.newsletter.emailLabel}
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
              <p>Von Valerio Caniglia</p>
              <p>Ellerfelderstrasse 78</p>
              <p>40822 Mettmann</p>
              <a
                href={`mailto:${BUSINESS.email}`}
                onClick={() => pushEvent(CLICK_EMAIL, { location: "footer", language: locale })}
                className="block transition-colors hover:text-champagne"
              >
                {BUSINESS.email}
              </a>
              {/* Telefon erst, wenn eine bestätigte Nummer in lib/site.js steht —
                  bis dahin keine Zeile statt einer falschen. */}
              {BUSINESS.phone && (
                <a
                  href={`tel:${BUSINESS.phone}`}
                  onClick={() => pushEvent(CLICK_PHONE, { location: "footer", language: locale })}
                  className="block transition-colors hover:text-champagne"
                >
                  {BUSINESS.phoneDisplay ?? BUSINESS.phone}
                </a>
              )}
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
