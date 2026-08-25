/* Viz content/de/magazin.js — stejná struktura ve všech čtyřech jazycích.
   Italská „rivista" slova čísla („Capitolo", „Bacheca", „Curiosità",
   „Interviste", „Archivio del Magazin" …) jsou značkový design a zůstávají
   v kódu, nikoli ve slovníku. „Maria Maria", názvy vín a italské názvy
   pokrmů zůstávají v každém jazyce beze změny. */

export const magazin = {
  marquee: {
    boutique: "Butikoví vinaři",
    handpicked: "Ručně vybíráno",
  },

  cover: {
    title: "Příběhy, lidé a požitek z Itálie",
    subline:
      "V magazínu vypráví Maria Maria o původu, výběru a chvílích požitku — s příběhy z regionů, food pairingy, setkáními a vizí za značkou.",
    rubricsAria: "Rubriky magazínu",
    rubrics: {
      story: "Příběh",
      pairing: "Food pairing",
      interviews: "Rozhovory",
      events: "Akce",
    },
    photoAlt: "Maria vybírá v cantině tři láhve Maria Maria na skleněném stole",
    headline: ["Dvě Marie.", "Jeden příběh", "požitku."],
    paragraph:
      "Jedno jméno, dvě generace a cesta italskými světy vína — ze Salenta přes Kampánii a Gardské jezero až do Düsseldorfu.",
    stations: ["Salento", "Kampánie", "Gardské jezero", "Düsseldorf"],
    cta: "Přečíst celý příběh",
  },

  vision: {
    srTitle: "Vize a mise Maria Maria",
    blocks: {
      vision: {
        kicker: "Vize",
        text: "Maria Maria chce vytvořit pečlivě sestavený svět vína, v němž se italský původ, osobní výběr a moderní požitek stanou pro lidi v Německu skutečným zážitkem.",
      },
      mission: {
        kicker: "Mise",
        text: "Vybíráme vína s charakterem, srozumitelně vyprávíme o jejich původu a spojujeme regiony, lidi a chvíle požitku v jasný, autentický zážitek značky.",
      },
    },
  },

  chapters: {
    moments: "Chvíle požitku",
  },

  quote: {
    translation: "Víno je poezie země.",
  },

  pairing: {
    eyebrow: "Food pairing · Podle příležitosti",
    title: "Které víno se hodí k",
    titleAccent: "vaší chvíli?",
    description:
      "Nevybírejte nejprve víno, ale okamžik — zvolte svou příležitost a Maria Maria ukáže víno, které se k ní hodí.",
    toWine: "K vínu",
    alsoFits: "Hodí se také",
    cards: {
      aperitivo: {
        anlass: "Aperitivo",
        dish: "Burrata · Rajčata · Focaccia",
        caption: "Italské aperitivo s Rosatem, burratou a focacciou",
        hints: {
          falanghina: "Makrela all’acqua pazza",
          "il-bianco-greco-cuvee": "Paccheri s krevetami",
          lugana: "Krémové rybí rizoto",
        },
      },
      "pasta-abend": {
        anlass: "Těstovinový večer",
        dish: "Spaghetti alle Vongole",
        caption: "Spaghetti alle Vongole s Greco di Tufo DOCG",
        hints: {
          "primitivo-14-5": "Orecchiette s ragú braciole",
          "il-bianco-greco-cuvee": "Paccheri s krevetami",
          falanghina: "Makrela all’acqua pazza",
        },
      },
      "fisch-meer": {
        anlass: "Ryby a moře",
        dish: "Rybí rizoto · Citron · Bylinky",
        caption: "Lugana DOC s krémovým rybím rizotem u Gardského jezera",
        hints: {
          falanghina: "Makrela all’acqua pazza",
          "greco-di-tufo": "Spaghetti alle Vongole",
          "il-bianco-greco-cuvee": "Paccheri s krevetami",
        },
      },
      grillabend: {
        anlass: "Grilovací večer",
        dish: "Involtini · Rozmarýn · Grilovaná zelenina",
        caption: "Aglianico ke grilovacímu večeru – masové závitky a rozmarýn",
        hints: {
          "primitivo-salento": "Bombette z grilu",
          "primitivo-14-5": "Orecchiette s ragú braciole",
          "rosato-puglia": "Burrata s focacciou",
        },
      },
      dinner: {
        anlass: "Večeře s hosty",
        dish: "Dušená hovězí líčka · Bramborový krém",
        caption: "Primitivo di Manduria s dušenými hovězími líčky",
        hints: {
          "il-rosso-aglianico": "Involtini z grilu",
          "primitivo-salento": "Bombette z grilu",
          "greco-di-tufo": "Spaghetti alle Vongole",
        },
      },
    },
  },

  social: {
    title: "Maria Maria na",
    titleAccent: "Instagramu",
    text: "Okamžiky z vinic, sklepů a prostřených stolů — naše nástěnka ze světa Maria Maria.",
    follow: "Sledovat {handle}",
    postAria: "{caption} — otevřít Maria Maria na Instagramu",
    posts: {
      aperitivo: "Aperitivo ve večerním světle",
      harvest: "Vinobraní na jihu",
      pranzo: "Pranzo s přáteli",
      handpicked: "Ručně vybíráno",
    },
  },

  curiosity: {
    title: "Kuriózní, ale",
    titleAccent: "pravdivé",
    description:
      "Tři věci, které jsme se naučili u vinaře. Klepněte na kartu — odpověď je na rubu.",
    flip: "Otočit",
    back: "Zpět",
    closing:
      "Devět lahví, tři původy — a s nimi devět příběhů, které už jsou napsané.",
    interviewsLabel: "Vinaři a zákazníci v rozhovoru",
    cards: {
      name: {
        kicker: "Nomen est omen",
        question: "Proč se Primitivo jmenuje „Primitivo“?",
        answer:
          "Ne proto, že by byl prapůvodní — ale protože dozrává jako jeden z prvních. „Primo“: ten časný. V srpnu je už hotový, zatímco ostatní ještě visí.",
      },
      temperature: {
        kicker: "Kuchyňské vědění",
        question: "Jak studené smí být červené víno?",
        answer:
          "Chladnější, než si myslíte. 16–18 °C — tedy sklep, ne obývací pokoj. Dvacet minut v lednici před otevřením a víno je najednou přesné.",
      },
      tears: {
        kicker: "Ze sklepa",
        question: "Co jsou ty „slzy“ na stěně sklenice?",
        answer:
          "Stružky, které stékají zpět po zakroužení. Prozrazují alkohol, nikoli kvalitu — dobré víno nepláče krásněji, jen pomaleji.",
      },
    },
  },

  interviewEmpty: {
    title: "První rozhovory právě vznikají.",
    text: "Navštěvujeme vinařky, sklepmistry a sommeliéry na jejich vinicích a ve sklepech — a jejich odpovědi přinášíme sem: o půdách a ročnících, o chuti, řemesle a lidech za každou lahví.",
    badge: "Brzy zde ke čtení",
  },

  wines: {
    eyebrow: "Z magazínu do sklenice",
    title: "Vína z našich příběhů",
    description:
      "Láhve, kolem kterých se točí naše příběhy – přejeďte po fotografii a uvidíte zadní etiketu.",
    railLabel: "Ochutnáno v magazínu",
  },

  faq: {
    eyebrow: "Znalosti o víně",
    title: "Časté otázky ze",
    titleAccent: "znalostí o víně.",
    description:
      "Stálice kolem teploty, sklenice, skladování a stupňů původu — zodpovězeno z datových listů našich vín, bez odborného žargonu.",
    footerLabel: "Chybí vaše otázka? Napište nám",
  },
};

export default magazin;
