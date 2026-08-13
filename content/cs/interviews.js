/* Rozhovory — dlouhá redakční trať magazínu.

   Struktura a poznámky k údržbě: viz content/de/interviews.js. Němčina je
   výchozí jazyk a schválená verze z handoffu; tento soubor ji překládá,
   nikoli přepisuje.

   Slug je ve všech čtyřech jazycích stejný — jazyk je v prefixu
   (/cs/magazin/interviews/…), ne ve slugu, jinak by se skupina hreflang
   rozpadla na čtyři nepropojené adresy.

   Obě citace podléhají schválení Danieleho (handoff, strana 9): jejich nový
   překlad vyžaduje nové schválení. */

const interviews = {
  section: {
    eyebrow: "Rozhovory · V dialogu",
    title: "Lidé za vínem",
    description:
      "Vinaři, sklepmistři a pěstitelé vyprávějí o svém kraji, o svém řemesle a o tom, co víno skutečně utváří.",
  },

  ui: {
    magazin: "Magazín",
    interviews: "Rozhovory",
    interview: "Rozhovor",
    editorial: "Redakce",
    readingProgress: "Postup čtení",
    close: "Zavřít rozhovor",
    readDirectly: "Číst článek",
    aboutPerson: "O hostovi",
    continueReading: "Číst dál",
    tasted: "Ochutnáno v rozhovoru",
  },

  items: [
    {
      slug: "daniele-malavasi-lugana-doc",
      draft: false,

      eyebrow: "Maria Maria × Lago di Garda · V dialogu",
      badge: "Lugana DOC · Turbiana · Pozzolengo",
      name: "Daniele Malavasi",
      headline: "Lugana vzniká z terroiru, ne z etikety",
      deck: "Z Pozzolenga až ke Gardskému jezeru: Daniele Malavasi vysvětluje, jak morénové půdy, mírné klima jezera a odrůda Turbiana utvářejí Luganu – a proč toto víno zvládne u stolu mnohem víc než jen aperitiv.",

      seo: {
        title: "Daniele Malavasi o Lugana DOC a terroiru",
        description:
          "Daniele Malavasi vysvětluje, jak Turbiana, morénové půdy a klima Gardského jezera utvářejí Lugana DOC – a proč je víc než aperitiv.",
      },

      byline: {
        interview: "Maria Pia Tolo",
        editorial: "Maria Maria",
        date: null,
        readingTime: "6 min čtení",
      },

      portrait: {
        src: "/img/magazin/interviews/daniele-malavasi.jpg",
        alt: "Daniele Malavasi se sklenkou Lugany a se svým psem mezi řadami révy ve vinici v Pozzolengu",
      },

      intro: [
        "Některým vínům nelze porozumět jen přes odrůdu nebo etiketu. Porozumíme jim, když poznáme místo, kde vznikají – a lidi, kteří tam každý den rozhodují. Pro Danieleho Malavasiho proto příběh Lugany nezačíná ve sklenici, ale v Pozzolengu: v jílovitých morénových půdách jižně od Gardského jezera, v odrůdě Turbiana a v klimatu, které dává vínu čas rozvinout vlastní charakter.",
        "Daniele je majitelem Cantina Malavasi v Pozzolengu. Jeho pohled spojuje každodenní práci ve vinici s dlouholetým vztahem k Maria Maria. V rozhovoru vypráví, proč je důvěra základem spolupráce, proč zůstává autenticita důležitější než jakákoli móda a proč by se Lugana měla znovu objevit jako vážný společník k jídlu.",
      ],

      sections: [
        {
          id: "vertrauen",
          heading: "Spolupráce, která začíná důvěrou",
          paragraphs: [
            "Co Danieleho na projektu Maria Maria přesvědčilo, nebyl nejprve marketingový nápad, ale roky rostoucí pouto s Marií a Valeriem. Z osobní důvěry se stala spolupráce, která se podle jeho hodnocení stále rozvíjí pro obě strany.",
            "K této společné historii patří i velmi osobní vzpomínka: jeho matka Ames. Marii a Valeria vždy přijímala s velkou srdečností. Pro Danieleho je tato pohostinnost dodnes součástí onoho pouta – a dokladem toho, že vztah existoval dávno před tímto rozhovorem.",
            "Blízkost sama o sobě však jeho rozhodnutí nevysvětluje. Rozhodující pro něj byl i způsob, jakým chce Maria Maria o víně vyprávět: ne jako o izolovaném produktu, ale jako o výsledku konkrétního prostředí.",
          ],
          quote:
            "Maria Maria nevybírá jen produkt, ale i kontext, z něhož vzniká: Gardské jezero, oblast Lugana a lidi, kteří tam každý den pracují.",
          after: [
            "Z výběru vína se tak stává vědomé rozhodnutí pro místo, pro způsob práce a pro lidi, kteří za ním stojí.",
          ],
        },
        {
          id: "authentizitaet",
          heading: "Autenticita před módou",
          paragraphs: [
            "Mezi hodnotami Maria Maria rozpoznává Daniele především dvě: autenticitu a výběr s jasnými kritérii. Ve své práci ve sklepě se řídí stejným principem. Několik vědomých rozhodnutí má nechat odrůdu a půdu viditelné, místo aby je nechalo zmizet za naaranžovaným obrazem.",
            "Pro vinařský projekt, který chce přiblížit italské regiony publiku v Německu, je tato myšlenka klíčová. Autenticita nevzniká romantickými tvrzeními o Itálii, ale srozumitelným výběrem: kdo víno vyrábí? Kde rostou hrozny? Které vlastnosti pocházejí z území – a která rozhodnutí utvářejí styl?",
            "Daniele shrnuje tento postoj stručně: místo má mluvit zřetelněji než technika ve sklepě.",
          ],
        },
        {
          id: "terroir",
          heading: "Co dělá Luganu rozpoznatelnou ve sklenici",
          media: {
            src: "/img/magazin/interviews/terroir-pozzolengo.jpg",
            alt: "Vinice u Pozzolenga s výhledem přes morénové kopce ke Gardskému jezeru",
            caption: "Vinice v Pozzolengu a pohled přes morénové kopce až k jezeru.",
          },
          paragraphs: [
            "Oblast Lugana leží jižně od Gardského jezera mezi Lombardií a Benátskem. Pozzolengo patří k obcím chráněného označení původu. Pro Danieleho vzniká zvláštní identita vína ze souhry půd, jezera a odrůdy.",
            "Jílovité půdy jsou morénového původu a utvářela je geologická historie území. Zároveň blízkost Gardského jezera ovlivňuje klima. Daniele popisuje jezero jako zásobník tepla: v létě je pohlcuje a na podzim a v zimě je zase vydává. Silné teplotní výkyvy se tím zmírňují a fáze zrání se může prodloužit.",
            "Také jíl plní důležitou funkci. Zadržuje vodu a podle Danieleho zkušenosti přispívá ke struktuře a k výrazně vnímatelnému slanému napětí ve víně. Poloha a orientace jednotlivých vinic pak ovlivňují aromatickou jemnost.",
            "Ve středu stojí Turbiana, charakteristická odrůda Lugana DOC. Ve sklenici nehledá Daniele okamžitý efekt, ale rovnováhu: mezi kyselinou a slaným napětím, mezi čistým ovocem a suchým, přesným dojmem. Přesvědčivá Lugana pro něj nemá vyprávět nejdřív o sklepní technice, ale o svém území.",
          ],
          list: {
            label: "Podle čeho Daniele pozná přesvědčivou Luganu",
            items: [
              "Rovnováha mezi kyselinou a slaným napětím",
              "Čisté ovoce bez nápadné sladkosti",
              "Struktura z jílovitých morénových půd",
              "Víno, které vypráví o místě, ne o sklepní technice",
            ],
          },
        },
        {
          id: "mehr-als-aperitif",
          heading: "Víc než svěží, nekomplikované bílé víno",
          media: {
            src: "/img/magazin/interviews/turbiana-trauben.jpg",
            alt: "Zralé hrozny Turbiany na révě ve vinici u Pozzolenga",
            caption: "Turbiana — charakteristická odrůda Lugana DOC.",
          },
          paragraphs: [
            "Je-li Lugana vnímána jen jako svěží, snadno přístupné bílé víno od Gardského jezera, je to pro Danieleho příliš málo. Takový popis přehlíží právě ty vlastnosti, které víno činí zajímavým: strukturu, schopnost vývoje a jasnou územní identitu.",
            "Německému publiku by proto Luganu představil jako bílé víno, které umí zrát a dál se rozvíjet. Ne jako libovolné víno na „easy drinking“, ale jako vážného společníka k jídlu – svým nárokem srovnatelného s charakterními bílými víny, která už mnoho německých milovníků vína oceňuje.",
            "Tento pohled mění i okamžik požitku. Víno nemusí zůstat omezeno na terasu, léto a aperitiv. Jeho kyselina, struktura a slané napětí mu otevírají pevné místo u jídelního stolu.",
          ],
          quote:
            "Lugana není jen aperitivní víno. Jeho struktura a slané napětí unesou i náročnější pokrmy.",
        },
      ],

      pairing: {
        heading: "Lugana u stolu: od Gardského jezera k italské kuchyni",
        media: {
          src: "/img/magazin/interviews/lugana-risotto.jpg",
          alt: "Krémové rizoto s jezerní rybou, citronem a bylinkami vedle sklenky Lugany",
        },
        paragraphs: [
          "U snoubení s jídlem začíná Daniele tam, kde začíná i víno: u Gardského jezera. Mezi jeho doporučení patří místní sladkovodní ryby jako lavarello a sušené sardinky a také jemně vyladěná rizota.",
          "Zároveň Lugana unese víc, než mnozí čekají. Daniele jmenuje baccalà mantecato – krémově našlehanou tresku – a bílé maso s lehkou omáčkou. Rozhodující přitom není samotná tíha pokrmu, ale souhra textury, kořenění a slané svěžesti vína.",
          "Pro Maria Maria je tato poznámka obzvlášť cenná: food pairing se tím nestává dekorativním doplňkem produktu, ale srozumitelným převodem vína do všedního dne. Kdo zažije, jak se Lugana promění vedle rizota, rybího pokrmu nebo bílého masa, pochopí její všestrannost bezprostředněji než z technických údajů.",
        ],
        items: [
          {
            icon: "fish",
            title: "Ryby z Gardského jezera",
            text: "Lavarello a sušené sardinky.",
          },
          { icon: "risotto", title: "Rizoto", text: "Jemně vyladěná, delikátní rizota." },
          { icon: "stockfish", title: "Baccalà mantecato", text: "Krémově našlehaná treska." },
          { icon: "poultry", title: "Bílé maso", text: "S lehkou omáčkou." },
        ],
      },

      serving: {
        heading: "Nejčastější chyba: podávat příliš vychlazené",
        paragraphs: [
          "Lugana může ztratit mnoho ze svého výrazu, dostane-li se do sklenice příliš studená. Daniele to označuje za jednu z nejčastějších chyb při servisu. Příliš nízká teplota uhlazuje právě ty vlastnosti, které mají víno utvářet: slané napětí, minerálně působící svěžest a aromatickou jemnost.",
          "Druhá chyba z té první často přímo vyplývá: zacházet s vínem výhradně jako s aperitivem. Kdo je podává jen velmi studené a před jídlem, bere mu příležitost ukázat strukturu ve spojení se složitějšími pokrmy.",
          "Doporučení proto není pevné číslo, ale vědomý přístup: podávat chlazené, ale ne tak studené, aby víno zůstalo zavřené. Ve sklenici má dostat čas se otevřít.",
        ],
      },

      outro: {
        heading: "Přesně určené místo – ne libovolné bílé víno",
        paragraphs: [
          "Co si má publikum Maria Maria z tohoto rozhovoru odnést? Pro Danieleho především jedno poznání: za Luganou stojí přesně vymezené území. Není to obecné bílé víno ze severní Itálie, ale výraz souhry Turbiany, morénově utvářených půd, jezerního klimatu a každodenní práce.",
          "Vyplatí se proto přistupovat k Luganě se stejnou zvědavostí, jakou věnujeme velkým bílým vínům Evropy. Ne proto, že by každá Lugana musela být stejná, ale právě proto, že původ, vinice a rozhodnutí dokážou rozdíly zviditelnit.",
          "I svou budoucí roli v Maria Maria chápe Daniele v tomto smyslu. Chce vnést pohled producenta, který území zažívá každý den – a proto může mluvit nejen o víně, ale i o lidech a rozhodnutích, která za ním stojí.",
          "Pro Maria Maria se tím kruh uzavírá: etiketa činí víno rozpoznatelným. Jeho význam ale vzniká tam, kde se setkávají půda, klima, odrůda a lidé.",
        ],
      },

      profile: {
        name: "Daniele Malavasi",
        role: "Majitel Cantina Malavasi, Pozzolengo",
        text: "Vinařství leží v oblasti Lugana, s vinicemi mezi Pozzolengem a Desenzano del Garda.",
        link: { label: "Cantina Malavasi", href: "https://www.malavasivini.com/it/azienda" },
      },

      wine: {
        slug: "lugana",
        heading: "Objevte Lugana DOC od Maria Maria",
        text: "Objevte Lugana DOC od Maria Maria – vinifikovanou Danielem Malavasim v Pozzolengu. Víno, které drží v rovnováze původ, odrůdu a řemeslo.",
        cta: "K Luganě",
      },

      paths: [
        {
          id: "region",
          icon: "region",
          title: "Region Gardské jezero",
          text: "Objevte terroir.",
          href: "/regionen#garda",
        },
        {
          id: "pairing",
          icon: "pairing",
          title: "Food pairing",
          text: "Inspirace pro stůl.",
          href: "/magazin#food-pairing",
        },
        {
          id: "interviews",
          icon: "interviews",
          title: "Další rozhovory",
          text: "Přečtěte si všechny.",
          href: "/magazin#interviste",
        },
      ],

      teaserMagazin: {
        eyebrow: "Rozhovory · V dialogu",
        badge: "Lugana DOC · Pozzolengo",
        title: "Lugana vzniká z terroiru, ne z etikety",
        teaser:
          "O Turbianě, jílovitých morénových půdách a klimatu Gardského jezera – a o tom, proč Lugana u stolu zvládne víc než jen aperitiv.",
        meta: "Rozhovor · 6 min čtení",
        cta: "Číst rozhovor",
      },

      teaserRegion: {
        region: "garda",
        eyebrow: "Hlasy z regionu · Lugana DOC",
        title: "Luganu vyprávějí skuteční lidé",
        paragraphs: [
          "Čím je tohle bílé víno od jezera Garda tak výjimečné? Daniele Malavasi vypráví o morénových půdách, Turbianě, jezerním klimatu — a o Luganě, která se z jeho sklepa dostala do kolekce Maria Maria.",
        ],
        pull: "Víno má vyprávět spíš o místě než o technice ve sklepě.",
        ctaPrimary: "Číst rozhovor",
        ctaSecondary: "Objevit Luganu",
      },
    },
  ],
};

export default interviews;
