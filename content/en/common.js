/* Shared chrome: navigation, footer, cart, service copy.
   Same shape as content/de/common.js — see there for the notes.

   Brand terms stay Italian in every language: „Il piacere del vino", the wine
   names and their D.O.C./I.G.P. designations are not translated. */

export const common = {
  nav: {
    home: "Home",
    wines: "Our Wines",
    regions: "Regions",
    magazine: "Magazine",
    contact: "Contact",
    shop: "Visit the shop",
    wineTypes: {
      red: "Red wines",
      white: "White wines",
      rose: "Rosé wines",
    },
  },

  a11y: {
    skipToContent: "Skip to content",
    homeLink: "Maria Maria — Home",
    mainNav: "Main navigation",
    mobileNav: "Mobile navigation",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    menuDialog: "Menu",
  },

  wineMenu: {
    eyebrow: "The collection",
    overview: {
      all: { label: "All wines", hint: "The complete collection" },
      bestseller: { label: "Bestsellers", hint: "What ends up in the glass most often" },
      regions: { label: "Regions of Italy", hint: "Origin and terroir" },
    },
    shop: "Visit the shop",
    note: "Hand-picked from small Italian estates.",
    seeAll: "See all {count} wines",
  },

  footer: {
    newsletter: {
      title: "Stories from Italy,",
      titleAccent: "straight to your inbox",
      text: "News, exclusive offers and moments worth savouring — about once a month, without the noise.",
      success: "Thank you! Please confirm your subscription in your inbox.",
      emailLabel: "Email address",
      placeholder: "Enter your email address",
      submit: "Subscribe",
    },
    tagline: "Italian boutique wines for moments chosen with care.",
    exploreHeading: "Explore",
    explore: {
      wines: "Our Wines",
      regions: "Regions of Italy",
      magazine: "Magazine",
      contact: "Contact",
    },
    contactHeading: "Contact",
    shopHeading: "Official shop",
    shopText: "Discover and order our wines directly in the Maria Maria shop.",
    shopLink: "Visit the shop",
    legal: {
      privacy: "Privacy Policy",
      imprint: "Legal Notice",
      terms: "Terms & Conditions",
    },
    copyright: "Maria Maria Wines — Il piacere del vino",
  },

  /* Visible catalogue copy — structure lives in components/data.js.
     `notes` is a list, not a sentence: joinList() in lib/i18n/format turns it
     into „Intense, powerful and balanced". */
  catalogue: {
    types: { red: "Red wine", white: "White wine", rose: "Rosé wine" },
    typesPlural: { red: "Red wines", white: "White wines", rose: "Rosé wines" },
    regions: { puglia: "Puglia", campania: "Campania", garda: "Lake Garda" },
    filters: {
      allWines: "All wines",
      allRegions: "All regions",
      reset: "Reset",
      wineOne: "wine",
      wineMany: "wines",
      byType: "Filter wines by type",
      byRegion: "Filter wines by region",
      regionAxis: "Region",
      allShort: "All",
      emptyTitle: "For this selection we currently",
      emptyTitleAccent: "have no wine.",
      emptyText:
        "Try another combination of type and region – or explore the whole collection.",
    },
    wines: {
      "primitivo-15-5": {
        notes: ["intense", "powerful", "balanced"],
        pairing: "With braised meat, game and aged cheese.",
      },
      lugana: {
        notes: ["elegant", "fresh", "mineral"],
        pairing: "Ideal with fish, pasta al pesto or white meat.",
      },
      "greco-di-tufo": {
        notes: ["structured", "refined", "aromatic"],
        pairing: "With seafood, grilled fish and refined cooking.",
      },
      "primitivo-14-5": {
        notes: ["soft", "full-bodied", "harmonious"],
        pairing: "Ideal with pasta, grilled dishes and mature cheese.",
      },
      "primitivo-salento": {
        notes: ["fruity", "round", "approachable"],
        pairing: "Easy-going with pizza, pasta and evenings in good company.",
      },
      falanghina: {
        notes: ["fresh", "fruity", "lively"],
        pairing: "Perfect for the aperitivo, with seafood or salads.",
      },
      "rosato-puglia": {
        notes: ["delicate", "fruity", "refreshing"],
        pairing: "Wonderful with antipasti, salads or grilled vegetables.",
      },
      "il-rosso-aglianico": {
        notes: ["profound", "spicy", "full of character"],
        pairing: "A companion to pasta al forno, grilled meat and cheese.",
      },
      "il-bianco-greco-cuvee": {
        notes: ["fresh", "elegant", "balanced"],
        pairing: "A pleasure with antipasti, fish and light dishes.",
      },
    },
  },

  cart: {
    title: "Your cart",
    items: "items",
    open: "Open cart",
    close: "Close cart",
    label: "Cart",
    increase: "Increase quantity of {name}",
    decrease: "Decrease quantity of {name}",
    remove: "Remove {name} from the cart",
    empty: {
      title: "Still quite",
      titleAccent: "empty.",
      text: "Discover our boutique wines and tasting sets – your Maria moment is already waiting.",
      cta: "Discover wines",
    },
    success: {
      title: "Grazie",
      titleAccent: "mille!",
      text: "Thank you for your order. A confirmation is on its way to your inbox.",
      orderNumber: "Order number",
      cta: "Keep browsing",
    },
    missingForFreeShipping: "{amount} to go until free shipping",
    freeShippingReached: "Your order ships free",
    summary: {
      subtotal: "Subtotal",
      shipping: "Shipping",
      free: "Free",
      total: "Total",
      vat: "incl. VAT",
      checkout: "Checkout",
      secure: "Secure payment · SSL encrypted",
    },
  },

  shop: {
    badges: {
      bestseller: "Bestseller",
      limited: "Limited edition",
      popular: "Much loved",
      summer: "Summer wine",
    },
    edition: "{count} bottles",
    bottles: "{count} bottles",
    limitedEdition: "Limited edition · {count} bottles",
    scarce: "Only a few bottles left",
    single: "Separately",
    save: "You save {amount}",
    bundleSub: "Tasting set · {count} bottles",
    bundles: {
      "paket-trio-rosso": {
        tag: "The strength of the South",
        desc: "Three reds with character from Puglia and Campania – from the soft Primitivo to the spicy Aglianico.",
      },
      "paket-grande-selezione": {
        tag: "Most popular choice",
        desc: "Six wines, four regions – the whole variety of Italy in one set. Delivered to your door, shipping free.",
      },
      "paket-trio-bianco": {
        tag: "Freshness & elegance",
        desc: "Three elegant whites from Lake Garda and Campania – mineral, refined and lively in the glass.",
      },
    },
  },

  ui: {
    discoverWine: "Discover the wine",
    wineDetails: "{name} — view details",
    bottleAlt: "{name} bottle",
    bottleFront: "Front",
    bottleBack: "Back",
    bottleFrontAlt: "{name} bottle – front",
    bottleBackAlt: "{name} bottle – back",
    showSide: "Show the {side}",
    prevWine: "Previous wine",
    nextWine: "Next wine",
    prevWines: "Previous wines",
    moreWines: "More wines",
    back: "Back",
    next: "Next",
    wholeCollection: "The whole collection",
    winesLabel: "wines",
    addToCart: "Add {name} to the cart",
    removeBottle: "Remove one bottle of {name}",
    addBottle: "Add another bottle of {name}",
    addBundle: "Add the case to the cart",
    added: "Added",
    viewCart: "View cart",
    priceNote: "All prices incl. VAT, plus shipping",
    perBottle: "/ 0.75 l",
    faqTopics: "FAQ topics",
    discoverMore: "Discover more",
  },

  souls: {
    roots: {
      name: "Maria",
      tag: "The roots",
      traits: ["Family", "Hospitality", "Memory"],
      desc: "In Lizzano begins the personal story behind the name – in a culture where wine, food and time spent together belong to one another.",
    },
    today: {
      name: "Maria",
      tag: "Today's perspective",
      traits: ["Selection", "Aesthetics", "New perspectives"],
      desc: "Choosing Italian wines with intent, telling the story of their regions and bringing them to people in other countries.",
    },
  },

  winePage: {
    atAGlance: "At a glance",
    factsHeading: "The essentials {wine} at a glance",
    vintage: "Vintage",
    limitedEdition: "Limited edition · only",
    shopEyebrow: "The official shop",
    allWines: "All wines",
    heroCtaShop: "Discover it in the official shop",
    heroCtaTaste: "Get to know the wine",
    faqEyebrow: "Frequent questions",
    faqTitle: "Good to",
    faqTitleAccent: "know.",
    faqDescription:
      "Answers to the most frequent questions about {wine} — from taste and origin to serving. The technical details come from the wine's data sheet.",
    faqFooter: "Your question isn't here? Write to us",
    storyFallbackAlt: "Hand-picking the grapes and maturing in the cellar",
    tones: "The tones of the wine",
    essence: "The essence of the wine",
    prevCard: "Previous card",
    nextCard: "Next card",
    cards: "Cards",
    sections: "Sections of this page",
  },

  language: {
    label: "Language",
    ariaLabel: "Choose language",
    current: "Current language",
  },

  errors: {
    eyebrow: "Something went wrong",
    title: "That wasn't our",
    titleAccent: "finest vintage.",
    text: "Something went wrong. Please try again — or head back to the home page.",
    retry: "Try again",
    home: "Back to home",
  },

  notFound: {
    eyebrow: "Page not found",
    title: "This bottle is",
    titleAccent: "not in our cellar.",
    text: "The page you are looking for doesn't exist or has moved. Discover our wines instead — that's where the best of it is anyway.",
    wines: "Our Wines",
    home: "Back to home",
  },
};

export default common;
