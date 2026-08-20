"use client";
import Button from "@/components/ui/Button";
import { useKontaktIntent, FORM_ANCHOR } from "@/components/kontakt/IntentContext";
import { Envelope, Handset, MapPin, ClockFace } from "@/components/kontakt/KontaktIcons";
import { useLocale } from "@/lib/i18n/context";
import { pushEvent, CLICK_EMAIL, CLICK_PHONE } from "@/lib/analytics";
import { BUSINESS } from "@/lib/site";

/* Der interaktive Teil des Heros: die beiden CTAs, die Kontaktzeile und die
   Vertrauenszeile. Überschrift und Einleitung bleiben in der Server-Komponente
   der Seite — sie brauchen kein JavaScript und stehen so früher im HTML.

   Beide CTAs sind echte Anker auf #anfrage (funktionieren also auch ohne
   JavaScript); mit JavaScript übernimmt der Intent-Provider: sanfter Scroll
   über Lenis, Vorbelegung des Selects, Tracking (contact_intent_click).
   „Beratung anfragen" belegt nichts vor — nur Scroll und Fokus auf den
   Select (Handoff §14). */

const SECTION = "hero";

/* Ab lg kompakter (Geometrie der sm-Pille): Die Textspalte des Heros ist auf
   großen Monitoren immer ~520 px breit (50 vw minus Container-Einzug), zwei
   md-Pillen brauchen ~540 — sie rutschten untereinander. Unter lg bleiben
   die 44-px-Touch-Ziele. */
const CTA_LG = "lg:min-h-[40px] lg:px-5 lg:py-2.5 lg:text-[12px]";

export default function HeroActions({ copy, details }) {
  const { requestIntent } = useKontaktIntent();
  const locale = useLocale();

  const go = (intent, label) => (e) => {
    e.preventDefault();
    requestIntent(intent, { ctaLabel: label, section: SECTION });
  };

  const contacts = [
    {
      key: "email",
      label: details.email,
      value: BUSINESS.email,
      href: `mailto:${BUSINESS.email}`,
      Icon: Envelope,
      onClick: () => pushEvent(CLICK_EMAIL, { location: SECTION, language: locale }),
    },
    /* Telefon nur mit bestätigter Nummer (lib/site.js) — sonst fehlt die
       Zeile, statt eine falsche Nummer zu zeigen. */
    BUSINESS.phone && {
      key: "phone",
      label: details.phone,
      value: BUSINESS.phoneDisplay ?? BUSINESS.phone,
      href: `tel:${BUSINESS.phone}`,
      Icon: Handset,
      onClick: () => pushEvent(CLICK_PHONE, { location: SECTION, language: locale }),
    },
    {
      key: "location",
      label: details.location,
      value: details.locationValue,
      Icon: MapPin,
    },
  ].filter(Boolean);

  return (
    <>
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Button
          variant="terracotta"
          size="md"
          href={`#${FORM_ANCHOR}`}
          onClick={go(null, copy.primaryCta)}
          className={CTA_LG}
        >
          {copy.primaryCta}
        </Button>
        <Button
          variant="terracotta-outline"
          size="md"
          iconType="none"
          href={`#${FORM_ANCHOR}`}
          onClick={go("verkostung", copy.secondaryCta)}
          className={CTA_LG}
        >
          {copy.secondaryCta}
        </Button>
      </div>

      <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-5">
        {contacts.map(({ key, label, value, href, Icon, onClick }) => (
          <li key={key} className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-terracotta/25 bg-terracotta-light/50 text-terracotta"
            >
              <Icon className="h-[18px] w-[18px]" />
            </span>
            <span className="min-w-0">
              <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-charcoal/50">
                {label}
              </span>
              {href ? (
                <a
                  href={href}
                  onClick={onClick}
                  className="inline-block py-0.5 text-[13.5px] font-medium text-charcoal underline decoration-terracotta/0 underline-offset-4 transition-[color,text-decoration-color] duration-300 hover:text-terracotta hover:decoration-terracotta/60"
                >
                  {value}
                </a>
              ) : (
                <span className="inline-block py-0.5 text-[13.5px] font-medium text-charcoal">{value}</span>
              )}
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-7 inline-flex items-center gap-2.5 text-[12.5px] leading-snug text-charcoal/65">
        <ClockFace aria-hidden="true" className="h-[18px] w-[18px] shrink-0 text-terracotta" />
        {copy.trust}
      </p>
    </>
  );
}
