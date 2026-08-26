/* Viz content/de/home.js — stejná struktura ve všech čtyřech jazycích. */

export const home = {
  hero: {
<<<<<<< Updated upstream
    eyebrow: "Italská butiková vína",
    /* Přesně jeden nadpis H1: značka a hlavní klíčové slovo. Italský claim
       už není součástí nadpisu, ale stojí pod ním jako vlastní odstavec —
       v DOM nesmí nikdy vzniknout „Maria MariaIl piacere del vino.“. */
    title: "Maria Maria – italská butiková vína",
    claim: "Il piacere del vino.",
    lede: "Ručně vybíraná vína z malých rodinných vinařství – pro vědomě zvolené chvíle, od aperitivu po velký večer.",
    ctaWines: "Objevit vína",
    /* Druhá CTA vede na osobní poradenství (/kontakt), ne už do e-shopu.
       Řádek s čísly (vína · regiony · od roku 2019) odešel spolu s tím
       německým; kdo ho chce zpět, vrátí statWines, statRegions a statSince
       a komponenta ho vykreslí sama. Správné číslovkové tvary nese
       content/cs/shop.js. */
    ctaContact: "Vyžádat osobní poradenství",
    photoAlt:
      "Láhev Maria Maria a sklenka červeného vína na kamenné zídce mezi vinicemi a mořem, za nimi žena v bílých šatech hledící na pobřeží",
=======
    /* Stejná struktura jako content/de/home.js (brief k úvodní stránce,
       24.08.2026): přesně jedna H1 — značka plus hlavní klíčové slovo — s
       italským claimem jako samostatným <p lang="it"> pod ní; druhá CTA
       vede na osobní poradenství (/kontakt), dřívější řádek s čísly odpadl. */
    eyebrow: "OSOBNÍ VÝBĚR · OD ROKU 2019",
    title: "Maria Maria – italská butiková vína",
    claim: "Il piacere del vino.",
    lede: "Ručně vybíraná vína malých italských rodinných vinařství – osobně zvolená pro vědomé chvíle požitku v Německu, od aperitivu po velký večer.",
    ctaWines: "Objevit naše vína",
    ctaContact: "Požádat o osobní poradenství",
    photoAlt: "Láhev vína Maria Maria a sklenka červeného vína před vinicemi s výhledem na středomořské pobřeží",
>>>>>>> Stashed changes
  },

  philosophy: {
    eyebrow: "Naše filozofie",
    title: "Italská butiková vína, která se snadno vybírají, vyprávějí i zažívají.",
    description:
      "Osobně vybraná, s jasným původem a určená pro gastronomii, hotelnictví, akce i výjimečné chvíle.",
    moments: {
      selection: {
        title: "Osobní výběr",
        text: "Každé víno osobně ochutnáme a vědomě vybereme. Vzniká tak přehledný butikový sortiment, který hostitel s jistotou doporučí a milovník vína snadno objeví.",
      },
      origin: {
        title: "Původ s rukopisem",
        text: "Spolupracujeme s vybranými rodinnými vinařstvími v Itálii. Region, odrůda a lidé za vínem dávají každé láhvi věrohodný příběh, který stojí za vyprávění.",
      },
      occasion: {
        title: "Stvořená pro chvíle požitku",
        text: "Od aperitivu a snoubení s jídlem po akce a stylové dárky: Maria Maria spojuje chuť, estetiku a italský styl života ve chvílích, které zůstanou v paměti.",
      },
      guidance: {
        title: "Osobní doprovod",
        text: "Přehledný sortiment, srozumitelná doporučení a přímý kontakt usnadňují výběr i použití – pro osobní spolupráci jako rovný s rovným.",
      },
    },
    note: "Pro gastronomii, hotelnictví a výjimečné koncepty",
    cta: "Poznejte Maria Maria jako partnera",
  },

  collection: {
    eyebrow: "Kolekce",
    title: "Naše vína",
    /* Tři původy, nikdy „čtyři regiony": Apulie a Kampánie jsou správní
       regiony, Gardské jezero je vinařská oblast. Pravidlo briefu je fakt,
       platí tedy ve všech jazycích, nejen v němčině. */
    description: "Devět vín ze tří vybraných původů – každé s vlastním příběhem.",
  },

  origins: {
    title: "Dvě duše,",
    titleAccent: "jedno jméno",
    /* Brief §3, „Storia breve“ — jediný odstavec, stejně jako v němčině. */
    paragraphs: [
<<<<<<< Updated upstream
      "Maria Maria začíná v Salentu, v létě roku 2019. U stolu s přáteli, dvěma ženami jménem Maria a enologem, vznikla myšlenka osobního výběru italských vín.",
=======
      "Maria Maria začíná v Salentu, v létě 2019. U stolu s přáteli, dvěma ženami jménem Maria a enologem vznikla myšlenka osobního výběru italských vín.",
>>>>>>> Stashed changes
    ],
    journey: ["Salento", "Apulie", "Kampánie", "Gardské jezero"],
    quote: "„Italian wine, personal selection, share the pleasure.“",
    /* Tlačítko vede na /geschichte (příběh značky), ne do magazínu:
       popisek pojmenovával špatný cíl a /magazin skutečně existuje —
       kdo klikl, čekal jej. */
    cta: "Objevit náš příběh",
  },

  regions: {
    eyebrow: "Původ",
    title: "Tři italské vinařské oblasti, tři nezaměnitelné rukopisy",
    description:
      "Našich devět vín vede z Apulie přes Kampánii až do jižní oblasti Gardského jezera. Každý původ má vlastní odrůdy, krajiny a lidi – osobně vybrané pro Maria Maria.",
    cta: "Všechny regiony",
    detailCta: "Objevit více",
    items: {
      apulien: {
        name: "Apulie",
        tag: "Srdce jihu",
<<<<<<< Updated upstream
        desc: "Slunce jihu a plná, silná aromata.",
        long: "Mezi Salentem a Gallipoli dozrávají Primitivo a Negroamaro pod jižním sluncem – silná, teplá vína se středomořskou duší.",
=======
        long: "Sluncem prohřátá vína s teplem, ovocností a středomořským charakterem – včetně našeho výběru Primitiva a Rosata.",
>>>>>>> Stashed changes
        cta: "Objevit Apulii",
        alt: "Trulli a olivovníky v Apulii",
      },
      kampanien: {
        name: "Kampánie",
        tag: "Mezi sopkou a mořem",
<<<<<<< Updated upstream
        desc: "Sopečné půdy, původní charaktery.",
        long: "V okolí Neapole a Salerna dávají sopečné půdy Vesuvu vínům hloubku a původnost – od Falanghiny po Aglianico.",
=======
        long: "Minerální, charakterní vína z jižní Itálie – utvářená odrůdami jako Greco, Falanghina a Aglianico.",
>>>>>>> Stashed changes
        cta: "Objevit Kampánii",
        alt: "Vinice na kampánském pobřeží s Vesuvem",
      },
      garda: {
        name: "Oblast Gardského jezera (Lombardie)",
        tag: "Elegance severu",
<<<<<<< Updated upstream
        desc: "Elegance, svěžest a minerální hloubka.",
        long: "Na jižním břehu Gardského jezera vzniká Lugana – bílé víno vzácné elegance, nesené svěžestí a minerální hloubkou.",
        cta: "Objevit vína od Gardského jezera",
        alt: "Vinice u Gardského jezera v Lombardii",
      },
    },
  },

  /* Tři konverzní segmenty mezi původy a pruhem e-shopu (brief §5). Bez
     tohoto bloku se sekce nevykreslí vůbec — právě proto měla německá
     úvodní stránka o jednu sekci víc než ostatní tři. */
  segments: {
    title: "Osobně vybráno – pro váš požitek, váš sortiment a vaši příležitost",
    intro:
      "Ať už jde o vaši restauraci, váš sortiment nebo výjimečnou akci: poradíme osobně a sestavíme výběr, který sedne konceptu, hostům i příležitosti.",
    /* Místní důkaz — řádek pod třemi kartami */
    proof: "Osobní poradenství z Mettmannu u Düsseldorfu – v Severním Porýní-Vestfálsku i dál.",
    items: {
      gastronomie: {
        title: "Gastronomie & lahůdky",
        text: "Osobně vybraná italská vína pro restaurace, kavárny, vinné bary a lahůdkářství – ladí s kuchyní, stylem i hosty.",
        cta: "Poptat sortiment pro gastronomii",
      },
      handel: {
        title: "Obchod & další prodej",
        text: "Vína s charakterem, dohledatelným původem a osobním poradenstvím pro vybrané obchodní partnery a prodejce.",
        cta: "Probrat obchodní partnerství",
      },
      events: {
        title: "Akce & degustace",
        text: "Individuální výběr vín pro soukromé oslavy, firemní akce a řízené degustace v Düsseldorfu, Severním Porýní-Vestfálsku i dál.",
        cta: "Poptat akci nebo degustaci",
=======
        long: "Elegantní, svěží vína z jižní oblasti Gardského jezera – s Lugana DOC jako jasnou referencí původu.",
        cta: "Objevit vína od Gardského jezera",
        alt: "Vinice u Gardského jezera v Lombardii",
>>>>>>> Stashed changes
      },
    },
  },

  shopBand: {
    eyebrow: "Oficiální e-shop",
    title: "Připraveni na chuť, která",
    titleAccent: "vás inspiruje?",
    /* Terra Vera je oficiální externí e-shop — žádný slib přímého
       rozesílání z vinařství, ten kanál neprovozujeme. */
    text: "Objevujte a objednávejte vína Maria Maria pohodlně přes náš oficiální e-shop u Terra Vera.",
    primary: "Do oficiálního e-shopu",
    secondary: "Kontaktovat nás",
  },

  faq: {
    eyebrow: "Časté otázky",
    title: "Maria Maria,",
    titleAccent: "krátce vysvětleno.",
    description:
      "Vše, co chcete vědět o našich vínech, o nákupu i o možné spolupráci s Maria Maria.",
    footerNote: "Máte další otázky nebo zájem o spolupráci?",
    footerLabel: "Kontaktujte nás osobně",
  },
};

export default home;
