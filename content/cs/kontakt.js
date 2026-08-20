/* Kontaktní stránka — stejná struktura jako content/de/kontakt.js (zdroj:
   Kontakt-Handoff z 18. 8. 2026). Klíče záměrů (gastronomie_feinkost,
   handel_wiederverkauf, event_feier, verkostung, individuelle_auswahl,
   sonstiges) jsou ve všech jazycích stejné — jdou do backendu, analytiky a
   směrování poptávek. Mění se jen popisky. */

export const kontakt = {
  hero: {
    eyebrow: "Kontakt · Vinné poradenství pro Düsseldorf & NRW",
    title: "Víno pro váš okamžik.",
    titleAccent: "Osobně vybrané.",
    text: "Pro gastronomii, obchod, akce a zvláštní příležitosti. Poznejte Maria Maria a najděte společně s námi vína, která se hodí k vašemu konceptu, vašim hostům nebo vaší příležitosti.",
    primaryCta: "Požádat o poradenství",
    secondaryCta: "Domluvit degustaci",
    trust: "Osobní odpověď do 1–2 pracovních dnů.",
    imageAlt: "Maria Maria Il Rosso a Il Bianco v lahvích 375 ml na prostřeném stole.",
  },

  details: {
    email: "E-mail",
    phone: "Telefon",
    location: "Sídlo",
    locationValue: "Mettmann, Německo",
  },

  intents: {
    title: "Proč nás chcete kontaktovat?",
    intro: "Vyberte příležitost, která nejlépe odpovídá vašemu záměru.",
    items: {
      gastronomie_feinkost: {
        title: "Gastronomie & lahůdky",
        text: "Chcete nabízet Maria Maria ve své restauraci, kavárně, vinném baru nebo lahůdkářství? Společně najdeme výběr, který se hodí k vašemu konceptu, vaší kuchyni a vašim hostům.",
        cta: "Poptávka pro gastronomii",
      },
      handel_wiederverkauf: {
        title: "Obchod & další prodej",
        text: "Chcete zařadit Maria Maria do svého sortimentu? Promluvme si o výběru vín, množství a možnostech osobní spolupráce.",
        cta: "Poptat partnerství",
      },
      event_feier: {
        title: "Akce & zvláštní příležitosti",
        text: "Od firemních akcí a konferencí po svatby, narozeniny a soukromé oslavy: poradíme vám s výběrem vín, která se hodí k příležitosti, menu a počtu hostů.",
        cta: "Poptat vína na akci",
      },
      verkostung: {
        title: "Degustace & individuální výběr",
        text: "Poznejte Maria Maria ve sklence. Při osobní degustaci objevíte své favority; poté společně sestavíme váš individuální výběr vín.",
        cta: "Domluvit degustaci",
      },
    },
  },

  process: {
    title: "Takhle jednoduše najdeme vaše víno",
    steps: [
      {
        title: "Řeknete nám o svém záměru",
        text: "Restaurace, sortiment, akce, degustace nebo zvláštní příležitost: čím lépe váš záměr známe, tím cíleněji můžeme poradit.",
      },
      {
        title: "Osobně vám poradíme",
        text: "Probereme vaše přání a na přání zorganizujeme degustaci v Düsseldorfu a okolí, abyste vína poznali osobně.",
      },
      {
        title: "Vybereme společně",
        text: "Z vašich favoritů vznikne výběr, který se hodí k vašemu konceptu, vašim hostům, vašemu menu nebo vaší příležitosti.",
      },
    ],
    closing: "Od první poptávky až po ten správný výběr vín vás provázíme osobně.",
  },

  bridge: {
    title: "Víno provází okamžiky, na které se vzpomíná.",
    text: "Při večeři doma, u stolu v restauraci, na firemní akci nebo při zvláštní oslavě: Maria Maria spojuje lidi, požitek a charakterní italská vína.",
    tagline: "Váš výběr. Vaše příležitost. Naše vína.",
    imageAlt: "Víno Maria Maria na prostřeném stole pro večeře a zvláštní příležitosti.",
  },

  form: {
    title: "Řekněte nám o svém záměru.",
    intro: "Čím více o vaší příležitosti víme, tím lépe vám můžeme poradit. Nejprve vyberte téma – poté zobrazíme jen pole, která jsou pro vaši poptávku opravdu důležitá.",
    hints: {
      event: { label: "U akce:", text: "datum, počet hostů, typ akce" },
      trade: { label: "U gastronomie/obchodu:", text: "typ podniku, požadovaný výběr" },
    },
    trust: "Osobně. Upřímně. S vášní pro víno.",
    optional: "nepovinné",

    intent: { label: "O co jde?", placeholder: "Vyberte" },
    intents: {
      gastronomie_feinkost: "Gastronomie & lahůdky",
      handel_wiederverkauf: "Obchod & další prodej",
      event_feier: "Akce / oslava",
      verkostung: "Degustace",
      individuelle_auswahl: "Individuální výběr vín",
      sonstiges: "Jiné",
    },
    name: { label: "Jméno", placeholder: "Vaše jméno" },
    email: { label: "E-mail", placeholder: "vas@email.cz" },
    companyLocation: {
      label: "Firma / místo",
      placeholder: "např. restaurace, hotel, obchod, místo konání akce",
    },
    postalCity: { label: "Město / PSČ", placeholder: "např. Düsseldorf, 40210" },
    phone: { label: "Telefon", placeholder: "Nepovinné" },
    message: { label: "Zpráva", placeholder: "Stručně popište svůj záměr…" },

    details: {
      event_feier: {
        eventDate: { label: "Datum / požadovaný termín" },
        eventType: { label: "Typ akce", placeholder: "např. firemní oslava, svatba, narozeniny" },
        guests: { label: "Přibližný počet hostů", placeholder: "např. 40" },
        location: { label: "Místo konání", placeholder: "např. Düsseldorf, eventová lokace" },
      },
      gastronomie_feinkost: {
        businessType: {
          label: "Typ podniku",
          placeholder: "Vyberte",
          options: {
            restaurant: "Restaurace",
            cafe: "Kavárna",
            weinbar: "Vinný bar",
            feinkost: "Lahůdkářství",
            sonstiges: "Jiné",
          },
        },
        interest: {
          label: "Zájem / požadovaný výběr",
          placeholder: "např. vinný lístek, rozlévaná vína, sezónní výběr",
        },
      },
      handel_wiederverkauf: {
        businessType: {
          label: "Typ podniku",
          placeholder: "Vyberte",
          options: {
            weinhandel: "Vinotéka",
            feinkost: "Lahůdkářství",
            fachhandel: "Specializovaný obchod",
            sonstiges: "Jiné",
          },
        },
        interest: {
          label: "Zájem / požadovaný výběr",
          placeholder: "např. sortiment, jednotlivá vína, degustační balíčky",
        },
      },
      verkostung: {
        date: { label: "Požadovaný termín" },
        persons: { label: "Počet osob", placeholder: "např. 8" },
        occasion: {
          label: "Příležitost",
          placeholder: "Vyberte",
          options: {
            privat: "soukromá",
            unternehmen: "firma/tým",
            gastronomie_handel: "gastronomie/obchod",
            sonstiger: "jiná příležitost",
          },
        },
      },
      individuelle_auswahl: {
        context: { label: "Příležitost / kontext", placeholder: "např. večeře s hosty, dárek, vinný lístek" },
        guests: { label: "Počet hostů", placeholder: "např. 12" },
        style: { label: "Preferovaný styl", placeholder: "např. svěží a lehké, plné, rosé" },
      },
    },

    privacyPre: "Přečetl(a) jsem si",
    privacyLink: "zásady ochrany osobních údajů",
    privacyPost: "a souhlasím se zpracováním svých údajů za účelem vyřízení mé poptávky.",
    submit: "Odeslat poptávku",
    sending: "Odesílá se…",
    errors: {
      intent: "Vyberte prosím, o co jde.",
      name: "Zadejte prosím své jméno.",
      email: "Zadejte prosím svou e-mailovou adresu.",
      emailInvalid: "Zadejte prosím platnou e-mailovou adresu.",
      message: "Stručně prosím popište svůj záměr.",
      privacy: "Potvrďte prosím souhlas se zásadami ochrany osobních údajů.",
      send: "Poptávku se nepodařilo odeslat. Zkuste to prosím znovu nebo nám napište přímo e-mailem.",
    },
    success: {
      title: "Děkujeme za vaši poptávku.",
      text: "Osobně se vám ozveme do 1–2 pracovních dnů.",
      again: "Odeslat novou poptávku",
    },
  },

  faq: {
    title: "Časté dotazy",
    showAll: "Zobrazit všechny dotazy",
    showLess: "Zobrazit méně dotazů",
    imageAlt:
      "Tři vína Maria Maria – Falanghina, Primitivo di Manduria a Greco di Tufo – se sklenicemi a zápisníkem na stole: vinné poradenství pro gastronomii a obchod.",
  },
};

export default kontakt;
