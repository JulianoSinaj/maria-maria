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
      "Vinaři, znalci vína a lidé z jednotlivých krajů vyprávějí o původu, řemesle a o tom, co víno skutečně utváří.",
  },

  ui: {
    magazin: "Magazín",
    interviews: "Rozhovory",
    interview: "Rozhovor",
    editorial: "Redakce",
    aboutPerson: "O hostovi",
    continueReading: "Číst dál",
    tasted: "Ochutnáno v rozhovoru",
    inThisConversation: "V tomto rozhovoru",
  },

  items: [
    {
      slug: "daniele-malavasi-lugana-doc",
      draft: false,

      eyebrow: "Maria Maria × Gardské jezero · V dialogu",
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
        src: "/img/magazin/daniele-solo.jpeg",
        alt: "Daniele Malavasi se sklenkou Lugany a se svým psem mezi řadami révy ve vinici v Pozzolengu",
        position: "object-top",
      },

      intro: [
        "Některým vínům nelze porozumět jen podle odrůdy nebo etikety. Porozumíme jim, když poznáme místo, kde vznikají – a lidi, kteří tam každý den rozhodují. Pro Danieleho Malavasiho proto příběh Lugany nezačíná ve sklenici, ale v Pozzolengu: v jílovitých morénových půdách jižně od Gardského jezera, v odrůdě Turbiana a v klimatu, které dává vínu čas rozvinout vlastní charakter.",
        "Daniele je majitelem vinařství Cantina Malavasi v Pozzolengu. Jeho pohled spojuje každodenní práci ve vinici s dlouholetým vztahem k Maria Maria. V rozhovoru vypráví, proč je důvěra základem spolupráce, proč zůstává autenticita důležitější než jakákoli móda a proč by Lugana měla být znovu objevena jako vážný společník k jídlu.",
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
            "V centru stojí Turbiana, charakteristická odrůda Lugana DOC. Ve sklenici nehledá Daniele nápadný efekt, ale rovnováhu: mezi kyselinou a slaným napětím, mezi čistým ovocem a suchým, přesným dojmem. Přesvědčivá Lugana pro něj nemá vyprávět nejdřív o sklepní technice, ale o svém území.",
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
          /* Native Ratio des Fotos — zeigt das volle Bild statt des 16:9-Beschnitts. */
          aspect: "4/3",
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
        heading: "Nejčastější chyba: podávat víno příliš vychlazené",
        paragraphs: [
          "Lugana může ztratit mnoho ze svého výrazu, dostane-li se do sklenice příliš studená. Daniele to označuje za jednu z nejčastějších chyb při podávání. Příliš nízká teplota uhlazuje právě ty vlastnosti, které mají víno utvářet: slané napětí, minerálně působící svěžest a aromatickou jemnost.",
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
        worksFor: "Cantina Malavasi",
        text: "Vinařství leží v oblasti Lugana, s vinicemi mezi Pozzolengem a Desenzano del Garda.",
        link: { label: "Cantina Malavasi", href: "https://www.malavasivini.com/it/azienda" },
      },

      wine: {
        slug: "lugana",
        photo: {
          src: "/img/magazin/interviews/lugana-vino-bianco-magazine-cutout.png",
          alt: "Láhev Lugana DOC od Maria Maria",
        },
        heading: "Objevte Lugana DOC od Maria Maria",
        text: "Objevte Lugana DOC od Maria Maria – vinifikovanou Danielem Malavasim v Pozzolengu. Víno, které drží v rovnováze původ, odrůdu a řemeslo.",
        cta: "K Luganě",
      },

      paths: [
        {
          id: "region",
          icon: "region",
          title: "Region Gardského jezera",
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
        portrait: { src: "/img/daniele222.jpeg" },
        eyebrow: "Hlasy z regionu · Lugana DOC",
        title: "Luganu vyprávějí skuteční lidé",
        paragraphs: [
          "Čím je toto bílé víno od Gardského jezera tak výjimečné? Daniele Malavasi vypráví o morénových půdách, Turbianě, jezerním klimatu — a o Luganě, která se z jeho sklepa dostala do kolekce Maria Maria.",
        ],
        pull: "Víno má vyprávět spíš o místě než o technice ve sklepě.",
        ctaPrimary: "Číst rozhovor",
        ctaSecondary: "Objevit Luganu",
      },
    },

    {
      slug: "francesco-de-stefano-irpinien-weissweine",
      draft: false,

      /* Slug zůstává ve všech čtyřech jazycích německý — jazyk stojí
         v prefixu, nikdy ve slugu, jinak by se skupina hreflang rozpadla. */

      eyebrow: "Maria Maria × Kampánie · V dialogu",
      badge: "Greco di Tufo DOCG · Fiano di Avellino DOCG · Falanghina",
      name: "Francesco De Stefano",
      headline: "Tři bílá vína, tři charaktery – čím je Irpinie výjimečná",
      deck: "Z irpinských výšin až ke stolu: Francesco De Stefano vypráví o Greco di Tufo, Fiano di Avellino a Falanghině – a o tom, proč původ, charakter a food pairing patří při výběru vína dohromady.",

      ghost: "Irpinia",

      seo: {
        title: "Francesco De Stefano o Irpinii a kampánských bílých vínech",
        description:
          "Greco di Tufo, Fiano di Avellino a Falanghina: Francesco De Stefano o Irpinii, food pairingu a vědomém výběru vína.",
      },

      byline: {
        interview: "Maria Pia Tolo",
        editorial: "Maria Maria",
        date: null,
        readingTime: "6 min čtení",
      },

      portrait: {
        src: "/img/magazin/interviews/francesco-de-stefano.jpg",
        alt: "Francesco De Stefano nalévá ve večerním světle bílé víno Maria Maria do sklenky",
        position: "object-top",
      },

      intro: [
        "Kdo chce vínu skutečně porozumět, nevystačí si s odrůdou. Původ, styl, způsob servírování i pokrm na stole mění to, jak víno vnímáme. Pro Francesca De Stefana je právě tento vědomý výběr rozhodující.",
        "V rozhovoru s Maria Maria provází Kampánií a především Irpinií. V centru stojí Greco di Tufo, Fiano di Avellino a Falanghina – tři bílá vína, která mají pro Francesca odlišný charakter i odlišné chvíle u stolu.",
      ],

      sections: [
        {
          id: "gemeinsame-werte",
          heading: "Spolupráce, která začíná společnými hodnotami",
          paragraphs: [
            "Na projektu Maria Maria Francesca přesvědčili především lidé, kteří za ním stojí. Jako rozhodující důvody, proč je ochoten projekt doprovázet, uvádí oddanost projektu, serióznost Valeria a Marie a jejich odbornost.",
            "K tomu se přidává společný postoj: stejná vášeň a stejné hledání kvality, které podle Francescových slov utvářejí i jeho vlastní práci.",
          ],
          quote:
            "Nejvíc mě zaujala oddanost projektu a serióznost, kterou Valerio a Maria projevují.",
        },
        {
          id: "irpinien",
          heading: "Irpinie: tři DOCG v jediné provincii",
          paragraphs: [
            "Kampánie je pro Francesca odjakživa symbolickým územím italského vinařství, zvláště na jihu Itálie. Odkazuje na vinařskou tradici sahající až do doby římské a v rámci regionu vyzdvihuje především Irpinii.",
            "To, že se právě tato provincie může pyšnit třemi apelacemi DOCG, je pro něj důležitým znamením významu území a jeho mimořádné vinařské způsobilosti. K nim se přidává Aglianico del Taburno, další DOCG na Beneventsku.",
          ],
        },
        {
          id: "hoehe-und-klima",
          heading: "Co ve sklence mění nadmořská výška a klima",
          /* CHYBÍ FOTOGRAFIE: odpovídající kapitola rozhovoru s Danielem nese
             krajinný snímek. Pro Irpinii zatím žádný není. */
          paragraphs: [
            "Charakter vín odvozuje Francesco především od klimatu a nadmořské výšky. Oba faktory podle jeho vysvětlení přispívají k vyšší kyselině. Výsledkem jsou vína s větší strukturou a rozhodnějším charakterem.",
            "Právě pro publikum, které kampánská bílá vína teprve objevuje, je tento pohled užitečný: ne každé bílé víno z jihu Itálie je měkké a nekomplikované.",
          ],
        },
        {
          id: "drei-charaktere",
          heading: "Greco, Fiano a Falanghina: tři odlišné charaktery",
          paragraphs: [
            "Francesco nepovažuje Greco di Tufo, Fiano di Avellino a Falanghinu za zaměnitelné varianty. Greco di Tufo popisuje ve srovnání jako výrazněji minerální.",
            "Fiano na něj působí měkčeji a všestranněji a byl by jeho doporučením pro ty, kdo tyto styly objevují poprvé. Falanghina vykazuje v jeho srovnání sušší tendenci a nachází přirozené místo u aperitivu.",
          ],
          list: {
            label: "Jak Francesco tři vína rozlišuje",
            items: [
              "Greco di Tufo — ve srovnání výrazněji minerální",
              "Fiano di Avellino — měkčí a všestrannější, jeho návrh pro začátek",
              "Falanghina — sušší tendence, s přirozeným místem u aperitivu",
            ],
          },
        },
      ],

      pairing: {
        heading: "Kampánská bílá vína u stolu",
        /* CHYBÍ FOTOGRAFIE — viz kapitola o nadmořské výšce a klimatu. */
        paragraphs: [
          "Fiano di Avellino by Francesco podával k ne příliš výraznému rybímu pokrmu, například ke krevetám nebo pstruhovi.",
          "Greco di Tufo má pro něj výraznější minerální složku, a může proto doprovodit poněkud složitější rybí pokrmy nebo bílé maso. Zvlášť vyzdvihuje Greco di Tufo s buvolí mozzarellou.",
          "Falanghinu vidí i u aperitivu, například k frisselle s rajčaty San Marzano.",
        ],
        items: [
          { icon: "fish", title: "Fiano di Avellino", text: "Ke krevetám nebo pstruhovi." },
          {
            icon: "stockfish",
            title: "Greco di Tufo",
            text: "Ke složitějším rybím pokrmům a bílému masu.",
          },
          {
            icon: "plate",
            title: "Buvolí mozzarella",
            text: "Kombinace, kterou Francesco vyzdvihuje zvlášť.",
          },
          {
            icon: "glasses",
            title: "Falanghina k aperitivu",
            text: "Například k frisselle s rajčaty San Marzano.",
          },
        ],
      },

      serving: {
        heading: "Nejčastější chyba začíná u teploty",
        paragraphs: [
          "Častá chyba leží pro Francesca už v servírování. Bílé víno může do sklenky přijít příliš studené, ale i příliš teplé. Konkrétní počet stupňů neuvádí.",
          "Totéž platí pro kombinace s jídlem: kdo přehlíží výraznější mineralitu Greca nebo větší měkkost Fiana, zachází s velmi odlišnými víny, jako by byla stejná.",
        ],
      },

      outro: {
        heading: "Proč výběr vína nikdy není banální",
        paragraphs: [
          "Nakonec Francesco všechna témata převádí na jednu myšlenku: výběr vína nikdy není banální. Původ, styl, pokrm a způsob servírování se navzájem ovlivňují.",
          "Svou roli v Maria Maria vidí Francesco v tom, že stávající odbornost Valeria a Marie doplní o vlastní zkušenost, a přispěje tak k dalšímu rozvoji projektu.",
        ],
        quote: "Výběr vína nikdy není banální.",
      },

      faq: {
        eyebrow: "Časté otázky",
        title: "Kampánská bílá vína —",
        titleAccent: "krátce zodpovězeno.",
        description:
          "Kde začít, čím se tři vína liší, jak je kombinovat a proč záleží na teplotě: pět otázek, které po tomto rozhovoru nejčastěji zůstávají otevřené.",
        items: [
          {
            id: "francesco-einsteiger",
            q: "Které kampánské bílé víno se hodí pro začátečníky?",
            a: "Francesco by doporučil Fiano. Popisuje ho jako měkčí a všestrannější než Greco di Tufo a jako méně suše působící než Falanghina.",
          },
          {
            id: "francesco-unterschied",
            q: "Jaký je rozdíl mezi Greco di Tufo, Fianem a Falanghinou?",
            a: "Greco na Francesca působí výrazněji minerálně, Fiano měkčeji a všestranněji a Falanghina vykazuje ve srovnání sušší tendenci.",
          },
          {
            id: "francesco-greco-pairing",
            q: "Co se hodí ke Greco di Tufo?",
            a: "Poněkud složitější rybí pokrmy, bílé maso a především buvolí mozzarella.",
          },
          {
            id: "francesco-fisch",
            q: "Které kampánské bílé víno se hodí k rybě?",
            a: "K lehčím rybím pokrmům uvádí Francesco Fiano di Avellino; Greco di Tufo může doprovodit i strukturovanější přípravy.",
          },
          {
            id: "francesco-temperatur",
            q: "Proč je teplota servírování důležitá?",
            a: "Příliš nízká i příliš vysoká teplota patří pro Francesca k nejčastějším chybám. Konkrétní počet stupňů neuvádí.",
          },
        ],
      },

      profile: {
        name: "Francesco De Stefano",
        /* OTEVŘENÉ: master source uvádí profesní označení jako „doplnit až po
           potvrzení". Dokud chybí, pole zůstává stranou. */
        text: "Francesco doprovází Maria Maria svou zkušeností a znalostí kampánského vinařského světa.",
      },

      wine: {
        slug: "greco-di-tufo",
        href: "/unsere-weine?region=kampanien",
        heading: "Objevte kampánská bílá vína u Maria Maria",
        text: "Greco di Tufo, Fiano di Avellino a Falanghina — kampánská bílá vína z kolekce, každé s charakterem, o kterém Francesco v rozhovoru vypráví.",
        cta: "Objevit kampánská vína",
      },

      paths: [
        {
          id: "region",
          icon: "region",
          title: "Region Kampánie",
          text: "Objevte terroir.",
          href: "/regionen#kampanien",
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
          text: "Přečtěte si všechny rozhovory.",
          href: "/magazin#interviste",
        },
      ],

      teaserMagazin: {
        eyebrow: "Rozhovory · V dialogu",
        badge: "Irpinie · Kampánie",
        title: "Tři bílá vína, tři charaktery: čím je Irpinie výjimečná",
        teaser:
          "O Greco di Tufo, Fiano di Avellino a Falanghině – a o tom, proč původ, food pairing a vědomý výběr vína patří dohromady.",
        meta: "Rozhovor · 6 min čtení",
        cta: "Číst rozhovor",
      },

      teaserRegion: {
        region: "kampanien",
        portrait: { src: "/img/magazin/interviews/francesco-de-stefano.jpg" },
        eyebrow: "Hlasy z regionu · Irpinie",
        title: "Kampánii vyprávějí skuteční lidé",
        paragraphs: [
          "Čím se bílá vína Kampánie tak liší? Francesco De Stefano vypráví o Irpinii, Greco di Tufo, Fiano di Avellino a Falanghině — a o tom, proč původ, charakter a správný food pairing patří při výběru vína dohromady.",
        ],
        pull: "Výběr vína nikdy není banální.",
        ctaPrimary: "Číst rozhovor",
        ctaSecondary: "Objevit Greco di Tufo",
      },
    },
  ],
};

export default interviews;
