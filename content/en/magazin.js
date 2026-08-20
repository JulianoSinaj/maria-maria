/* See content/de/magazin.js — same structure in all four languages. The
   Italian rivista words of the issue („Capitolo", „Bacheca", „Curiosità",
   „Interviste", „Archivio del Magazin" …) are brand design and live in the
   code, not in the dictionary. „Maria Maria", wine names and Italian dish
   names stay as they are in every language. */

export const magazin = {
  marquee: {
    boutique: "Boutique winemakers",
    handpicked: "Hand-picked",
  },

  cover: {
    title: "Stories, people and pleasure from Italy",
    subline:
      "In the magazine Maria Maria tells of origin, selection and moments of pleasure — with stories from the regions, food pairings, encounters and the vision behind the brand.",
    rubricsAria: "Sections of the magazine",
    rubrics: {
      story: "The story",
      pairing: "Food pairing",
      interviews: "Interviews",
      events: "Events",
    },
    photoAlt: "Maria choosing three Maria Maria bottles at the glass table in the cantina",
    headline: ["Two Marias.", "One story", "of pleasure."],
    paragraph:
      "One name, two generations and a journey through Italian wine worlds — from Salento by way of Campania and Lake Garda all the way to Düsseldorf.",
    stations: ["Salento", "Campania", "Lake Garda", "Düsseldorf"],
    cta: "Read the whole story",
  },

  vision: {
    srTitle: "Vision and mission of Maria Maria",
    blocks: {
      vision: {
        kicker: "Vision",
        text: "Maria Maria wants to create a curated world of wine in which Italian origin, personal selection and modern pleasure become tangible for people in Germany.",
      },
      mission: {
        kicker: "Mission",
        text: "We choose wines with character, tell the story of their origin in plain words and bring regions, people and moments of pleasure together into a clear, authentic brand experience.",
      },
    },
  },

  chapters: {
    moments: "Moments of pleasure",
  },

  quote: {
    translation: "Wine is the poetry of the earth.",
  },

  pairing: {
    eyebrow: "Food pairing · By occasion",
    title: "Which wine suits",
    titleAccent: "your moment?",
    description:
      "Don't choose the wine first, choose the moment — pick your occasion and Maria Maria shows you the wine that fits.",
    toWine: "To the wine",
    alsoFits: "Also a good match",
    cards: {
      aperitivo: {
        anlass: "Aperitivo",
        dish: "Burrata · Tomatoes · Focaccia",
        caption: "Italian aperitivo with Rosato, burrata and focaccia",
        hints: {
          falanghina: "Mackerel all’acqua pazza",
          "il-bianco-greco-cuvee": "Paccheri with prawns",
          lugana: "Creamy fish risotto",
        },
      },
      "pasta-abend": {
        anlass: "Pasta night",
        dish: "Spaghetti alle Vongole",
        caption: "Spaghetti alle Vongole with Greco di Tufo DOCG",
        hints: {
          "primitivo-14-5": "Orecchiette with braciole ragù",
          "il-bianco-greco-cuvee": "Paccheri with prawns",
          falanghina: "Mackerel all’acqua pazza",
        },
      },
      "fisch-meer": {
        anlass: "Fish & sea",
        dish: "Fish risotto · Lemon · Herbs",
        caption: "Lugana DOC with creamy fish risotto on Lake Garda",
        hints: {
          falanghina: "Mackerel all’acqua pazza",
          "greco-di-tufo": "Spaghetti alle Vongole",
          "il-bianco-greco-cuvee": "Paccheri with prawns",
        },
      },
      grillabend: {
        anlass: "Grill night",
        dish: "Involtini · Rosemary · Grilled vegetables",
        caption: "Aglianico for the grill night – involtini and rosemary",
        hints: {
          "primitivo-salento": "Bombette from the grill",
          "primitivo-14-5": "Orecchiette with braciole ragù",
          "rosato-puglia": "Burrata with focaccia",
        },
      },
      dinner: {
        anlass: "Dinner with guests",
        dish: "Braised beef cheek · Potato cream",
        caption: "Primitivo di Manduria with braised beef cheek",
        hints: {
          "il-rosso-aglianico": "Involtini from the grill",
          "primitivo-salento": "Bombette from the grill",
          "greco-di-tufo": "Spaghetti alle Vongole",
        },
      },
    },
  },

  social: {
    title: "Maria Maria on",
    titleAccent: "Instagram",
    text: "Moments from vineyards, cellars and laid tables — our pinboard from the world of Maria Maria.",
    follow: "Follow {handle}",
    postAria: "{caption} — open Maria Maria on Instagram",
    posts: {
      aperitivo: "Aperitivo in the evening light",
      harvest: "Harvest in the south",
      pranzo: "Pranzo with friends",
      handpicked: "Hand-picked",
    },
  },

  curiosity: {
    title: "Curious, but",
    titleAccent: "true",
    description:
      "Three things we learned at the winery. Tap a card — the answer is on the back.",
    flip: "Flip",
    back: "Back",
    closing:
      "Nine bottles, four regions — and with them nine stories already written.",
    interviewsLabel: "Winemakers & customers in conversation",
    cards: {
      name: {
        kicker: "Nomen est omen",
        question: "Why is the Primitivo called “Primitivo”?",
        answer:
          "Not because it is primitive — but because it is one of the first to ripen. “Primo”: the early one. By August it is ready while others are still on the vine.",
      },
      temperature: {
        kicker: "Kitchen knowledge",
        question: "How cold can red wine be?",
        answer:
          "Cooler than you think. 16–18 °C — cellar, not living room. Twenty minutes in the fridge before opening and the wine turns suddenly precise.",
      },
      tears: {
        kicker: "From the cellar",
        question: "What are the “tears” on the rim of the glass?",
        answer:
          "The streaks running back down after swirling. They reveal the alcohol, not the quality — a good wine does not weep more beautifully, only more slowly.",
      },
    },
  },

  interviewEmpty: {
    title: "The first conversations are taking shape.",
    text: "We visit winemakers, cellar masters and sommeliers in their vineyards and cellars — and bring their answers here: about soils and vintages, about taste, craft and the people behind every bottle.",
    badge: "Coming soon",
  },

  wines: {
    eyebrow: "From the magazine into the glass",
    title: "The wines from our stories",
    description:
      "The bottles our stories revolve around – swipe across a photo to see the back label.",
    railLabel: "Tasted in the magazine",
  },

  faq: {
    eyebrow: "Wine knowledge",
    title: "Frequently asked questions about",
    titleAccent: "wine knowledge.",
    description:
      "The evergreens around temperature, glass, storage and origin classifications — answered from the data sheets of our wines, without the jargon.",
    footerLabel: "Still have a question? Write to us",
  },
};

export default magazin;
