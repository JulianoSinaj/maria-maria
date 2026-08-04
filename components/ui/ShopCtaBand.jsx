"use client";
import ShaderGradient from "@/components/motion/ShaderGradient";
import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/Deco";
import Button from "@/components/ui/Button";
import { pushEvent, CTA_SHOP_CLICK } from "@/lib/analytics";

/* Abschlussband „zum Shop" — eine Bauform für alle Seiten.

   Randlos: der Wein-Shader läuft von Kante zu Kante, darüber liegt eine
   Bordeaux-Glasscheibe (.glass-wine) — gleiche Farbe, aber durchscheinend.
   Inhalt zentriert, Typo bewusst zurückgenommen: das Band schließt eine Seite
   ab, es soll sie nicht überschreien.

   Vorlage war das Band der Startseite („Bereit für Ihren Maria-Moment?"); die
   Fassungen auf /regionen, /shop und den Weinseiten lagen jeweils als eigene
   Kopie daneben — mit abweichenden Radien, Innenabständen und Schriftgraden.
   Jetzt liegt die Gestaltung hier, die Seiten geben nur noch Text und Ziele.

   Props: eyebrow, title (Node — kursive Akzente kommen von der Seite),
   text, primary/secondary als { label, href }.

   Messung: der primäre Button meldet jeden Klick als `cta_shop_click` an den
   dataLayer (lib/analytics). Weil alle neun Wein-Landingpages dieselbe
   Bauform benutzen, hängt die Messung damit an der Komponente statt an den
   Seiten — eine Seite kann das Event nicht mehr vergessen. `wine` und
   `location` sagen in GA4, welche Seite und welche Sektion den Klick
   ausgelöst hat. */

export default function ShopCtaBand({
  eyebrow,
  title,
  text,
  primary,
  secondary,
  /* Wein-Landingpages atmen im Ton ihres Etiketts: vier Hex-Werte hell→dunkel
     ersetzen die Bordeaux-Palette des Shaders. Ohne `colors` bleibt es beim
     Marken-Bordeaux. */
  colors,
  /* Kontext für die Messung: Slug der Landingpage und Name der Sektion */
  wine = null,
  location = "cta_band",
}) {
  return (
    <section className="relative overflow-hidden">
      <ShaderGradient palette="wine" colors={colors} />
      <div className="glass-wine grain relative">
        <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-6 px-6 py-12 text-center sm:py-14 lg:py-16">
          <Reveal className="text-center">
            {eyebrow && <Eyebrow light>{eyebrow}</Eyebrow>}
            <h2 className="mt-3 text-balance font-playfair text-[clamp(1.375rem,2.4vw,1.875rem)] leading-[1.14] text-ivory">
              {title}
            </h2>
            {text && (
              <p className="mx-auto mt-3 max-w-sm text-[12px] leading-relaxed text-ivory/70">
                {text}
              </p>
            )}
          </Reveal>

          {(primary || secondary) && (
            <Reveal delay={0.18} className="w-full">
              <div className="mx-auto flex w-full max-w-xs flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:items-center sm:justify-center">
                {primary && (
                  <Button
                    href={primary.href}
                    variant="light"
                    size="md"
                    className="w-full sm:w-auto"
                    onClick={() =>
                      pushEvent(CTA_SHOP_CLICK, {
                        wine,
                        location,
                        link_url: primary.href,
                        link_text: primary.label,
                      })
                    }
                  >
                    {primary.label}
                  </Button>
                )}
                {secondary && (
                  <Button href={secondary.href} variant="glass" size="md" className="w-full sm:w-auto">
                    {secondary.label}
                  </Button>
                )}
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
