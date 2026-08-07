import Link from "next/link";
import Photo from "@/components/media/Photo";
import { Arrow, Clock } from "@/components/Icons";
import { readingTime } from "@/components/magazin/magazinData";

/* Artikelkarte in drei Ausprägungen — dieselbe Karte, drei Zuschnitte:
   „lead"    breite Querzeile als Aufmacher der Liste
   „grid"    die Standardkachel im Raster
   „compact" der Daumennagel in der Seitenleiste

   Verlinkung: solange ein Artikel kein `href` trägt (es gibt noch keine
   Artikelrouten), rendert die Karte KEIN <a>. Ein Link auf „#" wäre für
   Tastatur und Screenreader eine Sackgasse und für Crawler ein toter Pfad.
   Statt eines Links steht dann der Hinweis „Bald verfügbar" — die Karte
   verspricht nichts, was sie nicht einlöst. Bekommt der Artikel in
   magazinData ein `href`, wird dieselbe Karte ohne weitere Änderung
   klickbar.

   `headingLevel` hält die Dokumentgliederung intakt: im Archiv stehen die
   Karten unter einer h2-Sektion und tragen h3, in der Seitenleiste unter
   deren eigener h2 ebenfalls h3. */

/* Hover-Effekte nur dort, wo es auch ein Ziel gibt */
const INTERACTIVE =
  "transition-all duration-500 ease-out-expo hover:-translate-y-1.5 hover:border-champagne/60 hover:shadow-lift";

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne focus-visible:ring-offset-2 focus-visible:ring-offset-cream";

/* Ein Wrapper, der nur dann ein Link wird, wenn es ein Ziel gibt. */
function CardShell({ href, label, className, children }) {
  if (!href) return <div className={className}>{children}</div>;
  return (
    <Link href={href} aria-label={label} className={`${className} ${FOCUS_RING}`}>
      {children}
    </Link>
  );
}

/* Fußzeile der Karte: echtes Linkversprechen oder ehrlicher Status */
function CardCue({ href, label = "Artikel lesen" }) {
  if (!href) {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] text-charcoal/40">
        Bald verfügbar
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-bordeaux">
      {label}
      <Arrow className="h-3.5 w-3.5 transition-transform duration-500 ease-out-expo group-hover:translate-x-1" />
    </span>
  );
}

function Meta({ minutes, className = "" }) {
  return (
    <p className={`inline-flex items-center gap-1.5 text-[11px] text-charcoal/50 ${className}`}>
      <Clock className="h-3.5 w-3.5" />
      {readingTime(minutes)}
    </p>
  );
}

export default function ArticleCard({ article, variant = "grid", headingLevel = "h3" }) {
  const Heading = headingLevel;
  const { href, title, excerpt, cat, minutes, img, alt } = article;
  const interactive = href ? INTERACTIVE : "";

  /* ---- Seitenleiste: Daumennagel neben zwei Zeilen ---- */
  if (variant === "compact") {
    return (
      <CardShell href={href} label={title} className="group flex items-center gap-3.5 rounded-xl">
        <span className="relative h-14 w-20 shrink-0 overflow-hidden rounded-xl">
          {/* feste 80 px, auf Retina 160 px — die 640er Variante deckt beides ab */}
          <Photo
            src={img}
            alt=""
            sizes="80px"
            className={`h-full w-full object-cover ${
              href ? "transition-transform duration-700 ease-out-expo group-hover:scale-[1.1]" : ""
            }`}
          />
        </span>
        <span className="min-w-0">
          <Heading
            className={`block text-[12.5px] font-medium leading-snug text-charcoal ${
              href ? "transition-colors duration-300 group-hover:text-bordeaux" : ""
            }`}
          >
            {title}
          </Heading>
          <span className="mt-1 flex items-center gap-1.5 text-[10.5px] text-charcoal/50">
            <Clock className="h-3 w-3" />
            {readingTime(minutes)}
          </span>
        </span>
      </CardShell>
    );
  }

  /* ---- Aufmacher: breite Querzeile, Bild und Text nebeneinander ---- */
  if (variant === "lead") {
    return (
      <CardShell href={href} label={title} className="group block">
        <article
          className={`grid grid-cols-1 overflow-hidden rounded-card-lg border border-stone/50 bg-white/70 shadow-luxe sm:grid-cols-[1.05fr_1fr] ${interactive}`}
        >
          <div className="relative h-56 overflow-hidden sm:h-full sm:min-h-[280px]">
            <Photo
              src={img}
              alt={alt}
              sizes="(min-width: 1024px) 50vw, 100vw"
              className={`h-full w-full object-cover ${
                href ? "transition-transform duration-700 ease-out-expo group-hover:scale-[1.05]" : ""
              }`}
            />
            <span className="glass absolute left-4 top-4 rounded-full px-3 py-1.5 text-[9.5px] font-semibold uppercase tracking-[0.16em] text-charcoal/70">
              {cat}
            </span>
          </div>
          <div className="flex flex-col justify-center p-7 sm:p-9">
            <p className="text-[10px] uppercase tracking-[0.22em] text-bordeaux/70">Im Fokus</p>
            <Heading
              className={`mt-2 font-playfair text-[clamp(1.5rem,2.4vw,1.9rem)] leading-tight text-charcoal ${
                href ? "transition-colors duration-300 group-hover:text-bordeaux" : ""
              }`}
            >
              {title}
            </Heading>
            <Meta minutes={minutes} className="mt-2.5" />
            <p className="mt-3 text-[13px] leading-relaxed text-charcoal/70">{excerpt}</p>
            <div className="mt-6">
              <CardCue href={href} />
            </div>
          </div>
        </article>
      </CardShell>
    );
  }

  /* ---- Standardkachel im Raster ---- */
  return (
    <CardShell href={href} label={title} className="group block h-full">
      <article
        className={`flex h-full flex-col overflow-hidden rounded-card border border-stone/50 bg-white/70 shadow-luxe ${interactive}`}
      >
        <div className="relative h-44 overflow-hidden">
          <Photo
            src={img}
            alt={alt}
            sizes="(min-width: 1280px) 30vw, (min-width: 640px) 45vw, 100vw"
            className={`h-full w-full object-cover ${
              href ? "transition-transform duration-700 ease-out-expo group-hover:scale-[1.06]" : ""
            }`}
          />
          <span className="glass absolute left-4 top-4 rounded-full px-3 py-1.5 text-[9.5px] font-semibold uppercase tracking-[0.16em] text-charcoal/70">
            {cat}
          </span>
        </div>
        <div className="flex flex-1 flex-col p-6">
          <Heading
            className={`font-playfair text-[19px] leading-snug text-charcoal ${
              href ? "transition-colors duration-300 group-hover:text-bordeaux" : ""
            }`}
          >
            {title}
          </Heading>
          <Meta minutes={minutes} className="mt-2" />
          <p className="mt-2.5 text-[12.5px] leading-relaxed text-charcoal/65">{excerpt}</p>
          <div className="mt-auto pt-5">
            <CardCue href={href} label="Mehr lesen" />
          </div>
        </div>
      </article>
    </CardShell>
  );
}
