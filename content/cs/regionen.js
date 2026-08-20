/* Stránka regionů /regionen. Stejná struktura jako
   content/de/regionen.js. „Maria Maria", názvy odrůd (Primitivo, Greco,
   Turbiana …) a apelace (Lugana DOC) zůstávají beze změny. */

export const regionen = {
  hero: {
    eyebrow: "Italské vinařské regiony",
    /* Jediný H1 stránky, sázený na dva řádky */
    title1: "Kde italská vína",
    title2: "nacházejí svůj charakter",
    text: "Tři oblasti původu, rozdílné krajiny a odrůdy plné charakteru: objevte, jak Apulie, Kampánie a oblast Lugana u Gardského jezera utvářejí styl vybraných vín Maria Maria.",
    /* Pobídka k prolistování: otázka + výzva, šipka zůstává v kódu */
    question: "Proč chutná Apulie jinak než Gardské jezero?",
    questionCta: "Za odpovědí",
  },

  /* Titulek sekce nad třemi portréty regionů */
  intro: {
    eyebrow: "Tři oblasti původu",
    title: "Objevte naše regiony",
    description:
      "Apulie, Kampánie a Lugana u Gardského jezera – každý původ s vlastními půdami, odrůdami a vlastním stylem ve sklenici.",
  },

  regions: {
    apulien: {
      name: "Apulie",
      tag: "Srdce jihu",
      alt: "Vinice na červené zemi v Apulii v teplém večerním světle",
      label: "Vína z Apulie",
      desc: "Slunce, červené půdy a blízkost moře utvářejí apulské vinařství. Především Primitivo, jedna z nejvýraznějších odrůd regionu, představuje zralé ovoce, teplo a výrazný charakter. Maria Maria představuje vybraná vína z Apulie, která s požitkem spojují původ a italský životní styl.",
      cta: "Objevte vína Apulie",
    },
    kampanien: {
      name: "Kampánie",
      tag: "Vyšší polohy a pobřeží",
      alt: "Terasovité vinice na pobřeží Kampánie ve večerním světle",
      label: "Vína z Kampánie",
      desc: "Ve vyšších polohách Irpinie a v dalších tradičních pěstitelských oblastech Kampánie vznikají charakterní vína z odrůd jako Greco, Falanghina a Aglianico. Rozdílné nadmořské výšky, vápenité a jílovité půdy i výrazné teplotní rozdíly jim dodávají svěžest, mineralitu a aromatickou hloubku.",
      cta: "Objevte vína Kampánie",
    },
    garda: {
      name: "Lugana u Gardského jezera",
      tag: "Mezi Lombardií a Benátskem",
      alt: "Vinice a mírné kopce jižně od Gardského jezera",
      label: "Lugana u Gardského jezera",
      desc: "Jižně od Gardského jezera, mezi Lombardií a Benátskem, leží vinařská oblast Lugana DOC. Odrůda Turbiana a jílovité půdy utvářejí bílá vína se svěžestí, jemnou mineralitou a elegantním charakterem – ideální k aperitivu, lehké kuchyni a výjimečným chvílím požitku.",
      cta: "Objevte vína od Gardského jezera",
    },
  },

  /* Terroirové manifesto — text klientské komponenty, cestuje jako prop */
  manifest: {
    eyebrow: "Naše měřítko",
    title: "Původ není údaj.",
    titleAccent: "Je to samo víno.",
    text: "Maria Maria nehledá etikety, ale místa, lidi a vína s jasným rukopisem.",
    pillars: [
      {
        title: "Vybraní producenti",
        text: "Osobní vztahy a dohledatelný původ namísto anonymního výběru.",
      },
      {
        title: "Odrůdy s charakterem regionu",
        text: "Primitivo, Negroamaro, Greco, Falanghina, Aglianico a Turbiana v kontextu svého původu.",
      },
      {
        title: "Orientace pro vědomý požitek",
        text: "Chuť, příležitost a food pairing pomáhají při volbě správného vína.",
      },
    ],
  },

  /* Pás obchodu: titulek skládá stránka jako title + titleAccent (kurzíva) +
     titleEnd — titleEnd smí být v dané jazykové verzi prázdný. */
  band: {
    eyebrow: "Kolekce",
    title: "Objevte vína",
    titleAccent: "podle regionu",
    titleEnd: "",
    text: "Od plného Primitiva z Apulie po minerální Luganu od Gardského jezera – najděte víno, jehož původ chcete ochutnat.",
    primary: "Objevte všechna vína Maria Maria",
    secondary: "Kontaktujte nás osobně",
  },

  /* Rámec regionálního FAQ — otázky samotné pocházejí z dict.faq.regionen */
  faq: {
    eyebrow: "Časté otázky",
    title: "Otázky k",
    titleAccent: "původu.",
    description:
      "Zvolte region a najděte odpovědi na otázky o oblastech, odrůdách, chuti a food pairingu – jako orientaci při volbě vhodného vína.",
    footerLabel: "Objevte food pairingy v magazínu",
  },
};

export default regionen;
