/* Pagina delle regioni /regionen. Stessa struttura di
   content/de/regionen.js. „Maria Maria", i vitigni (Primitivo, Greco,
   Turbiana …) e le denominazioni (Lugana DOC) restano invariati. */

export const regionen = {
  hero: {
    eyebrow: "Le regioni del vino d'Italia",
    /* Unico H1 della pagina, su due righe */
    title1: "Dove i vini d'Italia",
    title2: "trovano il loro carattere",
    text: "Tre zone d'origine, paesaggi diversi e vitigni di grande carattere: scopri come Puglia, Campania e l'area del Lugana sul Garda segnano lo stile dei vini selezionati Maria Maria.",
    /* L'invito a scorrere: domanda + esortazione, la freccia resta nel codice */
    question: "Perché la Puglia ha un gusto diverso dal Garda?",
    questionCta: "Vai alla risposta",
  },

  /* Titolo di sezione sopra i tre ritratti delle regioni */
  intro: {
    eyebrow: "Tre zone d'origine",
    title: "Scopri le nostre regioni",
    description:
      "Puglia, Campania e Lugana sul Garda – ogni origine con i propri suoli, i propri vitigni e uno stile tutto suo nel calice.",
  },

  regions: {
    apulien: {
      name: "Puglia",
      tag: "Il cuore del Sud",
      alt: "Vigneti su terra rossa in Puglia nella calda luce della sera",
      label: "Vini di Puglia",
      desc: "Sole, terre rosse e la vicinanza del mare plasmano la viticoltura pugliese. Il Primitivo, uno dei vitigni più rappresentativi della regione, è sinonimo di frutto maturo, calore e carattere espressivo. Maria Maria presenta una selezione di vini di Puglia che uniscono con gusto origine e arte di vivere italiana.",
      cta: "Scopri i vini di Puglia",
    },
    kampanien: {
      name: "Campania",
      tag: "Alture e costa",
      alt: "Vigneti terrazzati sulla costa della Campania nella luce della sera",
      label: "Vini di Campania",
      desc: "Sulle alture dell'Irpinia e in altre zone di grande tradizione della Campania nascono vini di carattere da vitigni come Greco, Falanghina e Aglianico. Le diverse altitudini, i suoli calcarei e argillosi e le forti escursioni termiche donano loro freschezza, mineralità e profondità aromatica.",
      cta: "Scopri i vini della Campania",
    },
    garda: {
      name: "Lugana sul Garda",
      tag: "Tra Lombardia e Veneto",
      alt: "Vigneti e dolci colline a sud del Lago di Garda",
      label: "Lugana sul Garda",
      desc: "A sud del Lago di Garda, tra Lombardia e Veneto, si estende la zona del Lugana DOC. Il vitigno Turbiana e i suoli ricchi di argilla danno vita a vini bianchi freschi, finemente minerali e di carattere elegante – ideali per l'aperitivo, la cucina leggera e le occasioni di piacere più speciali.",
      cta: "Scopri i vini del Garda",
    },
  },

  /* Manifesto del terroir — il testo della client component, passato come prop */
  manifest: {
    eyebrow: "Il nostro criterio",
    title: "L'origine non è un dato.",
    titleAccent: "È il vino.",
    text: "Maria Maria non cerca etichette, ma luoghi, persone e vini con una firma chiara.",
    pillars: [
      {
        title: "Produttori selezionati",
        text: "Relazioni personali e un'origine tracciabile invece di una selezione anonima.",
      },
      {
        title: "Vitigni dal carattere regionale",
        text: "Primitivo, Negroamaro, Greco, Falanghina, Aglianico e Turbiana nel contesto della loro origine.",
      },
      {
        title: "Una guida per il piacere consapevole",
        text: "Gusto, occasione e abbinamenti aiutano a scegliere il vino giusto.",
      },
    ],
  },

  /* Fascia shop: la pagina compone il titolo come title + titleAccent
     (corsivo) + titleEnd — titleEnd può restare vuoto nelle altre lingue. */
  band: {
    eyebrow: "La collezione",
    title: "Scopri i vini",
    titleAccent: "regione",
    titleEnd: "per regione",
    text: "Dal potente Primitivo di Puglia al Lugana minerale del Garda – trova il vino di cui vuoi assaporare l'origine.",
    primary: "Scopri tutti i vini Maria Maria",
    secondary: "Contattaci di persona",
  },

  /* Cornice delle FAQ sulle regioni — le domande vengono da dict.faq.regionen */
  faq: {
    eyebrow: "Domande frequenti",
    title: "Domande",
    titleAccent: "sull'origine.",
    description:
      "Scegli una regione e trova le risposte su zone, vitigni, gusto e abbinamenti – un orientamento per scegliere il vino giusto.",
    footerLabel: "Scopri gli abbinamenti nel magazine",
  },
};

export default regionen;
