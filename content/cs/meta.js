/* Texty pro vyhledávače, stránka po stránce.
   Stejná struktura jako content/de/meta.js — poznámky viz tam.
   Značkový přípony („— Maria Maria") doplňuje title.template. */

export const meta = {
  siteTitle: "Maria Maria — Il piacere del vino",
  siteDescription: "Italská butiková vína pro vědomě zvolené chvíle potěšení.",
  orgDescription:
    "Osobně vybíraná italská butiková vína z Apulie, Kampánie a od Gardského jezera.",

  home: {
    title: "Maria Maria — Il piacere del vino",
    description: "Italská butiková vína pro vědomě zvolené chvíle potěšení.",
  },

  collection: {
    title: "Naše vína",
    description:
      "Ručně vybíraná italská butiková vína z malých vinařství – červená, bílá a růžová z Apulie, Kampánie a od Gardského jezera.",
  },

  shop: {
    title: "E-shop",
    description:
      "Oficiální e-shop Maria Maria: italská butiková vína v limitované edici a degustační balíčky, doprava zdarma od 69 €. Italian wine, personal selection.",
  },

  geschichte: {
    title: "Náš příběh",
    description:
      "Dvě ženy, dvě generace, jeden postoj k vínu: z Lizzana v Salentu přes Irpinii a Gardské jezero až do Düsseldorfu — osobně vybíraná vína, v Německu od roku 2019.",
    keywords: [
      "Maria Maria",
      "příběh",
      "italská vína",
      "Salento",
      "Lizzano",
      "Gardské jezero",
      "Kampánie",
      "Düsseldorf",
    ],
    ogImageAlt:
      "Láhev Maria Maria se sklenkou červeného vína a olivami na prosluněné kamenné terase",
  },

  magazin: {
    title: "Magazín",
    description:
      "Znalosti o víně, snoubení s jídlem, regiony a příběhy ze světa Maria Maria — inspirace pro další chvíli požitku.",
    keywords: [
      "vinařský magazín",
      "znalosti o víně",
      "snoubení vína a jídla",
      "italská vína",
      "chvíle potěšení",
      "Maria Maria",
    ],
    ogImageAlt: "Vinař zkoumá sklenku červeného vína mezi sudy barrique ve sklepě",
  },

  regionen: {
    titleAbsolute: "Italské vinařské regiony: Apulie, Kampánie a Lugana | Maria Maria",
    description:
      "Objevte vybraná vína z Apulie, Kampánie a oblasti Lugana u Gardského jezera – odrůdy, původ, chuť a tipy na snoubení s jídlem.",
  },

  kontakt: {
    titleAbsolute: "Kontakt | Italská vína pro gastronomii a akce | Maria Maria",
    description:
      "Italská butiková vína pro gastronomii, lahůdky, obchod, akce a degustace v Düsseldorfu a NRW. Osobní poradenství a individuální výběr vín.",
  },

  agb: {
    title: "Obchodní podmínky",
    description: "Všeobecné obchodní podmínky pro objednávky v e-shopu Maria Maria.",
  },

  datenschutz: {
    title: "Zásady ochrany osobních údajů",
    description:
      "Informace o zpracování osobních údajů na maria-maria.de v souladu s GDPR.",
  },

  impressum: {
    title: "Tiráž",
    description: "Tiráž a údaje o společnosti Maria Maria Wines GmbH, Mettmann.",
  },

  /* Devět stránek vín — šablony, nikoli hotové věty: název, ročník, druh,
     region, charakteristiku a doporučení k jídlu doplní lib/seo/wine.js
     z přeloženého katalogu. Název značky sem nepatří, připojí ho
     title.template v layoutu. */
  wine: {
    title: "{name} {year} · {type} · {region}",
    description:
      "{name} ({year}) — {type}, {region}. {notes}. {pairing} Za {price} u Maria Maria.",
    ogImageAlt: "Láhev {name} od Maria Maria — {type}, {region}",
  },

  notFound: {
    title: "Stránka nenalezena",
  },
};

export default meta;
