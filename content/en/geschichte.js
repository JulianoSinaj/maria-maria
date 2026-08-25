/* See content/de/geschichte.js — the same structure in all four languages.
   Brand, place and grape names stay untranslated; the short Italian words
   on the photos (`micro`) are identical in every language. */

export const geschichte = {
  hero: {
    eyebrow: "Maria Maria · Our Story",
    titleLines: ["Two women.", "Two generations.", "One way of thinking", "about wine."],
    paragraphs: [
      "The name Maria Maria brings together memory and the present. Personal roots in Salento shape a way of thinking about wine that unites origin, character and shared pleasure.",
      "Maria Maria has been active in Germany since 2019, based in Düsseldorf and with a selection intended for Germany and other countries.",
    ],
    ctaStory: "Discover the story",
    ctaWines: "Get to know our wines",
    journey: ["In Germany since 2019", "Based in Düsseldorf", "Italian origins"],
    photoAlt:
      "Two generations at a long table under the pergola, with two bottles of Maria Maria in front",
    photoBadge: "Personally selected",
  },

  name: {
    eyebrow: "The name",
    titleLines: ["Two Marias.", "Memory and the present."],
    paragraphs: [
      "The name Maria Maria carries within it the bond between two women and two generations.",
      "The elder Maria stands for Lizzano, family, hospitality and a wine culture lived at the shared table.",
      "The younger Maria carries this outlook into the present: with a contemporary eye and a personal selection of Italian wines.",
    ],
    quote: "“What remains is carried forward with a new perspective.”",
  },

  valerio: {
    eyebrow: "The owner · Wine import & selection",
    title: "Valerio Caniglia: the entrepreneur behind Maria Maria",
    paragraphs: [
      "Valerio Caniglia brings more than 30 years of experience in the wine business. He understands markets, people and wines, and selects with a sure instinct the producers who fit Maria Maria.",
      "With sensitivity, reliability and an international network, he ensures that every bottle brings our values into the glass.",
    ],
    cta: "Maria Maria for restaurants and specialist retail",
    href: "/kontakt",
    imageLabel: "Portrait of Valerio Caniglia",
  },

  nav: {
    ariaLabel: "The chapters of this story",
  },

  chapters: {
    anfang: {
      label: "Today · Mettmann near Düsseldorf",
      title: "At home in Germany. Personally connected to Italy.",
      paragraphs: [
        "From Mettmann we bring selected wines from Italian winemakers to restaurants and wine bars – personally, reliably and with genuine closeness.",
        "Every order is put together with care so that our wines arrive where they belong: at the table.",
      ],
      linkLabel: "Discover our selection of wines",
      alt: "A laid table with wine glasses and an original bottle of Maria Maria",
      micro: "La tavola lunga",
    },
    salento: {
      label: "Salento · Lizzano",
      title: "Where the roots lie",
      paragraphs: [
        "Maria Maria's language of wine begins in Salento. Around Lizzano, the landscape is shaped by red earth, Mediterranean vegetation, light and the closeness of the Ionian Sea.",
        "Here lie the personal roots of the name and the starting point of a selection in which Primitivo stands for warmth, depth and an unmistakable origin.",
      ],
      linkLabel: "Discover Salento and our Primitivo wines",
      alt: "Red earth and vineyards near Lizzano in Salento",
      micro: "Terra rossa",
      caption: "Vines, Mediterranean light and the closeness of the Ionian Sea.",
    },
    duesseldorf: {
      label: "The beginning · Summer 2019",
      title: "Some ideas are born at the table.",
      paragraphs: [
        "Between good food, open conversations and special wines an idea grows: to find wines that show their origin, have character and bring people together.",
        "That evening becomes more than a memory – it becomes Maria Maria.",
      ],
      quote: "“Some ideas need no business plan. Just the right table.”",
      linkLabel: "Discover our selection of wines",
      alt: "An evening table set with Maria Maria red wine at dusk",
      micro: "Dall’Italia, oltre i confini",
    },
  },

  today: {
    label: "The selection",
    title: "What brings a wine to Maria Maria",
    intro:
      "It is not a single city, nor a passing trend, that determines the selection. What matters is origin, character and the way a wine accompanies the moment at the table.",
  },

  stats: [
    {
      label: "Origin over sameness",
      detail:
        "Every wine must reveal its region, its grape variety and a character of its own.",
    },
    {
      label: "Character over trend",
      detail:
        "No interchangeable labels, but wines with a clear identity and an origin that remains tangible.",
    },
    {
      label: "Pleasure that is shared",
      detail:
        "A wine finds its meaning in the moments, dishes and encounters it accompanies.",
    },
  ],

  cta: {
    ariaLabel: "On to the regions",
    text: "Every wine begins in a place. Its story continues to be written at the table.",
  },

  /* Kopf der B2B-FAQ am Seitenende — die Fragen selbst liegen in faq.js
     (faq.geschichte). */
  faq: {
    eyebrow: "Questions & answers",
    title: "Frequently asked by restaurants,",
    titleAccent: "retailers & partners.",
    description:
      "What restaurants, wine bars, hotels, retailers and event organisers ask us before we work together — answered from practice. Whatever stays open here, we clarify personally.",
    footerLabel: "Your question isn't here? Write to us",
  },
};

export default geschichte;
