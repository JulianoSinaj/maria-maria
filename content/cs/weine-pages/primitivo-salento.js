/* Textový overlay pro stránku Primitivo Salento — struktura: components/weine/primitivo-salento/wineData.js */

const primitivoSalento = {
  shortNameNom: "Primitivo",
  shortNameGen: "Primitiva",
  eyebrow: "Italská butiková vína",
  lede:
    "100 % Primitivo z Torricelly a Lizzana. Vedení alberello bez závlahy, dlouhá macerace na slupkách a dvanáct měsíců v nerezu — zralé ovoce s hloubkou.",
  heroWords: ["Intenzivní.", "Zralé.", "Přetrvávající."],

  breadcrumb: [{ label: "Domů" }, { label: "Naše vína" }, {}],

  facts: [
    { label: "Původ", value: "Salento, Apulie" },
    { label: "Odrůda" },
    { label: "Zrání", value: "12 měsíců v nerezu" },
    { label: "Teplota podávání", value: "16–18 °C" },
  ],

  colorMoment: {
    kicker: "Barva",
    lines: ["Rubínová.", "Velmi intenzivní."],
    text: "Dlouhá macerace se ve sklenici pozná: hustá, velmi intenzivní rubínová, která propouští jen málo světla.",
    swatches: [
      { label: "Rubínová" },
      { label: "Tmavá švestka" },
      { label: "Višňový odlesk" },
    ],
    artwork: {
      alt: "Olejomalba „Roses in a Bowl“ od Henriho Fantin-Latoura: růže v rubínových a krémových tónech na hluboce tmavém pozadí",
      videoTitle: "Rubínová ve sklenici",
    },
  },

  taste: [
    {
      kicker: "Barva",
      title: "Velmi intenzivní rubínová",
      text: "Hustá, velmi intenzivní rubínová — barva vína, které dlouho leželo na slupkách.",
      artwork: {
        alt: "Láhev Primitivo IGP Salento od Maria Maria — čelní pohled na etiketu",
        medium: "Láhev",
      },
    },
    {
      kicker: "Vůně",
      title: "Švestka a sušené ovoce",
      text: "Komplexní kytice s výraznými tóny švestky a sušeného ovoce — zralá strana Salenta.",
      artwork: {
        alt: "Zadní etiketa láhve Primitivo IGP Salento od Maria Maria",
        medium: "Zadní etiketa",
      },
    },
    {
      kicker: "Chuť",
      title: "Intenzivní, přetrvávající a přístupná",
      text: "V chuti intenzivní a dlouze přetrvávající, přitom příjemně přístupné a s bezprostřední pitelností.",
      artwork: {
        alt: "Láhev Primitivo IGP Salento od Maria Maria ve vinařství",
        medium: "Ve vinařství",
      },
    },
  ],

  detail: [
    { label: "Označení" },
    { label: "Odrůda" },
    { label: "Původ", value: "Torricella a Lizzano, Salento" },
    { label: "Vedení révy", value: "Výhradně alberello, bez závlahy" },
    {
      label: "Vinifikace",
      value:
        "Alkoholové kvašení za řízené teploty pro zachování aromat a barvy, se 7–8 dny kontaktu se slupkami. Následuje lehké lisování slupek.",
    },
    { label: "Zrání", value: "12 měsíců v nerezové nádrži až do lahvování" },
    { label: "Obsah alkoholu", value: "14,5 % obj." },
    { label: "Teplota podávání", value: "16–18 °C" },
    { label: "Objem", value: "750 ml" },
    { label: "Upozornění", value: "Obsahuje siřičitany" },
  ],

  story: {
    kicker: "Příběh",
    title: "Alberello, bez závlahy",
    paragraphs: [
      "Hrozny pocházejí z vinic Primitiva v Torricelle a Lizzanu — vedených výhradně jako alberello, nízký keřový tvar jižní Itálie, a zcela bez závlahy. Réva si vodu obstará sama, hluboko v půdě.",
      "Dlouhá macerace na slupkách je klíčem: vynáší na povrch výrazné tóny zralého ovoce, které toto víno utvářejí. Poté dvanáct měsíců v nerezu — žádné dřevo, které by vstupovalo mezi, jen samo ovoce.",
    ],
    quote: {
      text: "Víno, které nemusí nic skrývat: zralé ovoce, jasný původ, otevřený charakter.",
    },
  },

  place: {
    kicker: "Původ",
    title: "Salento",
    text: "Salento leží v podpatku italské boty, mezi dvěma moři. Horká, suchá léta a vápenité půdy zde dávají vzniknout Primitivu s hustým, zralým ovocem — Torricella a Lizzano leží přímo v jeho srdci.",
    stats: [
      { label: "Region", value: "Salento, Apulie" },
      { label: "Obce", value: "Torricella a Lizzano" },
      { label: "Klasifikace", value: "Primitivo I.G.P. Salento" },
      { label: "Vedení révy", value: "Alberello, bez závlahy" },
    ],
    chip: { subtitle: "Apulie · Itálie" },
  },

  pairing: {
    scene: {
      dish: "Bombette z Valle d'Itria",
      copy: "Bombette jsou malé závitky z vepřové krkovice plněné caciocavallem a pepřem, grilované nad dřevěným uhlím přímo v řeznictví. Sýr se uvnitř rozpouští, zvenčí maso tmavne a křupe. Pokrm bez obřadnosti — a přesně pro něj je toto Primitivo stvořené. Intenzitě obstojí, ale zůstává dost měkké, aby s ní nesoupeřilo. Slanost zrajícího sýra jasně vynese jeho tmavé ovoce dopředu.",
      imageAlt:
        "Grilované bombette z Valle d'Itria na dřevěném prkénku, vedle sklenka Primitiva a otevřená láhev",
      regionLink: {
        label: "Objevte více o Apulii",
      },
    },
  },

  moment: {
    title: "Takhle chutná Primitivo nejlépe",
    serve: {
      title: "Podávání a požitek",
      items: [
        { title: "Teplota podávání", text: "16–18 °C — ve sklenici na červené víno" },
        { title: "Kdy pít", text: "Vychutnat nyní nebo během 3–5 let" },
        { title: "Rituál", text: "Před požitkem nechat chvíli dýchat — zralé ovoce vystoupí zřetelněji" },
      ],
    },
    maria: {
      text: "Pro spontánní večery bez příležitosti — nekomplikované víno pro plné stoly a prázdné láhve.",
      link: { label: "Objevit více" },
    },
    essence: [
      {
        kicker: "Chuť",
        title: "Intenzivní, zralá, přetrvávající",
        text: "Švestka a sušené ovoce, intenzivní a dlouze přetrvávající — přitom příjemně přístupné a bezprostředně pitelné.",
      },
      {
        kicker: "Původ",
        title: "Salento, Apulie",
        text: "Torricella a Lizzano mezi dvěma moři — horká, suchá léta a vápenité půdy v podpatku boty.",
      },
      {
        kicker: "Odrůda",
        title: "Primitivo",
        text: "Autochtonní réva Salenta — dlouhá macerace, dvanáct měsíců v nerezu, čisté tmavé ovoce.",
      },
    ],
  },

  faq: [
    {
      q: "Jak chutná Primitivo Salento IGP od Maria Maria?",
      a: "V chuti intenzivní a dlouze přetrvávající, přitom bezprostředně pitelné a příjemně přístupné. V nose komplexní kytice s tóny švestky a sušeného ovoce.",
    },
    {
      q: "Co znamená Salento IGP?",
      a: "IGP znamená „Indicazione Geografica Protetta“, chráněné zeměpisné označení. Salento je poloostrov na jihu Apulie — podpatek italské boty.",
    },
    {
      q: "Čím se liší Primitivo Salento od Primitiva di Manduria?",
      a: "Stupněm původu: „Primitivo di Manduria D.O.P.“ je chráněné označení původu pro Primitivo z úzce vymezené oblasti kolem Manduria; „I.G.P. Salento“ zahrnuje celý poloostrov Salento. Naše Salento IGP je bezprostřednější, přístupnější interpretací — obě vína z Manduria jsou strukturovanější a koncentrovanější.",
      link: { label: "Objevte Primitivo di Manduria DOP" },
    },
    {
      q: "K jakému jídlu se hodí Primitivo Salento IGP?",
      a: "K masu a sýrům — od pečení a grilovaných pokrmů přes zrající tvrdé sýry až po výrazné těstoviny a salumi. Jeho bezprostřední pitelnost z něj dělá přístupného společníka vydatné kuchyně, nejlépe podávaného při 16 až 18 °C ve sklenici na červené víno.",
    },
    {
      q: "Co znamená vedení alberello?",
      a: "Alberello je tradiční keřové vedení jižní Itálie: nízké, volně stojící keře bez drátěnky. Zde se praktikuje výhradně a bez závlahy, takže si réva bere vodu sama z hloubky.",
    },
  ],

  similar: {
    kicker: "Objevte podobná vína",
    title: "Pokud se vám líbí Primitivo",
    trait: "která nesou totéž ovoce a teplo: kulatá, měkká, přístupná.",
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

export default primitivoSalento;
