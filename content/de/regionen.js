/* Regionen-Seite /regionen — Hero, Regionsporträts, Terroir-Manifest,
   Shop-Band und FAQ-Rahmen. Die FAQ-Inhalte selbst liegen in faq.js
   (dict.faq.regionen), die Interview-Teaser in interviews.js.

   `regions` ist nach den festen Schlüsseln apulien / kampanien / garda
   gegliedert — dieselben Schlüssel, mit denen die Seite Anker, Bilder und
   Ziele hält. Verbindlich bleibt die Regionen-Guide (v1.0): Kampanien ohne
   Pauschal-Vesuv (Greco aus Irpinien), Lugana DOC zwischen Lombardei und
   Venetien, Primitivo „eine der prägendsten Rebsorten“ statt „autochthon“. */

export const regionen = {
  hero: {
    eyebrow: "Italienische Weinregionen",
    /* Einziges H1 der Seite, in zwei Zeilen gesetzt */
    title1: "Wo Italiens Weine",
    title2: "ihren Charakter finden",
    text: "Drei Herkunftsgebiete, unterschiedliche Landschaften und charaktervolle Rebsorten: Entdecken Sie, wie Apulien, Kampanien und das Lugana-Gebiet am Gardasee den Stil der ausgewählten Maria-Maria-Weine prägen.",
    /* Der Blätterhinweis: Frage + Aufforderung, der Pfeil bleibt im Code */
    question: "Warum schmeckt Apulien anders als der Gardasee?",
    questionCta: "Der Antwort folgen",
  },

  /* Sektionstitel über den drei Regionsporträts */
  intro: {
    eyebrow: "Drei Herkunftsgebiete",
    title: "Entdecken Sie unsere Regionen",
    description:
      "Apulien, Kampanien und Lugana am Gardasee – jede Herkunft mit eigenen Böden, Rebsorten und einem eigenen Stil im Glas.",
  },

  regions: {
    apulien: {
      name: "Apulien",
      tag: "Das Herz des Südens",
      alt: "Weinberge auf roter Erde in Apulien im warmen Abendlicht",
      label: "Weine aus Apulien",
      desc: "Sonne, rote Böden und die Nähe zum Meer prägen den Weinbau Apuliens. Besonders Primitivo, eine der prägendsten Rebsorten der Region, steht für reife Frucht, Wärme und einen ausdrucksstarken Charakter. Maria Maria zeigt ausgewählte Weine aus Apulien, die Herkunft und italienische Lebensart genussvoll verbinden.",
      cta: "Apuliens Weine entdecken",
    },
    kampanien: {
      name: "Kampanien",
      tag: "Höhenlagen und Küste",
      alt: "Terrassierte Weinberge an der Küste Kampaniens im Abendlicht",
      label: "Weine aus Kampanien",
      desc: "In den Höhenlagen Irpiniens und in weiteren traditionsreichen Anbaugebieten Kampaniens entstehen charaktervolle Weine aus Rebsorten wie Greco, Falanghina und Aglianico. Unterschiedliche Höhenlagen, kalk- und tonhaltige Böden sowie deutliche Temperaturunterschiede verleihen ihnen Frische, Mineralität und aromatische Tiefe.",
      cta: "Kampaniens Weißweine entdecken",
    },
    garda: {
      name: "Lugana am Gardasee",
      tag: "Zwischen Lombardei und Venetien",
      alt: "Weinberge und sanfte Hügel südlich des Gardasees",
      label: "Lugana am Gardasee",
      desc: "Südlich des Gardasees, zwischen Lombardei und Venetien, liegt das Anbaugebiet Lugana DOC. Die Rebsorte Turbiana und die tonreichen Böden prägen Weißweine mit Frische, feiner Mineralität und elegantem Charakter – ideal für Aperitivo, leichte Küche und besondere Genussmomente.",
      cta: "Lugana und seinen Charakter entdecken",
    },
  },

  /* Terroir-Manifest — Text der Client-Component, reist als Prop */
  manifest: {
    eyebrow: "Unser Maßstab",
    title: "Herkunft ist keine Angabe.",
    titleAccent: "Sie ist der Wein.",
    text: "Maria Maria sucht nicht nach Etiketten, sondern nach Orten, Menschen und Weinen mit einer klaren Handschrift.",
    pillars: [
      {
        title: "Ausgewählte Produzenten",
        text: "Persönliche Beziehungen und nachvollziehbare Herkunft statt anonymer Auswahl.",
      },
      {
        title: "Rebsorten mit regionalem Charakter",
        text: "Primitivo, Negroamaro, Greco, Falanghina, Aglianico und Turbiana im Kontext ihrer Herkunft.",
      },
      {
        title: "Orientierung für bewussten Genuss",
        text: "Geschmack, Anlass und Food Pairing helfen bei der Wahl des passenden Weins.",
      },
    ],
  },

  /* Shop-Band: Titel setzt die Seite als title + titleAccent (kursiv) +
     titleEnd zusammen — titleEnd darf je Sprache leer sein. */
  band: {
    eyebrow: "Die Kollektion",
    title: "Weine nach",
    titleAccent: "Region",
    titleEnd: "entdecken",
    text: "Vom kraftvollen Primitivo aus Apulien bis zum mineralischen Lugana vom Gardasee – finden Sie den Wein, dessen Herkunft Sie schmecken möchten.",
    primary: "Alle Maria-Maria-Weine entdecken",
    secondary: "Persönlich Kontakt aufnehmen",
  },

  /* Rahmen der Regionen-FAQ — die Fragen selbst kommen aus dict.faq.regionen */
  faq: {
    eyebrow: "Häufige Fragen",
    title: "Fragen zur",
    titleAccent: "Herkunft.",
    description:
      "Wählen Sie eine Region und finden Sie Antworten zu Gebieten, Rebsorten, Geschmack und Food Pairing – als Orientierung für die Wahl des passenden Weins.",
    footerLabel: "Food Pairings im Magazin entdecken",
  },
};

export default regionen;
