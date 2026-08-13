/* The conversations — the magazine's long-form strand.

   Structure and maintenance notes: see content/de/interviews.js. German is the
   source language and the version signed off in the handoff; this file
   translates it without reinterpreting it.

   The slug is identical in all four languages — the language lives in the
   prefix (/en/magazin/interviews/…), not in the slug, otherwise the hreflang
   group would fall apart into four unconnected addresses.

   Both pull quotes are bound to Daniele's approval (handoff page 9):
   re-translating them requires a fresh sign-off. */

const interviews = {
  section: {
    eyebrow: "Interviews · In conversation",
    title: "The people behind the wine",
    description:
      "Winemakers, cellar masters and growers talk about their region, their craft and what really makes a wine.",
  },

  ui: {
    magazin: "Magazine",
    interviews: "Interviews",
    interview: "Interview",
    editorial: "Editorial",
    aboutPerson: "About our guest",
    continueReading: "Keep reading",
    tasted: "Tasted in this conversation",
    inThisConversation: "In this conversation",
  },

  items: [
    {
      slug: "daniele-malavasi-lugana-doc",
      draft: false,

      eyebrow: "Maria Maria × Lago di Garda · In conversation",
      badge: "Lugana DOC · Turbiana · Pozzolengo",
      name: "Daniele Malavasi",
      headline: "Lugana comes from the terroir, not from the label",
      deck: "From Pozzolengo to Lake Garda: Daniele Malavasi explains how morainic soils, the lake's mild climate and the Turbiana grape shape Lugana – and why this wine can do far more at the table than serve as an aperitif.",

      seo: {
        title: "Daniele Malavasi on Lugana DOC & terroir",
        description:
          "Daniele Malavasi explains how Turbiana, morainic soils and the climate of Lake Garda shape Lugana DOC – and why it is more than an aperitif.",
      },

      byline: {
        interview: "Maria Pia Tolo",
        editorial: "Maria Maria",
        date: null,
        readingTime: "6 min read",
      },

      portrait: {
        src: "/img/magazin/daniele-solo.jpeg",
        alt: "Daniele Malavasi with a glass of Lugana and his dog among the vine rows of his vineyard in Pozzolengo",
      },

      intro: [
        "Some wines cannot be understood through a grape variety or a label alone. You understand them once you know the place where they are made – and the people who make decisions there every day. For Daniele Malavasi, the story of Lugana therefore does not begin in the glass but in Pozzolengo: in the clay-rich morainic soils south of Lake Garda, in the Turbiana grape and in a climate that gives the wine time to develop a character of its own.",
        "Daniele owns Cantina Malavasi in Pozzolengo. His perspective combines daily work in the vineyard with a long-standing relationship with Maria Maria. In this conversation he explains why trust is the foundation of the collaboration, why authenticity matters more than any trend, and why Lugana deserves to be rediscovered as a serious companion at the table.",
      ],

      sections: [
        {
          id: "vertrauen",
          heading: "A collaboration that begins with trust",
          paragraphs: [
            "What convinced Daniele about the Maria Maria project was not a marketing idea at first, but a bond with Maria and Valerio that had grown over years. Personal trust turned into a collaboration that, in his view, has kept developing for both sides.",
            "That shared history also holds a very personal memory: his mother Ames. She always welcomed Maria and Valerio with great warmth. For Daniele that hospitality is still part of the connection today – and evidence that the relationship existed long before this interview.",
            "Yet closeness alone does not explain his decision. What also mattered to him was the way Maria Maria wants to tell the story of wine: not as an isolated product, but as the result of a specific setting.",
          ],
          quote:
            "Maria Maria does not only choose a product, but also the context it comes from: Lake Garda, the Lugana area and the people who work there every day.",
          after: [
            "Choosing a wine thus becomes a deliberate decision in favour of a place, a way of working and the people behind it.",
          ],
        },
        {
          id: "authentizitaet",
          heading: "Authenticity before fashion",
          paragraphs: [
            "Among Maria Maria's values, Daniele recognises two above all: authenticity and a selection made against clear criteria. He follows the same principle in his work at the cantina. A few deliberate decisions should leave grape and soil visible, rather than letting them disappear behind a staged image.",
            "For a wine project that wants to bring Italian regions closer to a German audience, this idea is central. Authenticity does not come from romantic claims about Italy, but from a selection you can follow: Who makes the wine? Where do the grapes grow? Which characteristics come from the area – and which decisions shape the style?",
            "Daniele sums up this attitude briefly: the place should speak more clearly than the technique in the cellar.",
          ],
        },
        {
          id: "terroir",
          heading: "What makes Lugana recognisable in the glass",
          media: {
            src: "/img/magazin/interviews/terroir-pozzolengo.jpg",
            alt: "Vineyards near Pozzolengo with a view across the morainic hills towards Lake Garda",
            caption:
              "The vineyards of Pozzolengo and the view across the morainic hills to the lake.",
          },
          paragraphs: [
            "The Lugana area lies south of Lake Garda, between Lombardy and Veneto. Pozzolengo is one of the municipalities within the protected designation of origin. For Daniele, the wine's distinctive identity emerges from the interplay of soils, lake and grape variety.",
            "The clay-rich soils are morainic in origin and were shaped by the geological history of the area. At the same time the proximity of Lake Garda influences the climate. Daniele describes the lake as a heat store: in summer it absorbs warmth and releases it again in autumn and winter. Sharp temperature swings are softened and the ripening phase can lengthen.",
            "The clay plays an important role too. It retains water and, in Daniele's experience, contributes to structure and to a clearly perceptible saline tension in the wine. The position and orientation of the individual vineyards in turn influence aromatic finesse.",
            "At the centre stands Turbiana, the characteristic grape of Lugana DOC. In the glass Daniele looks not for immediate impact but for balance: between acidity and saline tension, between clean fruit and a dry, precise impression. A convincing Lugana, for him, should speak first of its area rather than of cellar technique.",
          ],
          list: {
            label: "How Daniele recognises a convincing Lugana",
            items: [
              "Balance between acidity and saline tension",
              "Clean fruit without forward sweetness",
              "Structure from the clay-rich morainic soils",
              "A wine that tells of its place rather than of cellar technique",
            ],
          },
        },
        {
          id: "mehr-als-aperitif",
          heading: "More than a fresh, easy-going white",
          media: {
            src: "/img/magazin/interviews/turbiana-trauben.jpg",
            alt: "Ripe Turbiana grapes on the vine in a vineyard near Pozzolengo",
            caption: "Turbiana — the characteristic grape of Lugana DOC.",
          },
          paragraphs: [
            "If Lugana is seen only as a fresh, easily approachable white from Lake Garda, that falls short for Daniele. Such a description overlooks precisely the qualities that make the wine interesting: structure, the ability to develop and a clear territorial identity.",
            "He would therefore introduce Lugana to a German audience as a white that can mature and evolve. Not as an arbitrary “easy drinking” wine, but as a serious companion at the table – comparable in ambition to the characterful whites many German wine drinkers already appreciate.",
            "This perspective also changes the moment of enjoyment. The wine need not be confined to the terrace, to summer and to the aperitif. Its acidity, structure and saline tension earn it a firm place at the dining table.",
          ],
          quote:
            "Lugana is not only an aperitif wine. Its structure and its saline tension can carry more demanding dishes as well.",
        },
      ],

      pairing: {
        heading: "Lugana at the table: from Lake Garda to Italian cuisine",
        media: {
          src: "/img/magazin/interviews/lugana-risotto.jpg",
          alt: "Creamy risotto with lake fish, lemon and herbs beside a glass of Lugana",
          /* Native Ratio des Fotos — zeigt das volle Bild statt des 16:9-Beschnitts. */
          aspect: "4/3",
        },
        paragraphs: [
          "When it comes to food, Daniele starts where the wine starts: at Lake Garda. His recommendations include local freshwater fish such as lavarello and dried sardines, as well as finely balanced risottos.",
          "At the same time Lugana can carry more weight than many expect. Daniele names baccalà mantecato – creamy whipped stockfish – and white meat with a light sauce. What matters is not the weight of a dish on its own, but the interplay of texture, seasoning and the wine's saline freshness.",
          "For Maria Maria this point is particularly valuable: food pairing thus becomes not a decorative addition to a product, but an understandable translation of the wine into everyday life. Anyone who experiences how a Lugana changes alongside a risotto, a fish dish or white meat grasps its versatility far more directly than through technical data alone.",
        ],
        items: [
          { icon: "fish", title: "Fish from Lake Garda", text: "Lavarello and dried sardines." },
          { icon: "risotto", title: "Risotto", text: "Finely balanced, delicate risottos." },
          { icon: "stockfish", title: "Baccalà mantecato", text: "Creamy whipped stockfish." },
          { icon: "poultry", title: "White meat", text: "With a light sauce." },
        ],
      },

      serving: {
        heading: "The most common mistake: serving it too cold",
        paragraphs: [
          "A Lugana can lose much of its expression if it reaches the glass too cold. Daniele calls this one of the most common serving mistakes. Too low a temperature flattens exactly those qualities that should define the wine: its saline tension, its minerally freshness and its aromatic finesse.",
          "The second mistake often follows directly from the first: treating the wine solely as an aperitif. Serving it only very cold and before the meal denies it the chance to show its structure alongside more complex dishes.",
          "The recommendation is therefore not a rigid number but a considered approach: serve it cool, but not so cold that the wine stays closed. In the glass it should be given time to open up.",
        ],
      },

      outro: {
        heading: "A precisely defined place – not just any white wine",
        paragraphs: [
          "What should Maria Maria's audience take away from this conversation? For Daniele, above all one insight: behind a Lugana stands a precisely defined area. It is not a generic white from northern Italy, but the expression of an interplay between Turbiana, morainic soils, lake climate and daily work.",
          "It is therefore worth approaching Lugana with the same curiosity one brings to the great white wines of Europe. Not because every Lugana has to be the same, but precisely because origin, vineyard and decisions can make differences visible.",
          "Daniele understands his future role at Maria Maria in the same spirit. He wants to contribute the view of a producer who experiences the area every day – and who can therefore speak not only about wine, but about the people and decisions behind it.",
          "For Maria Maria the circle closes here: the label makes a wine recognisable. Its meaning, however, arises where soil, climate, grape and people come together.",
        ],
      },

      profile: {
        name: "Daniele Malavasi",
        role: "Owner of Cantina Malavasi, Pozzolengo",
        text: "The winery lies within the Lugana area, with vineyards between Pozzolengo and Desenzano del Garda.",
        link: { label: "Cantina Malavasi", href: "https://www.malavasivini.com/it/azienda" },
      },

      wine: {
        slug: "lugana",
        heading: "Discover Lugana DOC by Maria Maria",
        text: "Discover the Lugana DOC by Maria Maria – vinified by Daniele Malavasi in Pozzolengo. A wine that holds origin, grape and craft in balance.",
        cta: "To the Lugana",
      },

      paths: [
        {
          id: "region",
          icon: "region",
          title: "Lake Garda region",
          text: "Discover the terroir.",
          href: "/regionen#garda",
        },
        {
          id: "pairing",
          icon: "pairing",
          title: "Food pairing",
          text: "Inspiration for the table.",
          href: "/magazin#food-pairing",
        },
        {
          id: "interviews",
          icon: "interviews",
          title: "More interviews",
          text: "Read every conversation.",
          href: "/magazin#interviste",
        },
      ],

      teaserMagazin: {
        eyebrow: "Interviews · In conversation",
        badge: "Lugana DOC · Pozzolengo",
        title: "Lugana comes from the terroir, not from the label",
        teaser:
          "On Turbiana, clay-rich morainic soils and the climate of Lake Garda – and why Lugana can do more at the table than serve as an aperitif.",
        meta: "Interview · 6 min read",
        cta: "Read the conversation",
      },

      teaserRegion: {
        region: "garda",
        eyebrow: "Voices from the region · Lugana DOC",
        title: "Real people tell the story of Lugana",
        paragraphs: [
          "What makes this white from Lake Garda so special? Daniele Malavasi talks about morainic soils, Turbiana, the lake climate — and the Lugana that made it from his cellar into the Maria Maria collection.",
        ],
        pull: "The wine should tell of its place rather than of the technique in the cellar.",
        ctaPrimary: "Read the conversation",
        ctaSecondary: "Discover the Lugana",
      },
    },
  ],
};

export default interviews;
