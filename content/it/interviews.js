/* Le interviste — la lunga distanza redazionale del Magazine.

   Struttura e note di manutenzione: vedi content/de/interviews.js. Il tedesco
   è la lingua di partenza e la versione approvata dal handoff; questa fassung
   la traduce senza reinterpretarla.

   Lo slug resta identico in tutte e quattro le lingue — la lingua sta nel
   prefisso (/it/magazin/interviews/…), non nello slug, altrimenti il gruppo
   hreflang si spezzerebbe in quattro indirizzi scollegati.

   Le due citazioni sono vincolate all'approvazione di Daniele (handoff
   pagina 9): tradurle di nuovo richiede una nuova approvazione. */

const interviews = {
  section: {
    eyebrow: "Interviste · In dialogo",
    title: "Le persone dietro il vino",
    description:
      "Vignaioli, esperti di vino e persone dei territori raccontano origine, mestiere e ciò che davvero fa un vino.",
  },

  ui: {
    magazin: "Magazine",
    interviews: "Interviste",
    interview: "Intervista",
    editorial: "Redazione",
    aboutPerson: "L'intervistato",
    continueReading: "Continua a leggere",
    tasted: "Degustato nella conversazione",
    inThisConversation: "In questa conversazione",
  },

  items: [
    {
      slug: "daniele-malavasi-lugana-doc",
      draft: false,

      eyebrow: "Maria Maria × Lago di Garda · In dialogo",
      badge: "Lugana DOC · Turbiana · Pozzolengo",
      name: "Daniele Malavasi",
      headline: "Il Lugana nasce dal terroir, non dall'etichetta",
      deck: "Da Pozzolengo al Lago di Garda: Daniele Malavasi racconta come i suoli morenici, il clima mite del lago e la Turbiana plasmino il Lugana – e perché a tavola questo vino sa fare molto più dell'aperitivo.",

      seo: {
        title: "Daniele Malavasi: Lugana DOC e terroir del Garda",
        description:
          "Daniele Malavasi spiega come Turbiana, suoli morenici e clima del Lago di Garda plasmino il Lugana DOC – e perché è più di un aperitivo.",
      },

      byline: {
        interview: "Maria Pia Tolo",
        editorial: "Maria Maria",
        date: null,
        readingTime: "6 min di lettura",
      },

      portrait: {
        src: "/img/magazin/daniele-solo.jpeg",
        alt: "Daniele Malavasi con un calice di Lugana e il suo cane tra i filari del vigneto di Pozzolengo",
        position: "object-top",
      },

      intro: [
        "Certi vini non si capiscono solo attraverso un vitigno o un'etichetta. Si capiscono quando si conosce il luogo in cui nascono – e le persone che lì, ogni giorno, prendono decisioni. Per Daniele Malavasi la storia del Lugana non comincia quindi nel bicchiere, ma a Pozzolengo: nei suoli argillosi di origine morenica a sud del Lago di Garda, nella Turbiana e in un clima che concede al vino il tempo di sviluppare un carattere proprio.",
        "Daniele è titolare della Cantina Malavasi a Pozzolengo. Il suo sguardo unisce il lavoro quotidiano in vigna a un rapporto di lunga data con Maria Maria. Nel colloquio racconta perché la fiducia è il fondamento della collaborazione, perché l'autenticità conta più di qualsiasi moda e perché il Lugana andrebbe riscoperto come serio compagno di tavola.",
      ],

      sections: [
        {
          id: "vertrauen",
          heading: "Una collaborazione che nasce dalla fiducia",
          paragraphs: [
            "Ciò che ha convinto Daniele del progetto Maria Maria non è stata all'inizio un'idea di marketing, ma un legame cresciuto negli anni con Maria e Valerio. Da una fiducia personale è nata una collaborazione che, secondo lui, continua a evolversi per entrambe le parti.",
            "Di questa storia comune fa parte anche un ricordo molto personale: sua madre Ames. Accoglieva Maria e Valerio sempre con grande calore. Per Daniele quell'ospitalità è ancora oggi parte del legame – e la prova che il rapporto esisteva molto prima di questa intervista.",
            "Ma la vicinanza da sola non spiega la sua scelta. Decisivo è stato anche il modo in cui Maria Maria vuole raccontare il vino: non come prodotto isolato, ma come risultato di un contesto preciso.",
          ],
          quote:
            "Maria Maria non sceglie soltanto un prodotto, ma anche il contesto da cui nasce: il Lago di Garda, la Lugana e le persone che lì lavorano ogni giorno.",
          after: [
            "Così la scelta di un vino diventa una decisione consapevole per un luogo, un modo di lavorare e le persone che ci stanno dietro.",
          ],
        },
        {
          id: "authentizitaet",
          heading: "L'autenticità prima della moda",
          paragraphs: [
            "Tra i valori di Maria Maria Daniele ne riconosce soprattutto due: l'autenticità e una selezione con criteri chiari. Nel suo lavoro in cantina segue lo stesso principio. Poche decisioni consapevoli devono lasciare visibili vitigno e suolo, invece di farli sparire dietro un'immagine costruita.",
            "Per un progetto enologico che vuole avvicinare le regioni italiane a un pubblico tedesco, questo pensiero è centrale. L'autenticità non nasce da affermazioni romantiche sull'Italia, ma da una selezione verificabile: chi produce il vino? Dove crescono le uve? Quali caratteristiche vengono dal territorio – e quali decisioni ne definiscono lo stile?",
            "Daniele riassume questo atteggiamento in poche parole: il luogo deve parlare più chiaramente della tecnica di cantina.",
          ],
        },
        {
          id: "terroir",
          heading: "Che cosa rende il Lugana riconoscibile nel bicchiere",
          media: {
            src: "/img/magazin/interviews/terroir-pozzolengo.jpg",
            alt: "Vigneti presso Pozzolengo con vista sulle colline moreniche fino al Lago di Garda",
            caption:
              "I vigneti di Pozzolengo e lo sguardo che corre sulle colline moreniche fino al lago.",
          },
          paragraphs: [
            "Il territorio del Lugana si trova a sud del Lago di Garda, tra Lombardia e Veneto. Pozzolengo è uno dei comuni della denominazione di origine protetta. Per Daniele l'identità particolare del vino nasce dall'incontro tra suoli, lago e vitigno.",
            "I suoli argillosi sono di origine morenica e sono stati plasmati dalla storia geologica del territorio. Allo stesso tempo la vicinanza al lago influenza il clima. Daniele descrive il Garda come un accumulatore di calore: d'estate lo assorbe e lo restituisce in autunno e in inverno. Le forti escursioni termiche si attenuano e la fase di maturazione può allungarsi.",
            "Anche l'argilla svolge una funzione importante. Trattiene l'acqua e contribuisce, per esperienza di Daniele, alla struttura e a una tensione salina chiaramente percepibile nel vino. Posizione ed esposizione dei singoli vigneti influenzano a loro volta la finezza aromatica.",
            "Al centro c'è la Turbiana, il vitigno caratteristico del Lugana DOC. Nel bicchiere Daniele non cerca un effetto immediato, ma equilibrio: tra acidità e tensione salina, tra frutto pulito e un'impressione asciutta e precisa. Un Lugana convincente, per lui, non deve raccontare prima di tutto la tecnica di cantina, ma il suo territorio.",
          ],
          list: {
            label: "Come Daniele riconosce un Lugana convincente",
            items: [
              "Equilibrio tra acidità e tensione salina",
              "Frutto pulito senza dolcezza in primo piano",
              "Struttura data dai suoli argillosi di origine morenica",
              "Un vino che racconta il luogo invece della tecnica di cantina",
            ],
          },
        },
        {
          id: "mehr-als-aperitif",
          heading: "Più di un bianco fresco e senza pretese",
          media: {
            src: "/img/magazin/interviews/turbiana-trauben.jpg",
            alt: "Grappoli maturi di Turbiana sulla vite in un vigneto presso Pozzolengo",
            caption: "Turbiana — il vitigno caratteristico del Lugana DOC.",
          },
          paragraphs: [
            "Se il Lugana viene percepito solo come un bianco fresco e facile del Garda, per Daniele si resta a metà strada. Quella descrizione trascura proprio le caratteristiche che rendono il vino interessante: struttura, capacità di evolvere e una chiara identità territoriale.",
            "Lo presenterebbe quindi a un pubblico tedesco come un bianco capace di maturare e di svilupparsi. Non un qualsiasi vino da «easy drinking», ma un serio compagno di tavola – paragonabile per ambizione ai bianchi di carattere che molti bevitori tedeschi già apprezzano.",
            "Questa prospettiva cambia anche il momento del piacere. Il vino non deve restare confinato a terrazza, estate e aperitivo. La sua acidità, la struttura e la tensione salina gli aprono un posto stabile a tavola.",
          ],
          quote:
            "Il Lugana non è soltanto un vino da aperitivo. La sua struttura e la sua tensione salina reggono anche piatti più impegnativi.",
        },
      ],

      pairing: {
        heading: "Il Lugana a tavola: dal Lago di Garda alla cucina italiana",
        media: {
          src: "/img/magazin/interviews/lugana-risotto.jpg",
          alt: "Risotto cremoso con pesce di lago, limone ed erbe accanto a un calice di Lugana",
          /* Native Ratio des Fotos — zeigt das volle Bild statt des 16:9-Beschnitts. */
          aspect: "4/3",
        },
        paragraphs: [
          "Negli abbinamenti Daniele parte da dove parte anche il vino: dal Lago di Garda. Tra i suoi consigli ci sono i pesci d'acqua dolce del lago come il lavarello e le sardine essiccate, oltre a risotti dal tocco delicato.",
          "Allo stesso tempo il Lugana regge più peso di quanto molti si aspettino. Daniele cita il baccalà mantecato e le carni bianche con una salsa leggera. Ciò che conta non è il peso del piatto in sé, ma l'incontro tra consistenza, speziatura e freschezza salina del vino.",
          "Per Maria Maria questa indicazione vale molto: il food pairing non diventa così un ornamento del prodotto, ma una traduzione comprensibile del vino nella vita quotidiana. Chi sperimenta come un Lugana cambi accanto a un risotto, a un piatto di pesce o a una carne bianca ne coglie la versatilità più direttamente che attraverso i soli dati tecnici.",
        ],
        items: [
          {
            icon: "fish",
            title: "Pesce del Lago di Garda",
            text: "Lavarello e sardine essiccate.",
          },
          { icon: "risotto", title: "Risotto", text: "Risotti delicati e ben calibrati." },
          { icon: "stockfish", title: "Baccalà mantecato", text: "Stoccafisso mantecato cremoso." },
          { icon: "poultry", title: "Carni bianche", text: "Con una salsa leggera." },
        ],
      },

      serving: {
        heading: "L'errore più frequente: servirlo troppo freddo",
        paragraphs: [
          "Un Lugana può perdere molta della sua espressione se arriva nel bicchiere troppo freddo. Daniele lo definisce uno degli errori più frequenti nel servizio. Una temperatura troppo bassa appiattisce proprio le caratteristiche che dovrebbero definire il vino: la tensione salina, la freschezza dal tratto minerale e la finezza aromatica.",
          "Il secondo errore ne discende spesso direttamente: trattare il vino esclusivamente come aperitivo. Chi lo serve solo molto freddo e prima del pasto gli toglie l'occasione di mostrare la propria struttura accanto a piatti più complessi.",
          "Il consiglio non è quindi un numero rigido, ma un atteggiamento consapevole: servirlo fresco, ma non così freddo da restare chiuso. Nel bicchiere deve avere il tempo di aprirsi.",
        ],
      },

      outro: {
        heading: "Un luogo preciso – non un bianco qualsiasi",
        paragraphs: [
          "Che cosa dovrebbe portarsi via il pubblico di Maria Maria dopo questo colloquio? Per Daniele soprattutto una consapevolezza: dietro un Lugana c'è un territorio definito con precisione. Non è un bianco generico del Nord Italia, ma l'espressione di un incontro tra Turbiana, suoli di matrice morenica, clima del lago e lavoro quotidiano.",
          "Vale quindi la pena avvicinarsi al Lugana con la stessa curiosità che si riserva ai grandi bianchi europei. Non perché ogni Lugana debba essere uguale, ma proprio perché origine, vigneto e decisioni possono rendere visibili le differenze.",
          "Anche il suo ruolo futuro in Maria Maria, Daniele lo intende in questo senso. Vuole portare lo sguardo di un produttore che vive il territorio ogni giorno – e che perciò può parlare non soltanto di vino, ma anche delle persone e delle decisioni che gli stanno dietro.",
          "Per Maria Maria il cerchio si chiude così: l'etichetta rende un vino riconoscibile. Il suo significato nasce però dove suolo, clima, vitigno e persone si incontrano.",
        ],
      },

      profile: {
        name: "Daniele Malavasi",
        role: "Titolare della Cantina Malavasi, Pozzolengo",
        worksFor: "Cantina Malavasi",
        text: "La cantina si trova nel territorio del Lugana, con vigneti tra Pozzolengo e Desenzano del Garda.",
        link: { label: "Cantina Malavasi", href: "https://www.malavasivini.com/it/azienda" },
      },

      wine: {
        slug: "lugana",
        photo: {
          src: "/img/magazin/interviews/lugana-vino-bianco-magazine-cutout.png",
          alt: "Bottiglia di Lugana DOC di Maria Maria",
        },
        heading: "Scopri il Lugana DOC di Maria Maria",
        text: "Scopri il Lugana DOC di Maria Maria – vinificato da Daniele Malavasi a Pozzolengo. Un vino che tiene in equilibrio origine, vitigno e artigianalità.",
        cta: "Vai al Lugana",
      },

      paths: [
        {
          id: "region",
          icon: "region",
          title: "Regione Lago di Garda",
          text: "Scopri il terroir.",
          href: "/regionen#garda",
        },
        {
          id: "pairing",
          icon: "pairing",
          title: "Food Pairing",
          text: "Ispirazioni per la tavola.",
          href: "/magazin#food-pairing",
        },
        {
          id: "interviews",
          icon: "interviews",
          title: "Altre interviste",
          text: "Leggi tutte le conversazioni.",
          href: "/magazin#interviste",
        },
      ],

      teaserMagazin: {
        eyebrow: "Interviste · In dialogo",
        badge: "Lugana DOC · Pozzolengo",
        title: "Il Lugana nasce dal terroir, non dall'etichetta",
        teaser:
          "Turbiana, suoli argillosi di origine morenica e il clima del Lago di Garda – e il motivo per cui a tavola il Lugana sa fare più dell'aperitivo.",
        meta: "Intervista · 6 min di lettura",
        cta: "Leggi la conversazione",
      },

      teaserRegion: {
        region: "garda",
        portrait: { src: "/img/daniele222.jpeg" },
        eyebrow: "Voci dal territorio · Lugana DOC",
        title: "Il Lugana raccontato da chi lo vive",
        paragraphs: [
          "Cosa rende così speciale questo bianco del Garda? Daniele Malavasi racconta i suoli morenici, la Turbiana, il clima del lago — e il Lugana che dalla sua cantina è arrivato nella collezione Maria Maria.",
        ],
        pull: "Il vino deve raccontare il luogo più della tecnica di cantina.",
        ctaPrimary: "Leggi la conversazione",
        ctaSecondary: "Scopri il Lugana",
      },
    },

    {
      slug: "francesco-de-stefano-irpinien-weissweine",
      draft: false,

      /* Lo slug resta quello tedesco anche qui. La master source (pagina 11)
         indica per l'italiano un percorso tradotto
         (/it/magazin/interviste/…-irpinia-vini-bianchi): sarebbe un secondo
         schema di indirizzi accanto a quello di tutte le altre pagine, dove
         la lingua sta nel prefisso e mai nello slug. */

      eyebrow: "Maria Maria × Campania · In dialogo",
      badge: "Greco di Tufo DOCG · Fiano di Avellino DOCG · Falanghina",
      name: "Francesco De Stefano",
      headline: "Tre bianchi, tre caratteri – cosa rende speciale l’Irpinia",
      deck: "Dalle alture dell’Irpinia alla tavola: Francesco De Stefano racconta Greco di Tufo, Fiano di Avellino e Falanghina e spiega perché origine, carattere e abbinamento devono essere considerati insieme quando si sceglie un vino.",

      ghost: "Irpinia",

      seo: {
        title: "Francesco De Stefano: Irpinia e vini bianchi campani",
        description:
          "Greco di Tufo, Fiano di Avellino e Falanghina: Francesco De Stefano racconta l’Irpinia, gli abbinamenti e come scegliere un bianco campano.",
      },

      byline: {
        interview: "Maria Pia Tolo",
        editorial: "Maria Maria",
        date: null,
        readingTime: "6 min di lettura",
      },

      portrait: {
        src: "/img/magazin/interviews/francesco-de-stefano.jpg",
        alt: "Francesco De Stefano versa un vino bianco di Maria Maria in un calice nella luce della sera",
        position: "object-top",
      },

      intro: [
        "Per capire davvero un vino non basta guardare il vitigno. Origine, stile, servizio e piatto cambiano il modo in cui lo percepiamo. Per Francesco De Stefano è proprio questa scelta consapevole a fare la differenza.",
        "Nell’intervista con Maria Maria ci accompagna in Campania e soprattutto in Irpinia. Al centro della conversazione ci sono Greco di Tufo, Fiano di Avellino e Falanghina: tre bianchi con caratteri e momenti di consumo differenti.",
      ],

      sections: [
        {
          id: "gemeinsame-werte",
          heading: "Una collaborazione che nasce da valori condivisi",
          paragraphs: [
            "A convincere Francesco del progetto Maria Maria sono state innanzitutto le persone. Indica la dedizione al progetto, la serietà dimostrata da Valerio e Maria e la loro competenza come i motivi principali che lo hanno portato ad accompagnare il progetto.",
            "A questi elementi si aggiunge una visione condivisa: la stessa passione e la stessa ricerca della qualità che, nelle parole di Francesco, caratterizzano anche il suo lavoro.",
          ],
          quote:
            "Quello che mi ha colpito maggiormente è stata la dedizione al progetto e la serietà dimostrata da Valerio e Maria.",
        },
        {
          id: "irpinien",
          heading: "Irpinia: tre DOCG in una sola provincia",
          paragraphs: [
            "Per Francesco la Campania è da sempre un territorio simbolo della viticoltura italiana e, in particolare, del Sud. Ricorda una tradizione che risale già all’epoca romana e pone l’attenzione soprattutto sull’Irpinia.",
            "Il fatto che questa provincia possa vantare tre DOCG rappresenta per lui un segnale importante dell’autenticità e della vocazione vinicola del territorio. A queste si aggiunge l’Aglianico del Taburno, DOCG del territorio beneventano.",
          ],
        },
        {
          id: "hoehe-und-klima",
          heading: "Cosa cambiano clima e altitudine nel bicchiere",
          /* MEDIA MANCANTE: il capitolo corrispondente dell’intervista con
             Daniele porta una fotografia di paesaggio. Per l’Irpinia non è
             ancora disponibile. */
          paragraphs: [
            "Francesco lega il carattere dei vini soprattutto a clima e altitudine. Secondo la sua spiegazione, questi fattori contribuiscono a una maggiore acidità e permettono di ottenere vini con più struttura e un carattere più deciso.",
            "È un passaggio utile anche per chi associa automaticamente il Sud Italia a vini morbidi e immediati.",
          ],
        },
        {
          id: "drei-charaktere",
          heading: "Greco, Fiano e Falanghina: tre caratteri diversi",
          paragraphs: [
            "Per Francesco Greco di Tufo, Fiano di Avellino e Falanghina non sono tre varianti intercambiabili. Del Greco sottolinea una componente minerale più marcata.",
            "Il Fiano è più morbido e versatile ed è il vino che consiglierebbe a chi scopre per la prima volta questi bianchi. La Falanghina presenta, nel confronto proposto da Francesco, una tendenza più secca e trova un momento naturale anche nell’aperitivo.",
          ],
          list: {
            label: "Come Francesco distingue i tre vini",
            items: [
              "Greco di Tufo — nel confronto, la componente minerale più marcata",
              "Fiano di Avellino — più morbido e versatile, la sua proposta per iniziare",
              "Falanghina — tendenza più secca, con un momento naturale nell’aperitivo",
            ],
          },
        },
      ],

      pairing: {
        heading: "I bianchi campani a tavola",
        /* MEDIA MANCANTE — vedi il capitolo su clima e altitudine. */
        paragraphs: [
          "Il Fiano di Avellino lo accompagnerebbe a un piatto di pesce non troppo impegnativo, per esempio gamberi o trota.",
          "Il Greco di Tufo può accompagnare piatti di pesce leggermente più elaborati o carni bianche. Francesco sottolinea in modo particolare l’abbinamento tra Greco di Tufo e mozzarella di bufala.",
          "La Falanghina la vede bene anche per l’aperitivo, per esempio con una frisella e pomodorini San Marzano.",
        ],
        items: [
          { icon: "fish", title: "Fiano di Avellino", text: "Con gamberi o trota." },
          {
            icon: "stockfish",
            title: "Greco di Tufo",
            text: "Con piatti di pesce più elaborati e carni bianche.",
          },
          {
            icon: "plate",
            title: "Mozzarella di bufala",
            text: "L’abbinamento che Francesco sottolinea in modo particolare.",
          },
          {
            icon: "glasses",
            title: "Falanghina per l’aperitivo",
            text: "Per esempio con una frisella e pomodorini San Marzano.",
          },
        ],
      },

      serving: {
        heading: "L’errore più comune comincia dalla temperatura",
        paragraphs: [
          "Uno degli errori più frequenti, secondo Francesco, riguarda già il servizio. Un bianco può essere servito troppo freddo oppure troppo caldo. Nell’intervista non indica una temperatura precisa.",
          "Anche nell’abbinamento è importante non trattare Greco, Fiano e Falanghina come vini equivalenti.",
        ],
      },

      outro: {
        heading: "Perché la scelta di un vino non è mai banale",
        paragraphs: [
          "Alla fine Francesco riporta tutto a un principio semplice: la scelta di un vino non è mai banale. Origine, caratteristiche del vino, piatto e servizio devono essere considerati insieme.",
          "Nel futuro di Maria Maria spera che la sua esperienza possa completare e valorizzare la competenza di Valerio e Maria e contribuire a migliorare ulteriormente il progetto.",
        ],
        quote: "La scelta di un vino non è mai banale.",
      },

      faq: {
        eyebrow: "Domande frequenti",
        title: "I bianchi campani —",
        titleAccent: "in breve.",
        description:
          "Da dove iniziare, che cosa cambia tra i tre vini, come abbinarli e perché la temperatura conta: le cinque domande che restano più spesso aperte dopo questa conversazione.",
        items: [
          {
            id: "francesco-einsteiger",
            q: "Quale bianco campano scegliere per iniziare?",
            a: "Francesco consiglierebbe il Fiano: più morbido e versatile del Greco di Tufo e con una tendenza meno secca rispetto alla Falanghina.",
          },
          {
            id: "francesco-unterschied",
            q: "Che differenza c’è tra Greco di Tufo, Fiano e Falanghina?",
            a: "Francesco evidenzia maggiore mineralità nel Greco, maggiore morbidezza e versatilità nel Fiano e una tendenza più secca nella Falanghina.",
          },
          {
            id: "francesco-greco-pairing",
            q: "Cosa abbinare al Greco di Tufo?",
            a: "Piatti di pesce più elaborati, carni bianche e soprattutto mozzarella di bufala.",
          },
          {
            id: "francesco-fisch",
            q: "Quale bianco campano scegliere con il pesce?",
            a: "Fiano per piatti più leggeri come gamberi o trota; Greco di Tufo anche per preparazioni più strutturate.",
          },
          {
            id: "francesco-temperatur",
            q: "Perché la temperatura di servizio è importante?",
            a: "Una temperatura troppo bassa o troppo alta è per Francesco uno degli errori più comuni. Non indica una gradazione precisa.",
          },
        ],
      },

      profile: {
        name: "Francesco De Stefano",
        /* APERTO: la master source lascia la qualifica «solo dopo conferma».
           Finché manca, il campo resta fuori — l'articolo salta la riga e il
           nodo Person non porta jobTitle. */
        text: "Francesco accompagna Maria Maria con la propria esperienza e conoscenza del mondo del vino campano.",
      },

      wine: {
        slug: "greco-di-tufo",
        href: "/unsere-weine?region=kampanien",
        heading: "Scopri i bianchi campani selezionati da Maria Maria",
        text: "Greco di Tufo, Fiano di Avellino e Falanghina — i bianchi campani della collezione, ognuno con il carattere di cui Francesco racconta nell’intervista.",
        cta: "Scopri i vini campani",
      },

      paths: [
        {
          id: "region",
          icon: "region",
          title: "Regione Campania",
          text: "Scopri il terroir.",
          href: "/regionen#kampanien",
        },
        {
          id: "pairing",
          icon: "pairing",
          title: "Food Pairing",
          text: "Ispirazioni per la tavola.",
          href: "/magazin#food-pairing",
        },
        {
          id: "interviews",
          icon: "interviews",
          title: "Altre interviste",
          text: "Leggi tutte le conversazioni.",
          href: "/magazin#interviste",
        },
      ],

      teaserMagazin: {
        eyebrow: "Interviste · In dialogo",
        badge: "Irpinia · Campania",
        title: "Tre bianchi, tre caratteri: cosa rende speciale l’Irpinia",
        teaser:
          "Greco di Tufo, Fiano di Avellino e Falanghina: una conversazione su origine, abbinamenti e scelta consapevole del vino.",
        meta: "Intervista · 6 min di lettura",
        cta: "Leggi l’intervista",
      },

      teaserRegion: {
        region: "kampanien",
        portrait: { src: "/img/magazin/interviews/francesco-de-stefano.jpg" },
        eyebrow: "Voci dal territorio · Irpinia",
        title: "Persone autentiche raccontano la Campania",
        paragraphs: [
          "Che cosa rende così diversi i bianchi della Campania? Francesco De Stefano racconta l’Irpinia, il Greco di Tufo, il Fiano di Avellino e la Falanghina, spiegando perché origine, carattere e giusto abbinamento devono essere considerati insieme quando si sceglie un vino.",
        ],
        pull: "La scelta di un vino non è mai banale.",
        ctaPrimary: "Leggi l’intervista",
        ctaSecondary: "Scopri il Greco di Tufo",
      },
    },
  ],
};

export default interviews;
