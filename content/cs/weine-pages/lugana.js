/* Textový overlay pro stránku Lugana — struktura: components/weine/lugana/wineData.js */

const lugana = {
  shortNameNom: "Lugana",
  shortNameGen: "Lugany",
  eyebrow: "Italská butiková vína",
  lede:
    "Z jižního břehu Gardského jezera. Z odrůdy Turbiana na štěrkovitých morénových půdách vzniká bílé víno intenzivní a komplexní vůně — plné, teplé a měkké na patře, s dlouhým aromatickým dozvukem.",
  heroWords: ["Intenzivní.", "Měkké.", "Přetrvávající."],

  breadcrumb: [{ label: "Domů" }, { label: "Naše vína" }, {}],

  facts: [
    { label: "Původ", value: "Gardské jezero – Desenzano a Pozzolengo" },
    { label: "Odrůda" },
    { label: "Zrání", value: "Na kvasnicích až do lahvování" },
    { label: "Teplota podávání", value: "8–10 °C" },
  ],

  colorMoment: {
    kicker: "Barva",
    lines: ["Slámově žlutá.", "Sytá a zářivá."],
    text: "Ve sklenici se Lugana ukazuje v syté, lesklé slámové žluti – barva, která vypráví o hustotě a teple ještě před prvním douškem.",
    swatches: [
      { label: "Světlá sláma" },
      { label: "Slámově žlutá" },
      { label: "Zlatavý lesk" },
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
      title: "Sytá, zářivá slámová žluť",
      text: "Plná žluť s jasným leskem – první dojem ve sklenici slibuje spíš plnost než lehkost.",
      artwork: {
        alt: "Láhev Lugana DOC od Maria Maria — čelní pohled na etiketu",
        medium: "Láhev",
      },
    },
    {
      kicker: "Vůně",
      title: "Konvalinka, hloh a zralé ovoce",
      text: "Intenzivní a komplexní: květinové tóny konvalinky a hlohu, následované zralým ovocem, jemným pečivem a decentním tónem opékání.",
      artwork: {
        alt: "Zadní etiketa láhve Lugana DOC od Maria Maria",
        medium: "Zadní etiketa",
      },
    },
    {
      kicker: "Chuť",
      title: "Plná, teplá, měkká a obalující",
      text: "Na patře široká a sametová, s dobrou perzistencí a harmonickými aromatickými ozvěnami, které dlouho doznívají.",
      artwork: {
        alt: "Láhev Lugana DOC od Maria Maria ve vinařství",
        medium: "Ve vinařství",
      },
    },
  ],

  detail: [
    { label: "Označení" },
    { label: "Odrůda" },
    { label: "Původ", value: "Desenzano a Pozzolengo, Gardské jezero" },
    { label: "Vedení révy", value: "Řadová výsadba s řezem Guyot" },
    {
      label: "Vinifikace",
      value:
        "Bílá vinifikace se sedmidenní kryomacerací na slupkách pro extrakci primárních aromat. Následuje kvašení při řízených 14–16 °C.",
    },
    { label: "Zrání", value: "Na jemných kvasnicích až do lahvování" },
    { label: "Půda", value: "Bohatá na skelet, štěrkovitá matrice" },
    { label: "Teplota podávání", value: "8–10 °C" },
    { label: "Objem", value: "750 ml" },
    { label: "Upozornění", value: "Obsahuje siřičitany" },
  ],

  story: {
    kicker: "Příběh",
    title: "Turbiana a světlo Gardského jezera",
    paragraphs: [
      "Lugana roste na jižním břehu Gardského jezera, mezi Desenzanem a Pozzolengem. Odrůda se zde jmenuje Trebbiano di Lugana – známější je pod svým starým názvem Turbiana.",
      "Vinice stojí na morénových půdách bohatých na skelet a štěrk. Právě tato chudá, propustná struktura dává vínu jeho aromatiku a vůni – nikoli bujnost, ale koncentraci.",
    ],
    quote: {
      text: "Víno, které nese jezero ve sklenici: široké, teplé a klidné.",
    },
    image: {
      alt: "Zralé hrozny Turbiana ve zlatém slunečním světle na keři",
    },
  },

  place: {
    kicker: "Původ",
    title: "Jižní břeh Gardského jezera",
    text: "Mezi Desenzanem a Pozzolengem leží vinice na morénových kopcích Gardského jezera. Jezero zmírňuje teploty, štěrkovité půdy nutí kořeny do hloubky – z toho vzniká aromatika Lugany.",
    stats: [
      { label: "Region", value: "Lombardie" },
      { label: "Oblast", value: "Desenzano · Pozzolengo" },
      { label: "Půda", value: "Bohatá na skelet, štěrkovitá" },
      { label: "Vedení révy", value: "Guyot" },
    ],
    photoAlt: "Vinice na jižním břehu Gardského jezera ve večerním světle",
    chip: { subtitle: "Gardské jezero · Lombardie" },
  },

  pairing: {
    scene: {
      dish: "Rybí rizoto s citronem a bylinkami",
      copy: "Jemné rybí rizoto s citronem a bylinkami si žádá víno, které přináší svěžest a klid zároveň. Lugana DOC se sem hodí obzvlášť dobře, protože elegantně doprovází krémovou texturu rizota a nepřekrývá jemná aromata ryby. Její jemná struktura, světlé ovoce a čistý dozvuk se starají o to, aby každé sousto působilo lehce, vyváženě a velmi souladně.",
      imageAlt:
        "Rybí rizoto s citronem a bylinkami na terase nad Gardským jezerem, vedle sklenka Lugana DOC a láhev",
      regionLink: {
        label: "Objevte oblast Lugana u Gardského jezera",
      },
    },
  },

  moment: {
    title: "Takhle chutná Lugana nejlépe",
    serve: {
      title: "Podávání a požitek",
      items: [
        { title: "Teplota podávání", text: "8–10 °C — ve sklenici na bílé víno" },
        { title: "Kdy pít", text: "Vychutnat nyní nebo během 2–4 let" },
        { title: "Rituál", text: "Chvíle vzduchu ve sklenici otevře vůni i plnost" },
      ],
    },
    maria: {
      text: "Pro široké večery u vody — když je stůl prostřený venku a jezero leží ve sklenici: široké, teplé a klidné.",
      link: { label: "Objevit více" },
    },
    essence: [
      {
        kicker: "Chuť",
        title: "Plná, teplá a měkká",
        text: "Konvalinka, hloh, zralé ovoce a jemné pečivo — obalující, s dlouhým aromatickým dozvukem.",
      },
      {
        kicker: "Původ",
        title: "Jižní břeh Gardského jezera",
        text: "Štěrkovité morénové půdy mezi Desenzanem a Pozzolengem — jezero mírní klima, chudá půda koncentruje.",
      },
      {
        kicker: "Odrůda",
        title: "Turbiana",
        text: "Trebbiano di Lugana — stará bílá réva od jezera, zrající na jemných kvasnicích až do lahvování.",
      },
    ],
  },

  faq: [
    {
      q: "Co je víno Lugana?",
      a: "Lugana je malá, uznávaná apelace bílého vína (DOC) na jižním břehu Gardského jezera, vyráběná z odrůdy Turbiana. Naše Lugana pochází z poloh Desenzano a Pozzolengo.",
      link: { label: "Objevte oblast Lugana u Gardského jezera" },
    },
    {
      q: "Jak chutná Lugana od Maria Maria?",
      a: "Plná, teplá, měkká a obalující, s dobrou perzistencí a harmonickými aromatickými ozvěnami. V nose intenzivní a komplexní: konvalinka a hloh, následované zralým ovocem, jemným pečivem a decentním tónem opékání.",
    },
    {
      q: "Jaká odrůda se pro Luganu používá?",
      a: "Trebbiano di Lugana, nazývaná také Turbiana. Hrozny pocházejí z vinic Turbiany v obcích Desenzano a Pozzolengo na jižním břehu Gardského jezera.",
    },
    {
      q: "Hodí se Lugana k rybám?",
      a: "Ano, vynikajícím způsobem – především k syrovým i tepelně upraveným rybím předkrmům a delikátním prvním chodům. Důležité je jen vyhnout se těžkým omáčkám a dominantnímu koření, aby vedla její jemnost. I jako aperitiv je elegantní volbou.",
    },
    {
      q: "Jaký je rozdíl mezi Luganou a Pinot Grigio?",
      a: "Lugana je bílé víno vázané na svůj původ (DOC) z jižního břehu Gardského jezera, vyráběné z odrůdy Turbiana; Pinot Grigio je naproti tomu název odrůdy bez této vazby na původ. Naše Lugana se ukazuje plná, teplá a měkká na patře — s intenzivní vůní konvalinky a hlohu, zralého ovoce a s dobrou perzistencí.",
    },
  ],

  similar: {
    kicker: "Objevte podobná vína",
    title: "Pokud se vám líbí Lugana",
    trait: "která hledají tutéž svěžest a mineralitu: elegantní a čistá.",
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

export default lugana;
