/* Deutsches Wörterbuch — die Ausgangssprache.

   Alle vier Sprachverzeichnisse haben denselben Aufbau. Kommt ein Abschnitt
   dazu, gehört er in alle vier; fehlt er in einer, greift der Fallback in
   lib/i18n/dictionaries nicht — dort gibt es bewusst keinen stillen Rückfall
   auf Deutsch, weil ein fehlender Schlüssel sonst monatelang unbemerkt bliebe.
   Sichtbar leerer Text ist besser als unsichtbar falscher.

   Geladen wird ausschließlich serverseitig über getDictionary(locale). */

import common from "./common";
import meta from "./meta";
import legal from "./legal";
import kontakt from "./kontakt";
import interviews from "./interviews";
import home from "./home";
import faq from "./faq";
import weine from "./weine";

const dictionary = { common, meta, legal, kontakt, interviews, home, faq, weine };

export default dictionary;
