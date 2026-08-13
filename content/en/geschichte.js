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

  nav: {
    ariaLabel: "The chapters of this story",
  },

  chapters: {
    anfang: {
      label: "The beginning · 2019",
      title: "From Germany. With Italian roots.",
      paragraphs: [
        "Maria Maria has been active in Germany since 2019. The brand is based in Düsseldorf – its personal and cultural origins lead to Lizzano in Salento.",
        "From the bond between two generations grew a selection in which every bottle stands for a place, a grape variety and a deliberate choice.",
      ],
      quote:
        "“Wine begins with its origin – and finds its place wherever people share it with one another.”",
      alt: "A laid table with wine glasses and an original bottle of Maria Maria",
      micro: "La tavola lunga",
      caption: "Italian roots, carried on in Germany since 2019.",
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
    kampanien: {
      label: "Campania · Irpinia",
      title: "Indigenous grape varieties. Unmistakable origin.",
      paragraphs: [
        "With Campania, the story widens to a wine landscape defined by altitude, microclimates and indigenous grape varieties.",
        "Greco di Tufo DOCG, Falanghina and Aglianico stand for independent characters and a wine culture rich in tradition.",
        "The professional dialogue with oenologist Francesco De Stefano deepens the view of grape varieties, origin and choices.",
      ],
      linkLabel: "Discover Irpinia and its wines",
      alt: "Rolling wine country of Irpinia in Campania",
      micro: "Vento di collina",
      caption: "Altitude and indigenous grape varieties shape Irpinia's wine landscape.",
    },
    gardasee: {
      label: "Lake Garda · Lugana DOC",
      title: "Elegance that comes from the place",
      paragraphs: [
        "On the southern shore of Lake Garda, Maria Maria encounters another expression of Italian wine culture.",
        "On calcareous, clay-rich morainic soils and under the influence of the mild lake climate, the Turbiana grape yields a wine of clarity, freshness and elegant structure. Lugana DOC adds to the selection an origin whose character does not need to be loud to be remembered.",
      ],
      linkLabel: "Discover Lugana and Lake Garda",
      alt: "Vineyards of the Lugana area on Lake Garda",
      micro: "Luce sul Garda",
      caption: "Morainic soils, Turbiana and mild lake breezes.",
    },
    duesseldorf: {
      label: "Since 2019 · Düsseldorf",
      title: "At home in Germany. Thought beyond borders.",
      paragraphs: [
        "The Maria Maria brand has been active in Germany since 2019 and is based in Düsseldorf. From here, personally selected Italian wines become accessible to people in Germany and other countries.",
        "Düsseldorf is the brand's home – not the boundary of its selection. What matters remains the origin, the character and the story behind every wine.",
      ],
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
};

export default geschichte;
