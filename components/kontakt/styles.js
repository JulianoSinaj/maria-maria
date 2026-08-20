/* Die Bauteile der Kontaktseite an einer Stelle.

   Bis August 2026 sprach die Seite den Terrakotta-Dialekt ihres Mockups —
   Rechtecke mit 4-px-Radius, eigene Akzentfarbe, Sand-Haarlinien. Seit dem
   Angleich (20.08.2026) trägt sie dieselbe Sprache wie der Rest der
   Storefront: Bordeaux als Akzent, Champagner für Dekor und Fokus,
   Stone-Haarlinien, die Kartenradien aus tailwind.config (rounded-card).
   Struktur und Texte der Seite sind unverändert — nur der Ton.

   Die Klassen liegen weiterhin hier zusammen statt an zwölf Stellen im JSX:
   Wer den Ton der Seite ändern will, ändert diese Datei. Die beiden großen
   CTAs (Hero, Absenden) laufen inzwischen über components/ui/Button und
   stehen deshalb nicht mehr hier. */

/* Das Layout arbeitet mit ZWEI Breiten, und der Unterschied ist Absicht:

   SHELL_WIDE (~1250 px) trägt Hero, Formular und FAQ — die Blöcke, die
   links auf derselben Kante sitzen wie die H1.
   SHELL (~1040 px) trägt die Anliegen-Kachel und den Prozess. Beide sind
   zentrierte Lesestrecken; in voller Breite zerfiele die 2×2-Kachel in vier
   weit auseinanderliegende Inseln. */
export const SHELL_WIDE = "mx-auto w-full max-w-[1340px] px-6 lg:px-10";
export const SHELL = "mx-auto w-full max-w-[1104px] px-6 lg:px-8";

/* Die linke Kante der Hero. Sie ist KEIN Shell: die Hero läuft rechts unter
   das randlose Foto und darf deshalb keinen zentrierten Container haben.
   Damit Überschrift, Formular und FAQ trotzdem auf derselben Linie stehen,
   rechnet sie den linken Rand von SHELL_WIDE nach — dieselbe Formel, die
   `mx-auto max-w-[1340px] px-10` erzeugt, nur einseitig.

   Als Inline-Style statt als Tailwind-Klasse, weil die Klasse dafür
   `lg:pl-[max(1.5rem,calc((100vw_-_1340px)/2_+_2.5rem))]` heißen müsste —
   lesbar ist daran nichts mehr. */
export const HERO_INSET = { paddingLeft: "max(1.5rem, calc((100vw - 1340px) / 2 + 2.5rem))" };

/* Sichtbarer Fokus für Tastaturbedienung — dieselbe Champagner-Marke wie in
   components/faq/FaqSection.jsx, mit dem Seitengrund (Ivory) als Offset. */
export const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne " +
  "focus-visible:ring-offset-2 focus-visible:ring-offset-ivory";

/* Textlink mit Pfeil — die CTA der Anliegen-Karten und der FAQ. Bordeaux,
   halbfett, ohne Versalien: die Bauform der Antwort-Links in FaqSection und
   der Hero-Nebenlinks (geschichte). Ohne Mindesthöhe und ohne Fokusring: In
   den Karten ist er nur Beschriftung (die ganze Karte ist das Ziel und trägt
   den Fokusrahmen über has-[:focus-visible]); als eigenständige Schaltfläche
   bekommt er `min-h-[44px]` und FOCUS_RING am Einsatzort dazu. */
export const CTA_LINK =
  "group/link inline-flex items-center gap-1.5 text-[13px] font-semibold text-bordeaux " +
  "transition-colors duration-300 hover:text-bordeaux-deep";

/* Karten und Panels: Haarlinie in Stone, die Kartenradien der Storefront
   (rounded-card = 1.5 rem, rounded-card-lg = 2 rem), keine Schatten —
   dieselbe Fläche wie die Karten auf Startseite und Regionen. */
export const CARD = "rounded-card border border-stone/60 bg-white/70";
export const PANEL = "rounded-card-lg border border-stone/60 bg-white";

/* Formularfelder. Die 16-px-Regel für Touch-Geräte steht global in
   globals.css; hier bleibt die Desktop-Größe. Ruhelage Stone, beim Zeigen
   Champagner, im Fokus Bordeaux — die Reihenfolge, in der auch die
   FAQ-Schaltflächen der übrigen Seiten ihre Ringe färben. */
export const FIELD =
  "w-full rounded-[10px] border border-stone/70 bg-white px-3.5 py-2.5 text-[13.5px] text-charcoal " +
  "outline-none transition-colors duration-200 placeholder:text-charcoal/35 " +
  "hover:border-champagne focus:border-bordeaux/50";

export const FIELD_LABEL = "mb-1.5 block text-[12.5px] font-medium text-charcoal/85";

/* Sektionsüberschrift — Playfair, zentriert, auf der Typo-Rampe von
   components/Deco.jsx (SectionTitle). */
export const SECTION_TITLE =
  "text-balance text-center font-playfair text-[clamp(1.75rem,3.4vw,2.6rem)] leading-[1.12] text-charcoal";
