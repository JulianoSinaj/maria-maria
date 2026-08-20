/* Contact page — same shape as content/de/kontakt.js.

   German is the source language: the handoff fixes the final copy there,
   this is its translation. A key that appears in German has to appear here
   too — lib/i18n/dictionaries deliberately has no silent fallback, so a
   missing key leaves a visible gap rather than an invisible wrong text.

   The technical intent values (gastronomie_feinkost, event_feier …) are NOT
   translated. They live in components/kontakt/intents.js and stay identical
   across all four languages, because backend, lead routing and analytics
   hang off them. */

export const kontakt = {
  hero: {
    eyebrow: "Contact · Wine advice for Düsseldorf & NRW",
    title: "Wine for your moment.",
    titleSecond: "Personally selected.",
    text: "For restaurants, retail, events and special occasions. Get to know Maria Maria and find, together with us, the wines that suit your concept, your guests or your occasion.",
    ctaPrimary: "Request advice",
    ctaSecondary: "Arrange a tasting",
    promise: "A personal reply within 1–2 working days.",
    imageAlt: "Maria Maria Il Rosso and Il Bianco in 375 ml bottles on a laid table.",
  },

  details: {
    emailLabel: "Email",
    email: "info@maria-maria.de",
    locationLabel: "Location",
    location: "Mettmann, Germany",
  },

  intents: {
    title: "Why would you like to contact us?",
    intro: "Choose the occasion that best matches what you have in mind.",
    items: {
      gastronomie: {
        title: "Restaurants & delicatessen",
        text: "Would you like to offer Maria Maria in your restaurant, café, wine bar or delicatessen? Together we find a selection that suits your concept, your kitchen and your guests.",
        cta: "Restaurant enquiry",
      },
      handel: {
        title: "Retail & resale",
        text: "Would you like to add Maria Maria to your range? Talk to us about wine selection, quantities and the ways a personal partnership can work.",
        cta: "Partnership enquiry",
      },
      event: {
        title: "Events & special occasions",
        text: "From company events and conventions to weddings, birthdays and private celebrations: we advise you on the wines that suit the occasion, the menu and the number of guests.",
        cta: "Event wine enquiry",
      },
      verkostung: {
        title: "Tasting & individual selection",
        text: "Get to know Maria Maria in the glass. At a personal tasting you discover your favourites; afterwards we put together your individual selection with you.",
        cta: "Arrange a tasting",
      },
    },
  },

  process: {
    title: "This is how we find your wine",
    steps: [
      {
        title: "You tell us what you have in mind",
        text: "Restaurant, range, event, tasting or a special occasion: the better we know your plans, the more precisely we can advise you.",
      },
      {
        title: "We advise you personally",
        text: "We discuss your wishes and, if you like, arrange a tasting in Düsseldorf and the surrounding area so you can get to know the wines in person.",
      },
      {
        title: "We choose together",
        text: "From your favourites comes a selection that suits your concept, your guests, your menu or your occasion.",
      },
    ],
    closing: "From the first enquiry to the right selection, we accompany you personally.",
  },

  bridge: {
    title: "Wine accompanies the moments you remember.",
    text: "At dinner at home, at a restaurant table, at a company event or a special celebration: Maria Maria brings together people, pleasure and Italian wines with character.",
    claim: "Your selection. Your occasion. Our wines.",
    imageAlt: "Maria Maria wine on a laid table for dinner and special occasions.",
  },

  form: {
    title: "Tell us what you have in mind.",
    intro:
      "The more we know about your occasion, the better we can advise you. Choose your topic first — then we show only the fields that are genuinely relevant to your enquiry.",
    hints: [
      { title: "For events", text: "date, number of guests, type of event" },
      { title: "For restaurants/retail", text: "type of business, desired selection" },
    ],
    trust: "Personal. Honest. With a passion for wine.",

    intent: {
      label: "What is it about?",
      placeholder: "Please select",
      options: {
        gastronomie_feinkost: "Restaurants & delicatessen",
        handel_wiederverkauf: "Retail & resale",
        event_feier: "Event / celebration",
        verkostung: "Tasting",
        individuelle_auswahl: "Individual wine selection",
        sonstiges: "Something else",
      },
    },
    name: { label: "Name", placeholder: "Your name" },
    email: { label: "Email", placeholder: "your@email.com" },
    company: { label: "Company / venue", placeholder: "e.g. restaurant, hotel, retail" },
    city: { label: "Town / postcode", placeholder: "e.g. Düsseldorf, 40210" },
    phone: { label: "Phone (optional)", placeholder: "e.g. 0176 12345678" },
    message: { label: "Message", placeholder: "Briefly describe what you have in mind…" },

    conditional: {
      eventDate: { label: "Date / preferred date" },
      eventType: { label: "Type of event", placeholder: "e.g. company party, wedding, birthday" },
      guests: { label: "Approximate number of guests", placeholder: "e.g. 40" },
      location: { label: "Venue / place", placeholder: "e.g. Düsseldorf" },
      tastingDate: { label: "Preferred date" },
      persons: { label: "Number of people", placeholder: "e.g. 8" },
      occasion: {
        label: "Occasion",
        placeholder: "Please select",
        options: {
          privat: "Private",
          unternehmen: "Company / team",
          gastro: "Restaurant / retail",
          sonstiger: "Another occasion",
        },
      },
      businessTypeGastro: {
        label: "Type of business",
        placeholder: "Please select",
        options: {
          restaurant: "Restaurant",
          cafe: "Café",
          weinbar: "Wine bar",
          feinkost: "Delicatessen",
          sonstiges: "Other",
        },
      },
      businessTypeHandel: {
        label: "Type of business",
        placeholder: "Please select",
        options: {
          weinhandel: "Wine merchant",
          feinkost: "Delicatessen",
          fachhandel: "Specialist retail",
          sonstiges: "Other",
        },
      },
      selection: {
        label: "Interest / desired selection",
        placeholder: "e.g. reds from Puglia, tasting case",
      },
      context: { label: "Occasion / context", placeholder: "e.g. menu pairing, gift" },
      guestsOptional: { label: "Number of guests (optional)", placeholder: "e.g. 12" },
      style: {
        label: "Preferred style (optional)",
        placeholder: "e.g. full-bodied reds, fresh whites",
      },
    },

    privacyPre: "I have read the",
    privacyLink: "privacy policy",
    privacyPost: "and consent to my data being processed to handle my enquiry.",
    required: "required",
    submit: "Send enquiry",
    sending: "Sending…",

    errors: {
      intent: "Please choose what your enquiry is about.",
      name: "Please tell us your name.",
      email: "Please give us your email address.",
      emailInvalid: "Please give us a valid email address.",
      message: "Please describe briefly what you have in mind.",
      privacy: "Please accept the privacy policy.",
      send: "The enquiry could not be sent. Please try again.",
    },

    success: {
      title: "Thank you for your enquiry.",
      text: "We will get back to you personally within 1–2 working days.",
      again: "New enquiry",
    },
  },

  faq: {
    title: "Frequently asked questions",
    more: "See all questions",
    less: "Show fewer questions",
    imageAlt: "Maria Maria Il Rosso and Il Bianco in 375 ml bottles with serving details.",
    items: [
      {
        id: "kontakt-verkostung-buchen",
        q: "How do I book a wine tasting in Düsseldorf?",
        a: "Choose “Tasting” in the contact form and tell us your preferred date, the approximate number of people and the occasion. We agree place and format personally with you and come back within 1–2 working days with a proposal.",
      },
      {
        id: "kontakt-sortiment",
        q: "Can I add Maria Maria to my range?",
        a: "Yes. Choose “Retail & resale” and tell us briefly about your business, your location and the selection you have in mind. We then discuss the right next steps personally.",
        link: { label: "See the full range", href: "/unsere-weine" },
      },
      {
        id: "kontakt-firmenveranstaltungen",
        q: "Do you offer wines for company events?",
        a: "Yes. For company events, conventions and special occasions we advise you on the wine selection. Tell us the date, number of guests, place and the character of the event so we can discuss your enquiry precisely.",
      },
      {
        id: "kontakt-gastronomie",
        q: "Can I offer Maria Maria wines in my restaurant or delicatessen?",
        a: "Yes. Choose “Restaurants & delicatessen” and tell us briefly about your business, your kitchen or concept and your location. Together we find a selection that suits your guests.",
        link: { label: "Discover origin and food pairing", href: "/regionen" },
      },
      {
        id: "kontakt-individuelle-auswahl",
        q: "How does an individual wine selection work?",
        a: "First you tell us what you have in mind. If you like, you get to know the wines at a tasting. From your favourites comes a selection that suits your concept, your menu or your occasion.",
        link: { label: "All wines at a glance", href: "/unsere-weine" },
      },
      {
        id: "kontakt-kaufen",
        q: "Where can I buy Maria Maria wines?",
        a: "The wines can be ordered through the official Maria Maria shop. On the contact page the shop stays a secondary route, so that advice, event and B2B enquiries are not drawn away from the contact funnel.",
        link: { label: "To the shop", href: "/shop" },
      },
    ],
  },
};

export default kontakt;
