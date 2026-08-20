/* Textový overlay pro stránku Falanghina — struktura: components/weine/falanghina/wineData.js */

const falanghina = {
  shortNameNom: "Falanghina",
  shortNameGen: "Falanghiny",
  eyebrow: "Italská butiková vína",
  lede:
    "Ze sluncem zalitých kopců Beneventana v Kampánii. Falanghina s čistou svěžestí, jemným ovocem a středomořskou duší.",
  heroWords: ["Svěží.", "Čistá.", "Středomořská."],

  breadcrumb: [{ label: "Domů" }, { label: "Naše vína" }, {}],

  facts: [
    { label: "Původ", value: "Kampánie – Beneventano" },
    { label: "Odrůda" },
    { label: "Zrání", value: "1 rok v nerezu, 2 měsíce v lahvi" },
    { label: "Teplota podávání", value: "cca 10 °C" },
  ],

  colorMoment: {
    kicker: "Barva",
    lines: ["Slámově žlutá.", "Se zelenkavými odlesky."],
    text: "Ve sklenici se Falanghina ukazuje světlá, čistá a zářivá – bílé víno, které slibuje svěžest dřív, než je ochutnáte.",
    swatches: [
      { label: "Světlá sláma" },
      { label: "Slámově žlutá" },
      { label: "Zelenkavý odlesk" },
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
      title: "Světlá, čistá a zářivá",
      text: "Slámově žlutá se zelenkavými odlesky – první dojem ve sklenici je čirá svěžest.",
      artwork: {
        alt: "Láhev Beneventano Falanghina IGP od Maria Maria — čelní pohled na etiketu",
        medium: "Láhev",
      },
    },
    {
      kicker: "Vůně",
      title: "Bílé květy, hruška a závan citrusů",
      text: "Jemný, světlý buket: květy, žluté ovoce a středomořská lehkost stoupající ze sklenice.",
      artwork: {
        alt: "Zadní etiketa láhve Beneventano Falanghina IGP od Maria Maria",
        medium: "Zadní etiketa",
      },
    },
    {
      kicker: "Chuť",
      title: "Charakterní, měkká a harmonická",
      text: "Velmi měkká a zároveň harmonická a přetrvávající – bílé víno s charakterem, které zůstává příjemně přístupné.",
      artwork: {
        alt: "Láhev Beneventano Falanghina IGP od Maria Maria ve vinařství",
        medium: "Ve vinařství",
      },
    },
  ],

  detail: [
    { label: "Označení" },
    { label: "Odrůda" },
    { label: "Původ", value: "Kampánie, Itálie" },
    { label: "Sběr", value: "První polovina října" },
    {
      label: "Vedení révy",
      value: "Guyot na dřevěných kůlech — „falangae“, které daly révě jméno už v dobách Říma.",
    },
    {
      label: "Vinifikace",
      value: "Šetrné lisování celých hroznů. Následuje klidné zrání za řízené teploty.",
    },
    { label: "Zrání", value: "1 rok v nerezové nádrži, 2 měsíce zrání v lahvi" },
    { label: "Obsah alkoholu", value: "13,0 % obj." },
    { label: "Teplota podávání", value: "cca 10 °C" },
    { label: "Objem", value: "750 ml" },
    { label: "Upozornění", value: "Obsahuje siřičitany" },
  ],

  story: {
    kicker: "Příběh",
    title: "Réva stará jako Kampánie sama",
    paragraphs: [
      "Falanghina patří k nejstarším odrůdám Kampánie. Její jméno se podle tradice odvozuje od „falangae“ – dřevěných kůlů, po nichž réva šplhala už za časů Římanů.",
      "Naše Falanghina roste v kopcovitém vnitrozemí provincie Benevento. Teplé dny, chladné noci a blízkost Středozemního moře jí dávají to, co ji činí nezaměnitelnou: svěžest, čistotu a jemné, světlé ovoce.",
    ],
    quote: {
      text: "Víno pro světlé chvíle – pro dlouhé poledne, svěží kuchyni a upřímné rozhovory.",
    },
  },

  place: {
    kicker: "Původ",
    title: "Beneventano",
    text: "Mezi Apeninami a pobřežím leží Beneventano: mírné kopce, hodně světla a noci chladnější než u moře. Zde Falanghina zraje pomalu – a udržuje si své napětí.",
    stats: [
      { label: "Region", value: "Kampánie" },
      { label: "Provincie", value: "Benevento" },
      { label: "Sběr", value: "Začátek října" },
      { label: "Podnebí", value: "Teplé dny, chladné noci" },
    ],
    photoAlt: "Vinice nad Neapolským zálivem s výhledem na Vesuv",
    chip: { subtitle: "Kampánie · Itálie" },
  },

  pairing: {
    scene: {
      dish: "Ricciola ai Pomodorini",
      copy: "Jemná ricciola a šťavnatá cherry rajčata nepotřebují těžký doprovod. Falanghina přináší na stůl svěžest, ovoce a živost a nechává jemné rybě dost prostoru. Její svěží povaha zachytí šťavnatost rajčat, zatímco lehké tělo pokrm doprovází, aniž by jej překrylo. Čisté, středomořské spojení, které ukazuje svou sílu především v teplých dnech.",
      imageAlt:
        "Filet z riccioly s cherry rajčaty na talíři, vedle sklenka Falanghiny a otevřená láhev",
      regionLink: {
        label: "Objevte více o Kampánii",
      },
    },
  },

  moment: {
    title: "Takhle chutná Falanghina nejlépe",
    serve: {
      title: "Podávání a požitek",
      items: [
        { title: "Teplota podávání", text: "cca 10 °C — dobře vychlazená ve sklenici na bílé víno" },
        { title: "Kdy pít", text: "Vychutnat nyní nebo během 2–3 let" },
        { title: "Úvod", text: "Vyndat z lednice krátce před podáváním" },
      ],
    },
    maria: {
      text: "Pro dlouhá poledne pod širým nebem, svěží kuchyni a upřímné rozhovory — Falanghina je víno pro světlé chvíle.",
      link: { label: "Objevit více" },
    },
    essence: [
      {
        kicker: "Chuť",
        title: "Měkká, harmonická, svěží",
        text: "Bílé květy, hruška a závan citrusů — velmi měkká a zároveň harmonická a přetrvávající.",
      },
      {
        kicker: "Původ",
        title: "Beneventano, Kampánie",
        text: "Mírné kopce mezi Apeninami a pobřežím. Teplé dny a chladné noci uchovávají svěžest a napětí.",
      },
      {
        kicker: "Odrůda",
        title: "Falanghina",
        text: "Jedna z nejstarších odrůd Kampánie — její jméno sahá k dřevěným kůlům z dob Říma. 100 % odrůdově čistá.",
      },
    ],
  },

  faq: [
    {
      q: "Jak chutná Falanghina?",
      a: "Velmi měkce a zároveň harmonicky a dlouze: charakterní, svěží bílé víno se světlým ovocem a živou čistotou – přístupné, aniž by bylo zaměnitelné. Ve sklenici se ukazuje slámově žluté se zelenkavými odlesky, světlé a zářivé – svěžest, kterou na patře splní.",
    },
    {
      q: "Odkud pochází Falanghina?",
      a: "Naše Falanghina roste v Beneventanu, kopcovitém vnitrozemí provincie Benevento v Kampánii – teplé dny, chladné noci a blízkost Středozemního moře jí dávají svěžest a jemné, světlé ovoce. Sama odrůda patří k nejstarším v Kampánii.",
      link: { label: "Objevte více o Kampánii" },
    },
    {
      q: "Co znamená „Beneventano IGP“?",
      a: "IGP znamená „Indicazione Geografica Protetta“, chráněné zeměpisné označení. Hrozny pocházejí z Beneventana – kopcovitého vnitrozemí provincie Benevento v Kampánii.",
    },
    {
      q: "Hodí se Falanghina k rybám nebo k těstovinám?",
      a: "K obojímu – nejraději k rybám: grilovaným, restovaným i z trouby, stejně tak ke korýšům a mořským plodům. U těstovin rozhoduje omáčka: ke světlým, lehkým úpravám se hodí znamenitě. A dobře vychlazená je ideálním aperitivem.",
    },
    {
      q: "Jaký je rozdíl mezi Falanghinou a Greco di Tufo?",
      a: "Obě jsou bílé odrůdy Kampánie, ale každá s vlastním charakterem: Falanghina z Beneventana je měkká, harmonická a bezprostředně svěží. Greco di Tufo roste na vulkanickém tufu, přináší více struktury a minerální tón – a jako jedno z mála bílých vín Itálie nese pečeť D.O.C.G.",
      link: { label: "Objevte Greco di Tufo" },
    },
  ],

  similar: {
    kicker: "Objevte podobná vína",
    title: "Pokud se vám líbí Falanghina",
    trait: "která trefují tentýž tón: světlá, svěží, středomořská.",
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

export default falanghina;
