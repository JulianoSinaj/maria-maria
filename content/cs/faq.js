/* Viz content/de/faq.js — stejná struktura ve všech čtyřech jazycích.
   Hodnoty `id` a cesty odkazů se nepřekládají: nesou deep linky a faq_id
   v GA4. */

export const faq = {
  home: [
    {
      id: "home-was-ist",
      q: "Co je Maria Maria?",
      a: "Maria Maria znamená osobně vybíraná butiková vína z Itálie. Vybraný sortiment spojuje autentický původ, odrůdy s charakterem a italský styl života – pro všechny, kdo víno vybírají a vychutnávají vědomě.",
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
      link: { label: "Poznejte Maria Maria jako partnera", href: "/kontakt#kontakt-haendler" },
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
      label: "Lugana u Gardského jezera",
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
      a: "Orientačně podle našich technických karet: Lugana při 8–10 °C, Greco a Falanghina kolem 10 °C, Rosato při 12–14 °C, silná červená vína jako Primitivo a Il Rosso při 16–18 °C. V nejistotě raději podávejte chladnější — ve sklenici se víno ohřeje samo.",
    },
    {
      id: "wissen-dekantieren",
      q: "Musí se Primitivo dekantovat?",
      a: "Ne, nutné to není. Silná mladá červená vína ale trocha vzduchu před podáváním prospěje — konkrétní doporučení z technické karty najdete na stránce daného vína.",
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
      a: "Ano — kromě Německa doručujeme do vybraných evropských zemí. Cena a doba dodání závisí na cílové zemi a jsou transparentně uvedeny v objednávkovém procesu. Zda doručujeme do vaší země, rádi ověříme předem — stačí nám napsat.",
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
      a: "My osobně: přes kontaktní formulář nebo telefonicky vám poradíme s menu, příležitostí i dárkem — a pomůžeme i s dotazy k vaší objednávce. Odpovídáme do 1–2 pracovních dnů.",
      link: { label: "Kontaktovat nás", href: "/kontakt" },
    },
  ],

  /* ---- Kontakt: šest otázek z Kontakt-Handoffu (18. 8. 2026) ----
     Plochý seznam bez indexu klastrů: schválený mockup ukazuje jeden
     akordeon vedle obrázku. `kontakt-haendler` si ponechává své ID, protože
     na něj odkazuje FAQ na úvodní stránce. ---- */
  kontakt: [
    {
      id: "kontakt-verkostung-buchen",
      q: "Jak si zarezervuji degustaci vín v Düsseldorfu?",
      a: "V kontaktním formuláři zvolte „Degustace“ a sdělte nám požadovaný termín, přibližný počet osob a příležitost. Místo a formát s vámi domluvíme osobně a do 1–2 pracovních dnů se ozveme s návrhem.",
    },
    {
      id: "kontakt-haendler",
      q: "Mohu zařadit Maria Maria do svého sortimentu?",
      a: "Ano. Zvolte „Obchod & další prodej“ a stručně nám řekněte o svém obchodě, sídle a požadovaném výběru. Poté osobně probereme vhodné další kroky.",
    },
    {
      id: "kontakt-firmenveranstaltungen",
      q: "Nabízíte vína pro firemní akce?",
      a: "Ano. Pro firemní akce, konference a zvláštní příležitosti vám poradíme s výběrem vín. Sdělte nám datum, počet hostů, místo a charakter akce, abychom mohli vaši poptávku cíleně probrat.",
    },
    {
      id: "kontakt-gastronomie",
      q: "Mohu nabízet vína Maria Maria ve své restauraci nebo lahůdkářství?",
      a: "Ano. Zvolte „Gastronomie & lahůdky“ a stručně nám řekněte o svém podniku, kuchyni či konceptu a sídle. Společně najdeme výběr, který se hodí k vašim hostům.",
    },
    {
      id: "kontakt-individuelle-auswahl",
      q: "Jak funguje individuální výběr vín?",
      a: "Nejprve nám řeknete o svém záměru. Na přání poznáte vína při degustaci. Z vašich favoritů pak vznikne výběr, který se hodí k vašemu konceptu, menu nebo příležitosti.",
    },
    {
      id: "kontakt-kaufen",
      q: "Kde mohu vína Maria Maria koupit?",
      a: "Vína lze objednat v oficiálním e-shopu Maria Maria. Na kontaktní stránce zůstává e-shop vedlejší cestou, aby poptávky na poradenství, akce a B2B nebyly odváděny z kontaktního funnelu.",
      link: { label: "Do oficiálního e-shopu", href: "/shop" },
    },
  ],
};

export default faq;
