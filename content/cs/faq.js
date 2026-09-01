/* Viz content/de/faq.js — stejná struktura ve všech čtyřech jazycích.
   Hodnoty `id` a cesty odkazů se nepřekládají: nesou deep linky a faq_id
   v GA4. */

export const faq = {
  home: [
    {
      id: "home-was-ist",
      q: "Co je Maria Maria?",
      a: "Maria Maria znamená osobně vybíraná butiková vína z Itálie. Vybraný sortiment spojuje autentický původ, odrůdy s charakterem a italský styl života – pro milovníky vína i hostitele, kteří víno vybírají a vychutnávají vědomě.",
    },
    {
      id: "home-sortiment",
      q: "Jaká vína Maria Maria nabízí?",
      a: "Sortiment tvoří devět vybraných bílých, růžových a červených vín z Kampánie, Apulie a oblasti kolem Gardského jezera. Patří mezi ně mimo jiné Lugana, Falanghina, Greco di Tufo, Aglianico a několik vín Primitivo.",
      link: { label: "Objevit všechna vína", href: "/unsere-weine" },
    },
    {
      id: "home-anlass",
      q: "Které víno Maria Maria se hodí k mé příležitosti?",
      a: "Aperitiv, večeře, snoubení s jídlem, akce nebo stylový dárek: na stránce každého vína najdete chuť, charakter, teplotu podávání i vhodné pokrmy. S konkrétním dotazem vám rádi pomůžeme s výběrem.",
      link: { label: "Najít to správné víno", href: "/unsere-weine" },
    },
    {
      id: "home-partner",
      q: "Spolupracuje Maria Maria s gastronomií, hotelnictvím a lifestylovými partnery?",
      a: "Ano. Maria Maria se obrací i na vybrané partnery z gastronomie, hotelnictví, event branže, retailu a lifestylu, kteří chtějí italská butiková vína zapojit do svého konceptu. Poptávky a možnou spolupráci probíráme osobně.",
      link: { label: "Poznejte Maria Maria jako partnera", href: "/kontakt#kontakt-sortiment" },
    },
    {
      id: "home-kontakt",
      q: "Jak mohu Maria Maria kontaktovat?",
      a: "Použijte náš kontaktní formulář, pokud máte dotaz k našim vínům, ke spolupráci nebo k výjimečné příležitosti. Ozveme se vám osobně.",
      link: { label: "Kontaktovat nás", href: "/kontakt" },
    },
  ],

  weine: [
    {
      id: "weine-wahl-farbe",
      q: "Jak si vybrat mezi červeným, bílým a rosé?",
      a: "Řiďte se okamžikem, ne pravidlem: silná červená vína jako Primitivo k výrazné kuchyni a dlouhým večerům, svěží bílá jako Lugana, Greco nebo Falanghina k rybám, lehčím pokrmům a jako aperitiv — a rosé, když má vše zůstat lehké a středomořské.",
      link: { label: "Ke kolekci", href: "#kollektion" },
    },
    {
      id: "weine-anlass",
      q: "Které víno se hodí ke které příležitosti?",
      a: "K aperitivu: Rosato Puglia, Falanghina nebo Il Bianco, dobře vychlazené. K večeři: Lugana nebo Greco di Tufo k rybám — Primitivo nebo Il Rosso k masu a výrazným primi. K dobrým rozhovorům s přáteli: víno, jehož příběh chcete vyprávět.",
    },
    {
      id: "weine-geschenk",
      q: "Které víno se hodí jako dárek?",
      a: "Pro znalce: Primitivo 15,5 z terakotové amfory nebo Greco di Tufo se statusem D.O.C.G. Pro začátečníky: přístupná Falanghina nebo Primitivo Salento IGP. A jistotou je vybraný degustační balíček — elegantně zabalený, na přání s přáníčkem.",
      link: { label: "K degustačním balíčkům", href: "/shop#pakete" },
    },
    {
      id: "weine-essen",
      q: "Jak najdu víno k danému pokrmu?",
      a: "Rozhoduje příprava, ne jen surovina — u těstovin například záleží na omáčce: jemné úpravy si žádají svěží bílá vína, výrazná ragù strukturované červené. Na stránce každého vína najdete doporučení z jeho technické karty.",
      link: { label: "Snoubení s jídlem v magazínu", href: "/magazin" },
    },
  ],

  regionen: [
    {
      key: "apulien",
      label: "Apulie",
      items: [
        {
          id: "reg-apulien-weine",
          q: "Co utváří charakter apulských vín?",
          a: "Hodně slunce, vysoké teploty, červené a vápenité půdy i blízkost moře utvářejí mnoho vín z Apulie. Podle odrůdy a způsobu zrání vznikají ovocná, kořenitá a silná vína, která přesto mohou být velmi rozdílná.",
          link: { label: "Zobrazit vína z Apulie", href: "/unsere-weine?region=apulien" },
        },
        {
          id: "reg-apulien-primitivo",
          q: "Co je Primitivo a jak chutná?",
          a: "Primitivo je jednou z nejcharakterističtějších odrůd Apulie. Typické jsou aromata zralého tmavého ovoce, teplá kořenitost a plné tělo. Styl a zbytkový cukr se však liší podle původu a vinifikace.",
          link: { label: "Objevit Primitivo di Manduria", href: "/unsere-weine/primitivo-14-5" },
        },
        {
          id: "reg-apulien-salento",
          q: "Co znamená Salento IGP?",
          a: "Salento IGP je chráněné zeměpisné označení pro vína z jižní části Apulie. Označuje původ, nikoli automaticky určitou chuť nebo jednu odrůdu.",
          link: { label: "K Primitivo Salento IGP", href: "/unsere-weine/primitivo-salento" },
        },
        {
          id: "reg-apulien-pairing",
          q: "K jakým pokrmům se hodí apulská červená vína?",
          a: "Silná apulská červená vína se často hodí k dušeným pokrmům, grilovanému masu, výrazným těstovinám a zrajícím sýrům. Rozhoduje intenzita, kořenění a příprava pokrmu; konkrétní doporučení najdete na stránce daného vína.",
          link: { label: "Primitivo 15,5 a jeho snoubení", href: "/unsere-weine/primitivo-15-5" },
        },
      ],
    },
    {
      key: "kampanien",
      label: "Kampánie",
      items: [
        {
          id: "reg-kampanien-rebsorten",
          q: "Čím je Kampánie jako vinařský region výjimečná?",
          a: "Kampánie spojuje různé oblasti, nadmořské výšky a půdy. V Irpinii vznikají mimo jiné Greco di Tufo a Aglianico, zatímco Falanghina hraje důležitou roli i v Beneventu. Tato rozmanitost dává velmi odlišné charaktery vín.",
          link: { label: "Zobrazit vína z Kampánie", href: "/unsere-weine?region=kampanien" },
        },
        {
          id: "reg-kampanien-greco",
          q: "Čím se liší Greco di Tufo a Falanghina?",
          a: "Greco di Tufo působí často strukturovaněji, minerálněji a intenzivněji. Falanghina bývá svěžejší, vonnější a přístupnější. Přesný styl vždy závisí na původu, ročníku a zrání.",
          link: { label: "Objevit Greco di Tufo", href: "/unsere-weine/greco-di-tufo" },
        },
        {
          id: "reg-kampanien-falanghina",
          q: "Odkud pochází Falanghina?",
          a: "Falanghina patří k nejstarším odrůdám Kampánie a je silně zastoupena zejména v Beneventu. Naše Falanghina roste právě tam, v kopcích — svěží, vonná a středomořská v projevu.",
          link: { label: "Objevit Falanghinu", href: "/unsere-weine/falanghina" },
        },
        {
          id: "reg-kampanien-aglianico",
          q: "Co je Aglianico a jaký styl má „Il Rosso“?",
          a: "Aglianico je významná červená odrůda jižní Itálie. „Il Rosso“ od Maria Maria je ze 100 % Aglianico – nejde o cuvée – a představuje červené víno s charakterem, strukturou a kořenitou hloubkou.",
          link: { label: "Objevit Il Rosso", href: "/unsere-weine/il-rosso-aglianico" },
        },
      ],
    },
    {
      key: "garda",
      label: "Lombardie, Gardské jezero",
      items: [
        {
          id: "reg-garda-gebiet",
          q: "Kde leží vinařská oblast Lugana?",
          a: "Oblast Lugana leží na jižním břehu Gardského jezera a zasahuje do částí Lombardie a Benátska. Do vymezené zóny DOC patří území v provinciích Brescia a Verona. Pozzolengo je jedním z míst, kde jsou jílovité morénové půdy a vliv jezera nejvýraznější.",
        },
        {
          id: "reg-garda-turbiana",
          q: "Která odrůda určuje Lugana DOC?",
          a: "Hlavní odrůdou Lugana DOC je Turbiana, místně nazývaná také Trebbiano di Lugana. Podle výrobního předpisu musí Lugana DOC obsahovat nejméně 90 procent Turbiany; ostatní povolené nearomatické bílé odrůdy mohou tvořit dohromady nejvýše 10 procent. Ve vjemu vína stojí Turbiana jednoznačně v popředí.",
          link: { label: "K Luganě", href: "/unsere-weine/lugana" },
        },
        {
          id: "reg-garda-geschmack",
          q: "Jak chutná Lugana?",
          a: "Lugana bývá svěží, elegantní a jemně minerální, s aromaty citrusů, bílých květů a podle stylu i zralejšího jádrového ovoce. Stáří, zrání a ročník profil ovlivňují.",
        },
        {
          id: "reg-garda-aperitif",
          q: "Proč je Lugana víc než aperitivní víno?",
          a: "Lugana bývá vnímána jako svěží víno k aperitivu. Daniele Malavasi však zdůrazňuje její strukturu, slanost a potenciál vývoje. Právě tyto vlastnosti z ní dělají gastronomicky všestranné bílé víno, které funguje napříč celým menu, nejen před jídlem.",
          link: {
            label: "Přečíst rozhovor s Danielem Malavasim",
            href: "/magazin/interviews/daniele-malavasi-lugana-doc",
          },
        },
        {
          id: "reg-garda-mm",
          q: "K jakým pokrmům se hodí Lugana?",
          a: "K Luganě se hodí ryby z Gardského jezera, rizoto, krémově našlehaná treska a bílé maso s lehkými omáčkami. Nerozhoduje ani tak pevné pravidlo jako rovnováha mezi svěžestí, slaností a texturou pokrmu.",
          link: { label: "Objevit snoubení v magazínu", href: "/magazin#food-pairing" },
        },
        {
          id: "reg-garda-temperatur",
          q: "Proč by se Lugana neměla podávat příliš vychlazená?",
          a: "Když se Lugana podává příliš studená, hůř se projeví právě ty vlastnosti, které tvoří její identitu: slanost, minerálnost a aromatická jemnost. Proto by neměla přijít do sklenice ledová. Přesná teplota podávání se řídí stylem a doporučením výrobce.",
        },
      ],
    },
  ],

  magazin: [
    {
      id: "wissen-temperatur",
      q: "Jaká je ideální teplota podávání?",
      a: "Orientačně podle našich technických karet: Lugana při 8–10 °C, Greco a Falanghina kolem 10 °C, Rosato při 12–14 °C, silná červená vína jako Primitivo a Il Rosso při 16–18 °C. V případě pochybností podávejte víno raději o něco chladnější — ve sklenici se ohřeje samo.",
    },
    {
      id: "wissen-dekantieren",
      q: "Musí se Primitivo dekantovat?",
      a: "Ne, nutné to není. Silným mladým červeným vínům ale trocha vzduchu před podáváním prospěje — konkrétní doporučení z technické karty najdete na stránce daného vína.",
      link: { label: "K doporučení podávání Primitivo 15,5", href: "/unsere-weine/primitivo-15-5" },
    },
    {
      id: "wissen-glas",
      q: "Jaká sklenice ke kterému vínu?",
      a: "Silná červená vína mají ráda velkou sklenici s dostatkem prostoru pro vzduch, bílá štíhlejší sklenici, která soustředí svěžest. U aromatických bílých, jako je cuvée z Greca, se vyplatí baňatější sklenice na bílé víno — tam se buket rozvine nejlépe.",
    },
    {
      id: "wissen-lagerung",
      q: "Jak víno správně skladovat?",
      a: "V chladu, tmě a klidu — ideální jsou stálé teploty bez výkyvů, láhve s přírodním korkem naležato. Naše vína jsou určena k požitku: doporučení k podávání najdete na každé stránce vína v kapitole „Chuť“.",
    },
    {
      id: "wissen-docg",
      q: "Jaký je rozdíl mezi DOC, DOCG a IGP?",
      a: "Tři stupně italského systému původu: IGP (chráněné zeměpisné označení) je nejširší, DOC neboli DOP (chráněné označení původu) je užší, DOCG nejvyšší stupeň — kontrolované a zaručené. V naší kolekci sahá škála od Salento IGP po Greco di Tufo DOCG.",
      link: { label: "Objevit kolekci podle původu", href: "/unsere-weine" },
    },
    {
      id: "wissen-rebsorten",
      q: "Které italské odrůdy stojí za to znát?",
      a: "Z naší kolekce: Primitivo a Negroamaro z Apulie, Aglianico z jihu, bílé Falanghina a Greco z Kampánie a Turbiana od Gardského jezera. Každá stránka vína svou odrůdu podrobně představuje i s původem a charakterem.",
      link: { label: "Objevit odrůdy v kolekci", href: "/unsere-weine" },
    },
  ],

  geschichte: [
    {
      key: "hospitality",
      label: "Nezávislá gastronomie",
      items: [
        {
          id: "b2b-konzept",
          q: "Která italská vína se hodí k malému gastronomickému konceptu?",
          a: "Malý, pečlivě sestavený výběr z naší kolekce: svěží bílé víno jako Falanghina nebo Lugana, Rosato Puglia k aperitivu a Primitivo nebo Il Rosso k výrazné kuchyni. Která vína se hodí k vaší kuchyni, cenové hladině a rozlévání po skleničkách, domluvíme s vámi osobně — navrhujeme jen to, co je skutečně v sortimentu.",
          link: { label: "Odeslat poptávku pro gastronomii", href: "/kontakt#kontakt-gastronomie" },
        },
        {
          id: "b2b-einstieg",
          q: "Mohu začít s malým, pečlivě sestaveným výběrem?",
          a: "Začít s několika promyšleně zvolenými položkami je cesta, kterou doporučujeme: dvě bílá, jedno rosato, dvě červená — a lístek roste s vašimi hosty. Od jakého objemu a za jakých podmínek je start možný, probereme osobně; záleží na podniku a výběru.",
          link: { label: "Povězte nám o svém podniku", href: "/kontakt#kontakt-gastronomie" },
        },
        {
          id: "b2b-aperitivo",
          q: "Která vína se hodí k aperitivu a k rozlévání po skleničkách?",
          a: "Svěží vína kolekce: Rosato Puglia, Falanghina, Il Bianco a Lugana — podávaná dobře vychlazená, nekomplikovaná na skleničku a se skutečnými párováními od aperitivu po rybu. Které formáty a množství jsou pro váš výčep k dispozici, upřesníme osobně.",
          link: { label: "Aperitiv ve snoubení s jídlem", href: "/magazin#food-pairing" },
        },
        {
          id: "b2b-beratung",
          q: "Jak může Maria Maria pomoci s výběrem pro můj koncept?",
          a: "Osobně, ve třech krocích: povíte nám o svém podniku, kuchyni a hostech. Poradíme vám a na přání zorganizujeme degustaci v Düsseldorfu a okolí. Z vašich favoritů vznikne výběr pro váš lístek — první odpověď dostanete do 1–2 pracovních dnů.",
          link: { label: "Jak funguje individuální výběr", href: "/kontakt#kontakt-individuelle-auswahl" },
        },
      ],
    },
    {
      key: "premium",
      label: "Prémiová gastronomie & hotely",
      items: [
        {
          id: "b2b-speisekarte",
          q: "Která vína Maria Maria se hodí k našemu menu?",
          a: "Nejraději odpovídáme podle vašeho skutečného lístku: pošlete nám menu a styl servisu a navrhneme vína s ověřenými párováními z technických karet. První představu dá přepínač příležitostí v magazínu a doporučení na každé stránce vína.",
          link: { label: "Objevit snoubení podle příležitosti", href: "/magazin#food-pairing" },
        },
        {
          id: "b2b-belieferung",
          q: "Zásobuje Maria Maria restaurace, vinotéky a butikové hotely?",
          a: "Ano — Maria Maria spolupracuje s vybranými partnery z gastronomie, specializovaného obchodu a hospitality, kteří chtějí italská butiková vína začlenit do svého konceptu. Poradenství a degustace nabízíme v Düsseldorfu a Severním Porýní-Vestfálsku; oblast rozvozu, rytmus a množství domlouváme s každým podnikem osobně, protože naše produkce je záměrně limitovaná.",
          link: { label: "Poptat partnerství", href: "/kontakt#kontakt-sortiment" },
        },
        {
          id: "b2b-herkunft",
          q: "Jsou k dispozici informace o původu a výrobcích pro obsluhu?",
          a: "Ano. Každá stránka vína nese technickou kartu s odrůdou, původem, zráním a teplotou podávání, stránka regionů vypráví, co utváří Apulii, Kampánii a Gardské jezero, a v rozhovorech v magazínu promlouvají sami výrobci — podklady, s nimiž váš tým doporučuje u stolu s jistotou. Další materiály nebo školení pro váš tým domluvíme osobně.",
          link: { label: "Regiony a jejich vína", href: "/regionen" },
        },
        {
          id: "b2b-konditionen",
          q: "Jaké podmínky platí pro gastronomii a specializovaný obchod?",
          a: "Podmínky, množství a odběrové stupně probíráme osobně — přizpůsobené vašemu podniku, výběru a potřebě, ne jako ceník. Povězte nám krátce o svém podnikání a požadovaném výběru; ozveme se do 1–2 pracovních dnů se všemi podrobnostmi.",
          link: { label: "Odeslat obchodní poptávku", href: "/kontakt#kontakt-sortiment" },
        },
      ],
    },
    {
      key: "partner",
      label: "Eventy, retail & partneři",
      items: [
        {
          id: "b2b-events",
          q: "Která vína se hodí na firemní akce nebo zvláštní příležitosti?",
          a: "Řídí se to příležitostí, menu a počtem hostů: na přivítání svěží bílá a Rosato, k večeři Lugana nebo Greco di Tufo k rybě, Primitivo nebo Il Rosso k masu. Sdělte nám datum, počet hostů, místo a charakter akce — množství a logistiku na tomto základě vyjasníme osobně.",
          link: { label: "Poptat vína na akci", href: "/kontakt#kontakt-firmenveranstaltungen" },
        },
        {
          id: "b2b-geschenke",
          q: "Jsou možné dárkové sady nebo individuální prezentace?",
          a: "Ano. Elegantní dárkové balení a osobní přáníčko jsou k dispozici přímo v e-shopu — pro jednotlivé láhve i pro sestavené degustační balíčky. Pro větší počty kusů nebo individuální prezentaci pro vaše firemní zákazníky se nám ozvěte: možnosti, termíny a množství upřesníme osobně.",
          link: { label: "Dárkové doručení v e-shopu", href: "/shop#shop-geschenk" },
        },
        {
          id: "b2b-weinkonzept",
          q: "Může Maria Maria sestavit vinný koncept pro aktivaci?",
          a: "Vinný koncept pro aktivaci, značkový projekt nebo sérii akcí u nás začíná briefingem: cíl, formát, počet hostů a časový rámec. Na tomto základě společně vyjasníme, která vína, jaký rozsah a jaké služby dávají smysl — a kdo za co odpovídá. Popište nám krátce svůj nápad.",
          link: { label: "Popsat svůj nápad", href: "/kontakt" },
        },
        {
          id: "b2b-verkostung",
          q: "Je možná degustace před zahájením spolupráce?",
          a: "Ano. Poznejte Maria Maria ve sklenici, než se rozhodnete: při osobní degustaci v Düsseldorfu a okolí objevíte své favority, z nichž pak vznikne váš výběr. Místo, formát a termín domluvíme s vámi — návrh obdržíte do 1–2 pracovních dnů.",
          link: { label: "Domluvit degustaci", href: "/kontakt#kontakt-verkostung-buchen" },
        },
      ],
    },
  ],

  shop: [
    {
      id: "shop-kaufen",
      q: "Kde mohu vína Maria Maria koupit?",
      a: "Přímo zde v oficiálním e-shopu — s celým sortimentem a vybranými degustačními balíčky za zvýhodněnou cenu. Rádi vám osobně poradíme s výběrem pro váš okamžik, vaše menu nebo váš dárek.",
    },
    {
      id: "shop-versand",
      q: "Jak rychlé je doručení — a kolik stojí doprava?",
      a: "Vína k vám dorazí do 1–3 pracovních dnů, bezpečně a elegantně zabalená. Od hodnoty objednávky 69 € doručujeme zdarma.",
    },
    {
      id: "shop-international",
      q: "Posíláte i do zahraničí?",
      a: "Ano — kromě Německa doručujeme do vybraných evropských zemí. Cena dopravy a doba dodání závisí na cílové zemi a jsou transparentně uvedeny v objednávkovém procesu. Zda doručujeme do vaší země, rádi ověříme předem — stačí nám napsat.",
    },
    {
      id: "shop-bezahlung",
      q: "Jak mohu v e-shopu zaplatit?",
      a: "Pohodlně a bezpečně: přijímáme všechny běžné platební metody — se šifrováním SSL a bez oklik. Dostupné možnosti jsou transparentně uvedeny v objednávkovém procesu.",
    },
    {
      id: "shop-geschenk",
      q: "Mohu nechat víno poslat jako dárek?",
      a: "Ano — s osobním přáníčkem, elegantním dárkovým balením a doručením přímo obdarovanému. Stačí své přání uvést v objednávce.",
    },
    {
      id: "shop-beratung",
      q: "Kdo mi pomůže s objednávkou nebo výběrem vína?",
      a: "My osobně: přes kontaktní formulář nebo e-mailem vám poradíme s menu, příležitostí i dárkem — a pomůžeme i s dotazy k vaší objednávce. Odpovídáme do 1–2 pracovních dnů.",
      link: { label: "Kontaktovat nás", href: "/kontakt" },
    },
  ],

  kontakt: [
    {
      key: "allgemein",
      label: "Obecné dotazy",
      items: [
        {
          id: "kontakt-erreichen",
          q: "Jak mohu Maria Maria kontaktovat?",
          a: "Nejrychleji přes kontaktní formulář — stačí zvolit téma dotazu. Zastihnete nás také e-mailem na info@maria-maria.de. Odpovídáme do 1–2 pracovních dnů.",
        },
        {
          id: "kontakt-weininfo",
          q: "Kde najdu informace o vínech?",
          a: "Každé víno má vlastní stránku s chuťovým profilem, původem, technickými údaji, snoubením s jídlem a častými dotazy — od Primitiva po Luganu.",
          link: { label: "K našim vínům", href: "/unsere-weine" },
        },
      ],
    },
    {
      key: "verkostungen",
      label: "Degustace",
      items: [
        {
          id: "kontakt-verkostung-buchen",
          q: "Jak si mohu objednat degustaci vína v Düsseldorfu?",
          a: "V kontaktním formuláři zvolte „Poptávka degustace“ — pak můžete rovnou uvést požadovaný termín a počet hostů. Do 1–2 pracovních dnů se ozveme s osobním návrhem.",
        },
        {
          id: "kontakt-verkostung-ort",
          q: "Kde se degustace konají?",
          a: "V Düsseldorfu a okolí. Místo a formát s vámi domluvíme osobně — stačí nám ve formuláři popsat vaši příležitost.",
        },
        {
          id: "kontakt-verkostung-privat",
          q: "Mohu si objednat soukromou degustaci?",
          a: "Ano — soukromé degustace jsou možné stejně jako firemní termíny. Uveďte ve formuláři požadovaný termín a počet hostů; odpovíme osobním návrhem.",
        },
        {
          id: "kontakt-verkostung-corporate",
          q: "Nabízí Maria Maria firemní degustace?",
          a: "Ano, pro firemní příležitosti a týmy. Napište nám krátce o příležitosti a velikosti skupiny — připravíme vhodný návrh a ozveme se do 1–2 pracovních dnů.",
        },
        {
          id: "kontakt-verkostung-kaufen",
          q: "Mohu degustovaná vína následně koupit?",
          a: "Ano — všechna vína kolekce najdete v oficiálním e-shopu. Po degustaci vám rádi osobně poradíme s vašimi favority.",
          link: { label: "Do oficiálního e-shopu", href: "/shop" },
        },
      ],
    },
    {
      key: "haendler",
      label: "Prodejci",
      items: [
        {
          id: "kontakt-haendler",
          q: "Jak zařadím vína Maria Maria do svého sortimentu?",
          a: "Zvolte ve formuláři „Poptávka prodejce“ a napište nám krátce o svém obchodě nebo podniku a o svém regionu. Ozveme se osobně se všemi detaily.",
        },
        {
          id: "kontakt-haendler-finden",
          q: "Najdu vína v místním obchodě?",
          a: "Naše vína jsou k dispozici u vybraných specializovaných prodejců a v gastronomii. Protože je produkce omezená, rádi vám na vyžádání doporučíme partnera ve vašem okolí.",
        },
      ],
    },
    {
      key: "presse",
      label: "Tisk a spolupráce",
      items: [
        {
          id: "kontakt-presse",
          q: "Na koho mám směřovat dotazy médií?",
          a: "Přímo na nás: přes kontaktní formulář (téma „Tisk a spolupráce“) nebo e-mailem na info@maria-maria.de. Ozveme se osobně.",
        },
        {
          id: "kontakt-kooperationen",
          q: "Je Maria Maria otevřená spolupráci?",
          a: "Ano — spolupráci a společným projektům jsme otevřeni. Popište nám krátce svůj nápad; odpovídáme do 1–2 pracovních dnů.",
        },
      ],
    },
    {
      key: "shop",
      label: "E-shop a doprava",
      items: [
        {
          id: "kontakt-kaufen",
          q: "Kde mohu vína koupit?",
          a: "V oficiálním e-shopu Maria Maria. Všechny detaily k sortimentu, degustačním balíčkům a objednávce najdete v servisních dotazech přímo v e-shopu.",
          link: { label: "K dotazům e-shopu", href: "/shop#fragen" },
        },
        {
          id: "kontakt-versand",
          q: "Nabízíte mezinárodní dopravu?",
          a: "Ano — kromě Německa doručujeme do vybraných evropských zemí. Všechny detaily k době dodání a ceně dopravy najdete v servisních dotazech e-shopu a v objednávkovém procesu.",
          link: { label: "K dotazům e-shopu", href: "/shop#fragen" },
        },
      ],
    },
  ],
};

export default faq;
