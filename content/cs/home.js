/* Viz content/de/home.js — stejná struktura ve všech čtyřech jazycích. */

export const home = {
  hero: {
    eyebrow: "Italská butiková vína",
    lede: "Ručně vybíraná vína z malých rodinných vinařství – pro vědomě zvolené chvíle, od aperitivu po velký večer.",
    ctaWines: "Objevit vína",
    ctaShop: "Do e-shopu",
    /* Číslovky se do popisků dosazují za běhu (9 vín, 3 regiony), takže
       tvar musí sedět: u 9 čeština žádá genitiv množného čísla, u 3
       nominativ. Správné tvary nese už content/cs/shop.js. */
    statWines: "Butikových vín",
    statRegions: "Regiony Itálie",
    statSince: "od založení",
    photoAlt:
      "Láhev Maria Maria a sklenka červeného vína na kamenné zídce mezi vinicemi a mořem, za nimi žena v bílých šatech hledící na pobřeží",
  },

  philosophy: {
    eyebrow: "Naše filozofie",
    title: "Italská butiková vína, která se snadno vybírají, vyprávějí i zažívají.",
    description:
      "Osobně vybraná, s jasným původem a určená pro gastronomii, hotelnictví, akce i výjimečné chvíle.",
    moments: {
      selection: {
        title: "Osobní výběr",
        text: "Každé víno osobně ochutnáme a vědomě vybereme. Vzniká tak přehledný butikový sortiment, který hostitel s jistotou doporučí a milovník vína snadno objeví.",
      },
      origin: {
        title: "Původ s rukopisem",
        text: "Spolupracujeme s vybranými rodinnými vinařstvími v Itálii. Region, odrůda a lidé za vínem dávají každé láhvi věrohodný příběh, který stojí za vyprávění.",
      },
      occasion: {
        title: "Stvořená pro chvíle požitku",
        text: "Od aperitivu a snoubení s jídlem po akce a stylové dárky: Maria Maria spojuje chuť, estetiku a italský styl života ve chvílích, které zůstanou v paměti.",
      },
      guidance: {
        title: "Osobní doprovod",
        text: "Přehledný sortiment, srozumitelná doporučení a přímý kontakt usnadňují výběr i použití – pro osobní spolupráci jako rovný s rovným.",
      },
    },
    note: "Pro gastronomii, hotelnictví a výjimečné koncepty",
    cta: "Poznejte Maria Maria jako partnera",
  },

  collection: {
    eyebrow: "Kolekce",
    title: "Naše vína",
    description: "Devět charakterů ze čtyř regionů – každý s vlastním příběhem.",
  },

  origins: {
    title: "Dvě duše,",
    titleAccent: "jedno jméno",
    paragraphs: [
      "Maria Maria začíná v Salentu, v létě roku 2019 — mezi vzpomínkami z dětství a starými řadami révy se z jednoho okamžiku stalo prozření: víno pro nás není nápoj, ale katalyzátor emocí.",
      "Od té doby vede naše cesta od slunečných řad Salenta přes sopečné půdy Kampánie až k jižnímu břehu Gardského jezera — každá láhev je zastávkou, každý region vlastní řečí.",
    ],
    journey: ["Salento", "Apulie", "Kampánie", "Gardské jezero"],
    quote: "„Italian wine, personal selection, share the pleasure.“",
    cta: "Magazín",
  },

  regions: {
    eyebrow: "Původ",
    title: "Kde jsou naše vína doma",
    description:
      "Půda, světlo a klima utvářejí každý hrozen – nakonec je krajina cítit ve sklenici.",
    cta: "Všechny regiony",
    detailCta: "Objevit více",
    items: {
      apulien: {
        name: "Apulie",
        tag: "Srdce jihu",
        desc: "Slunce jihu a plná, silná aromata.",
        long: "Mezi Salentem a Gallipoli dozrávají Primitivo a Negroamaro pod jižním sluncem – silná, teplá vína se středomořskou duší.",
      },
      kampanien: {
        name: "Kampánie",
        tag: "Mezi sopkou a mořem",
        desc: "Sopečné půdy, původní charaktery.",
        long: "V okolí Neapole a Salerna dávají sopečné půdy Vesuvu vínům hloubku a původnost – od Falanghiny po Aglianico.",
      },
      garda: {
        name: "Gardské jezero / Lombardie",
        tag: "Elegance severu",
        desc: "Elegance, svěžest a minerální hloubka.",
        long: "Na jižním břehu Gardského jezera vzniká Lugana – bílé víno vzácné elegance, nesené svěžestí a minerální hloubkou.",
      },
    },
  },

  shopBand: {
    eyebrow: "Oficiální e-shop",
    title: "Připraveni na chuť, která",
    titleAccent: "vás inspiruje?",
    text: "Objevujte a objednávejte naše vína pohodlně online – přímo z vinařství až k vám domů.",
    primary: "Do e-shopu",
    secondary: "Kontaktovat nás",
  },

  faq: {
    eyebrow: "Časté otázky",
    title: "Maria Maria,",
    titleAccent: "krátce vysvětleno.",
    description:
      "Vše, co chcete vědět o našich vínech, o nákupu i o možné spolupráci s Maria Maria.",
    footerNote: "Máte další otázky nebo zájem o spolupráci?",
    footerLabel: "Kontaktujte nás osobně",
  },
};

export default home;
