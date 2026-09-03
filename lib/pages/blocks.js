/* Seiten-Editor (/admin/seiten) — welche Textblöcke der Storefront das
   Backoffice pflegt.
   ==========================================================================
   Ein Block ist ein Top-Level-Schlüssel der Inhaltsdatei einer Seite
   (content/<sprache>/<seite>.js) — oder ein benannter Unterzweig davon, wo
   die Seite selbst ihn so zusammensetzt: die drei Regionsporträts unter
   regionen.regions.<key>, die Stationen der Geschichte unter
   geschichte.chapters.<id>. Die Kapitel-Liste kommt aus storyData, damit
   Editor und Seite nie auseinanderlaufen; Reihenfolge = Reihenfolge auf der
   Seite.

   Die Felder behalten ihre Schlüsselnamen. Der Store (./store.js) legt je
   Seite × Block × Sprache einen vollständigen Block ab, der exakt die Form
   des Codes hat — der Merge in lib/i18n/dictionaries ist dadurch eins zu
   eins: Block raus, Block rein, nichts wird geraten.

   Diese Datei ist bewusst reine Struktur ohne Server-Abhängigkeiten: der
   Editor im Browser liest sie für Tabs, Reihenfolge und Kapitelnummern. */

import { STORY_CHAPTERS, STORY_TODAY } from "@/components/geschichte/storyData";

/* Der Startseiten-Hero hat seinen Editor bereits (Bild, Bildanker, Schleier,
   Botschaft) — der Seiten-Editor verlinkt dorthin statt ihn nachzubauen. */
export const HERO_EDITOR_HREF = "/admin/media";

/* Blattschlüssel, die Struktur sind und kein Text: Link-Ziele und Anker.
   Sie werden angezeigt, aber nicht editiert, und der Store weist jede
   Abweichung vom Code zurück. */
export const LOCKED_KEYS = ["href", "id"];

export const PAGE_ORDER = ["home", "regionen", "geschichte", "kontakt", "magazin", "weine"];

const block = (key, extra = {}) => ({ key, ...extra });

/* `route` ist das App-Router-Muster der Seite — revalidatePath() braucht es
   nach jedem Speichern, weil die Storefront statisch vorgerendert wird.
   `titleFrom` nennt das Feld, dessen Text die Karte betitelt (Regionsname,
   Kapiteltitel); `num` die Kapitelnummer aus storyData. */
export const PAGES = {
  home: {
    route: "/[locale]",
    blocks: [
      block("hero", { editor: "media" }),
      block("philosophy"),
      block("collection"),
      block("origins"),
      block("regions"),
      block("shopBand"),
      block("faq"),
    ],
  },
  regionen: {
    route: "/[locale]/regionen",
    blocks: [
      block("hero"),
      block("intro"),
      block("regions.apulien", { titleFrom: "name" }),
      block("regions.kampanien", { titleFrom: "name" }),
      block("regions.garda", { titleFrom: "name" }),
      block("manifest"),
      block("band"),
      block("faq"),
    ],
  },
  geschichte: {
    route: "/[locale]/geschichte",
    blocks: [
      block("hero"),
      block("name"),
      block("valerio"),
      block("nav"),
      ...STORY_CHAPTERS.map((chapter) =>
        block(`chapters.${chapter.id}`, { num: chapter.num, titleFrom: "title" }),
      ),
      block("today", { num: STORY_TODAY.num }),
      block("stats"),
      block("cta"),
      block("faq"),
    ],
  },
  kontakt: {
    route: "/[locale]/kontakt",
    /* kontakt.faq fehlt mit Absicht: das sind die Fragen selbst, nicht der
       Rahmen — sie gehören in den FAQ-Editor. */
    blocks: [
      block("hero"),
      block("details"),
      block("intents"),
      block("process"),
      block("bridge"),
      block("form"),
    ],
  },
  magazin: {
    route: "/[locale]/magazin",
    blocks: [
      block("marquee"),
      block("cover"),
      block("vision"),
      block("chapters"),
      block("quote"),
      block("pairing"),
      block("social"),
      block("curiosity"),
      block("interviewEmpty"),
      block("wines"),
      block("faq"),
    ],
  },
  weine: {
    route: "/[locale]/unsere-weine",
    blocks: [block("hero"), block("occasioni"), block("help"), block("faq")],
  },
};

export const isPage = (key) => Object.prototype.hasOwnProperty.call(PAGES, key);

export const findBlock = (page, key) =>
  PAGES[page]?.blocks.find((entry) => entry.key === key) ?? null;
