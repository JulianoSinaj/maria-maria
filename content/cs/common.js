/* Společný rámec: navigace, patička, košík, servisní texty.
   Stejná struktura jako content/de/common.js — poznámky viz tam.

   Značkové výrazy zůstávají v italštině i v české verzi: „Il piacere del
   vino", názvy vín a označení D.O.C./I.G.P. se nepřekládají. */

export const common = {
  nav: {
    home: "Domů",
    wines: "Naše vína",
    regions: "Vinařské regiony",
    regionsShort: "Regiony",
    magazine: "Magazín",
    contact: "Kontakt",
    shop: "Do oficiálního e-shopu",
    /* Short form for the narrow desktop header (see content/de/common.js). */
    shopShort: "Oficiální e-shop",
    wineTypes: {
      red: "Červená vína",
      white: "Bílá vína",
      rose: "Růžová vína",
    },
  },

  a11y: {
    skipToContent: "Přejít k obsahu",
    homeLink: "Maria Maria — úvodní stránka",
    mainNav: "Hlavní navigace",
    mobileNav: "Mobilní navigace",
    openMenu: "Otevřít menu",
    closeMenu: "Zavřít menu",
    menuDialog: "Menu",
  },

  wineMenu: {
    eyebrow: "Kolekce",
    overview: {
      all: { label: "Všechna vína", hint: "Kompletní kolekce" },
      bestseller: { label: "Bestsellery", hint: "Co nejčastěji končí ve sklenici" },
      regions: { label: "Italské regiony", hint: "Původ a terroir" },
    },
    shop: "Do oficiálního e-shopu",
    note: "Ručně vybíraná z malých italských vinařství.",
    seeAll: "Zobrazit všech {count} vín",
  },

  footer: {
    /* aria-label des Mail-Icons in der Social-Reihe */
    mailLabel: "E-mailová adresa",
    instagramLabel: "Maria Maria na Instagramu",
    facebookLabel: "Maria Maria na Facebooku",
    tagline: "Italská butiková vína pro vědomě zvolené chvíle potěšení.",
    exploreHeading: "Objevujte",
    explore: {
      wines: "Naše vína",
      regions: "Italské regiony",
      magazine: "Magazín",
      contact: "Kontakt",
    },
    contactHeading: "Kontakt",
    shopHeading: "Oficiální e-shop",
    shopText: "Objevte a objednejte naše vína přímo v e-shopu Maria Maria.",
    shopLink: "Do oficiálního e-shopu",
    legal: {
      privacy: "Ochrana osobních údajů",
      imprint: "Tiráž",
      terms: "Obchodní podmínky",
    },
    copyright: "Maria Maria Wines — Il piacere del vino",
  },

  /* Viditelný text katalogu — struktura je v components/data.js.
     `notes` je seznam, nikoli věta: joinList() v lib/i18n/format z něj složí
     „Intenzivní, silné a vyvážené". */
  catalogue: {
    types: { red: "Červené víno", white: "Bílé víno", rose: "Růžové víno" },
    typesPlural: { red: "Červená vína", white: "Bílá vína", rose: "Růžová vína" },
    regions: { puglia: "Apulie", campania: "Kampánie", garda: "Gardské jezero" },
    filters: {
      allWines: "Všechna vína",
      allRegions: "Všechny regiony",
      reset: "Zrušit filtry",
      /* Čeština má tři tvary: 1 víno, 2–4 vína, od 5 vín.
         pluralUnit() v lib/i18n/format.js vybírá podle počtu. */
      wineOne: "víno",
      wineFew: "vína",
      wineMany: "vín",
      byType: "Filtrovat vína podle druhu",
      byRegion: "Filtrovat vína podle regionu",
      regionAxis: "Region",
      allShort: "Vše",
      emptyTitle: "Pro tento výběr",
      emptyTitleAccent: "momentálně žádné víno nemáme.",
      emptyText:
        "Zkuste jinou kombinaci druhu a regionu – nebo prozkoumejte celou kolekci.",
    },
    wines: {
      "primitivo-15-5": {
        notes: ["intenzivní", "silné", "vyvážené"],
        pairing: "K dušenému masu, zvěřině a zrajícím sýrům.",
      },
      lugana: {
        notes: ["elegantní", "svěží", "minerální"],
        pairing: "Ideální k rybám, těstovinám s pestem nebo bílému masu.",
      },
      "greco-di-tufo": {
        notes: ["strukturované", "jemné", "aromatické"],
        pairing: "K mořským plodům, grilovaným rybám a vytříbené kuchyni.",
      },
      "primitivo-14-5": {
        notes: ["měkké", "plné", "harmonické"],
        pairing: "Ideální k těstovinám, grilovaným pokrmům a zralým sýrům.",
      },
      "primitivo-salento": {
        notes: ["ovocné", "kulaté", "přístupné"],
        pairing: "Nenáročné k pizze, těstovinám a večerům ve společnosti.",
      },
      falanghina: {
        notes: ["svěží", "ovocné", "živé"],
        pairing: "Skvělé k aperitivu, mořským plodům nebo salátům.",
      },
      "rosato-puglia": {
        notes: ["jemné", "ovocné", "osvěžující"],
        pairing: "Výborné k antipasti, salátům nebo grilované zelenině.",
      },
      "il-rosso-aglianico": {
        notes: ["hluboké", "kořeněné", "výrazné"],
        pairing: "Společník k zapékaným těstovinám, grilovanému masu a sýrům.",
      },
      "il-bianco-greco-cuvee": {
        notes: ["svěží", "elegantní", "vyvážené"],
        pairing: "Potěšení k antipasti, rybám a lehkým pokrmům.",
      },
    },
  },

  cart: {
    title: "Váš košík",
    items: "položek",
    itemOne: "položka",
    itemFew: "položky",
    open: "Otevřít košík",
    close: "Zavřít košík",
    label: "Košík",
    increase: "Zvýšit množství {name}",
    decrease: "Snížit množství {name}",
    remove: "Odebrat {name} z košíku",
    empty: {
      title: "Zatím zcela",
      titleAccent: "prázdný.",
      text: "Objevte naše butiková vína a degustační balíčky – váš okamžik Maria už čeká.",
      cta: "Objevit vína",
    },
    success: {
      title: "Grazie",
      titleAccent: "mille!",
      text: "Děkujeme za vaši objednávku. Potvrzení je již na cestě do vaší schránky.",
      orderNumber: "Číslo objednávky",
      cta: "Pokračovat v prohlížení",
    },
    missingForFreeShipping: "Ještě {amount} do dopravy zdarma",
    freeShippingReached: "Vaše objednávka má dopravu zdarma",
    summary: {
      subtotal: "Mezisoučet",
      shipping: "Doprava",
      free: "Zdarma",
      total: "Celkem",
      vat: "včetně DPH",
      checkout: "K pokladně",
      secure: "Bezpečná platba · šifrováno SSL",
    },
  },

  shop: {
    badges: {
      bestseller: "Bestseller",
      limited: "Limitovaná edice",
      popular: "Oblíbené",
      summer: "Letní víno",
    },
    edition: "{count} lahví",
    /* 3 lahve (Trio) vs. 6 lahví (Grande Selezione) — dva různé tvary. */
    bottles: "{count} lahví",
    bottlesFew: "{count} lahve",
    limitedEdition: "Limitovaná edice · {count} lahví",
    scarce: "Zbývá jen několik lahví",
    single: "Jednotlivě",
    save: "Ušetříte {amount}",
    bundleSub: "Degustační balíček · {count} lahví",
    bundleSubFew: "Degustační balíček · {count} lahve",
    bundles: {
      "paket-trio-rosso": {
        tag: "Síla jihu",
        desc: "Tři výrazná červená vína z Apulie a Kampánie – od měkkého Primitiva po kořeněné Aglianico.",
      },
      "paket-grande-selezione": {
        tag: "Nejoblíbenější volba",
        desc: "Šest vín, tři původy – celá rozmanitost Itálie v jednom balíčku. Doprava zdarma až k vám domů.",
      },
      "paket-trio-bianco": {
        tag: "Svěžest a elegance",
        desc: "Tři elegantní bílá vína od Gardského jezera a z Kampánie – minerální, jemná a živá ve sklenici.",
      },
    },
  },

  ui: {
    discoverWine: "Poznat víno",
    wineDetails: "{name} — zobrazit detail",
    bottleAlt: "Láhev {name}",
    bottleFront: "Přední strana",
    bottleBack: "Zadní strana",
    bottleFrontAlt: "Láhev {name} – přední strana",
    bottleBackAlt: "Láhev {name} – zadní strana",
    showSide: "Zobrazit: {side}",
    prevWine: "Předchozí víno",
    nextWine: "Další víno",
    prevWines: "Předchozí vína",
    moreWines: "Další vína",
    back: "Zpět",
    next: "Dál",
    wholeCollection: "Celá kolekce",
    winesLabel: "vín",
    addToCart: "Vložit {name} do košíku",
    removeBottle: "Odebrat jednu láhev {name}",
    addBottle: "Přidat další láhev {name}",
    addBundle: "Vložit balíček do košíku",
    added: "Přidáno",
    viewCart: "Zobrazit košík",
    priceNote: "Všechny ceny včetně DPH, bez dopravy",
    perBottle: "/ 0,75 l",
    faqTopics: "Témata častých dotazů",
    discoverMore: "Objevit více",
  },

  souls: {
    roots: {
      name: "Maria",
      tag: "Kořeny",
      traits: ["Rodina", "Pohostinnost", "Vzpomínka"],
      desc: "V Lizzanu začíná osobní příběh za jménem – v kultuře, kde víno, jídlo a společně strávený čas patří k sobě.",
    },
    today: {
      name: "Maria",
      tag: "Dnešní pohled",
      traits: ["Výběr", "Estetika", "Nové perspektivy"],
      desc: "Vědomě vybírat italská vína, vyprávět o jejich regionech a přibližovat je lidem v různých zemích.",
    },
  },

  winePage: {
    atAGlance: "V kostce",
    factsHeading: "To nejdůležitější o víně {wineNom}",
    vintage: "Ročník",
    limitedEdition: "Limitovaná edice · pouze",
    shopEyebrow: "Oficiální e-shop",
    allWines: "Všechna vína",
    heroCtaShop: "Objevte je v oficiálním e-shopu",
    heroCtaTaste: "Poznejte víno",
    faqEyebrow: "Časté otázky",
    faqTitle: "Dobré",
    faqTitleAccent: "vědět.",
    faqDescription:
      "Odpovědi na nejčastější otázky k vínu {wine} — od chuti a původu až po podávání. Technické údaje pocházejí z technického listu vína.",
    faqFooter: "Nenašli jste svou otázku? Napište nám",
    storyFallbackAlt: "Ruční sběr hroznů a zrání ve vinném sklepě",
    tones: "Tóny vína",
    essence: "Esence vína",
    prevCard: "Předchozí karta",
    nextCard: "Další karta",
    cards: "Karty",
    sections: "Části této stránky",

    /* Viz content/de/common.js — podtitul sekce SimilarWines.
       Čeština klade před vztažnou větu čárku, similarJoin je proto „, ".
       Podstatná jména jsou střední rod množného čísla („vína"), protože se
       na ně váže vztažné zájmeno „která" a přívlastky v wine.similar.trait.
       similarCounts uvádí jen 2–4: od pěti výš by čeština vyžadovala genitiv
       („pět vín"), a tím i jinou shodu. Seznam similar.names má vždy tři
       položky; mimo rozsah kód vypíše číslici. */
    similarLead: "{count} {noun} z naší kolekce",
    similarJoin: ", ",
    similarCounts: { 2: "Dvě", 3: "Tři", 4: "Čtyři" },
    similarNouns: {
      all: "vína",
      red: "červená vína",
      white: "bílá vína",
      rose: "růžová vína",
    },
    allWinesCta: "Zobrazit všechna vína",
    subnavCta: "Objevit",
  },

  language: {
    label: "Jazyk",
    ariaLabel: "Zvolit jazyk",
    current: "Aktuální jazyk",
  },

  errors: {
    eyebrow: "Došlo k chybě",
    title: "Tohle nebyl náš",
    titleAccent: "nejlepší ročník.",
    text: "Něco se pokazilo. Zkuste to prosím znovu — nebo se vraťte na úvodní stránku.",
    retry: "Zkusit znovu",
    home: "Na úvodní stránku",
  },

  notFound: {
    eyebrow: "Stránka nenalezena",
    title: "Tato láhev",
    titleAccent: "v našem sklepě není.",
    text: "Hledaná stránka neexistuje nebo byla přesunuta. Objevte místo toho naše vína — to nejlepší je stejně tam.",
    wines: "Naše vína",
    home: "Na úvodní stránku",
  },
};

export default common;
