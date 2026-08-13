/* Textový overlay pro stránku Rosato — struktura: components/weine/rosato-puglia/wineData.js */

const rosatoPuglia = {
  shortNameNom: "Rosato",
  shortNameGen: "vína Rosato",
  eyebrow: "Italská butiková vína",
  lede:
    "Negroamaro z vinic alberello v Torricelle a Maruggiu. Čtyři hodiny na slupkách, tři měsíce v nerezu — rosé v barvě broskvové dužiny.",
  heroWords: ["Jemné.", "Svěží.", "Ovocné."],

  breadcrumb: [{ label: "Domů" }, { label: "Naše vína" }, {}],

  facts: [
    { label: "Původ", value: "Salento, Apulie" },
    { label: "Odrůda" },
    { label: "Zrání", value: "3 měsíce v nerezové nádrži" },
    { label: "Teplota podávání", value: "12–14 °C" },
  ],

  colorMoment: {
    kicker: "Barva",
    lines: ["Růžová.", "Jako broskvová dužina."],
    text: "Jen čtyři hodiny kontaktu se slupkami — právě tolik, aby víno získalo svou jemnou, zářivou barvu, aniž by ztratilo lehkost.",
    swatches: [
      { label: "Broskvová dužina" },
      { label: "Jemná růžová" },
      { label: "Teplý odlesk" },
    ],
    artwork: {
      alt: "Olejomalba „Pink and Red Roses“ od Henriho Fantin-Latoura: světle růžové růže s teplými odlesky",
      videoTitle: "Růžová ve sklenici",
    },
  },

  taste: [
    {
      kicker: "Barva",
      title: "Růžová jako broskvová dužina",
      text: "Jemné, zářivé rosé — výsledek pouhých čtyř hodin na slupkách. Světlé ve sklenici, teplé ve světle.",
      artwork: {
        alt: "Láhev Rosato Negroamaro IGP Salento od Maria Maria — čelní pohled na etiketu",
        medium: "Láhev",
      },
    },
    {
      kicker: "Vůně",
      title: "Delikátní, přetrvávající, květinová",
      text: "Jemné květinové tóny, které nevystupují hlasitě, ale zůstávají dlouho. Řízená teplota kvašení zachovává každé aroma.",
      artwork: {
        alt: "Zadní etiketa láhve Rosato Negroamaro IGP Salento od Maria Maria",
        medium: "Zadní etiketa",
      },
    },
    {
      kicker: "Chuť",
      title: "Svěží, vyvážená, elegantně ovocná",
      text: "Na patře svěží a sama v sobě souladná — rosé, jehož ovoce zůstává elegantní, místo aby zesládlo.",
      artwork: {
        alt: "Láhev Rosato Negroamaro IGP Salento od Maria Maria ve vinařství",
        medium: "Ve vinařství",
      },
    },
  ],

  detail: [
    { label: "Označení" },
    { label: "Odrůda" },
    { label: "Původ", value: "Torricella a Maruggio, Salento" },
    { label: "Vedení révy", value: "Výhradně alberello, bez závlahy" },
    {
      label: "Vinifikace",
      value:
        "Alkoholové kvašení za řízené teploty pro zachování aromatu, se 4 hodinami kontaktu se slupkami.",
    },
    { label: "Zrání", value: "3 měsíce v nerezové nádrži až do lahvování" },
    { label: "Obsah alkoholu", value: "12,00 % obj." },
    { label: "Teplota podávání", value: "12–14 °C" },
    { label: "Objem", value: "750 ml" },
    { label: "Upozornění", value: "Obsahuje siřičitany" },
  ],

  story: {
    kicker: "Příběh",
    title: "Čtyři hodiny, které rozhodnou o všem",
    paragraphs: [
      "Negroamaro je tmavá réva — černá je už v jejím jménu. Udělat z ní rosé je otázkou hodin: čtyři hodiny kontaktu mezi moštem a slupkami, pak se oddělí. Déle, a víno by bylo červené.",
      "Hrozny pocházejí z poloh Torricella a Maruggio, vedených výhradně jako alberello — nízké, volně stojící keře Apulie, bez závlahy. Poté tři měsíce klidu v nerezu, aby se svěžest dostala do láhve nedotčená.",
    ],
    quote: {
      text: "Víno pro chvíli před večeří — když den ještě doznívá a večer teprve začíná.",
    },
  },

  place: {
    kicker: "Původ",
    title: "Salento",
    text: "Podpatek italské boty, mezi dvěma moři. Horké dny, chladivé mořské větry a červené, vápenité půdy — Salento je domovem Negroamara.",
    stats: [
      { label: "Region", value: "Salento, Apulie" },
      { label: "Polohy", value: "Torricella a Maruggio" },
      { label: "Vedení révy", value: "Alberello, bez závlahy" },
      { label: "Klasifikace", value: "Negroamaro I.G.P. Salento" },
    ],
    chip: { subtitle: "Apulie · Itálie" },
  },

  pairing: {
    scene: {
      dish: "Burrata s rajčaty a focacciou",
      copy: "Krémová burrata, sluncem zrálá rajčata a teplá focaccia jsou aperitivem, které žije z jednoduchosti a rovnováhy. Rosato Puglia IGP doprovází tento okamžik svěžestí, jemným ovocem a lehkostí, která nepřekryje ani jemnost sýra, ani sladkost rajčat. Právě tato harmonie z něj dělá ideální víno pro časný večer — nekomplikované, středomořské a plné požitku.",
      imageAlt:
        "Burrata s cherry rajčaty, olivami a focacciou na střešní terase ve večerním světle, vedle sklenka Rosata a láhev",
      regionLink: {
        label: "Objevte více o Apulii",
      },
    },
  },

  moment: {
    title: "Takhle chutná Rosato nejlépe",
    serve: {
      title: "Podávání a požitek",
      items: [
        { title: "Teplota podávání", text: "12–14 °C — dobře vychlazené" },
        { title: "Kdy pít", text: "Vychutnat mladé — nejlépe během 1–2 let" },
        { title: "Rituál", text: "Nalévat po troškách a častěji, aby zůstalo ve sklenici svěží" },
      ],
    },
    maria: {
      text: "Pro letní večery na terase — když den ještě doznívá, světlo se otepluje a jídlo zůstává lehké.",
      link: { label: "Objevit více" },
    },
    essence: [
      {
        kicker: "Chuť",
        title: "Svěží, vyvážená, elegantní",
        text: "Jemné květinové tóny, delikátní a přetrvávající — ovoce, které zůstává elegantní, místo aby zesládlo.",
      },
      {
        kicker: "Původ",
        title: "Salento, Apulie",
        text: "Vinice alberello v Torricelle a Maruggiu — čtyři hodiny na slupkách, víc není třeba.",
      },
      {
        kicker: "Odrůda",
        title: "Negroamaro",
        text: "Tmavá réva Salenta — černá je už v jejím jménu. Zde ukazuje svou jemnou stránku.",
      },
    ],
  },

  faq: [
    {
      q: "Jak chutná Rosato Puglia od Maria Maria?",
      a: "Svěže, vyváženě a elegantně ovocně. V nose delikátní a přetrvávající s květinovými tóny, ve sklenici růžové jako broskvová dužina — na patře zůstává ovoce elegantní, místo aby zesládlo: rosé, které žije ze své svěžesti.",
    },
    {
      q: "Je Rosato Puglia suché?",
      a: "Ano — jeho ovoce zůstává elegantní a svěží, aniž by působilo sladce. Pouhé čtyři hodiny na slupkách a tři měsíce klidu v nerezové nádrži zachovávají přesně tuto čistotu, při lehkých 12 % obj.",
    },
    {
      q: "Hodí se Rosato k aperitivu?",
      a: "Je pro něj přímo stvořené: dobře vychlazené při 12 až 14 °C je klasikou před jídlem. Stejně krásně doprovází předkrmy, jednoduché první chody i hlavní chody z modré ryby nebo bílého masa.",
    },
    {
      q: "Jaký je rozdíl mezi rosato a rosé?",
      a: "Ve věci samé žádný: rosato je italské slovo pro rosé. Rozhodující je způsob výroby — naše rosato vzniká z tmavé odrůdy Negroamaro, jejíž mošt zůstává na slupkách jen čtyři hodiny. Barva sedí ve slupce bobule, ne ve šťávě: krátká macerace dá jemnou růžovou místo červeného vína.",
    },
    {
      q: "Co znamená „IGP Salento“?",
      a: "IGP znamená „Indicazione Geografica Protetta“, chráněné zeměpisné označení. Hrozny pocházejí ze Salenta, nejjižnější části Apulie.",
    },
  ],

  similar: {
    kicker: "Objevte podobná vína",
    title: "Pokud se vám líbí Rosato",
    trait: "která hledají tutéž lehkost: ovocná, svěží, nekomplikovaná.",
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

export default rosatoPuglia;
