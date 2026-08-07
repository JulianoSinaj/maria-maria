import TiltCard from "@/components/motion/TiltCard";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import Button from "@/components/ui/Button";
import { Eyebrow } from "@/components/Deco";
import Photo from "@/components/media/Photo";
import { Instagram } from "@/components/Icons";
import {
  SOCIAL_POSTS,
  SOCIAL_URL,
  SOCIAL_HANDLE,
} from "@/components/magazin/magazinData";

/* Bacheca — die Social-Media-Pinnwand des Magazins: eine Reihe zu vier
   Motiven auf dunkler Editorial-Bühne (gleiche Bühne wie HelpStrip). Jede
   Kachel kippt federgedämpft zum Cursor, auf Hover legt sich der
   Espresso-Schleier mit Bildunterschrift und Hashtag über das Motiv.
   Alle Kacheln führen zum Profil. Inhalte: magazinData.SOCIAL_POSTS. */

export default function SocialBoard({ className = "", headingId }) {
  return (
    <section
      aria-labelledby={headingId}
      className={`grain relative overflow-hidden bg-espresso py-16 lg:py-20 ${className}`}
    >
      {/* Tiefe: warme Weinglut oben links, Champagnerschimmer unten rechts */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 -top-40 h-[36rem] w-[36rem] rounded-full opacity-70 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(107,15,26,0.55) 0%, rgba(107,15,26,0) 68%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-56 -right-32 h-[32rem] w-[32rem] rounded-full opacity-50 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(200,183,122,0.32) 0%, rgba(200,183,122,0) 70%)",
        }}
      />
      {/* Übergang zur hellen Nachbarsektion – keine harte Kante */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ivory/10 to-transparent"
      />

      <div className="relative mx-auto max-w-content px-6 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal className="max-w-xl">
            <Eyebrow light>Bacheca Social</Eyebrow>
            <h2
              id={headingId}
              className="mt-3 text-balance font-playfair text-[clamp(1.7rem,3.2vw,2.5rem)] leading-[1.08] text-ivory"
            >
              Maria Maria auf <span className="italic text-champagne-light">Instagram</span>
            </h2>
            <p className="mt-3 max-w-lg text-[13px] leading-relaxed text-ivory/60">
              Momente aus Weinbergen, Kellern und von gedeckten Tischen — unsere Pinnwand aus der
              Welt von Maria Maria.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <Button href={SOCIAL_URL} external variant="glass" size="sm" iconType="up-right">
              {SOCIAL_HANDLE} folgen
            </Button>
          </Reveal>
        </div>

        {/* die Pinnwand: quadratische Kacheln, ab lg eine einzige Reihe zu
            viert. Darunter bleibt es bei zwei Spalten — bei dreien stünde die
            vierte Kachel allein in einer zweiten Reihe. */}
        <Stagger className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4" gap={0.06}>
          {SOCIAL_POSTS.map((p) => (
            <StaggerItem key={p.img} className="h-full">
              <a
                href={SOCIAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${p.caption} — Maria Maria auf Instagram öffnen`}
                className="group block h-full rounded-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne focus-visible:ring-offset-2 focus-visible:ring-offset-espresso"
              >
                <TiltCard className="h-full" max={6} radius="rounded-card">
                  <article className="relative aspect-square overflow-hidden rounded-card border border-champagne/15">
                    <Photo
                      src={p.img}
                      alt={p.caption}
                      sizes="(min-width: 1024px) 25vw, 50vw"
                      className="h-full w-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.07]"
                    />
                    {/* Espresso-Schleier + Bildunterschrift: auf Hover UND auf
                        Tastaturfokus: sonst wäre die Bildunterschrift für
                        Tastaturnutzer unerreichbar */}
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-espresso/90 via-espresso/25 to-transparent opacity-0 transition-opacity duration-500 ease-out-expo group-hover:opacity-100 group-focus-visible:opacity-100"
                    />
                    <span className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full border border-champagne/25 bg-espresso/40 text-champagne-light backdrop-blur-sm transition-colors duration-300 group-hover:bg-espresso/60">
                      <Instagram aria-hidden="true" className="h-3.5 w-3.5" />
                    </span>
                    <div className="absolute inset-x-0 bottom-0 translate-y-3 p-4 opacity-0 transition-all duration-500 ease-out-expo group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                      <p className="text-[12px] font-medium leading-snug text-ivory">{p.caption}</p>
                      <p className="mt-0.5 text-[10.5px] uppercase tracking-[0.14em] text-champagne-light/80">
                        {p.tag}
                      </p>
                    </div>
                  </article>
                </TiltCard>
              </a>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
