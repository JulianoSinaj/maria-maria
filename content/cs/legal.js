/* Právní texty: tiráž, zásady ochrany osobních údajů, obchodní podmínky.

   DŮLEŽITÉ — jde o překlad, nikoli o závazný dokument. Maria Maria Wines GmbH
   je německá společnost, řídí se německým právem (§ 9 obchodních podmínek) a
   závazná je německá verze na /agb, /datenschutz a /impressum. `bindingNotice`
   to uvádí přímo na stránce — je to běžná praxe německých e-shopů prodávajících
   v rámci EU.

   Odkazy na německé právní předpisy (TMG, RStV, články GDPR) zůstávají v
   původní podobě: označují konkrétní ustanovení a po přeložení by byly
   nedohledatelné.

   Změní-li se odstavec v content/de/legal.js, musí být převeden i sem ve
   stejném kroku. Zastaralé přeložené poučení o odstoupení od smlouvy je horší
   než žádné. */

export const legal = {
  shell: {
    eyebrow: "Právní informace",
    updatedLabel: "Stav:",
    updated: "Červenec 2026",
    contactPre: "Máte k tomu dotaz? Napište nám kdykoli přes",
    contactLink: "kontaktní stránku",
    contactMid: "nebo na",
    bindingNotice:
      "Toto je český překlad pro vaše pohodlí. Právně závazná je německá původní verze.",
  },

  impressum: {
    title: "Tiráž",
    sections: [
      {
        title: "Údaje podle § 5 TMG",
        body: [
          "Maria Maria Wines GmbH",
          "Elberfelder strasse 78d, 40822 Mettmann, Německo",
          "Zastoupena jednateli společnosti.",
        ],
      },
      {
        title: "Kontakt",
        body: ["E-mail: info@maria-maria.de"],
      },
      {
        title: "Zápis v rejstříku",
        body: [
          "Zápis v obchodním rejstříku. Rejstříkový soud: Amtsgericht Düsseldorf.",
          "Číslo zápisu a DIČ podle § 27a německého zákona o DPH (UStG) budou na tomto místě doplněny po dokončení zápisu.",
        ],
      },
      {
        title: "Odpovědnost za obsah podle § 55 odst. 2 RStV",
        body: ["Maria Maria Wines GmbH, Elberfelder strasse 78d, 40822 Mettmann."],
      },
      {
        title: "Ochrana mladistvých",
        body: [
          "Alkoholické nápoje prodáváme výhradně osobám starším 18 let. Objednávkou potvrzujete, že jste dovršili 18 let. Vyhrazujeme si právo vyžádat si doklad o věku.",
        ],
      },
      {
        title: "Řešení sporů",
        body: [
          "Evropská komise poskytuje platformu pro řešení sporů online (ODR): https://ec.europa.eu/consumers/odr. Naši e-mailovou adresu najdete výše v tiráži.",
          "Nejsme ochotni ani povinni účastnit se řízení o řešení sporů před spotřebitelským smírčím orgánem.",
        ],
      },
      {
        title: "Odpovědnost za obsah a odkazy",
        body: [
          "Jako poskytovatel služeb odpovídáme za vlastní obsah těchto stránek podle obecných zákonů, ve smyslu § 7 odst. 1 TMG. Za obsah externích odkazů neručíme; za obsah odkazovaných stránek odpovídá vždy příslušný provozovatel.",
        ],
      },
    ],
  },

  datenschutz: {
    title: "Zásady ochrany osobních údajů",
    intro:
      "Ochrana vašich osobních údajů je pro nás důležitá. Zde se dozvíte, které údaje a za jakým účelem zpracováváme — co nejstručněji a nejsrozumitelněji.",
    sections: [
      {
        title: "1. Správce",
        body: [
          "Správcem zpracování údajů na těchto webových stránkách je Maria Maria Wines GmbH, Elberfelder strasse 78d, 40822 Mettmann, Německo, e-mail: info@maria-maria.de.",
        ],
      },
      {
        title: "2. Shromažďování a uchovávání osobních údajů",
        body: [
          "Při návštěvě těchto stránek server automaticky zaznamenává technické informace (např. IP adresu, datum a čas přístupu, vyžádanou stránku, typ prohlížeče). Tyto údaje slouží výhradně k zajištění bezporuchového provozu a nejsou spojovány s jinými zdroji dat.",
          "Právním základem je čl. 6 odst. 1 písm. f GDPR (oprávněný zájem na bezpečném provozu webu).",
        ],
      },
      {
        title: "3. Kontaktní formulář a poptávky degustací",
        body: [
          "Pokud nám napíšete přes kontaktní formulář, zpracováváme vámi uvedené údaje (jméno, e-mailová adresa, předmět, typ dotazu, zpráva a u poptávek degustací požadovaný termín a počet hostů) výhradně za účelem vyřízení vašeho dotazu.",
          "Právním základem je čl. 6 odst. 1 písm. b GDPR (opatření před uzavřením smlouvy), resp. čl. 6 odst. 1 písm. f GDPR. Údaje jsou vymazány, jakmile již nejsou pro vyřízení potřebné a nebrání tomu zákonné lhůty pro uchovávání.",
        ],
      },
      {
        title: "4. Objednávky v e-shopu",
        body: [
          "Pro vyřízení objednávek zpracováváme údaje nezbytné k uzavření smlouvy, doručení a platbě (jméno, adresa, e-mail, platební údaje). Právním základem je čl. 6 odst. 1 písm. b GDPR.",
          "Údaje předáváme pouze poskytovatelům služeb zapojeným do vyřízení objednávky (např. přepravcům a poskytovatelům platebních služeb) a vždy jen v nezbytném rozsahu.",
        ],
      },
      {
        title: "5. Newsletter",
        body: [
          "Pro rozesílání newsletteru používáme postup double opt-in: po přihlášení obdržíte e-mail, v němž přihlášení potvrdíte. Právním základem je váš souhlas podle čl. 6 odst. 1 písm. a GDPR; kdykoli jej můžete odvolat odhlašovacím odkazem v newsletteru.",
        ],
      },
      {
        title: "6. Cookies a lokální úložiště",
        body: [
          "Tento web nepoužívá sledovací ani marketingové cookies. Pro funkci košíku se využívá lokální úložiště prohlížeče (localStorage); žádné osobní údaje nám přitom nejsou předávány.",
          "Vámi zvolený jazyk se ukládá do technicky nezbytného cookie (mm_locale), aby vás web při další návštěvě přivítal ve zvoleném jazyce. Obsahuje pouze kód jazyka a neslouží k vaší identifikaci.",
        ],
      },
      {
        title: "7. Vaše práva",
        body: [
          "Máte právo na přístup (čl. 15 GDPR), opravu (čl. 16 GDPR), výmaz (čl. 17 GDPR), omezení zpracování (čl. 18 GDPR), přenositelnost údajů (čl. 20 GDPR) a vznesení námitky proti zpracování (čl. 21 GDPR).",
          "Dále máte právo podat stížnost u dozorového úřadu pro ochranu osobních údajů — v Severním Porýní-Vestfálsku: zemská zmocněnkyně pro ochranu údajů a svobodu informací NRW.",
        ],
      },
    ],
  },

  agb: {
    title: "Všeobecné obchodní podmínky",
    sections: [
      {
        title: "§ 1 Rozsah platnosti",
        body: [
          "Tyto všeobecné obchodní podmínky platí pro všechny objednávky učiněné prostřednictvím e-shopu společnosti Maria Maria Wines GmbH, Elberfelder strasse 78d, 40822 Mettmann (dále jen „Maria Maria"), ze strany spotřebitelů i podnikatelů.",
        ],
      },
      {
        title: "§ 2 Uzavření smlouvy",
        body: [
          "Prezentace produktů v e-shopu nepředstavuje právně závaznou nabídku, nýbrž výzvu k podání objednávky. Odesláním objednávky činíte závaznou nabídku; smlouva vzniká naším potvrzením objednávky e-mailem.",
        ],
      },
      {
        title: "§ 3 Prodej pouze zletilým osobám",
        body: [
          "Alkoholické nápoje prodáváme výhradně osobám, které dovršily 18 let. Objednávkou stvrzujete svou zletilost. Doručení probíhá pouze po vizuální kontrole věku ze strany dopravce.",
        ],
      },
      {
        title: "§ 4 Ceny a náklady na dopravu",
        body: [
          "Všechny ceny jsou uvedeny v eurech včetně zákonné DPH, k nim se připočítávají náklady na dopravu. Konkrétní náklady na dopravu jsou transparentně uvedeny v průběhu objednávky před jejím odesláním.",
        ],
      },
      {
        title: "§ 5 Dodání a limitované edice",
        body: [
          "Dodáváme v rámci Německa a do vybraných evropských zemí. Naše vína vznikají ve vědomě limitované edici; nabídka proto platí pouze do vyprodání zásob. Pokud objednané víno již není k dispozici, neprodleně vás informujeme a již uhrazené platby vrátíme.",
        ],
      },
      {
        title: "§ 6 Platba",
        body: [
          "Platba probíhá způsoby nabízenými v průběhu objednávky. Zvolíte-li způsob platby zajišťovaný poskytovatelem platebních služeb, platí doplňkově jeho podmínky užívání.",
        ],
      },
      {
        title: "§ 7 Právo na odstoupení od smlouvy",
        body: [
          "Spotřebitelům náleží zákonné právo odstoupit od smlouvy ve lhůtě 14 dnů. Lhůta začíná běžet převzetím zboží. K uplatnění postačí jednoznačné prohlášení na info@maria-maria.de. Náklady na vrácení zboží nese kupující, pokud dodané zboží odpovídá objednanému.",
        ],
      },
      {
        title: "§ 8 Záruka a odpovědnost",
        body: [
          "Platí zákonná práva z vadného plnění. Za lehkou nedbalost odpovídáme pouze při porušení podstatných smluvních povinností, a to omezeně do výše předvídatelné škody typické pro tento druh smlouvy.",
        ],
      },
      {
        title: "§ 9 Závěrečná ustanovení",
        body: [
          "Platí právo Spolkové republiky Německo s vyloučením Úmluvy OSN o smlouvách o mezinárodní koupi zboží. Vůči spotřebitelům platí tato volba práva jen v rozsahu, v němž je nezbavuje ochrany, kterou jim poskytují kogentní ustanovení práva státu jejich obvyklého pobytu.",
        ],
      },
    ],
  },
};

export default legal;
