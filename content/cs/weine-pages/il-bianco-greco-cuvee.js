/* Textový overlay pro stránku Il Bianco — struktura: components/weine/il-bianco-greco-cuvee/wineData.js */

const ilBianco = {
  shortNameNom: "Il Bianco",
  shortNameGen: "vína Il Bianco",
  eyebrow: "Italská butiková vína",
  lede:
    "Cuvée z vybraných bílých odrůd Kampánie. Dva roky klidu v nerezové nádrži mu dávají intenzivní kytici a jemnou, svůdnou chuť.",
  heroWords: ["Intenzivní.", "Jemné.", "Svůdné."],

  breadcrumb: [{ label: "Domů" }, { label: "Naše vína" }, {}],

  facts: [
    { label: "Původ", value: "Kampánie, Itálie" },
    { label: "Uvaggio", value: "Cuvée vybraných bílých odrůd" },
    { label: "Zrání", value: "2 roky v nerezové nádrži" },
    { label: "Teplota podávání", value: "cca 10 °C" },
  ],

  colorMoment: {
    kicker: "Barva",
    lines: ["Slámově žlutá.", "Světlá a klidná."],
    text: "Ve sklenici se Il Bianco ukazuje slámově žluté a čiré — bílé víno, jehož klid je vidět dřív, než jej ucítíte.",
    swatches: [
      { label: "Světlá sláma" },
      { label: "Slámově žlutá" },
      { label: "Teplý odlesk" },
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
      title: "Slámově žlutá a čirá",
      text: "Světlé, klidné bílé víno — slámově žluté ve sklenici, bez jakékoli těžkosti.",
      artwork: {
        alt: "Láhev Il Bianco — Campania Bianco IGP od Maria Maria — čelní pohled na etiketu",
        medium: "Láhev",
      },
    },
    {
      kicker: "Vůně",
      title: "Velmi intenzivní a příjemná",
      text: "Technický list ji označuje prostě jako „profumo molto intenso e gradevole“: široce otevřená, vtahující kytice, která naplní celou místnost.",
      artwork: {
        alt: "Zadní etiketa láhve Il Bianco — Campania Bianco IGP od Maria Maria",
        medium: "Zadní etiketa",
      },
    },
    {
      kicker: "Chuť",
      title: "Jemná a svůdná",
      text: "Na patře delikátní a zdrženlivé — víno, které netlačí, ale zve. Právě to jej činí tak nebezpečně pitelným.",
      artwork: {
        alt: "Láhev Il Bianco — Campania Bianco IGP od Maria Maria ve vinařství",
        medium: "Ve vinařství",
      },
    },
  ],

  detail: [
    { label: "Označení" },
    { label: "Uvaggio", value: "Blend vybraných bílých odrůd" },
    { label: "Původ", value: "Kampánie, Itálie" },
    { label: "Sběr", value: "Konec září / začátek října" },
    {
      label: "Vinifikace",
      value: "Šetrné, měkké lisování celých hroznů. Následují dva roky zrání v nerezovém silu.",
    },
    { label: "Zrání", value: "2 roky v nerezové nádrži" },
    { label: "Obsah alkoholu", value: "13,0 % obj." },
    { label: "Teplota podávání", value: "cca 10 °C" },
    { label: "Objem", value: "750 ml" },
    { label: "Upozornění", value: "Obsahuje siřičitany" },
  ],

  story: {
    kicker: "Příběh",
    title: "Dva roky trpělivosti",
    paragraphs: [
      "Il Bianco není sólistka, ale souhra: vybrané bílé odrůdy Kampánie, které svůj charakter nacházejí teprve společně. Hrozny se lisují vcelku, šetrně a měkce — nic se nevynucuje.",
      "Pak přijde část, kterou nelze zkrátit: dva roky v nerezovém silu. Žádné dřevo, žádné rozptýlení. Zůstává velmi intenzivní kytice a chuť, která se stala jemnou místo hlasité.",
    ],
    quote: {
      text: "Některá vína je třeba nechat čekat, aby ztichla.",
    },
  },

  place: {
    kicker: "Původ",
    title: "Kampánie",
    text: "Slunce, moře a vulkanické půdy: Kampánie dává vzniknout bílým odrůdám, které dokážou udržet ovoce i svěžest zároveň. Právě z toho vzniká tato cuvée.",
    stats: [
      { label: "Region", value: "Kampánie" },
      { label: "Klasifikace", value: "Campania Bianco IGP" },
      { label: "Sběr", value: "Konec září" },
      { label: "Zrání", value: "2 roky v nerezu" },
    ],
    chip: { subtitle: "Kampánie · Itálie" },
  },

  pairing: {
    scene: {
      dish: "Paccheri s krevetami a cuketou",
      copy: "Paccheri, šťavnaté krevety a jemná cuketa spojují středomořskou svěžest s příjemně měkkou texturou. Il Bianco doprovází přesně tuto rovnováhu: dost svěží pro krevety, dost aromatické pro zeleninu a se strukturou dostatečnou pro těstoviny. Jemná sladkost krevet zůstává zachována, zatímco svěžest vína mezi sousty znovu otevírá patro. Nekomplikované, a přesto rafinované spojení pro italský těstovinový večer.",
      imageAlt:
        "Paccheri s krevetami a cuketou na talíři, vedle sklenka Il Bianco a otevřená láhev",
      regionLink: {
        label: "Objevte více o Kampánii",
      },
    },
  },

  moment: {
    title: "Takhle chutná Il Bianco nejlépe",
    serve: {
      title: "Podávání a požitek",
      items: [
        { title: "Teplota podávání", text: "cca 10 °C — ne příliš studené, jinak se kytice uzavře" },
        { title: "Kdy pít", text: "Již vyzrálé — vychutnat nyní nebo během 2–3 let" },
        { title: "Sklenice", text: "V baňaté sklenici na bílé víno se intenzivní kytice rozvine nejkrásněji" },
      ],
    },
    maria: {
      text: "Pro klidné večery, kdy není co dokazovat — víno, které ztichlo a právě proto zůstává.",
      link: { label: "Objevit více" },
    },
    essence: [
      {
        kicker: "Chuť",
        title: "Jemná a svůdná",
        text: "Velmi intenzivní kytice, na patře delikátní a zdrženlivé — víno, které netlačí, ale zve.",
      },
      {
        kicker: "Původ",
        title: "Kampánie",
        text: "Slunce, moře a vulkanické půdy — region, jehož bílé odrůdy udrží ovoce i svěžest zároveň.",
      },
      {
        kicker: "Odrůda",
        title: "Greco Cuvée",
        text: "Vybrané bílé odrůdy Kampánie, jejichž složení sleduje ročník — spojené dvěma roky v nerezu.",
      },
    ],
  },

  faq: [
    {
      q: "Jak chutná Il Bianco Greco Cuvée od Maria Maria?",
      a: "Ve vůni velmi intenzivní a příjemné, v chuti naopak jemné a svůdné. Barva je slámově žlutá — světlé, přístupné bílé víno s překvapivou aromatickou hloubkou.",
    },
    {
      q: "Co znamená Greco Cuvée u Il Bianco?",
      a: "Il Bianco je cuvée z vybraných bílých odrůd Kampánie — název odkazuje na Greco. Přesné odrůdové složení není zveřejněno; potvrzeny jsou šetrné lisování celých hroznů a dva roky zrání v nerezové nádrži, které odrůdy spojují v intenzivní, jemné bílé víno.",
    },
    {
      q: "Hodí se Greco Cuvée k aperitivu?",
      a: "Ano — dobře vychlazená kolem 10 °C je elegantním úvodem večera. Nepodávejte ji příliš studenou, jinak se intenzivní kytice uzavře; v baňaté sklenici na bílé víno se rozvine nejkrásněji.",
    },
    {
      q: "Pro jakou příležitost se Il Bianco Greco Cuvée hodí?",
      a: "Pro klidné večery, kdy není co dokazovat — k rybím pokrmům, korýšům a mořským plodům nebo jako aperitiv. Již vyzrálé víno (dva roky v nerezu), které netlačí, ale zve.",
    },
    {
      q: "Co znamená „Campania Bianco IGP“?",
      a: "IGP znamená „Indicazione Geografica Protetta“, chráněné zeměpisné označení. Hrozny pocházejí z regionu Kampánie v jižní Itálii.",
    },
  ],

  similar: {
    kicker: "Objevte podobná vína",
    title: "Pokud se vám líbí Il Bianco",
    trait: "která nesou tentýž světlý rukopis: svěží, elegantní, vyvážená.",
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

export default ilBianco;
