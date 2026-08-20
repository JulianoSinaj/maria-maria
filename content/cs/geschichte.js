/* Viz content/de/geschichte.js — stejná struktura ve všech čtyřech
   jazycích. Jména značky, míst a odrůd zůstávají beze změny; krátká
   italská slova na fotografiích (`micro`) jsou ve všech jazycích stejná. */

export const geschichte = {
  hero: {
    eyebrow: "Maria Maria · Náš příběh",
    titleLines: ["Dvě ženy.", "Dvě generace.", "Jeden postoj", "k vínu."],
    paragraphs: [
      "Jméno Maria Maria spojuje vzpomínku a přítomnost. Osobní kořeny v Salentu utvářejí postoj, který propojuje původ, charakter a společný požitek.",
      "Od roku 2019 působí Maria Maria v Německu, se sídlem v Düsseldorfu a s výběrem, který je určen pro Německo i další země.",
    ],
    ctaStory: "Objevit příběh",
    ctaWines: "Poznat naše vína",
    journey: ["V Německu od roku 2019", "Sídlo v Düsseldorfu", "Italský původ"],
    photoAlt:
      "Dvě generace u dlouhé tabule pod pergolou, před nimi dvě lahve Maria Maria",
    photoBadge: "Osobně vybráno",
  },

  name: {
    eyebrow: "Jméno",
    titleLines: ["Dvě Marie.", "Vzpomínka a přítomnost."],
    paragraphs: [
      "Jméno Maria Maria v sobě nese pouto mezi dvěma ženami a dvěma generacemi.",
      "Starší Maria představuje Lizzano, rodinu, pohostinnost a vinařskou kulturu, která se žije u společného stolu.",
      "Mladší Maria přenáší tento postoj do přítomnosti: se současným pohledem a osobním výběrem italských vín.",
    ],
    quote: "„Co zůstává, nese se dál s novým pohledem.“",
  },

  valerio: {
    eyebrow: "Majitel · Dovoz a výběr vín",
    title: "Valerio Caniglia: podnikatel za značkou Maria Maria",
    paragraphs: [
      "Valerio Caniglia přináší více než 30 let zkušeností ze světa vína. Rozumí trhům, lidem i vínům a s jistým instinktem vybírá producenty, kteří se hodí k Maria Maria.",
      "Díky citlivosti, spolehlivosti a mezinárodní síti zajišťuje, aby každá láhev přenesla naše hodnoty do sklenky.",
    ],
    cta: "Maria Maria pro gastronomii a specializovaný maloobchod",
    href: "/kontakt",
    imageLabel: "Portrét Valeria Caniglii",
  },

  nav: {
    ariaLabel: "Kapitoly tohoto příběhu",
  },

  chapters: {
    anfang: {
      label: "Začátek · 2019",
      title: "Z Německa. S italskými kořeny.",
      paragraphs: [
        "Od roku 2019 působí Maria Maria v Německu. Značka sídlí v Düsseldorfu – její osobní a kulturní původ vede do Lizzana v Salentu.",
        "Ze spojení dvou generací vznikl výběr, v němž každá láhev představuje jedno místo, jednu odrůdu a jedno vědomé rozhodnutí.",
      ],
      quote:
        "„Víno začíná u svého původu – a své místo nachází tam, kde ho lidé sdílejí.“",
      linkLabel: "Objevit náš výběr vín",
      alt: "Prostřený stůl se sklenicemi vína a originální lahví Maria Maria",
      micro: "La tavola lunga",
    },
    salento: {
      label: "Salento · Lizzano",
      title: "Kde leží kořeny",
      paragraphs: [
        "V Salentu začíná vinařská řeč Maria Maria. Krajinu kolem Lizzana utvářejí červená země, středomořská vegetace, světlo a blízkost Jónského moře.",
        "Zde leží osobní kořeny jména i východisko výběru, v němž Primitivo představuje hřejivost, hloubku a nezaměnitelný původ.",
      ],
      linkLabel: "Objevit Salento a naše vína Primitivo",
      alt: "Červená země a vinice u Lizzana v Salentu",
      micro: "Terra rossa",
      caption: "Réva, středomořské světlo a blízkost Jónského moře.",
    },
    duesseldorf: {
      label: "Od roku 2019 · Düsseldorf",
      title: "Doma v Německu. S pohledem za hranice.",
      paragraphs: [
        "Značka Maria Maria působí v Německu od roku 2019 a sídlí v Düsseldorfu. Odtud se osobně vybíraná italská vína dostávají k lidem v Německu i v dalších zemích.",
        "Düsseldorf je sídlem značky – ne hranicí jejího výběru. Rozhodující zůstávají původ, charakter a příběh za každým vínem.",
      ],
      linkLabel: "Objevit náš výběr vín",
      alt: "Prostřený večerní stůl s červeným vínem Maria Maria za soumraku",
      micro: "Dall’Italia, oltre i confini",
    },
  },

  today: {
    label: "Výběr",
    title: "Co přivádí víno k Maria Maria",
    intro:
      "O výběru nerozhoduje jediné město ani krátkodobý trend. Rozhodující jsou původ, charakter a způsob, jakým víno doprovází chvíle u stolu.",
  },

  stats: [
    {
      label: "Původ místo nahodilosti",
      detail:
        "V každém víně musí být znát jeho region, odrůda i vlastní charakter.",
    },
    {
      label: "Charakter místo trendu",
      detail:
        "Žádné zaměnitelné etikety, ale vína s jasnou identitou a původem, který je stále znát.",
    },
    {
      label: "Požitek, který se sdílí",
      detail:
        "Víno nachází svůj smysl ve chvílích, pokrmech a setkáních, které doprovází.",
    },
  ],

  cta: {
    ariaLabel: "Pokračovat k regionům",
    text: "Každé víno začíná na jednom místě. Jeho příběh se dál píše u stolu.",
  },

  /* Kopf der B2B-FAQ am Seitenende — die Fragen selbst liegen in faq.js
     (faq.geschichte). */
  faq: {
    eyebrow: "Otázky & odpovědi",
    title: "Časté otázky gastronomie,",
    titleAccent: "obchodu & partnerů.",
    description:
      "Na co se nás ptají restaurace, vinné bary, hotely, obchodníci a pořadatelé, než začneme spolupracovat — zodpovězeno z praxe. Co zde zůstane otevřené, vyjasníme osobně.",
    footerLabel: "Vaše otázka tu není? Napište nám",
  },
};

export default geschichte;
