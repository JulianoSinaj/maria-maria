/* Die Bauteile des Kontakt-Mockups an einer Stelle.

   Die Kontaktseite bricht bewusst mit zwei Konventionen der Storefront: Ihre
   Schaltflächen sind Rechtecke mit 4-px-Radius statt Pillen, und ihr Akzent
   ist Terrakotta statt Bordeaux. Beides steht so im freigegebenen Mockup.

   Damit das eine bewusste Entscheidung bleibt und nicht als Schludrigkeit
   durch die Seite sickert, liegen die Klassen hier zusammen statt an zwölf
   Stellen im JSX. Wer den Ton der Seite ändern will, ändert diese Datei. */

/* Das Mockup arbeitet mit ZWEI Breiten, und der Unterschied ist Absicht:

   SHELL_WIDE (~1250 px) trägt Hero, Formular und FAQ — die Blöcke, die
   links auf derselben Kante sitzen wie die H1.
   SHELL (~1040 px) trägt die Anliegen-Kachel und den Prozess. Beide sind
   zentrierte Lesestrecken; in voller Breite zerfiele die 2×2-Kachel in vier
   weit auseinanderliegende Inseln.

   Gemessen an der Referenz „landing page contatti.png" bei 1440 px: äußere
   Kante 85 px, innerer Block 202 px. */
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

/* Primär-CTA — gefülltes Terrakotta-Rechteck.

   px-6 statt px-7: Bei px-7 waren die beiden Hero-Schaltflächen im
   Italienischen zusammen 555 px breit und passten um EIN Pixel nicht in die
   554 px der Textspalte — sie klappten untereinander, während Deutsch,
   Englisch und Tschechisch nebeneinander blieben. Vier Pixel Polsterung je
   Seite geben 16 px zurück und damit allen vier Sprachen dieselbe Zeile.
   Das Mockup zeigt sie nebeneinander. */
export const CTA_PRIMARY =
  "inline-flex min-h-[48px] items-center justify-center gap-2 rounded-[4px] bg-terracotta px-6 py-3 " +
  "text-[11.5px] font-semibold uppercase tracking-[0.13em] text-linen " +
  "transition-colors duration-300 hover:bg-terracotta-deep";

/* Sekundär-CTA — dieselbe Silhouette als Kontur. */
export const CTA_OUTLINE =
  "inline-flex min-h-[48px] items-center justify-center gap-2 rounded-[4px] border border-terracotta/45 bg-transparent px-6 py-3 " +
  "text-[11.5px] font-semibold uppercase tracking-[0.13em] text-terracotta " +
  "transition-colors duration-300 hover:border-terracotta hover:bg-terracotta/[0.06]";

/* Textlink in Versalien mit Pfeil — die CTA der Anliegen-Karten und der FAQ.
   Ohne Mindesthöhe: In den Karten ist er nur Beschriftung (die ganze Karte
   ist das Ziel), als eigenständige Schaltfläche bekommt er sie am Einsatzort
   über `min-h-[44px]` dazu. */
export const CTA_LINK =
  "group/link inline-flex items-center gap-2 text-[11.5px] font-semibold uppercase " +
  "tracking-[0.13em] text-terracotta transition-colors duration-300 hover:text-terracotta-deep";

/* Karten und Panels: Haarlinie in Sand, weicher Radius, keine Schatten —
   Handoff §13: „Bordi card e form: 1 px caldo/chiaro, radius leggero;
   niente ombre pesanti." */
export const CARD = "rounded-[10px] border border-sand bg-white/70";
export const PANEL = "rounded-[12px] border border-sand bg-white";

/* Formularfelder. Die 16-px-Regel für Touch-Geräte steht global in
   globals.css; hier bleibt die Desktop-Größe. */
export const FIELD =
  "w-full rounded-[4px] border border-sand bg-white px-3.5 py-2.5 text-[13.5px] text-charcoal " +
  "outline-none transition-colors duration-200 placeholder:text-charcoal/35 " +
  "focus:border-terracotta/60 hover:border-terracotta/35";

export const FIELD_LABEL = "mb-1.5 block text-[12.5px] font-medium text-charcoal/85";

/* Sektionsüberschrift — Playfair, zentriert, in der Größe des Mockups. */
export const SECTION_TITLE =
  "text-balance text-center font-playfair text-[clamp(1.6rem,3.2vw,2.15rem)] leading-[1.18] text-charcoal";
