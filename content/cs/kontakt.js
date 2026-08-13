/* Kontaktní stránka a kontaktní formulář. Stejná struktura jako
   content/de/kontakt.js. `topics` jsou popisky pro pevné klíče
   tasting / merchant / press / general — pole s termínem a počtem hostů se
   otevírají podle klíče, nikoli podle popisku. */

export const kontakt = {
  hero: {
    eyebrow: "Jsme tu pro vás",
    title: "Kontakt",
    titleItalic: "Parliamo di vino.",
    text: "Těšíme se na vaši zprávu! Ať už jde o degustaci v Düsseldorfu, dotazy k našim vínům, spolupráci nebo poptávku prodejce – rádi vám pomůžeme.",
    promiseLabel: "Náš slib:",
    promise:
      "Na vaši poptávku odpovíme do 1–2 pracovních dnů. Osobně, upřímně a s vášní pro víno.",
  },

  details: {
    email: "E-mail",
    phone: "Telefon",
    address: "Adresa",
    addressValue: "Maria Maria Wines · Düsseldorf, Německo",
  },

  help: {
    eyebrow: "Vaše poptávka",
    title: "S čím vám můžeme pomoci?",
    description:
      "Čtyři přímé cesty k nám – jednoduše zvolte téma, které odpovídá vaší poptávce.",
    cta: "Odeslat poptávku",
    items: {
      tasting: {
        title: "Degustace",
        text: "Chcete ochutnat naše vína? Zde se dozvíte, jak na to.",
      },
      merchant: {
        title: "Poptávky prodejců",
        text: "Jste prodejce nebo chcete naše vína zařadit do svého sortimentu?",
      },
      press: {
        title: "Média a spolupráce",
        text: "Jsme otevřeni dotazům médií, spolupráci i společným projektům.",
      },
      general: {
        title: "Obecné dotazy",
        text: "Máte obecný dotaz k Maria Maria? Rádi vám poradíme.",
      },
    },
  },

  faq: {
    eyebrow: "Dobré vědět",
    title: "Časté",
    titleAccent: "dotazy.",
    description:
      "Odpovědi na dotazy, které dostáváme nejčastěji — seřazené podle tématu: od degustací v Düsseldorfu přes poptávky prodejců až po e-shop a dopravu.",
    footer: "Nenašli jste svůj dotaz? Napište nám",
  },

  form: {
    title: "Napište nám",
    name: { label: "Jméno", placeholder: "Vaše jméno" },
    email: { label: "E-mail", placeholder: "jmeno@priklad.cz" },
    subject: { label: "Předmět", placeholder: "Čeho se dotaz týká?" },
    topic: { label: "Typ poptávky", placeholder: "Zvolte typ poptávky" },
    topics: {
      tasting: "Poptávka degustace",
      merchant: "Poptávka prodejce",
      press: "Média a spolupráce",
      general: "Obecný dotaz",
    },
    date: { label: "Požadovaný termín" },
    guests: {
      label: "Počet hostů",
      placeholder: "Zvolte počet hostů",
      unit: "osob",
      options: ["2–4", "5–8", "9–12", "13–20", "Více než 20"],
    },
    message: { label: "Zpráva", placeholder: "Vaše zpráva pro nás …" },
    privacyPre: "Přečetl/a jsem si",
    privacyLink: "zásady ochrany osobních údajů",
    privacyPost: "a souhlasím se zpracováním svých údajů.",
    submit: "Odeslat zprávu",
    sending: "Odesílání…",
    errors: {
      name: "Zadejte prosím své jméno.",
      email: "Zadejte prosím svou e-mailovou adresu.",
      emailInvalid: "Zadejte prosím platnou e-mailovou adresu.",
      subject: "Zadejte prosím předmět.",
      topic: "Zvolte prosím typ poptávky.",
      date: "Zvolte prosím požadovaný termín.",
      guests: "Uveďte prosím počet hostů.",
      message: "Napište nám prosím krátkou zprávu.",
      privacy: "Souhlaste prosím se zásadami ochrany osobních údajů.",
      send: "Zprávu se nepodařilo odeslat. Zkuste to prosím znovu.",
    },
    success: {
      title: "Děkujeme za vaši zprávu!",
      text: "Vaši poptávku jsme obdrželi a osobně se vám ozveme do 1–2 pracovních dnů.",
      again: "Nová zpráva",
    },
  },
};

export default kontakt;
