"use client";
import Button from "@/components/ui/Button";
import { useCommon } from "@/lib/i18n/context";

/* Client-Error-Boundary — ohne sie würde ein Laufzeitfehler im (weitgehend
   client-gerenderten) Baum die Seite weiß hinterlassen.

   Der Text kommt aus dem Provider des Layouts. Fällt der Fehler so früh, dass
   noch kein Provider stand, greift der Rückfall in useI18nContext() und die
   Seite erscheint auf Deutsch — mit Text, nicht leer. */

export default function Error({ error, reset }) {
  const t = useCommon("errors");

  return (
    <div className="flex min-h-[70vh] items-center">
      <div className="mx-auto max-w-content px-6 py-32 text-center lg:px-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-bordeaux">
          {t.eyebrow}
        </p>
        <h1 className="mx-auto mt-5 max-w-xl text-balance font-playfair text-[clamp(1.8rem,4vw,2.8rem)] leading-[1.12] text-charcoal">
          {t.title} <span className="italic text-bordeaux">{t.titleAccent}</span>
        </h1>
        <p className="mx-auto mt-5 max-w-md text-[14px] leading-relaxed text-charcoal/70">
          {t.text}
        </p>
        <div className="mx-auto mt-9 flex max-w-xs flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:items-center sm:justify-center">
          <Button onClick={() => reset()} size="lg" className="w-full sm:w-auto">
            {t.retry}
          </Button>
          <Button href="/" variant="outline" size="lg" className="w-full sm:w-auto">
            {t.home}
          </Button>
        </div>
      </div>
    </div>
  );
}
