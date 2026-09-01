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
      "Winemakers, wine experts and people from the regions talk about origin, craft and what really makes a wine.",
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
        position: "object-top",
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
            "He would therefore introduce Lugana to a German audience as a white that can mature and evolve. Not as just another “easy drinking” wine, but as a serious companion at the table – comparable in ambition to the characterful whites many German wine drinkers already appreciate.",
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
        worksFor: "Cantina Malavasi",
        text: "The winery lies within the Lugana area, with vineyards between Pozzolengo and Desenzano del Garda.",
        link: { label: "Cantina Malavasi", href: "https://www.malavasivini.com/it/azienda" },
      },

      wine: {
        slug: "lugana",
        photo: {
          src: "/img/magazin/interviews/lugana-vino-bianco-magazine-cutout.png",
          alt: "Bottle of Lugana DOC by Maria Maria",
        },
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
        portrait: { src: "/img/daniele222.jpeg" },
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

    {
      slug: "francesco-de-stefano-irpinien-weissweine",
      draft: false,

      /* The slug stays German in every language — the locale lives in the
         prefix, never in the slug, or the hreflang group falls apart. */

      eyebrow: "Maria Maria × Campania · In conversation",
      badge: "Greco di Tufo DOCG · Fiano di Avellino DOCG · Falanghina",
      name: "Francesco De Stefano",
      headline: "Three white wines, three characters – what makes Irpinia special",
      deck: "From the high ground of Irpinia to the dinner table: Francesco De Stefano talks about Greco di Tufo, Fiano di Avellino and Falanghina – and why origin, character and food pairing belong together when you choose a wine.",

      ghost: "Irpinia",

      seo: {
        title: "Francesco De Stefano on Irpinia & Campanian white wines",
        description:
          "Greco di Tufo, Fiano di Avellino and Falanghina: Francesco De Stefano on Irpinia, food pairing and choosing a wine deliberately.",
      },

      byline: {
        interview: "Maria Pia Tolo",
        editorial: "Maria Maria",
        date: null,
        readingTime: "6 min read",
      },

      portrait: {
        src: "/img/magazin/interviews/francesco-de-stefano.jpg",
        alt: "Francesco De Stefano pouring a Maria Maria white wine into a glass in the evening light",
        position: "object-top",
      },

      intro: [
        "Understanding a wine takes more than looking at the grape. Origin, style, how it is served and what sits on the plate all change the way we perceive it. For Francesco De Stefano, that deliberate choice is what makes the difference.",
        "In conversation with Maria Maria he leads through Campania and above all through Irpinia. At the centre are Greco di Tufo, Fiano di Avellino and Falanghina – three white wines that, for Francesco, have different characters and belong to different moments at the table.",
      ],

      sections: [
        {
          id: "gemeinsame-werte",
          heading: "A collaboration that begins with shared values",
          paragraphs: [
            "What convinced Francesco about the Maria Maria project was, first of all, the people behind it. He names the dedication to the project, the seriousness Valerio and Maria bring to it and their expertise as the decisive reasons for accompanying Maria Maria on its way.",
            "Added to that is a shared attitude: the same passion and the same search for quality that, in Francesco's words, also shape his own work.",
          ],
          quote:
            "What impressed me most was the dedication to the project and the seriousness that Valerio and Maria show.",
        },
        {
          id: "irpinien",
          heading: "Irpinia: three DOCGs in a single province",
          paragraphs: [
            "For Francesco, Campania has always been a symbolic region of Italian winegrowing, particularly in the south of the country. He points to a wine tradition reaching back to Roman times and singles out Irpinia within the region.",
            "That this province alone can claim three DOCG appellations is for him an important sign of the area's standing and its particular suitability for viticulture. Aglianico del Taburno adds a further DOCG in the Benevento area.",
          ],
        },
        {
          id: "hoehe-und-klima",
          heading: "What altitude and climate change in the glass",
          /* MEDIA MISSING: the matching chapter of the Daniele piece carries a
             landscape photograph. None exists for Irpinia yet. */
          paragraphs: [
            "Francesco traces the character of the wines above all to climate and altitude. Both factors, as he explains it, contribute to higher acidity. The result is wine with more structure and a more decided character.",
            "For an audience discovering Campanian whites for the first time, that perspective helps: not every white wine from southern Italy is soft or easy-going.",
          ],
        },
        {
          id: "drei-charaktere",
          heading: "Greco, Fiano and Falanghina: three different characters",
          paragraphs: [
            "Francesco does not see Greco di Tufo, Fiano di Avellino and Falanghina as interchangeable variants. Greco di Tufo he describes, by comparison, as more strongly mineral.",
            "Fiano strikes him as softer and more versatile, and would be his recommendation for anyone discovering these styles for the first time. Falanghina, in his comparison, shows a drier tendency and finds a natural place at the aperitivo.",
          ],
          list: {
            label: "How Francesco tells the three wines apart",
            items: [
              "Greco di Tufo — more strongly mineral by comparison",
              "Fiano di Avellino — softer and more versatile, his suggestion for starting out",
              "Falanghina — a drier tendency, with a natural place at the aperitivo",
            ],
          },
        },
      ],

      pairing: {
        heading: "Campanian white wines at the table",
        /* MEDIA MISSING — see the chapter on altitude and climate. */
        paragraphs: [
          "Francesco would serve Fiano di Avellino with a fish dish that is not too assertive, prawns or trout for instance.",
          "Greco di Tufo has, for him, a more pronounced mineral component and can therefore accompany slightly more complex fish dishes or white meat. He singles out Greco di Tufo with mozzarella di bufala in particular.",
          "Falanghina he also sees at the aperitivo, for example with a frisella and San Marzano tomatoes.",
        ],
        items: [
          { icon: "fish", title: "Fiano di Avellino", text: "With prawns or trout." },
          {
            icon: "stockfish",
            title: "Greco di Tufo",
            text: "With more complex fish dishes and white meat.",
          },
          {
            icon: "plate",
            title: "Mozzarella di bufala",
            text: "The pairing Francesco singles out in particular.",
          },
          {
            icon: "glasses",
            title: "Falanghina at the aperitivo",
            text: "For example with a frisella and San Marzano tomatoes.",
          },
        ],
      },

      outro: {
        heading: "Why choosing a wine is never trivial",
        paragraphs: [
          "In the end Francesco brings every topic back to one thought: choosing a wine is never trivial. Origin, style, dish and service all influence one another.",
          "For Maria Maria, Francesco sees his role as complementing the expertise Valerio and Maria already have with his own experience, and so contributing to the project's further development.",
        ],
        quote: "Choosing a wine is never trivial.",
      },

      faq: {
        eyebrow: "Frequently asked",
        title: "Campanian whites —",
        titleAccent: "briefly answered.",
        description:
          "Where to start, what separates the three wines, and how to pair them: the four questions this conversation leaves open most often.",
        items: [
          {
            id: "francesco-einsteiger",
            q: "Which Campanian white wine suits a beginner?",
            a: "Francesco would recommend Fiano. He describes it as softer and more versatile than Greco di Tufo, and as coming across less dry than Falanghina.",
          },
          {
            id: "francesco-unterschied",
            q: "What is the difference between Greco di Tufo, Fiano and Falanghina?",
            a: "For Francesco, Greco comes across as more strongly mineral, Fiano as softer and more versatile, and Falanghina shows a drier tendency by comparison.",
          },
          {
            id: "francesco-greco-pairing",
            q: "What goes with Greco di Tufo?",
            a: "Slightly more complex fish dishes, white meat and above all mozzarella di bufala.",
          },
          {
            id: "francesco-fisch",
            q: "Which Campanian white wine goes with fish?",
            a: "For lighter fish dishes Francesco names Fiano di Avellino; Greco di Tufo can also accompany more structured preparations.",
          },
        ],
      },

      profile: {
        name: "Francesco De Stefano",
        /* The master source kept the job title as "only once confirmed".
           It is confirmed now: the winery's own site calls itself "Cantina
           Moras di Francesco De Stefano" and names him as its founder. A
           fuller biography stays out until it is documented just as well. */
        role: "Founder of Cantine Moras, Solofra",
        worksFor: "Cantine Moras",
        text: "Francesco accompanies Maria Maria with his experience and his knowledge of the Campanian wine world.",
        link: { label: "Cantine Moras", href: "https://www.cantinemoras.it/moras-campania/" },
      },

      wine: {
        slug: "greco-di-tufo",
        href: "/unsere-weine?region=kampanien",
        heading: "Discover Campania's white wines at Maria Maria",
        text: "Greco di Tufo, Fiano di Avellino and Falanghina — the Campanian whites in the collection, each with the character Francesco describes in the conversation.",
        cta: "Discover Campania's wines",
      },

      paths: [
        {
          id: "region",
          icon: "region",
          title: "Campania region",
          text: "Discover the terroir.",
          href: "/regionen#kampanien",
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
        badge: "Irpinia · Campania",
        title: "Three white wines, three characters: what makes Irpinia special",
        teaser:
          "On Greco di Tufo, Fiano di Avellino and Falanghina – and why origin, food pairing and a deliberate choice of wine belong together.",
        meta: "Interview · 6 min read",
        cta: "Read the conversation",
      },

      teaserRegion: {
        region: "kampanien",
        portrait: { src: "/img/magazin/interviews/francesco-de-stefano.jpg" },
        eyebrow: "Voices from the region · Irpinia",
        title: "Real people tell the story of Campania",
        paragraphs: [
          "What makes Campania's white wines so different from one another? Francesco De Stefano talks about Irpinia, Greco di Tufo, Fiano di Avellino and Falanghina — and about why origin, character and the right food pairing belong together when you choose a wine.",
        ],
        pull: "Choosing a wine is never trivial.",
        ctaPrimary: "Read the conversation",
        ctaSecondary: "Discover Greco di Tufo",
      },
    },
  ],
};

export default interviews;
