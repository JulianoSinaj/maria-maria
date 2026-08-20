/* Vedi content/de/faq.js — stessa struttura in tutte e quattro le lingue.
   Gli `id` e i percorsi dei link NON si traducono: portano i deep link e la
   faq_id in GA4. */

export const faq = {
  home: [
    {
      id: "home-was-ist",
      q: "Che cos'è Maria Maria?",
      a: "Maria Maria significa vini boutique italiani curati personalmente. L'assortimento selezionato unisce origine autentica, vitigni di carattere e arte di vivere italiana – per chi sceglie e gusta il vino con consapevolezza, a casa come in sala.",
    },
    {
      id: "home-sortiment",
      q: "Quali vini propone Maria Maria?",
      a: "L'assortimento comprende nove vini selezionati – bianchi, rosati e rossi – dalla Campania, dalla Puglia e dalla zona del Lago di Garda. Tra questi Lugana, Falanghina, Greco di Tufo, Aglianico e diversi Primitivo.",
      link: { label: "Scopri tutti i vini", href: "/unsere-weine" },
    },
    {
      id: "home-anlass",
      q: "Quale vino Maria Maria è adatto alla mia occasione?",
      a: "Aperitivo, cena, abbinamento, evento o regalo di gusto: nelle schede dei singoli vini trovi gusto, carattere, temperatura di servizio e piatti consigliati. Per una domanda personale ti aiutiamo volentieri nella scelta.",
      link: { label: "Trova il vino giusto", href: "/unsere-weine" },
    },
    {
      id: "home-partner",
      q: "Maria Maria collabora con ristorazione, hospitality e partner lifestyle?",
      a: "Sì. Maria Maria si rivolge anche a partner selezionati di ristorazione, hospitality, eventi, retail e lifestyle che desiderano integrare vini boutique italiani nel proprio concept. Richieste e possibili collaborazioni le discutiamo di persona.",
      link: { label: "Scopri Maria Maria come partner", href: "/kontakt#kontakt-sortiment" },
    },
    {
      id: "home-kontakt",
      q: "Come posso contattare Maria Maria?",
      a: "Usa il nostro modulo di contatto per qualsiasi domanda sui vini, su una collaborazione o su un'occasione speciale. Ti rispondiamo personalmente.",
      link: { label: "Contattaci", href: "/kontakt" },
    },
  ],

  weine: [
    {
      id: "weine-wahl-farbe",
      q: "Come scelgo tra rosso, bianco e rosato?",
      a: "Segui il momento, non la regola: rossi di struttura come il Primitivo per una cucina decisa e le serate lunghe, bianchi freschi come Lugana, Greco o Falanghina con il pesce, la cucina leggera e per l'aperitivo — e il rosato quando tutto deve restare leggero e mediterraneo.",
      link: { label: "Vai alla collezione", href: "#kollektion" },
    },
    {
      id: "weine-anlass",
      q: "Quale vino per quale occasione?",
      a: "Per l'aperitivo: Rosato Puglia, Falanghina o Il Bianco, ben freschi. Per la cena: Lugana o Greco di Tufo con il pesce — Primitivo o Il Rosso con le carni e i primi saporiti. Per le belle conversazioni tra amici: il vino di cui vuoi raccontare la storia.",
    },
    {
      id: "weine-geschenk",
      q: "Quale vino è adatto come regalo?",
      a: "Per gli intenditori: il Primitivo 15,5 affinato in anfora di terracotta o il Greco di Tufo con la D.O.C.G. Per chi comincia: la Falanghina, accessibile, o il Primitivo Salento IGP. E una scelta sicura è una confezione degustazione – confezionata con eleganza e, su richiesta, con biglietto d'auguri.",
      link: { label: "Vai alle confezioni degustazione", href: "/shop#pakete" },
    },
    {
      id: "weine-essen",
      q: "Come trovo il vino giusto per un piatto?",
      a: "Conta la preparazione, non solo l'ingrediente — con la pasta, per esempio, decide il sugo: le preparazioni delicate chiedono bianchi freschi, i ragù intensi un rosso strutturato. Su ogni scheda vino trovi i consigli tratti dalla scheda tecnica.",
      link: { label: "Gli abbinamenti nel magazine", href: "/magazin" },
    },
  ],

  regionen: [
    {
      key: "apulien",
      label: "Puglia",
      items: [
        {
          id: "reg-apulien-weine",
          q: "Che cosa definisce il carattere dei vini pugliesi?",
          a: "Molto sole, temperature calde, suoli rossi e calcarei e la vicinanza al mare caratterizzano molti vini della Puglia. A seconda del vitigno e dell'affinamento nascono vini fruttati, speziati e potenti, che possono però risultare molto diversi tra loro.",
          link: { label: "Vedi i vini della Puglia", href: "/unsere-weine?region=apulien" },
        },
        {
          id: "reg-apulien-primitivo",
          q: "Che cos'è il Primitivo e che gusto ha?",
          a: "Il Primitivo è uno dei vitigni più caratterizzanti della Puglia. Tipici sono gli aromi di frutta scura matura, una speziatura calda e un corpo pieno. Stile e grado di dolcezza cambiano però secondo l'origine e la vinificazione.",
          link: { label: "Scopri il Primitivo di Manduria", href: "/unsere-weine/primitivo-14-5" },
        },
        {
          id: "reg-apulien-salento",
          q: "Che cosa significa Salento IGP?",
          a: "Salento IGP è un'indicazione geografica protetta per i vini della parte meridionale della Puglia. Indica l'origine, non automaticamente un gusto preciso o un singolo vitigno.",
          link: { label: "Vai al Primitivo Salento IGP", href: "/unsere-weine/primitivo-salento" },
        },
        {
          id: "reg-apulien-pairing",
          q: "Con quali piatti si abbinano i rossi pugliesi?",
          a: "I rossi pugliesi di struttura si abbinano spesso a brasati, carni alla griglia, paste saporite e formaggi stagionati. Contano intensità, condimento e preparazione del piatto; il consiglio preciso lo trovi sulla scheda del singolo vino.",
          link: { label: "Il Primitivo 15,5 e i suoi abbinamenti", href: "/unsere-weine/primitivo-15-5" },
        },
      ],
    },
    {
      key: "kampanien",
      label: "Campania",
      items: [
        {
          id: "reg-kampanien-rebsorten",
          q: "Che cosa rende speciale la Campania come regione del vino?",
          a: "La Campania riunisce zone di produzione, altitudini e suoli molto diversi. In Irpinia nascono tra gli altri Greco di Tufo e Aglianico, mentre la Falanghina ha un ruolo importante anche nel Beneventano. Questa varietà dà caratteri molto differenti.",
          link: { label: "Vedi i vini della Campania", href: "/unsere-weine?region=kampanien" },
        },
        {
          id: "reg-kampanien-greco",
          q: "Che differenza c'è tra Greco di Tufo e Falanghina?",
          a: "Il Greco di Tufo risulta spesso più strutturato, minerale e intenso. La Falanghina si mostra più fresca, profumata e accessibile. Lo stile preciso dipende sempre da origine, annata e affinamento.",
          link: { label: "Scopri il Greco di Tufo", href: "/unsere-weine/greco-di-tufo" },
        },
        {
          id: "reg-kampanien-falanghina",
          q: "Da dove viene la Falanghina?",
          a: "La Falanghina è tra i vitigni più antichi della Campania ed è particolarmente diffusa nel Beneventano. La nostra Falanghina cresce lì, sulle colline — fresca, profumata e mediterranea nell'espressione.",
          link: { label: "Scopri la Falanghina", href: "/unsere-weine/falanghina" },
        },
        {
          id: "reg-kampanien-aglianico",
          q: "Che cos'è l'Aglianico e che stile ha «Il Rosso»?",
          a: "L'Aglianico è un importante vitigno rosso del Sud Italia. «Il Rosso» di Maria Maria è 100 % Aglianico – non un uvaggio – e rappresenta uno stile di rosso di carattere, con struttura e profondità speziata.",
          link: { label: "Scopri Il Rosso", href: "/unsere-weine/il-rosso-aglianico" },
        },
      ],
    },
    {
      key: "garda",
      label: "Lugana sul Lago di Garda",
      items: [
        {
          id: "reg-garda-gebiet",
          q: "Dove si trova la zona del Lugana?",
          a: "La zona del Lugana si trova sulla sponda meridionale del Lago di Garda e si estende su parti della Lombardia e del Veneto. Della zona DOC delimitata fanno parte territori nelle province di Brescia e Verona. Pozzolengo è uno dei luoghi in cui i suoli morenici argillosi e l'influsso del lago si sentono maggiormente.",
        },
        {
          id: "reg-garda-turbiana",
          q: "Quale vitigno caratterizza il Lugana DOC?",
          a: "Il vitigno principale del Lugana DOC è la Turbiana, localmente chiamata anche Trebbiano di Lugana. Secondo il disciplinare, il Lugana DOC deve essere composto per almeno il 90 per cento da Turbiana; altri vitigni bianchi non aromatici ammessi possono raggiungere insieme al massimo il 10 per cento. Nella percezione del vino la Turbiana resta chiaramente al centro.",
          link: { label: "Vai al Lugana", href: "/unsere-weine/lugana" },
        },
        {
          id: "reg-garda-geschmack",
          q: "Che gusto ha il Lugana?",
          a: "Il Lugana si presenta spesso fresco, elegante e finemente minerale, con note di agrumi, fiori bianchi e, a seconda dello stile, anche di frutta a polpa più matura. Età, affinamento e annata influenzano il profilo.",
        },
        {
          id: "reg-garda-aperitif",
          q: "Perché il Lugana è più di un vino da aperitivo?",
          a: "Il Lugana viene spesso percepito come un bianco fresco da aperitivo. Daniele Malavasi ne sottolinea però la struttura, la sapidità e il potenziale evolutivo. Sono proprio queste qualità a renderlo un bianco gastronomicamente versatile, capace di accompagnare l'intero menu e non solo di aprirlo.",
          link: {
            label: "Leggi la conversazione con Daniele Malavasi",
            href: "/magazin/interviews/daniele-malavasi-lugana-doc",
          },
        },
        {
          id: "reg-garda-mm",
          q: "Con quali piatti si abbina il Lugana?",
          a: "Con il Lugana funzionano il pesce di lago, il risotto, il baccalà mantecato e le carni bianche con salse leggere. Più che una regola rigida conta l'equilibrio tra freschezza, sapidità e consistenza del piatto.",
          link: { label: "Scopri gli abbinamenti nel magazine", href: "/magazin#food-pairing" },
        },
        {
          id: "reg-garda-temperatur",
          q: "Perché il Lugana non andrebbe servito troppo freddo?",
          a: "Se il Lugana viene servito troppo freddo, si percepiscono meno proprio le qualità che ne definiscono l'identità: sapidità, mineralità e finezza aromatica. Per questo non dovrebbe arrivare ghiacciato nel calice. La temperatura esatta dipende dallo stile e dal consiglio del produttore.",
        },
      ],
    },
  ],

  magazin: [
    {
      id: "wissen-temperatur",
      q: "Qual è la temperatura di servizio ideale?",
      a: "Come regola pratica dalle nostre schede tecniche: il Lugana a 8–10 °C, Greco e Falanghina intorno ai 10 °C, il Rosato a 12–14 °C, i rossi di struttura come Primitivo e Il Rosso a 16–18 °C. Nel dubbio, meglio servire un po' più freddo — nel calice il vino si scalda da solo.",
    },
    {
      id: "wissen-dekantieren",
      q: "Il Primitivo va decantato?",
      a: "No, non è obbligatorio. I rossi giovani e strutturati traggono però beneficio da un po' d'aria prima del servizio — il consiglio preciso della scheda tecnica lo trovi sulla pagina del singolo vino.",
      link: { label: "Il servizio del Primitivo 15,5", href: "/unsere-weine/primitivo-15-5" },
    },
    {
      id: "wissen-glas",
      q: "Quale calice per quale vino?",
      a: "I rossi di struttura amano un calice ampio con molto spazio per l'aria, i bianchi un calice più slanciato che concentra la freschezza. Per i bianchi aromatici come la cuvée di Greco vale la pena un calice da bianco più panciuto — è lì che il bouquet si apre meglio.",
    },
    {
      id: "wissen-lagerung",
      q: "Come si conserva correttamente il vino?",
      a: "Al fresco, al buio e senza vibrazioni — ideali sono temperature costanti senza forti sbalzi, le bottiglie con tappo di sughero coricate. I nostri vini sono pensati per essere goduti: i consigli di servizio sono su ogni scheda vino, nel capitolo «Il gusto».",
    },
    {
      id: "wissen-docg",
      q: "Che differenza c'è tra DOC, DOCG e IGP?",
      a: "Sono tre livelli del sistema italiano delle denominazioni: l'IGP (indicazione geografica protetta) è la più ampia, la DOC ovvero DOP (denominazione di origine protetta) è più stretta, la DOCG è il livello più alto — controllata e garantita. Nella nostra collezione si va dal Salento IGP al Greco di Tufo DOCG.",
      link: { label: "Scopri la collezione per origine", href: "/unsere-weine" },
    },
    {
      id: "wissen-rebsorten",
      q: "Quali vitigni italiani vale la pena conoscere?",
      a: "Dalla nostra collezione: Primitivo e Negroamaro dalla Puglia, Aglianico dal Sud, i bianchi Falanghina e Greco dalla Campania e la Turbiana dal Lago di Garda. Ogni scheda vino presenta il suo vitigno con origine e carattere.",
      link: { label: "Scopri i vitigni della collezione", href: "/unsere-weine" },
    },
  ],

  geschichte: [
    {
      key: "hospitality",
      label: "Ristorazione indipendente",
      items: [
        {
          id: "b2b-konzept",
          q: "Quali vini italiani sono adatti a un piccolo format gastronomico?",
          a: "Una selezione piccola e curata dalla nostra collezione: un bianco fresco come Falanghina o Lugana, il Rosato Puglia per l'aperitivo e un Primitivo o Il Rosso per la cucina di carattere. Quali vini si adattano alla tua cucina, alla tua fascia di prezzo e al servizio al calice lo definiamo insieme, di persona — proponiamo solo ciò che è davvero a catalogo.",
          link: { label: "Invia una richiesta per la ristorazione", href: "/kontakt#kontakt-gastronomie" },
        },
        {
          id: "b2b-einstieg",
          q: "Posso iniziare con una piccola selezione curata?",
          a: "Partire con poche referenze scelte con cura è la via che consigliamo: due bianchi, un rosato, due rossi — e la carta cresce con i tuoi ospiti. Da quale volume e a quali condizioni sia possibile partire lo discutiamo di persona; dipende dal locale e dalla selezione.",
          link: { label: "Raccontaci del tuo locale", href: "/kontakt#kontakt-gastronomie" },
        },
        {
          id: "b2b-aperitivo",
          q: "Quali vini sono adatti all'aperitivo e al servizio al calice?",
          a: "I vini freschi della collezione: il Rosato Puglia, la Falanghina, Il Bianco e il Lugana — serviti ben freddi, semplici da proporre al calice e con abbinamenti reali dall'aperitivo al pesce. Quali formati e quantità sono disponibili per la tua mescita lo chiariamo a voce.",
          link: { label: "L'aperitivo negli abbinamenti", href: "/magazin#food-pairing" },
        },
        {
          id: "b2b-beratung",
          q: "Come può Maria Maria aiutarmi a scegliere per il mio locale?",
          a: "Di persona, in tre passi: ci racconti del tuo locale, della tua cucina e dei tuoi ospiti. Ti consigliamo e, se lo desideri, organizziamo una degustazione a Düsseldorf e dintorni. Dai tuoi preferiti nasce la selezione per la tua carta — il primo riscontro arriva entro 1–2 giorni lavorativi.",
          link: { label: "Come funziona la selezione personalizzata", href: "/kontakt#kontakt-individuelle-auswahl" },
        },
      ],
    },
    {
      key: "premium",
      label: "Alta ristorazione & hotellerie",
      items: [
        {
          id: "b2b-speisekarte",
          q: "Quali vini Maria Maria si abbinano al nostro menu?",
          a: "Preferiamo rispondere partendo dalla tua carta: inviaci menu e stile di servizio e ti proporremo vini con abbinamenti verificati dalle schede tecniche. Una prima idea la danno il selettore per occasione nel magazine e i consigli su ogni scheda vino.",
          link: { label: "Scopri gli abbinamenti per occasione", href: "/magazin#food-pairing" },
        },
        {
          id: "b2b-belieferung",
          q: "Maria Maria rifornisce ristoranti, enoteche e boutique hotel?",
          a: "Sì — Maria Maria collabora con partner selezionati della ristorazione, del commercio specializzato e dell'hospitality che vogliono integrare vini boutique italiani nel proprio concept. Consulenza e degustazioni le offriamo a Düsseldorf e nel Nordreno-Vestfalia; area di consegna, ritmo e quantità li definiamo di persona per ogni attività, perché la nostra produzione è volutamente limitata.",
          link: { label: "Richiedi una partnership", href: "/kontakt#kontakt-sortiment" },
        },
        {
          id: "b2b-herkunft",
          q: "Sono disponibili informazioni su origine e produttori per il personale di sala?",
          a: "Sì. Ogni scheda vino riporta vitigno, origine, affinamento e temperatura di servizio, la pagina delle regioni racconta cosa caratterizza Puglia, Campania e Lago di Garda, e nelle interviste del magazine parlano i produttori stessi — materiale con cui la tua sala consiglia con sicurezza al tavolo. Ulteriori materiali o una formazione per il tuo team li concordiamo di persona.",
          link: { label: "Le regioni e i loro vini", href: "/regionen" },
        },
        {
          id: "b2b-konditionen",
          q: "Quali condizioni si applicano a ristorazione e commercio specializzato?",
          a: "Condizioni, quantità e scaglioni li discutiamo di persona — calibrati sulla tua attività, sulla tua selezione e sul tuo fabbisogno, non come listino. Raccontaci in breve della tua attività e della selezione che desideri; ti rispondiamo entro 1–2 giorni lavorativi con tutti i dettagli.",
          link: { label: "Invia una richiesta commerciale", href: "/kontakt#kontakt-sortiment" },
        },
      ],
    },
    {
      key: "partner",
      label: "Eventi, retail & partner",
      items: [
        {
          id: "b2b-events",
          q: "Quali vini sono adatti a eventi aziendali o occasioni speciali?",
          a: "Dipende da occasione, menu e numero di ospiti: per il ricevimento i bianchi freschi e il Rosato, per la cena Lugana o Greco di Tufo con il pesce, Primitivo o Il Rosso con la carne. Indicaci data, numero di ospiti, luogo e carattere dell'evento — quantità e logistica le chiariamo su questa base, di persona.",
          link: { label: "Richiedi i vini per il tuo evento", href: "/kontakt#kontakt-firmenveranstaltungen" },
        },
        {
          id: "b2b-geschenke",
          q: "Sono disponibili confezioni regalo o presentazioni personalizzate?",
          a: "Sì. Confezione regalo elegante e biglietto personale sono disponibili direttamente nello shop — per singole bottiglie come per le confezioni degustazione curate. Per quantità maggiori o una presentazione personalizzata per i tuoi clienti business parlane con noi: possibilità, tempi e quantità li chiariamo di persona.",
          link: { label: "Il regalo nello shop", href: "/shop#shop-geschenk" },
        },
        {
          id: "b2b-weinkonzept",
          q: "Maria Maria può creare un concept vino per un'attivazione?",
          a: "Un concept vino per un'attivazione, un progetto di brand o una serie di eventi parte da noi con un briefing: obiettivo, formato, numero di ospiti e tempi. Su questa base chiariamo insieme quali vini, quale portata e quali servizi abbiano senso — e chi si occupa di cosa. Descrivici in breve la tua idea.",
          link: { label: "Raccontaci la tua idea", href: "/kontakt" },
        },
        {
          id: "b2b-verkostung",
          q: "È possibile organizzare una degustazione prima di collaborare?",
          a: "Sì. Conosci Maria Maria nel calice prima di decidere: in una degustazione personale a Düsseldorf e dintorni scopri i tuoi preferiti, da cui nasce poi la tua selezione. Luogo, formato e data li concordiamo con te — ricevi una proposta entro 1–2 giorni lavorativi.",
          link: { label: "Prenota una degustazione", href: "/kontakt#kontakt-verkostung-buchen" },
        },
      ],
    },
  ],

  shop: [
    {
      id: "shop-kaufen",
      q: "Dove posso acquistare i vini Maria Maria?",
      a: "Direttamente qui, nello shop ufficiale online — con tutto l'assortimento e le confezioni degustazione a prezzo vantaggioso. Ti consigliamo volentieri di persona nella scelta per il tuo momento, il tuo menu o il tuo regalo.",
    },
    {
      id: "shop-versand",
      q: "Quanto è veloce la consegna — e quanto costa la spedizione?",
      a: "I vini arrivano in 1–3 giorni lavorativi, imballati in modo antiurto ed elegante. Da 69 € di spesa la spedizione è gratuita.",
    },
    {
      id: "shop-international",
      q: "Spedite anche all'estero?",
      a: "Sì — oltre alla Germania consegniamo in Paesi europei selezionati. Costi e tempi dipendono dal Paese di destinazione e vengono indicati in modo trasparente durante l'ordine. Se serve, verifichiamo volentieri in anticipo se serviamo il tuo Paese — scrivici.",
    },
    {
      id: "shop-bezahlung",
      q: "Come posso pagare nello shop?",
      a: "In modo comodo e sicuro: accettiamo tutti i metodi di pagamento più diffusi — con crittografia SSL e senza passaggi inutili. Le opzioni disponibili sono indicate in modo trasparente durante l'ordine.",
    },
    {
      id: "shop-geschenk",
      q: "Posso far spedire il vino come regalo?",
      a: "Sì — con biglietto personale, confezione regalo elegante e spedizione direttamente a chi lo riceve. Basta indicare le tue richieste al momento dell'ordine.",
    },
    {
      id: "shop-beratung",
      q: "Chi mi aiuta con l'ordine o con la scelta del vino?",
      a: "Noi, di persona: tramite il modulo di contatto o per e-mail ti consigliamo su menu, occasione o regalo — e ti aiutiamo anche per qualsiasi domanda sul tuo ordine. Rispondiamo entro 1–2 giorni lavorativi.",
      link: { label: "Contattaci", href: "/kontakt" },
    },
  ],

  kontakt: [
    {
      key: "allgemein",
      label: "Domande generali",
      items: [
        {
          id: "kontakt-erreichen",
          q: "Come posso contattare Maria Maria?",
          a: "Il modo più rapido è il modulo di contatto — basta scegliere il motivo della richiesta. In alternativa ci trovi via e-mail a info@maria-maria.de. Rispondiamo entro 1–2 giorni lavorativi.",
        },
        {
          id: "kontakt-weininfo",
          q: "Dove trovo le informazioni sui vini?",
          a: "Ogni vino ha una pagina dedicata con profilo gustativo, origine, dati tecnici, abbinamenti e domande frequenti — dal Primitivo al Lugana.",
          link: { label: "Vai ai nostri vini", href: "/unsere-weine" },
        },
      ],
    },
    {
      key: "verkostungen",
      label: "Degustazioni",
      items: [
        {
          id: "kontakt-verkostung-buchen",
          q: "Come posso prenotare una degustazione a Düsseldorf?",
          a: "Nel modulo di contatto scegli «Richiesta di degustazione» — potrai indicare direttamente la data desiderata e il numero di ospiti. Ti rispondiamo entro 1–2 giorni lavorativi con una proposta personale.",
        },
        {
          id: "kontakt-verkostung-ort",
          q: "Dove si svolgono le degustazioni?",
          a: "A Düsseldorf e dintorni. Luogo e formato li concordiamo personalmente con te — raccontaci semplicemente la tua occasione nel modulo.",
        },
        {
          id: "kontakt-verkostung-privat",
          q: "Posso prenotare una degustazione privata?",
          a: "Sì — le degustazioni private sono possibili quanto quelle aziendali. Indica nel modulo la data desiderata e il numero di ospiti; ti rispondiamo con una proposta personale.",
        },
        {
          id: "kontakt-verkostung-corporate",
          q: "Maria Maria propone degustazioni aziendali?",
          a: "Sì, per occasioni aziendali e team. Raccontaci brevemente l'occasione e la dimensione del gruppo — prepariamo una proposta su misura e rispondiamo entro 1–2 giorni lavorativi.",
        },
        {
          id: "kontakt-verkostung-kaufen",
          q: "Posso acquistare i vini degustati?",
          a: "Sì — tutti i vini della collezione sono nello shop ufficiale online. Dopo la degustazione ti consigliamo volentieri di persona sui tuoi preferiti.",
          link: { label: "Vai allo shop ufficiale", href: "/shop" },
        },
      ],
    },
    {
      key: "haendler",
      label: "Rivenditori",
      items: [
        {
          id: "kontakt-haendler",
          q: "Come inserisco i vini Maria Maria nel mio assortimento?",
          a: "Scegli nel modulo «Richiesta rivenditori» e raccontaci brevemente del tuo negozio o del tuo locale e della tua zona. Ti rispondiamo personalmente con tutti i dettagli.",
        },
        {
          id: "kontakt-haendler-finden",
          q: "Posso trovare i vini nel commercio locale?",
          a: "I nostri vini sono disponibili presso enoteche selezionate e nella ristorazione. Poiché la produzione è limitata, su richiesta ti indichiamo volentieri un partner vicino a te.",
        },
      ],
    },
    {
      key: "presse",
      label: "Stampa e collaborazioni",
      items: [
        {
          id: "kontakt-presse",
          q: "A chi rivolgo le richieste stampa?",
          a: "Direttamente a noi: tramite il modulo di contatto (motivo «Stampa e collaborazioni») o via e-mail a info@maria-maria.de. Ti rispondiamo personalmente.",
        },
        {
          id: "kontakt-kooperationen",
          q: "Maria Maria è aperta a collaborazioni?",
          a: "Sì — siamo aperti a collaborazioni e progetti comuni. Descrivici brevemente la tua idea; rispondiamo entro 1–2 giorni lavorativi.",
        },
      ],
    },
    {
      key: "shop",
      label: "Shop e spedizione",
      items: [
        {
          id: "kontakt-kaufen",
          q: "Dove posso acquistare i vini?",
          a: "Nello shop ufficiale online di Maria Maria. Tutti i dettagli su assortimento, confezioni degustazione e ordine sono nelle domande frequenti dello shop.",
          link: { label: "Vai alle domande dello shop", href: "/shop#fragen" },
        },
        {
          id: "kontakt-versand",
          q: "Offrite la spedizione internazionale?",
          a: "Sì — oltre alla Germania consegniamo in Paesi europei selezionati. Tutti i dettagli su tempi e costi sono nelle domande frequenti dello shop e durante l'ordine.",
          link: { label: "Vai alle domande dello shop", href: "/shop#fragen" },
        },
      ],
    },
  ],
};

export default faq;
