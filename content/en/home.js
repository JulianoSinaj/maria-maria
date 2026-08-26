/* See content/de/home.js — the same structure in all four languages. */

export const home = {
  hero: {
    eyebrow: "Italian boutique wines",
    /* Exactly one H1: brand plus main keyword. The Italian claim is no
       longer part of the heading but a paragraph of its own below it — the
       DOM must never read “Maria MariaIl piacere del vino.”. */
    title: "Maria Maria – Italian boutique wines",
    claim: "Il piacere del vino.",
    lede: "Hand-picked wines from small family estates – for moments chosen with intent, from the aperitivo to the big night.",
    ctaWines: "Discover the wines",
    /* The second CTA now leads to personal advice (/kontakt) rather than
       the shop. The stat row (wines · regions · since 2019) went with the
       German one; putting statWines, statRegions and statSince back brings
       it straight back. */
    ctaContact: "Request a personal consultation",
    photoAlt:
      "Maria Maria bottle and a glass of red wine on a stone wall between vines and sea, behind them a woman in a white dress looking out over the coast",
  },

  philosophy: {
    eyebrow: "Our philosophy",
    title: "Italian boutique wines that are easy to choose, to talk about and to enjoy.",
    description:
      "Personally curated, clear about where they come from, and chosen for restaurants, hospitality, events and moments worth remembering.",
    moments: {
      selection: {
        title: "Personally curated",
        text: "Every wine is tasted in person and chosen deliberately. The result is a small boutique range that hosts can recommend with confidence and guests can explore with ease.",
      },
      origin: {
        title: "Origin with a signature",
        text: "We work with selected family-run estates across Italy. The region, the grape and the people behind the wine give every bottle a story worth telling.",
      },
      occasion: {
        title: "Made for moments",
        text: "From the aperitivo and food pairing to events and elegant gifts: Maria Maria brings together taste, aesthetics and Italian living in moments that stay with you.",
      },
      guidance: {
        title: "Personally guided",
        text: "A clear range, plain-spoken recommendations and a direct line to us make choosing and serving simple – a personal partnership between equals.",
      },
    },
    note: "For restaurants, hospitality and distinctive concepts",
    cta: "Discover Maria Maria as a partner",
  },

  collection: {
    eyebrow: "The collection",
    title: "Our wines",
    /* Three origins, never „four regions": Puglia and Campania are
       administrative regions, Lake Garda is a wine area. The brief's rule
       is a fact, so it holds in every language, not just German. */
    description: "Nine wines from three selected origins – each with a story of its own.",
  },

  origins: {
    title: "Two souls,",
    titleAccent: "one name",
    /* Brief §3, “Storia breve” — a single paragraph, as in German. */
    paragraphs: [
      "Maria Maria begins in Salento, in the summer of 2019. At a table with friends, two women named Maria and an oenologist, the idea for a personal selection of Italian wines was born.",
    ],
    journey: ["Salento", "Puglia", "Campania", "Lake Garda"],
    quote: "“Italian wine, personal selection, share the pleasure.”",
    /* The button goes to /geschichte (the brand story), not the magazine:
       the label named the wrong destination, and /magazin genuinely exists —
       anyone clicking expected that instead. */
    cta: "Discover our story",
  },

  regions: {
    eyebrow: "Origin",
    title: "Where our wines are at home",
    description:
      "Soil, light and climate shape every grape – in the end you taste the landscape in the glass.",
    cta: "All regions",
    detailCta: "Discover more",
    items: {
      apulien: {
        name: "Puglia",
        tag: "The heart of the south",
        desc: "Southern sun and powerful aromas.",
        long: "Between Salento and Gallipoli, Primitivo and Negroamaro ripen under the southern sun – warm, powerful wines with a Mediterranean soul.",
        cta: "Discover Puglia",
        alt: "Trulli and olive trees in Puglia",
      },
      kampanien: {
        name: "Campania",
        tag: "Between volcano and sea",
        desc: "Volcanic soils, elemental characters.",
        long: "Around Naples and Salerno the volcanic soils of Vesuvius shape wines of depth and elemental character – from Falanghina to Aglianico.",
        cta: "Discover Campania",
        alt: "Vineyards on the Campanian coast with Mount Vesuvius",
      },
      garda: {
        name: "Lake Garda / Lombardy",
        tag: "Northern elegance",
        desc: "Elegance, freshness and mineral depth.",
        long: "On the southern shore of Lake Garda, Lugana is born – a white wine of rare elegance, carried by freshness and mineral depth.",
        cta: "Discover the Lake Garda wines",
        alt: "Vineyards by Lake Garda in Lombardy",
      },
    },
  },

  /* The three conversion segments, between the origins and the shop band
     (brief §5). Without this block the section is not rendered at all —
     which is exactly why the German home page carried one section more
     than the other three. */
  segments: {
    title: "Personally selected – for your enjoyment, your range and your occasion",
    intro:
      "Whether it is for your restaurant, your range or a special occasion: we advise you personally and put together a selection that fits the concept, the guests and the moment.",
    /* Local proof — the line beneath the three cards */
    proof: "Personal advice from Mettmann near Düsseldorf – in North Rhine-Westphalia and beyond.",
    items: {
      gastronomie: {
        title: "Restaurants & delicatessens",
        text: "Personally selected Italian wines for restaurants, cafés, wine bars and delicatessens – matched to the kitchen, the style and the guests.",
        cta: "Ask about our range for restaurants",
      },
      handel: {
        title: "Trade & resale",
        text: "Wines with character, a traceable origin and personal advice, for selected trade partners and resellers.",
        cta: "Discuss a trade partnership",
      },
      events: {
        title: "Events & tastings",
        text: "Individual wine selections for private celebrations, corporate events and guided tastings in Düsseldorf, North Rhine-Westphalia and beyond.",
        cta: "Enquire about an event or tasting",
      },
    },
  },

  shopBand: {
    eyebrow: "The official shop",
    title: "Ready for the taste that",
    titleAccent: "inspires you?",
    /* Terra Vera is the official external shop — no promise of direct
       shipping from the estate, which is not a channel we run. */
    text: "Discover and order the Maria Maria wines through our official online shop at Terra Vera.",
    primary: "To the official shop",
    secondary: "Get in touch",
  },

  faq: {
    eyebrow: "Frequently asked",
    title: "Maria Maria,",
    titleAccent: "in brief.",
    description:
      "Everything you may want to know about our wines, ordering and working with Maria Maria.",
    footerNote: "Still have questions, or interested in working together?",
    footerLabel: "Get in touch personally",
  },
};

export default home;
