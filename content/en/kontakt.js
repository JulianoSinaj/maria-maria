/* Contact page and contact form. Same shape as content/de/kontakt.js.
   `topics` are display labels for the fixed keys tasting / merchant / press /
   general — the tasting-only date and guest fields open off the key, never
   off the label. */

export const kontakt = {
  hero: {
    eyebrow: "We're here for you",
    title: "Contact",
    titleItalic: "Parliamo di vino.",
    text: "We look forward to hearing from you! Whether it's a tasting in Düsseldorf, questions about our wines, partnerships or trade enquiries – we're glad to help.",
    promiseLabel: "Our promise:",
    promise:
      "We reply to your enquiry within 1–2 working days. Personally, honestly and with a passion for wine.",
  },

  details: {
    email: "Email",
    phone: "Phone",
    address: "Address",
    addressValue: "Maria Maria Wines · Düsseldorf, Germany",
  },

  help: {
    eyebrow: "Your enquiry",
    title: "How can we help you?",
    description:
      "Four direct routes to us – simply pick the topic that matches your enquiry.",
    cta: "Send enquiry",
    items: {
      tasting: {
        title: "Tastings",
        text: "Would you like to taste our wines? Here's how it works.",
      },
      merchant: {
        title: "Trade enquiries",
        text: "Are you a retailer, or would you like to add our wines to your range?",
      },
      press: {
        title: "Press & partnerships",
        text: "We're open to press enquiries, partnerships and joint projects.",
      },
      general: {
        title: "General questions",
        text: "Do you have a general question about Maria Maria? We're happy to help.",
      },
    },
  },

  faq: {
    eyebrow: "Good to know",
    title: "Frequently asked",
    titleAccent: "questions.",
    description:
      "Answers to the questions we receive most often — sorted by topic: from tastings in Düsseldorf and trade enquiries through to the shop and shipping.",
    footer: "Question not covered? Write to us",
  },

  form: {
    title: "Write to us",
    name: { label: "Name", placeholder: "Your name" },
    email: { label: "Email", placeholder: "name@example.com" },
    subject: { label: "Subject", placeholder: "What is it about?" },
    topic: { label: "Enquiry type", placeholder: "Choose an enquiry type" },
    topics: {
      tasting: "Tasting enquiry",
      merchant: "Trade enquiry",
      press: "Press & partnerships",
      general: "General question",
    },
    date: { label: "Preferred date" },
    guests: {
      label: "Number of guests",
      placeholder: "Select guests",
      unit: "guests",
      options: ["2–4", "5–8", "9–12", "13–20", "More than 20"],
      note: "Our tastings take place in Düsseldorf and the surrounding area — private or for your team, at your place or in our tasting room.",
    },
    message: { label: "Message", placeholder: "Your message to us …" },
    privacyPre: "I have read the",
    privacyLink: "privacy policy",
    privacyPost: "and consent to the processing of my data.",
    submit: "Send message",
    sending: "Sending…",
    errors: {
      name: "Please enter your name.",
      email: "Please enter your email address.",
      emailInvalid: "Please enter a valid email address.",
      subject: "Please enter a subject.",
      topic: "Please choose an enquiry type.",
      date: "Please choose a preferred date.",
      guests: "Please give the number of guests.",
      message: "Please write us a short message.",
      privacy: "Please agree to the privacy policy.",
      send: "The message could not be sent. Please try again.",
    },
    success: {
      title: "Thank you for your message!",
      text: "We have received your enquiry and will get back to you personally within 1–2 working days.",
      again: "New message",
    },
  },
};

export default kontakt;
