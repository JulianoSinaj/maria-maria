/* Contact page — same shape as content/de/kontakt.js (source: contact
   handoff of 18 Aug 2026). The intent keys (gastronomie_feinkost,
   handel_wiederverkauf, event_feier, verkostung, individuelle_auswahl,
   sonstiges) are stable across languages — they feed the backend, analytics
   and lead routing. Only the labels change. */

export const kontakt = {
  hero: {
    eyebrow: "Contact · Wine advice for Düsseldorf & NRW",
    title: "Wine for your moment.",
    titleAccent: "Personally selected.",
    text: "For restaurants, retail, events and special occasions. Get to know Maria Maria and let us find, together with you, the wines that suit your concept, your guests or your occasion.",
    primaryCta: "Request advice",
    secondaryCta: "Arrange a tasting",
    trust: "Personal reply within 1–2 working days.",
    imageAlt: "Maria Maria Il Rosso and Il Bianco in 375 ml bottles on a laid table.",
  },

  details: {
    email: "Email",
    phone: "Phone",
    location: "Location",
    locationValue: "Mettmann, Germany",
  },

  intents: {
    title: "Why would you like to contact us?",
    intro: "Choose the occasion that best fits what you have in mind.",
    items: {
      gastronomie_feinkost: {
        title: "Restaurants & fine food",
        text: "Would you like to offer Maria Maria in your restaurant, café, wine bar or delicatessen? Together we will find a selection that suits your concept, your kitchen and your guests.",
        cta: "Enquire for your restaurant",
      },
      handel_wiederverkauf: {
        title: "Trade & resale",
        text: "Would you like to add Maria Maria to your range? Talk to us about wine selection, quantities and the possibilities of a personal partnership.",
        cta: "Request a partnership",
      },
      event_feier: {
        title: "Events & special occasions",
        text: "From corporate events and conventions to weddings, birthdays and private celebrations: we advise you on the wines that suit the occasion, the menu and the number of guests.",
        cta: "Request event wines",
      },
      verkostung: {
        title: "Tasting & individual selection",
        text: "Get to know Maria Maria in the glass. At a personal tasting you discover your favourites; afterwards we put together your individual wine selection with you.",
        cta: "Arrange a tasting",
      },
    },
  },

  process: {
    title: "Finding your wine is this simple",
    steps: [
      {
        title: "You tell us about your plans",
        text: "Restaurant, range, event, tasting or special occasion: the better we know your plans, the more precisely we can advise you.",
      },
      {
        title: "We advise you personally",
        text: "We discuss your wishes and, if you like, organise a tasting in and around Düsseldorf so you can get to know the wines in person.",
      },
      {
        title: "We choose together",
        text: "From your favourites grows a selection that suits your concept, your guests, your menu or your occasion.",
      },
    ],
    closing: "From the first enquiry to the right wine selection, we accompany you personally.",
  },

  bridge: {
    title: "Wine accompanies the moments you remember.",
    text: "At dinner at home, at the restaurant table, at a corporate event or a special celebration: Maria Maria brings people, pleasure and characterful Italian wines together.",
    tagline: "Your selection. Your occasion. Our wines.",
    imageAlt: "Maria Maria wine on a laid table for dinners and special occasions.",
  },

  form: {
    title: "Tell us about your plans.",
    intro: "The more we know about your occasion, the better we can advise you. Choose your topic first – we then only show the fields that really matter for your enquiry.",
    hints: {
      event: { label: "For an event:", text: "date, number of guests, type of event" },
      trade: { label: "For restaurants/trade:", text: "type of business, desired selection" },
    },
    trust: "Personal. Honest. With a passion for wine.",
    optional: "optional",

    intent: { label: "What is it about?", placeholder: "Please select" },
    intents: {
      gastronomie_feinkost: "Restaurants & fine food",
      handel_wiederverkauf: "Trade & resale",
      event_feier: "Event / celebration",
      verkostung: "Tasting",
      individuelle_auswahl: "Individual wine selection",
      sonstiges: "Other",
    },
    name: { label: "Name", placeholder: "Your name" },
    email: { label: "Email", placeholder: "your@email.com" },
    companyLocation: {
      label: "Company / venue",
      placeholder: "e.g. restaurant, hotel, retailer, event venue",
    },
    postalCity: { label: "Town / postcode", placeholder: "e.g. Düsseldorf, 40210" },
    phone: { label: "Phone", placeholder: "Optional" },
    message: { label: "Message", placeholder: "Briefly describe your plans…" },

    details: {
      event_feier: {
        eventDate: { label: "Date / preferred date" },
        eventType: { label: "Type of event", placeholder: "e.g. company party, wedding, birthday" },
        guests: { label: "Approximate number of guests", placeholder: "e.g. 40" },
        location: { label: "Venue / place", placeholder: "e.g. Düsseldorf, event venue" },
      },
      gastronomie_feinkost: {
        businessType: {
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
        interest: {
          label: "Interest / desired selection",
          placeholder: "e.g. wine list, wines by the glass, seasonal selection",
        },
      },
      handel_wiederverkauf: {
        businessType: {
          label: "Type of business",
          placeholder: "Please select",
          options: {
            weinhandel: "Wine merchant",
            feinkost: "Delicatessen",
            fachhandel: "Specialist retailer",
            sonstiges: "Other",
          },
        },
        interest: {
          label: "Interest / desired selection",
          placeholder: "e.g. range, individual wines, tasting packages",
        },
      },
      verkostung: {
        date: { label: "Preferred date" },
        persons: { label: "Number of people", placeholder: "e.g. 8" },
        occasion: {
          label: "Occasion",
          placeholder: "Please select",
          options: {
            privat: "private",
            unternehmen: "company/team",
            gastronomie_handel: "restaurant/trade",
            sonstiger: "other occasion",
          },
        },
      },
      individuelle_auswahl: {
        context: { label: "Occasion / context", placeholder: "e.g. dinner with guests, gift, wine list" },
        guests: { label: "Number of guests", placeholder: "e.g. 12" },
        style: { label: "Preferred style", placeholder: "e.g. fresh & light, full-bodied, rosé" },
      },
    },

    privacyPre: "I have read the",
    privacyLink: "privacy policy",
    privacyPost: "and consent to the processing of my data in order to handle my enquiry.",
    submit: "Send enquiry",
    sending: "Sending…",
    errors: {
      intent: "Please choose what your enquiry is about.",
      name: "Please enter your name.",
      email: "Please enter your email address.",
      emailInvalid: "Please enter a valid email address.",
      message: "Please briefly describe your plans.",
      privacy: "Please agree to the privacy policy.",
      send: "The enquiry could not be sent. Please try again or write to us directly by email.",
    },
    success: {
      title: "Thank you for your enquiry.",
      text: "We will get back to you personally within 1–2 working days.",
      again: "Send another enquiry",
    },
  },

  faq: {
    title: "Frequently asked questions",
    showAll: "See all questions",
    showLess: "Show fewer questions",
    imageAlt:
      "Three Maria Maria wines – Falanghina, Primitivo di Manduria and Greco di Tufo – with glasses and a notepad on a table: wine advice for restaurants and trade.",
  },
};

export default kontakt;
