/* Shop page /shop — hero, USP bar, tasting sets, assortment,
   Le Origini, gift moments, service and the service FAQ.

   Badges, edition counts and bundle descriptions do NOT live here but in
   common.shop: the cart runs on every page and builds its sublines from
   them. "Enoteca Maria Maria", "Share the pleasure." and the bundle names
   are brand marks and stay as they are. */

export const shop = {
  hero: {
    eyebrow: "The official shop",
    lede: "Italian wine, personally selected: limited-edition boutique wines, created in direct collaboration with local families and oenologists. Free shipping on orders from €69.",
    ctaDiscover: "Discover now",
    ctaBundles: "Tasting sets",
    statWines: "Boutique wines",
    statRegions: "Regions of Italy",
    statDeliveryValue: "1–3",
    statDelivery: "Business days to delivery",
    /* the three trust chips beside the bottle stage */
    chipShipping: "Free shipping from €69",
    chipPayment: "Secure payment",
    chipPacking: "Carefully packaged",
  },

  usps: {
    delivery: "Shipping within 1–3 business days",
    packaging: "Break-proof & elegantly packaged",
    payment: "Secure payment",
    card: "Greeting card included on request",
  },

  bundles: {
    eyebrow: "Tasting sets",
    title: "Discover Italy",
    titleAccent: "by the bundle",
    description:
      "Curated bundles at a special price – the loveliest way to get to know Maria Maria. The large bundle ships free.",
  },

  assortment: {
    eyebrow: "The assortment",
    title: "The Maria Maria",
    titleAccent: "Selection",
    description:
      "Discover the whole Selection – corposo, elegante and fresco. Every bottle a personal choice.",
  },

  origins: {
    title: "Two souls,",
    titleAccent: "one name",
    paragraphs: [
      "Maria Maria begins in Salento, in the summer of 2019 – between childhood memories and old rows of vines, a moment became an epiphany: for us, wine is not a beverage but a catalyst for emotions.",
      "The name carries two women within it – the present and the origin. Every bottle joins both souls into a character of its own.",
    ],
    quote: "“Italian wine, personal selection, share the pleasure.”",
    craft: {
      amphora: {
        title: "Terracotta amphorae",
        text: "Ageing in the tradition of the craft – wine that matures in terracotta amphorae gains depth and character.",
      },
      direct: {
        title: "Direct collaboration",
        text: "No large-scale distribution: our wines are created together with local families and oenologists on site.",
      },
      limited: {
        title: "Limited editions",
        text: "Only 18,000 bottles of the Primitivo 14,5 exist, and just 12,000 of the Primitivo 15,5 – exclusivity that starts in the vineyard.",
      },
    },
  },

  gift: {
    badge: "Gift moments",
    eyebrow: "Gifting",
    title: "Wine says more than",
    titleAccent: "a thousand words",
    text: "Whether a thank-you, an invitation or a special occasion – a bottle of Maria Maria is a gift with origin and history. We take care of the rest.",
    photoAlt: "Elegantly wrapped wine bottle as a gift with a greeting card",
    points: [
      "Personal greeting card in your own words",
      "Elegant gift wrapping",
      "Shipping straight to the recipient",
    ],
    ctaPrimary: "Gift a bundle",
    ctaSecondary: "Get personal advice",
  },

  service: {
    eyebrow: "Good to know",
    title: "Order with ease",
    description: "Ordering with nothing left unanswered – shipping, payment and advice at a glance.",
    cards: {
      shipping: {
        title: "Shipping & delivery",
        text: "Your wines leave our warehouse carefully packaged and reach you within 1–3 business days – free shipping from €69.",
        link: "Questions about shipping",
      },
      payment: {
        title: "Secure payment",
        text: "Pay conveniently and securely – all common payment methods, SSL-encrypted, with no unnecessary steps.",
        link: "More in the FAQ",
      },
      advice: {
        title: "Personal advice",
        text: "Not sure which wine fits? We advise you personally – for your moment, your menu or your gift.",
        link: "Get in touch",
      },
    },
  },

  band: {
    eyebrow: "The sensory journey",
    title: "From Salento to",
    titleAccent: "Lake Garda",
    text: "Our Selection traces a journey through Italy – from the sunny south of Puglia through Campania up to the shores of Lake Garda.",
    primary: "Our wines",
    secondary: "Discover the regions",
  },

  faq: {
    eyebrow: "Frequently asked",
    title: "Questions about",
    titleAccent: "ordering.",
    description:
      "Shipping, payment, gifts and personal advice — everything that matters before checkout, answered briefly and reliably.",
    footerLabel: "Your question isn't here? Get in touch",
  },
};

export default shop;
