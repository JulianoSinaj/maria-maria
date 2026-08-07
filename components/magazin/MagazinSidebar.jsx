import { Reveal } from "@/components/motion/Reveal";
import { GoldRule } from "@/components/Deco";
import FilterPanel from "@/components/magazin/FilterPanel";
import NewsletterCard from "@/components/magazin/NewsletterCard";
import ArticleCard from "@/components/magazin/ArticleCard";
import { KATEGORIEN, LESEDAUER, TAGS, POPULAR_ARTICLES } from "@/components/magazin/magazinData";

/* Die Seitenleiste des Archivs: Filter, Newsletter, beliebte Artikel und die
   Schlagwortwolke. Als <aside> ein eigener Landmark — Screenreader können sie
   überspringen, statt sich durch sie hindurch zum nächsten Artikel zu lesen.

   Die Schlagworte sind bewusst keine Links: eine Suche nach Tag gibt es noch
   nicht (siehe ArticleCard zum selben Prinzip). Sie stehen als Themenlegende
   und werden zu Links, sobald es Zielseiten gibt. */

export default function MagazinSidebar() {
  return (
    <aside aria-label="Magazin durchsuchen" className="space-y-8 lg:sticky lg:top-28 lg:self-start">
      <Reveal delay={0.1} y={22}>
        <FilterPanel categories={KATEGORIEN} durations={LESEDAUER} />
      </Reveal>

      <Reveal delay={0.16} y={22}>
        <NewsletterCard />
      </Reveal>

      {/* beliebte Artikel */}
      <Reveal delay={0.22} y={22}>
        <section
          aria-labelledby="magazin-beliebt"
          className="rounded-card-lg border border-stone/50 bg-white/70 p-6 shadow-luxe"
        >
          <h2 id="magazin-beliebt" className="font-playfair text-[19px] text-charcoal">
            Beliebte Artikel
          </h2>
          <GoldRule className="mt-3 w-full" />
          <div className="mt-5 space-y-5">
            {POPULAR_ARTICLES.map((a) => (
              <ArticleCard key={a.id} article={a} variant="compact" />
            ))}
          </div>
        </section>
      </Reveal>

      {/* Schlagwortwolke — gibt der Leiste Länge und zeigt die Themenbreite */}
      <Reveal delay={0.28} y={22}>
        <section
          aria-labelledby="magazin-themen"
          className="rounded-card-lg border border-stone/50 bg-gradient-to-b from-white/90 to-cream p-6 shadow-luxe"
        >
          <h2 id="magazin-themen" className="font-playfair text-[19px] text-charcoal">
            Beliebte Themen
          </h2>
          <GoldRule className="mt-3 w-full" />
          <ul className="mt-5 flex flex-wrap gap-2">
            {TAGS.map((tag) => (
              <li
                key={tag}
                className="inline-flex items-center rounded-full border border-stone/70 bg-white/60 px-3.5 py-2 text-[11px] font-medium tracking-[0.04em] text-charcoal/70"
              >
                {tag}
              </li>
            ))}
          </ul>
        </section>
      </Reveal>
    </aside>
  );
}
