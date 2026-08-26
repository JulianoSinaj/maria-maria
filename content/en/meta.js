/* Search-engine copy, page by page.
   Same shape as content/de/meta.js — see there for the notes.
   The brand suffix („— Maria Maria") comes from title.template. */

export const meta = {
  siteTitle: "Maria Maria — Il piacere del vino",
  siteDescription: "Italian boutique wines for moments chosen with care.",
  orgDescription:
    "Personally curated Italian boutique wines from Puglia, Campania and Lake Garda.",

  home: {
    /* `titleAbsolute` — the title already carries the brand. With the root
       layout's title.template it rendered as „Maria Maria — Il piacere del
       vino — Maria Maria" in the tab, in og:title and in the search result.

       Title and description now follow the German pattern („primary keyword
       + market | brand") instead of repeating the brand claim. The reason is
       the hreflang cluster: the brief (§2) declares it-IT, en-US and cs-CZ as
       live siblings of the German homepage, and Google evaluates such a
       cluster as a unit. Three of four members without a single keyword in
       the title weaken the whole cluster — including the German page the
       brief spent its effort on.

       NOTE: the brief explicitly covers the German homepage only (§ scope).
       These three strings follow its pattern but have NOT been signed off by
       SEO/Brand — approval still outstanding. */
    titleAbsolute: "Italian Boutique Wines in Germany | Maria Maria",
    description:
      "Personally curated boutique wines from Puglia, Campania and the Lake Garda area – for enjoyment, restaurants, retail and special occasions.",
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
    titleAbsolute: "Wine Regions: Puglia, Campania & Lugana | Maria Maria",
    description:
      "Discover selected wines from Puglia, Campania and the Lugana area on Lake Garda – grape varieties, origin, taste and food pairing tips.",
  },

  kontakt: {
    titleAbsolute: "Contact: Italian Wines for Restaurants | Maria Maria",
    description:
      "Italian boutique wines for restaurants, delicatessens, retail, events and tastings in Düsseldorf & NRW. Personal advice and an individual wine selection.",
  },

  agb: {
    title: "Terms & Conditions",
    description: "General terms and conditions for orders in the Maria Maria online shop.",
  },

  datenschutz: {
    title: "Privacy Policy",
    description:
      "Information on the processing of personal data on maria-maria.de in accordance with the GDPR.",
  },

  impressum: {
    title: "Legal Notice",
    description: "Legal notice and company details of Maria Maria Wines GmbH, Mettmann.",
  },

  /* The nine product pages — templates, not finished sentences: name,
     vintage, type, region, tasting notes and pairing come from the
     translated catalogue via lib/seo/wine.js. The brand name does not
     belong here; the layout's title.template appends it. */
  wine: {
    title: "{name} {year} · {type} · {region}",
    description: "{name} ({year}) — {type}, {region}. {notes}. {pairing}",
    /* The price sentence is DETACHABLE: lib/seo/wine.js appends it only when
       the description stays within budget. It is dropped first because the
       price is carried in the Offer markup anyway — unlike the tasting notes
       and pairing, which exist nowhere else. */
    descriptionPrice: "{price} at Maria Maria.",
    ogImageAlt: "Bottle of {name} by Maria Maria — {type}, {region}",
  },

  notFound: {
    title: "Page not found",
  },
};

export default meta;
