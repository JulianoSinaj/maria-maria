/* Textový overlay pro stránku Greco di Tufo — struktura: components/weine/greco-di-tufo/wineData.js */

const grecoDiTufo = {
  shortNameNom: "Greco",
  shortNameGen: "Greca",
  eyebrow: "Italská butiková vína",
  lede:
    "Z vulkanického tufu v srdci Irpinie. Bílé víno intenzivní a jemné vůně, slámově žluté barvy se zlatavými odlesky a se svěží, svůdnou chutí.",
  heroWords: ["Intenzivní.", "Jemné.", "Svůdné."],

  breadcrumb: [{ label: "Domů" }, { label: "Naše vína" }, {}],

  facts: [
    { label: "Původ", value: "Kampánie – Irpinie" },
    { label: "Odrůda" },
    { label: "Zrání", value: "1 rok v nerezové nádrži" },
    { label: "Teplota podávání", value: "cca 10 °C" },
  ],

  colorMoment: {
    kicker: "Barva",
    lines: ["Slámově žlutá.", "Se zlatavými odlesky."],
    text: "Ve sklenici Greco září teple a hluboce – bílé víno, jehož zlatavé odlesky vyprávějí o struktuře a zralosti ještě před prvním douškem.",
    swatches: [
      { label: "Světlá sláma" },
      { label: "Slámově žlutá" },
      { label: "Zlatavý odlesk" },
    ],
    artwork: {
      alt: "Olejomalba „Stohy, konec léta“ od Clauda Moneta: pole ve slámových a zlatých tónech ve večerním světle",
      title: "Stohy, konec léta",
      videoTitle: "Slámová žluť ve sklenici",
    },
  },

  taste: [
    {
      kicker: "Barva",
      title: "Slámově žlutá se zlatavými odlesky",
      text: "Teplá, zářivá žluť – první dojem ve sklenici slibuje hloubku, ne lehkost.",
      artwork: {
        alt: "Láhev Greco di Tufo D.O.C.G. od Maria Maria — čelní pohled na etiketu",
        medium: "Láhev",
      },
    },
    {
      kicker: "Vůně",
      title: "Intenzivní a příjemná",
      text: "Výrazný buket: žluté peckoviny, citrusová kůra a jemný minerální tón z tufové půdy.",
      artwork: {
        alt: "Zadní etiketa láhve Greco di Tufo D.O.C.G. od Maria Maria",
        medium: "Zadní etiketa",
      },
    },
    {
      kicker: "Chuť",
      title: "Svěží, jemná a svůdná",
      text: "Na patře svěží a zároveň delikátní – bílé víno se strukturou, které svádí potichu, místo aby křičelo.",
      artwork: {
        alt: "Láhev Greco di Tufo D.O.C.G. od Maria Maria ve vinařství",
        medium: "Ve vinařství",
      },
    },
  ],

  detail: [
    { label: "Označení" },
    { label: "Odrůda" },
    { label: "Původ", value: "Kampánie, Itálie" },
    { label: "Sběr", value: "Konec první poloviny října" },
    {
      label: "Vinifikace",
      value: "Šetrné lisování celých hroznů, jablečno-mléčná fermentace neproběhla úplně.",
    },
    { label: "Zrání", value: "1 rok v nerezové nádrži" },
    { label: "Obsah alkoholu", value: "13,0 % obj." },
    { label: "Teplota podávání", value: "cca 10 °C" },
    { label: "Objem", value: "750 ml" },
    { label: "Upozornění", value: "Obsahuje siřičitany" },
  ],

  story: {
    kicker: "Příběh",
    title: "Řecká réva na vulkanickém podloží",
    paragraphs: [
      "Podle tradice přišlo Greco do jižní Itálie s řeckými osadníky – a našlo svůj domov kolem vesnice Tufo v Irpinii. Název místa je zároveň jeho tajemstvím: tuf, porézní vulkanická hornina, která dává révě mineralitu a napětí.",
      "Greco di Tufo patří k několika málo bílým vínům Itálie s označením D.O.C.G. – nejvyšším stupněm původu v zemi. Hrozny se sbírají teprve na konci první poloviny října, šetrně se lisují v celých hroznech a poté zrají rok v nerezové nádrži.",
    ],
    quote: {
      text: "Víno charakteru a klidu – pro večery, kdy se nikdo nedívá na hodinky.",
    },
  },

  place: {
    kicker: "Původ",
    title: "Tufo v Irpinii",
    text: "V hornatém vnitrozemí Kampánie, kolem vesnice Tufo, leží vinice na vulkanickém tufu. Nadmořská výška, chladné noci a minerální půdy dávají Grecu jeho strukturu – i jeho dlouhověkost.",
    stats: [
      { label: "Region", value: "Kampánie" },
      { label: "Oblast", value: "Irpinie · Tufo" },
      { label: "Sběr", value: "Polovina října" },
      { label: "Půda", value: "Vulkanický tuf" },
    ],
    photoAlt: "Vinice nad Neapolským zálivem s výhledem na Vesuv",
    chip: { subtitle: "Irpinie · Kampánie" },
  },

  pairing: {
    scene: {
      dish: "Spaghetti alle Vongole",
      copy: "Spaghetti alle vongole žijí z čistoty: mušle, olivový olej, česnek a závan mořského aroma. Právě v tom spočívá síla Greco di Tufo DOCG. Jeho minerální napětí, svěžest a přesná struktura zachytí slanou eleganci pokrmu, aniž by se draly do popředí. Vzniká tak spojení, které dává obzvlášť autenticky pocítit pobřeží Kampánie.",
      imageAlt:
        "Spaghetti alle vongole na talíři v tratorii, vedle sklenka Greco di Tufo a láhev",
      regionLink: {
        label: "Objevte více o Kampánii",
      },
    },
  },

  moment: {
    title: "Takhle chutná Greco nejlépe",
    serve: {
      title: "Podávání a požitek",
      items: [
        { title: "Teplota podávání", text: "cca 10 °C — ve sklenici na bílé víno" },
        { title: "Kdy pít", text: "Vychutnat nyní nebo během 3–5 let" },
        { title: "Úvod", text: "Vyndat z lednice krátce před podáváním" },
      ],
    },
    maria: {
      text: "Pro večery, kdy se nikdo nedívá na hodinky — sklenka Greca, dobré rozhovory a čas, který se zastavil.",
      link: { label: "Objevit více" },
    },
    essence: [
      {
        kicker: "Chuť",
        title: "Svěží, jemná a svůdná",
        text: "Žluté peckoviny, citrusová kůra a jemný minerální tón — bílé víno se strukturou, které svádí potichu.",
      },
      {
        kicker: "Původ",
        title: "Tufo, Irpinie",
        text: "Vinice na vulkanickém tufu v hornatém vnitrozemí Kampánie — nadmořská výška a chladné noci dávají napětí.",
      },
      {
        kicker: "Odrůda",
        title: "Greco",
        text: "Do jižní Itálie přišlo s řeckými osadníky — dnes jedno z mála bílých vín Itálie se statusem D.O.C.G.",
      },
    ],
  },

  faq: [
    {
      q: "Jak chutná Greco di Tufo?",
      a: "Ve vůni intenzivní a příjemné, ve sklenici slámově žluté se zlatavými odlesky – a na patře svěží, jemné a svůdné. Bílé víno se strukturou, které zůstává přístupné.",
    },
    {
      q: "Co znamená DOCG u Greco di Tufo?",
      a: "D.O.C.G. znamená „Denominazione di Origine Controllata e Garantita“ – nejvyšší stupeň původu v italském vinařském právu. Greco di Tufo je jedním z mála bílých vín Itálie s touto klasifikací.",
    },
    {
      q: "Je Greco di Tufo minerální?",
      a: "Ano. Vinice kolem vesnice Tufo leží na vulkanickém tufu, který vínu dodává jemný minerální tón a napětí. Spolu s nadmořskou výškou a chladnými nocemi tak vzniká jeho typická struktura – svěžest s hloubkou.",
    },
    {
      q: "K jakému jídlu se hodí Greco di Tufo?",
      a: "Skvěle k rybím pokrmům, mořským plodům, sýrům a rizotu — obzvlášť překvapivě chutná k mozzarelle di bufala. Se svou strukturou Greco doprovází jemnou kuchyni, aniž by ji přehlušilo; podávejte je dobře vychlazené kolem 10 °C ve sklenici na bílé víno.",
    },
    {
      q: "Jaký je rozdíl oproti Falanghině?",
      a: "Greco přináší strukturu, zlatavé odlesky a minerální tón z tufové půdy – bílé víno se statusem D.O.C.G., které svádí potichu. Falanghina z Beneventana je měkčí, světlejší v ovoci a bezprostřednější. Krátce: Greco pro hloubku, Falanghina pro lehký začátek.",
      link: { label: "Objevte Falanghinu" },
    },
  ],

  similar: {
    kicker: "Objevte podobná vína",
    title: "Pokud se vám líbí Greco",
    trait: "která přinášejí tutéž čistotu: svěží, jemná, minerální.",
  },

  cta: {
    title: "Chcete objevit víc?",
    text: "Objevte všechna naše vína v oficiálním obchodě Maria Maria.",
    button: { label: "Do oficiálního obchodu" },
  },

  subnav: [
    { label: "Přehled" },
    { label: "Chuť" },
    { label: "Ladí s" },
    { label: "Otázky" },
  ],
};

export default grecoDiTufo;
