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
      label: "Dnes · Mettmann u Düsseldorfu",
      title: "Doma v Německu. Osobně spjati s Itálií.",
      paragraphs: [
        "Z Mettmannu přinášíme vybraná vína italských vinařů do gastronomie a vinných barů – osobně, spolehlivě a s opravdovou blízkostí.",
        "Každou objednávku sestavujeme s péčí, aby naše vína dorazila tam, kam patří: na stůl.",
      ],
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
      label: "Začátek · Léto 2019",
      title: "Některé nápady vznikají u stolu.",
      paragraphs: [
        "Mezi dobrým jídlem, otevřenými rozhovory a výjimečnými víny roste myšlenka: najít vína, která ukazují svůj původ, mají charakter a sbližují lidi.",
        "Z toho večera se stává víc než vzpomínka – stává se z něj Maria Maria.",
      ],
      quote: "„Některé nápady nepotřebují byznys plán. Jen ten správný stůl.“",
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
