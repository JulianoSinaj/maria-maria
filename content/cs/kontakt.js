/* Kontaktní stránka — stejná struktura jako content/de/kontakt.js.

   Výchozím jazykem je němčina: handoff tam stanoví závazné texty, tady je
   jejich překlad. Klíč, který vznikne v němčině, musí vzniknout i tady —
   lib/i18n/dictionaries záměrně nemá tichý fallback, takže chybějící klíč
   nechá viditelnou mezeru místo neviditelně špatného textu.

   Technické hodnoty témat (gastronomie_feinkost, event_feier …) se
   NEPŘEKLÁDAJÍ. Leží v components/kontakt/intents.js a zůstávají ve všech
   čtyřech jazycích stejné, protože na nich visí backend, směrování poptávek
   i vyhodnocování. */

export const kontakt = {
  hero: {
    eyebrow: "Kontakt · Vinné poradenství pro Düsseldorf a NRW",
    title: "Víno pro váš okamžik.",
    titleSecond: "Vybrané osobně.",
    text: "Pro gastronomii, obchod, akce a zvláštní příležitosti. Poznejte Maria Maria a najděte společně s námi vína, která se hodí k vašemu konceptu, vašim hostům nebo vaší příležitosti.",
    ctaPrimary: "Poptat poradenství",
    ctaSecondary: "Domluvit degustaci",
    promise: "Osobní odpověď do 1–2 pracovních dnů.",
    imageAlt: "Maria Maria Il Rosso a Il Bianco v lahvích 375 ml na prostřeném stole.",
  },

  details: {
    emailLabel: "E-mail",
    email: "info@maria-maria.de",
    locationLabel: "Sídlo",
    location: "Mettmann, Německo",
  },

  intents: {
    title: "Proč nás chcete kontaktovat?",
    intro: "Vyberte příležitost, která nejlépe odpovídá vašemu záměru.",
    items: {
      gastronomie: {
        title: "Gastronomie a lahůdky",
        text: "Chcete Maria Maria nabízet ve své restauraci, kavárně, vinárně nebo lahůdkářství? Společně najdeme výběr, který sedne vašemu konceptu, vaší kuchyni i vašim hostům.",
        cta: "Poptávka gastronomie",
      },
      handel: {
        title: "Obchod a další prodej",
        text: "Chcete Maria Maria zařadit do svého sortimentu? Promluvme si o výběru vín, množstvích a možnostech osobní spolupráce.",
        cta: "Poptávka partnerství",
      },
      event: {
        title: "Akce a zvláštní příležitosti",
        text: "Od firemních akcí a konferencí až po svatby, narozeniny a soukromé oslavy: poradíme vám s výběrem vín, která odpovídají příležitosti, menu i počtu hostů.",
        cta: "Poptávka vín na akci",
      },
      verkostung: {
        title: "Degustace a výběr na míru",
        text: "Poznejte Maria Maria ve sklenici. Při osobní degustaci objevíte své favority; poté společně sestavíme váš výběr na míru.",
        cta: "Domluvit degustaci",
      },
    },
  },

  process: {
    title: "Takto najdeme vaše víno",
    steps: [
      {
        title: "Řeknete nám o svém záměru",
        text: "Restaurace, sortiment, akce, degustace nebo zvláštní příležitost: čím lépe váš záměr známe, tím cíleněji můžeme poradit.",
      },
      {
        title: "Poradíme vám osobně",
        text: "Probereme vaše přání a na přání uspořádáme degustaci v Düsseldorfu a okolí, abyste vína poznali osobně.",
      },
      {
        title: "Vybereme společně",
        text: "Z vašich favoritů vznikne výběr, který sedne vašemu konceptu, vašim hostům, vašemu menu nebo vaší příležitosti.",
      },
    ],
    closing: "Od první poptávky až po správný výběr vás doprovázíme osobně.",
  },

  bridge: {
    title: "Víno doprovází okamžiky, na které se vzpomíná.",
    text: "Při večeři doma, u stolu v restauraci, na firemní akci nebo při zvláštní oslavě: Maria Maria spojuje lidi, potěšení a charakterní italská vína.",
    claim: "Váš výběr. Vaše příležitost. Naše vína.",
    imageAlt: "Víno Maria Maria na prostřeném stole pro večeři a zvláštní příležitosti.",
  },

  form: {
    title: "Řekněte nám o svém záměru.",
    intro:
      "Čím více o vaší příležitosti víme, tím lépe vám poradíme. Vyberte nejprve téma — poté zobrazíme jen pole, která jsou pro vaši poptávku opravdu podstatná.",
    hints: [
      { title: "U akcí", text: "datum, počet hostů, typ akce" },
      { title: "U gastronomie/obchodu", text: "typ provozu, požadovaný výběr" },
    ],
    trust: "Osobně. Upřímně. S vášní pro víno.",

    intent: {
      label: "O co jde?",
      placeholder: "Prosím vyberte",
      options: {
        gastronomie_feinkost: "Gastronomie a lahůdky",
        handel_wiederverkauf: "Obchod a další prodej",
        event_feier: "Akce / oslava",
        verkostung: "Degustace",
        individuelle_auswahl: "Výběr vín na míru",
        sonstiges: "Jiné",
      },
    },
    name: { label: "Jméno", placeholder: "Vaše jméno" },
    email: { label: "E-mail", placeholder: "vas@email.cz" },
    company: { label: "Firma / provozovna", placeholder: "např. restaurace, hotel, obchod" },
    city: { label: "Město / PSČ", placeholder: "např. Düsseldorf, 40210" },
    phone: { label: "Telefon (nepovinné)", placeholder: "např. 0176 12345678" },
    message: { label: "Zpráva", placeholder: "Popište krátce svůj záměr…" },

    conditional: {
      eventDate: { label: "Datum / požadovaný termín" },
      eventType: { label: "Typ akce", placeholder: "např. firemní akce, svatba, narozeniny" },
      guests: { label: "Přibližný počet hostů", placeholder: "např. 40" },
      location: { label: "Místo konání", placeholder: "např. Düsseldorf" },
      tastingDate: { label: "Požadovaný termín" },
      persons: { label: "Počet osob", placeholder: "např. 8" },
      occasion: {
        label: "Příležitost",
        placeholder: "Prosím vyberte",
        options: {
          privat: "Soukromá",
          unternehmen: "Firma / tým",
          gastro: "Gastronomie / obchod",
          sonstiger: "Jiná příležitost",
        },
      },
      businessTypeGastro: {
        label: "Typ provozu",
        placeholder: "Prosím vyberte",
        options: {
          restaurant: "Restaurace",
          cafe: "Kavárna",
          weinbar: "Vinárna",
          feinkost: "Lahůdky",
          sonstiges: "Jiné",
        },
      },
      businessTypeHandel: {
        label: "Typ provozu",
        placeholder: "Prosím vyberte",
        options: {
          weinhandel: "Obchod s vínem",
          feinkost: "Lahůdky",
          fachhandel: "Specializovaný obchod",
          sonstiges: "Jiné",
        },
      },
      selection: {
        label: "Zájem / požadovaný výběr",
        placeholder: "např. červená vína z Apulie, degustační balíček",
      },
      context: { label: "Příležitost / kontext", placeholder: "např. doprovod k menu, dárek" },
      guestsOptional: { label: "Počet hostů (nepovinné)", placeholder: "např. 12" },
      style: {
        label: "Preferovaný styl (nepovinné)",
        placeholder: "např. plná červená, svěží bílá",
      },
    },

    privacyPre: "Přečetl/a jsem si",
    privacyLink: "zásady ochrany osobních údajů",
    privacyPost: "a souhlasím se zpracováním svých údajů za účelem vyřízení mé poptávky.",
    required: "povinné pole",
    submit: "Odeslat poptávku",
    sending: "Odesílá se…",

    errors: {
      intent: "Vyberte prosím, o co jde.",
      name: "Uveďte prosím své jméno.",
      email: "Uveďte prosím svou e-mailovou adresu.",
      emailInvalid: "Uveďte prosím platnou e-mailovou adresu.",
      message: "Popište prosím krátce svůj záměr.",
      privacy: "Souhlaste prosím se zásadami ochrany osobních údajů.",
      send: "Poptávku se nepodařilo odeslat. Zkuste to prosím znovu.",
    },

    success: {
      title: "Děkujeme za vaši poptávku.",
      text: "Ozveme se vám osobně do 1–2 pracovních dnů.",
      again: "Nová poptávka",
    },
  },

  faq: {
    title: "Časté dotazy",
    more: "Zobrazit všechny dotazy",
    less: "Zobrazit méně dotazů",
    imageAlt: "Maria Maria Il Rosso a Il Bianco v lahvích 375 ml s detaily servírování.",
    items: [
      {
        id: "kontakt-verkostung-buchen",
        q: "Jak si zarezervuji degustaci vín v Düsseldorfu?",
        a: "V kontaktním formuláři zvolte „Degustace“ a uveďte požadovaný termín, přibližný počet osob a příležitost. Místo a formát s vámi domluvíme osobně a do 1–2 pracovních dnů se ozveme s návrhem.",
      },
      {
        id: "kontakt-sortiment",
        q: "Mohu Maria Maria zařadit do svého sortimentu?",
        a: "Ano. Zvolte „Obchod a další prodej“ a napište nám krátce o svém obchodě, své lokalitě a požadovaném výběru. Následně osobně probereme vhodné další kroky.",
        link: { label: "Prohlédnout celý sortiment", href: "/unsere-weine" },
      },
      {
        id: "kontakt-firmenveranstaltungen",
        q: "Nabízíte vína pro firemní akce?",
        a: "Ano. Pro firemní akce, konference a zvláštní příležitosti vám poradíme s výběrem vín. Uveďte datum, počet hostů, místo a charakter akce, abychom vaši poptávku mohli probrat cíleně.",
      },
      {
        id: "kontakt-gastronomie",
        q: "Mohu vína Maria Maria nabízet ve své restauraci nebo v lahůdkářství?",
        a: "Ano. Zvolte „Gastronomie a lahůdky“ a napište nám krátce o svém provozu, své kuchyni či konceptu a své lokalitě. Společně najdeme výběr, který sedne vašim hostům.",
        link: { label: "Objevte původ a snoubení s jídlem", href: "/regionen" },
      },
      {
        id: "kontakt-individuelle-auswahl",
        q: "Jak funguje výběr vín na míru?",
        a: "Nejprve nám řeknete o svém záměru. Na přání vína poznáte při degustaci. Z vašich favoritů poté vznikne výběr, který sedne vašemu konceptu, vašemu menu nebo vaší příležitosti.",
        link: { label: "Všechna vína v přehledu", href: "/unsere-weine" },
      },
      {
        id: "kontakt-kaufen",
        q: "Kde mohu vína Maria Maria koupit?",
        a: "Vína lze objednat v oficiálním obchodě Maria Maria. Na kontaktní stránce zůstává obchod druhotnou cestou, aby poptávky na poradenství, akce a B2B neodváděly pozornost od kontaktního toku.",
        link: { label: "Do e-shopu", href: "/shop" },
      },
    ],
  },
};

export default kontakt;
