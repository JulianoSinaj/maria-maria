/* See content/de/home.js — the same structure in all four languages. */

export const home = {
  hero: {
    /* Same structure as content/de/home.js (Homepage brief, 24.08.2026):
       exactly one H1 — brand plus main keyword — with the Italian claim as
       its own <p lang="it"> underneath; second CTA goes to personal advice
       (/kontakt), the former stats row (wines · regions · since) is gone. */
    eyebrow: "PERSONALLY CURATED · SINCE 2019",
    title: "Maria Maria – Italian boutique wines",
    claim: "Il piacere del vino.",
    lede: "Hand-picked wines from small Italian family estates – personally selected for moments of conscious enjoyment in Germany, from the aperitivo to the big night.",
    ctaWines: "Discover our wines",
    ctaContact: "Request personal advice",
    photoAlt: "Maria Maria wine bottle and a glass of red wine in front of vines overlooking the Mediterranean coast",
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
    title: "Three Italian wine origins, three unmistakable signatures",
    description:
      "Our nine wines lead from Puglia via Campania to the southern Lake Garda area. Each origin stands for its own grape varieties, landscapes and people – personally selected for Maria Maria.",
    cta: "All regions",
    detailCta: "Discover more",
    items: {
      apulien: {
        name: "Puglia",
        tag: "The heart of the south",
        long: "Sun-drenched wines with warmth, fruit and Mediterranean character – including our Primitivo and Rosato selection.",
        cta: "Discover Puglia",
        alt: "Trulli and olive trees in Puglia",
      },
      kampanien: {
        name: "Campania",
        tag: "Between volcano and sea",
        long: "Mineral, characterful wines from southern Italy – shaped by grape varieties such as Greco, Falanghina and Aglianico.",
        cta: "Discover Campania",
        alt: "Vineyards on the Campanian coast with Vesuvius",
      },
      garda: {
        name: "Lake Garda area (Lombardy)",
        tag: "Northern elegance",
        long: "Elegant, fresh wines from the southern Lake Garda area – with Lugana DOC as a clear reference of origin.",
        cta: "Discover wines from Lake Garda",
        alt: "Vineyards on Lake Garda in Lombardy",
      },
    },
  },

  /* The three conversion segments — CTAs go to /kontakt?anliegen=… and
     preselect the intent in the form (components/kontakt/intents.js). */
  segments: {
    title: "Personally selected – for your enjoyment, your range and your occasion",
    intro:
      "Whether for your restaurant, your range or a special event: we advise personally and put together a selection that suits concept, guests and occasion.",
    proof: "Personal advice from Mettmann near Düsseldorf – in North Rhine-Westphalia and beyond.",
    items: {
      gastronomie: {
        title: "Restaurants & delicatessen",
        text: "Personally selected Italian wines for restaurants, cafés, wine bars and delicatessens – matched to cuisine, style and guests.",
        cta: "Request a range for your restaurant",
      },
      handel: {
        title: "Trade & resale",
        text: "Characterful wines with traceable origin and personal advice for selected trade partners and resellers.",
        cta: "Discuss a trade partnership",
      },
      events: {
        title: "Events & tastings",
        text: "Individual wine selections for private celebrations, corporate events and guided tastings in Düsseldorf, North Rhine-Westphalia and beyond.",
        cta: "Request an event or tasting",
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
