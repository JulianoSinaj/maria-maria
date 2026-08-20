/* See content/de/faq.js — the same structure in all four languages.
   The `id` values and link paths are NOT translated: they carry the deep
   links and the faq_id in GA4. */

export const faq = {
  home: [
    {
      id: "home-was-ist",
      q: "What is Maria Maria?",
      a: "Maria Maria stands for personally curated boutique wines from Italy. The selected range brings together authentic origin, characterful grape varieties and Italian living – for people and hosts who choose and enjoy wine with intent.",
    },
    {
      id: "home-sortiment",
      q: "Which wines does Maria Maria offer?",
      a: "The range comprises nine selected white, rosé and red wines from Campania, Puglia and the area around Lake Garda. Among them are Lugana, Falanghina, Greco di Tufo, Aglianico and several Primitivo wines.",
      link: { label: "Discover all wines", href: "/unsere-weine" },
    },
    {
      id: "home-anlass",
      q: "Which Maria Maria wine suits my occasion?",
      a: "Aperitivo, dinner, food pairing, event or an elegant gift: each wine page sets out taste, character, serving temperature and matching dishes. If you have a specific question, we are glad to help you choose.",
      link: { label: "Find the right wine", href: "/unsere-weine" },
    },
    {
      id: "home-partner",
      q: "Does Maria Maria work with restaurants, hospitality and lifestyle partners?",
      a: "Yes. Maria Maria also works with selected partners in gastronomy, hospitality, events, retail and lifestyle who want to bring Italian boutique wines into their concept. We discuss enquiries and possible collaborations personally.",
      link: { label: "Discover Maria Maria as a partner", href: "/kontakt#kontakt-sortiment" },
    },
    {
      id: "home-kontakt",
      q: "How can I get in touch with Maria Maria?",
      a: "Use our contact form for any question about our wines, a collaboration or a special occasion. We will get back to you personally.",
      link: { label: "Get in touch", href: "/kontakt" },
    },
  ],

  weine: [
    {
      id: "weine-wahl-farbe",
      q: "How do I choose between red, white and rosato?",
      a: "Follow the moment, not the rule: powerful reds such as Primitivo for hearty cooking and long evenings, fresh whites such as Lugana, Greco or Falanghina with fish, lighter dishes and as an aperitivo — and the rosato when things should stay light and Mediterranean.",
      link: { label: "To the collection", href: "#kollektion" },
    },
    {
      id: "weine-anlass",
      q: "Which wine suits which occasion?",
      a: "For the aperitivo: Rosato Puglia, Falanghina or Il Bianco, well chilled. For dinner: Lugana or Greco di Tufo with fish — Primitivo or Il Rosso with meat and rich primi. For good conversation among friends: the wine whose story you want to tell.",
    },
    {
      id: "weine-geschenk",
      q: "Which wine makes a good gift?",
      a: "For connoisseurs: the Primitivo 15,5 from the terracotta amphora or the Greco di Tufo with D.O.C.G. status. For newcomers: the approachable Falanghina or the Primitivo Salento IGP. And a curated tasting set is always a safe choice — elegantly packaged, with a greeting card on request.",
      link: { label: "To the tasting sets", href: "/shop#pakete" },
    },
    {
      id: "weine-essen",
      q: "How do I find the right wine for a dish?",
      a: "What matters is the preparation, not the ingredient alone — with pasta, for instance, it is the sauce that decides: delicate preparations call for fresh whites, rich ragùs for a structured red. Every wine page carries the recommendations from that wine's data sheet.",
      link: { label: "Food pairing in the magazine", href: "/magazin" },
    },
  ],

  regionen: [
    {
      key: "apulien",
      label: "Puglia",
      items: [
        {
          id: "reg-apulien-weine",
          q: "What shapes the character of wines from Puglia?",
          a: "Abundant sun, warm temperatures, red and calcareous soils and the proximity of the sea shape many wines from Puglia. Depending on grape and ageing, the result is fruit-forward, spicy and powerful wines that can still differ considerably.",
          link: { label: "See wines from Puglia", href: "/unsere-weine?region=apulien" },
        },
        {
          id: "reg-apulien-primitivo",
          q: "What is Primitivo and how does it taste?",
          a: "Primitivo is one of the grapes that shape Puglia most. Typical are aromas of ripe dark fruit, warm spice and a full body. Style and sweetness vary, though, with origin and vinification.",
          link: { label: "Discover Primitivo di Manduria", href: "/unsere-weine/primitivo-14-5" },
        },
        {
          id: "reg-apulien-salento",
          q: "What does Salento IGP mean?",
          a: "Salento IGP is a protected geographical indication for wines from the southern part of Puglia. It denotes origin, not automatically a particular taste or a single grape variety.",
          link: { label: "To the Primitivo Salento IGP", href: "/unsere-weine/primitivo-salento" },
        },
        {
          id: "reg-apulien-pairing",
          q: "Which dishes suit red wines from Puglia?",
          a: "Powerful reds from Puglia often suit braised dishes, grilled meat, hearty pasta and mature cheese. What matters is the intensity, seasoning and preparation of the dish; the specific recommendation is on each wine's own page.",
          link: { label: "Primitivo 15,5 and its food pairing", href: "/unsere-weine/primitivo-15-5" },
        },
      ],
    },
    {
      key: "kampanien",
      label: "Campania",
      items: [
        {
          id: "reg-kampanien-rebsorten",
          q: "What makes Campania special as a wine region?",
          a: "Campania combines very different growing areas, altitudes and soils. Irpinia gives us Greco di Tufo and Aglianico among others, while Falanghina also plays an important role in the Beneventano. That variety produces very different wine characters.",
          link: { label: "See wines from Campania", href: "/unsere-weine?region=kampanien" },
        },
        {
          id: "reg-kampanien-greco",
          q: "How do Greco di Tufo and Falanghina differ?",
          a: "Greco di Tufo often comes across as more structured, more mineral and more intense. Falanghina tends to be fresher, more fragrant and more approachable. The precise style always depends on origin, vintage and ageing.",
          link: { label: "Discover Greco di Tufo", href: "/unsere-weine/greco-di-tufo" },
        },
        {
          id: "reg-kampanien-falanghina",
          q: "Where does Falanghina come from?",
          a: "Falanghina is among the oldest grape varieties of Campania and is especially widespread in the Beneventano. Our Falanghina grows there in the hills — fresh, fragrant and Mediterranean in expression.",
          link: { label: "Discover Falanghina", href: "/unsere-weine/falanghina" },
        },
        {
          id: "reg-kampanien-aglianico",
          q: "What is Aglianico, and what style is “Il Rosso”?",
          a: "Aglianico is a major red grape of southern Italy. “Il Rosso” by Maria Maria is 100 % Aglianico – not a blend – and stands for a characterful red wine style with structure and spicy depth.",
          link: { label: "Discover Il Rosso", href: "/unsere-weine/il-rosso-aglianico" },
        },
      ],
    },
    {
      key: "garda",
      label: "Lugana on Lake Garda",
      items: [
        {
          id: "reg-garda-gebiet",
          q: "Where is the Lugana wine area?",
          a: "The Lugana wine area lies on the southern shore of Lake Garda and extends across parts of Lombardy and the Veneto. The delimited DOC zone includes areas in the provinces of Brescia and Verona. Pozzolengo is one of the places where the clay-rich moraine soils and the influence of the lake are felt most strongly.",
        },
        {
          id: "reg-garda-turbiana",
          q: "Which grape variety defines Lugana DOC?",
          a: "The principal grape of Lugana DOC is Turbiana, locally also called Trebbiano di Lugana. Under the production rules, Lugana DOC must consist of at least 90 per cent Turbiana; other permitted non-aromatic white varieties may together account for no more than 10 per cent. In the character of the wine, Turbiana is clearly at the centre.",
          link: { label: "To the Lugana", href: "/unsere-weine/lugana" },
        },
        {
          id: "reg-garda-geschmack",
          q: "How does Lugana taste?",
          a: "Lugana often shows fresh, elegant and finely mineral, with aromas of citrus, white blossom and, depending on style, riper orchard fruit. Age, ageing method and vintage all shape the profile.",
        },
        {
          id: "reg-garda-aperitif",
          q: "Why is Lugana more than an aperitif wine?",
          a: "Lugana is often seen as a fresh wine for the aperitif. Daniele Malavasi, however, points to its structure, salinity and capacity to develop. It is exactly those qualities that make it a versatile white for the table — one that works across a menu, not just before it.",
          link: {
            label: "Read the conversation with Daniele Malavasi",
            href: "/magazin/interviews/daniele-malavasi-lugana-doc",
          },
        },
        {
          id: "reg-garda-mm",
          q: "Which dishes suit Lugana?",
          a: "Lugana suits fish from Lake Garda, risotto, creamy whipped stockfish and white meat in light sauces. What matters is less a fixed rule than the balance between freshness, salinity and the texture of the dish.",
          link: { label: "Discover food pairings in the magazine", href: "/magazin#food-pairing" },
        },
        {
          id: "reg-garda-temperatur",
          q: "Why should Lugana not be served too cold?",
          a: "If Lugana is served too cold, the very qualities that define its identity come through less clearly: salinity, minerality and aromatic finesse. It should therefore not reach the glass ice-cold. The exact serving temperature depends on the style and the producer's recommendation.",
        },
      ],
    },
  ],

  magazin: [
    {
      id: "wissen-temperatur",
      q: "What is the ideal serving temperature?",
      a: "As a rule of thumb from our data sheets: Lugana at 8–10 °C, Greco and Falanghina at around 10 °C, the Rosato at 12–14 °C, powerful reds such as Primitivo and Il Rosso at 16–18 °C. When in doubt, serve slightly cooler — the wine warms up in the glass by itself.",
    },
    {
      id: "wissen-dekantieren",
      q: "Does Primitivo need decanting?",
      a: "No, it is not a must. Powerful young reds do benefit from a little air before serving, though — the specific recommendation from the data sheet is on each wine's own page.",
      link: { label: "Serving the Primitivo 15,5", href: "/unsere-weine/primitivo-15-5" },
    },
    {
      id: "wissen-glas",
      q: "Which glass for which wine?",
      a: "Powerful reds call for a large red-wine glass with plenty of air; whites for a slimmer glass that concentrates the freshness. For aromatic whites such as the Greco cuvée a rounder white-wine glass is worth it — that is where the bouquet opens up best.",
    },
    {
      id: "wissen-lagerung",
      q: "How should wine be stored?",
      a: "Cool, dark and undisturbed — constant temperatures without sharp swings are ideal, and bottles with natural corks should be stored on their side. Our wines are made to be enjoyed: the serving recommendations are on every wine page in the “Taste” chapter.",
    },
    {
      id: "wissen-docg",
      q: "What is the difference between DOC, DOCG and IGP?",
      a: "Three tiers of the Italian origin system: IGP (protected geographical indication) is the broadest, DOC or DOP (protected designation of origin) is narrower, DOCG the highest tier — controlled and guaranteed. Our collection spans the range from Salento IGP to Greco di Tufo DOCG.",
      link: { label: "Explore the collection by origin", href: "/unsere-weine" },
    },
    {
      id: "wissen-rebsorten",
      q: "Which Italian grape varieties are worth knowing?",
      a: "From our collection: Primitivo and Negroamaro from Puglia, Aglianico from the south, the white Falanghina and Greco from Campania and Turbiana from Lake Garda. Every wine page introduces its grape with origin and character.",
      link: { label: "Discover the grapes in the collection", href: "/unsere-weine" },
    },
  ],

  shop: [
    {
      id: "shop-kaufen",
      q: "Where can I buy Maria Maria wines?",
      a: "Right here in the official online shop — with the full range and curated tasting sets at a favourable price. We are happy to advise you personally on the choice for your moment, your menu or your gift.",
    },
    {
      id: "shop-versand",
      q: "How fast is delivery — and what does shipping cost?",
      a: "Your wines reach you within 1–3 working days, packed securely and elegantly. From an order value of €69 we ship free of charge.",
    },
    {
      id: "shop-international",
      q: "Do you also ship internationally?",
      a: "Yes — besides Germany we deliver to selected European countries. Shipping costs and delivery times depend on the destination and are shown transparently during checkout. We are glad to confirm in advance whether we deliver to your country — just get in touch.",
    },
    {
      id: "shop-bezahlung",
      q: "How can I pay in the shop?",
      a: "Conveniently and securely: we accept all common payment methods — SSL-encrypted, with no unnecessary steps. The available options are shown transparently during checkout.",
    },
    {
      id: "shop-geschenk",
      q: "Can I have wine sent as a gift?",
      a: "Yes — with a personal greeting card, elegant gift packaging and delivery straight to the recipient. Simply note your wishes when ordering.",
    },
    {
      id: "shop-beratung",
      q: "Who helps me with my order or choosing a wine?",
      a: "We do, personally: by contact form or email we advise you on menu, occasion or gift — and help with any question about your order. We reply within 1–2 working days.",
      link: { label: "Get in touch", href: "/kontakt" },
    },
  ],

  kontakt: [
    {
      key: "allgemein",
      label: "General questions",
      items: [
        {
          id: "kontakt-erreichen",
          q: "How can I get in touch with Maria Maria?",
          a: "Quickest is the contact form — simply choose your subject there. Alternatively you can reach us by email at info@maria-maria.de. We reply within 1–2 working days.",
        },
        {
          id: "kontakt-weininfo",
          q: "Where do I find information about the wines?",
          a: "Every wine has its own page with taste profile, origin, technical data, food pairing and frequently asked questions — from the Primitivo to the Lugana.",
          link: { label: "To our wines", href: "/unsere-weine" },
        },
      ],
    },
    {
      key: "verkostungen",
      label: "Tastings",
      items: [
        {
          id: "kontakt-verkostung-buchen",
          q: "How can I book a wine tasting in Düsseldorf?",
          a: "In the contact form simply choose “Tasting enquiry” — you can then give your preferred date and the number of guests directly. We come back to you within 1–2 working days with a personal proposal.",
        },
        {
          id: "kontakt-verkostung-ort",
          q: "Where do the tastings take place?",
          a: "In Düsseldorf and the surrounding area. We agree the venue and format with you personally — just describe your occasion in the form.",
        },
        {
          id: "kontakt-verkostung-privat",
          q: "Can I book a private tasting?",
          a: "Yes — private tastings are just as possible as corporate dates. Give your preferred date and number of guests in the form; we reply with a personal proposal.",
        },
        {
          id: "kontakt-verkostung-corporate",
          q: "Does Maria Maria offer corporate tastings?",
          a: "Yes, for company occasions and teams. Tell us briefly about the occasion and the size of the group — we will put together a fitting proposal and reply within 1–2 working days.",
        },
        {
          id: "kontakt-verkostung-kaufen",
          q: "Can I buy the wines I tasted afterwards?",
          a: "Yes — all wines in the collection are in the official online shop. After the tasting we are glad to advise you personally on your favourites.",
          link: { label: "To the official shop", href: "/shop" },
        },
      ],
    },
    {
      key: "haendler",
      label: "Trade",
      items: [
        {
          id: "kontakt-haendler",
          q: "How do I add Maria Maria wines to my range?",
          a: "Choose “Trade enquiry” in the form and tell us briefly about your shop or restaurant and your region. We will get back to you personally with all the details.",
        },
        {
          id: "kontakt-haendler-finden",
          q: "Can I find the wines in local shops?",
          a: "Our wines are available at selected specialist merchants and in restaurants. As our production is limited, we are glad to name a partner near you on request.",
        },
      ],
    },
    {
      key: "presse",
      label: "Press & collaborations",
      items: [
        {
          id: "kontakt-presse",
          q: "Who do I address press enquiries to?",
          a: "Directly to us: via the contact form (subject “Press & collaborations”) or by email to info@maria-maria.de. We will get back to you personally.",
        },
        {
          id: "kontakt-kooperationen",
          q: "Is Maria Maria open to collaborations?",
          a: "Yes — we are open to collaborations and joint projects. Describe your idea briefly; we reply within 1–2 working days.",
        },
      ],
    },
    {
      key: "shop",
      label: "Shop & shipping",
      items: [
        {
          id: "kontakt-kaufen",
          q: "Where can I buy the wines?",
          a: "In the official Maria Maria online shop. The service FAQ right there in the shop answers everything about the range, the tasting sets and ordering.",
          link: { label: "To the shop FAQ", href: "/shop#fragen" },
        },
        {
          id: "kontakt-versand",
          q: "Do you offer international shipping?",
          a: "Yes — besides Germany we deliver to selected European countries. The service FAQ in the shop and the checkout give all the details on delivery times and shipping costs.",
          link: { label: "To the shop FAQ", href: "/shop#fragen" },
        },
      ],
    },
  ],
};

export default faq;
