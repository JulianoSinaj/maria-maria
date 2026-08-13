"use client";
import Button from "@/components/ui/Button";
import { Eyebrow, GrapeRule } from "@/components/Deco";
import Atmosphere, { GhostWord } from "@/components/Atmosphere";
import { useCommon } from "@/lib/i18n/context";

/* 404 im Markenlook — läuft im normalen Layout, Header und Footer bleiben.

   Seit der Mehrsprachigkeit eine Client-Component: `not-found.jsx` bekommt
   von Next.js keine `params`, kennt die Sprache also nicht aus der Route. Über
   den I18nProvider des Layouts kommt sie trotzdem an — der Provider liegt im
   Baum darüber.

   Damit entfällt das frühere `export const metadata` (in einer
   Client-Component nicht erlaubt). Der Seitentitel fällt auf den
   `title.default` des Layouts zurück, und der ist bereits übersetzt — besser
   als der vorherige, fest deutsche 404-Titel auf allen vier Sprachen. */

export default function NotFound() {
  const t = useCommon("notFound");

  return (
    <div className="relative flex min-h-[70vh] items-center overflow-hidden">
      <Atmosphere variant="warm" />
      <GhostWord className="right-[-4vw] top-16 text-[16vw]">404</GhostWord>
      <div className="relative mx-auto max-w-content px-6 py-32 text-center lg:px-10">
        <Eyebrow className="justify-center">{t.eyebrow}</Eyebrow>
        <h1 className="mx-auto mt-5 max-w-xl text-balance font-playfair text-[clamp(2rem,4.5vw,3.4rem)] leading-[1.1] text-charcoal">
          {t.title} <span className="italic text-bordeaux">{t.titleAccent}</span>
        </h1>
        <GrapeRule className="mx-auto mt-7 justify-center" />
        <p className="mx-auto mt-6 max-w-md text-[14px] leading-relaxed text-charcoal/70">
          {t.text}
        </p>
        <div className="mx-auto mt-9 flex max-w-xs flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:items-center sm:justify-center">
          <Button href="/unsere-weine" size="lg" className="w-full sm:w-auto">
            {t.wines}
          </Button>
          <Button href="/" variant="outline" size="lg" className="w-full sm:w-auto">
            {t.home}
          </Button>
        </div>
      </div>
    </div>
  );
}
