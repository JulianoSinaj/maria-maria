import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { SectionTitle } from "@/components/Deco";
import Photo from "@/components/media/Photo";
import { THEMES } from "@/components/magazin/magazinData";

/* Themenwelten — die fünf Wege durch das Magazin.

   Die Kacheln sind (noch) keine Links: Kategorieseiten gibt es nicht, und ein
   `href="#"` wäre eine Sackgasse. Sie stehen deshalb als Legende der
   Themenwelten — sobald es /magazin?thema=… gibt, wird hier ein Link daraus.
   Bis dahin bleiben sie bewusst nicht fokussierbar. */

export default function ThemeGrid({ headingId }) {
  return (
    <section aria-labelledby={headingId}>
      <SectionTitle
        align="left"
        eyebrow="Themenwelten"
        description="Fünf Wege durch unser Magazin – finden Sie Ihre Inspiration."
        headingId={headingId}
      >
        Entdecken nach Themen
      </SectionTitle>
      <Stagger className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5" gap={0.07}>
        {THEMES.map((t) => {
          const Icon = t.icon;
          return (
            <StaggerItem key={t.cat} className="h-full">
              <article className="flex h-full flex-col overflow-hidden rounded-card border border-stone/50 bg-white/70 shadow-luxe">
                <div className="relative h-24 overflow-hidden">
                  <Photo
                    src={t.img}
                    alt=""
                    sizes="(min-width: 1024px) 18vw, 45vw"
                    className="h-full w-full object-cover"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-espresso/25 to-transparent"
                  />
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <Icon aria-hidden="true" className="h-6 w-6 text-champagne" />
                  <h3 className="mt-2.5 text-[9.5px] uppercase tracking-[0.14em] text-charcoal/50">
                    {t.cat}
                  </h3>
                  <p className="mt-0.5 text-[12.5px] font-medium text-charcoal">{t.sub}</p>
                </div>
              </article>
            </StaggerItem>
          );
        })}
      </Stagger>
    </section>
  );
}
