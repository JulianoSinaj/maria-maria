/* I text-overlay delle nove pagine dei vini.

   Ogni file rispecchia la struttura di components/weine/<slug>/wineData.js e
   contiene SOLO il testo tradotto; lib/i18n/winePages.js lo sovrappone alla
   base tedesca. Le chiavi assenti restano quelle della base — nomi dei vini,
   percorsi delle immagini, prezzi e colori non compaiono qui. */

import falanghina from "./falanghina";
import grecoDiTufo from "./greco-di-tufo";
import ilBianco from "./il-bianco-greco-cuvee";
import ilRosso from "./il-rosso-aglianico";
import lugana from "./lugana";
import primitivo145 from "./primitivo-14-5";
import primitivo155 from "./primitivo-15-5";
import primitivoSalento from "./primitivo-salento";
import rosatoPuglia from "./rosato-puglia";

const weinePages = {
  falanghina,
  "greco-di-tufo": grecoDiTufo,
  "il-bianco-greco-cuvee": ilBianco,
  "il-rosso-aglianico": ilRosso,
  lugana,
  "primitivo-14-5": primitivo145,
  "primitivo-15-5": primitivo155,
  "primitivo-salento": primitivoSalento,
  "rosato-puglia": rosatoPuglia,
};

export default weinePages;
