/* Search-engine copy, page by page.
   Same shape as content/de/meta.js — see there for the notes.
   The brand suffix („— Maria Maria") comes from title.template. */

export const meta = {
  siteTitle: "Maria Maria — Il piacere del vino",
  siteDescription: "Italian boutique wines for moments chosen with care.",
  orgDescription:
    "Personally curated Italian boutique wines from Puglia, Campania and Lake Garda.",

  home: {
    title: "Maria Maria — Il piacere del vino",
    description: "Italian boutique wines for moments chosen with care.",
  },

  collection: {
    title: "Our Wines",
    description:
      "Hand-picked Italian boutique wines from small estates – red, white and rosé from Puglia, Campania and Lake Garda.",
  },

  shop: {
    title: "Shop",
    description:
      "The official Maria Maria online shop: limited-edition Italian boutique wines and tasting sets, free shipping from €69. Italian wine, personal selection.",
  },

  geschichte: {
    title: "Our Story",
    description:
      "Two women, two generations, one way of thinking about wine: from Lizzano in Salento via Irpinia and Lake Garda to Düsseldorf — in Germany since 2019.",
    keywords: [
      "Maria Maria",
      "story",
      "Italian wines",
      "Salento",
      "Lizzano",
      "Lake Garda",
      "Campania",
      "Düsseldorf",
    ],
    ogImageAlt:
      "Maria Maria bottle with a glass of red wine and olives on a sunlit stone terrace",
  },

  magazin: {
    title: "Magazine",
    description:
      "Wine knowledge, food pairing, regions and stories from the world of Maria Maria — inspiration for the next moment worth savouring.",
    keywords: [
      "wine magazine",
      "wine knowledge",
      "food pairing",
      "Italian wines",
      "moments of pleasure",
      "Maria Maria",
    ],
    ogImageAlt: "A winemaker examining a glass of red wine among barriques in the cellar",
  },

  regionen: {
    titleAbsolute: "Italian Wine Regions: Puglia, Campania & Lugana | Maria Maria",
    description:
      "Discover selected wines from Puglia, Campania and the Lugana area on Lake Garda – grape varieties, origin, taste and food pairing tips.",
  },

  kontakt: {
    /* as in content/de/meta.js: full title carrying the brand itself */
    titleAbsolute: "Contact | Italian wines for restaurants & events | Maria Maria",
    description:
      "Italian boutique wines for restaurants, fine food, trade, events and tastings in Düsseldorf & NRW. Personal advice and individual wine selection.",
  },

  agb: {
    title: "Terms & Conditions",
    description: "General terms and conditions for orders in the Maria Maria online shop.",
  },

  datenschutz: {
    title: "Privacy Policy",
    description:
      "Information on the processing of personal data on maria-maria.wine in accordance with the GDPR.",
  },

  impressum: {
    title: "Legal Notice",
    description: "Legal notice and company details of Maria Maria Wines GmbH, Düsseldorf.",
  },

  /* The nine product pages — templates, not finished sentences: name,
     vintage, type, region, tasting notes and pairing come from the
     translated catalogue via lib/seo/wine.js. The brand name does not
     belong here; the layout's title.template appends it. */
  wine: {
    title: "{name} {year} · {type} · {region}",
    description:
      "{name} ({year}) — {type}, {region}. {notes}. {pairing} {price} at Maria Maria.",
    ogImageAlt: "Bottle of {name} by Maria Maria — {type}, {region}",
  },

  notFound: {
    title: "Page not found",
  },
};

export default meta;
