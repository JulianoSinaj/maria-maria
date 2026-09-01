/* Regions page /regionen. Same structure as content/de/regionen.js.
   "Maria Maria", grape varieties (Primitivo, Greco, Turbiana …) and
   denominations (Lugana DOC) stay untranslated. */

export const regionen = {
  hero: {
    eyebrow: "Italian wine regions",
    /* The page's only H1, set across two lines */
    title1: "Where Italy's wines",
    title2: "find their character",
    text: "Three areas of origin, distinct landscapes and characterful grape varieties: discover how Puglia, Campania and Lombardy on Lake Garda shape the style of the selected Maria Maria wines.",
    /* The scroll cue: question + prompt, the arrow stays in the code */
    question: "Why does Puglia taste different from Lake Garda?",
    questionCta: "Follow the answer",
  },

  /* Section title above the three region portraits */
  intro: {
    eyebrow: "Three areas of origin",
    title: "Discover our regions",
    description:
      "Puglia, Campania and Lombardy on Lake Garda – each origin with its own soils, its own grape varieties and a style of its own in the glass.",
  },

  regions: {
    apulien: {
      name: "Puglia",
      tag: "The heart of the south",
      alt: "Vineyards on red soil in Puglia in warm evening light",
      label: "Wines from Puglia",
      desc: "Sun, red soils and the nearness of the sea shape winegrowing in Puglia. Primitivo above all, one of the region's most defining grape varieties, stands for ripe fruit, warmth and an expressive character. Maria Maria presents selected wines from Puglia that bring origin and the Italian way of life together in the most pleasurable way.",
      cta: "Discover the wines of Puglia",
    },
    kampanien: {
      name: "Campania",
      tag: "Altitude and coastline",
      alt: "Terraced vineyards on the Campanian coast in evening light",
      label: "Wines from Campania",
      desc: "In the high-altitude vineyards of Irpinia and other tradition-rich growing areas of Campania, characterful wines are made from grape varieties such as Greco, Falanghina and Aglianico. Varying altitudes, limestone and clay soils and marked temperature differences lend them freshness, minerality and aromatic depth.",
      cta: "Discover the wines of Campania",
    },
    garda: {
      name: "Lombardy, Lake Garda",
      tag: "Between Lombardy and Veneto",
      alt: "Vineyards and gentle hills south of Lake Garda",
      label: "Lombardy, Lake Garda",
      desc: "South of Lake Garda, between Lombardy and Veneto, lies the Lugana DOC growing area. The Turbiana grape and clay-rich soils shape white wines of freshness, fine minerality and elegant character – ideal for aperitivo, light cuisine and special moments of pleasure.",
      cta: "Discover the wines of Lake Garda",
    },
  },

  /* Terroir manifesto — the client component's copy, passed as a prop */
  manifest: {
    eyebrow: "Our benchmark",
    title: "Origin is not a detail.",
    titleAccent: "It is the wine.",
    text: "Maria Maria does not look for labels, but for places, people and wines with a clear signature.",
    pillars: [
      {
        title: "Selected producers",
        text: "Personal relationships and traceable origin instead of anonymous sourcing.",
      },
      {
        title: "Grape varieties with regional character",
        text: "Primitivo, Negroamaro, Greco, Falanghina, Aglianico and Turbiana in the context of their origin.",
      },
      {
        title: "Guidance for considered enjoyment",
        text: "Taste, occasion and food pairing help you choose the right wine.",
      },
    ],
  },

  /* Shop band: the page composes the title as title + titleAccent (italic)
     + titleEnd — titleEnd may be empty in some languages. */
  band: {
    eyebrow: "The collection",
    title: "Discover wines",
    titleAccent: "region",
    titleEnd: "by region",
    text: "From powerful Primitivo from Puglia to mineral Lugana from Lake Garda – find the wine whose origin you want to taste.",
    primary: "Discover all Maria Maria wines",
    secondary: "Get in touch personally",
  },

  /* Frame of the regions FAQ — the questions come from dict.faq.regionen */
  faq: {
    eyebrow: "Frequently asked",
    title: "Questions of",
    titleAccent: "origin.",
    description:
      "Choose a region and find answers on areas, grape varieties, taste and food pairing – guidance for choosing the right wine.",
    footerLabel: "Discover food pairings in the magazine",
  },
};

export default regionen;
