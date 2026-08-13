/* Stránka obchodu /shop — hero, lišta výhod, degustační balíčky, sortiment,
   Le Origini, dárkové okamžiky, servis a servisní FAQ.

   Odznaky, počty edic a popisy balíčků NEleží zde, ale v common.shop:
   košík běží na každé stránce a staví z nich své podřádky. „Enoteca Maria
   Maria", „Share the pleasure." a názvy balíčků jsou značkové prvky a
   zůstávají beze změny. */

export const shop = {
  hero: {
    eyebrow: "Oficiální obchod",
    lede: "Italské víno, osobně vybrané: butiková vína v limitovaných edicích, vznikající v přímé spolupráci s místními rodinami a enology. Od 69 € doručujeme zdarma.",
    ctaDiscover: "Objevit nyní",
    ctaBundles: "Degustační balíčky",
    statWines: "Butikových vín",
    statRegions: "Regiony Itálie",
    statDeliveryValue: "1–3",
    statDelivery: "Pracovní dny dodání",
    /* tři chipy důvěry u láhve */
    chipShipping: "Doprava zdarma od 69 €",
    chipPayment: "Bezpečná platba",
    chipPacking: "Pečlivě zabaleno",
  },

  usps: {
    delivery: "Odeslání do 1–3 pracovních dnů",
    packaging: "Bezpečně a elegantně zabaleno",
    payment: "Bezpečná platba",
    card: "Kartička s věnováním na přání v ceně",
  },

  bundles: {
    eyebrow: "Degustační balíčky",
    title: "Objevte Itálii",
    titleAccent: "v balíčku",
    description:
      "Pečlivě sestavené balíčky za zvýhodněnou cenu – nejkrásnější způsob, jak poznat Maria Maria. Velký balíček putuje k vám bez poštovného.",
  },

  assortment: {
    eyebrow: "Sortiment",
    title: "Maria Maria",
    titleAccent: "Selection",
    description:
      "Objevte celou Selection – corposo, elegante a fresco. Každá lahev je osobní volbou.",
  },

  origins: {
    title: "Dvě duše,",
    titleAccent: "jedno jméno",
    paragraphs: [
      "Maria Maria začíná v Salentu, v létě 2019 – mezi vzpomínkami na dětství a starými řadami révy se z jednoho okamžiku stalo prozření: víno pro nás není nápoj, ale katalyzátor emocí.",
      "Jméno v sobě nese dvě ženy – přítomnost a původ. Každá lahev spojuje obě duše v osobitý charakter.",
    ],
    quote: "„Italian wine, personal selection, share the pleasure.“",
    craft: {
      amphora: {
        title: "Terakotové amfory",
        text: "Zrání podle tradičního řemesla – víno, které zraje v terakotových amforách, získává hloubku a charakter.",
      },
      direct: {
        title: "Přímá spolupráce",
        text: "Žádná velká distribuce: naše vína vznikají společně s místními rodinami a enology přímo na místě.",
      },
      limited: {
        title: "Limitované edice",
        text: "Primitiva 14,5 existuje jen 18 000 lahví, Primitiva 15,5 dokonce jen 12 000 – exkluzivita začínající už na vinici.",
      },
    },
  },

  gift: {
    badge: "Dárkové okamžiky",
    eyebrow: "Darování",
    title: "Víno řekne víc než",
    titleAccent: "tisíc slov",
    text: "Ať jde o poděkování, pozvání, nebo zvláštní příležitost – lahev Maria Maria je dárek s původem a příběhem. O zbytek se postaráme.",
    photoAlt: "Elegantně zabalená lahev vína jako dárek s kartičkou s věnováním",
    points: [
      "Osobní kartička s vaším věnováním",
      "Elegantní dárkové balení",
      "Doručení přímo obdarovanému",
    ],
    ctaPrimary: "Darovat balíček",
    ctaSecondary: "Nechat si osobně poradit",
  },

  service: {
    eyebrow: "Dobré vědět",
    title: "Objednávka bez starostí",
    description: "Objednávejte bez otazníků – doprava, platba a poradenství v kostce.",
    cards: {
      shipping: {
        title: "Doprava a doručení",
        text: "Vaše vína opouštějí náš sklad pečlivě zabalená a dorazí k vám do 1–3 pracovních dnů – od 69 € bez poštovného.",
        link: "Otázky k dopravě",
      },
      payment: {
        title: "Bezpečná platba",
        text: "Plaťte pohodlně a bezpečně – všechny běžné platební metody, šifrování SSL a žádné okliky.",
        link: "Více ve FAQ",
      },
      advice: {
        title: "Osobní poradenství",
        text: "Nevíte jistě, které víno se hodí? Poradíme vám osobně – pro váš okamžik, vaše menu i váš dárek.",
        link: "Kontaktujte nás",
      },
    },
  },

  band: {
    eyebrow: "Smyslová cesta",
    title: "Od Salenta až po",
    titleAccent: "Gardské jezero",
    text: "Naše Selection kreslí cestu Itálií – od slunného jihu Apulie přes Kampánii až na břehy Gardského jezera.",
    primary: "Naše vína",
    secondary: "Objevte regiony",
  },

  faq: {
    eyebrow: "Časté otázky",
    title: "Otázky k",
    titleAccent: "objednávce.",
    description:
      "Doprava, platba, dárky a osobní poradenství — vše důležité před dokončením objednávky, zodpovězeno stručně a závazně.",
    footerLabel: "Nenašli jste svou otázku? Kontaktujte nás",
  },
};

export default shop;
